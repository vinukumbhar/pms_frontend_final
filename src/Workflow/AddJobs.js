import { InputLabel,Chip,Box,InputAdornment, Autocomplete, TextField, Typography, Switch, FormControlLabel, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { toast } from 'react-toastify';
import Priority from '../Templates/Priority/Priority';
import Editor from '../Templates/Texteditor/Editor';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const AddJobs = ({ charLimit = 4000,stages, pipelineId, handleDrawerClose, fetchJobData }) => {

  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const JOBS_TEMP_API = process.env.REACT_APP_JOBS_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
  const handleAbsolutesDates = (checked) => {
    setAbsoluteDates(checked);
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleDueDateChange = (date) => {
    setDueDate(date);
  };
  const handleStartInDateChange = (event, newValue) => {
    setStartsInDuration(newValue ? newValue.value : null);
  };
  // Handler function to update state when dropdown value changes
  const handleDueInDateChange = (event, newValue) => {
    setdueinduration(newValue ? newValue.value : null);
  };
  //****************Accounts */
  const [accountdata, setaccountdata] = useState([]);
  const [selectedaccount, setSelectedaccount] = useState();
  const [combinedaccountValues, setCombinedaccountValues] = useState([]);

  const handleAccountChange = (event, newValue) => {
    setSelectedaccount(newValue.map((option) => option.value));
    // Map selected options to their values and send as an array
    console.log("Selected Values:", newValue.map((option) => option.value));
    setCombinedaccountValues(newValue.map((option) => option.value));
  }



  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      const response = await fetch(`${ACCOUNT_API}/accounts/accountdetails`);
      const data = await response.json();
      setaccountdata(data.accounts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // console.log(userdata);
  const accountoptions = accountdata.map((account) => ({
    value: account._id,
    label: account.accountName
  }));

  //   stages

  const [selectedStage, setSelectedStage] = useState(null);
  const stagesoptions = stages.map(stage => ({ value: stage._id, label: stage.name }));
  const handleStageChange = (event, newValue) => {
    setSelectedStage(newValue);
  };

  // user

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



  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedAssigneesValues, setCombinedAssigneesValues] = useState([]);
  const handleUserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setCombinedAssigneesValues(selectedValues);
  };
  const assigneesoptions = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));


  //Default Jobt template get 
  const [description, setDescription] = useState('');
  const [jobName, setJobName] = useState('');
  const [priority, setPriority] = useState('');
  const [absoluteDate, setAbsoluteDates] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [startsin, setstartsin] = useState('');
  const [startsInDuration, setStartsInDuration] = useState(null);
  const [dueinduration, setdueinduration] = useState("");
  const [duein, setduein] = useState('');
  const [jobTemp, setJobTemp] = useState([]);
  const [selectedtemp, setselectedTemp] = useState();
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
  const handletemp = async (event, newValue) => {
    setselectedTemp(newValue);
    if (newValue && newValue.value) {
      const templateId = newValue.value;
      try {
        const response = await fetch(`${JOBS_TEMP_API}/workflow/jobtemplate/jobtemplate/jobtemplatelist/${templateId}`);
        const data = await response.json();
        const template = data.jobTemplate;

        // Populate the form fields with template data
        setJobName(template.jobname);

        const jobAssignees = template.jobassignees.map((assignee) => ({
          value: assignee._id,
          label: assignee.username,
        }));
        setSelectedUser(jobAssignees);
        const selectedValues = jobAssignees.map((option) => option.value);
        setCombinedAssigneesValues(selectedValues);
        // setSelecteAssigneesdUser(template.jobassignees.map(assignee => assignee._id));
        setPriority(template.priority);
        console.log(template.priority)
        setDescription(template.description);
        setAbsoluteDates(template.absolutedates);
        setStartDate(template.absolutedates ? dayjs(template.startdate) : null);
        setDueDate(template.absolutedates ? dayjs(template.enddate) : null);
        setstartsin(template.startsin); // You might need to adjust this
        setduein(template.duein); // You might need to adjust this
        setStartsInDuration(template.startsinduration);
        setdueinduration(template.dueinduration)
          setClientFacingStatus(template.showinclientportal);
        setInputText(template.jobnameforclient);
        if (template.clientfacingstatus && template.clientfacingstatus) {
          const clientStatusData = {
            value: template.clientfacingstatus._id,
            label: template.clientfacingstatus.clientfacingName,
            clientfacingColour: template.clientfacingstatus.clientfacingColour,
          };

          setSelectedJob(clientStatusData);
        }
        setClientDescription(template.clientfacingDescription);
      } catch (error) {
        console.error("Error fetching template data:", error);
      }
    }
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


  useEffect(() => {
    fetchtemp();
  }, []);

  const fetchtemp = async () => {
    try {
      const url = `${JOBS_TEMP_API}/workflow/jobtemplate/jobtemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setJobTemp(data.JobTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const optiontemp = jobTemp.map((temp) => ({
    value: temp._id,
    label: temp.templatename

  }));
  const handlePriorityChange = (priority) => {
    setPriority(priority);
  };
  const handleEditorChange = (content) => {
    setDescription(content);
  };

  const dayOptions = [
    { label: "Days", value: "Days" },
    { label: "Months", value: "Months" },
    { label: "Years", value: "Years" },
  ];

  const createjob = () => {

    const myHeaders = {
      "Content-Type": "application/json"
    };

    const data = {
      accounts: combinedaccountValues,
      stageid: selectedStage.value,
      pipeline: pipelineId,
      templatename: selectedtemp.value,
      jobname: jobName,
      jobassignees: combinedAssigneesValues,
      priority: priority,
      description: description,
      absolutedates: absoluteDate,
      startsin: startsin,
      startsinduration: startsInDuration,
      duein: duein,
      dueinduration: dueinduration,
    
        showinclientportal: clientFacingStatus,
      jobnameforclient: inputText,
      clientfacingstatus: selectedJob?.value,
      clientfacingDescription: clientDescription,
      startdate: startDate,
      enddate: dueDate,
    };

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${JOBS_API}/workflow/jobs/newjob`,
      headers: myHeaders,
      data: JSON.stringify(data)
    };
console.log(data)
    axios.request(config)
      .then((response) => {
        console.log("Job created successfully");
        toast.success('Job created successfully');
        handleDrawerClose();
        fetchJobData();
        // navigate('/workflow/jobs')
        // Handle success, e.g., toast or redirect
      })
      .catch((error) => {
        console.error("Failed to create Job Template:", error);
        toast.error('Failed to create Job')
        // Handle errors, e.g., toast error
      });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{height:'86vh', overflowY:'auto', p:2}} className='jobs-add-container'>
        <Box >
          <label className='job-input-label'>Accounts</label>

          <Autocomplete
            multiple
            options={accountoptions}
            value={selectedaccount}
            onChange={handleAccountChange}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{ cursor: 'pointer', margin: '5px 10px' }} // Add cursor pointer style
              >
                {option.label}
              </Box>
            )}
            renderInput={(params) => <TextField {...params} placeholder="Accounts"
              variant="outlined"
              size="small" sx={{ backgroundColor: '#fff' }} />}
            sx={{ width: '100%', marginTop: '8px' }}
          />
        </Box>
        <Box>
          <label className='job-input-label'>Stage</label>
          <Autocomplete
            size='small'
            options={stagesoptions}
            getOptionLabel={(option) => option.label}
            value={selectedStage}
            onChange={handleStageChange}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Stages"
                variant="outlined"
                className="add-jobs-select-dropdown"
              />
            )}
            sx={{ width: '100%', marginTop: '8px' }}
          />
        </Box>
        <Box mt={2}>
          <label className='job-input-label'>Template</label>
          <Autocomplete
            options={optiontemp}
            getOptionLabel={(option) => option.label}
            value={selectedtemp}

            onChange={handletemp}

            isOptionEqualToValue={(option, value) => option.value === value.value}
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
              <TextField
                {...params}
                sx={{ backgroundColor: '#fff' }}
                placeholder="Job Template"
                variant="outlined"
                size="small"
              />
            )}
            sx={{ width: '100%', marginTop: '8px' }}
            clearOnEscape // Enable clearable functionality
          />
        </Box>
        <Box mt={2}>
          <label className='job-input-label'>Name</label>
          <TextField
            fullWidth
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            margin="normal"
            size="small"
            placeholder='Job Name'
            sx={{ backgroundColor: '#fff' }}
          />
        </Box>
        <Box mt={2}>
          <label className='job-input-label'>Job Assignees</label>
          <Autocomplete
            multiple
            sx={{ marginTop: '8px' }}
            options={assigneesoptions}
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
              <TextField {...params} variant="outlined" placeholder="Job Assignees" sx={{ backgroundColor: '#fff' }} />
            )}
            isOptionEqualToValue={(option, value) => option.value === value.value}
          />
        </Box>
        <Box mt={2}>
          <Priority onPriorityChange={handlePriorityChange} selectedPriority={priority} />

        </Box>
        <Box mt={2}>

          <Editor initialContent={description} onChange={handleEditorChange} />
        </Box>
        <Box mt={2}>
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography variant='h6'>Start and Due Date</Typography>
            <Box className='absolutes-dates'>
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
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Typography>Start Date</Typography>
              <DatePicker
                format="DD/MM/YYYY"
                sx={{ width: '100%', backgroundColor: '#fff' }}
                // value={startDate}
                // onChange={handleStartDateChange}
                value={startDate}
                onChange={handleStartDateChange}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Typography>Due Date</Typography>
              <DatePicker
                format="DD/MM/YYYY"
                sx={{ width: '100%', backgroundColor: '#fff' }}
                // value={dueDate}
                // onChange={handleDueDateChange}
                value={dueDate}
                onChange={handleDueDateChange}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </Box>
          </>
        )}
        {!absoluteDate && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>Start In</Typography>
              <TextField
                size='small'
                margin='normal'
                fullWidth
                defaultValue={0}
                sx={{ ml: 1, backgroundColor: '#fff' }}
                value={startsin}
                onChange={(e) => setstartsin(e.target.value)}
              />
              <Autocomplete
                options={dayOptions}
                size='small'
                getOptionLabel={(option) => option.label}
                value={startsInDuration ? dayOptions.find(option => option.value === startsInDuration) : null}
                onChange={handleStartInDateChange}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" sx={{ backgroundColor: '#fff' }} />
                )}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ cursor: 'pointer', margin: '5px 10px' }}>
                    {option.label}
                  </Box>
                )}

                // value={dayOptions.find((option) => option.value === startsInDuration) || null}
                className="job-template-select-dropdown"
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>Due In</Typography>
              <TextField
                size='small'
                margin='normal'
                fullWidth
                defaultValue={0}
                sx={{ ml: 1.5, backgroundColor: '#fff' }}
                value={duein}
                onChange={(e) => setduein(e.target.value)}
              // onChange={(e) => setduein(e.target.value)}
              />

              <Autocomplete
                options={dayOptions}
                getOptionLabel={(option) => option.label}
                // onChange={handledueindateChange}
                value={dueinduration ? dayOptions.find(option => option.value === dueinduration) : null}
                onChange={handleDueInDateChange}
                size='small'
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" sx={{ backgroundColor: '#fff' }} />
                )}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ cursor: 'pointer', margin: '5px 10px' }}>
                    {option.label}
                  </Box>
                )}

                // value={dayOptions.find((option) => option.value === dueinduration) || null}
                className="job-template-select-dropdown"
              />
            </Box>
          </>
        )}

        <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box mt={2}>
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
                    
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
        <Box mt={2} display={'flex'} gap={2} alignItems={'center'} mb={2}>
          <Button variant="contained" color="primary" onClick={createjob}>Save</Button>
          <Button variant="outlined">Cancel</Button>
        </Box>
      </Box>
    </LocalizationProvider>
  )
}

export default AddJobs
