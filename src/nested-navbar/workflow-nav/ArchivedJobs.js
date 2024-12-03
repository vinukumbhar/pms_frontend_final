// import React from 'react'

// const ArchivedJobs = () => {
//   return (
//     <div>ArchivedJobs</div>
//   )
// }

// export default ArchivedJobs

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Box } from "@mui/material";
// const ActiveJobs = () => {
//   const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
//   const [jobData, setJobData] = useState([]);
//   const { data } = useParams();

//   useEffect(() => {
//     fetchJobList(data);
//   }, [data]);

//   const fetchJobList = (data) => {
//     const url = `${JOBS_API}/workflow/jobs/job/joblist/list/true/${data}`;

//     fetch(url)
//       .then((response) => response.json())
//       .then((result) => {
//         console.log(result)
//         setJobData(result.jobList || []);
       
//       })
//       .catch((error) => {
//         console.error("Error fetching job list:", error);
//       });
//   };
//   return (
//    <Box></Box>
//   )
// }

// export default ActiveJobs


import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { GoDotFill } from "react-icons/go";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const ArchivedJobs = () => {
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const [jobData, setJobData] = useState([]);
  const { data } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    fetchJobList(data);
  }, [data]);

  const fetchJobList = (data) => {
    const url = `${JOBS_API}/workflow/jobs/job/joblist/list/false/${data}`;

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setJobData(result.jobList || []);
      })
      .catch((error) => {
        console.error("Error fetching job list:", error);
      });
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Formats date as dd/mm/yyyy
  };
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for menu
  const [selectedJobId, setSelectedJobId] = useState(null); // Store selected Job ID
  const handleSettingsClick = (event, jobId) => {
    setAnchorEl(event.currentTarget); // Open the menu
    setSelectedJobId(jobId); // Store the selected job ID
  };

  const handleCloseMenu = () => {
    setAnchorEl(null); // Close the menu
  };

  
  // const handleActive = () => {
  //   if (!selectedJobId) return;

  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");

  //   const raw = JSON.stringify({ active: false });

  //   const requestOptions = {
  //     method: "PATCH",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };

  //   const archiveUrl = `http://127.0.0.1:7550/workflow/jobs/job/${selectedJobId}`;

  //   fetch(archiveUrl, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log("Archive result:", result);
  //       setJobData((prevJobs) =>
  //         prevJobs.filter((job) => job.id !== selectedJobId)
  //       ); // Remove archived job from the table
  //       handleClose();
  //       fetchJobList(data)
  //     })
  //     .catch((error) => {
  //       console.error("Error archiving job:", error);
  //       handleClose();
  //     });
  // };

  // const handleDelete = () => {
  //   if (!selectedJobId) return;

  //   const requestOptions = {
  //     method: "DELETE",
  //     redirect: "follow",
  //   };

  //   const deleteUrl = `http://127.0.0.1:7550/workflow/jobs/job/${selectedJobId}`;

  //   fetch(deleteUrl, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log("Delete result:", result);
  //       setJobData((prevJobs) =>
  //         prevJobs.filter((job) => job.id !== selectedJobId)
  //       ); // Remove deleted job from the table
  //       handleClose();
  //       fetchJobList(data)
  //     })
  //     .catch((error) => {
  //       console.error("Error deleting job:", error);
  //       handleClose();
  //     });
  // };
  const [actionType, setActionType] = useState(""); // Archive or Delete
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state
  const openConfirmationDialog = (type) => {
    setActionType(type);
    setIsDialogOpen(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmAction = () => {
    if (actionType === "active") {
      handleActive();
    } else if (actionType === "delete") {
      handleDelete();
    }
    handleCloseDialog();
  };

  const handleActive = () => {
    if (!selectedJobId) return;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ active: true });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const archiveUrl = `${JOBS_API}/workflow/jobs/job/${selectedJobId}`;

    fetch(archiveUrl, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Active result:", result);
        toast.success("Job activated  successfully");
        navigate(`/accountsdash/workflow/${data}/activejobs`)
        setJobData((prevJobs) =>
          prevJobs.filter((job) => job.id !== selectedJobId)
        ); // Remove archived job from the table
      })
      .catch((error) => {
        console.error("Error activing job:", error);
        toast.error("Error activing job")
      });
  };

  const handleDelete = () => {
    if (!selectedJobId) return;

    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    const deleteUrl = `${JOBS_API}/workflow/jobs/job/${selectedJobId}`;

    fetch(deleteUrl, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Delete result:", result);
        toast.success("Job deleted successfully")
        setJobData((prevJobs) =>
          prevJobs.filter((job) => job.id !== selectedJobId)
        ); // Remove deleted job from the table
      })
      .catch((error) => {
        console.error("Error deleting job:", error);
        toast.error("Error deleting job")
      });
  };
  return (
    <Box sx={{ padding: 2 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Job Assignee(s)</strong></TableCell>
              <TableCell><strong>Pipeline</strong></TableCell>
              <TableCell><strong>Stage</strong></TableCell>
           
              <TableCell><strong>Starts In</strong></TableCell>
              <TableCell><strong>Due In</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Settings</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobData.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.Name}</TableCell>
                <TableCell>{job.JobAssignee.join(", ")}</TableCell>
                <TableCell>{job.Pipeline}</TableCell>
                <TableCell>{job.Stage.join(", ")}</TableCell>
               
                <TableCell>{formatDate(job.StartDate)}</TableCell>
                <TableCell>{formatDate(job.DueDate)}</TableCell>
<TableCell>
                  {job.ClientFacingStatus ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <GoDotFill
                        style={{
                          color: job.ClientFacingStatus.statusColor,
                          fontSize: "25px",
                        }}
                      />
                      <span>{job.ClientFacingStatus.statusName}</span>
                    </Box>
                  ) : (
                    ""
                  )}
                </TableCell>
                 <TableCell>
                  <IconButton
                     onClick={(event) => handleSettingsClick(event, job.id)}
                    aria-label="Settings"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
       <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => openConfirmationDialog("active")}>Active</MenuItem>
        <MenuItem onClick={() => openConfirmationDialog("delete")}>Delete</MenuItem>
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {actionType} this job?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          
          <Button onClick={handleConfirmAction} color="primary">
            Confirm
          </Button>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ArchivedJobs;
