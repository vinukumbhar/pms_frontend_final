import { FaTimes } from "react-icons/fa";

import {
  Drawer,
  IconButton,
  Typography,
  TextField,Box,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CreateFolder({
  setIsFolderFormOpen,
  isFolderFormOpen,
  templateId,
  // handleFormClose,
  
}) {
  const API_KEY = process.env.REACT_APP_FOLDER_URL;
  const [structFolder, setStructFolder] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderPath, setNewFolderPath] = useState("");
  const handleFormClose = () => {
    setIsFolderFormOpen(false);
    fetchFolders()
  };
  useEffect(() => {
    fetchFolders();
  }, []);
  const fetchFolders = async () => {
    try {
      const url = `${API_KEY}/allFolders/${templateId}`;
      const response = await axios.get(url);
      const addIsOpenProperty = (folders, parentId = null) =>
        folders.map((folder, index) => ({
          ...folder,
          isOpen: false, // Initially close all folders
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
          <Box key={index} style={{ marginLeft: "20px" }}>
            <Box
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                backgroundColor:
                  selectedFolderId === item.id ? "#e0f7fa" : "transparent",
              }}
              onClick={selectFolder}
            >
              <Box onClick={toggleFolder}>
                {item.isOpen ? "📂" : "📁"}{" "}
                <strong style={{ marginLeft: "5px" }}>{item.folder}</strong>
              </Box>
            </Box>
            {item.isOpen && item.contents && item.contents.length > 0 && (
              <Box>
                {renderContents(item.contents, (newContents) => {
                  const updatedFolders = contents.map((folder, i) =>
                    i === index ? { ...folder, contents: newContents } : folder
                  );
                  setContents(updatedFolders);
                })}
              </Box>
            )}
          </Box>
        );
      } else if (item.file) {
        return (
          <Box key={index} style={{ marginLeft: "40px" }}>
            📄 {item.file}
          </Box>
        );
      }
      return null;
    });
  };
  const createFolderAPI = async (newFolderPath) => {
    try {
      const response = await axios.get(
        `${API_KEY}:8005/createFolder/?path=uploads/FolderTemplates/${templateId}/${newFolderPath}&foldername=${newFolderName}`
      );
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.log("API Error:", error);
      throw error;
    }
  };
  // const handleCreateFolder = () => {
  //   if (!newFolderName.trim()) return;

  //   const addFolderToSelected = (folders, parentPath = "") => {
  //     return folders.map((folder) => {
  //       if (folder.id === selectedFolderId) {
  //         const newFolder = {
  //           folder: newFolderName.trim(),
  //           isOpen: false, // New folder initially closed
  //           id: `${folder.id}-${folder.contents.length}`,
  //           contents: [],
  //         };
  //         // Construct the full path to the new folder
  //         const newPath = `${parentPath}/${folder.folder}`;
  //         setNewFolderPath(newPath); // Update state
  //         // Add the new folder to the contents of the parent folder
  //         const updatedFolder = {
  //           ...folder,
  //           contents: [...folder.contents, newFolder],
  //         };
  //         return updatedFolder;
  //       }
  //       return folder.contents
  //         ? {
  //             ...folder,
  //             contents: addFolderToSelected(
  //               folder.contents,
  //               `${parentPath ? `${parentPath}/` : ""}${folder.folder}`
  //             ),
  //           }
  //         : folder;
  //     });
  //   };
  //   const updatedFolderStructure = addFolderToSelected(structFolder.folders);
  //   setStructFolder((prev) => ({
  //     ...prev,
  //     folders: updatedFolderStructure,
  //   }));
  // };

  // useEffect(() => {
  //   if (newFolderPath) {
  //     createFolderAPI(newFolderPath)
  //       .then((data) => {
  //         console.log("Folder created successfully:", data);
  //       })
  //       .catch((error) => {
  //         console.log("Error creating folder:", error);
  //       });
  //   }
  // }, [newFolderPath]);


  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
  
    const addFolderToSelected = (folders, parentPath = "") => {
      return folders.map((folder) => {
        if (folder.id === selectedFolderId) {
          const newFolder = {
            folder: newFolderName.trim(),
            isOpen: false, // New folder initially closed
            id: `${folder.id}-${folder.contents.length}`,
            contents: [],
          };
          // Construct the full path to the new folder
          const newPath = `${parentPath}/${folder.folder}`;
          setNewFolderPath(newPath); // Update state
          // Add the new folder to the contents of the parent folder
          const updatedFolder = {
            ...folder,
            contents: [...folder.contents, newFolder],
          };
          return updatedFolder;
        }
        return folder.contents
          ? {
              ...folder,
              contents: addFolderToSelected(
                folder.contents,
                `${parentPath ? `${parentPath}/` : ""}${folder.folder}`
              ),
            }
          : folder;
      });
    };
    const updatedFolderStructure = addFolderToSelected(structFolder.folders);
    setStructFolder((prev) => ({
      ...prev,
      folders: updatedFolderStructure,
    }));
  };
  
  useEffect(() => {
    if (newFolderPath) {
      createFolderAPI(newFolderPath)
        .then((data) => {
          console.log("Folder created successfully:", data);
          // Clear text field and close the drawer
          setNewFolderName(""); // Clear the text field
          setSelectedFolderId(null); // Clear the selected folder
          setIsFolderFormOpen(false); // Close the drawer
        })
        .catch((error) => {
          console.log("Error creating folder:", error);
        });
    }
  }, [newFolderPath]);
  
  if (error) {
    return <Box>Error: {error}</Box>;
  }

  if (!structFolder) {
    return <Box>Loading...</Box>;
  }

  return (
    <Drawer
      anchor="right"
      open={isFolderFormOpen}
      onClose={handleFormClose}
      PaperProps={{ sx: { width: 600 } }} // Set width of the Drawer
    >
      <Box style={{ padding: 16 }}>
        <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Typography
           fontSize={"20px"}
          >
            Create Folder
           
          </Typography>
          <IconButton aria-label="close" onClick={handleFormClose}>
              <FaTimes style={{ color: "#1976d3",}} />
            </IconButton>
        </Box>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "16px",
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Create Folder"
            margin="normal"
            variant="outlined"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          
        </Box>
        <Box mt={1}>
        {renderContents(structFolder.folders, (newFolders) =>
          setStructFolder({ ...structFolder, folders: newFolders })
        )}
        </Box>
        
        <Box mt={3}>
        <Button
            disabled={!selectedFolderId}
            size="small"
            onClick={handleCreateFolder}
            variant="contained"
            color="primary"

          >
            Create and Save
          </Button>
        </Box>
        
      </Box>
    </Drawer>
  );
}
