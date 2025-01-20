import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Divider,
  Input,
  Paper,
} from "@mui/material";
import { FaRegFolderClosed } from "react-icons/fa6";
import { HiDocumentArrowUp } from "react-icons/hi2";
import UploadDocument from "./UploadDocument";
import CreateFolder from "./CreateFolder";
import UploadFolder from "./UploadFolder";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
function FolderTempEdit({tempName,templateId,}) {
  const [structFolder, setStructFolder] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, folderId: null });
  //function related to folder 
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const handleCreateFolderClick = () => {
    setIsFolderFormOpen(!isFolderFormOpen);
  };
  const [isLoading, setIsLoading] = useState(false);
// const handleFormClose = async () => {
//   setIsFolderFormOpen(false);
//   // await fetchFolders(); // Ensure folders are fetched after the form is closed
// };

  //function related to document 
  const [isDocumentForm, setIsDocumentForm] = useState(false);
  
  const [file, setFile] = useState(null);

  const handleUploadFormClose = () => {
    setIsDocumentForm(false);
  };
  const handleFileChange = async (e) => {
    setFile(e.target.files[0]);
  };
  const handleFileUpload = () => {
    setIsDocumentForm(!isDocumentForm);
  };
  const API_KEY = process.env.REACT_APP_FOLDER_URL;
 
  // Function to fetch folders
  const fetchFolders = async () => {
    try {
      const url = `${API_KEY}/allFolders/${templateId}`;
      const response = await axios.get(url);

      const addIsOpenProperty = (folders, parentId = null) =>
        folders.map((folder, index) => ({
          ...folder,
          isOpen: false,
          id: parentId ? `${parentId}-${index}` : `${index}`,
          contents: folder.contents
            ? addIsOpenProperty(folder.contents, parentId ? `${parentId}-${index}` : `${index}`)
            : [],
        }));

      const processedData = {
        ...response.data,
        folders: addIsOpenProperty(response.data.folders || []),
      };

      setStructFolder(processedData);
    
    } catch (err) {
      console.error("Error fetching all folders:", err);
      setError(err.message || "An error occurred");
    }
  };
console.log("jajavi",structFolder)
  // Fetch folders on component mount
  useEffect(() => {
    fetchFolders();
  }, [API_KEY, templateId]);
  const handleMenuClick = (e, folderId) => {
    e.stopPropagation(); // Prevent triggering other click events
    setContextMenu({
      visible: true,
      x: e.currentTarget.getBoundingClientRect().x - 150,
      y: e.currentTarget.getBoundingClientRect().y - 50,
      folderId,
    });
  };
  const handleCloseMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, folderId: null });
  };
  const renderContents = (contents, setContents) => {
    return contents.map((item, index) => {
      if (item.folder) {
        const toggleFolder = () => {
          const updatedContents = contents.map((folder, i) =>
            i === index ? { ...folder, isOpen: !folder.isOpen } : folder
          );
          setContents(updatedContents);
        };

        const selectFolder = () => setSelectedFolderId(item.id);

        return (
          <div key={index} style={{ marginLeft: "20px", position: "relative" }}>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor:
                  selectedFolderId === item.id ? "#e0f7fa" : "transparent",
              }}
              onClick={selectFolder}
            >
              <div onClick={toggleFolder}>
                {item.isOpen ? "📂" : "📁"}{" "}
                <strong style={{ marginLeft: "5px" }}>{item.folder}</strong>
              </div>
              <div
                style={{ cursor: "pointer", marginLeft: "10px" }}
                onClick={(e) => handleMenuClick(e, item.id)}
              >
                ⋮
              </div>
            </div>
            {item.isOpen && item.contents && item.contents.length > 0 && (
              <div>
                {renderContents(item.contents, (newContents) => {
  const updatedFolders = contents.map((folder, i) =>
    i === index ? { ...folder, contents: newContents } : folder
  );
  setContents(updatedFolders);
})}

              </div>
            )}
          </div>
        );
      } else if (item.file) {
        return (
          <div key={index} style={{ marginLeft: "40px" }}>
            📄 {item.file}
          </div>
        );
      }
      return null;
    });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!structFolder) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      
      <Box className="uploads-documents-links" sx={{ display: "flex", gap: 2 }}>
          {/* <Typography variant="h6">
                Template Name: <strong>{tempName}</strong>
              </Typography> */}
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            component="label"
            htmlFor="fileInput"
            sx={{ color: "#e87800" }}
          >
            <HiDocumentArrowUp size={24} />
          </IconButton>
          <Typography
            variant="body1"
            component="label"
            htmlFor="fileInput"
            sx={{ cursor: "pointer" }}
          >
            Upload Document
          </Typography>
          <Input
            type="file"
            id="fileInput"
            onChange={(e) => {
              handleFileChange(e);
              handleFileUpload(e);
            }}
            sx={{ display: "none" }}
          />
        </Box>

        <UploadDocument
          isDocumentForm={isDocumentForm}
          setIsDocumentForm={setIsDocumentForm}
          templateId={templateId}
          handleUploadFormClose={handleUploadFormClose}
       
        /> 

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            component="label"
            htmlFor="folderInput"
            sx={{ color: "#e87800" }}
          >
            <MdOutlineDriveFolderUpload size={24} />
          </IconButton>
          <label htmlFor="folderInput" style={{ cursor: "pointer" }}>
            <Typography variant="body1">Upload Folder</Typography>
            <input
              type="file"
              id="folderInput"
              webkitdirectory="true"
              directory="true"
              style={{ display: "none" }} // Hide the input element
            />
          </label>
        </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
                      sx={{ color: "#e87800" }}
          >
            <FaRegFolderClosed size={20} />
          </IconButton>
          <Typography
            variant="body1"
            onClick={handleCreateFolderClick}
            sx={{ cursor: "pointer" }}
          >
            Create Folder
          </Typography>
        </Box>
        <CreateFolder
          isFolderFormOpen={isFolderFormOpen}
          setIsFolderFormOpen={setIsFolderFormOpen}
        // handleFormClose={handleFormClose}
          templateId={templateId}
         
        />
      </Box>
      {renderContents(structFolder.folders, (newFolders) =>
        setStructFolder({ ...structFolder, folders: newFolders })
      )}
      {contextMenu.visible && (
        <div
          style={{
            position: "absolute",
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            zIndex: 1000,
            padding: "10px",
          }}
        >
          <div style={{ padding: "5px", cursor: "pointer" }} onClick={handleCloseMenu}>
            Delete
          </div>
          <div style={{ padding: "5px", cursor: "pointer" }} onClick={handleCloseMenu}>
            Rename
          </div>
          <div style={{ padding: "5px", cursor: "pointer" }} onClick={handleCloseMenu}>
            Download
          </div>
        </div>
      )}
      {contextMenu.visible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 999,
          }}
          onClick={handleCloseMenu}
        ></div>
      )}
    </div>
  );
}

export default FolderTempEdit;
