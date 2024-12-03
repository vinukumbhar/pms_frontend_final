// import React,{useState} from 'react'
// import { FaTimes } from "react-icons/fa";
// import FetchFolder from "./FetchFolder"
// import axios from "axios"
// import * as yup from "yup";

// export default function CreateFolder({setIsFolderFormOpen,isFolderFormOpen,folderData,templateId}) {
//   const API_KEY = process.env.REACT_APP_API_IP;

//     const handleFormClose = () => {
//         setIsFolderFormOpen(false);
//       };

//       const [selectedFolder,setSelectedFolder]=useState();
//       const[subfolder,setSubfolder]=useState("blank");
//       const[folderName,setFolderName]=useState();
//       const schema = yup.object().shape({
//         folderName: yup.string().required("Folder name is required"),
//         selectedFolder: yup.string().required("Select folder"),
//       });

//       const handleCreateFolder = async () => {
//         try {
//           await schema.validate({ folderName, selectedFolder }, { abortEarly: false });

//           try {
//             const url = `${API_KEY}/common/createFolder`;
//             await axios.post(url, {
//               folderName: folderName,
//               selectedFolder: selectedFolder,
//               templateId: templateId,
//               subfolder:subfolder,
//             });
//             console.log(templateId);

//             console.log("Folder created successfully");
//             //fetchAllFolders(); // Uncomment if you have this function to fetch all folders
//           } catch (error) {
//             console.error("Error creating folder:", error.response.data.error);
//           }

//           handleFormClose();
//         } catch (error) {
//           if (error.name === "ValidationError") {
//             let errorMessage = "";
//             error.inner.forEach((err, index) => {
//               errorMessage += `${index + 1}. ${err.message}\n`;
//             });
//             alert(errorMessage);
//           } else {
//             console.error("Error creating folder:", error);
//           }
//         }
//       };

//   return (

//     <div className={`folder-form-container ${isFolderFormOpen ? "folder-form-open" : ""}`}>
//     <div className="folder-header">
//       <h3>Create Folder</h3>
//       <FaTimes style={{ color: "#1976d3", cursor: "pointer" }} onClick={handleFormClose} />
//     </div>
//     <div className="folder-label">
//             <label>Folder name</label>
//             <input type="text" placeholder="Folder Name" value={folderName} onChange={(e) => setFolderName(e.target.value)} />
//           </div>
//     <div className="folder-container">
//     <FetchFolder folderData={folderData}selectedFolder={selectedFolder}setSelectedFolder={setSelectedFolder}templateId={templateId}setSubfolder={setSubfolder}/>
//       <div className="create-folder-buttons">
//         <div>
//           <button
//             className="btn1"
//             onClick={() => {
//                handleCreateFolder();
//               //handleFormClose();
//             }}
//           >
//             Create and save
//           </button>
//         </div>
//         <div>
//           <button className="btn2" onClick={handleFormClose}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
//   )
// }

// import React, { useState } from "react";
// import { FaTimes } from "react-icons/fa";
// import FetchFolder from "./FetchFolder";
// import axios from "axios";
// import * as yup from "yup";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   IconButton,
//   Typography,
// } from "@mui/material";

// export default function CreateFolder({ setIsFolderFormOpen, isFolderFormOpen, folderData, templateId }) {
//   const API_KEY = process.env.REACT_APP_API_IP;

//   const handleFormClose = () => {
//     setIsFolderFormOpen(false);
//   };

//   const [selectedFolder, setSelectedFolder] = useState();
//   const [subfolder, setSubfolder] = useState("blank");
//   const [folderName, setFolderName] = useState("");

//   const schema = yup.object().shape({
//     folderName: yup.string().required("Folder name is required"),
//     selectedFolder: yup.string().required("Select folder"),
//   });

//   const handleCreateFolder = async () => {
//     try {
//       await schema.validate({ folderName, selectedFolder }, { abortEarly: false });

//       try {
//         const url = `${API_KEY}/common/createFolder`;
//         await axios.post(url, {
//           folderName: folderName,
//           selectedFolder: selectedFolder,
//           templateId: templateId,
//           subfolder: subfolder,
//         });
//         console.log(templateId);
//         console.log("Folder created successfully");
//       } catch (error) {
//         console.error("Error creating folder:", error.response.data.error);
//       }

//       handleFormClose();
//     } catch (error) {
//       if (error.name === "ValidationError") {
//         let errorMessage = "";
//         error.inner.forEach((err, index) => {
//           errorMessage += `${index + 1}. ${err.message}\n`;
//         });
//         alert(errorMessage);
//       } else {
//         console.error("Error creating folder:", error);
//       }
//     }
//   };

//   return (
//     <Dialog open={isFolderFormOpen} onClose={handleFormClose} maxWidth="sm" fullWidth>
//       <DialogTitle>
//         <Typography variant="h6" component="div">
//           Create Folder
//         </Typography>
//         <IconButton
//           aria-label="close"
//           onClick={handleFormClose}
//           sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
//         >
//           <FaTimes />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent dividers>
//         <TextField
//           fullWidth
//           label="Folder Name"
//           variant="outlined"
//           value={folderName}
//           onChange={(e) => setFolderName(e.target.value)}
//           margin="normal"
//         />
//         <FetchFolder
//           folderData={folderData}
//           selectedFolder={selectedFolder}
//           setSelectedFolder={setSelectedFolder}
//           templateId={templateId}
//           setSubfolder={setSubfolder}
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleCreateFolder} variant="contained" color="primary">
//           Create and Save
//         </Button>
//         <Button onClick={handleFormClose} variant="outlined" color="secondary">
//           Cancel
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

import { FaTimes } from "react-icons/fa";

import * as yup from "yup";
import {
  Drawer,
  IconButton,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import { List, ListItem, Divider, Box } from "@mui/material";
import "./foldertemp.css";
import { FaRegFolderClosed } from "react-icons/fa6";
import { Link } from "react-router-dom";

import FetchFolder from "./FetchFolder";

import { BsThreeDotsVertical } from "react-icons/bs";
import { useEffect, useState, useRef } from "react";
import { FcFolder } from "react-icons/fc";
import { FcOpenedFolder } from "react-icons/fc";
import axios from "axios";
import { FaRegFilePdf, FaRegImage } from "react-icons/fa6";
import { PiMicrosoftWordLogoFill } from "react-icons/pi";
import { AiFillFileUnknown } from "react-icons/ai";

import { BsFiletypeXlsx } from "react-icons/bs";

export default function CreateFolder({
  setIsFolderFormOpen,
  isFolderFormOpen,
  isDocumentForm,
  setIsDocumentForm,
  file,
  setFile,
  folderData,
  templateId,
}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuVisibleFile, setMenuVisibleFile] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [folderDataRef, setFolderDataRef] = useState(folderData);

  //const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedSubFolder, setSelectedSubFolder] = useState("blank");
  const [folderSelected, setFolderSelected] = useState("");

  useEffect(() => {
    console.log(folderSelected);
    setFolderDataRef(folderData);
    fetchAllFolders();
  }, [folderSelected, folderData]);

  const handleSelectedFolder = (folder) => {
    setSelectedFolder(folder);
  };

  const handleSelectedSubFolder = (folder) => {
    setSelectedSubFolder(folder);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (extension === "pdf") {
      return <FaRegFilePdf style={{ color: "red" }} />;
    } else if (extension === "jpg" || extension === "jpeg") {
      return <FaRegImage />;
    } else if (extension === "xlsx" || extension === "xls") {
      return <BsFiletypeXlsx style={{ color: "green" }} />;
    } else if (extension === "txt") {
      return <PiMicrosoftWordLogoFill style={{ color: "blue" }} />;
    } else {
      return <AiFillFileUnknown style={{ color: "grey" }} />;
    }
  };

  const toggleFolder = (folder) => {
    fetchAllFolders();
    setMenuVisible(false);
    setMenuVisibleFile(false);
    setExpandedFolders((prevExpanded) => {
      const isExpanded = prevExpanded.includes(folder);
      return isExpanded
        ? prevExpanded.filter((f) => f !== folder)
        : [...prevExpanded, folder];
    });
  };

  const fetchAllFolders = async () => {
    try {
      const response = await axios.get(`${API_KEY}/allFolders/${templateId}`);
      setFolderDataRef(response.data.folders);
    } catch (error) {
      console.error("Error fetching all folders:", error.response.data.error);
    }
  };

  //const [folderName, setFolderName] = useState("FolderTemplates");
  const [subfolderName, setSubFolderName] = useState(templateId);
  const [subfolderName2, setSubFolderName2] = useState("");
  useEffect(() => {
    setSubFolderName(templateId);
    console.log("console log :");
    console.log(subfolderName);
  }, [templateId]);
  const handleUploadFormClose = () => {
    setIsDocumentForm(false);
  };

  const handleSubmitfile = async (e) => {
    e.preventDefault();
    setExpandedFolders([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${API_KEY}/common/upload/${folderName}/${subfolderName}/${selectedFolder}/${selectedSubFolder}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.text();
      console.log(data); // Log server response
      toast.success("document uploaded successfully");
    } catch (error) {
      console.error("Error:", error);
    }
    setIsDocumentForm(false);
    setFile(null);
  };

  const API_KEY = process.env.REACT_APP_API_IP;

  const handleFormClose = () => {
    setIsFolderFormOpen(false);
  };

  const [selectedFolder, setSelectedFolder] = useState();
  const [subfolder, setSubfolder] = useState("blank");
  const [folderName, setFolderName] = useState("");

  const schema = yup.object().shape({
    folderName: yup.string().required("Folder name is required"),
    selectedFolder: yup.string().required("Select folder"),
  });

  const handleCreateFolder = async () => {
    try {
      await schema.validate(
        { folderName, selectedFolder },
        { abortEarly: false }
      );

      try {
        const url = `${API_KEY}/common/createFolder`;
        await axios.post(url, {
          folderName: folderName,
          selectedFolder: selectedFolder,
          templateId: templateId,
          subfolder: subfolder,
        });
        console.log(templateId);
        console.log("Folder created successfully");
        toast.success("Folder created successfully");
      } catch (error) {
        console.error("Error creating folder:", error.response.data.error);
        toast.error("Failed to create Folder");
      }

      handleFormClose();
    } catch (error) {
      if (error.name === "ValidationError") {
        let errorMessage = "";
        error.inner.forEach((err, index) => {
          errorMessage += `${index + 1}. ${err.message}\n`;
        });
        alert(errorMessage);
      } else {
        console.error("Error creating folder:", error);
      }
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isFolderFormOpen}
      onClose={handleFormClose}
      PaperProps={{ sx: { width: 800 } }} // Set width of the Drawer
    >
      <div style={{ padding: 16 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Create Folder
          <IconButton aria-label="close" onClick={handleFormClose}>
            <FaTimes style={{ color: "#1976d3" }} />
          </IconButton>
        </Typography>

        <TextField
          fullWidth
          size="small"
          variant="outlined"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          margin="normal"
        />

        <Box sx={{ padding: "16px" }}>
          <Box>
            {folderDataRef.map((folder, index) => (
              <Box key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelectedFolder(folder.folder)}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                    onClick={() => toggleFolder(folder.folder)}
                  >
                    <IconButton sx={{ padding: 0 }}>
                      {expandedFolders.includes(folder.folder) ? (
                        <FcOpenedFolder style={{ fontSize: "20px" }} />
                      ) : (
                        <FcFolder style={{ fontSize: "20px" }} />
                      )}
                    </IconButton>
                    <Typography>{folder.folder}</Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 1 }} />

                {/* Folder contents */}
                {expandedFolders.includes(folder.folder) &&
                  folder.contents.length > 0 && (
                    <List disablePadding>
                      {folder.contents.map((item, itemIndex) => (
                        <Box key={itemIndex}>
                          {item.file && (
                            <ListItem sx={{ padding: 0 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  padding: "10px",
                                }}
                              >
                                <span>{getFileIcon(item.file)}</span>
                                <Typography>{item.file}</Typography>
                              </Box>
                            </ListItem>
                          )}
                          {item.folder && (
                            <Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  cursor: "pointer",
                                  padding: "10px",
                                }}
                                onClick={() =>
                                  handleSelectedSubFolder(item.folder)
                                }
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                  }}
                                  onClick={() => toggleFolder(item.folder)}
                                >
                                  <IconButton sx={{ padding: 0 }}>
                                    {expandedFolders.includes(item.folder) ? (
                                      <FcOpenedFolder
                                        style={{ fontSize: "20px" }}
                                      />
                                    ) : (
                                      <FcFolder style={{ fontSize: "20px" }} />
                                    )}
                                  </IconButton>
                                  <Typography>{item.folder}</Typography>
                                </Box>
                              </Box>
                              <Divider sx={{ my: 1 }} />

                              {expandedFolders.includes(item.folder) &&
                                item.contents.length > 0 && (
                                  <List disablePadding>
                                    {item.contents.map(
                                      (subItem, subItemIndex) => (
                                        <ListItem
                                          key={subItemIndex}
                                          sx={{ padding: 0 }}
                                        >
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "10px",
                                              padding: "10px",
                                            }}
                                          >
                                            <span>
                                              {getFileIcon(subItem.file)}
                                            </span>
                                            <Typography>
                                              {subItem.file}
                                            </Typography>
                                          </Box>
                                        </ListItem>
                                      )
                                    )}
                                  </List>
                                )}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </List>
                  )}
              </Box>
            ))}
          </Box>
        </Box>
        <div style={{ marginTop: 16 }}>
          <Button
            onClick={handleCreateFolder}
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
          >
            Create and Save
          </Button>
          <Button onClick={handleFormClose} variant="outlined">
            Cancel
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
