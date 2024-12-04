
// import { Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, IconButton, Drawer, Autocomplete, Box, Button, Typography, TextField } from '@mui/material';
// import React, { useState, useEffect } from 'react';
// import { useParams } from "react-router-dom";
// import { IoMdClose } from "react-icons/io";
// import { BsThreeDotsVertical } from 'react-icons/bs';
// import { toast } from 'react-toastify';

// const Documents = () => {
//   const API_KEY = process.env.REACT_APP_API_IP;
//   const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE
//   const [folderTemplates, setFolderTemplates] = useState([]);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const { data } = useParams();
//   console.log(data);

//   useEffect(() => {
//     fetchFolderData();
//   }, []);


//   const fetchFolderData = async () => {
//     try {
//       const url = `${API_KEY}/common/folder`;
//       const response = await fetch(url);
//       const data = await response.json();
//       setFolderTemplates(data.folderTemplates);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
//   const handleSelectTemplate = (selectedOptions) => {
//     setSelectedTemplate(selectedOptions);
//   };
//   const optionFolders = folderTemplates.map((folderTemplates) => ({
//     value: folderTemplates._id,
//     label: folderTemplates.templatename,
//   }));


//   const assignfoldertemp = () => {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//       accountId: data,
//       foldertempId: selectedTemplate.value,
//     });

//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow"
//     };
//     console.log(raw)
//     fetch(`${DOCS_MANAGMENTS}/clientdocs/accountfoldertemp`, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         console.log(result)
//         fetchFolders(data);
//         setSelectedTemplate(null)
//         toast.success("Folder Template Assign Successfully")
//       })
//       .catch((error) => {console.error(error)
//         toast.error("Failed to Assign Folder Template")
//       });
     
//   }

//   // Component to render folders and files recursively

//   const FolderContents = ({ contents }) => {
//     const styles = {
//       list: {
//         listStyle: 'none',
//         marginLeft: '1em',
//         paddingLeft: '0.5em',

//       },
//       item: {
//         marginBottom: '0.8em',
//         // borderBottom: "1px solid #ddd", // Add a horizontal line
//         paddingBottom: "0.5em",
//       },
//       folder: {
//         fontWeight: 'bold',
//         cursor: 'pointer',
//         color: '#007BFF',
//       },
//       file: {
//         color: '#333',
//       },
//     };

//     return (

//       <ul style={styles.list}>
//         {contents.map((item, index) => (
//           <li key={index} style={styles.item}>
//             {item.type === "folder" ? (
//               <CollapsibleFolder name={item.name}>
//                 <FolderContents contents={item.contents} />
//               </CollapsibleFolder>
//             ) : (
//               <span style={styles.file}>📄 {item.name}</span>
//             )}
//           </li>
//         ))}
//       </ul>
//     );
//   };
//   const CollapsibleFolder = ({ name, children }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [anchorEl, setAnchorEl] = useState(null);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [folderToDelete, setFolderToDelete] = useState(null);
//     const [openDrawerSubFolder, setOpenDrawerSubFolder] = useState(false)
//     const [newFolderName, setNewFolderName] = useState('');
//     const toggleDrawerSubFolder = (open) => {
//       setOpenDrawerSubFolder(open);
//     };
//     const handleToggle = () => {
//       setIsOpen((prev) => !prev);
//     };
//     const handleMenuClick = (event) => {
//       setAnchorEl(event.currentTarget); // Open the menu
//     };

//     const handleMenuClose = () => {
//       setAnchorEl(null); // Close the menu
//     };
//     const handleEdit = () => {
//       console.log("Edit folder", name);
//       handleMenuClose();
//     };

//     const handleDelete = () => {
//       // console.log("Delete folder", name);
//       setFolderToDelete(name); // Set the folder to delete
//       setOpenDialog(true); // Open the confirmation dialog


//     };
//     const handleDialogClose = () => {
//       setOpenDialog(false); // Close the dialog without deleting
//       setFolderToDelete(null); // Reset folder to delete
//       handleMenuClose();
//     };
//     const handleConfirmDelete = () => {
//       const myHeaders = new Headers();
//       myHeaders.append("Content-Type", "application/json");

//       const raw = JSON.stringify({
//         accountId: data,
//         subFolderName: name
//       });

//       const requestOptions = {
//         method: "DELETE",
//         headers: myHeaders,
//         body: raw,
//         redirect: "follow"
//       };

//       fetch("http://127.0.0.1:8002/clientdocs/clients/deleteSubFolder", requestOptions)
//         .then((response) => response.json())
//         .then((result) => {
//           console.log(result)
//           fetchFolders(data);
//           handleMenuClose();
//           setOpenDialog(false); // Close the dialog
//           setFolderToDelete(null); // Reset folder to delete
//           toast.success("Folder Deleted Successfully")
//         })
//         .catch((error) => {console.error(error)
//           toast.error("Failed to Assign Folder Template")
//         });


//     };
//     const handleCancelSubFolder = () => {
//       setNewFolderName(''); // Reset folder name input

//       toggleDrawerSubFolder(false); // Close the drawer
//     };
//     const handleNewFolder = () => {
//       // console.log("Create new folder in", name);

//       const myHeaders = new Headers();
//       myHeaders.append("Content-Type", "application/json");

//       const raw = JSON.stringify({
//         accountId: data,
//         subFolderName: name,
//         newFolderName: newFolderName
//       });

//       const requestOptions = {
//         method: "POST",
//         headers: myHeaders,
//         body: raw,
//         redirect: "follow"
//       };

//       fetch("http://127.0.0.1:8002/clientdocs/clients/folders/newfolder", requestOptions)
//         .then((response) => response.json())
//         .then((result) => {
//           console.log(result)
//           handleMenuClose();
//           setOpenDrawerSubFolder(false);

//           fetchFolders(data)
//           toast.success("New Folder Created Successfully")
//         })
//         .catch((error) => {console.error(error)
//           toast.error("Failed to delete folder")
//         });

//     };

//     // Check if the folder name is in the restricted list
//     const restrictedFolders = [
//       'FirmClient Uploaded Document',
//       'Firm Doc Shared With Client',
//       'Private'
//     ];

//     const isDeleteDisabled = restrictedFolders.includes(name);

//     const styles = {
//       folder: {
//         fontWeight: "bold",
//         cursor: "pointer",
//         color: "#007BFF",
//         display: "flex",
//         alignItems: "center",
//         // justifyContent: "space-between",
//       },
//       toggleIcon: {
//         marginRight: "0.5em",
//         cursor: "pointer",
//         userSelect: "none",
//         marginTop: '0.3em'

//       },
//       content: {
//         display: isOpen ? "block" : "none",

//       },
//       icon: {
//         cursor: 'pointer', // To make the icon clickable
//         marginLeft: 'auto'
//       }
//     };

//     return (
//       <div>
//         <div style={styles.folder} onClick={handleToggle}>
//           <span style={styles.toggleIcon}>{isOpen ? "📂" : "📁"}</span>
//           {name}
//           {/* Dropdown Icon */}
//           <IconButton onClick={handleMenuClick} style={styles.icon}>
//             <BsThreeDotsVertical />
//           </IconButton>
          
//           {/* Dropdown Menu */}
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleMenuClose}
//           >
//             <MenuItem onClick={handleEdit}>Edit</MenuItem>
//             <MenuItem onClick={handleDelete} disabled={isDeleteDisabled}>Delete</MenuItem>
//             <MenuItem onClick={() => toggleDrawerSubFolder(true)}>New Folder</MenuItem>
//           </Menu>
//         </div>
//         <div style={styles.content}>{children}</div>
//         <Dialog open={openDialog} onClose={handleDialogClose}>
//           <DialogTitle>Confirm Deletion</DialogTitle>
//           <DialogContent>
//             Are you sure you want to delete the folder: <strong>{folderToDelete}</strong>?
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleDialogClose} color="primary">
//               Cancel
//             </Button>
//             <Button onClick={handleConfirmDelete} color="secondary">
//               Confirm
//             </Button>
//           </DialogActions>
//         </Dialog>

//         <Drawer anchor="right" open={openDrawerSubFolder} onClose={() => toggleDrawerSubFolder(false)}>
//           <Box sx={{ width: 400, }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid red', p: 2, alignItems: 'center' }}>
//               <Typography variant="h6" gutterBottom>Create a New Folder</Typography>
//               <IoMdClose onClick={handleCancelSubFolder} style={{ cursor: 'pointer', fontSize: '25px' }} />
//             </Box>
//             {/* Form inside the Drawer */}
//             <Box sx={{ padding: 3 }}>
//               <Typography>Folder Name</Typography>
//               <TextField
//                 placeholder="Folder Name"
//                 variant="outlined"
//                 fullWidth
//                 size='small'
//                 value={newFolderName}
//                 onChange={(e) => setNewFolderName(e.target.value)}
//                 margin="normal"
//               />



//               {/* Buttons: Save and Cancel */}
//               <Box sx={{ display: 'flex', gap: 3, marginTop: 2 }}>

//                 <Button onClick={handleNewFolder} variant="contained" >
//                   Save
//                 </Button>
//                 <Button onClick={handleCancelSubFolder} variant="outlined" >
//                   Cancel
//                 </Button>
//               </Box>
//             </Box>
//           </Box>
//         </Drawer>
//       </div>
//     );
//   };
//   const [folderdata, setData] = useState(null); // Store the API response
//   const [error, setError] = useState(null); // Store error if any
//   const [loading, setLoading] = useState(true); // Track loading state
//   const [openDrawer, setOpenDrawer] = useState(false); // To control the drawer open/close state
//   const [folderName, setFolderName] = useState(''); // For folder name input
//   // Function to toggle the drawer
//   const toggleDrawer = (open) => {
//     setOpenDrawer(open);
//   };

//   // Handle form submission (Save button click)
//   const handleCreateFolder = async () => {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//       accountId: data,
//       subFolderName: folderName,

//     });

//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow"
//     };

//     fetch("http://127.0.0.1:8002/clientdocs/clients/folders", requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         console.log(result)
//         handleCancel()
//         fetchFolders(data);
//         toast.success("New folder created successfully")
//       })
//       .catch((error) => {console.error(error)
//         toast.error("Failed to create new folder")
//       });
//   };

//   // Handle Cancel button click (close the drawer)
//   const handleCancel = () => {
//     setFolderName(''); // Reset folder name input

//     toggleDrawer(false); // Close the drawer
//   };
//   const fetchFolders = async () => {
//     try {
//       const response = await fetch(
//         `${DOCS_MANAGMENTS}/clientdocs/folders/${data}`
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const result = await response.json();
//       setData(result); // Set the fetched data
//       console.log("folders data",result)
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchFolders(data);
//   }, []);

//   if (loading) {
//     return <p>Loading folder structure...</p>;
//   }
//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <Box>
//       <Box>
//         <Button variant="contained" color="primary" onClick={() => toggleDrawer(true)}>
//           Create Folder
//         </Button>
//         <Autocomplete
//           options={optionFolders}
//           getOptionLabel={(option) => option.label}
//           value={selectedTemplate}
//           onChange={(event, newValue) => handleSelectTemplate(newValue)}
//           isOptionEqualToValue={(option, value) => option.value === value.value}
//           renderOption={(props, option) => (
//             <Box
//               component="li"
//               {...props}
//               sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
//             >
//               {option.label}
//             </Box>
//           )}
//           renderInput={(params) => <TextField {...params} sx={{ backgroundColor: "#fff" }} placeholder="Select Folder " variant="outlined" size="small" />}
//           sx={{ width: "100%", marginTop: "8px" }}
//           clearOnEscape // Enable clearable functionality
//         />
//       </Box>

//       <Box mt={2}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={assignfoldertemp}
//           disabled={!selectedTemplate}
//         >
//           Assign Template
//         </Button>
//       </Box>
//       <Box> {folderdata && folderdata.contents && (
//         <FolderContents contents={folderdata.contents} />
//       )}</Box>

//       {/* Drawer for Folder Creation Form */}
//       <Drawer anchor="right" open={openDrawer} onClose={() => toggleDrawer(false)}>
//         <Box sx={{ width: 400, }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid red', p: 2, alignItems: 'center' }}>
//             <Typography variant="h6" gutterBottom>Create a New Folder</Typography>
//             <IoMdClose onClick={handleCancel} style={{ cursor: 'pointer', fontSize: '25px' }} />
//           </Box>
//           {/* Form inside the Drawer */}
//           <Box sx={{ padding: 3 }}>
//             <Typography>Folder Name</Typography>
//             <TextField
//               placeholder="Folder Name"
//               variant="outlined"
//               fullWidth
//               size='small'
//               value={folderName}
//               onChange={(e) => setFolderName(e.target.value)}
//               margin="normal"
//             />



//             {/* Buttons: Save and Cancel */}
//             <Box sx={{ display: 'flex', gap: 3, marginTop: 2 }}>

//               <Button onClick={handleCreateFolder} variant="contained" >
//                 Save
//               </Button>
//               <Button onClick={handleCancel} variant="outlined" >
//                 Cancel
//               </Button>
//             </Box>
//           </Box>
//         </Box>
//       </Drawer>
//     </Box>
//   );
// };

// export default Documents;





import { Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, IconButton, Drawer, Autocomplete, Box, Button, Typography, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { BsThreeDotsVertical } from 'react-icons/bs';
import { toast } from 'react-toastify';

const Documents = () => {
  const API_KEY = process.env.REACT_APP_API_IP;
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE
  const [folderTemplates, setFolderTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { data } = useParams();
  console.log(data);

  useEffect(() => {
    fetchFolderData();
  }, []);


  const fetchFolderData = async () => {
    try {
      const url = `${API_KEY}/common/folder`;
      const response = await fetch(url);
      const data = await response.json();
      setFolderTemplates(data.folderTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSelectTemplate = (selectedOptions) => {
    setSelectedTemplate(selectedOptions);
  };
  const optionFolders = folderTemplates.map((folderTemplates) => ({
    value: folderTemplates._id,
    label: folderTemplates.templatename,
  }));


  const assignfoldertemp = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountId: data,
      foldertempId: selectedTemplate.value,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    console.log(raw)
    fetch(`${DOCS_MANAGMENTS}/clientdocs/accountfoldertemp`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        fetchFolders(data);
        setSelectedTemplate(null)
        toast.success("Folder Template Assign Successfully")
      })
      .catch((error) => {console.error(error)
        toast.error("Failed to Assign Folder Template")
      });
     
  }

  // Component to render folders and files recursively

  const FolderContents = ({ contents }) => {
    const styles = {
      list: {
        listStyle: 'none',
        marginLeft: '1em',
        paddingLeft: '0.5em',

      },
      item: {
        marginBottom: '0.8em',
        // borderBottom: "1px solid #ddd", // Add a horizontal line
        paddingBottom: "0.5em",
      },
      folder: {
        fontWeight: 'bold',
        cursor: 'pointer',
        color: '#007BFF',
      },
      file: {
        color: '#333',
      },
    };

    return (

      <ul style={styles.list}>
        {contents.map((item, index) => (
          <li key={index} style={styles.item}>
            {item.type === "folder" ? (
              <CollapsibleFolder name={item.name}>
                <FolderContents contents={item.contents} />
              </CollapsibleFolder>
            ) : (
              <span style={styles.file}>📄 {item.name}</span>
            )}
          </li>
        ))}
      </ul>
    );
  };
  const CollapsibleFolder = ({ name, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState(null);
    const [openDrawerSubFolder, setOpenDrawerSubFolder] = useState(false)
    const [newFolderName, setNewFolderName] = useState('');
    const toggleDrawerSubFolder = (open) => {
      setOpenDrawerSubFolder(open);
    };
    const handleToggle = () => {
      setIsOpen((prev) => !prev);
    };
    const handleMenuClick = (event) => {
      setAnchorEl(event.currentTarget); // Open the menu
    };

    const handleMenuClose = () => {
      setAnchorEl(null); // Close the menu
    };
    const handleEdit = () => {
      console.log("Edit folder", name);
      handleMenuClose();
    };

    const handleDelete = () => {
      // console.log("Delete folder", name);
      setFolderToDelete(name); // Set the folder to delete
      setOpenDialog(true); // Open the confirmation dialog


    };
    const handleDialogClose = () => {
      setOpenDialog(false); // Close the dialog without deleting
      setFolderToDelete(null); // Reset folder to delete
      handleMenuClose();
    };
    const handleConfirmDelete = () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        accountId: data,
        subFolderName: name
      });

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch("http://127.0.0.1:8002/clientdocs/clients/deleteSubFolder", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result)
          fetchFolders(data);
          handleMenuClose();
          setOpenDialog(false); // Close the dialog
          setFolderToDelete(null); // Reset folder to delete
          toast.success("Folder Deleted Successfully")
        })
        .catch((error) => {console.error(error)
          toast.error("Failed to Assign Folder Template")
        });


    };
    const handleCancelSubFolder = () => {
      setNewFolderName(''); // Reset folder name input

      toggleDrawerSubFolder(false); // Close the drawer
    };
    const handleNewFolder = () => {
      console.log("Create new folder in", name);

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        accountId: data,
        subFolderName: name,
        newFolderName: newFolderName
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
console.log(raw)
      fetch("http://127.0.0.1:8002/clientdocs/clients/folders/newfolder", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result)
          handleMenuClose();
          setOpenDrawerSubFolder(false);

          fetchFolders(data)
          toast.success("New Folder Created Successfully")
        })
        .catch((error) => {console.error(error)
          toast.error("Failed to delete folder")
        });

    };

    // Check if the folder name is in the restricted list
    const restrictedFolders = [
      'FirmClient Uploaded Document',
      'Firm Doc Shared With Client',
      'Private'
    ];

    const isDeleteDisabled = restrictedFolders.includes(name);

    const styles = {
      folder: {
        fontWeight: "bold",
        cursor: "pointer",
        color: "#007BFF",
        display: "flex",
        alignItems: "center",
        // justifyContent: "space-between",
      },
      toggleIcon: {
        marginRight: "0.5em",
        cursor: "pointer",
        userSelect: "none",
        marginTop: '0.3em'

      },
      content: {
        display: isOpen ? "block" : "none",

      },
      icon: {
        cursor: 'pointer', // To make the icon clickable
        marginLeft: 'auto'
      }
    };

    return (
      <div>
        <div style={styles.folder} onClick={handleToggle}>
          <span style={styles.toggleIcon}>{isOpen ? "📂" : "📁"}</span>
          {name}
          {/* Dropdown Icon */}
          <IconButton onClick={handleMenuClick} style={styles.icon}>
            <BsThreeDotsVertical />
          </IconButton>
          
          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete} disabled={isDeleteDisabled}>Delete</MenuItem>
            <MenuItem onClick={() => toggleDrawerSubFolder(true)}>New Folder</MenuItem>
          </Menu>
        </div>
        <div style={styles.content}>{children}</div>
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete the folder: <strong>{folderToDelete}</strong>?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="secondary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Drawer anchor="right" open={openDrawerSubFolder} onClose={() => toggleDrawerSubFolder(false)}>
          <Box sx={{ width: 400, }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid red', p: 2, alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>Create a New Folder</Typography>
              <IoMdClose onClick={handleCancelSubFolder} style={{ cursor: 'pointer', fontSize: '25px' }} />
            </Box>
            {/* Form inside the Drawer */}
            <Box sx={{ padding: 3 }}>
              <Typography>Folder Name</Typography>
              <TextField
                placeholder="Folder Name"
                variant="outlined"
                fullWidth
                size='small'
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                margin="normal"
              />



              {/* Buttons: Save and Cancel */}
              <Box sx={{ display: 'flex', gap: 3, marginTop: 2 }}>

                <Button onClick={handleNewFolder} variant="contained" >
                  Save
                </Button>
                <Button onClick={handleCancelSubFolder} variant="outlined" >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </Drawer>
      </div>
    );
  };
  const [folderdata, setData] = useState(null); // Store the API response
  const [error, setError] = useState(null); // Store error if any
  const [loading, setLoading] = useState(true); // Track loading state
  const [openDrawer, setOpenDrawer] = useState(false); // To control the drawer open/close state
  const [folderName, setFolderName] = useState(''); // For folder name input
  // Function to toggle the drawer
  const toggleDrawer = (open) => {
    setOpenDrawer(open);
  };

  // Handle form submission (Save button click)
  const handleCreateFolder = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountId: data,
      subFolderName: folderName,

    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://127.0.0.1:8002/clientdocs/clients/folders", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        handleCancel()
        fetchFolders(data);
        toast.success("New folder created successfully")
      })
      .catch((error) => {console.error(error)
        toast.error("Failed to create new folder")
      });
  };

  // Handle Cancel button click (close the drawer)
  const handleCancel = () => {
    setFolderName(''); // Reset folder name input

    toggleDrawer(false); // Close the drawer
  };
  const fetchFolders = async () => {
    try {
      const response = await fetch(
        `${DOCS_MANAGMENTS}/clientdocs/folders/${data}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setData(result); // Set the fetched data
      console.log("folders data",result)
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFolders(data);
  }, []);

  if (loading) {
    return <p>Loading folder structure...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Box>
      <Box>
        <Button variant="contained" color="primary" onClick={() => toggleDrawer(true)}>
          Create Folder
        </Button>
        <Autocomplete
          options={optionFolders}
          getOptionLabel={(option) => option.label}
          value={selectedTemplate}
          onChange={(event, newValue) => handleSelectTemplate(newValue)}
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
          renderInput={(params) => <TextField {...params} sx={{ backgroundColor: "#fff" }} placeholder="Select Folder " variant="outlined" size="small" />}
          sx={{ width: "100%", marginTop: "8px" }}
          clearOnEscape // Enable clearable functionality
        />
      </Box>

      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={assignfoldertemp}
          disabled={!selectedTemplate}
        >
          Assign Template
        </Button>
      </Box>
      <Box> {folderdata && folderdata.contents && (
        <FolderContents contents={folderdata.contents} />
      )}</Box>

      {/* Drawer for Folder Creation Form */}
      <Drawer anchor="right" open={openDrawer} onClose={() => toggleDrawer(false)}>
        <Box sx={{ width: 400, }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid red', p: 2, alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>Create a New Folder</Typography>
            <IoMdClose onClick={handleCancel} style={{ cursor: 'pointer', fontSize: '25px' }} />
          </Box>
          {/* Form inside the Drawer */}
          <Box sx={{ padding: 3 }}>
            <Typography>Folder Name</Typography>
            <TextField
              placeholder="Folder Name"
              variant="outlined"
              fullWidth
              size='small'
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              margin="normal"
            />



            {/* Buttons: Save and Cancel */}
            <Box sx={{ display: 'flex', gap: 3, marginTop: 2 }}>

              <Button onClick={handleCreateFolder} variant="contained" >
                Save
              </Button>
              <Button onClick={handleCancel} variant="outlined" >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Documents;
