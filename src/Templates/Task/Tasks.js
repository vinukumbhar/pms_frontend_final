
import React, { useState, useEffect, useMemo } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Button,
  Typography,
  Container,
  Autocomplete,
  TextField,
  IconButton,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  Checkbox,
} from '@mui/material';
import { useNavigate, } from "react-router-dom";
import Editor from '../Texteditor/Editor';
import Grid from '@mui/material/Unstable_Grid2';
import Priority from '../Priority/Priority';
import Status from '../Status/Status';
import { toast } from "react-toastify";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { CiMenuKebab } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiPlusCircle } from "react-icons/fi";
import { PiDotsSixVerticalBold } from "react-icons/pi";
import { CircularProgress } from "@mui/material";
const Tasks = () => {
  const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;

  const navigate = useNavigate();
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [templatename, settemplatename] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [startsin, setstartsin] = useState("");
  const [duein, setduein] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [absoluteDate, setAbsoluteDates] = useState(false);
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [startsInDuration, setStartsInDuration] = useState("Days");
  const [dueinduration, setdueinduration] = useState("Days");
  const [description, setDescription] = useState('');
  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);
  const [userData, setUserData] = useState([]);

 
  const [checkedSubtasks, setCheckedSubtasks] = useState([]);

  const handleCheckboxChange = (id) => {
    setCheckedSubtasks((prevChecked) => 
      prevChecked.includes(id) 
        ? prevChecked.filter(checkedId => checkedId !== id) 
        : [...prevChecked, id]
    );
  };
  
  const [subtasks, setSubtasks] = useState([{ id: '1', text: '', }]);

  const handleAddSubtask = () => {
    const newId = String(subtasks.length + 1);
    setSubtasks([...subtasks, { id: newId, text: "" }]);
  };
  const handleInputChange = (id, value) => {
    setSubtasks((prevSubtasks) => 
      prevSubtasks.map((subtask) => 
        subtask.id === id ? { ...subtask, text: value } : subtask
      )
    );
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
  };

  const [SubtaskSwitch, setSubtaskSwitch] = useState(false);
  const handleSubtaskSwitch = (checked) => {
    setSubtaskSwitch(checked);
  };
  const handleDragEnd = (result) => {
    // Ensure a valid drop location
    if (!result.destination) return;
    // Reorder subtasks based on the drag-and-drop result
    const newSubtasks = Array.from(subtasks);
    const [reorderedItem] = newSubtasks.splice(result.source.index, 1);
    newSubtasks.splice(result.destination.index, 0, reorderedItem);
    // Update the state with the new order of subtasks
    setSubtasks(newSubtasks);
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
  const handleCreateTask = () => {
    setShowForm(true);
  };



  const handlePriorityChange = (priority) => {
    setPriority(priority);
  };
  const handleStatusChange = (status) => {
    setStatus(status);
  };

  const handleEditorChange = (content) => {
    setDescription(content);
  };

  // console.log(combinedValues)
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
  const handleUserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setCombinedValues(selectedValues);
  };

  //Tag FetchData ================
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [combinedTagsValues, setCombinedTagsValues] = useState([]);
  useEffect(() => {
    fetchTagData();
  }, []);

  const fetchTagData = async () => {
    try {

      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //  for tags
  const calculateWidth = (tagName) => {
    const baseWidth = 10; // base width for each tag
    const charWidth = 8; // approximate width of each character
    const padding = 10; // padding on either side
    return baseWidth + (charWidth * tagName.length) + padding;
  };
  const tagsoptions = tags.map((tag) => ({
    value: tag._id,
    label: tag.tagName,
    colour: tag.tagColour,
    customStyle: {
      backgroundColor: tag.tagColour,
      color: "#fff",
      borderRadius: "8px",
      alignItems: "center",
      textAlign: "center",
      marginBottom: "5px",
      padding: "2px,8px",
      fontSize: '10px',
      width: `${calculateWidth(tag.tagName)}px`,
      margin: '7px', cursor: 'pointer',
    },
    customTagStyle: {
      backgroundColor: tag.tagColour,
      color: "#fff",
      alignItems: "center",
      textAlign: "center",
      padding: "2px,8px",
      fontSize: '10px',
      cursor: 'pointer',
    },
  }));
  const handleTagChange = (event, newValue) => {
    setSelectedTags(newValue.map((option) => option.value));
    // Send selectedValues array to your backend
    console.log("Selected Values:", newValue.map((option) => option.value));
    // Assuming setCombinedValues is a function to send the values to your backend
    setCombinedTagsValues(newValue.map((option) => option.value));
  };
  // task temp
  const [TaskTemplates, setTaskTemplates] = useState([]);
  useEffect(() => {
    fetchTaskData();
  }, [])
    const [loading, setLoading] = useState(true);
  const fetchTaskData = async () => {
    setLoading(true); // Start loader

    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 3000));
    try {
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch task templates");
      }
      const data = await response.json();
      // console.log(data)
      setTaskTemplates(data.TaskTemplates
      );
    } catch (error) {
      console.error("Error fetching task templates:", error);
    }
    finally {
      // Wait for the fetch and the 3-second timer to complete
      await loaderDelay;
      setLoading(false); // Stop loader
    }
  };
  const createTaskTemp = () => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }

    const subtaskData = subtasks.map(({ id, text }) => ({
      id,
      text,
      
checked: checkedSubtasks.includes(id), // Check if ID is in the checkedSubtasks array
    }));
    
    // console.log(subtaskData);
    if (absoluteDate === true) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        templatename: templatename,
        status: status.value,
        taskassignees: combinedValues,
        tasktags: combinedTagsValues,
        priority: priority.value,
        description: description,
        absolutedates: absoluteDate,
        comments: "",
        startdate: startDate,
        enddate: dueDate,
        subtasks: subtaskData,
        issubtaskschecked:SubtaskSwitch
      });
      console.log(raw)
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          // Handle success
          toast.success("Task Template created successfully");
          resetFields();
          fetchTaskData();
          setShowForm(false)
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to create Task Template");
        });
    } else if (absoluteDate === false) {

      if (!validateForm()) {
        return; // Prevent form submission if validation fails
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        templatename: templatename,
        status: status.value,
        taskassignees: combinedValues,
        tasktags: combinedTagsValues,
        priority: priority.value,
        description: description,
        absolutedates: absoluteDate,
        startsin: startsin,
        startsinduration: startsInDuration,
        duein: duein,
        dueinduration: dueinduration,
        subtasks: subtaskData,
        issubtaskschecked:SubtaskSwitch

      });
      console.log(raw)
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          // Handle success
          toast.success("Task Template created successfully");
          resetFields();
          fetchTaskData();
          setShowForm(false)
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to create Task Template");
        });
    }
  };
  const createSaveTaskTemp = () => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    // const subtaskData = subtasks.map(({ id, text, isChecked }) => ({ id, text, isChecked }));
    // console.log(subtaskData)
    const subtaskData = subtasks.map(({ id, text }) => ({
      id,
      text,
      
checked: checkedSubtasks.includes(id), // Check if ID is in the checkedSubtasks array
    }));
    
    console.log(subtaskData);
    
    if (absoluteDate === true) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        templatename: templatename,
        status: status.value,
        taskassignees: combinedValues,
        tasktags: combinedTagsValues,
        priority: priority.value,
        description: description,
        absolutedates: absoluteDate,
        comments: "",
        startdate: startDate,
        enddate: dueDate,
        subtasks: subtaskData,
        issubtaskschecked:SubtaskSwitch
      });
      console.log(raw)
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          // Handle success
          toast.success("Task Template created successfully");
          resetFields();
          fetchTaskData();

        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to create Task Template");
        });
    } else if (absoluteDate === false) {

      if (!validateForm()) {
        return; // Prevent form submission if validation fails
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        templatename: templatename,
        status: status.value,
        taskassignees: combinedValues,
        tasktags: combinedTagsValues,
        priority: priority.value,
        description: description,
        absolutedates: absoluteDate,
        startsin: startsin,
        startsinduration: startsInDuration,
        duein: duein,
        dueinduration: dueinduration,
        subtasks: subtaskData,
        issubtaskschecked:SubtaskSwitch
      });
      console.log(raw)
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          // Handle success
          toast.success("Task Template created successfully");
          resetFields();
          fetchTaskData();

        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to create Task Template");
        });
    }
  };
  const resetFields = () => {
    setDescription('');
    setSelectedTags([]);
    setAbsoluteDates(false);
    setStartDate(null);
    setDueDate(null);
    setstartsin('');
    setduein('');
    setPriority("");
    setSelectedUser([]);
    setStartsInDuration('');
    settemplatename("");
    setdueinduration('');
    setStatus("");
    setSubtaskSwitch(false);
    setSubtasks([]);
  };
  const handleEdit = (_id) => {
    navigate("taskTempUpdate/" + _id);
  };
  //delete template
  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm("Are you sure you want to delete this task template?");

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow"
      };
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      fetch(url + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete item');
          }
          return response.text();
        })
        .then((result) => {
          // console.log(result);
          toast.success('Item deleted successfully');
          fetchTaskData();
          // setshowOrganizerTemplateForm(false);
        })
        .catch((error) => {
          console.error(error);
          toast.error('Failed to delete item');
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
  const columns = useMemo(() => [
    {
      accessorKey: 'templatename',
      header: 'Name',
      Cell: ({ row }) => (
        <Typography
          sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: 'bold' }}
          onClick={() => handleEdit(row.original._id)}
        >
          {row.original.templatename}
        </Typography>
      ),
    },
    {
      accessorKey: 'Setting', header: 'Setting',
      Cell: ({ row }) => (
        <IconButton onClick={() => toggleMenu(row.original._id)} style={{ color: "#2c59fa" }}>
          <CiMenuKebab style={{ fontSize: "25px" }} />
          {openMenuId === row.original._id && (
            <Box sx={{ position: 'absolute', zIndex: 1, backgroundColor: '#fff', boxShadow: 1, borderRadius: 1, p: 1, left: '30px', m: 2 }}>
              <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }} onClick={() => {
                handleEdit(row.original._id);

              }} >Edit</Typography>
              <Typography sx={{ fontSize: '12px', color: 'red', fontWeight: 'bold' }} onClick={() => handleDelete(row.original._id)} >Delete</Typography>
            </Box>
          )}
        </IconButton>
      ),

    },

  ], [openMenuId]);
  const table = useMaterialReactTable({
    columns,
    data: TaskTemplates,
    enableBottomToolbar: true,
    enableStickyHeader: true,
    columnFilterDisplayMode: "custom", // Render own filtering UI
    enableRowSelection: true, // Enable row selection
    enablePagination: true,
    muiTableContainerProps: { sx: { maxHeight: "400px" } },
    initialState: {
      columnPinning: { left: ["mrt-row-select", "tagName"], right: ['settings'], },
    },
    muiTableBodyCellProps: {
      sx: (theme) => ({
        backgroundColor: theme.palette.mode === "dark-theme" ? theme.palette.grey[900] : theme.palette.grey[50],
      }),
    },
  });

  const [templateNameError, setTemplateNameError] = useState('');
 
  const validateForm = () => {
    let isValid = true;
    if (!templatename) {
      setTemplateNameError("Name can't be blank");
      toast.error("Name can't be blank");
      isValid = false;
    } else {
      setTemplateNameError('');
    }
    
    return isValid;
  };


  const handleTaskCancel = () => {
    if (isFormDirty) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmClose) {
        return;
      }
    }
    setShowForm(false);
  };

  // Detect form changes
  useEffect(() => {
    if (templatename || priority || description || status || absoluteDate) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [templatename, priority, description, status, absoluteDate]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        {!showForm ? (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleCreateTask} sx={{ mb: 3 }}>
              Create Task Template
            </Button>
            {loading ? (
              <Box sx={{display:'flex',alignItems:'center', justifyContent:'center'}}> <CircularProgress style={{fontSize:'300px', color:'blue'}}/></Box>):( <MaterialReactTable columns={columns} table={table} />)
            }
            {/* <MaterialReactTable columns={columns} table={table} /> */}
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Box>
              <form>
                <Box className='box-b'>
                  <Typography variant='h5' gutterBottom>Create Task Template</Typography>
                  <Box mt={2} mb={2}><hr /></Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={5.8}>
                      <Box sx={{ width: '100%' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Box>
                              <label className='task-input-label' >Template Name</label>
                              <TextField
                                fullWidth
                                name="TemplateName"
                                placeholder="Template Name"
                                size="small"
                                sx={{
                                  background: '#fff', mt: 1,
                                }}
                                onChange={(e) => settemplatename(e.target.value)}
                                error={!!templateNameError}
                              />
                              {(!!templateNameError) && <Alert sx={{
                                width: '96%',
                                p: '0', // Adjust padding to control the size
                                pl: '4%', height: '23px',
                                borderRadius: '10px',
                                borderTopLeftRadius: '0',
                                borderTopRightRadius: '0',
                                fontSize: '15px',
                                display: 'flex',
                                alignItems: 'center', // Center content vertically
                                '& .MuiAlert-icon': {
                                  fontSize: '16px', // Adjust the size of the icon
                                  mr: '8px', // Add margin to the right of the icon
                                },
                              }} variant="filled" severity="error" >
                                Name can't be blank
                              </Alert>}
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box>
                              <Status onStatusChange={handleStatusChange} selectedStatus={status} />
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                      <Box sx={{ width: '100%' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Box>
                              <label className='task-input-label'>Task Assignee</label>
                              <Autocomplete
                                multiple
                                sx={{ background: '#fff', mt: 1, }}
                                options={options}
                                size='small'
                                getOptionLabel={(option) => option.label}
                                value={selectedUser}
                                onChange={handleUserChange}
                                renderOption={(props, option) => (
                                  <Box
                                    component="li"
                                    {...props}
                                    sx={{ cursor: 'pointer', margin: '5px 10px' }} // Add cursor pointer style
                                  >
                                    {option.label}
                                  </Box>
                                )}
                                renderInput={(params) => (
                                  <TextField {...params} variant="outlined" placeholder="Assignees" />
                                )}
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box>
                              <Priority onPriorityChange={handlePriorityChange} selectedPriority={priority} />
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                      <Box sx={{ mt: 3, mb: 7}}>
                        <Editor onChange={handleEditorChange} content={description} />
                      </Box>
                     
                      <Box mt={2}>
                        <label className='task-input-label'>Tags</label>
                        <Autocomplete
                          multiple
                          size='small'
                          id="tags-outlined"
                          options={tagsoptions}
                          getOptionLabel={(option) => option.label}
                          value={tagsoptions.filter(option => selectedTags.includes(option.value))}
                          onChange={handleTagChange}
                          renderTags={(selected, getTagProps) =>
                            selected.map((option, index) => (
                              <Chip
                                key={option.value}
                                label={option.label}
                                style={option.customTagStyle}
                                {...getTagProps({ index })}
                              />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              placeholder="Tags"
                              sx={{ width: '100%', marginTop: '8px', backgroundColor: '#fff' }}
                            />
                          )}
                          renderOption={(props, option) => (
                            <Box component="li" {...props} style={option.customStyle}>
                              {option.label}
                            </Box>
                          )}
                        />
                      </Box>
                      <Box mt={2}>
                        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                          <Typography variant='h6' className='task-input-label'>Start and Due Date</Typography>
                          <Box className='absolutes-dates'>
                            <FormControlLabel
                              control={




                                <Switch
                                  checked={absoluteDate}
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
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <Typography className='task-input-label'>Start Date</Typography>
                            <DatePicker
                              format="DD/MM/YYYY"
                              sx={{ width: '100%', backgroundColor: '#fff' }}
                              selected={startDate} onChange={handleStartDateChange}
                              renderInput={(params) => <TextField {...params} size="small"  />}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <Typography className='task-input-label'>Due Date</Typography>
                            <DatePicker
                              format="DD/MM/YYYY"
                              sx={{ width: '100%', backgroundColor: '#fff' }}
                              selected={dueDate} onChange={handleDueDateChange}
                              renderInput={(params) => <TextField {...params} size="small" />}
                            />
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
                              <TextField
                                size="small"
                                placeholder='0'
                                defaultValue={0}
                                value={startsin}
                                sx={{ background: "#fff", width: '100%' }}
                                onChange={(e) => setstartsin(e.target.value)}
                               
                              />
                              
                            </Grid>
                            <Grid item xs={12} sm={5}>
                              <Autocomplete
                                options={dayOptions}
                                size="small"
                                getOptionLabel={(option) => option.label}
                                onChange={handleStartInDateChange}
                                renderInput={(params) => (
                                  <>
                                    <TextField
                                      {...params}
                                      variant="outlined"
                                      sx={{ backgroundColor: "#fff" }}
                                      
                                    />
                                    
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
                              <TextField
                                size="small"
                                placeholder='0'
                                value={duein}
                                fullWidth
                                
                                sx={{ background: '#fff', }}
                                onChange={(e) => setduein(e.target.value)}
                              />
                              
                            </Grid>
                            <Grid item xs={12} sm={5}>
                              <Autocomplete
                                options={dayOptions}
                                getOptionLabel={(option) => option.label}
                                onChange={handledueindateChange}
                                size='small'
                                renderInput={(params) => (
                                  <>
                                    <TextField {...params} variant="outlined" sx={{ backgroundColor: '#fff' }}  />
                                   
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
                    <Grid item xs={12} sm={0.4} sx={{ display: { xs: 'none', sm: 'block' } }}>
                      <Box
                        sx={{
                          borderLeft: '1px solid black',
                          height: '100%',
                          ml: 1.5
                        }}
                      >

                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={5.8} >
                      <div className="B">

                        <DragDropContext onDragEnd={handleDragEnd}>

                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant='h6'>Subtasks</Typography>
                            <FormControlLabel
                              control={
                                <Switch onChange={(event) => handleSubtaskSwitch(event.target.checked)} checked={SubtaskSwitch} color="primary" />
                              }

                            />
                          </Box>
                         
                          {SubtaskSwitch && (
                            <Droppable droppableId="subtaskList">
                              {(provided) => (
                                <div className="subtask-input" {...provided.droppableProps} ref={provided.innerRef}>

                                  {(subtasks.length > 0 ? subtasks : [{ id: 'default', text: '' }]).map((subtask, index) => (
                                    <Draggable key={subtask.id} draggableId={subtask.id} index={index}>
                                      {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>

                                          <Box display="flex" gap="30px" alignItems="center">
                                            <Checkbox
                                              style={{ cursor: 'pointer' }}
                                              // checked={subtask.checked}
                                              checked={checkedSubtasks.includes(subtask.id)}
                                              onChange={() => handleCheckboxChange(subtask.id, subtask.checked)}
                                            />
                                            <TextField
                                              placeholder="Things To do"
                                              value={subtask.text}
                                              size='small'
                                              margin='normal'
                                              fullWidth
                                              onChange={(e) => handleInputChange(subtask.id, e.target.value)}
                                              variant="outlined"
                                            />
                                            <IconButton onClick={() => handleDeleteSubtask(subtask.id)} style={{ cursor: 'pointer' }}>
                                              <RiDeleteBin6Line />
                                            </IconButton>
                                            <IconButton style={{ cursor: 'move' }}>
                                              <PiDotsSixVerticalBold />
                                            </IconButton>
                                          </Box>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}

                                  {provided.placeholder}
                                  <Box sx={{ cursor: 'pointer' }} onClick={handleAddSubtask} style={{ margin: "10px", color: "#1976d3" }}>
                                    <FiPlusCircle /> Add Subtasks
                                  </Box>
                                </div>
                              )}
                            </Droppable>
                          )}

                        </DragDropContext>
                      </div>
                    </Grid>
                  </Grid>
                  <Box mt={2} mb={2}><hr /></Box>
                  <Box sx={{ pt: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Button variant="contained" color="primary" onClick={createTaskTemp}>Save & exit</Button>
                    <Button variant="contained" color="primary" onClick={createSaveTaskTemp}>Save</Button>
                    <Button variant="outlined" onClick={handleTaskCancel}>Cancel</Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Box>
        )}
      </Container>
    </LocalizationProvider>
  );
};
export default Tasks;