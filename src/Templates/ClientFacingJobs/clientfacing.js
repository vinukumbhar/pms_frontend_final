import React, { useState, useEffect } from "react";
import { Container, Box, Button, Typography, Drawer, Select, MenuItem, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IoClose } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

const Clientfacing = () => {
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
  const [clientFacingJobs, setClientFacingJobs] = useState([]);
  const [clientFacingName, setClientFacingName] = useState("");
  // const [clientFacingColour, setClientFacingColour] = useState("");
  const [clientFacingDescription, setClientFacingDescription] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const colors = ["#fd3241", "#f9b5ac", "#ac6400", "#ff7e39", "#ffea00", "#94ecbe", "#2e8b57", "#76ac1e", "#3cbb50", "#9ed8db", "#0299bb", "#0af4b8", "#466efb", "#0496ff", "#b9c1ff", "#e1b1ff", "#9d33d0", "#d834f5", "#ff54b6", "#1d3354", "#767b91", "#8f8f8f", "#c7c7c7", "#9a657e", "#616468", "#511dff", "#85c7db", "#8cd1ff", "#0aefff", "#d4ff00", "#a1ff0a", "#00f43d", "#ffc100", "#cdc6a5", "#fed6b1", "#e5dfdf", "#ffeaa7"];

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  // const handleNewDrawerOpen = () => {
  //   setIsNewDrawerOpen(true);
  // };

  const handleNewDrawerOpen = (jobId) => {
    console.log("Opening drawer for job ID:", jobId); // Log the job ID
    setIsNewDrawerOpen(true);
  };

  const handleNewDrawerClose = () => {
    setIsNewDrawerOpen(false);
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  // const fetchData = async () => {
  const fetchData = async () => {
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

  // useEffect to fetch jobs when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const createJobFacing = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      clientfacingName: clientFacingName,
      clientfacingColour: selectedColor,
      clientfacingdescription: clientFacingDescription,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        fetchData();
        handleClearTemp();
        handleDrawerClose();
        toast.success("Client Facing Jobs created successfully");
      })
      .catch((error) => console.error(error));
  };

  const handleClearTemp = () => {
    setClientFacingName("");
    setClientFacingDescription("");
    setSelectedColor("");
    handleDrawerClose();
  };
  const handleupdateclientstatus = () => {
    updateJobFacing(jobId);
  };

  const updateJobFacing = async (jobId) => {
    console.log(jobId);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      clientfacingName: clientFacingName,
      clientfacingColour: selectedColor,
      clientfacingdescription: clientFacingDescription,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(jobId);
    fetch(`${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${jobId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        fetchData();
        handleClearTemp();
        handleNewDrawerClose();
        toast.success("Client Facing Jobs Updated successfully");
      })
      .catch((error) => console.error(error));
  };

  const deleteJobFacing = async (jobId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this client facing job?");

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        clientfacingName: clientFacingName,
        clientfacingColour: selectedColor,
        clientfacingdescription: clientFacingDescription,
      });

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${jobId}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          fetchData();
          toast.success("Item deleted successfully");
        })
        .catch((error) => console.error(error));
    }
  };
  //

  const handleEdit = async (jobId) => {
    console.log(jobId);
    handleNewDrawerOpen(jobId);
    try {
      const response = await fetch(`${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${jobId}`);
      const data = await response.json();
      console.log("Fetched job data:", data);
      setJobId(data.clientfacingjobstatuses._id);
      setSelectedColor(data.clientfacingjobstatuses.clientfacingColour);
      console.log(data.clientfacingjobstatuses.clientfacingColour);
      setClientFacingName(data.clientfacingjobstatuses.clientfacingName);
      setClientFacingDescription(data.clientfacingjobstatuses.clientfacingdescription);
      console.log(data.clientfacingjobstatuses.clientfacingdescription);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };
  console.log(jobId);
  return (
    <Container>
      <Box className="tag-container">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Button variant="contained" onClick={handleDrawerOpen}>
            Create Status
          </Button>
        </Box>

        {/* Display Current Status */}
        <Box>
          {clientFacingJobs.map((job) => (
            <Box key={job._id} style={{ padding: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "15px" }}>
              <Box style={{ display: "flex", alignItems: "center" }}>
                <GoDotFill style={{ color: job.clientfacingColour, marginRight: "8px", fontSize: "25px" }} />
                <div>
                  <strong>{job.clientfacingName}</strong>
                  <br />
                  {job.clientfacingdescription}
                </div>
              </Box>
              <Box style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <BorderColorIcon onClick={() => handleEdit(job._id)} style={{ marginRight: "8px", color: "#1168bf", cursor: "pointer" }} />
                <DeleteIcon onClick={() => deleteJobFacing(job._id)} sx={{ color: "#f52d2d", cursor: "pointer" }} />
              </Box>
            </Box>
          ))}
        </Box>
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          PaperProps={{
            id: "tag-drawer",
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : 500,
              maxWidth: "100%",
              [theme.breakpoints.down("sm")]: {
                width: "100%",
              },
            },
          }}
        >
          <Box sx={{ borderRadius: isSmallScreen ? "0" : "15px" }} role="presentation">
            <Box>
              <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px", borderBottom: "1px solid #e2e8f0" }}>
                <Typography variant="h6">
                  <b>Create client-facing job status template</b>
                </Typography>
                <IoClose onClick={handleDrawerClose} style={{ cursor: "pointer" }} />
              </Box>

              <Box m={3}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3, justifyContent: "space-between", width: "100%" }}>
                  <Box sx={{ flexGrow: 1 }}>
                    {" "}
                    {/* Adjust margin to align with the TextField */}
                    <label className="tag-input-label">Color</label>
                    <Select
                      value={selectedColor}
                      onChange={handleColorChange}
                      size="small"
                      sx={{ width: "100%", marginTop: "10px", backgroundColor: "#fff" }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            overflowY: "auto",
                          },
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select a color
                      </MenuItem>
                      {colors.map((color, index) => (
                        <MenuItem key={index} value={color}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Box
                              sx={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                backgroundColor: color,
                                marginRight: "10px",
                              }}
                            />
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <label className="tag-input-label">Name</label>
                    <TextField placeholder="Status Name" fullWidth margin="normal" size="small" sx={{ backgroundColor: "#fff" }} value={clientFacingName} onChange={(e) => setClientFacingName(e.target.value)} />
                  </Box>
                </Box>

                <Box sx={{ marginTop: 2 }}>
                  <label>Status description for client</label>
                  <TextField
                    sx={{ marginTop: 2 }}
                    fullWidth
                    id="outlined-multiline-static"
                    placeholder="Status description for client"
                    // label="Multiline"
                    multiline
                    rows={2}
                    value={clientFacingDescription}
                    onChange={(e) => setClientFacingDescription(e.target.value)}
                  />
                </Box>

                <Box sx={{ pt: 5, display: "flex", alignItems: "center", gap: 5 }}>
                  <Button onClick={createJobFacing} variant="contained" color="primary">
                    Submit
                  </Button>
                  <Button variant="outlined" onClick={handleClearTemp}>
                    Clear
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Drawer>

        {/* new drawer for edit */}
        <Drawer
          anchor="right"
          open={isNewDrawerOpen}
          onClose={handleNewDrawerClose}
          PaperProps={{
            id: "tag-drawer",
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : 500,
              maxWidth: "100%",
              [theme.breakpoints.down("sm")]: {
                width: "100%",
              },
            },
          }}
        >
          <Box sx={{ borderRadius: isSmallScreen ? "0" : "15px" }} role="presentation">
            <Box>
              <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px", borderBottom: "1px solid #e2e8f0" }}>
                <Typography variant="h6">
                  <b>Update client-facing job status template</b>
                </Typography>
                <IoClose onClick={handleNewDrawerClose} style={{ cursor: "pointer" }} />
              </Box>

              <Box m={3}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3, justifyContent: "space-between", width: "100%" }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <label className="tag-input-label">Color</label>
                    <Select
                      value={selectedColor}
                      onChange={handleColorChange}
                      size="small"
                      sx={{ width: "100%", marginTop: "10px", backgroundColor: "#fff" }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            overflowY: "auto",
                          },
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select a color
                      </MenuItem>
                      {colors.map((color, index) => (
                        <MenuItem key={index} value={color}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Box
                              sx={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                backgroundColor: color,
                                marginRight: "10px",
                              }}
                            />
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <label className="tag-input-label">Name</label>
                    <TextField placeholder="Status Name" fullWidth margin="normal" size="small" sx={{ backgroundColor: "#fff" }} value={clientFacingName} onChange={(e) => setClientFacingName(e.target.value)} />
                  </Box>
                </Box>

                <Box sx={{ marginTop: 2 }}>
                  <label>Status description for client</label>
                  <TextField sx={{ marginTop: 2 }} fullWidth id="outlined-multiline-static" placeholder="Status description for client" multiline rows={2} value={clientFacingDescription} onChange={(e) => setClientFacingDescription(e.target.value)} />
                </Box>

                <Box sx={{ pt: 5, display: "flex", alignItems: "center", gap: 5 }}>
                  <Button onClick={handleupdateclientstatus} variant="contained" color="primary">
                    Submit
                  </Button>
                  <Button variant="outlined" onClick={handleNewDrawerClose}>
                    Clear
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Container>
  );
};

export default Clientfacing;

// import React, { useState, useEffect } from 'react';
// import { Container, Box, Button, Typography, Drawer, Select, MenuItem, TextField ,Paper} from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { IoClose } from "react-icons/io5";
// import { GoDotFill } from "react-icons/go";
// import { Padding } from '@mui/icons-material';
// const colors = [
//   '#FF5733', // Example color
//   '#33FF57', // Example color
//   '#3357FF', // Example color
//   '#FF33A1', // Example color
//   '#FF8C33', // Example color
//   '#33FFF5', // Example color
//   // Add more colors as needed
// ];

// const Clientfacing = () => {
//   const [clientFacingName, setClientFacingName] = useState("");
//   const [clientFacingDescription, setClientFacingDescription] = useState("");
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [selectedColor, setSelectedColor] = useState('');
//   const [clientFacingJobs, setClientFacingJobs] = useState([]); // Initialize as an empty array
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

//   // Fetch data from the API
//   const fetchData = async () => {
//     try {
//       const response = await fetch("http://127.0.0.1:7500/workflow/clientfacingjobstatus/");
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       const data = await response.json();
//       setClientFacingJobs(data.clientFacingJobStatues); // Ensure data is set correctly
//       console.log(data)
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData(); // Fetch data when the component mounts
//   }, []);

//   const createJobFacing = () => {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//       clientfacingName: clientFacingName,
//       clientfacingColour: selectedColor,
//       clientfacingdescription: clientFacingDescription,
//     });

//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow",
//     };

//     fetch("http://127.0.0.1:7500/workflow/clientfacingjobstatus/", requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         console.log(result);
//         fetchData(); // Fetch the updated list after creating a new job
//       })
//       .catch((error) => console.error(error));
//   };

//   const handleColorChange = (event) => {
//     setSelectedColor(event.target.value);
//   };

//   return (
//     <Container>
//       <Box className="tag-container">
//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             mb: 2,
//           }}
//         >
//           <Button variant="contained" onClick={() => setIsDrawerOpen(true)}>Create Status</Button>
//         </Box>

//         <Box>
//           {clientFacingJobs.map(job => (
//             <Box key={job._id} style={{ padding: '10px', display: 'flex', alignItems: 'center', marginBottom: '8px', border: "1px solid #e2e8f0", borderRadius: '10px' }}>
//               <GoDotFill style={{ color: job.clientfacingColour, marginRight: '8px' }} />
//               <div>
//                 <strong>{job.clientfacingName}</strong>
//                 <br />
//                 {job.clientfacingdescription}
//               </div>
//             </Box>
//           ))}
//         </Box>

//         <Drawer
//           anchor='right'
//           open={isDrawerOpen}
//           onClose={() => setIsDrawerOpen(false)}
//           PaperProps={{
//             id: 'tag-drawer',
//             sx: {
//               borderRadius: isSmallScreen ? '0' : '10px 0 0 10px',
//               width: isSmallScreen ? '100%' : 500,
//               maxWidth: '100%',
//             }
//           }}
//         >
//           <Box sx={{ borderRadius: isSmallScreen ? '0' : '15px' }} role="presentation">
//             <Box>
//               <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #e2e8f0' }}>
//                 <Typography variant="h6"><b>Create client-facing job status template</b></Typography>
//                 <IoClose onClick={() => setIsDrawerOpen(false)} style={{ cursor: 'pointer' }} />
//               </Box>

//               <Box m={3}>
//                 <Box sx={{ display: "flex", alignItems: 'center', gap: 3, justifyContent: 'space-between', width: '100%' }}>
//                   <Box sx={{ flexGrow: 1 }}>
//                     <label className='tag-input-label'>Color</label>
//                     <Select
//                       value={selectedColor}
//                       onChange={handleColorChange} // Use the handleColorChange function
//                       size="small"
//                       sx={{ width: '100%', marginTop: '10px', backgroundColor: '#fff' }}
//                       MenuProps={{
//                         PaperProps: {
//                           sx: {
//                             maxHeight: 200,
//                             overflowY: 'auto',
//                           },
//                         },
//                       }}
//                     >
//                       <MenuItem value="" disabled>Select a color</MenuItem>
//                       {colors.map((color, index) => (
//                         <MenuItem key={index} value={color}>
//                           <Box sx={{
//                             display: 'flex',
//                             alignItems: 'center',
//                           }}>
//                             <Box
//                               sx={{
//                                 width: '20px',
//                                 height: '20px',
//                                 borderRadius: '50%',
//                                 backgroundColor: color,
//                                 marginRight: '10px',
//                               }}
//                             />
//                           </Box>
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </Box>

//                   <Box sx={{ flexGrow: 1 }}>
//                     <label className='tag-input-label'>Name</label>
//                     <TextField
//                       placeholder="Status Name"
//                       fullWidth
//                       margin="normal"
//                       size="small"
//                       sx={{ backgroundColor: '#fff' }}
//                       value={clientFacingName}
//                       onChange={(e) => setClientFacingName(e.target.value)}
//                     />
//                   </Box>
//                 </Box>

//                 <Box sx={{ marginTop: 2 }}>
//                   <label>Status description for client</label>
//                   <TextField
//                     sx={{ marginTop: 2 }}
//                     fullWidth
//                     id="outlined-multiline-static"
//                     placeholder='Status description for client'
//                     multiline
//                     rows={2}
//                     value={clientFacingDescription}
//                     onChange={(e) => setClientFacingDescription(e.target.value)}
//                   />
//                 </Box>

//                 <Box sx={{ pt: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
//                   <Button onClick={createJobFacing} variant="contained" color="primary">Submit</Button>
//                   <Button variant="outlined">Clear</Button>
//                 </Box>
//               </Box>
//             </Box>
//           </Box>
//         </Drawer>
//       </Box>
//     </Container>
//   );
// };

// export default Clientfacing;
