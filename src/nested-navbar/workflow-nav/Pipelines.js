// // import React,{ useEffect, useState } from 'react'
// // import { Box } from "@mui/material";
// // const Pipelines = () => {
// //    const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
// //   const [jobData, setJobData] = useState([]);
// //   const [pipelineData, setPipelineData] = useState([]); // Initialize as an array
// //   const [loading, setLoading] = useState(false);
// //   const fetchJobList = async () => {
// //     try {
// //       const url = 'http://127.0.0.1:7550/workflow/jobs/job/joblist/list/true/6731a63a9401e115181da177';
// //       const response = await fetch(url);
// //       const data = await response.json();

// //       const jobList = data.jobList || [];
// //       setJobData(jobList); // Set the job list data to state

// //        // Extract all PipelineIds
// //        const pipelineIds = jobList.map((job) => job.PipelineId);
// //        console.log("All PipelineIds:", pipelineIds);

// //        // Fetch pipeline data for each PipelineId
// //        pipelineIds.forEach((id) => fetchPipelineData(id));

// //       console.log("All PipelineIds:", pipelineIds);
// //       console.log("Job list by account ID", data);
// //     } catch (error) {
// //       console.error("Error fetching data:", error);
// //     }
// //   };
// //   const fetchPipelineData = async (pipelineId) => {
// //     setLoading(true);
// //     try {
// //       const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${pipelineId}`;
// //       const response = await fetch(url);
// //       const data = await response.json();

// //       // Append pipeline data to state
// //       // setPipelineData((prevData) => [...prevData, data.pipeline]);
// //       setPipelineData((prevData) => [
// //         ...prevData,
// //         { ...data.pipeline, stages: data.pipeline.stages || [] }, // Ensure stages are included
// //       ]);


// //       console.log(`Pipeline data for ID ${pipelineId}:`, data.pipeline);
// //     } catch (error) {
// //       console.error("Error fetching pipeline data:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchJobList();
// //   }, []);

// //  // Remove duplicate pipeline names
// //  const uniquePipelines = Array.from(
// //   new Map(pipelineData.map((pipeline) => [pipeline.pipelineName, pipeline])).values()
// // );

// //   return (
// //     <Box>
// //       {loading && <p>Loading pipeline data...</p>}
// //       {uniquePipelines.map((pipeline, index) => (
// //         <Box key={index}>
// //           {/* <p>Pipeline ID: {pipeline._id}</p> */}
// //           <p>Pipeline Name: {pipeline.pipelineName}</p>
// //           <Box className="stage-container" display="flex" gap={2}>
// //             <p><strong>Stages:</strong></p>
// //             {pipeline.stages && pipeline.stages.length > 0 ? (
// //               pipeline.stages.map((stage, stageIndex) => (
// //                 <Box key={stageIndex} sx={{ marginBottom: 1 }}>
// //                   <p>Stage Name: {stage.name}</p>

// //                 </Box>
// //               ))
// //             ) : (
// //               <p>No stages available.</p>
// //             )}
// //           </Box>
// //         </Box>
// //       ))}
// //     </Box>
// //   )
// // }

// // export default Pipelines

// import React, { useEffect, useState } from 'react';
// import { Box } from "@mui/material";

// const Pipelines = () => {
//   const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
//   const [jobData, setJobData] = useState([]);
//   const [pipelineData, setPipelineData] = useState([]); // Initialize as an array
//   const [loading, setLoading] = useState(false);

//   const fetchJobList = async () => {
//     try {
//       const url = 'http://127.0.0.1:7550/workflow/jobs/job/joblist/list/true/6731a63a9401e115181da177';
//       const response = await fetch(url);
//       const data = await response.json();

//       const jobList = data.jobList || [];
//       setJobData(jobList); // Set the job list data to state

//       // Extract all PipelineIds
//       const pipelineIds = jobList.map((job) => job.PipelineId);
//       console.log("All PipelineIds:", pipelineIds);

//       // Fetch pipeline data for each PipelineId
//       pipelineIds.forEach((id) => fetchPipelineData(id));

//       console.log("Job list by account ID", data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const fetchPipelineData = async (pipelineId) => {
//     setLoading(true);
//     try {
//       const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${pipelineId}`;
//       const response = await fetch(url);
//       const data = await response.json();

//       // Append pipeline data to state
//       setPipelineData((prevData) => [
//         ...prevData,
//         { ...data.pipeline, stages: data.pipeline.stages || [] }, // Ensure stages are included
//       ]);

//       console.log(`Pipeline data for ID ${pipelineId}:`, data.pipeline);
//     } catch (error) {
//       console.error("Error fetching pipeline data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchJobList();
//   }, []);

//   // Remove duplicate pipeline names
//   const uniquePipelines = Array.from(
//     new Map(pipelineData.map((pipeline) => [pipeline._id, pipeline])).values()
//   );

//   return (
//     <Box>
//       {loading && <p>Loading pipeline data...</p>}
//       {uniquePipelines.map((pipeline, index) => (
//         <Box key={index}>
//           {/* <p>Pipeline ID: {pipeline._id}</p> */}
//           <p>Pipeline Name: {pipeline.pipelineName}</p>
//           <Box className="stage-container" display="flex" gap={2}>
//             <p><strong>Stages:</strong></p>
//             {pipeline.stages && pipeline.stages.length > 0 ? (
//               pipeline.stages.map((stage, stageIndex) => (
//                 <Box key={stageIndex} sx={{ marginBottom: 1 }}>
//                   <p>Stage Name: {stage.name}</p>
//                   {/* Display jobs that belong to this pipeline and stage */}
//                   {jobData
//                     .filter((job) => job.PipelineId === pipeline._id) // Match jobs to the current pipeline
//                     .map((job, jobIndex) => (
//                       <Box key={jobIndex} sx={{ padding: 1, border: '1px solid #ccc', marginTop: 2 }}>
//                         <p>Job ID: {job._id}</p>
//                         <p>Job Name: {job.Name}</p>
//                         <p>Job Status: {job.status}</p>
//                         {/* You can add more details about the job if needed */}
//                       </Box>
//                     ))}
//                 </Box>
//               ))
//             ) : (
//               <p>No stages available.</p>
//             )}
//           </Box>
//         </Box>
//       ))}
//     </Box>
//   );
// }

// export default Pipelines;



// import React, { useEffect, useState } from 'react';
// import { Box } from "@mui/material";
// import { useParams, } from "react-router-dom";
// import { differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";
// const Pipelines = () => {
//   const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
//   const [jobData, setJobData] = useState([]);
//   const [pipelineData, setPipelineData] = useState([]); // Initialize as an array
//   const [loading, setLoading] = useState(false);
//   const { data } = useParams();
//   console.log(data);
//   useEffect(() => {
//     fetchJobList(data);
//   }, []);
//   const fetchJobList = (data) => {
//     const url = `http://127.0.0.1:7550/workflow/jobs/job/joblist/list/true/${data}`;
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };
//     fetch(url, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         console.log(result)
//         const jobList = result.jobList || [];
//         setJobData(jobList); // Set the job list data to state
//         // Extract all PipelineIds
//         const pipelineIds = jobList.map((job) => job.PipelineId);
//         console.log("All PipelineIds:", pipelineIds);
//         // Fetch pipeline data for each PipelineId
//         pipelineIds.forEach((id) => fetchPipelineData(id));
//         console.log("Job list by account ID", data);
//       })
//       .catch((error) => {
//         console.error("Error fetching job list:", error);
//       });
//   };
//   const fetchPipelineData = async (pipelineId) => {
//     setLoading(true);
//     try {
//       const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${pipelineId}`;
//       const response = await fetch(url);
//       const data = await response.json();
//       // Append pipeline data to state
//       setPipelineData((prevData) => [
//         ...prevData,
//         { ...data.pipeline, stages: data.pipeline.stages || [] }, // Ensure stages are included
//       ]);
//       console.log(`Pipeline data for ID ${pipelineId}:`, data.pipeline);
//     } catch (error) {
//       console.error("Error fetching pipeline data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // Remove duplicate pipeline names
// const uniquePipelines = Array.from(
//   new Map(pipelineData.map((pipeline) => [pipeline._id, pipeline])).values()
// );
// const truncateName = (name) => {
//   const maxLength = 20;
//   if (name.length > maxLength) {
//     return name.substring(0, maxLength) + "...";
//   }
//   return name;
// };
// const stripHtmlTags = (html) => {
//   const doc = new DOMParser().parseFromString(html, "text/html");
//   return doc.body.textContent || "";
// };
// const truncateDescription = (description, maxLength = 30) => {
//   if (description.length > maxLength) {
//     return description.slice(0, maxLength) + "...";
//   }
//   return description;
// };
// const getPriorityStyle = (priority) => {
//   switch (priority.toLowerCase()) {
//     case "urgent":
//       return { color: "white", backgroundColor: "#0E0402", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" };
//     case "high":
//       return { color: "white", backgroundColor: "#fe676e", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" }; // light red background
//     case "medium":
//       return { color: "white", backgroundColor: "#FFC300", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" }; // light orange background
//     case "low":
//       return { color: "white", backgroundColor: "#56c288", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" }; // light green background
//     default:
//       return {};
//   }
// };
// const formatDate = (date) => {
//   if (!date) return ""; // Handle null or undefined dates
//   const options = { month: "short", day: "2-digit", year: "numeric" };
//   return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
// };
// const timeAgo = (date) => {
//   if (!date) return "N/A";
//   const currentTime = new Date();
//   const jobTime = new Date(date);

//   const minutesDiff = differenceInMinutes(currentTime, jobTime);
//   const hoursDiff = differenceInHours(currentTime, jobTime);
//   const daysDiff = differenceInDays(currentTime, jobTime);

//   if (minutesDiff < 1) {
//     return "just now";
//   } else if (minutesDiff < 60) {
//     return `${minutesDiff} minute${minutesDiff === 1 ? "" : "s"} ago`;
//   } else if (hoursDiff < 24) {
//     return `${hoursDiff} hour${hoursDiff === 1 ? "" : "s"} ago`;
//   } else {
//     return `${daysDiff} day${daysDiff === 1 ? "" : "s"} ago`;
//   }
// };
//   return (
//     <Box>
//       {loading && <p>Loading pipeline data...</p>}
//       {uniquePipelines.map((pipeline, index) => (
//         <Box key={index}>
//           <p>Pipeline Name: {pipeline.pipelineName}</p>
//           <Box className="stage-container" display="flex" gap={2}  sx={{
//               border: '2px solid red',
//               padding: 2,
//               overflowY: 'auto',
//               whiteSpace: 'nowrap',
//             }}>
//             {pipeline.stages && pipeline.stages.length > 0 ? (
//               pipeline.stages.map((stage, stageIndex) => (
//                 <Box>
//                 <p>{stage.name}</p>
//                 <Box key={stageIndex}  sx={{
//                   width: 260,
//                   height: 500,
//                   overflowY:'auto',
//                   border: '2px solid black',
//                   padding: 2,
//                   overflowX: 'hidden',
//                   textAlign: 'center',
//                   flexShrink: 0,
//                 }}>


//                   {jobData
//                     .filter((job) => job.PipelineId === pipeline._id) // Match jobs to the current pipeline
//                     .filter((job) => job.Stage.includes(stage.name)) // Match jobs to the current stage
//                     .map((job, jobIndex) => (
//                       <Box key={jobIndex}   sx={{
//                         padding: 1,
//                         border: '1px solid #ccc',

//                         width: 240,
//                         height: 'auto',
//                         background: '#f9f9f9',
//                         textAlign: 'left',

//                       }}>

//                         <p>{job.Account.join(", ")}</p>
//                         <p>{truncateName(job.Name)}</p>
//                         <p>{job.JobAssignee.join(', ')}</p>
//                         <p>{truncateDescription(stripHtmlTags(job.Description))}</p>
//                         <span style={getPriorityStyle(job.Priority)}>{job.Priority}</span>
// <p>Start Date: {formatDate(job.StartDate)}</p>
// <p>Due Date: {formatDate(job.DueDate)}</p>

// <p>
//    {timeAgo(job.updatedAt)}
// </p>
//                       </Box>
//                     ))}
//                 </Box>
//                 </Box>
//               ))
//             ) : (
//               <p>No stages available.</p>
//             )}
//           </Box>
//         </Box>
//       ))}
//     </Box>
//   );
// }

// export default Pipelines;





import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Box ,Dialog, DialogActions, DialogContent, DialogTitle, Button} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./style.css"
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from '@mui/icons-material/Archive'; 
import { differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";
const ItemTypes = {
  JOB: "job",
};

const Pipelines = () => {
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;

  const [jobData, setJobData] = useState([]);
  const [pipelineData, setPipelineData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data } = useParams();
  
  useEffect(() => {
    fetchJobList(data);
  }, [data]);

  const fetchJobList = (data) => {
    const url = `${JOBS_API}/workflow/jobs/job/joblist/list/true/${data}`;

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setJobData(result.jobList || []);
        console.log("joblist",result.jobList)
        const pipelineIds = result.jobList.map((job) => job.PipelineId);
        console.log("Pipeline IDs:", pipelineIds);
        pipelineIds.forEach((id) => fetchPipelineData(id));
      })
      .catch((error) => {
        console.error("Error fetching job list:", error);
      });
  };

  const fetchPipelineData = async (pipelineId) => {
    console.log("test",pipelineId)
    setLoading(true);
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${pipelineId}`;
      const response = await fetch(url);
      const data = await response.json();
      setPipelineData((prevData) => [
        ...prevData,
        { ...data.pipeline, stages: data.pipeline.stages || [] },
      ]);
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (jobId, stageName) => {
    const updatedJobs = jobData.map((job) =>
      job.id === jobId ? { ...job, Stage: [stageName] } : job
    );
    setJobData(updatedJobs);

    // Optional: Re-fetch job data after delay to sync with backend
    setTimeout(() => {
      fetchJobList(data);
    }, 1000);
  };

  const updateJobStage = async (stage, item) => {
    const data = JSON.stringify({ stageid: stage._id });
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${JOBS_API}/workflow/jobs/job/jobpipeline/updatestageid/${item.id}`,
      headers: { "Content-Type": "application/json" },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const moveJob = (jobId, targetStage, stage) => {
    handleDrop(jobId, targetStage);
    updateJobStage(stage, { id: jobId });
  };
  const uniquePipelines = Array.from(
    new Map(pipelineData.map((pipeline) => [pipeline._id, pipeline])).values()
  );
  return (
    <DndProvider backend={HTML5Backend}>
      <Box>
        {loading && <p>Loading pipeline data...</p>}
        {uniquePipelines.map((pipeline, index) => (
          <Pipeline
            key={index}
            pipeline={pipeline}
            jobData={jobData}
            moveJob={moveJob}
            fetchJobList={fetchJobList}
            data={data}
          />
        ))}
      </Box>
    </DndProvider>
  );
};

const Pipeline = ({ pipeline, jobData, moveJob,fetchJobList, data }) => {
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const [checkedJobIds, setCheckedJobIds] = useState([]);
  const handleJobCheckboxChange = (isChecked, jobId) => {
    setCheckedJobIds((prevIds) =>
      isChecked ? [...prevIds, jobId] : prevIds.filter((id) => id !== jobId)
    );
  };
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const handleDialogOpen = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const handleDelete = () => {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    // Delete each checked job
    Promise.all(
      checkedJobIds.map((jobId) =>
        fetch(`${JOBS_API}/workflow/jobs/job/${jobId}`, requestOptions)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to delete job ID: ${jobId}`);
            }
            return response.json();
          })
      )
    )
      .then(() => {
        console.log("Jobs deleted successfully:", checkedJobIds);
        toast.success("Jobs deleted successfully");
        fetchJobList(data); 
      })
      .catch((error) => {
        console.error("Error deleting jobs:", error);
        toast.error("Failed to delete some jobs");
      });
  };
  const navigate = useNavigate();
  const handleArchive = async () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        active: false, // Update the active status to false
      }),
      redirect: "follow",
    };
  
    try {
      // Send PATCH request for each checked job
      const archivePromises = checkedJobIds.map((jobId) =>
        fetch(
          `${JOBS_API}/workflow/jobs/job/${jobId}`,
          requestOptions
        ).then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to archive job ID: ${jobId}`);
          }
          return response.json();
        })
      );
  
      // Wait for all requests to complete
      await Promise.all(archivePromises);
      toast.success("Jobs archived successfully");
  
      // Refresh job list and navigate to archived jobs page
      fetchJobList(data); // Refresh job data
      navigate(`/accountsdash/workflow/${data}/archivedjobs`);
    } catch (error) {
      console.error("Error archiving jobs:", error);
      toast.error("Failed to archive some jobs");
    }
  };
  


  return (
    <Box sx={{ border: "1px solid grey", borderRadius: '10px', marginBottom: '15px' }}>
      <h3 style={{ marginLeft: '15px' }}>{pipeline.pipelineName}</h3>
       {checkedJobIds.length > 0 && (
        <Box>
        <Box sx={{display:'flex', alignItems:'center', gap:2}}>
        <DeleteIcon
          // onClick={handleDelete}
          onClick={() => handleDialogOpen("delete")}
          sx={{
            marginLeft: "15px",
            color: "red",
            cursor: "pointer",
            transform: "scale(1)",
          }}
        />
        <Box sx={{  display: 'flex', alignItems: 'center' }}>
        <ArchiveIcon sx={{ marginRight: 1, cursor:'pointer' }} 
        // onClick={handleArchive} 
        onClick={() => handleDialogOpen("archive")}
        />
        <p>Archive</p>
      </Box>
      </Box>
      <Dialog open={openDialog} onClose={handleDialogClose}>
      <DialogTitle>
        {dialogType === "delete" ? "Confirm Delete" : "Confirm Archive"}
      </DialogTitle>
      <DialogContent>
        Are you sure you want to{" "}
        {dialogType === "delete" ? "delete" : "archive"} these jobs?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={dialogType === "delete" ? handleDelete : handleArchive}
          color="primary"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
    </Box>
      )}
      
      <Box
        className="stage-container"
        display="flex"
        gap={2}
        sx={{
          padding: 2,
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        {pipeline.stages.map((stage, stageIndex) => (
          <Stage
            key={stageIndex}
            stage={stage}
            jobs={jobData.filter(
              (job) =>
                job.PipelineId === pipeline._id && job.Stage.includes(stage.name)
            )}
            moveJob={(jobId, targetStage) => moveJob(jobId, targetStage, stage)}
            onCheckboxChange={handleJobCheckboxChange}
          />
        ))}
      </Box>
    </Box>
  );
};

const Stage = ({ stage, jobs, moveJob ,onCheckboxChange }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.JOB,
    drop: (item) => moveJob(item.id, stage.name),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <Box
      ref={drop}
      sx={{
        width: 250,
        height: 500,
        padding: 2,
        backgroundColor: isOver ? "white" : "#f2f7f7",
        overflowY: "auto",
        overflowX: 'hidden',
        borderRadius: '10px',
        flexShrink: 0,
      }}
    >
      <p>{stage.name}</p>
      {jobs.map((job) => (
        <Job key={job.id} job={job} onCheckboxChange ={onCheckboxChange }/>
      ))}
    </Box>
  );
};

const Job = ({ job,onCheckboxChange  }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.JOB,
    item: { id: job.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const truncateName = (name) => {
    const maxLength = 20;
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + "...";
    }
    return name;
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
  const formatDate = (date) => {
    if (!date) return ""; // Handle null or undefined dates
    const options = { month: "short", day: "2-digit", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };
  const timeAgo = (date) => {
    if (!date) return "N/A";
    const currentTime = new Date();
    const jobTime = new Date(date);
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
  const [isHovered, setIsHovered] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    onCheckboxChange(checked, job.id); // Notify the pipeline about the checkbox status.
    if (checked) {
      console.log("Checked Job ID:", job.id);
    }
  };
  return (
    <Box
      ref={drag}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        padding: 1,
        border: "1px solid #ccc",
        marginTop: 2,
        width: 230,
        background: isDragging ? "#f0f0f0" : "#f9f9f9",
        textAlign: "left",
        opacity: isDragging ? 0.5 : 1,
        borderRadius: '5px',
        cursor: 'pointer',
        position: "relative",
      }}
    >
      {(isHovered || isChecked) && (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            cursor: "pointer",
            transform: "scale(1.2)",
          }}
        />
      )}
      <p>{job.Account.join(", ")}</p>
      <p>{truncateName(job.Name)}</p>
      <p>{job.JobAssignee.join(", ")}</p>
      <p>{truncateDescription(stripHtmlTags(job.Description))}</p>
      <span style={getPriorityStyle(job.Priority)}>{job.Priority}</span>
      <p>Start Date: {formatDate(job.StartDate)}</p>
      <p>Due Date: {formatDate(job.DueDate)}</p>
      <p>
        {timeAgo(job.updatedAt)}
      </p>

    </Box>
  );
};
export default Pipelines;
