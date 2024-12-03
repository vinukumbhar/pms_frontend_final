import React, { useEffect, useState } from "react";
import "./pipeline.css";
import { useDrag, DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RiDeleteBin5Line } from "react-icons/ri";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { IconButton, MenuItem, Divider, Switch, FormControlLabel, Chip, Box, InputLabel, InputAdornment, Button, CircularProgress, Drawer, TextField, Autocomplete, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
// import Select from 'react-select';
import { differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";
import Priority from "../Templates/Priority/Priority";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Editor from "../Templates/Texteditor/Editor";
import AddJobs from "./AddJobs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
const Pipeline = ({ charLimit = 4000 }) => {
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;

  const [pipelineData, setPipelineData] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [selectedPipelineOption, setSelectedPipelineOption] = useState(null);
  const [stages, setStages] = useState([]);
  const [pipelineId, setPipelineId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
  const handleEditDrawerOpen = () => {
    setIsEditDrawerOpen(true);
  };
  const handleEditDrawerClose = () => {
    setIsEditDrawerOpen(false);
  };

  useEffect(() => {
    fetchPipelineData();
    fetchJobData();
  }, []);

  const fetchPipelineData = async () => {
    setLoading(true);
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipelines`;
      const response = await fetch(url);
      const data = await response.json();
      setPipelineData(data.pipeline);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobData = async () => {
    try {
      const url = `${JOBS_API}/workflow/jobs/job/joblist/list`;
      const response = await fetch(url);
      const data = await response.json();
      console.log("Job Data:", data); // Log the response to inspect it
      setJobs(data.jobList);
    } catch (error) {
      console.error("Error fetching job data:", error);
    }
  };

  const fetchStages = async (pipelineId) => {
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${pipelineId}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch stages");
      }
      const data = await response.json();
      return data.pipeline.stages;
    } catch (error) {
      console.error("Error fetching stages:", error);
      return [];
    }
  };

  // const handleSelectChange = (option) => {
  //   setSelectedPipelineOption(option);
  //   if (option) {
  //     const pipeline = pipelineData.find(p => p.pipelineName === option.label);
  //     if (pipeline) {
  //       handleBoardsList(pipeline);
  //     }
  //   } else {
  //     handleBackToPipelineList();
  //   }
  // };
  const handleSelectChange = (event, option) => {
    setSelectedPipelineOption(option);

    if (option) {
      const pipeline = pipelineData.find((p) => p.pipelineName === option.label);
      if (pipeline) {
        handleBoardsList(pipeline);
        console.log("janavi", pipeline)
      }
    }
  };

  const handleBoardsList = async (pipeline) => {
    setSelectedPipeline(pipeline);

    setSelectedPipelineOption({ value: pipeline._id, label: pipeline.pipelineName });
    setPipelineId(pipeline._id);

    const fetchedStages = await fetchStages(pipeline._id);
    setStages(fetchedStages);
  };

  const handleBackToPipelineList = () => {
    setSelectedPipeline(null);
    setSelectedPipelineOption(null);
    setStages([]);
  };

  const updateJobStage = async (stage, item) => {
    let data = JSON.stringify({ stageid: stage._id });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${JOBS_API}/workflow/jobs/job/jobpipeline/updatestageid/${item.id}`,
      headers: { "Content-Type": "application/json" },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const JobCard = ({ job }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "JOB_CARD",
      item: { id: job.id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });
    const [lastUpdatedTime, setLastUpdatedTime] = useState(new Date(job.createdAt));

    useEffect(() => {
      if (job.updatedAt) {
        setLastUpdatedTime(new Date(job.updatedAt));
      }
    }, [job.updatedAt]);

    useEffect(() => {
      const intervalId = setInterval(() => {
        setLastUpdatedTime((prevTime) => new Date(prevTime));
      }, 1000);

      return () => clearInterval(intervalId);
    }, []);

    const updateLastUpdatedTime = () => {
      setLastUpdatedTime(new Date());
      console.log(new Date());
    };

    const timeAgo = () => {
      const currentTime = new Date();
      const jobTime = lastUpdatedTime;

      const minutesDiff = differenceInMinutes(currentTime, jobTime);
      const hoursDiff = differenceInHours(currentTime, jobTime);
      const daysDiff = differenceInDays(currentTime, jobTime);

      if (minutesDiff < 1) {
        return "just now";
      } else if (minutesDiff < 60) {
        return `${minutesDiff} minute${minutesDiff === 1 ? "" : "s"} ago`;
      } else if (hoursDiff < 24) {
        return `${hoursDiff} hour${hoursDiff === 1 ? "" : "s"} ago`;
      } else {
        return `${daysDiff} day${daysDiff === 1 ? "" : "s"} ago`;
      }
    };

    const stripHtmlTags = (html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    };

    const truncateDescription = (description, maxLength = 30) => {
      if (description.length > maxLength) {
        return description.slice(0, maxLength) + "...";
      }
      return description;
    };

    const getPriorityStyle = (priority) => {
      switch (priority.toLowerCase()) {
        case "urgent":
          return { color: "white", backgroundColor: "#0E0402", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" };
        case "high":
          return { color: "white", backgroundColor: "#fe676e", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" }; // light red background
        case "medium":
          return { color: "white", backgroundColor: "#FFC300", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" }; // light orange background
        case "low":
          return { color: "white", backgroundColor: "#56c288", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" }; // light green background
        default:
          return {};
      }
    };

    const truncateName = (name) => {
      const maxLength = 12;
      if (name.length > maxLength) {
        return name.substring(0, maxLength) + "...";
      }
      return name;
    };

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const options = { month: "short", day: "2-digit", year: "numeric" };
      return date.toLocaleDateString("en-US", options);
    };

    const startDateFormatted = formatDate(job.StartDate);
    const dueDateFormatted = formatDate(job.DueDate);

    const [isHovered, setIsHovered] = useState(false);
    const handleDelete = (_id) => {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };

      fetch(`${JOBS_API}/workflow/jobs/job/` + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.json();
        })
        .then((result) => {
          // console.log(result);
          toast.success("Job deleted successfully");
          fetchJobData();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    };

    // account
    const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
    const [accountData, setAccountData] = useState([]);

    useEffect(() => {
      fetchAccountData();
    }, []);

    const fetchAccountData = async () => {
      try {
        const response = await fetch(`${ACCOUNT_API}/accounts/accountdetails`);
        const data = await response.json();
        setAccountData(data.accounts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Create account options
    const accountOptions = accountData.map((account) => ({
      value: account._id,
      label: account.accountName,
    }));

    // pipeline
    const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
    const [pipelineData, setPipelineData] = useState([]);
    const [selectedPipeline, setSelectedPipeline] = useState(null);
    const [piplineid, setPipelineId] = useState();
    const [pipelineIdData, setPipelineIdData] = useState();
    const [stages, setstages] = useState();

    useEffect(() => {
      fetchPipelineDataid();
    }, []);

    const fetchPipelineDataid = async (piplineid) => {
      try {
        const response = await fetch(`${PIPELINE_API}/workflow/pipeline/pipeline/${piplineid}`);
        const data = await response.json();

        setPipelineIdData(data.pipeline);


        if (data.pipeline && data.pipeline.stages) {
          const stagesdata = data.pipeline.stages.map((stage) => ({
            value: stage._id,
            label: stage.name,
          }));
          setstages(stagesdata);
          setSelectedstage(stagesdata[0]);
          console.log(stagesdata);
        }
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };
    useEffect(() => {
      fetchPipelineData();
    }, []);

    const fetchPipelineData = async () => {
      try {
        const url = `${PIPELINE_API}/workflow/pipeline/pipelines`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch pipeline data");
        }
        const data = await response.json();
        console.log(data)
        setPipelineData(data.pipeline || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const optionpipeline = pipelineData.map((pipeline) => ({
      value: pipeline._id,
      label: pipeline.pipelineName,
    }));

    const handlePipelineChange = (selectedOptions) => {
      setSelectedPipeline(selectedOptions);

      fetchPipelineDataid(selectedOptions.value);
    };

    // const [selectedStage, setSelectedStage] = useState(null);
    // const [stagesoptions, setStagesOptions] = useState([]);
    const [selectedstage, setSelectedstage] = useState("");
    const handleStageChange = (selectedOptions) => {
      setSelectedstage(selectedOptions);
    };

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedJobData, setSelectedJoData] = useState(null);
    const [priority, setPriority] = useState("");
    const [description, setDescription] = useState("");
    const handlePriorityChange = (priority) => {
      setPriority(priority);
    };
    const handleEditorChange = (content) => {
      setDescription(content);
    };

    //Tag FetchData ================
    const [tags, setTags] = useState([]);
    const [combinedTagsValues, setCombinedTagsValues] = useState([]);
    useEffect(() => {
      fetchTagData();
    }, []);

    const fetchTagData = async () => {
      try {
        const response = await fetch(`${TAGS_API}/tags/`);
        const data = await response.json();
        setTags(data.tags);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    //  for tags
    const calculateWidth = (label) => {
      const textWidth = label.length * 8;
      return Math.min(textWidth, 200);
    };
    const calculateWidthOptions = (label) => `${Math.max(label.length * 8, 90)}px`;
    const tagoptions = tags.map((tag) => ({
      value: tag._id,
      label: tag.tagName,
      colour: tag.tagColour,

      customTagStyle: {
        backgroundColor: tag.tagColour,
        color: "#fff",
        borderRadius: "8px",
        alignItems: "center",
        textAlign: "center",
        marginBottom: "5px",
        padding: "2px,8px",

        fontSize: "10px",
        // width: `${calculateWidth(tag.tagName)}px`,
        margin: "7px",
      },
    }));

    const [selectedTags, setSelectedTags] = useState([]);
    const [dataAccountjob, setDataAccountjob] = useState();

    const handleTagChange = (event, newValue) => {
      setSelectedTags(newValue); // Keep the full tag objects

      // Send only the values to your backend
      const tagValues = newValue.map((option) => option.value);
      console.log("Selected Values:", tagValues);

      // Assuming setCombinedTagsValues is a function to send the values to your backend
      setCombinedTagsValues(tagValues);
    };

    useEffect(() => {
      fetchUserData();
    }, []);
    const [userData, setUserData] = useState([]);
    const [selecteduser, setSelectedUser] = useState();
    const [combinedValues, setCombinedValues] = useState([]);
    const fetchUserData = async () => {
      try {
        const url = `${USER_API}/api/auth/users`;
        const response = await fetch(url);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const useroptions = userData.map((user) => ({
      value: user._id,
      label: user.username,
    }));
    const handleUserChange = (event, selectedOptions) => {
      setSelectedUser(selectedOptions);
      const selectedValues = selectedOptions.map((option) => option.value);
      setCombinedValues(selectedValues);
    };
    const [startDate, setStartDate] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const handleStartDateChange = (date) => {
      setStartDate(date);
    };
    const handleDueDateChange = (date) => {
      setDueDate(date);
    };
    const [accountId, setAccountId] = useState();
    const USER_API = process.env.REACT_APP_USER_URL;
    const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
    const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
    const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
    const [jobid, setjobid] = useState();
    const [inputText, setInputText] = useState("");
    const [charCount, setCharCount] = useState(0);
    const [selectedjob, setSelectedjob] = useState(null);
    const [clientFacingJobs, setClientFacingJobs] = useState([]);
    const [clientDescription, setClientDescription] = useState("");
    const [clientFacingStatus, setClientFacingStatus] = useState(false);
    const [selectedJobShortcut, setSelectedJobShortcut] = useState("");
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
      setSelectedjob(newValue);

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
    const handleEditJobCard = async (jobid) => {

      console.log(jobid)
      setjobid(jobid);
      try {
        const url = `${JOBS_API}/workflow/jobs/job/joblist/listbyid/${jobid}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setSelectedJoData(data.jobList);
        console.log(data.jobList);

        if (data.jobList && data.jobList.Pipeline) {
          const pipelineData = {
            value: data.jobList.Pipeline._id,
            label: data.jobList.Pipeline.Name,
          };
          setSelectedPipeline(pipelineData);
          console.log(pipelineData);
          setPipelineId(data.jobList.Pipeline._id);
          console.log(data.jobList.Pipeline._id);
          fetchPipelineDataid(data.jobList.Pipeline._id);
        }
        setDueDate(dayjs(data.jobList.DueDate) || null);
        // (dayjs(tempvalues.startdate) || null)
        setStartDate(dayjs(data.jobList.StartDate) || null);
        // if (data.jobList && data.jobList.Stage) {
        //   const stageData = {
        //     value: data.jobList.Stage._id,
        //     label: data.jobList.Stage.name,
        //   };
        //   setSelectedstage(stageData);
        // }
        setPriority(data.jobList.Priority);
        setDescription(data.jobList.Description);
        setClientFacingStatus(data.jobList.ShowinClientPortal);
        setInputText(data.jobList.jobClientName);
        setClientDescription(data.jobList.ClientFacingDecription);
        if (data.jobList.ClientFacingStatus && data.jobList.ClientFacingStatus) {
          const clientStatusData = {
            value: data.jobList.ClientFacingStatus._id,
            label: data.jobList.ClientFacingStatus.clientfacingName,
            clientfacingColour: data.jobList.ClientFacingStatus.clientfacingColour,
          };

          setSelectedjob(clientStatusData);
        }

        if (data.jobList && data.jobList.Account) {
          setDataAccountjob(data.jobList.Account[0].accountName);
        }

        if (data.jobList && data.jobList.Account) {
          console.log(data.jobList.Account[0]._id);
          setAccountId(data.jobList.Account[0]._id);
          console.log(data.jobList.Account[0].tags);
          const tagOptions = data.jobList.Account[0].tags
            .flatMap((tagArray) => tagArray)
            .map((tag) => ({
              value: tag._id,
              label: tag.tagName,
              colour: tag.tagColour,
            }));
          setSelectedTags(tagOptions);
          console.log(tagOptions);
        }
        if (data.jobList && data.jobList.Account) {
          const tags = data.jobList.Account[0].tags.map((tag) => ({
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

              fontSize: "10px",
              // width: `${calculateWidth(tag.tagName)}px`,
              margin: "7px",
            },
          }));

          // setSelectedTags(tags);
          console.log(tags);
        }
        if (data.jobList && data.jobList.JobAssignee) {
          const assigneesData = data.jobList.JobAssignee.map((assignee) => ({
            value: assignee._id,
            label: assignee.username,
          }));

          setSelectedUser(assigneesData);
          const selectedValues = assigneesData.map((option) => option.value);
          setCombinedValues(selectedValues);
        }

        setIsDrawerOpen(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

    };
    const handleSaveClick = () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        pipeline: selectedPipeline.value,
        stageid: selectedstage.value,
        jobassignees: combinedValues,
        priority: priority.value,
        description: description,
        startdate: startDate,
        enddate: dueDate,
      });

      console.log(raw);
      // /job
      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      console.log(jobid);
      fetch(`${JOBS_API}/workflow/jobs/job/` + jobid, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          // Handle success
          toast.success("Job Template updated successfully");
          // setIsDrawerOpen(false);
          fetchJobData();
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to update Job Template");
        });
    };
    const handleSaveExitClick = () => {
      updatejobdata();
      handleSaveTags();
    };
    // console.log(accountId);
    const handleSaveTags = () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        tags: combinedTagsValues,
      });
      console.log(raw);
      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${ACCOUNT_API}/accounts/accountdetails/${accountId}`;
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          console.log(result.updatedAccount); // Log the result
        })
        .catch((error) => {
          console.error(error); // Log the error
          toast.error("An error occurred while submitting the form"); // Display error toast
        });
    };
    const handleFormClose = () => {
      setIsDrawerOpen(false);
    };
    const updatejobdata = () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        pipeline: selectedPipeline.value,
        stageid: selectedstage.value,
        jobassignees: combinedValues,

        priority: priority.value,
        description: description,
        startdate: startDate,
        enddate: dueDate,
        showinclientportal: clientFacingStatus,
        jobnameforclient: inputText,
        clientfacingstatus: selectedjob?.value,
        clientfacingDescription: clientDescription,
      });

      console.log(raw);
      // /job
      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      console.log(jobid);
      fetch(`${JOBS_API}/workflow/jobs/job/` + jobid, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          // Handle success
          toast.success("Job Template updated successfully");
          setIsDrawerOpen(false);
          fetchJobData();
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to update Job Template");
        });
    };


    return (
      <Box className={`job-card ${isDragging ? "dragging" : ""}`} ref={drag} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onDrop={updateLastUpdatedTime}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "10px" }}>
          <Typography color={"black"}>{job.Account.join(", ")}</Typography>
          {isHovered ? <RiDeleteBin5Line onClick={() => handleDelete(job.id)} style={{ cursor: "pointer" }} /> : <span className="automation-batch">1</span>}
        </Box>

        <Typography sx={{ fontWeight: "bold", marginBottom: "8px", cursor: "pointer" }} color={"black"} onClick={() => handleEditJobCard(job.id)}>
          {truncateName(job.Name)}
        </Typography>
        <Typography color={"black"} variant="body2" sx={{ marginBottom: "8px" }}>
          {job.JobAssignee.join(", ")}
        </Typography>
        <Typography color={"black"} variant="body2" sx={{ marginBottom: "8px" }}>
          {truncateDescription(stripHtmlTags(job.Description))}
        </Typography>

        <span style={getPriorityStyle(job.Priority)}>{job.Priority}</span>

        <br />

        <Typography color={"black"} sx={{ marginBottom: "4px", mt: 2 }} variant="body2">
          Starts : {startDateFormatted}
        </Typography>
        <Typography color={"black"} variant="body2">
          Due : {dueDateFormatted}
        </Typography>
        <Typography color={"black"} variant="body2" sx={{ marginBottom: "5px", mt: 2 }}>
          {timeAgo()}
        </Typography>
        {/* edit job card */}

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            PaperProps={{
              sx: {
                borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
                width: isSmallScreen ? "100%" : 600,
                maxWidth: "100%",
                [theme.breakpoints.down("sm")]: {
                  width: "100%",
                },
                id: "tag-drawer",
              },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", ml: 1 }}>
              <Typography sx={{ fontWeight: "bold" }} variant="h6">
                Edit Job
              </Typography>
              <IconButton onClick={() => setIsDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider />
            <Box padding={2} height="83vh" sx={{ overflowY: "auto" }}>
              <Box mt={2}>
                <label>Pipeline</label>

                <Autocomplete
                  options={optionpipeline}
                  getOptionLabel={(option) => option.label}
                  value={selectedPipeline}
                  onChange={(event, newValue) => handlePipelineChange(newValue)}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      {...props}
                      sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                    >
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => <TextField {...params} sx={{ backgroundColor: "#fff" }} placeholder="Pipeline" variant="outlined" size="small" />}
                  sx={{ width: "100%", marginTop: "8px" }}
                  clearOnEscape // Enable clearable functionality
                />
              </Box>
              <Box mt={2}>
                <label>Account Tags</label>
                <Autocomplete
                  multiple // Enable multi-select
                  size="small"
                  sx={{ marginTop: "8px", marginBottom: "8px" }}
                  options={tagoptions} // The array of options
                  value={selectedTags} // Selected tags
                  onChange={handleTagChange}
                  getOptionLabel={(option) => option.label} // Assuming your tags have a 'label' property
                  isOptionEqualToValue={(option, value) => option.value === value.value} // Customize equality check
                  renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Select tags..." />}
                  filterSelectedOptions // Prevents duplicates in selection
                  renderOption={(props, option) => (
                    <MenuItem
                      {...props}
                      key={option.value}
                      style={{
                        backgroundColor: option.colour,
                        color: "#fff",
                        borderRadius: "15px",
                        margin: "2px 0",
                        width: calculateWidthOptions(option.label),
                      }}
                    >
                      {option.label}
                    </MenuItem>
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.value}
                        label={option.label}
                        style={{
                          backgroundColor: option.colour,
                          color: "#fff",
                          borderRadius: "15px",
                          fontSize: "10px",
                          margin: "7px",
                          alignItems: "center",
                          textAlign: "center",
                          marginBottom: "5px",
                          padding: "2px,8px",
                        }}
                      />
                    ))
                  }
                />
              </Box>
              <Box>
                <label className="task-input-label">Task Assignee</label>
                <Autocomplete
                  multiple
                  sx={{ background: "#fff", mt: 1 }}
                  options={useroptions}
                  size="small"
                  getOptionLabel={(option) => option.label}
                  value={selecteduser}
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
                  renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Assignees" />}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                />
              </Box>
              <Box>
                <label>Stage</label>
                <Autocomplete
                  options={stages || []}
                  getOptionLabel={(option) => option.label}
                  value={selectedstage}
                  onChange={(event, newValue) => handleStageChange(newValue)}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      {...props}
                      sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                    >
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => <TextField {...params} sx={{ backgroundColor: "#fff" }} placeholder="Select stages" variant="outlined" size="small" />}
                  clearOnEscape // Enable clearable functionality
                  sx={{ width: "100%", marginTop: "8px" }}
                />
              </Box>
              <Box mt={2}>
                <Priority onPriorityChange={handlePriorityChange} selectedPriority={priority} />
              </Box>

              <Typography>Start Date</Typography>
              <DatePicker
                format="DD/MM/YYYY"
                sx={{ width: "100%", backgroundColor: "#fff" }}
                // value={startDate}
                // onChange={handleStartDateChange}
                value={startDate}
                onChange={handleStartDateChange}
                renderInput={(params) => <TextField {...params} size="small" />}
              />

              <Typography>Due Date</Typography>
              <DatePicker
                format="DD/MM/YYYY"
                sx={{ width: "100%", backgroundColor: "#fff" }}
                // value={dueDate}
                // onChange={handleDueDateChange}
                value={dueDate}
                onChange={handleDueDateChange}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
              <Box mt={2}>
                <Editor initialContent={description} onChange={handleEditorChange} />
              </Box>

              <Box mt={2}>
                <Box style={{ display: "flex", alignItems: "center" }}>

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
                              value={selectedjob}
                              onChange={handleJobChange}
                              getOptionLabel={(option) => option.label}
                              isOptionEqualToValue={(option, value) => option.value === value.value}
                              renderOption={(props, option) => (
                                <Box component="li" {...props}>

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

              <Box mt={5} display="flex" alignItems="center" gap={2}>
                <Button variant="contained" onClick={handleSaveExitClick}>
                  Save & Exit
                </Button>
                <Button variant="contained" onClick={handleSaveClick}>
                  Save
                </Button>
                <Button variant="outlined" onClick={handleFormClose}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </Drawer>


        </LocalizationProvider>

      </Box>
    );
  };

  const Stage = ({ stage, selectedPipeline, handleDrop, }) => {
    const [{ isOver }, drop] = useDrop({
      accept: "JOB_CARD",
      drop: (item, monitor) => {
        
        const { id } = item; // Destructure id and accountName
        const job = jobs.find((job) => job.id === id);

        if (job) {
          // Use accountName directly or from `job` if needed
          if (stage.automations && stage.automations.length > 0) {
            handleDropWithDrawer(job, stage); // Pass the job to the drawer
          } else {
            handleDrop(id, stage.name); // Update without drawer
            updateJobStage(stage, item);
          }
        } else {
          console.error("Job not found for ID:", id);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });
    const stageJobs = jobs.filter((job) => job.Pipeline === selectedPipeline.pipelineName && job.Stage.includes(stage.name));
    const [displayCount, setDisplayCount] = useState(3);
    const displayedJobs = stageJobs.slice(0, displayCount);
    const truncatedStageName = stage.name.length > 20 ? `${stage.name.slice(0, 20)}...` : stage.name;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [targetStage, setTargetStage] = useState(null);
    const handleDropWithDrawer = (job, stage) => {
      setSelectedJob(job);
      console.log(job)
      console.log(job.AccountId)
      setTargetStage(stage);
      setDrawerOpen(true);
    };

    const handleMoveJob = () => {
      if (selectedJob && targetStage) {
        updateJobStage(targetStage, selectedJob);
        handleDrop(selectedJob.id, targetStage.name);
        setDrawerOpen(false); // Close the drawer after moving the job
      }
    };
    const handleCloseDarwer = () => {
      setDrawerOpen(false);
    }
    return (
      <Box>
        <Box ref={drop} className={`stage ${isOver ? "drag-over" : ""}`}>
          <Typography sx={{ marginBottom: "12px" }} className="stage-name">
            {truncatedStageName}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: "12px" }}>
            {stageJobs.length > 0 && <span>({stageJobs.length})</span>}
          </Typography>
          {displayedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          {stageJobs.length > displayCount && (
            <Button variant="outlined" onClick={() => setDisplayCount(displayCount + 5)} sx={{ marginTop: "16px", alignSelf: "center" }}>
              Load More
            </Button>
          )}

        </Box>
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} >
          <Box sx={{ width: 500, padding: "16px" }}>
            <Box>

              {selectedJob && (
                <Typography variant="subtitle1" mb={2}>
                  Moving <strong>{selectedJob.Account}</strong> to{" "}
                  <strong>{targetStage?.name}</strong>
                </Typography>
              )}
              <Typography variant="h5">Check automations list scheduled to occur:</Typography>
              <Typography variant="body1">Automations happen one after another and can affect those that come later. The system will skip automation if it lacks necessary information for execution, with notifications sent to Inbox+.</Typography>
              {targetStage?.automations?.length > 0 && (
                targetStage.automations.map((automation, index) => (
                  <Box
                    key={index}
                    p={2}
                    mb={2}
                    sx={{
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    {/* Automation Type */}
                    <Typography variant="subtitle1" mb={1}>
                      {automation.type}
                    </Typography>

                    {/* Template */}
                    <Typography variant="body2" mb={1}>
                      {automation.template?.label}
                    </Typography>

                    {/* Tags */}
                    {automation.tags && automation.tags.length > 0 && (
                      <Box>

                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {automation.tags.map((tag) => (
                            <Box
                              key={tag._id}
                              sx={{
                                padding: "4px 8px",
                                borderRadius: "12px",
                                fontSize: "12px",
                                backgroundColor: tag.tagColour,
                                color: "#fff",
                              }}
                            >
                              {tag.tagName}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="contained"

                  onClick={handleMoveJob}

                >
                  Move Job
                </Button>
                <Button variant="outlined" onClick={handleCloseDarwer} >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </Drawer>
      </Box>
    );
  };

  const optionpipeline = pipelineData.map((pipeline) => ({
    value: pipeline._id,
    label: pipeline.pipelineName,
  }));


  const handleDrop = (jobId, stageName) => {
    const updatedJobs = jobs.map((job) => {
      if (job.id === jobId) {
        return { ...job, Stage: [stageName] };
      }
      return job;
    });
    setJobs(updatedJobs);

    setTimeout(() => {
      fetchJobData();
    }, 1000);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box p={3}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
          </Box>
        ) : selectedPipeline ? (
          <>
            <Box mb={2}>
              <Autocomplete
                value={selectedPipelineOption}
                onChange={handleSelectChange}
                options={optionpipeline}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value?.value}
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
                  <TextField
                    {...params}
                    // label="Search pipelines..."
                    placeholder="Search pipelines..."
                    sx={{ backgroundColor: "#fff" }}
                  />
                )}
                // isClearable
                className="pipeline-select"
              />
              <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                <Button variant="outlined" color="primary" onClick={handleBackToPipelineList} sx={{ mt: 2 }}>
                  Back to Pipeline List
                </Button>
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleDrawerOpen}>
                  Add Jobs
                </Button>
              </Box>
            </Box>
            <Box>
              <Box className="stage-container" display="flex" gap={2}>
                {stages.map((stage, index) => (
                  <Stage key={index} stage={stage} selectedPipeline={selectedPipeline} handleDrop={handleDrop} />
                ))}
              </Box>
            </Box>
            <Drawer
              anchor="right"
              open={isDrawerOpen}
              onClose={handleDrawerClose}
              PaperProps={{
                id: "tag-drawer",
                sx: {
                  borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
                  width: isSmallScreen ? "100%" : 600,
                  maxWidth: "100%",
                  [theme.breakpoints.down("sm")]: {
                    width: "100%",
                  },
                },
              }}
            >
              <Box sx={{ borderRadius: isSmallScreen ? "0" : "15px" }} role="presentation">
                <Box>
                  <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px", background: "#EEEEEE" }}>
                    <Typography variant="h6">Add Job to {selectedPipeline ? selectedPipeline.pipelineName : ""}</Typography>
                    <IoClose onClick={handleDrawerClose} style={{ cursor: "pointer" }} />
                  </Box>
                  <Box>
                    <AddJobs stages={stages} pipelineId={pipelineId} handleDrawerClose={handleDrawerClose} fetchJobData={fetchJobData} />
                  </Box>
                </Box>
              </Box>
            </Drawer>
          </>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Pipeline List
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>PIPELINE NAME</TableCell>
                    <TableCell>JOBS</TableCell>
                    <TableCell>SCHEDULE</TableCell>
                    <TableCell>START DATE</TableCell>
                    <TableCell>END DATE</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pipelineData.map((pipeline, index) => (
                    <TableRow key={index} hover>
                      <TableCell onClick={() => handleBoardsList(pipeline)} sx={{ color: "primary.main", cursor: "pointer", fontWeight: "bold" }}>
                        {pipeline.pipelineName}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </DndProvider>
  );
};

export default Pipeline;
