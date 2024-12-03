// import React from 'react'
// import './overview.css'
// import { Link } from 'react-router-dom'
// import { IoDocumentTextOutline,IoMailOpenOutline  } from "react-icons/io5";
// import { PiChats,PiNotepad  } from "react-icons/pi";
// import { GrNotes } from "react-icons/gr";
// import { CgNotes } from "react-icons/cg";
// import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
// import { TbSubtask } from "react-icons/tb";
// const Overview = () => {
//   return (
//     <div className='overview-container' style={{ display: 'flex', gap: '5%', }}>
//       <div className='boxone'>
//         <div className='document-card'>
//           <div className='heading'>
//             <h3>Document</h3>
//             <Link to='/accountsdash/docs/documents'>View all</Link>
//           </div>
//           <div className='underline'></div>
//           <div className='doc-content'>
//             <IoDocumentTextOutline className='content-icon' />
//             <p>No Documents</p>
//           </div>
//         </div>
//         <div className='document-card'>
//           <div className='heading'>
//             <h3>Email</h3>
//             <Link to='/accountsdash/email'>View all</Link>
//           </div>
//           <div className='underline'></div>
//           <div className='doc-content'>
//             <IoMailOpenOutline  className='content-icon' />
//             <p>No Emails</p>
//           </div>
//         </div>
//         <div className='document-card'>
//           <div className='heading'>
//             <h3>Chats</h3>
//             <Link to='/accountsdash/communication'>View all</Link>
//           </div>
//           <div className='underline'></div>
//           <div className='doc-content'>
//             <PiChats  className='content-icon' />
//             <p>No active messages</p>
//           </div>
//         </div>
//         <div className='document-card'>
//           <div className='heading'>
//             <h3>Approvals</h3>
//             <Link to='#'>View all</Link>
//           </div>
//           <div className='underline'></div>
//           <div className='doc-content'>
//             <GrNotes  className='content-icon' />
//             <p>No files pending approval</p>
//           </div>
//         </div>
//         <div className='document-card'>
//           <div className='heading'>
//             <h3>Organizers</h3>
//             <Link to='#'>View all</Link>
//           </div>
//           <div className='underline'></div>
//           <div className='doc-content'>
//             <PiNotepad className='content-icon' />
//             <p>No organizers created</p>
//           </div>
//         </div>
//         <div className='document-card'>
//           <div className='heading'>
//             <h3>Notes</h3>
//             <Link to='#'>View all</Link>
//           </div>
//           <div className='underline'></div>
//           <div className='doc-content'>
//             <CgNotes  className='content-icon' />
//             <p>No active notes</p>
//           </div>
//         </div>
//         <div className='document-card'>
//           <div className='heading'>
//             <h3>Proposals & ELs</h3>
//             <Link to='#'>View all</Link>
//           </div>
//           <div className='underline'></div>
//           <div className='doc-content'>
//             <HiOutlineDocumentDuplicate className='content-icon' />
//             <p>No proposals</p>
//           </div>
//         </div>
        
//       </div>
//       <div className='boxtwo'>
//       <div className='document-card'>
//           <div className='heading'>
//             <h3>Tasks</h3>
//             <Link to='#'>View all</Link>
//           </div>
//           <div className='underline'></div>
//           <div className='doc-content'>
//             <TbSubtask  className='content-icon' />
//             <p>No active tasks</p>
//           </div>
//         </div>
//         <div className='document-card'>
//           <div className='heading'>
//             <h3>Jobs</h3>
//             <Link to='/accountsdash/workflow/pipelines'>View all</Link>
//           </div>
//           <div className='underline'></div>
//           <div className='doc-content'>
//             <IoDocumentTextOutline className='content-icon' />
//             <p>No Documents</p>
//           </div>
//         </div>
//         <div className='document-card'>
//           <div className='heading'>
//             <h3>Unpaid invoices</h3>
//             <Link to='#'>View all</Link>
//           </div>
//           <div className='underline'></div>
//           <div className='doc-content'>
//             <IoDocumentTextOutline className='content-icon' />
//             <p>No unpaid invoices</p>
//           </div>
//         </div>
//         <div className='document-card'>
//           <div className='heading'>
//             <h3>Signatures</h3>
//             <Link to='#'>View all</Link>
//           </div>
//           <div className='underline'></div>
//           <div className='doc-content'>
//             <IoDocumentTextOutline className='content-icon' />
//             <p>No signatures requested</p>
//           </div>
//         </div>
//         <div className='document-card'>
//           <div className='heading'>
//             <h3>Login activity</h3>
//             <Link to='#'>View all</Link>
//           </div>
//           <div className='underline'></div>
//           <div className='doc-content'>
//             <IoDocumentTextOutline className='content-icon' />
//             <p>Client has not logged in yet</p>
//           </div>
//         </div>
//         <div className='document-card'>
//           <div className='heading'>
//             <h3>Time tracking</h3>
//             <Link to='#'>View all</Link>
//           </div>
//           <div className='underline'></div>
//           <div className='doc-content'>
//             <IoDocumentTextOutline className='content-icon' />
//             <p>No time tracking</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Overview


import React, { useState, useEffect } from 'react'
import './overview.css'
import { Link } from 'react-router-dom'
import { IoDocumentTextOutline, IoMailOpenOutline } from "react-icons/io5";
import { PiChats, PiNotepad } from "react-icons/pi";
import { GrNotes } from "react-icons/gr";
import { CgNotes } from "react-icons/cg";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import { TbSubtask } from "react-icons/tb";
import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";
import { Typography, Card, CardContent, Divider, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';


const Overview = () => {
  // Organizer
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const { data } = useParams();
  const [organizerTemplatesData, setOrganizerTemplatesData] = useState([]);

  const fetchOrganizerTemplates = async (accountid) => {
    try {
      const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/organizerbyaccount/${accountid}`;
      console.log(url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch email templates");
      }
      const data = await response.json();
      console.log(data);
      setOrganizerTemplatesData(data.organizerAccountWise);
    } catch (error) {
      console.error("Error fetching email templates:", error);
    }
  };
  useEffect(() => {
    fetchOrganizerTemplates(data);

  }, []);


  //Proposals

  useEffect(() => {
    fetchPrprosalsAllData(data);
  }, []);

  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_URL;
  const [ProposalsTemplates, setProposalsTemplates] = useState([]);

  const fetchPrprosalsAllData = async (data) => {
    try {
      const url = `${PROPOSAL_API}/proposalandels/proposalaccountwise/proposalbyaccount/${data}`;
      console.log(url)
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch Proposals templates");
      }
      const result = await response.json();
      console.log(result.proposalesandelsAccountwise)
      setProposalsTemplates(result.proposalesandelsAccountwise);

    } catch (error) {
      console.error("Error fetching Proposals  templates:", error);
    }
  };
  console.log(ProposalsTemplates)
  //Invoices 
  const INVOICES_API = process.env.REACT_APP_INVOICES_URL;
  const [accountInvoicesData, setAccountInvoicesData] = useState([]);
  useEffect(() => {
    fetchInvoices(data);
  }, []);

  const fetchInvoices = async (data) => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(`${INVOICES_API}/workflow/invoices/invoice/invoicelistby/accountid/${data}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          // setAccountInvoicesData(result.invoice);
          setAccountInvoicesData(result.invoice || []);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error("Error fetching email templates:", error);
      setAccountInvoicesData([]);
    }
  };
  console.log(accountInvoicesData)

  return (
    <div className='overview-container' style={{ display: 'flex', gap: '5%', }}>
      <div className='boxone'>
        <div className='document-card'>
          <div className='heading'>
            <h3>Document</h3>
            <Link to='/accountsdash/docs/documents'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <IoDocumentTextOutline className='content-icon' />
            <p>No Documents</p>
          </div>
        </div>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h7" component="h3" sx={{ fontWeight: 'bold' }}>
            Email
          </Typography>
          <Link to={`/accountsdash/email/${data}/inbox`} style={{ textDecoration: 'none', color: '#1976d2' }}>
            View all
          </Link>
        </Box>
        <Divider />
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
            {accountInvoicesData && accountInvoicesData.length > 0 ? (
              // Show the table when there are records
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accountInvoicesData.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>
                        {/* Render invoice number or any other data */}
                        {row.invoicenumber}
                      </TableCell>
                      <TableCell>a</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              // Show the fallback icon and message when data is empty
              <Box>
                <PiNotepad style={{ fontSize: '4rem', color: '#9e9e9e' }} />
                <Typography variant="body1" color="textSecondary" mt={2} sx={{
                  color: "text.disabled", // Use Material-UI's disabled text color
                  mt: 2,
                }}>
                  No Emails
                </Typography>
              </Box>
            )}
          </Box>

        </CardContent>


        <div className='document-card'>
          <div className='heading'>
            <h3>Chats</h3>
            <Link to='/accountsdash/communication'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <PiChats className='content-icon' />
            <p>No active messages</p>
          </div>
        </div>
        <div className='document-card'>
          <div className='heading'>
            <h3>Approvals</h3>
            <Link to='#'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <GrNotes className='content-icon' />
            <p>No files pending approval</p>
          </div>
        </div>

        {/* <Card sx={{ maxWidth: 345, boxShadow: 3, p: 2 }}> */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h7" component="h3" sx={{ fontWeight: 'bold' }}>
            Organizers
          </Typography>
          <Link to={`/accountsdash/organizers/${data}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
            View all
          </Link>
        </Box>
        <Divider />
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
            {organizerTemplatesData && organizerTemplatesData.length > 0 ? (
              // Show the table when there are records
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {organizerTemplatesData.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>
                        <Typography sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: "bold" }}>
                          {row.organizertemplateid?.organizerName || "Unnamed Template"}
                        </Typography>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              // Show the fallback UI when there are no records
              <Box>
                <PiNotepad style={{ fontSize: '4rem', color: '#9e9e9e' }} />
                <Typography variant="body1" color="textSecondary" mt={2} sx={{
                  color: "text.disabled", // Use Material-UI's disabled text color
                  mt: 2,
                }}>
                  No Organizers available
                </Typography>
              </Box>
            )}
          </Box>

        </CardContent>
        {/* </Card> */}

        <div className='document-card'>
          <div className='heading'>
            <h3>Notes</h3>
            <Link to='#'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <CgNotes className='content-icon' />
            <p>No active notes</p>
          </div>
        </div>


        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h7" component="h3" sx={{ fontWeight: 'bold' }}>
            Proposals & ELs
          </Typography>
          <Link
            to={`/accountsdash/proposals/${data}`}
            style={{ textDecoration: 'none', color: '#1976d2' }}
          >
            View all
          </Link>
        </Box>
        <Divider />

        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
            {ProposalsTemplates && ProposalsTemplates.length === 0 ? (
              // Show icon when the data is empty
              // <PiNotepad style={{ fontSize: '4rem', color: '#9e9e9e' }} />
              <Box>
                <PiNotepad style={{ fontSize: '4rem', color: '#9e9e9e' }} />
                <Typography variant="body1" color="textSecondary" mt={2} sx={{
                  color: "text.disabled", // Use Material-UI's disabled text color
                  mt: 2,
                }}>
                  No Proposals
                </Typography>
              </Box>
            ) : (
              // Show table when there are records
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ProposalsTemplates.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>
                        <Typography
                          sx={{
                            color: "#2c59fa",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          {row.proposalname}
                        </Typography>
                      </TableCell>
                      <TableCell>a</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        </CardContent>


      </div>
      <div className='boxtwo'>
        <div className='document-card'>
          <div className='heading'>
            <h3>Tasks</h3>
            <Link to='#'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <TbSubtask className='content-icon' />
            <p>No active tasks</p>
          </div>
        </div>
        <div className='document-card'>
          <div className='heading'>
            <h3>Jobs</h3>
            <Link to='/accountsdash/workflow/pipelines'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <IoDocumentTextOutline className='content-icon' />
            <p>No Documents</p>
          </div>
        </div>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h7" component="h3" sx={{ fontWeight: 'bold' }}>
            Unpaid invoices
          </Typography>
          <Link to={`/accountsdash/invoices/${data}/invoice`} style={{ textDecoration: 'none', color: '#1976d2' }}>
            View all
          </Link>
        </Box>
        <Divider />
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
            {accountInvoicesData && accountInvoicesData.length > 0 ? (
              // Show the table when there are records
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accountInvoicesData.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>
                        <Typography sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: "bold" }}>
                          {row.invoicenumber}
                        </Typography>
                      </TableCell>
                      <TableCell>a</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              // Show the fallback UI when no records
              <Box>
                <PiNotepad style={{ fontSize: '4rem', color: '#9e9e9e' }} />
                <Typography variant="body1" color="textSecondary" mt={2} sx={{
                  color: "text.disabled", // Use Material-UI's disabled text color
                  mt: 2,
                }}>
                  No unpaid invoices
                </Typography>
              </Box>
            )}

          </Box>
        </CardContent>

        <div className='document-card'>
          <div className='heading'>
            <h3>Signatures</h3>
            <Link to='#'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <IoDocumentTextOutline className='content-icon' />
            <p>No signatures requested</p>
          </div>
        </div>
        <div className='document-card'>
          <div className='heading'>
            <h3>Login activity</h3>
            <Link to='#'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <IoDocumentTextOutline className='content-icon' />
            <p>Client has not logged in yet</p>
          </div>
        </div>
        <div className='document-card'>
          <div className='heading'>
            <h3>Time tracking</h3>
            <Link to='#'>View all</Link>
          </div>
          <div className='underline'></div>
          <div className='doc-content'>
            <IoDocumentTextOutline className='content-icon' />
            <p>No time tracking</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview