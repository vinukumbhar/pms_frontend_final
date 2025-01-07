import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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
import CreateFolder from "./CreateFolderold";
import UploadFolder from "./UploadFolder";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
function FolderTempEdit({ templateId }) {
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [isSendFolderForm, setIsSendFolderForm] = useState(false);
  const [isDocumentForm, setIsDocumentForm] = useState(false);
  // console.log("folders", templateId);
  const [folderName, setFolderName] = useState("");
  const [file, setFile] = useState(null);
  const [structFolder, setStructFolder] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderPath, setNewFolderPath] = useState("");
  const [contents, setContents] = useState([]);
  const API_KEY = process.env.REACT_APP_FOLDER_URL;
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const url = `${API_KEY}/allFolders/${templateId}`;
        const response = await axios.get(url);

        const addIsOpenProperty = (folders, parentId = null) =>
          folders.map((folder, index) => ({
            ...folder,
            isOpen: true,
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
console.log("testing",templateId)
  const createFolderAPI = async (templateId, newFolderPath) => {
    try {
      const response = await axios
        .get(
          `${API_KEY}/createFolder/?path=uploads/FolderTemplates/${templateId}${newFolderPath}&foldername=${newFolderName}`
        );
      console.log("API Response:", response.data);
      return response.data;
      // fetchFolders();
      setNewFolderName(""); // Clear input field
    } catch (error) {
      console.log("API Error:", error);
      throw error;
    }
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    const addFolderToSelected = (folders, parentPath = "") => {
      return folders.map((folder) => {
        if (folder.id === selectedFolderId) {
          const newFolder = {
            folder: newFolderName.trim(),
            isOpen: true,
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
      createFolderAPI(templateId, newFolderPath)
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

  const handleFileChange = async (e) => {
    setFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleCreateFolderClick = () => {
    setIsFolderFormOpen(!isFolderFormOpen);
  };
  const handleFormClose = () => {
    setIsFolderFormOpen(false);
  };

  const handleFileUpload = () => {
    setIsDocumentForm(!isDocumentForm);
  };
  const handleUploadFormClose = () => {
    setIsDocumentForm(false);
  };
  return (
    <div>
      <Box className="uploads-documents-links" sx={{ display: "flex", gap: 2 }}>
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
          contents={contents}
          setContents={setContents}
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
        <UploadFolder
          isSendFolderForm={isSendFolderForm}
          setIsSendFolderForm={setIsSendFolderForm}
          templateId={templateId}
          handleUploadFormClose={handleUploadFormClose}
          contents={contents}
          setContents={setContents}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={handleCreateFolderClick}
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
          handleFormClose={handleFormClose}
          templateId={templateId}
          API_KEY={API_KEY}
        />
      </Box>
      <div>
        <input
          type="text"
          placeholder="New folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <button onClick={handleCreateFolder} disabled={!selectedFolderId}>
          Create Folder
        </button>
      </div>
      {renderContents(structFolder.folders, (newFolders) =>
        setStructFolder({ ...structFolder, folders: newFolders })
      )}
    </div>
  );
}

export default FolderTempEdit;
