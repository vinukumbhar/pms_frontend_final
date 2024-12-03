import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useEffect, useState, useRef } from "react";
import { FcFolder } from "react-icons/fc";
import { FcOpenedFolder } from "react-icons/fc";
import axios from "axios";
import { FaRegFilePdf, FaRegImage } from "react-icons/fa6";
import { PiMicrosoftWordLogoFill } from "react-icons/pi";
import { AiFillFileUnknown } from "react-icons/ai";
import { BsFiletypeXlsx } from "react-icons/bs";
import { HiDocumentArrowUp } from "react-icons/hi2";
import { FaRegFolderClosed } from "react-icons/fa6";
import { toast, } from "react-toastify";
function FetchFolder({ folderData, setSelectedFolder, selectedFolder, templateId ,setSubfolder}) {
  const API_KEY = process.env.REACT_APP_API_IP;
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

  const toggleFolder = (folder) => {

    fetchAllFolders();
    setMenuVisible(false);
    setMenuVisibleFile(false);
    setExpandedFolders((prevExpanded) => {
      const isExpanded = prevExpanded.includes(folder);
      return isExpanded ? prevExpanded.filter((f) => f !== folder) : [...prevExpanded, folder];
    });
  };

  const [expandedFolders, setExpandedFolders] = useState([]);
  const [folderDataRef, setFolderDataRef] = useState(folderData);

  const getFileExtension = (fileName) => {
    const dotIndex = fileName.lastIndexOf(".");
    if (dotIndex !== -1) {
      return fileName.substring(dotIndex + 1).toLowerCase();
    }
    return "";
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

  const handleDownloadFolder = async (folder) => {
    try {
      const url = `${API_KEY}/download/${folder}`;
      await axios
        .get(url, {
          responseType: "blob",
        })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const a = document.createElement("a");
          a.href = url;
          a.download = `${folder}.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
    } catch (error) {
      console.error("Error downloading folder:", error);
    }
  };

  const toggleMenu = (index) => {
    setMenuVisible(!menuVisible);
    setSelectedFolderIndex(index);
    setMenuVisibleFile(false);
  };
  const toggleMenuFile = (index) => {
    setMenuVisibleFile(!menuVisibleFile);
    setSelectedFileIndex(index);
    setMenuVisible(false);
  };

  const [renamedFile, setRenamedFile] = useState("");
  const handleRenameFile = async (folder, oldFileName) => {
    const newFileName = prompt("Enter new file name:", oldFileName);
    if (newFileName) {
      const url = `${API_KEY}/download/${folder}/common/renameFile/${templateId}/${folder}/${oldFileName}`;
      try {
        //await axios.put(`http://127.0.0.1:8080/renameFile/${folder}/${oldFileName}`, { newFileName });
        const response = await axios.put(url, { newFileName });

        setRenamedFile(newFileName); // Update renamed file name in state
        // Refresh folder data after renaming
        console.log(response.data);
        fetchAllFolders();
      } catch (error) {
        console.error("Error renaming file:", error.response.data.error);
      }
    }
  };

  const handleDeleteFile = async (folder, file) => {
    toggleMenuFile();
    let data = JSON.stringify({
      folderName: folder,
      fileName: file,
      templateId: templateId,
    });
    console.log(file);

    let config = {
      method: "delete",
      maxBodyLength: Infinity,
     
      url: `${API_KEY}/common/deleteFile/`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        toast.success("file deleted successfully");
        fetchAllFolders();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDownloadFile = async (folder, file) => {
    toggleMenuFile();
    try {
    
      const response = await fetch(`${API_KEY}/download/${folder}/${file}`);
      const blob = await response.blob(); // Corrected this line

      // Create an anchor element and trigger a download
      const url = window.URL.createObjectURL(blob);

      // Create an anchor element and trigger a download
      const a = document.createElement("a");
      a.href = url;

      // Use the actual filename from the server response
      const contentDisposition = response.headers.get("content-disposition");
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const suggestedFilename = filenameMatch ? filenameMatch[1] : file;

      a.download = suggestedFilename;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error.response.data.error);
    }
  };

  const handleDeleteFolder = async (folder,templateId) => {
    console.log(folder)
    console.log(templateId)
    try {
      // Send a request to the server to delete the folder
      await axios.post(`${API_KEY}/common/deleteFolder/`, { folderName: folder });
      toast.success("folder deleted successfully");
      //fetchAllFolders();
      fetchAllFolders();
    } catch (error) {
      console.error("Error deleting folder:", error);
      toast.error(" failed folder delete ");
      // Handle error, show an alert, etc.
    }
  };
  const [file, setFile] = useState([]); // Use an array to store multiple files
  const [folderName, setFolderName] = useState("FolderTemplates");
  const [subfolderName, setSubFolderName] = useState(templateId);
  const [subfolderName2, setSubFolderName2] = useState("Client uploaded document");
  const handleFileChange = async (e, folder) => {
    setFile(e.target.files[0]);
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      const response = await axios.post(`${API_KEY}/upload/${folderName}/${templateId}/${selectedFolder}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("File uploaded successfully:", response.data);
      toggleFolder(folder);

      // Provide user feedback for successful file upload
      alert("File uploaded successfully!");
      // You can update state or perform any other action here based on the response.
    } catch (error) {
      console.error("Error uploading file:", error);
      // Provide user feedback for failed file upload
      alert("Error uploading file. Please try again.");
    }
  };

  useEffect(() => {
    console.log(selectedFolder);
    setFolderDataRef(folderData);
  }, [selectedFolder, folderData]);

  const handleSelectedFolder = (folder) => {
    setSelectedFolder(folder);
  };

  // Assuming you have a state variable to keep track of expanded subfolders

  const [subExpandedFolders, setSubExpandedFolders] = useState({});

  const toggleSubFolder = (folder) => {
    //setSubfolder(folder);
    fetchAllFolders();
    setMenuVisible(false);
    setMenuVisibleFile(false);
    setSubExpandedFolders((prevExpanded) => {
      const isExpanded = prevExpanded[folder] || false;
      return { ...prevExpanded, [folder]: !isExpanded };
    });
  };

  return (
    <div style={{ padding: "10px" }}>
      {folderDataRef.map((folder, index) => (
        <div key={index}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }} onClick={() => handleSelectedFolder(folder.folder)}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
              onClick={() => {
                toggleFolder(folder.folder);
              }}
            >
              <button style={{ fontSize: "20px", background: "none", color: "inherit", border: "none", padding: 0, font: "inherit", cursor: "pointer", outline: "inherit" }}>{expandedFolders.includes(folder.folder) ? <FcOpenedFolder style={{ fontSize: "20px" }} /> : <FcFolder />}</button>
              {folder.folder}
            </div>

            <div style={{ position: "relative", marginLeft: "auto" }}>
              <BsThreeDotsVertical onClick={() => toggleMenu(index)} style={{ cursor: "pointer" }} />
              {menuVisible && selectedFolderIndex === index && (
                <div style={{ position: "absolute", width: "100px", top: "90%", right: "6px", background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderRadius: "10px", zIndex: 1 }}>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    <li
                      style={{ margin: "10px", cursor: "pointer", fontSize: "12px" }}
                      onClick={() => {
                        handleDeleteFolder(folder.folder,templateId);
                        toggleMenu(index);
                      }}
                    >
                      Delete Folder
                    </li>
                    <li
                      style={{ margin: "10px", cursor: "pointer", fontSize: "12px" }}
                      onClick={() => {
                        handleDownloadFolder(folder.folder);
                        toggleMenu(index);
                      }}
                    >
                      Edit
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
         
          {expandedFolders.includes(folder.folder) && (
            <ul>
              {folder.contents.map((item, fileIndex) => (
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  {item.file && (
                    <div>
                      <li key={fileIndex} style={{ width: "100%", listStyle: "none", padding: 0, margin: "0px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div>
                            <span style={{ marginRight: "10px", fontSize: "18px" }}>{getFileIcon(item.file)}</span>
                          </div>
                          <div>{item.file}</div>
                        </div>
                      </li>
                    </div>
                  )}
                  {item.folder && (
                    <div>
                      <li key={fileIndex} style={{ width: "100%", listStyle: "none", padding: 0, margin: "0px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div>
                            <button style={{ marginRight: "10px", fontSize: "20px", background: "none", color: "inherit", border: "none", padding: 0, font: "inherit", cursor: "pointer", outline: "inherit" }} onClick={() => {toggleSubFolder(item.folder)}}>
                              {subExpandedFolders[item.folder] ? <FcOpenedFolder style={{ fontSize: "20px" }} /> : <FcFolder />}
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
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "center",  }}>
                                <div>
                                  <span style={{ marginRight: "10px", fontSize: "18px" }}>{getFileIcon(subContent.file)}</span>
                                </div>
                                <div>{subContent.file}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  <div>
                    <div style={{ position: "relative", fontSize: "15px" }}>
                      <BsThreeDotsVertical onClick={() => toggleMenuFile(fileIndex)} style={{ cursor: "pointer" ,}} />
                      {menuVisibleFile && selectedFileIndex === fileIndex && (
                        <div>
                          {item.file && getFileExtension(item.file) !== "" ? (
                            <div style={{ position: "absolute", width: "100px", top: "0%", left: "20px", background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderRadius: "4px", zIndex: 1 }}>
                              <ul style={{ listStyle: "none", padding: 0 }}>
                                <li
                                  style={{ margin: "10px", cursor: "pointer", fontSize: "12px" }}
                                  onClick={() => {
                                    handleDeleteFile(folder.folder, item.file);
                                    toggleFolder(folder.folder);
                                    toggleFolder(folder.folder);
                                  }}
                                >
                                  Delete File
                                </li>
                                {/* <li
                                  style={{ margin: "10px", cursor: "pointer", fontSize: "12px" }}
                                  onClick={() => {
                                    handleDownloadFile(folder.folder, item.file);
                                    toggleFolder(folder.folder);
                                    toggleFolder(folder.folder);
                                  }}
                                >
                                  Download File
                                </li> */}
                                <li
                                  style={{ margin: "10px", cursor: "pointer", fontSize: "12px" }}
                                  onClick={() => {
                                    handleRenameFile(folder.folder, item.file);
                                    toggleFolder(folder.folder);
                                    toggleFolder(folder.folder);
                                  }}
                                >
                                  Rename File
                                </li>
                              </ul>
                            </div>
                          ) : (
                            <div style={{ position: "absolute", width: "120px", top: "0%", left: "20px", background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderRadius: "4px", zIndex: 1 }}>
                              <ul style={{ listStyle: "none", padding: 0 }}>
                                <li
                                  style={{ margin: "10px", cursor: "pointer", fontSize: "12px" }}
                                  onClick={() => {
                                    handleDeleteFolder(folder.folder, item.file);
                                    toggleFolder(folder.folder);
                                    toggleFolder(folder.folder);
                                  }}
                                >
                                  Delete Folder
                                </li>
                                <li
                                  style={{ margin: "10px", cursor: "pointer", fontSize: "12px" }}
                                  onClick={() => {
                                    handleDownloadFile(folder.folder, item.file);
                                    toggleFolder(folder.folder);
                                    toggleFolder(folder.folder);
                                  }}
                                >
                                  Download Folder
                                </li>
                                <li
                                  style={{ margin: "10px", cursor: "pointer", fontSize: "12px" }}
                                  onClick={() => {
                                    handleRenameFile(folder.folder, item.file);
                                    toggleFolder(folder.folder);
                                    toggleFolder(folder.folder);
                                  }}
                                >
                                  Rename Folder
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
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

export default FetchFolder;
