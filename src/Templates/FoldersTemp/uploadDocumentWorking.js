import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, IconButton, Box, Typography, Drawer } from "@mui/material";
import { FaTimes } from "react-icons/fa";

const UploadDocument = ({
  isDocumentForm,
  setIsDocumentForm,
  templateId,
  handleUploadFormClose,
  file,
  setFile,
}) => {

  const API_KEY = process.env.REACT_APP_FOLDER_URL;
  const [structFolder, setStructFolder] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderPath, setNewFolderPath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");


  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const url = `${API_KEY}/allFolders/${templateId}`;
        const response = await axios.get(url);
        const addIsOpenProperty = (folders, parentId = null) =>
          folders.map((folder, index) => ({
            ...folder,
            isOpen: false, // Set to false to close all folders initially
            id: `${parentId ? `${parentId}-` : ""}${index}`,
            contents: folder.contents
              ? addIsOpenProperty(
                  folder.contents,
                  `${parentId ? `${parentId}-` : ""}${index}`
                )
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

    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolderId) {
      console.log("The selected folder ID has been updated:", selectedFolderId);
      handleSelectFolderPath(); // Call your function that depends on the updated state
    }
  }, [selectedFolderId]);

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
          <div key={index} style={{ marginLeft: "20px" }}>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                backgroundColor:
                  selectedFolderId === item.id ? "#e0f7fa" : "transparent",
              }}
              onClick={() => {
                selectFolder();
                handleSelectFolderPath();
              }}
            >
              <div onClick={toggleFolder}>
                {item.isOpen ? "📂" : "📁"}{" "}
                <strong style={{ marginLeft: "5px" }}>{item.folder}</strong>
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

  const handleSubmitfile = async (e) => {
    let data = new FormData();
    data.append("destinationPath", destinationPath);
    data.append("file", file);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${API_KEY}/uploadfile/`,
      data: data,
      
    };
    axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      alert("File uploaded successfully!");
     
    })
    .catch((error) => {
      console.error(error);
      alert("Failed to upload the file.");
    });

  setIsDocumentForm(false);
  setFile(null);
};



const handleSelectFolderPath = () => {
    const getFolderPath = (folders, parentPath = "") => {
      for (let folder of folders) {
        const currentPath = `${parentPath}/${folder.folder}`;

        if (folder.id === selectedFolderId) {
          //(currentPath); // Set new folder path
          return currentPath; // Immediately return the selected path
        }

        if (folder.contents) {
          const nestedPath = getFolderPath(folder.contents, currentPath);
          if (nestedPath) {
            return nestedPath; // Return the nested path if found
          }
        }
      }
      return null; // No path found
    };

    if (!selectedFolderId || !structFolder?.folders) {
      console.log("No folder selected or structure is not available.");
      return;
    }

    setNewFolderPath(getFolderPath(structFolder.folders));
    console.log("Selected path from function:", newFolderPath); // Debugging log
  };

  useEffect(() => {
    if (newFolderPath) {
      console.log("The folder path has changed to:", newFolderPath);
      setDestinationPath(
        `uploads/FolderTemplates/${templateId}/${newFolderPath}`
      );
      // Perform additional actions when newFolderPath changes
    }
  }, [newFolderPath]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!structFolder) {
    return <div>Loading...</div>;
  }

  return (
    <Drawer
      anchor="right"
      open={isDocumentForm}
      onClose={handleUploadFormClose}
      PaperProps={{
        sx: {
          width: 600,
          p:3
        },
      }}
    >
      <div>
        <div>
          <div
            className="folder-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">Select Folder to upload</Typography>
            <IconButton onClick={handleUploadFormClose}>
              <FaTimes style={{ color: "#1976d3" }} />
            </IconButton>
          </div>
        </div>
        <Box mt={2}>
        {renderContents(structFolder.folders, (newFolders) =>
          setStructFolder({ ...structFolder, folders: newFolders })
        )}
        </Box>
        
      </div>

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!file}
          onClick={() => {
            handleSelectFolderPath();
            handleSubmitfile();
          }}
        >
          Upload
        </Button>
        <Button variant="outlined" onClick={handleUploadFormClose}>
          Cancel
        </Button>
      </Box>
    </Drawer>
  );
};

export default UploadDocument;
