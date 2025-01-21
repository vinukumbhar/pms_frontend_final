// import React, { useState, useEffect } from 'react';


// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import {
//     Box,
//     Button,
//     Typography,
//     Container,

//     Autocomplete,
//     TextField,
//     Dialog, DialogActions, DialogContent, DialogTitle,

//     Switch,
//     FormControlLabel,
//     Chip

// } from '@mui/material';
// import { toast } from "react-toastify";
// import { useNavigate, useParams } from "react-router-dom";
// import Editor from '../Texteditor/Editor';
// import Grid from '@mui/material/Unstable_Grid2';
// import Priority from '../Priority/Priority';
// import Status from '../Status/Status';
// import dayjs from 'dayjs';

// const Tasks = () => {
//     const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
//     const USER_API = process.env.REACT_APP_USER_URL;
//     const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;



//     const navigate = useNavigate();
//     const { _id } = useParams();
//     const [tempNameNew, setTempNameNew] = useState("");
//     const [tagsNew, setTagsNew] = useState([]);
//     const [AssigneesNew, setAssigneesNew] = useState([]);
//     const [absoluteDate, setAbsoluteDates] = useState(false);
//     const [priority, setPriority] = useState('');
//     const [status, setStatus] = useState('');
//     const [StartsDateNew, setStartsDateNew] = useState(null);
//     const [DueDateNew, setDueDateNew] = useState(null);
//     const [StartsInDurationNew, setStartsInDurationNew] = useState();
//     const [DueInDurationNew, setDueInDurationNew] = useState();
//     const [StartsInNew, setStartsInNew] = useState();
//     const [DueInNew, setDueInNew] = useState();
//     const handleStartDateChange = (date) => {
//         setStartsDateNew(date);
//     };
//     const handleDueDateChange = (date) => {
//         setDueDateNew(date);
//     };
//     const handleAbsolutesDates = (checked) => {
//         setAbsoluteDates(checked);
//     };
//     const dayOptions = [
//         { label: "Days", value: "Days" },
//         { label: "Months", value: "Months" },
//         { label: "Years", value: "Years" },
//     ];
//     const handlePriorityChange = (priority) => {
//         setPriority(priority);
//     };
//     const handleStatusChange = (status) => {
//         setStatus(status);
//         console.log(status)
//     };
//     // const [description, setDescription] = useState('');
//     const handleEditorChange = (content) => {
//         setTaskDescription(content);
//     };
//     const [taskDiscription, setTaskDescription] = useState();
//     const [combinedValues, setCombinedValues] = useState([]);
//     const [userData, setUserData] = useState([]);
//     useEffect(() => {
//         fetchData();
//     }, []);

//     const fetchData = async () => {
//         try {
//             const url = `${USER_API}/api/auth/users`;
//             const response = await fetch(url);
//             const data = await response.json();
//             setUserData(data);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };
//     const options = userData.map((user) => ({
//         value: user._id,
//         label: user.username,
//     }));
//     const handleuserChange = (event, newValue) => {
//         setAssigneesNew(newValue);
//         // Map selected options to their values and send as an array
//         const selectedValues = newValue.map((option) => option.value);
//         // console.log(selectedValues);
//         setCombinedValues(selectedValues);
//     };

//     //Tag FetchData ================
//     const [tags, setTags] = useState([]);
//     const [combinedTagsValues, setCombinedTagsValues] = useState([]);
//     useEffect(() => {
//         fetchTagData();
//     }, []);

//     const fetchTagData = async () => {
//         try {

//             const url = `${TAGS_API}/tags/`;

//             const response = await fetch(url);
//             const data = await response.json();
//             setTags(data.tags);
//             //   console.log(data.tags)
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };
//     //  for tags
//     const calculateWidth = (tagName) => {

//         const baseWidth = 10; // base width for each tag
//         const charWidth = 8; // approximate width of each character
//         const padding = 10; // padding on either side
//         return baseWidth + (charWidth * tagName.length) + padding;
//     };
//     const tagsoptions = tags.map((tag) => ({
//         value: tag._id,
//         label: tag.tagName,
//         colour: tag.tagColour,

//         customStyle: {
//             backgroundColor: tag.tagColour,
//             color: "#fff",
//             borderRadius: "8px",
//             alignItems: "center",
//             textAlign: "center",
//             marginBottom: "5px",
//             padding: "2px,8px",
//             fontSize: '10px',
//             width: `${calculateWidth(tag.tagName)}px`,
//             margin: '7px', cursor: 'pointer',
//         },
//         customTagStyle: {
//             backgroundColor: tag.tagColour,
//             color: "#fff",
//             alignItems: "center",
//             textAlign: "center",
//             padding: "2px,8px",
//             fontSize: '10px',
//             cursor: 'pointer',
//         },
//     }));

//     const handleTagChange = (event, newValue) => {
//         setTagsNew(newValue);
//         // Map selected options to their values and send as an array
//         const selectedTagsValues = newValue.map((option) => option.value);
//         // console.log(selectedTagsValues);
//         setCombinedTagsValues(selectedTagsValues);
//     };
//     const [tempvalues, setTempValues] = useState();
//     useEffect(() => {
//         fetchidwiseData();
//     }, []);

//     //get id wise template Record
//     const fetchidwiseData = async () => {
//         try {
//             const url = `${TASK_API}/workflow/tasks/tasktemplate/tasktemplatebyid/`;
//             const response = await fetch(url + _id);
//             if (!response.ok) {
//                 throw new Error("Failed to fetch data");
//             }
//             const data = await response.json();
//             // Extract and process assigneesData
//             if (data.taskTemplate && (data.taskTemplate.taskassignees)) {
//                 const innerArray = data.taskTemplate.taskassignees[0]; // Extract the inner array

//                 if ((innerArray)) {
//                     // console.log("Task Assignees:", innerArray);

//                     const assigneesData = innerArray.map((assignee) => ({
//                         value: assignee._id,
//                         label: assignee.username,
//                     }));
//                     // console.log("Assignees Data:", assigneesData); // Log the processed assigneesData

//                     setAssigneesNew(assigneesData);

//                     const selectedValues = assigneesData.map((option) => option.value);
//                     setCombinedValues(selectedValues);
//                     // console.log("Selected Assignees:", selectedValues);
//                 } else {
//                     console.log("taskassignees contains an unexpected structure.");
//                 }
//             }
//             // Process tasktags
//             if (data.taskTemplate.tasktags && Array.isArray(data.taskTemplate.tasktags)) {
//                 const tagsData = data.taskTemplate.tasktags.map((tag) => ({
//                     value: tag._id,
//                     label: tag.tagName,
//                     color: tag.tagColour, // Include color if needed
//                     customTagStyle: {
//                         backgroundColor: tag.tagColour,
//                         color: "#fff",
//                         borderRadius: "30px",
//                         alignItems: "center",
//                         textAlign: "center",
//                         marginBottom: "5px",
//                         padding: "2px,8px",
//                         fontSize: '10px',
//                         // width: `${calculateWidth(tag.tagName)}px`,
//                         margin: '7px', cursor: 'pointer',
//                     }
//                 }));
//                 // console.log("Tags Data:", tagsData); // Log the processed tagsData

//                 setTagsNew(tagsData); // Assuming you have a setTags function to update your state
//                 const selectedTagsValues = tagsData.map((option) => option.value);
//                 setCombinedTagsValues(selectedTagsValues);
//             } else {
//                 console.log("tasktags is not defined or not an array.");
//             }

//             setTempValues(data.taskTemplate);
//             tempallvalue();
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };
//     useEffect(() => {
//         if (tempvalues) {
//             tempallvalue();
//         }
//     }, [tempvalues]);
//     const tempallvalue = () => {
//         if (tempvalues) {
//             setTempNameNew(tempvalues.templatename || '');
//             setStatus(tempvalues.status || '');

//             setTaskDescription(tempvalues.description || '');
//             setPriority(tempvalues.priority || '');
//             setStartsInNew(tempvalues.startsin || '');
//             setDueInNew(tempvalues.duein || '');
//             setStartsDateNew(dayjs(tempvalues.startdate) || null);
//             setDueDateNew(dayjs(tempvalues.enddate) || null);
//             setStartsInDurationNew(tempvalues.startsinduration || '');
//             setDueInDurationNew(tempvalues.dueinduration || '');
//             setAbsoluteDates(tempvalues.absolutedates || false);
//         }
//     };
//     const updatetasktemp = () => {
//         const myHeaders = new Headers();
//         myHeaders.append("Content-Type", "application/json");

//         const raw = JSON.stringify({
//             templatename: tempNameNew,
//             status: status.value,
//             tasktags: combinedTagsValues,
//             taskassignees: combinedValues,

//             priority: priority.value,
//             description: taskDiscription,
//             absolutedates: absoluteDate,
//             startsin: StartsInNew,
//             startsinduration: StartsInDurationNew,
//             duein: DueInNew,
//             dueinduration: DueInDurationNew,
//             comments: "",
//             startdate: StartsDateNew,
//             enddate: DueDateNew,
//         });

//         const requestOptions = {
//             method: "PATCH",
//             headers: myHeaders,
//             body: raw,
//             redirect: "follow",
//         };
//         const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
//         fetch(url + _id, requestOptions)
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error("Network response was not ok");
//                 }
//                 return response.text();
//             })
//             .then((result) => {
//                 toast.success("Task Template updated successfully");
//                 navigate("/firmtemp/templates/tasks")

//             })
//             .catch((error) => {
//                 // Handle errors
//                 console.error(error);
//                 toast.error("Failed to create Job Template");
//             });
//     };
// const updatesavetasktemp= () => {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//         templatename: tempNameNew,
//         status: status.value,
//         tasktags: combinedTagsValues,
//         taskassignees: combinedValues,

//         priority: priority.value,
//         description: taskDiscription,
//         absolutedates: absoluteDate,
//         startsin: StartsInNew,
//         startsinduration: StartsInDurationNew,
//         duein: DueInNew,
//         dueinduration: DueInDurationNew,
//         comments: "",
//         startdate: StartsDateNew,
//         enddate: DueDateNew,
//     });

//     const requestOptions = {
//         method: "PATCH",
//         headers: myHeaders,
//         body: raw,
//         redirect: "follow",
//     };
//     const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
//     fetch(url + _id, requestOptions)
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error("Network response was not ok");
//             }
//             return response.text();
//         })
//         .then((result) => {
//             toast.success("Task Template updated successfully");


//         })
//         .catch((error) => {
//             // Handle errors
//             console.error(error);
//             toast.error("Failed to create Job Template");
//         });
// };
//     const handleTaskTempCancle = () => {
//         const hasUnsavedChanges =
//             tempNameNew !== tempvalues.templatename ||
//             status !== tempvalues.status ||
//             taskDiscription !== tempvalues.description ||
//             priority !== tempvalues.priority ||
//             AssigneesNew.length !== tempvalues.taskassignees?.length ||
//             tagsNew.length !== tempvalues.tasktags?.length ||
//             absoluteDate !== tempvalues.absolutedates ||
//             StartsDateNew !== dayjs(tempvalues.startdate) ||
//             DueDateNew !== dayjs(tempvalues.enddate);

//         if (hasUnsavedChanges) {
//             if (window.confirm("You have unsaved changes. Are you sure you want to leave without saving?")) {
//                 navigate("/firmtemp/templates/tasks");
//             }
//         } else {
//             navigate("/firmtemp/templates/tasks");
//         }
//     };
//     return (
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <Container>
//                 <Box sx={{ mt: 2 }}>
//                     <Box>
//                         <form>
//                             <Box className='box-b'>
//                                 <Typography variant='h5' gutterBottom>Edit Task Template</Typography>
//                                 <Box mt={2} mb={2}><hr /></Box>
//                                 <Grid container spacing={2}>
//                                     <Grid item xs={12} sm={5.8}>

//                                         <Box sx={{ width: '100%' }}>
//                                             <Grid container spacing={2}>
//                                                 <Grid item xs={12} sm={6}>
//                                                     <Box>
//                                                         <label className='task-input-label' >Template Name</label>
//                                                         <TextField
//                                                             fullWidth
//                                                             name="TemplateName"
//                                                             placeholder="Template Name"
//                                                             size="small"
//                                                             sx={{ background: '#fff', mt: 1 }}
//                                                             onChange={(e) => setTempNameNew(e.target.value)} value={tempNameNew}
//                                                         />
//                                                     </Box>
//                                                 </Grid>
//                                                 <Grid item xs={12} sm={6}>
//                                                     <Box>
//                                                         <Status onStatusChange={handleStatusChange} selectedStatus={status} />
//                                                     </Box>
//                                                 </Grid>
//                                             </Grid>
//                                         </Box>
//                                         <Box sx={{ width: '100%' }}>
//                                             <Grid container spacing={2}>
//                                                 <Grid item xs={12} sm={6}>
//                                                     <Box>
//                                                         <label className='task-input-label'>Task Assignee</label>
//                                                         <Autocomplete
//                                                             multiple
//                                                             sx={{ mt: 2 }}
//                                                             options={options}
//                                                             size='small'
//                                                             getOptionLabel={(option) => option.label}
//                                                             value={AssigneesNew}
//                                                             onChange={handleuserChange}
//                                                             renderOption={(props, option) => (
//                                                                 <Box
//                                                                     component="li"
//                                                                     {...props}
//                                                                     sx={{ cursor: 'pointer', margin: '5px 10px' }} // Add cursor pointer style
//                                                                 >
//                                                                     {option.label}
//                                                                 </Box>
//                                                             )}
//                                                             renderInput={(params) => (
//                                                                 <TextField {...params} variant="outlined" placeholder="Assignees" />
//                                                             )}
//                                                             isOptionEqualToValue={(option, value) => option.value === value.value}
//                                                         />
//                                                     </Box>
//                                                 </Grid>
//                                                 <Grid item xs={12} sm={6}>
//                                                     <Box>
//                                                         <Priority onPriorityChange={handlePriorityChange} selectedPriority={priority} />
//                                                     </Box>
//                                                 </Grid>
//                                             </Grid>
//                                         </Box>
//                                         <Box sx={{ mt: 3, }}>
//                                             <Editor
//                                                 initialContent={taskDiscription} onChange={handleEditorChange}
//                                             />
//                                         </Box>
//                                         <Box mt={2}>
//                                             <label className='task-input-label'>Tags</label>
//                                             <Autocomplete
//                                                 multiple
//                                                 size='small'
//                                                 id="tags-outlined"
//                                                 options={tagsoptions}
//                                                 getOptionLabel={(option) => option.label}
//                                                 value={tagsNew}
//                                                 onChange={handleTagChange}
//                                                 renderTags={(selected, getTagProps) =>
//                                                     selected.map((option, index) => (
//                                                         <Chip
//                                                             key={option.value}
//                                                             label={option.label}
//                                                             style={option.customTagStyle}
//                                                             {...getTagProps({ index })}
//                                                         />
//                                                     ))
//                                                 }
//                                                 renderInput={(params) => (
//                                                     <TextField
//                                                         {...params}
//                                                         variant="outlined"

//                                                         placeholder="Tags"
//                                                         sx={{ width: '100%', marginTop: '8px', backgroundColor: '#fff' }}
//                                                     />
//                                                 )}
//                                                 renderOption={(props, option) => (
//                                                     <Box component="li" {...props} style={option.customStyle}>
//                                                         {option.label}
//                                                     </Box>
//                                                 )}
//                                                 isOptionEqualToValue={(option, value) => option.value === value.value}
//                                             />
//                                         </Box>
//                                         <Box mt={2}>
//                                             <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
//                                                 <Typography variant='h6' className='task-input-label'>Start and Due Date</Typography>
//                                                 <Box className='absolutes-dates'>
//                                                     <FormControlLabel
//                                                         control={
//                                                             <Switch
//                                                                 checked={absoluteDate}
//                                                                 onChange={(event) => handleAbsolutesDates(event.target.checked)}
//                                                                 color="primary"
//                                                             />
//                                                         }
//                                                         label={"Absolute Date"}
//                                                     />
//                                                 </Box>
//                                             </Box>
//                                         </Box>
//                                         {absoluteDate && (
//                                             <>
//                                                 <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
//                                                     <Typography className='task-input-label'>Start Date</Typography>
//                                                     <DatePicker
//                                                         format="DD/MM/YYYY"
//                                                         sx={{ width: '100%', backgroundColor: '#fff' }}
//                                                         value={StartsDateNew} onChange={handleStartDateChange}
//                                                         renderInput={(params) => <TextField {...params} size="small" />}
//                                                     />
//                                                 </Box>
//                                                 <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
//                                                     <Typography className='task-input-label'>Due Date</Typography>
//                                                     <DatePicker
//                                                         format="DD/MM/YYYY"
//                                                         sx={{ width: '100%', backgroundColor: '#fff' }}
//                                                         value={DueDateNew} onChange={handleDueDateChange}
//                                                         renderInput={(params) => <TextField {...params} size="small" />}
//                                                     />
//                                                 </Box>
//                                             </>
//                                         )}
//                                         {!absoluteDate && (
//                                             <>
//                                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                                                     <Typography className='task-input-label'>Start In</Typography>
//                                                     <TextField
//                                                         size='small'
//                                                         margin='normal'
//                                                         fullWidth
//                                                         defaultValue={0}

//                                                         sx={{ background: '#fff', ml: 1.5 }}
//                                                         value={StartsInNew}
//                                                         onChange={(e) => setStartsInNew(e.target.value)}
//                                                     />
//                                                     <Autocomplete
//                                                         options={dayOptions}
//                                                         size="small"
//                                                         getOptionLabel={(option) => option.label}
//                                                         onChange={(event, newValue) => {
//                                                             if (newValue) {
//                                                                 setStartsInDurationNew(newValue.value); // Update the duration state
//                                                                 // Update the TextField state with the selected option's label
//                                                             }
//                                                         }}
//                                                         renderInput={(params) => <TextField {...params} variant="outlined" />}
//                                                         value={dayOptions.find((option) => option.value === StartsInDurationNew) || null}
//                                                         className="job-template-select-dropdown"
//                                                     />
//                                                 </Box>
//                                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                                                     <Typography className='task-input-label'>Due In</Typography>
//                                                     <TextField
//                                                         size='small'
//                                                         margin='normal'
//                                                         value={DueInNew}
//                                                         onChange={(e) => setDueInNew(e.target.value)}
//                                                         fullWidth
//                                                         defaultValue={0}

//                                                         sx={{ background: '#fff', ml: 1.8, }}

//                                                     />

//                                                     <Autocomplete
//                                                         options={dayOptions}
//                                                         size="small"
//                                                         getOptionLabel={(option) => option.label}
//                                                         onChange={(event, newValue) => {
//                                                             if (newValue) {
//                                                                 setDueInDurationNew(newValue.value); // Update the duration state
//                                                                 // Update the TextField state with the selected option's label
//                                                             }
//                                                         }}
//                                                         renderInput={(params) => <TextField {...params} variant="outlined" />}
//                                                         value={dayOptions.find((option) => option.value === DueInDurationNew) || null}
//                                                         className="job-template-select-dropdown"
//                                                     />
//                                                 </Box>
//                                             </>
//                                         )}
//                                     </Grid>
//                                     <Grid item xs={12} sm={0.4} sx={{ display: { xs: 'none', sm: 'block' } }}>
//                                         <Box
//                                             sx={{
//                                                 borderLeft: '1px solid black',
//                                                 height: '100%',
//                                                 ml: 1.5
//                                             }}
//                                         ></Box>
//                                     </Grid>
//                                     <Grid item xs={12} sm={5.8} >
//                                     </Grid>
//                                 </Grid>
//                                 <Box mt={2} mb={2}><hr /></Box>
//                                 <Box sx={{ pt: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
//                                 <Button variant="contained" color="primary" onClick={updatetasktemp} >Save & exit</Button>
//                                     <Button variant="contained" color="primary" onClick={updatesavetasktemp} >Save</Button>
//                                     <Button variant="outlined" onClick={handleTaskTempCancle}>Cancel</Button>
//                                 </Box>
//                             </Box>
//                         </form>
//                     </Box>
//                 </Box>

//             </Container>
//         </LocalizationProvider>
//     );
// };

// export default Tasks;


import React, { useState, useEffect } from 'react';


import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
    Box,
    Button,
    Typography,
    Container,
    Autocomplete,
    TextField,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Switch,
    FormControlLabel,
    Chip,
    IconButton,
    Checkbox

} from '@mui/material';
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Editor from '../Texteditor/Editor';
import Grid from '@mui/material/Unstable_Grid2';
import Priority from '../Priority/Priority';
import Status from '../Status/Status';
import dayjs from 'dayjs';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PiDotsSixVerticalBold } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiPlusCircle } from "react-icons/fi";

const Tasks = () => {
    const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
    const USER_API = process.env.REACT_APP_USER_URL;
    const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;

    const navigate = useNavigate();
    const { _id } = useParams();
    console.log(_id)
    const [tempNameNew, setTempNameNew] = useState("");
    const [tagsNew, setTagsNew] = useState([]);
    const [AssigneesNew, setAssigneesNew] = useState([]);
    const [absoluteDate, setAbsoluteDates] = useState(false);
    const [priority, setPriority] = useState('');
    const [status, setStatus] = useState('');
    const [StartsDateNew, setStartsDateNew] = useState(null);
    const [DueDateNew, setDueDateNew] = useState(null);
    const [StartsInDurationNew, setStartsInDurationNew] = useState();
    const [DueInDurationNew, setDueInDurationNew] = useState();
    const [StartsInNew, setStartsInNew] = useState();
    const [DueInNew, setDueInNew] = useState();
    const [subtasks, setSubtasks] = useState([]);
    const [checkedSubtasks, setCheckedSubtasks] = useState([]);

    // const handleCheckboxChange = (subtaskId) => {
    //     // Check if the subtask is already checked
    //     const isChecked = checkedSubtasks.includes(subtaskId);
    
    //     // Update the checkedSubtasks array
    //     const newCheckedSubtasks = isChecked
    //         ? checkedSubtasks.filter(id => id !== subtaskId) // Remove from checkedSubtasks if already checked
    //         : [...checkedSubtasks, subtaskId]; // Add to checkedSubtasks if not checked
    
    //     // Update only the checked state of the specific subtask being changed
    //     const updatedSubtasks = subtasks.map(subtask => 
    //         subtask.id === subtaskId 
    //             ? { ...subtask, checked: !isChecked } // Toggle the checked state
    //             : subtask // Keep other subtasks the same
    //     );
    
    //     console.log("Before update:", { checkedSubtasks, subtasks });
    //     setCheckedSubtasks(newCheckedSubtasks);
    //     setSubtasks(updatedSubtasks);
    //     console.log("After update:", { newCheckedSubtasks, updatedSubtasks });
    // };
    // const handleCheckboxChange = (subtaskId) => {
    //     setCheckedSubtasks(prevCheckedSubtasks => {
    //         const isChecked = prevCheckedSubtasks.includes(subtaskId);
    
    //         // Update the checkedSubtasks array
    //         const newCheckedSubtasks = isChecked
    //             ? prevCheckedSubtasks.filter(id => id !== subtaskId) // Remove if already checked
    //             : [...prevCheckedSubtasks, subtaskId]; // Add if not checked
    
    //         return newCheckedSubtasks;
    //     });
    
    //     setSubtasks(prevSubtasks => 
    //         prevSubtasks.map(subtask => 
    //             subtask.id === subtaskId 
    //                 ? { ...subtask, checked: !subtask.checked } // Toggle checked state
    //                 : subtask
    //         )
    //     );
    // };
    
    // const handleCheckboxChange = (subtaskId) => {
    //     // Update only the checked state of the specific subtask being changed
    //     setSubtasks(prevSubtasks => 
    //         prevSubtasks.map(subtask => 
    //             subtask.id === subtaskId 
    //                 ? { ...subtask, checked: !subtask.checked } // Toggle checked state for the clicked subtask
    //                 : subtask // Keep other subtasks the same
    //         )
    //     );
    
    //     setCheckedSubtasks(prevCheckedSubtasks => {
    //         const isChecked = prevCheckedSubtasks.includes(subtaskId);
    
    //         // Only add the subtask if it is not already checked
    //         if (!isChecked) {
    //             return [...prevCheckedSubtasks, subtaskId]; // Add if not checked
    //         }
    
    //         // If it is already checked, just return the previous state
    //         return prevCheckedSubtasks; 
    //     });
    // };
    
    const handleCheckboxChange = (subtaskId) => {
        // Update only the checked state of the specific subtask being changed
        setSubtasks(prevSubtasks => 
            prevSubtasks.map(subtask => 
                subtask.id === subtaskId 
                    ? { ...subtask, checked: !subtask.checked } // Toggle checked state for the clicked subtask
                    : subtask // Keep other subtasks the same
            )
        );
    
        // Update checkedSubtasks to only reflect the clicked subtask's change
        setCheckedSubtasks(prevCheckedSubtasks => {
            // const isChecked = prevCheckedSubtasks.includes(subtaskId);
    
            // If the subtask is already checked, we want to remove it from the list
            // if (isChecked) {
            //     return prevCheckedSubtasks.filter(id => id !== subtaskId); // Remove if already checked
            // }
    
            // If it is not checked, we add it to the checked list
            return [...prevCheckedSubtasks, subtaskId]; // Add if not checked
        });
    };
    
  
   
    
    // Optional: Use useEffect to log after state updates
    useEffect(() => {
        console.log("Updated checkedSubtasks:", checkedSubtasks);
        console.log("Updated subtasks:", subtasks);
    }, [checkedSubtasks, subtasks]);
    
    
    // const handleCheckboxChange = (subtaskId) => {
    //     const isChecked = checkedSubtasks.includes(subtaskId);
    //     const newCheckedSubtasks = isChecked
    //         ? checkedSubtasks.filter(id => id !== subtaskId)
    //         : [...checkedSubtasks, subtaskId];
    
    //     const updatedSubtasks = subtasks.map(subtask => ({
    //         ...subtask,
    //         checked: newCheckedSubtasks.includes(subtask.id)
    //     }));
    
    //     console.log("Before update:", { checkedSubtasks, subtasks });
    //     setCheckedSubtasks(newCheckedSubtasks);
    //     setSubtasks(updatedSubtasks);
    //     console.log("After update:", { newCheckedSubtasks, updatedSubtasks });
    // };
    

    

    const handleAddSubtask = () => {
        const newId = String(subtasks.length + 1);
        setSubtasks([...subtasks, { id: newId, text: "" }]);
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


    const handleInputChange = (id, value) => {
        setSubtasks(subtasks.map((subtask) => (subtask.id === id ? { ...subtask, text: value } : subtask)));
    };

    const handleDeleteSubtask = (id) => {
        setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
    };

    const [SubtaskSwitch, setSubtaskSwitch] = useState(false);
    const handleSubtaskSwitch = (checked) => {
        setSubtaskSwitch(checked);
    };

    const handleStartDateChange = (date) => {
        setStartsDateNew(date);
    };
    const handleDueDateChange = (date) => {
        setDueDateNew(date);
    };
    const handleAbsolutesDates = (checked) => {
        setAbsoluteDates(checked);
    };
    const dayOptions = [
        { label: "Days", value: "Days" },
        { label: "Months", value: "Months" },
        { label: "Years", value: "Years" },
    ];
    const handlePriorityChange = (priority) => {
        setPriority(priority);
    };
    const handleStatusChange = (status) => {
        setStatus(status);
        console.log(status)
    };
    // const [description, setDescription] = useState('');
    const handleEditorChange = (content) => {
        setTaskDescription(content);
    };
    const [taskDiscription, setTaskDescription] = useState();
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
    const handleuserChange = (event, newValue) => {
        setAssigneesNew(newValue);
        // Map selected options to their values and send as an array
        const selectedValues = newValue.map((option) => option.value);
        // console.log(selectedValues);
        setCombinedValues(selectedValues);
    };

    //Tag FetchData ================
    const [tags, setTags] = useState([]);
    const [combinedTagsValues, setCombinedTagsValues] = useState([]);
    useEffect(() => {
        fetchTagData();
    }, []);

    const fetchTagData = async () => {
        try {

            const url = ` ${TAGS_API}/tags/`;

            const response = await fetch(url);
            const data = await response.json();
            setTags(data.tags);
            //   console.log(data.tags)
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
        setTagsNew(newValue);
        // Map selected options to their values and send as an array
        const selectedTagsValues = newValue.map((option) => option.value);
        // console.log(selectedTagsValues);
        setCombinedTagsValues(selectedTagsValues);
    };
    const [tempvalues, setTempValues] = useState();
    useEffect(() => {
        fetchidwiseData(_id);
    }, []);
    // const [subtasksNew, setSubtasksNew] = useState([]);

    //get id wise template Record
    const fetchidwiseData = async (_id) => {
        try {
            const url = `${TASK_API}/workflow/tasks/tasktemplate/tasktemplatebyid/${_id}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            // Extract and process assigneesData
            if (data.taskTemplate && (data.taskTemplate.taskassignees)) {
                const innerArray = data.taskTemplate.taskassignees[0]; // Extract the inner array

                if ((innerArray)) {
                    // console.log("Task Assignees:", innerArray);

                    const assigneesData = innerArray.map((assignee) => ({
                        value: assignee._id,
                        label: assignee.username,
                    }));
                    // console.log("Assignees Data:", assigneesData); // Log the processed assigneesData

                    setAssigneesNew(assigneesData);

                    const selectedValues = assigneesData.map((option) => option.value);
                    setCombinedValues(selectedValues);
                    // console.log("Selected Assignees:", selectedValues);
                } else {
                    console.log("taskassignees contains an unexpected structure.");
                }
            }
            // Process tasktags
            if (data.taskTemplate.tasktags && Array.isArray(data.taskTemplate.tasktags)) {
                const tagsData = data.taskTemplate.tasktags.map((tag) => ({
                    value: tag._id,
                    label: tag.tagName,
                    color: tag.tagColour, // Include color if needed
                    customTagStyle: {
                        backgroundColor: tag.tagColour,
                        color: "#fff",
                        borderRadius: "30px",
                        alignItems: "center",
                        textAlign: "center",
                        marginBottom: "5px",
                        padding: "2px,8px",
                        fontSize: '10px',
                        // width: ${calculateWidth(tag.tagName)}px,
                        margin: '7px', cursor: 'pointer',
                    }
                }));
                // console.log("Tags Data:", tagsData); // Log the processed tagsData

                setTagsNew(tagsData); // Assuming you have a setTags function to update your state
                const selectedTagsValues = tagsData.map((option) => option.value);
                setCombinedTagsValues(selectedTagsValues);
            } else {
                console.log("tasktags is not defined or not an array.");
            }

            setTempValues(data.taskTemplate);
            tempallvalue();

            // Extract and process subtasks
            if (data.taskTemplate.subtasks && Array.isArray(data.taskTemplate.subtasks)) {
                const subtasksText = data.taskTemplate.subtasks.map(subtask => subtask.text);
                console.log("Subtasks Text:", subtasksText); // Log the extracted subtasks text

                setSubtasks(subtasksText); // Assuming you have a state setter for this
            } else {
                console.log("subtasks is not defined or not an array.");
            }
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
        if (tempvalues) {
            console.log(tempvalues);
            setTempNameNew(tempvalues.templatename || '');
            setStatus(tempvalues.status || '');
            setTaskDescription(tempvalues.description || '');
            setPriority(tempvalues.priority || '');
            setStartsInNew(tempvalues.startsin || '');
            setDueInNew(tempvalues.duein || '');
            setStartsDateNew(dayjs(tempvalues.startdate) || null);
            setDueDateNew(dayjs(tempvalues.enddate) || null);
            setStartsInDurationNew(tempvalues.startsinduration || '');
            setDueInDurationNew(tempvalues.dueinduration || '');
            setAbsoluteDates(tempvalues.absolutedates || false);
            setSubtaskSwitch(tempvalues.issubtaskschecked || false);
            // console.log(tempvalues.isclienttaskchecked)
            setSubtasks(tempvalues.subtasks)
        }
    };

    const updatetasktemp = () => {
        console.log(_id)
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // const subtaskData = subtasks.map(({ id, text, checked }) => ({ id, text, checked })); // Prepare subtasks data
        const subtaskData = subtasks.map(({ id, text, checked }) => ({
            id,
            text,
            checked: checked !== undefined ? checked : false // Ensure checked is either true or false
        }));

        console.log(subtaskData);
        const raw = JSON.stringify({
            templatename: tempNameNew,
            status: status.value,
            tasktags: combinedTagsValues,
            taskassignees: combinedValues,
            priority: priority.value,
            description: taskDiscription,
            absolutedates: absoluteDate,
            startsin: StartsInNew,
            startsinduration: StartsInDurationNew,
            duein: DueInNew,
            dueinduration: DueInDurationNew,
            comments: "",
            startdate: StartsDateNew,
            enddate: DueDateNew,
            subtasks: subtaskData,
            issubtaskschecked: SubtaskSwitch
        });
        console.log(raw)
        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
        const url = `${TASK_API}/workflow/tasks/tasktemplate/${_id}`;
        console.log(url)
        fetch(url, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then((result) => {
                console.log(result)
                toast.success("Task Template updated successfully");
                navigate("/firmtemp/templates/tasks")

            })
            .catch((error) => {
                // Handle errors
                console.error(error);
                toast.error("Failed to create Job Template");
            });
    };
    console.log(subtasks)
    const updatesavetasktemp = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // const subtaskData = subtasks.map(({ id, text, checked }) => ({ id, text, checked })); // Prepare subtasks data
        const subtaskData = subtasks.map(({ id, text, checked }) => ({
            id,
            text,
            checked: checked !== undefined ? checked : false // Ensure checked is either true or false
        }));

        console.log(subtaskData);
        const raw = JSON.stringify({
            templatename: tempNameNew,
            status: status.value,
            tasktags: combinedTagsValues,
            taskassignees: combinedValues,

            priority: priority.value,
            description: taskDiscription,
            absolutedates: absoluteDate,
            startsin: StartsInNew,
            startsinduration: StartsInDurationNew,
            duein: DueInNew,
            dueinduration: DueInDurationNew,
            comments: "",
            startdate: StartsDateNew,
            enddate: DueDateNew,
            subtasks: subtaskData,
            issubtaskschecked: SubtaskSwitch
        });

        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
        const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
        fetch(url + _id, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then((result) => {
                toast.success("Task Template updated successfully");


            })
            .catch((error) => {
                // Handle errors
                console.error(error);
                toast.error("Failed to create Job Template");
            });
    };
    const handleTaskTempCancle = () => {
        const hasUnsavedChanges =
            tempNameNew !== tempvalues.templatename ||
            status !== tempvalues.status ||
            taskDiscription !== tempvalues.description ||
            priority !== tempvalues.priority ||
            AssigneesNew.length !== tempvalues.taskassignees?.length ||
            tagsNew.length !== tempvalues.tasktags?.length ||
            absoluteDate !== tempvalues.absolutedates ||
            StartsDateNew !== dayjs(tempvalues.startdate) ||
            DueDateNew !== dayjs(tempvalues.enddate);

        if (hasUnsavedChanges) {
            if (window.confirm("You have unsaved changes. Are you sure you want to leave without saving?")) {
                navigate("/firmtemp/templates/tasks");
            }
        } else {
            navigate("/firmtemp/templates/tasks");
        }
    };
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container>
                <Box sx={{ mt: 2 }}>
                    <Box>
                        <form>
                            <Box className='box-b'>
                                <Typography variant='h5' gutterBottom>Edit Task Template</Typography>
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
                                                            sx={{ background: '#fff', mt: 1 }}
                                                            onChange={(e) => setTempNameNew(e.target.value)} value={tempNameNew}
                                                        />
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
                                                            sx={{ mt: 2 }}
                                                            options={options}
                                                            size='small'
                                                            getOptionLabel={(option) => option.label}
                                                            value={AssigneesNew}
                                                            onChange={handleuserChange}
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
                                                    <Box mt={1}>
                                                        <Priority onPriorityChange={handlePriorityChange} selectedPriority={priority} />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box sx={{ mt: 3,mb:7 }}>
                                            <Editor
                                                initialContent={taskDiscription} onChange={handleEditorChange}
                                            />
                                        </Box>
                                        <Box mt={2}>
                                            <label className='task-input-label'>Tags</label>
                                            <Autocomplete
                                                multiple
                                                size='small'
                                                id="tags-outlined"
                                                options={tagsoptions}
                                                getOptionLabel={(option) => option.label}
                                                value={tagsNew}
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
                                                isOptionEqualToValue={(option, value) => option.value === value.value}
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
                                                        value={StartsDateNew} onChange={handleStartDateChange}
                                                        renderInput={(params) => <TextField {...params} size="small" />}
                                                    />
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                                    <Typography className='task-input-label'>Due Date</Typography>
                                                    <DatePicker
                                                        format="DD/MM/YYYY"
                                                        sx={{ width: '100%', backgroundColor: '#fff' }}
                                                        value={DueDateNew} onChange={handleDueDateChange}
                                                        renderInput={(params) => <TextField {...params} size="small" />}
                                                    />
                                                </Box>
                                            </>
                                        )}
                                        {!absoluteDate && (
                                            <>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Typography className='task-input-label'>Start In</Typography>
                                                    <TextField
                                                        size='small'
                                                        margin='normal'
                                                        fullWidth
                                                        defaultValue={0}

                                                        sx={{ background: '#fff', ml: 1.5 }}
                                                        value={StartsInNew}
                                                        onChange={(e) => setStartsInNew(e.target.value)}
                                                    />
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
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Typography className='task-input-label'>Due In</Typography>
                                                    <TextField
                                                        size='small'
                                                        margin='normal'
                                                        value={DueInNew}
                                                        onChange={(e) => setDueInNew(e.target.value)}
                                                        fullWidth
                                                        defaultValue={0}

                                                        sx={{ background: '#fff', ml: 1.8, }}

                                                    />

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
                                    <Grid item xs={12} sm={0.4} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                        <Box
                                            sx={{
                                                borderLeft: '1px solid black',
                                                height: '100%',
                                                ml: 1.5
                                            }}
                                        ></Box>
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
                                                                                        // checked={checkedSubtasks.includes(subtask.id)}
                                                                                        checked={subtask.checked}
                                                                                        onChange={() => handleCheckboxChange(subtask.id)}
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
                                    <Button variant="contained" color="primary" onClick={updatetasktemp} sx={{
                backgroundColor: 'var(--color-save-btn)',  // Normal background
               
                '&:hover': {
                  backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                },
borderRadius:'15px'
              }}>Save & exit</Button>
                                    <Button variant="contained" color="primary" onClick={updatesavetasktemp} sx={{
                backgroundColor: 'var(--color-save-btn)',  // Normal background
               
                '&:hover': {
                  backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                },
               width:'80px',borderRadius:'15px'
              }}>Save</Button>
                                    <Button variant="outlined" onClick={handleTaskTempCancle} sx={{
                    borderColor: 'var(--color-border-cancel-btn)',  // Normal background
                   color:'var(--color-save-btn)',
                    '&:hover': {
                      backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                      color:'#fff',
                      border:"none"
                    },
                    width:'80px',borderRadius:'15px'
                  }}>Cancel</Button>
                                </Box>
                            </Box>
                        </form>
                    </Box>
                </Box>

            </Container>
        </LocalizationProvider>
    );
};

export default Tasks;