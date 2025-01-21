import React, { useState, useEffect } from "react";
import { Chip, InputAdornment, Box, Button, Typography, Container, Grid, IconButton, Autocomplete, TextField, InputLabel, Switch, FormControlLabel, List, ListItem, ListItemText, Popover } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Priority from "../Priority/Priority";
import EditorShortcodes from "../Texteditor/EditorShortcodes";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DeleteIcon from "@mui/icons-material/Delete";

dayjs.extend(customParseFormat);

const JobTemplateUpdate = ({ charLimit = 4000 }) => {
  const JOBS_API = process.env.REACT_APP_JOBS_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;

  const { _id } = useParams(); // Get the job template ID from the URL parameters
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [jobname, setjobname] = useState("");
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [selectedShortcut, setSelectedShortcut] = useState("");
  const [tempNameNew, setTempNameNew] = useState("");
  const [clientStatus, setClientStatus] = useState([]);
  const [AssigneesNew, setAssigneesNew] = useState([]);
  const [PriorityNew, setPriorityNew] = useState();
  const [JobDescriptionNew, setJobDescriptionNew] = useState();
  const [StartsInNew, setStartsInNew] = useState();
  const [DueInNew, setDueInNew] = useState();
  const [StartsDateNew, setStartsDateNew] = useState(null);
  const [DueDateNew, setDueDateNew] = useState(null);
  const [StartsInDurationNew, setStartsInDurationNew] = useState();
  const [DueInDurationNew, setDueInDurationNew] = useState();
  const [AbsoluteDateNew, setAbsoluteDateNew] = useState();

  useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes("")));
  }, [shortcuts]);

  useEffect(() => {
    // Set shortcuts based on selected option
    if (selectedOption === "contacts") {
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

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };

  const handleAddShortcut = (shortcut) => {
    setjobname((prevText) => prevText + `[${shortcut}]`);
    setShowDropdown(false);
  };
  const dayOptions = [
    { label: "Days", value: "Days" },
    { label: "Months", value: "Months" },
    { label: "Years", value: "Years" },
  ];

  // // Handler function to update state when dropdown value changes
  // const handleStartInDateChange = (event, newValue) => {
  //   setStartsInNew(newValue ? newValue.value : null);
  // };
  // // Handler function to update state when dropdown value changes
  // const handledueindateChange = (event, newValue) => {
  //   setDueInDurationNew(newValue ? newValue.value : null);
  // };
  const handlePriorityChange = (priority) => {
    setPriorityNew(priority);
  };
  const handlejobName = (e) => {
    const { value } = e.target;
    setjobname(value);
  };

  const [combinedValues, setCombinedValues] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchData = async () => {
    try {
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));
  // const handleuserChange = (AssigneesNew) => {
  //   setAssigneesNew(AssigneesNew);
  //   // Map selected options to their values and send as an array
  //   const selectedValues = AssigneesNew.map((option) => option.value);
  //   console.log(selectedValues);
  //   setCombinedValues(selectedValues);
  // };
  const handleuserChange = (event, newValue) => {
    setAssigneesNew(newValue);
    // Map selected options to their values and send as an array
    const selectedValues = newValue.map((option) => option.value);
    console.log(selectedValues);
    setCombinedValues(selectedValues);
  };
  const handleCloseDropdown = () => {
    setAnchorEl(null);
    setShowDropdown(false);
  };

  const [templateData, setTemplateData] = useState(null);
  const [tempvalues, setTempValues] = useState();
  const [initialData, setInitialData] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [clientDescription, setClientDescription] = useState("");
  useEffect(() => {
    fetchidwiseData();
  }, []);

  //get id wise template Record
  const [clientStatusId, setClientStatusId] = useState("");
  const fetchidwiseData = async () => {
    try {
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate/jobtemplateList/`;
      const response = await fetch(url + _id);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();

      console.log("Fetched data:", data);
      setTemplateData(data.jobTemplate);
      setTempValues(data.jobTemplate);

      // Extract assignees data and set it to assigneesOptions state
      if (data.jobTemplate && data.jobTemplate.jobassignees) {
        const assigneesData = data.jobTemplate.jobassignees.map((assignee) => ({
          value: assignee._id,
          label: assignee.username,
        }));
        setAssigneesNew(assigneesData);

        const selectedValues = assigneesData.map((option) => option.value);
        setCombinedValues(selectedValues);
        console.log(selectedValues);
      }
      
      setClientStatusId(data.jobTemplate.clientfacingstatus._id);
      console.log(data.jobTemplate.clientfacingstatus._id);
      getClientStatusById(data.jobTemplate.clientfacingstatus._id);
      tempallvalue();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log(clientStatusId);
  const getClientStatusById = async (clientStatusId) => {
    try {
      const response = await fetch(`${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${clientStatusId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      console.log(data);
      const formattedStatus = {
        value: data.clientfacingjobstatuses._id,
        label: data.clientfacingjobstatuses.clientfacingName,
        clientfacingColour: data.clientfacingjobstatuses.clientfacingColour,
      };
      setSelectedJob(formattedStatus);
      // setClientDescription(data.clientfacingjobstatuses.clientfacingdescription);
      // console.log(data.clientfacingjobstatuses.clientfacingdescription);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (tempvalues) {
      tempallvalue();
    }
  }, [tempvalues]);

  const tempallvalue = () => {
    setTempNameNew(tempvalues.templatename);
    setjobname(tempvalues.jobname);
    setPriorityNew(tempvalues.priority);
    setJobDescriptionNew(tempvalues.description);
    console.log(tempvalues.description);
    setStartsInNew(tempvalues.startsin);
    setDueInNew(tempvalues.duein);
    setStartsDateNew(dayjs(tempvalues.startdate)); // Ensure this is in the correct format
    setDueDateNew(dayjs(tempvalues.enddate)); // Ensure this is in the correct format
    // setStartsDateNew(tempvalues.startdate);
    // console.log(tempvalues.startdate)
    // setDueDateNew(tempvalues.enddate);
    // console.log(tempvalues.enddate)
    setStartsInDurationNew(tempvalues.startsinduration);
    setDueInDurationNew(tempvalues.dueinduration);
    setAbsoluteDateNew(tempvalues.absolutedates);
    setComments(tempvalues.comments || []);
    setClientFacingStatus(tempvalues.showinclientportal);
    setInputText(tempvalues.jobnameforclient);
    setClientDescription(tempvalues.clientfacingDescription);
    // setSelectedJob(tempvalues.clientfacingstatus.clientfacingName)
  };

  // client facing integration

  const [clientFacingStatus, setClientFacingStatus] = useState(false);
  const [selectedJobShortcut, setSelectedJobShortcut] = useState("");
  const [anchorElClientJob, setAnchorElClientJob] = useState(null);
  const [anchorElDescription, setAnchorElDecription] = useState(null);
  const [inputText, setInputText] = useState("");
  const [charCount, setCharCount] = useState(0);

  const [showDropdownClientJob, setShowDropdownClientJob] = useState(false);
  const [showDropdownDescription, setShowDropdownDescription] = useState(false);

  const handleJobChange = async (event, newValue) => {
    setSelectedJob(newValue);

    if (newValue && newValue.value) {
      const clientjobId = newValue.value;
      try {
        const response = await fetch(`${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${clientjobId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        console.log(data);
        setClientDescription(data.clientfacingjobstatuses.clientfacingdescription);
        console.log(data.clientfacingjobstatuses.clientfacingdescription);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  const handleDescriptionAddShortcut = (shortcut) => {
    const updatedTextValue = clientDescription + `[${shortcut}]`;
    if (updatedTextValue.length <= charLimit) {
      setClientDescription(updatedTextValue);
      console.log(updatedTextValue);
      setCharCount(updatedTextValue.length);
    }
    setShowDropdownDescription(false);
  };
  const handlechatsubject = (e) => {
    const { value } = e.target;
    setInputText(value);
  };
  const handleChange = (event) => {
    const value = event.target.value;
    if (value.length <= charLimit) {
      setClientDescription(value);
      setCharCount(value.length);
    }
  };
  const handleClientFacing = (checked) => {
    setClientFacingStatus(checked);
  };

  const handleJobAddShortcut = (shortcut) => {
    setInputText((prevText) => prevText + `[${shortcut}]`);
    setShowDropdownClientJob(false);
  };

  const toggleShortcodeDropdown = (event) => {
    setAnchorElClientJob(event.currentTarget);
    setShowDropdownClientJob(!showDropdownClientJob);
  };
  const toggleDescriptionDropdown = (event) => {
    setAnchorElDecription(event.currentTarget);
    setShowDropdownDescription(!showDropdownDescription);
  };
  const [clientFacingJobs, setClientFacingJobs] = useState([]);
  const fetchClientFacingJobsData = async () => {
    try {
      const response = await fetch(`${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setClientFacingJobs(data.clientFacingJobStatues); // Ensure data is set correctly
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const optionstatus = clientFacingJobs.map((status) => ({
    value: status._id,
    label: status.clientfacingName,
    clientfacingColour: status.clientfacingColour,
  }));

  // useEffect to fetch jobs when the component mounts
  useEffect(() => {
    fetchClientFacingJobsData();
  }, []);
  const handleEditorChange = (content) => {
    setJobDescriptionNew(content);
  };

  const handleAbsolutesDates = (checked) => {
    setAbsoluteDateNew(checked);
  };

  const handleStartDateChange = (date) => {
    setStartsDateNew(date);
  };

  const handleDueDateChange = (date) => {
    setDueDateNew(date);
  };

  const updatejobtemp = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      templatename: tempNameNew,
      jobname: jobname,
      jobassignees: combinedValues,
      addshortcode: "",
      priority: PriorityNew.value,
      description: JobDescriptionNew,
      absolutedates: AbsoluteDateNew,
      startsin: StartsInNew,
      startsinduration: StartsInDurationNew,
      duein: DueInNew,
      dueinduration: DueInDurationNew,
      comments: comments,
      startdate: StartsDateNew,
      enddate: DueDateNew,
      showinclientportal: clientFacingStatus,
      jobnameforclient: inputText,
      clientfacingstatus: selectedJob?.value,
      clientfacingDescription: clientDescription,
    });

    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate/`;
    fetch(url + _id, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        toast.success("Job Template updated successfully");
        navigate("/firmtemp/templates/jobs");
        // setTimeout(() => navigate("/firmtemplates/jobs"), 1000);
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
        toast.error("Failed to create Job Template");
      });
  };
  const updatesavejobtemp = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      templatename: tempNameNew,
      jobname: jobname,
      jobassignees: combinedValues,
      addshortcode: "",
      priority: PriorityNew.value,
      description: JobDescriptionNew,
      absolutedates: AbsoluteDateNew,
      startsin: StartsInNew,
      startsinduration: StartsInDurationNew,
      duein: DueInNew,
      dueinduration: DueInDurationNew,
      comments: comments,
      startdate: StartsDateNew,
      enddate: DueDateNew,
      showinclientportal: clientFacingStatus,
      jobnameforclient: inputText,
      clientfacingstatus: selectedJob?.value,
      clientfacingDescription: clientDescription,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate/`;
    fetch(url + _id, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((result) => {
        toast.success("Job Template updated successfully");
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
        toast.error("Failed to create Job Template");
      });
  };

  const hasUnsavedChanges = () => {
    return tempNameNew !== initialData.templatename || jobname !== initialData.jobname || PriorityNew !== initialData.priority || JobDescriptionNew !== initialData.description || StartsInNew !== initialData.startsin || DueInNew !== initialData.duein || !dayjs(StartsDateNew).isSame(dayjs(initialData.startdate)) || !dayjs(DueDateNew).isSame(dayjs(initialData.enddate)) || StartsInDurationNew !== initialData.startsinduration || DueInDurationNew !== initialData.dueinduration || AbsoluteDateNew !== initialData.absolutedates;
  };

  const handleJobTempCancle = () => {
    if (hasUnsavedChanges()) {
      if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        navigate("/firmtemp/templates/jobs");
      }
    } else {
      navigate("/firmtemp/templates/jobs");
    }
  };

  const [comments, setComments] = useState([]);

  const addCommentField = () => {
    setComments([...comments, ""]); // Add a new empty comment field
  };
  console.log(comments);
  const handleCommentChange = (index, value) => {
    const updatedComments = [...comments];
    updatedComments[index] = value; // Update the specific comment field
    setComments(updatedComments);
  };
  const deleteCommentField = (index) => {
    const updatedComments = comments.filter((_, i) => i !== index); // Remove the comment at the specified index
    setComments(updatedComments);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        <Box
          sx={{
            mt: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" gutterBottom>
              Edit Job Template
            </Typography>
            <Button onClick={addCommentField}>Add comments</Button>
          </Box>
          <Box>
            <hr />
          </Box>
          <Grid container spacing={2}>
            <Grid xs={12} sm={5.8} ml={2}>
              <Box mt={2}>
                <InputLabel sx={{ color: "black" }}>Template Name</InputLabel>
                <TextField size="small" margin="normal" fullWidth placeholder="Template Name" onChange={(e) => setTempNameNew(e.target.value)} value={tempNameNew} />
              </Box>
              <Box mt={1}>
                <InputLabel sx={{ color: "black" }}>Job Name</InputLabel>
                <TextField value={jobname + selectedShortcut} onChange={handlejobName} size="small" margin="normal" fullWidth placeholder="Job Name" />
              </Box>
              <Box>
                <Button variant="contained" color="primary" onClick={toggleDropdown} sx={{ mt: 2 }}>
                  Add Shortcode
                </Button>

                <Popover
                  open={showDropdown}
                  anchorEl={anchorEl}
                  onClose={handleCloseDropdown}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <Box>
                    <List className="dropdown-list" sx={{ width: "300px", height: "300px", cursor: "pointer" }}>
                      {filteredShortcuts.map((shortcut, index) => (
                        <ListItem key={index} onClick={() => handleAddShortcut(shortcut.value)}>
                          <ListItemText
                            primary={shortcut.title}
                            primaryTypographyProps={{
                              style: {
                                fontWeight: shortcut.isBold ? "bold" : "normal",
                              },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Popover>
              </Box>
              <Box mt={2}>
                <InputLabel sx={{ color: "black" }}>Job Assignees</InputLabel>
                <Autocomplete
                  multiple
                  sx={{ mt: 2 }}
                  options={options}
                  size="small"
                  getOptionLabel={(option) => option.label}
                  value={AssigneesNew}
                  onChange={handleuserChange}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      {...props}
                      sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                    >
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Assignees" />}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                />
              </Box>
              <Box mt={2}>
                <Priority onPriorityChange={handlePriorityChange} selectedPriority={PriorityNew} />
              </Box>
              <Box mt={2}>
                <EditorShortcodes initialContent={JobDescriptionNew} onChange={handleEditorChange} />
              </Box>
              <Box mt={2}>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                  <Typography variant="h6">Start and Due Date</Typography>
                  <Box className="absolutes-dates">
                    <FormControlLabel control={<Switch checked={AbsoluteDateNew} onChange={(event) => handleAbsolutesDates(event.target.checked)} color="primary" />} label={"Absolute Date"} />
                  </Box>
                </Box>
              </Box>
              {AbsoluteDateNew && (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <Typography>Start Date</Typography>

                    <DatePicker format="DD/MM/YYYY" sx={{ width: "100%" }} value={StartsDateNew} onChange={handleStartDateChange} renderInput={(params) => <TextField {...params} size="small" />} />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <Typography>Due Date</Typography>
                    <DatePicker format="DD/MM/YYYY" sx={{ width: "100%" }} value={DueDateNew} onChange={handleDueDateChange} renderInput={(params) => <TextField {...params} size="small" />} />
                  </Box>
                </>
              )}

              {!AbsoluteDateNew && (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography>Start In</Typography>
                    <TextField size="small" margin="normal" fullWidth value={StartsInNew} onChange={(e) => setStartsInNew(e.target.value)} sx={{ ml: 1 }} />
                    <Autocomplete
                      options={dayOptions}
                      size="small"
                      getOptionLabel={(option) => option.label}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setStartsInDurationNew(newValue.value); // Update the duration state
                          // Update the TextField state with the selected option's label
                        }
                      }}
                      renderInput={(params) => <TextField {...params} variant="outlined" />}
                      value={dayOptions.find((option) => option.value === StartsInDurationNew) || null}
                      className="job-template-select-dropdown"
                    />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography>Due In</Typography>
                    <TextField size="small" margin="normal" fullWidth value={DueInNew} onChange={(e) => setDueInNew(e.target.value)} sx={{ ml: 1.5 }} />
                    <Autocomplete
                      options={dayOptions}
                      size="small"
                      getOptionLabel={(option) => option.label}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setDueInDurationNew(newValue.value); // Update the duration state
                          // Update the TextField state with the selected option's label
                        }
                      }}
                      renderInput={(params) => <TextField {...params} variant="outlined" />}
                      value={dayOptions.find((option) => option.value === DueInDurationNew) || null}
                      className="job-template-select-dropdown"
                    />
                  </Box>
                </>
              )}
            </Grid>

            <Grid xs={12} sm={5.8} mt={3} ml={2}>
              <Box style={{ display: "flex", alignItems: "center" }}>
                {/* <EditCalendarRoundedIcon sx={{ fontSize: '120px', color: '#c6c7c7', }} /> */}
                <Box style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="body">
                      <b>Client-facing status</b>
                    </Typography>
                    <FormControlLabel control={<Switch onChange={(event) => handleClientFacing(event.target.checked)} checked={clientFacingStatus} color="primary" />} label="Show in Client portal" />
                  </Box>
                  <Box>
                    {clientFacingStatus && (
                      <>
                        <Typography>Job name for client</Typography>
                        <TextField fullWidth name="subject" value={inputText + selectedJobShortcut} onChange={handlechatsubject} placeholder="Job name for client" size="small" sx={{ background: "#fff", mt: 2 }} />

                        <Box>
                          <Button variant="contained" color="primary" onClick={toggleShortcodeDropdown} sx={{ mt: 2 }}>
                            Add Shortcode
                          </Button>
                          <Popover
                            open={showDropdownClientJob}
                            anchorEl={anchorElClientJob}
                            onClose={handleCloseDropdown}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                          >
                            <Box>
                              <List className="dropdown-list" sx={{ width: "300px", height: "300px", cursor: "pointer" }}>
                                {filteredShortcuts.map((shortcut, index) => (
                                  <ListItem key={index} onClick={() => handleJobAddShortcut(shortcut.value)}>
                                    <ListItemText
                                      primary={shortcut.title}
                                      primaryTypographyProps={{
                                        style: {
                                          fontWeight: shortcut.isBold ? "bold" : "normal",
                                        },
                                      }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          </Popover>
                        </Box>
                        <Box mt={2}>
                          <Typography>Status</Typography>
                          <Autocomplete
                            options={optionstatus}
                            size="small"
                            sx={{ mt: 1 }}
                            value={selectedJob}
                            onChange={handleJobChange}
                            getOptionLabel={(option) => option.label}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            renderOption={(props, option) => (
                              <Box component="li" {...props}>
                                {/* Color dot */}
                                <Chip
                                  size="small"
                                  style={{
                                    backgroundColor: option.clientfacingColour,
                                    marginRight: 8,
                                    marginLeft: 8,
                                    borderRadius: "50%",
                                    height: "15px",
                                  }}
                                />
                                {option.label}
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Client Facing Job"
                                InputProps={{
                                  ...params.InputProps,
                                  startAdornment:
                                    params.inputProps.value && clientFacingJobs.length > 0 ? (
                                      <Chip
                                        size="small"
                                        style={{
                                          backgroundColor: clientFacingJobs.find((job) => job.clientfacingName === params.inputProps.value)?.clientfacingColour, // Set color from selection
                                          marginRight: 8,
                                          marginLeft: 2,
                                          borderRadius: "50%",
                                          height: "15px",
                                        }}
                                      />
                                    ) : null,
                                }}
                              />
                            )}
                          />
                        </Box>
                        <Box sx={{ position: "relative", mt: 2 }}>
                          <InputLabel sx={{ color: "black" }}>Description</InputLabel>
                          <TextField
                            fullWidth
                            size="small"
                            margin="normal"
                            type="text"
                            multiline
                            value={clientDescription}
                            onChange={handleChange}
                            placeholder="Description"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Typography sx={{ color: "gray", fontSize: "12px", position: "absolute", bottom: "15px", right: "15px" }}>
                                    {charCount}/{charLimit}
                                  </Typography>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                        <Box>
                          <Button variant="contained" color="primary" onClick={toggleDescriptionDropdown} sx={{ mt: 2 }}>
                            Add Shortcode
                          </Button>

                          <Popover
                            open={showDropdownDescription}
                            anchorEl={anchorElDescription}
                            onClose={handleCloseDropdown}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                          >
                            <Box>
                              <List className="dropdown-list" sx={{ width: "300px", height: "300px", cursor: "pointer" }}>
                                {filteredShortcuts.map((shortcut, index) => (
                                  <ListItem key={index} onClick={() => handleDescriptionAddShortcut(shortcut.value)}>
                                    <ListItemText
                                      primary={shortcut.title}
                                      primaryTypographyProps={{
                                        style: {
                                          fontWeight: shortcut.isBold ? "bold" : "normal",
                                        },
                                      }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          </Popover>
                        </Box>
                      </>
                    )}
                  </Box>

                  {comments.map((comment, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <TextField value={comment} onChange={(e) => handleCommentChange(index, e.target.value)} placeholder={`Comment ${index + 1}`} variant="outlined" fullWidth multiline />
                      <IconButton onClick={() => deleteCommentField(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Box mt={3}>
            <hr />
          </Box>

          <Box sx={{ pt: 2, display: "flex", alignItems: "center", gap: 5 }}>
            <Button variant="contained" color="primary" onClick={updatejobtemp}>
              Save & exit
            </Button>
            <Button variant="contained" color="primary" onClick={updatesavejobtemp}>
              Save
            </Button>
            <Button variant="outlined" onClick={handleJobTempCancle}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default JobTemplateUpdate;
