import React, { useState, useEffect } from "react";
import axios from "axios";
import { FcFolder } from "react-icons/fc";
import { FcOpenedFolder } from "react-icons/fc";
import { FaRegFilePdf, FaRegImage } from "react-icons/fa6";
import { PiMicrosoftWordLogoFill } from "react-icons/pi";
import { AiFillFileUnknown } from "react-icons/ai";
import { BsFiletypeXlsx } from "react-icons/bs";
import { FaRegFolderClosed } from "react-icons/fa6";
import { HiDocumentArrowUp } from "react-icons/hi2";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Divider,
  Input,
  Paper,
} from "@mui/material";
import UploadDocument from "./UploadDocument";
import CreateFolder from "./CreateFolder";
import UploadFolder from "./UploadFolder";
function FolderTempEdit({ tempName, fetchAllFolders, folderData, templateId }) {
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState(null);
  const [subExpandedFolders, setSubExpandedFolders] = useState({});
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [folder, setFolder] = useState(null);
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [isSendFolderForm, setIsSendFolderForm] = useState(false);
  const [isDocumentForm, setIsDocumentForm] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState();
  const toggleSubFolder = (folder) => {
    //setSubfolder(folder);
    // fetchAllFolders();
    setMenuVisible(false);
    setMenuVisibleFile(false);
    setSubExpandedFolders((prevExpanded) => {
      const isExpanded = prevExpanded[folder] || false;
      return { ...prevExpanded, [folder]: !isExpanded };
    });
  };

  useEffect(() => {
    console.log(templateId);
    async function fetchFolderTemplates() {
      try {
        const url = `http://127.0.0.1:8001/allFolders/${templateId}`;
        const response = await axios.get(url);

        setFolders(response.data.folders || []);
        console.log(response.data.folders);
      } catch (error) {
        setError("Error fetching folder structure.");
        console.error("Error fetching folder structure:", error);
      }
    }

    if (templateId) {
      fetchFolderTemplates();
    }
  }, [templateId]);

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuVisibleFile, setMenuVisibleFile] = useState(false);
  const [selectedFolderIndex, setSelectedFolderIndex] = useState(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const getFileIcon = (fileName) => {
    let position = fileName.search("");
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
      if (!fileName.includes(".")) {
        //console.log("No extension found.");
        return <FcFolder />;
      }
      return <AiFillFileUnknown style={{ color: "grey" }} />;
    }
  };

  const handleFolderChange = (event) => {
  
   setIsSendFolderForm(!isSendFolderForm);
    const files = event.target.files;
    const formData = new FormData();

    // Get the folder name from the first file's path
    const folderName = files[0].webkitRelativePath.split("/")[0];

    // Append the folder name to FormData
    formData.append("folderName", folderName); // Matches the backend field name

    // Append all files in the folder to FormData
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]); // Matches the backend field name
    }

    // Send files to the server
    fetch(`http://localhost:8001/uploadZip/${templateId}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        alert("Folder uploaded successfully!");
      })
      .catch((error) => {
        console.error("Error uploading folder:", error);
        alert("Error uploading folder: " + error.message);
      });
  };

  const handleFileChange = async (e) => {
    setFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleCreateFolderClick = () => {
    setIsFolderFormOpen(!isFolderFormOpen);
  };

  const handleFileUpload = () => {
    setIsDocumentForm(!isDocumentForm);
  };

  const handleButtonClick = () => {
    console.log("not working");
    setIsDocumentForm(!isDocumentForm);
  };

  const toggleFolder = (folder) => {
    // fetchAllFolders();
    setMenuVisible(false);
    setMenuVisibleFile(false);
    setExpandedFolders((prevExpanded) => {
      const isExpanded = prevExpanded.includes(folder);
      return isExpanded
        ? prevExpanded.filter((f) => f !== folder)
        : [...prevExpanded, folder];
    });
  };

  return (
    <div>
      <Box sx={{ padding: 3 }} component={Paper}>
        <Typography variant="h6">
          Template Name: <strong>{tempName}</strong>
        </Typography>
        <Divider sx={{ marginY: 2 }} />

        <Box
          className="uploads-documents-links"
          sx={{ display: "flex", gap: 2 }}
        >
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
            file={file}
            folderData={folderData}
            setFile={setFile}
            templateId={templateId}
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
      <Typography variant="body1">
        Upload Folder
      </Typography>
      <input
        type="file"
        id="folderInput"
        webkitdirectory="true"
        directory="true"
        onChange={handleFolderChange}
        style={{ display: "none" }} // Hide the input element
      />
    </label>
          </Box>
          <UploadFolder
            isSendFolderForm={isSendFolderForm}
            setIsSendFolderForm={setIsSendFolderForm}
            files={files}
            folderData={folderData}
            setFiles={setFiles}
            templateId={templateId}
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
            folderData={folderData}
            templateId={templateId}
          />
        </Box>
      </Box>

      {folders.map((folder, index) => (
        <div key={index}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
              onClick={() => {
                toggleFolder(folder.folder);
              }}
            >
              <button
                style={{
                  fontSize: "20px",
                  background: "none",
                  color: "inherit",
                  border: "none",
                  padding: 0,
                  font: "inherit",
                  cursor: "pointer",
                  outline: "inherit",
                }}
              >
                {expandedFolders.includes(folder.folder) ? (
                  <FcOpenedFolder style={{ fontSize: "20px" }} />
                ) : (
                  <FcFolder />
                )}
              </button>
              {folder.folder}
            </div>
          </div>

          {expandedFolders.includes(folder.folder) && (
            <ul>
              {folder.contents.map((item, fileIndex) => (
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  {item.file && (
                    <div>
                      <li
                        key={fileIndex}
                        style={{
                          width: "100%",
                          listStyle: "none",
                          padding: 0,
                          margin: "0px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div>
                            <span
                              style={{ marginRight: "10px", fontSize: "18px" }}
                            >
                              {getFileIcon(item.file)}
                            </span>
                          </div>
                          <div>{item.file}</div>
                        </div>
                      </li>
                    </div>
                  )}
                  {item.folder && (
                    <div>
                      <li
                        key={fileIndex}
                        style={{
                          width: "100%",
                          listStyle: "none",
                          padding: 0,
                          margin: "0px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div>
                            <button
                              style={{
                                marginRight: "10px",
                                fontSize: "20px",
                                background: "none",
                                color: "inherit",
                                border: "none",
                                padding: 0,
                                font: "inherit",
                                cursor: "pointer",
                                outline: "inherit",
                              }}
                              onClick={() => {
                                toggleSubFolder(item.folder);
                              }}
                            >
                              {subExpandedFolders[item.folder] ? (
                                <FcOpenedFolder style={{ fontSize: "20px" }} />
                              ) : (
                                <FcFolder />
                              )}
                            </button>
                          </div>
                          <div>
                            <div>{item.folder}</div>
                          </div>
                        </div>
                      </li>
                      {subExpandedFolders[item.folder] && (
                        <ul>
                          {item.contents.map((subContent, subIndex) => (
                            <li key={subIndex} style={{ marginLeft: "20px" }}>
                              {/* {getFileIcon(subContent.file)}{subContent.file} */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div>
                                  <span
                                    style={{
                                      marginRight: "10px",
                                      fontSize: "18px",
                                    }}
                                  >
                                    {getFileIcon(subContent.file)}
                                  </span>
                                </div>
                                <div>{subContent.file}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </ul>
          )}
          <hr style={{ marginBottom: "5px" }} />
        </div>
      ))}
    </div>
  );
}

export default FolderTempEdit;
