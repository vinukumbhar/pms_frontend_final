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
import axios from "axios";
import { useEffect, useState } from "react";

export default function CreateFolder({
  setIsFolderFormOpen,
  isFolderFormOpen,
  templateId,
}) {
  const [folderName, setFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState();
  const [subfolder, setSubfolder] = useState("blank");

  const schema = yup.object().shape({
    folderName: yup.string().required("Folder name is required"),
    selectedFolder: yup.string().required("Select folder"),
  });

  const API_KEY = process.env.REACT_APP_FOLDER_URL;

  const handleFormClose = () => {
    setIsFolderFormOpen(false);
  };

  const [structFolder, setStructFolder] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderPath, setNewFolderPath] = useState("");

  useEffect(() => {
    

    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const url = `${API_KEY}:8005/allFolders/${templateId}`;
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
          <div key={index} style={{ marginLeft: "20px" }}>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                backgroundColor:
                  selectedFolderId === item.id ? "#e0f7fa" : "transparent",
              }}
              onClick={selectFolder}
            >
              <div onClick={toggleFolder}>
                {item.isOpen ? "📂" : "📁"} <strong style={{ marginLeft: "5px" }}>{item.folder}</strong>
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

  const createFolderAPI = (newFolderPath) => {
    return axios
      .get(`${API_KEY}:8005/createFolder/?path=uploads/FolderTemplates/${templateId}/${newFolderPath}&foldername=${newFolderName}`)
      .then((response) => {
        console.log("API Response:", response.data);
        //fetchFolders();
        //renderContents();
        return response.data;
        //setNewFolderName(""); // Clear input field
        
      })
      .catch((error) => {
        console.log("API Error:", error);
        throw error;
      });
  };

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

          setNewFolderPath(newPath);  // Update state

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

    setNewFolderName("")
    handleFormClose()
  };

  useEffect(() => {
    if (newFolderPath) {
      createFolderAPI(newFolderPath)
        .then((data) => {
          console.log("Folder created successfully:", data);
        })
        .catch((error) => {
          console.log("Error creating folder:", error);
        });
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
      open={isFolderFormOpen}
      onClose={handleFormClose}
      PaperProps={{ sx: { width: 800 } }} // Set width of the Drawer
    >
      <div style={{ padding: 16 }}>

        
        <div>
          <h1 style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Create Folder
            <IconButton aria-label="close" onClick={handleFormClose}>
              <FaTimes style={{ color: "#1976d3" }} />
            </IconButton>
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px" }}>
        <TextField
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <Button  disabled={!selectedFolderId}
          size = "small"
          onClick={handleCreateFolder}
          variant="contained"
          color="primary"
        >
          Create and Save
        </Button>
        
      </div>
 

        {renderContents(structFolder.folders, (newFolders) =>
          setStructFolder({ ...structFolder, folders: newFolders })
        )}
      </div>


      

         </Drawer>
  );
}
