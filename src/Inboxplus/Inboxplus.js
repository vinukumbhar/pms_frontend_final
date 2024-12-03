import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Container, Divider, Typography, Button, TextField, List, ListItem } from '@mui/material'; // Add ListItem here
import { gapi } from 'gapi-script';
import Cookies from 'js-cookie';



const CLIENT_ID = "1070770223600-nkocmga9ensmg3aaip15rhp0vpjlugd1.apps.googleusercontent.com";
const API_KEY = "AIzaSyDR042NieiN9Lbz13KAxTTl5ShVW4Ln4yM";
const SCOPES = "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'left',
  color: theme.palette.text.secondary,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
}));

export default function Chat() {

  const emailId = Cookies.get('emailId'); // Retrieve email from cookies
  const accessToken = Cookies.get('accessToken');
  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const options = ['Tasks', 'Email Template', 'Jobs', 'Pipelines', 'Folder', 'Chats', 'Invoice', 'Proposals & Els', 'Organisers'];

  const [replyText, setReplyText] = useState(''); // Define state for reply text

  const [currentTab, setCurrentTab] = useState('inbox'); // 'inbox' or 'outbox'
  const [sentEmails, setSentEmails] = useState([]); // Store sent emails

  const [attachments, setAttachments] = useState([]);

  const fetchEmails = useCallback(() => {
    setLoading(true);
    gapi.client.setToken({ access_token: accessToken });

    gapi.client.gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      maxResults: 10,
    }).then(response => {
      const { messages } = response.result;
      if (!messages) {
        setEmails([]);
        setLoading(false);
        return;
      }

      const emailPromises = messages.map(message => {
        return gapi.client.gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        }).then(emailResponse => emailResponse.result);
      });

      Promise.all(emailPromises).then(emailData => {
        const processedEmails = emailData.map(email => {
          let body = '';
          let attachments = [];

          // Function to recursively extract body and attachments from parts
          const extractParts = (parts) => {
            parts.forEach(part => {
              // Check for text or HTML parts
              if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
                body = cleanString(decodeAndStripHTML(part.body.data));
              }

              // Check for nested multipart types
              if (part.mimeType === 'multipart/alternative' || part.mimeType === 'multipart/mixed') {
                extractParts(part.parts); // Recursive call to handle nested parts
              }

              // Check for attachments
              if (part.filename && part.body.attachmentId) {
                attachments.push({
                  filename: part.filename,
                  id: part.body.attachmentId,
                });
              }
            });
          };

          // Start extracting parts from the email payload
          if (email.payload.parts) {
            extractParts(email.payload.parts);
          } else if (email.payload.body) {
            // Handle single part email case
            body = cleanString(decodeAndStripHTML(email.payload.body.data));
          }

          return {
            id: email.id,
            from: email.payload.headers.find(header => header.name === 'From')?.value,
            subject: email.payload.headers.find(header => header.name === 'Subject')?.value,
            body: body || 'No content available.', // Fallback if body is empty
            attachments: attachments,
          };
        });

        setEmails(processedEmails);
        console.log("Processed Emails:", processedEmails);
        setLoading(false);
      }).catch(error => {
        console.error("Error fetching individual emails:", error);
        setLoading(false);
      });

    }).catch(error => {
      console.error("Error fetching emails from inbox:", error);
      setLoading(false);
    });
  }, [accessToken]);


  const fetchSentEmails = useCallback(() => {
    setLoading(true);
    gapi.client.setToken({ access_token: accessToken });

    gapi.client.gmail.users.messages.list({
      userId: 'me',
      labelIds: ['SENT'],
      maxResults: 20,
    }).then(response => {
      const { messages } = response.result;
      if (!messages) {
        setSentEmails([]); // Assuming you have a state for sent emails
        setLoading(false);
        return;
      }

      const emailPromises = messages.map(message => {
        return gapi.client.gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        }).then(emailResponse => emailResponse.result);
      });

      // Inside the fetchSentEmails function
      Promise.all(emailPromises).then(emailData => {
        const processedEmails = emailData.map(email => {
          let body = '';
          let attachments = []; // Initialize attachments array

          // Check if the email has parts
          if (email.payload.parts) {
            email.payload.parts.forEach(part => {
              // Check for text or HTML body
              if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
                body = cleanString(decodeAndStripHTML(part.body.data)); // Clean after decoding
              }

              // Check for attachments
              if (part.filename && part.body.attachmentId) {
                attachments.push({
                  filename: part.filename,
                  id: part.body.attachmentId,
                });
              }
            });
          } else if (email.payload.body) {
            // Handle single part emails
            body = cleanString(decodeAndStripHTML(email.payload.body.data)); // Clean after decoding
          }

          return {
            id: email.id,
            from: email.payload.headers.find(header => header.name === 'From')?.value,
            to: email.payload.headers.find(header => header.name === 'To')?.value,
            subject: email.payload.headers.find(header => header.name === 'Subject')?.value,
            body: body,
            attachments: attachments, // Add attachments to the email object
          };
        });

        setSentEmails(processedEmails);
        console.log("Processed Sent Emails:", processedEmails); // Log processed sent emails for debugging
        setLoading(false);
      }).catch(error => {
        console.error("Error fetching individual sent emails:", error);
        setLoading(false);
      });

    }).catch(error => {
      console.error("Error fetching sent emails:", error);
      setLoading(false);
    });
  }, [accessToken]);


  const downloadAttachment = (attachmentId, filename) => {
    gapi.client.gmail.users.messages.attachments.get({
      userId: 'me',
      id: attachmentId,
      messageId: currentEmail.id,
    })
      .then(response => {
        if (response && response.result) {
          const base64Data = response.result.data; // Ensure this is the correct path to your data.

          if (!base64Data) {
            console.error("No data found in response:", response);
            return;
          }

          // Convert base64url to standard base64
          const base64 = base64Data.replace(/-/g, '+').replace(/_/g, '/');

          // Decode the base64 string
          const binaryString = window.atob(base64);
          const binaryLen = binaryString.length;
          const bytes = new Uint8Array(binaryLen);
          for (let i = 0; i < binaryLen; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const blob = new Blob([bytes], { type: 'application/octet-stream' }); // Adjust the type as necessary
          const url = URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } else {
          console.error("Invalid response:", response);
        }
      })
      .catch(error => {
        console.error("Error downloading attachment:", error);
      });
  };

  // Load emails when the component mounts
  useEffect(() => {
    // Load GAPI client
    const initGapiClient = async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
          scope: SCOPES,
        });

        const token = Cookies.get('accessToken'); // Retrieve access token from cookies
        if (token) {
          gapi.client.setToken({
            access_token: token,
          });
          // fetchEmails(); // Fetch emails after setting the token
          if (currentTab === 'inbox') {
            fetchEmails();
          } else {
            fetchSentEmails(); // Fetch sent emails when in 'outbox' tab
          }
        }
      } catch (error) {
        console.error("Error initializing GAPI:", error);
      }
    };

    // Load the GAPI client library
    gapi.load("client:auth2", initGapiClient);
  }, [currentTab]);




  function parseEmailBody(emailBody, fromEmail, toEmail) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = emailBody;

    const messages = [];
    const emailBlocks = Array.from(tempDiv.querySelectorAll('div[dir="ltr"], blockquote, div:not([dir])'));
    let lastMessage = '';
    let replyCount = emailBlocks.length;

    emailBlocks.forEach((block, index) => {
      let messageText = block.innerText.replace(/\u00A0/g, ' ').trim();
      const emailPattern = new RegExp(fromEmail, 'g');
      messageText = messageText.replace(emailPattern, '').trim();

      const replyMatch = messageText.match(/On\s(.+?)\s(wrote:|at|<.*>)/i);

      if (replyMatch && messageText !== lastMessage) {
        const replyContext = messageText.split(replyMatch[0])[0].trim();

        if (replyContext) {
          messages.push({
            text: `Reply ${replyCount}\n${fromEmail}`,
            from: fromEmail,
            to: toEmail,
            isReply: true,
          });
          lastMessage = replyContext;
          replyCount--;
        }
      } else if (messageText !== lastMessage && messageText) {
        messages.push({
          text: `${messageText}\n${fromEmail}`,
          from: fromEmail,
          to: toEmail,
          isReply: false,
        });
        lastMessage = messageText;
      }
    });

    return messages;
  }


  function parseSentEmailBody(emailBody, fromEmail, toEmail) {
    const messages = [];
    if (!emailBody) {
      console.warn("No email body provided to parse.");
      return messages; // Return an empty array if there's no body
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = emailBody; // Use emailBody instead of body

    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    const cleanTextContent = textContent.replace(/On\s.+?at\s.+?\s<[^>]+>\s+wrote:/, '').trim();

    messages.push({
      text: `${cleanTextContent}\n${fromEmail}` // Include the sender's email address
    });

    return messages;
  }

  // Decode email body from base64
  const decodeAndStripHTML = (data) => {
    const decodedData = atob(data.replace(/-/g, '+').replace(/_/g, '/'));
    return cleanString(decodedData); // Clean the decoded string
  };

  // Function to remove unwanted characters
  const cleanString = (str) => {
    return str.replace(/\u00C2/g, '').trim(); // Remove instances of Â and trim whitespace
  };

  // Handle selecting an email to show the body
  const handleEmailClick = useCallback((email) => {
    console.log("Email clicked:", email); // Log the clicked email

    setCurrentEmail(email);

    // Mark email as read
    setEmails(prevEmails =>
      prevEmails.map(e =>
        e.id === email.id ? { ...e, isRead: true } : e // Set isRead to true for the clicked email
      )
    );
  }, []);


  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setAttachments(files);
  };


  const handleReply = async () => {
    if (!replyText || !currentEmail) return;

    const toEmailMatch = currentEmail.from.match(/<(.+)>/);
    const toEmail = toEmailMatch ? toEmailMatch[1] : currentEmail.from;
    const subject = `Re: ${currentEmail.subject}`;
    const fromEmail = emailId;

    if (!toEmail || !fromEmail) {
      console.error("Sender or recipient email is missing");
      return;
    }

    // Create MIME message with attachments
    const boundary = "my_boundary_string";
    let emailContent = `From: ${fromEmail}\nTo: ${toEmail}\nSubject: ${subject}\nMIME-Version: 1.0\nContent-Type: multipart/mixed; boundary="${boundary}"\n\n--${boundary}\nContent-Type: text/plain; charset="UTF-8"\n\n${replyText}\n\n`;

    // Encode each attachment and add to email content
    for (const file of attachments) {
      const base64Data = await readFileAsBase64(file);
      emailContent += `--${boundary}\nContent-Type: ${file.type}; name="${file.name}"\nContent-Disposition: attachment; filename="${file.name}"\nContent-Transfer-Encoding: base64\n\n${base64Data}\n\n`;
    }

    emailContent += `--${boundary}--`;

    const base64EncodedEmail = btoa(emailContent)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    gapi.client.gmail.users.messages.send({
      userId: 'me',
      resource: { raw: base64EncodedEmail },
    }).then(response => {
      setReplyText('');
      setAttachments([]); // Clear attachments after sending
      fetchEmails();
    }).catch(error => {
      console.error('Error sending email:', error);
    });
  };


  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]); // Remove the "data:<mime-type>;base64," prefix
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };



  const renderEmailList = (emailList, handleEmailClick) => (
    <List sx={{ padding: 0 }}>
      {emailList.filter(email => {
        if (filter === '') return true;
        return email.subject.toLowerCase().includes(filter.toLowerCase());
      }).map(email => (
        <ListItem
          key={email.id}
          onClick={() => handleEmailClick(email)}
          sx={{
            cursor: 'pointer',
            marginBottom: '10px',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            transition: 'background-color 0.3s, box-shadow 0.3s',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
            '&:hover': {
              backgroundColor: '#e0f7fa',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {email.from}
            </Typography>
            <Typography variant="body2" color="text.primary">
              {email.subject}
            </Typography>
          </Box>
        </ListItem>
      ))}
    </List>
  );



  const renderEmailBody = () => {
    if (!currentEmail) {
      return <Typography>Select an email to read its content.</Typography>;
    }

    const parsedMessages = currentTab === 'inbox'
      ? parseEmailBody(currentEmail.body, currentEmail.from, emailId)
      : parseSentEmailBody(currentEmail.body, emailId, currentEmail.to);

    return (
      <Box sx={{ padding: 2, backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          {currentTab === 'inbox' ? (
            <>
              <Typography variant="body1" sx={{ color: '#003366', fontWeight: 'bold' }}>
                <strong>From:</strong> {currentEmail.from}
              </Typography>
              <Typography variant="body1" sx={{ color: '#003366', fontWeight: 'bold' }} textAlign="right">
                <strong>To:</strong> {emailId}
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="body1" sx={{ color: '#003366', fontWeight: 'bold' }}>
                <strong>From:</strong> {emailId}
              </Typography>
              <Typography variant="body1" sx={{ color: '#003366', fontWeight: 'bold' }} textAlign="right">
                <strong>To:</strong> {currentEmail.to}
              </Typography>
            </>
          )}
        </Box>
        <Divider sx={{ marginY: 1 }} />

        <Box sx={{ marginTop: 1 }}>
          {parsedMessages.length > 0 ? (
            parsedMessages.map((message, index) => (
              <Box key={index} sx={{ marginBottom: 2 }}>
                <Typography variant="body2" color="#333">
                  {message.text.split('\n')[0]}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ marginTop: 1 }}>
                  {message.text.split('\n')[1]}
                </Typography>
                <Divider sx={{ marginY: 1 }} />
              </Box>
            ))
          ) : (
            <Typography>No content available for this email.</Typography>
          )}

          {currentEmail.attachments && currentEmail.attachments.length > 0 && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6">Attachments:</Typography>
              {currentEmail.attachments.map(attachment => (
                <Button
                  key={attachment.id}
                  onClick={() => downloadAttachment(attachment.id, attachment.filename)}
                  sx={{ margin: 1 }}
                  variant="outlined"
                >
                  Download {attachment.filename}
                </Button>
              ))}
            </Box>
          )}

          {currentTab === 'inbox' && (
            <Box sx={{ marginTop: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Type your reply..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ marginBottom: 8 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleReply}
                disabled={!replyText}
                sx={{ marginTop: 1 }}
              >
                Send Reply
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    );
  };



  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f4f4f4', height: '100vh', padding: 2 }}>
      {!emailId ? (
        // Display if emailId (sign-in token) is not available
        <Container sx={{ padding: 2 }}>
          <Typography variant="h6" color="error">
            Please sign in to access your emails.
          </Typography>
        </Container>
      ) : (
        <Grid container spacing={2}>
          {/* Filter Options Bar */}
          <Grid item xs={12} sx={{ margin: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant={filter === '' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setFilter('')}
                sx={{ marginX: 1 }}
              >
                All
              </Button>
              {options.map((option) => (
                <Button
                  key={option}
                  variant={filter === option ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setFilter(option)}
                  sx={{ marginX: 1 }}
                >
                  {option}
                </Button>
              ))}
            </Box>
          </Grid>


          {/* Tab Buttons for Inbox and Sent Emails */}
          <Grid item xs={12} sx={{}}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant={currentTab === 'inbox' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setCurrentTab('inbox')}
                sx={{ marginX: 1 }}
              >
                Inbox
              </Button>
              <Button
                variant={currentTab === 'outbox' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setCurrentTab('outbox')}
                sx={{ marginX: 1 }}
              >
                Sent
              </Button>
            </Box>
          </Grid>

          {/* First Grid: Email List */}
          <Grid item xs={4}>
            <Item>
              <Typography variant="h6" sx={{
                color: '#003366', // Dark blue color
                marginBottom: '10px',
                fontWeight: 'bold',
              }}>
                <strong>{currentTab === 'inbox' ? 'Inbox' : 'Sent'}</strong>
              </Typography>
              <Divider sx={{ marginY: 1 }} />
              {loading ? (
                <Typography>Loading emails...</Typography>
              ) : currentTab === 'inbox' ? (
                renderEmailList(emails, handleEmailClick) // Call the function here for inbox
              ) : (
                renderEmailList(sentEmails, handleEmailClick) // Call the function here for sent emails
              )}
            </Item>
          </Grid>

          {/* Second Grid: Email Body */}
          <Grid item xs={8}>
            <Item>{renderEmailBody()}</Item>
          </Grid>
        </Grid>
      )}
    </Box>
  );

}


