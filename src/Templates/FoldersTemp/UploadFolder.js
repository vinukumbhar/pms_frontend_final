import { Drawer, Button, IconButton, List, ListItem, ListItemText, Divider, Typography, Box } from "@mui/material";
import { FaRegFolderClosed } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import { FaRegFilePdf, FaRegImage } from "react-icons/fa6";
import { PiMicrosoftWordLogoFill } from "react-icons/pi";
import { AiFillFileUnknown } from "react-icons/ai";
import { BsFiletypeXlsx } from "react-icons/bs";
import JSZip from "jszip";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
const UploadDocument = ({ isSendFolderForm, setIsSendFolderForm, folderData, templateId, files, setFiles }) => {
  const API_KEY = process.env.REACT_APP_API_IP;
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuVisibleFile, setMenuVisibleFile] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [folderDataRef, setFolderDataRef] = useState(folderData);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedSubFolder, setSelectedSubFolder] = useState("blank");

  useEffect(() => {
    setFolderDataRef(folderData);
    fetchAllFolders();
  }, [folderData]);

  const handleSelectedFolder = (folder) => {
    setSelectedFolder(folder);
  };

  const handleSelectedSubFolder = (folder) => {
    setSelectedSubFolder(folder);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <FaRegFilePdf style={{ color: "red" }} />;
      case "jpg":
      case "jpeg":
        return <FaRegImage />;
      case "xlsx":
      case "xls":
        return <BsFiletypeXlsx style={{ color: "green" }} />;
      case "txt":
        return <PiMicrosoftWordLogoFill style={{ color: "blue" }} />;
      default:
        return <AiFillFileUnknown style={{ color: "grey" }} />;
    }
  };

  const toggleFolder = (folder) => {
    fetchAllFolders();
    setMenuVisible(false);
    setMenuVisibleFile(false);
    setExpandedFolders((prevExpanded) => {
      const isExpanded = prevExpanded.includes(folder);
      return isExpanded ? prevExpanded.filter((f) => f !== folder) : [...prevExpanded, folder];
    });
  };

  const fetchAllFolders = async () => {
    try {
      const url = `${API_KEY}/allFolders/${templateId}`;
      const response = await axios.get(url);
      setFolderDataRef(response.data.folders);
    } catch (error) {
      console.error("Error fetching all folders:", error.response.data.error);
    }
  };

  const handleUploadFormClose = () => {
    setIsSendFolderForm(false);
  };

  const handleUploadFolder = async () => {
    if (files.length === 0) {
      alert("Please select a folder.");
      return;
    }

    const folderName = files[0].webkitRelativePath.split("/")[0];
    const zip = new JSZip();

    files.forEach((file) => {
      zip.file(file.webkitRelativePath, file);
    });

    const zipContent = await zip.generateAsync({ type: "blob" });
    const formData = new FormData();
    formData.append("folderName", folderName);
    formData.append("templateId", templateId);
    formData.append("folder", zipContent, `${folderName}.zip`);
    formData.append("subFolder", selectedFolder);

    try {
      const url = `${API_KEY}/uploadFolder`;
      await axios.post(url, formData);
      alert("Folder uploaded successfully!");
      setFiles(null);
      setIsSendFolderForm(false);
    } catch (error) {
      console.error("Error uploading folder:", error);
    }
  };

  return (
    <Drawer anchor="right" open={isSendFolderForm} onClose={handleUploadFormClose}>
      <Box sx={{ width: 800, padding: 2 }}>
        <div className="folder-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Select Folder to upload</Typography>
          <IconButton onClick={handleUploadFormClose}>
            <FaTimes style={{ color: "#1976d3" }} />
          </IconButton>
        </div>

        <Divider />

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
       

        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleUploadFolder}>
            Upload folder 
          </Button>
          <Button variant="outlined" onClick={handleUploadFormClose} sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default UploadDocument;
