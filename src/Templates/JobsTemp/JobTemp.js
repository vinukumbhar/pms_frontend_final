import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Chip, InputLabel, InputAdornment, Box, Button, Typography, Container, Alert, Autocomplete, TextField, Switch, FormControlLabel, List, ListItem, ListItemText, Popover, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Unstable_Grid2";
import Priority from "../Priority/Priority";
import EditorShortcodes from "../Texteditor/EditorShortcodes";
import { toast } from "react-toastify";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CircularProgress } from "@mui/material";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { CiMenuKebab } from "react-icons/ci";
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded";
dayjs.extend(customParseFormat);

const JobTemp = ({ charLimit = 4000 }) => {
  const JOBS_API = process.env.REACT_APP_JOBS_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;

  const navigate = useNavigate();
  const [templatename, settemplatename] = useState("");
  const [priority, setPriority] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [startsin, setstartsin] = useState("");
  const [duein, setduein] = useState("");
  const [absoluteDate, setAbsoluteDates] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [jobName, setJobName] = useState("");
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [selectedShortcut, setSelectedShortcut] = useState("");
  const [startsInDuration, setStartsInDuration] = useState("Days");
  const [dueinduration, setdueinduration] = useState("Days");
  // const [startsinduration, setstartsinduration] = useState("");
  const [description, setDescription] = useState("");

  // client facing integration

  const [clientFacingStatus, setClientFacingStatus] = useState(false);
  const [selectedJobShortcut, setSelectedJobShortcut] = useState("");
  const [anchorElClientJob, setAnchorElClientJob] = useState(null);
  const [anchorElDescription, setAnchorElDecription] = useState(null);
  const [inputText, setInputText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [clientDescription, setClientDescription] = useState("");
  const [showDropdownClientJob, setShowDropdownClientJob] = useState(false);
  const [showDropdownDescription, setShowDropdownDescription] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
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

  const handleEditorChange = (content) => {
    setDescription(content);
  };

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };
  // handleDescriptionAddShortcut

  const handleAddShortcut = (shortcut) => {
    setJobName((prevText) => prevText + `[${shortcut}]`);
    setShowDropdown(false);
  };
  const handleCreateJobTemplate = () => {
    setShowForm(true); // Show the form when button is clicked
  };

  const handlePriorityChange = (priority) => {
    setPriority(priority);
  };
  const handleAbsolutesDates = (checked) => {
    setAbsoluteDates(checked);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleDueDateChange = (date) => {
    setDueDate(date);
  };
  // const handleCloseJobTemp = () => {

  //     const confirmCancel = window.confirm("You have unsaved changes. are you sure you want to leave without saving?");
  //     if (confirmCancel) {
  //         // If user confirms, clear the form and hide it
  //         setShowForm(false);

  //     }

  // }
  const [isFormDirty, setIsFormDirty] = useState(false);
  const handleCloseJobTemp = () => {
    if (isFormDirty) {
      const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
      if (!confirmClose) {
        return;
      }
    }
    setShowForm(false);
  };

  // Detect form changes
  useEffect(() => {
    if (templatename || jobName || priority || description || absoluteDate) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [templatename, jobName, priority, description, absoluteDate]);
  const dayOptions = [
    { label: "Days", value: "Days" },
    { label: "Months", value: "Months" },
    { label: "Years", value: "Years" },
  ];

  // Handler function to update state when dropdown value changes
  const handleStartInDateChange = (event, newValue) => {
    setStartsInDuration(newValue ? newValue.value : null);
  };
  // Handler function to update state when dropdown value changes
  const handledueindateChange = (event, newValue) => {
    setdueinduration(newValue ? newValue.value : null);
  };

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
  const handleCloseDropdown = () => {
    setShowDropdown(false);
    setAnchorEl(null);
  };
  const handlejobName = (e) => {
    const { value } = e.target;
    setJobName(value);
  };
  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);
  const [userData, setUserData] = useState([]);

  console.log(combinedValues);
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

  const handleUserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setCombinedValues(selectedValues);
  };

  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));
  //get all templateName Record
  const [JobTemplates, setJobTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
   
  useEffect(() => {
    fetchJobTemplatesData();
  }, []);
  const fetchJobTemplatesData = async () => {
    setLoading(true);
    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch job templates");
      }
      const data = await response.json();
      setJobTemplates(data.JobTemplates);
      console.log(data);
    } catch (error) {
      console.error("Error fetching job templates:", error);
    }
    finally {
      await loaderDelay;
      setLoading(false); // Stop loader
    }
  };

  const handleClear = () => {
    settemplatename("");
    setJobName("");
    setSelectedUser([]);
    setPriority("");
    setAbsoluteDates(false);
    setStartDate(null);
    setDueDate(null);
    setInputText("");
    setstartsin("");
    setduein("");
    setClientDescription("");
    setClientFacingStatus(false);
    setComments([]);
  };
  // showinclientportal,jobnameforclient,clientfacingstatus,
  const createjobtemp = () => {
    if (absoluteDate === true) {
      if (!validateForm()) {
        // toast.error("Please fix the validation errors.");
        return;
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        templatename: templatename,
        jobname: jobName,
        jobassignees: combinedValues,
        addshortcode: "",
        priority: priority.value,
        description: description,
        absolutedates: absoluteDate,
        comments: comments,
        showinclientportal: clientFacingStatus,
        jobnameforclient: inputText,
        clientfacingstatus: selectedJob?.value,
        startdate: startDate,
        enddate: dueDate,
        clientfacingDescription: clientDescription,
      });
      console.log(raw);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate`;
      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          // Handle success
          toast.success("Job Template created successfully");
          setShowForm(false);
          handleClear();
          fetchJobTemplatesData();
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to create Job Template");
        });
    } else if (absoluteDate === false) {
      if (!validateForm()) {
        // toast.error("Please fix the validation errors.");
        return;
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        templatename: templatename,
        jobname: jobName,
        jobassignees: combinedValues,
        addshortcode: "",
        priority: priority.value,
        description: description,
        absolutedates: absoluteDate,
        startsin: startsin,
        startsinduration: startsInDuration,
        duein: duein,
        dueinduration: dueinduration,
        comments: comments,
        showinclientportal: clientFacingStatus,
        jobnameforclient: inputText,
        clientfacingstatus: selectedJob?.value,
        clientfacingDescription: clientDescription,
      });
      console.log(raw);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate`;
      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          // Handle success
          toast.success("Job Template created successfully");
          // setTimeout(() => window.location.reload(), 1000);
          setShowForm(false);
          handleClear();
          fetchJobTemplatesData();
          // Additional logic after successful creation if needed
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to create Job Template");
        });
    }
  };

  const createsavejobtemp = () => {
    if (absoluteDate === true) {
      if (!validateForm()) {
        // toast.error("Please fix the validation errors.");
        return;
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        templatename: templatename,
        jobname: jobName,
        jobassignees: combinedValues,
        addshortcode: "",
        priority: priority.value,
        description: description,
        absolutedates: absoluteDate,
        comments: comments,
        startdate: startDate,
        enddate: dueDate,
        showinclientportal: clientFacingStatus,
        jobnameforclient: inputText,
        clientfacingstatus: selectedJob.value,
        clientfacingDescription: clientDescription,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate`;
      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          // Handle success
          toast.success("Job Template created successfully");
          // handle;

          fetchJobTemplatesData();
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to create Job Template");
        });
    } else if (absoluteDate === false) {
      if (!validateForm()) {
        // toast.error("Please fix the validation errors.");
        return;
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        templatename: templatename,
        jobname: jobName,
        jobassignees: combinedValues,
        addshortcode: "",
        priority: priority.value,
        description: description,
        absolutedates: absoluteDate,
        startsin: startsin,
        startsinduration: startsInDuration,
        duein: duein,
        dueinduration: dueinduration,
        comments: comments,
        showinclientportal: clientFacingStatus,
        jobnameforclient: inputText,
        clientfacingstatus: selectedJob.value,
        clientfacingDescription: clientDescription,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate`;
      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          // Handle success
          toast.success("Job Template created successfully");

          fetchJobTemplatesData();
          // Additional logic after successful creation if needed
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to create Job Template");
        });
    }
  };

  //delete template
  const handleEdit = (_id) => {
    navigate("JobTemplateUpdate/" + _id);
  };
  //delete template
  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm("Are you sure you want to delete this Job template?");

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate/`;
      fetch(url + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.json();
        })
        .then((result) => {
          console.log(result);
          toast.success("Item deleted successfully");
          setShowForm(false);
          fetchJobTemplatesData();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    }
  };

  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
  };
  // console.log(tempIdget)
  const columns = useMemo(
    () => [
      {
        accessorKey: "templatename",
        header: "Name",
        Cell: ({ row }) => (
          <Typography sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: "bold" }} onClick={() => handleEdit(row.original._id)}>
            {row.original.templatename}
          </Typography>
        ),
      },
      {
        accessorKey: "Setting",
        header: "Setting",
        Cell: ({ row }) => (
          <IconButton onClick={() => toggleMenu(row.original._id)} style={{ color: "#2c59fa" }}>
            <CiMenuKebab style={{ fontSize: "25px" }} />
            {openMenuId === row.original._id && (
              <Box sx={{ position: "absolute", zIndex: 1, backgroundColor: "#fff", boxShadow: 1, borderRadius: 1, p: 1, left: "30px", m: 2 }}>
                <Typography
                  sx={{ fontSize: "12px", fontWeight: "bold" }}
                  onClick={() => {
                    handleEdit(row.original._id);
                  }}
                >
                  Edit
                </Typography>
                <Typography sx={{ fontSize: "12px", color: "red", fontWeight: "bold" }} onClick={() => handleDelete(row.original._id)}>
                  Delete
                </Typography>
              </Box>
            )}
          </IconButton>
        ),
      },
    ],
    [openMenuId]
  );

  const table = useMaterialReactTable({
    columns,
    data: JobTemplates,
    enableBottomToolbar: true,
    enableStickyHeader: true,
    columnFilterDisplayMode: "custom", // Render own filtering UI
    enableRowSelection: true, // Enable row selection
    enablePagination: true,
    muiTableContainerProps: { sx: { maxHeight: "400px" } },
    initialState: {
      columnPinning: { left: ["mrt-row-select", "tagName"], right: ["settings"] },
    },
    muiTableBodyCellProps: {
      sx: (theme) => ({
        backgroundColor: theme.palette.mode === "dark-theme" ? theme.palette.grey[900] : theme.palette.grey[50],
      }),
    },
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;
    if (!templatename) tempErrors.templatename = "Template name is required";
    if (!jobName) tempErrors.jobName = "Job name is required";

    setErrors(tempErrors);
    // return isValid;
    return Object.keys(tempErrors).length === 0;
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
        {!showForm ? (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleCreateJobTemplate} sx={{ mb: 3 }}>
              Job Template
            </Button>
            {loading ? (
  <Box sx={{display:'flex',alignItems:'center', justifyContent:'center'}}> <CircularProgress style={{fontSize:'300px', color:'blue'}}/></Box>):( <MaterialReactTable columns={columns} table={table} />)
}
            {/* <MaterialReactTable columns={columns} table={table} /> */}
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h6" gutterBottom>
                Create Job Template
              </Typography>
              <Button onClick={addCommentField}>Add comments</Button>
            </Box>

            <Box>
              <hr />
            </Box>
            <Grid container spacing={2}>
              <Grid xs={12} sm={5.8}>
                <Box mt={2}>
                  <label className="jobtemp-input-label">Template Name</label>
                  <TextField
                    size="small"
                    fullWidth
                    error={!!errors.templatename}
                    // helperText={errors.templatename}
                    placeholder="Template Name"
                    value={templatename}
                    onChange={(e) => settemplatename(e.target.value)}
                    sx={{ backgroundColor: "#fff", mt: 2 }}
                  />
                  {!!errors.templatename && (
                    <Alert
                      sx={{
                        width: "96%",
                        p: "0", // Adjust padding to control the size
                        pl: "4%",
                        height: "23px",
                        borderRadius: "10px",
                        borderTopLeftRadius: "0",
                        borderTopRightRadius: "0",
                        fontSize: "15px",
                        display: "flex",
                        alignItems: "center", // Center content vertically
                        "& .MuiAlert-icon": {
                          fontSize: "16px", // Adjust the size of the icon
                          mr: "8px", // Add margin to the right of the icon
                        },
                      }}
                      variant="filled"
                      severity="error"
                    >
                      {errors.templatename}
                    </Alert>
                  )}
                </Box>
                <Box mt={1}>
                  <label className="jobtemp-input-label">Job Name</label>
                  <TextField
                    sx={{ backgroundColor: "#fff", mt: 2 }}
                    value={jobName + selectedShortcut}
                    onChange={handlejobName}
                    size="small"
                    fullWidth
                    error={!!errors.jobName}
                    // helperText={errors.jobName}
                    placeholder="Job Name"
                  />
                  {!!errors.jobName && (
                    <Alert
                      sx={{
                        width: "96%",
                        p: "0", // Adjust padding to control the size
                        pl: "4%",
                        height: "23px",
                        borderRadius: "10px",
                        borderTopLeftRadius: "0",
                        borderTopRightRadius: "0",
                        fontSize: "15px",
                        display: "flex",
                        alignItems: "center", // Center content vertically
                        "& .MuiAlert-icon": {
                          fontSize: "16px", // Adjust the size of the icon
                          mr: "8px", // Add margin to the right of the icon
                        },
                      }}
                      variant="filled"
                      severity="error"
                    >
                      {errors.jobName}
                    </Alert>
                  )}
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
                  <label className="jobtemp-input-label">Job Assignees</label>
                  <Autocomplete
                    multiple
                    sx={{ mt: 2, backgroundColor: "#FFF" }}
                    options={options}
                    size="small"
                    getOptionLabel={(option) => option.label}
                    value={selectedUser}
                    onChange={handleUserChange}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                      >
                        {option.label}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <>
                        <TextField {...params} variant="outlined" placeholder="Assignees" />
                      </>
                    )}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                  />
                </Box>
                <Box mt={2}>
                  <Priority onPriorityChange={handlePriorityChange} selectedPriority={priority} />
                </Box>
                <Box mt={2}>
                  <EditorShortcodes onChange={handleEditorChange} content={description} />
                </Box>
                <Box mt={2}>
                  <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Typography variant="h6" className="jobtemp-input-label">
                      Start and Due Date
                    </Typography>
                    <Box className="absolutes-dates">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={absoluteDate}
                            // onChange={handleAbsolutesDates}
                            onChange={(event) => handleAbsolutesDates(event.target.checked)}
                            color="primary"
                          />
                        }
                        label={"Absolute Date"}
                      />
                    </Box>
                  </Box>
                </Box>

                {absoluteDate && (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                      <Typography className="task-input-label">Start Date</Typography>
                      <DatePicker format="DD/MM/YYYY" sx={{ width: "100%", backgroundColor: "#fff" }} selected={startDate} onChange={handleStartDateChange} renderInput={(params) => <TextField {...params} size="small" />} />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                      <Typography className="task-input-label">Due Date</Typography>
                      <DatePicker format="DD/MM/YYYY" sx={{ width: "100%", backgroundColor: "#fff" }} selected={dueDate} onChange={handleDueDateChange} renderInput={(params) => <TextField {...params} size="small" />} />
                    </Box>
                  </>
                )}
                {!absoluteDate && (
                  <>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} sm={2}>
                        <Typography className="task-input-label">Start In</Typography>
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <TextField size="small" placeholder="0" defaultValue={0} value={startsin} sx={{ background: "#fff", width: "100%" }} onChange={(e) => setstartsin(e.target.value)} />
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <Autocomplete
                          options={dayOptions}
                          size="small"
                          getOptionLabel={(option) => option.label}
                          onChange={handleStartInDateChange}
                          renderInput={(params) => (
                            <>
                              <TextField {...params} variant="outlined" sx={{ backgroundColor: "#fff" }} />
                            </>
                          )}
                          value={dayOptions.find((option) => option.value === startsInDuration) || null}
                          className="job-template-select-dropdown"
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} sm={2}>
                        <Typography className="task-input-label">Due In</Typography>
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <TextField size="small" placeholder="0" value={duein} fullWidth sx={{ background: "#fff" }} onChange={(e) => setduein(e.target.value)} />
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <Autocomplete
                          options={dayOptions}
                          getOptionLabel={(option) => option.label}
                          onChange={handledueindateChange}
                          size="small"
                          renderInput={(params) => (
                            <>
                              <TextField {...params} variant="outlined" sx={{ backgroundColor: "#fff" }} />
                            </>
                          )}
                          value={dayOptions.find((option) => option.value === dueinduration) || null}
                          className="job-template-select-dropdown"
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </Grid>
              <Grid item xs={12} sm={0.4} sx={{ display: { xs: "none", sm: "block" } }}>
                <Box
                  className="vertical-line"
                  sx={{
                    // borderLeft: '1px solid black',
                    height: "100%",
                    ml: 1.5,
                  }}
                ></Box>
              </Grid>
              <Grid xs={12} sm={5.8}>
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
              <Button variant="contained" color="primary" onClick={createjobtemp}>
                Save & exit
              </Button>
              <Button variant="contained" color="primary" onClick={createsavejobtemp}>
                Save
              </Button>
              <Button variant="outlined" onClick={handleCloseJobTemp}>
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default JobTemp;
