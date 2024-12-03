import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
// import  from "react-select";
import { RiAddCircleLine } from "react-icons/ri";
import { IoIosCloseCircleOutline } from "react-icons/io";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { Editor } from "react-draft-wysiwyg";
import Switch from "react-switch";
import { EditorState, convertToRaw, ContentState, Modifier } from "draft-js";
import makeAnimated from "react-select/animated";
import { LuConstruction } from "react-icons/lu";
import { ToastContainer, toast } from "react-toastify";

import { TextField, Button, FormControl, Select, Autocomplete, MenuItem, Typography, Box } from "@mui/material";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// import 'react-toastify/dist/ReactToastify.css';
const SendAccountEmail = ({ selectedAccounts, onClose }) => {
  console.log(selectedAccounts);

  const [htmlContent, setHtmlContent] = useState(""); // State to store raw HTML content
  const API_KEY = process.env.REACT_APP_API_IP;

  const [scheduledEmail, setScheduledEmail] = useState(false);
  const handleScheduledEmail = (checked) => {
    setScheduledEmail(checked);
  };

  const shortcutsOptions = [
    { value: "contact_shortcuts", label: "Contact Shortcuts" },
    { value: "account_shortcuts", label: "Account Shortcuts" },
  ];
  const customShortcutsStyles = {
    container: (provided) => ({
      ...provided,
      // margin: '0 auto',
      // marginTop: '50px',
      // width: '300px',
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: "#f0f0f0",
      borderColor: "#ccc",
      border: "none",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#f9f9f9",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#e6e6e6" : "#f9f9f9",
      color: state.isSelected ? "#333" : "#000",
      "&:active": {
        backgroundColor: "#ddd",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#999",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#333",
    }),
  };
  const customTempStyles = {
    container: (provided) => ({
      ...provided,
      width: "400px",
    }),
  };

  const [inputText, setInputText] = useState("");
  const [selectedShortcut, setSelectedShortcut] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const dropdownRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState("contacts"); // Default selected option

  const [shortcuts, setShortcuts] = useState([]);
  const handleInputChange = (e) => {
    const { value } = e.target;
    setInputText(value); // Update inputText state with the new value
    // console.log("Email Subject:", value); // Log the value to the console
  };
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setSearchTerm(""); // Clear search term when showing the dropdown
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleAddShortcut = (shortcut) => {
    setEmailSubject((prevText) => prevText + `[${shortcut}]`);
    setShowDropdown(false);
  };
  useEffect(() => {
    setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, shortcuts]);
  useEffect(() => {
    if (selectedOption === "contacts") {
      // Set contact shortcuts
      const contactShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
        { title: "Contact Shortcodes", isBold: true },
        { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
        { title: "First Name", isBold: false, value: "FIRST_NAME" },
        { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
        { title: "Last Name", isBold: false, value: "LAST_NAME" },
        { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
        { title: "Country", isBold: false, value: "COUNTRY" },
        { title: "Company name", isBold: false, value: "COMPANY_NAME " },
        { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
        { title: "City", isBold: false, value: "CITY" },
        { title: "State/Province", isBold: false, value: "STATE / PROVINCE" },
        { title: "Zip/Postal code", isBold: false, value: "ZIP / POSTAL CODE" },
        { title: "Custom field:Email", isBold: false, value: "CONTACT_CUSTOM_FIELD:Email" },

        { title: "Date Shortcodes", isBold: true },
        { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
        { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
        { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
        { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
        { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
        { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
        { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
        { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
        { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
        { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
        { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
        { title: "Last week", isBold: false, value: "LAST_WEEK" },
        { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
        { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
        { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      setShortcuts(contactShortcuts);
    } else if (selectedOption === "account") {
      // Set account shortcuts
      const accountShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
        { title: "Date Shortcodes", isBold: true },
        { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
        { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
        { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
        { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
        { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
        { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
        { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
        { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
        { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
        { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
        { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
        { title: "Last week", isBold: false, value: "LAST_WEEK" },
        { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
        { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
        { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      setShortcuts(accountShortcuts);
    }
  }, [selectedOption]);

  const [showTextDropdown, setShowTextDropdown] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const CustomToolbar = () => (
    <div className="rdw-editor-toolbar">
      <div className="dropdown-button" onClick={() => setShowTextDropdown(!showTextDropdown)}>
        Add Shortcode
      </div>
      {showTextDropdown && (
        <div className="dropdown-menu" ref={dropdownRef}>
          {shortcuts.map((shortcode, index) => (
            <div key={index} className={`dropdown-item ${shortcode.isBold ? "bold" : ""}`} onClick={() => handleShortcodeClick(shortcode)}>
              {shortcode.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const handleShortcodeClick = (shortcode) => {
    insertText(`[${shortcode.value}]`);
    setShowDropdown(false);
  };

  const insertText = (text) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const newContentState = Modifier.insertText(contentState, selectionState, text);
    const newEditorState = EditorState.push(editorState, newContentState, "insert-characters");
    setEditorState(newEditorState);
  };

  //*********************************Drop Down Fill */
  const animatedComponents = makeAnimated();
  const [userdata, setUserData] = useState([]);
  const [selecteduser, setSelectedUser] = useState();

  const [selectedto, setSelectedTo] = useState([]);
  const [emailTemplatedata, setEmailTemplateData] = useState([]);
  const [emailTemplate, setEmailTemplate] = useState();
  const [fetchtemplatedata, setFetchTemplateData] = useState();
  const [emailBody, setEmailBody] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [userEmailData, setUserEmailData] = useState();

  useEffect(() => {
    fetchData();
    fetchemailTemplateData();
  }, []);

  const USER_API = process.env.REACT_APP_USER_URL;

  const fetchData = async () => {
    try {
      // const url = `${API_KEY}/common/user/`;
      const url = `${USER_API}/api/auth/users`;
      // const url = `${API_KEY}/common/users/roles?roles=Admin,TeamMember`;
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const options = userdata.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const handleuserChange = async (event, selectedOption) => {
    if (!selectedOption || !selectedOption.value) {
      console.error("Invalid selected option:", selectedOption);
      return;
    }

    setSelectedUser(selectedOption);

    const url = `${USER_API}/api/auth/users/${selectedOption.value}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching user data: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      setUserEmailData(data.email);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;
  const fetchemailTemplateData = async () => {
    try {
      // const url = `${API_KEY}/workflow/emailtemplate/`;
      const url = `${EMAIL_API}/workflow/emailtemplate`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setEmailTemplateData(data.emailTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const emailoptions = emailTemplatedata.map((emailtemplate) => ({
    value: emailtemplate._id,
    label: emailtemplate.templatename,
  }));

  const handleEmailtemp = (event, selectedOption) => {
    console.log(selectedOption);
    if (selectedOption && selectedOption.value) {
      setEmailTemplate(selectedOption);
      fetchDataemaildetails(selectedOption.value);
    } else {
      console.error("Invalid selected option:", selectedOption);
    }
  };

  const fetchDataemaildetails = async (selecttempId) => {
    try {
      const url = `${EMAIL_API}/workflow/emailtemplate/${selecttempId}`;
      const response = await fetch(url);
      const data = await response.json();

      console.log(data);

      const contentBlock = htmlToDraft(data.emailTemplate.emailbody);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      setEditorState(EditorState.createWithContent(contentState));
      setHtmlContent(data.emailTemplate.emailbody);
      setFetchTemplateData(data.emailTemplate);

      setEmailSubject(data.emailTemplate.emailsubject);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEmailInputChange = (e) => {
    const { value } = e.target;
    setEmailSubject(value);
  };

  const [accountdata, setaccountdata] = useState([]);

  const fetchAccountData = async () => {
    try {
      const response = await fetch(`${ACCOUNT_API}/accounts/accountdetails`);
      const data = await response.json();
      setaccountdata(data.accounts);

      // Map accounts to options
      const options = data.accounts.map((account) => ({
        value: account._id,
        label: account.accountName,
      }));
      setAccountOptions(options);

      // Filter options based on selectedAccounts
      const selectedOptions = options.filter((option) => selectedAccounts.includes(option.value));
      console.log("Selected Options:", selectedOptions);
      setSelectedTo(selectedOptions);
      setCombinedValues(selectedOptions.map((option) => option.value));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log(selectedto);

  useEffect(() => {
    fetchAccountData();
  }, []);
  const [accountOptions, setAccountOptions] = useState([]);

  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  // Function to fetch account details
  const fetchAccountDetails = async (accountId) => {
    // console.log(accountId)
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    try {
      // const url = `${API_KEY}/admin/accountdetails/${accountId}`;
      const url = `${ACCOUNT_API}/accounts/accountdetails/getAccountbyIdAll/${accountId}`;
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };

  // Populate account options for the dropdown
  useEffect(() => {
    const populateOptions = async () => {
      console.log(selectedAccounts.selectedAccounts);
      if (!Array.isArray(selectedAccounts)) {
        console.error("Selected accounts is not an array.");
        return;
      }

      const options = [];
      for (const accountId of selectedAccounts) {
        console.log(accountId);
        const account = await fetchAccountDetails(accountId);
        console.log(account);
        options.push({ value: account.account._id, label: account.account.accountName });
      }
      // setAccountOptions(options);
      setSelectedTo(options);
      setCombinedValues(options.map((option) => option.value));
    };

    populateOptions();
  }, [selectedAccounts]);

  const navigate = useNavigate();

  const [combinedValues, setCombinedValues] = useState([]);

  //   const handleToselect = (selectedOptions) => {
  // console.log(selectedOptions)
  //     setSelectedTo(selectedOptions);
  //     // Map selected options to their values and send as an array
  //     const selectedValues = selectedOptions.map((option) => option.value);
  //     console.log(selectedValues)
  //     // const dataToSend = {
  //     //   selectedAccounts: selectedValues
  //     // };

  //     setCombinedValues(selectedValues);
  //   }

  const handleToselect = (event, selectedOptions) => {
    console.log(selectedOptions);

    // Update the selected value for display
    setSelectedTo(selectedOptions);

    if (selectedOptions) {
      // If multiple selections are possible, use `map` to get values; otherwise handle single object
      const selectedValues = Array.isArray(selectedOptions) ? selectedOptions.map((option) => option.value) : [selectedOptions.value]; // Wrap in array for single selection

      console.log(selectedValues);
      setCombinedValues(selectedValues);
    } else {
      // Handle case when cleared
      setCombinedValues([]);
    }
  };

  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  // console.log(combinedValues);
  // console.log(selectedto);
  const sendbulkEmail = () => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      selectedAccounts: combinedValues,
      emailtemplateid: emailTemplate.value,
      emailsubject: emailSubject,
      emailbody: htmlContent,
      notificationemail: userEmailData,
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${CONTACT_API}/sendBulkEmails`;
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          toast.error(response);
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((success) => {})
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred while sending emails");
      });
    toast.success("After sending all mails you will get notification mail.");
    //  setTimeout(() =>  navigate('/accounts'), 1000);
    // window.location.reload();
    handleCancel();
  };

  const handleCancel = () => {
    if (onClose) {
      onClose(); // Ensures onClose is a valid function before calling it
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowTextDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box>
      <Box className="send-email-container">
        <Box className="contact-temp">
          <label className="email-input-label">Email Template</label>
          <Autocomplete options={emailoptions} sx={{ mt: 2, mb: 2, backgroundColor: "#fff" }} size="small" value={emailTemplate} onChange={handleEmailtemp} isOptionEqualToValue={(option, value) => option.value === value.value} getOptionLabel={(option) => option.label || ""} renderInput={(params) => <TextField {...params} placeholder="Email Template" />} />
        </Box>

        <Box sx={{ mt: 2 }}>
          <label className="email-input-label">From</label>
          <Autocomplete options={options} sx={{ mt: 2, mb: 2, backgroundColor: "#fff" }} size="small" value={selecteduser} onChange={handleuserChange} isOptionEqualToValue={(option, value) => option.value === value.value} getOptionLabel={(option) => option.label || ""} renderInput={(params) => <TextField {...params} placeholder="Form" />} clearOnEscape />
        </Box>

        <Box sx={{ mt: 2 }}>
          <label className="email-input-label">To</label>
          {/* <Autocomplete multiple options={accountOptions} sx={{ mt: 2, mb: 2, backgroundColor: "#fff" }} size="small" value={selectedto} onChange={handleToselect} isOptionEqualToValue={(option, value) => option.value === value.value} getOptionLabel={(option) => option.label || ""} renderInput={(params) => <TextField {...params} placeholder="To" />} /> */}
          <Autocomplete
            multiple
            options={accountOptions}
            value={selectedto}
            onChange={handleToselect}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ cursor: "pointer", margin: "5px 10px" }}>
                {option.label}
              </Box>
            )}
            renderInput={(params) => <TextField {...params} placeholder="Select Accounts" variant="outlined" size="small" sx={{ backgroundColor: "#fff" }} />}
            sx={{ width: "100%", marginTop: "8px" }}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Subject</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              fullWidth
              label="Subject"
              value={emailSubject + selectedShortcut}
              onChange={handleEmailInputChange}
              InputProps={{
                inputProps: { style: { textTransform: "none" } },
              }}
            />
            <Button onClick={toggleDropdown} startIcon={<RiAddCircleLine />} color="primary">
              Add Shortcode
            </Button>
          </Box>

          {showDropdown && (
            <Box className="dropdown" ref={dropdownRef}>
              <Box className="search-bar">
                <TextField fullWidth placeholder="Search shortcuts" value={searchTerm} onChange={handleSearchChange} />
                <Button onClick={toggleDropdown} style={{ minWidth: "auto" }}>
                  <IoIosCloseCircleOutline fontSize="20px" />
                </Button>
              </Box>
              <Box component="ul" className="dropdown-list">
                {filteredShortcuts.map((shortcut) => (
                  <li key={shortcut.title} onClick={() => handleAddShortcut(shortcut.value)}>
                    <Typography variant="body2" style={{ fontWeight: shortcut.isBold ? "bold" : "normal", cursor: "pointer" }}>
                      {shortcut.title}
                    </Typography>
                  </li>
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <Editor editorState={editorState} wrapperClassName="demo-wrapper" editorClassName="demo-editor" toolbarCustomButtons={[<CustomToolbar />]} onEditorStateChange={setEditorState} />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Switch checked={scheduledEmail} onChange={handleScheduledEmail} color="primary" />
            <Typography variant="body2" style={{ cursor: "pointer" }}>
              Scheduled email
            </Typography>
          </Box>

          {scheduledEmail && (
            <Box className="datetime" sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Date & time</Typography>
              <TextField type="datetime-local" fullWidth placeholder="Date & time" />
            </Box>
          )}

          <Box className="buttons-email" sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button variant="contained" color="primary" onClick={sendbulkEmail}>
              Send
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SendAccountEmail;
