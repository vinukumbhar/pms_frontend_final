// import React from "react";
// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { FaRegFolderClosed } from "react-icons/fa6";
// import { HiDocumentArrowUp } from "react-icons/hi2";
// import { Link } from "react-router-dom";
// import JSZip from "jszip";

// import "./foldertemp.css";
// import { MdOutlineDriveFolderUpload } from "react-icons/md";
// import FetchFolder from "./FetchFolder";
// import UploadDocument from "./UploadDocument";
// import CreateFolder from "./CreateFolder";
// import UploadFolder from "./UploadFolder";

// function FolderList({ tempName, fetchAllFolders, folderData, templateId }) {
//   const API_KEY = process.env.REACT_APP_API_IP;
//   const [file, setFile] = useState(null);

//    const handleFolderChange = (e) => {

//     const selectedFiles = Array.from(e.target.files);
//     setFiles(selectedFiles);
//     setIsSendFolderForm(true);
    

    
//   };
   


//   useEffect(() => {
//     console.log(templateId);
//   }, [templateId]);

//   const handleFileChange = async (e, folder) => {
//     setFile(e.target.files[0]);
//   };

//   const [folderName, setFolderName] = useState("");

//   const handleInputChange = (e) => {
//     setFolderName(e.target.value);
//   };

//   const [folder, setFolder] = useState(null); // Add folder state
//   const [files, setFiles] = useState([]); // Use an array to store multiple files
//   const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
//   const [isSendFolderForm, setIsSendFolderForm] = useState(false);
//   const handleCreateFolderClick = () => {
//     setIsFolderFormOpen(!isFolderFormOpen);
//   };

//   const [isDocumentForm, setIsDocumentForm] = useState(false);
//   const fileInputRef = useRef(null);
//   const folderInputRef = useRef(null);
//   const handleFileUpload = () => {
//     setIsDocumentForm(!isDocumentForm);
//   };

//   const handleButtonClick = () => {
//     // fileInputRef.current.click();
//     // folderInputRef.current.click();
//     console.log("not working");
//     setIsDocumentForm(!isDocumentForm);
//   };

//   const [selectedFolder, setSelectedFolder] = useState();
  

//   return (
//     <div>
//       <div style={{ padding: "15px 30px" }}>
//         Template Name: <b>{tempName}</b>
//       </div>
//       <hr></hr>

//       <div className="uploads-documents-links">
//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
//             <HiDocumentArrowUp
//               style={{
//                 color: "#e87800",
//                 fontSize: "18px",
//               }}
//             />
//           </label>

//           <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
//             Upload Document
//           </label>

//           <input
//             type="file"
//             id="fileInput"
//             onChange={(e) => {
//               handleFileChange(e);
//               handleFileUpload(e);
//             }}
//             style={{ display: "none" }}
//           />
//         </div>
//         {/* //!upload document */}

//         <UploadDocument isDocumentForm={isDocumentForm} setIsDocumentForm={setIsDocumentForm} file={file} folderData={folderData} setFile={setFile} templateId={templateId} />

//         <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//           <MdOutlineDriveFolderUpload
//             style={{
//               color: "#e87800",
//               fontSize: "19px",
//             }}
//           />
//          <div>
//       <label
//         htmlFor="folderInput"
       
//         style={{ cursor: "pointer" }}
//       >
//         Select Folder:
//       </label>
//       <input
//         type="file"
//         id="folderInput"
//         directory=""
//         webkitdirectory=""
//         onChange={handleFolderChange}
//         style={{ display: "none" }}
//         multiple
//       />
//       {/* <button onClick={handleUploadFolder}>Upload Folder</button> */}
//     </div>
          
//           <UploadFolder isSendFolderForm={isSendFolderForm} setIsSendFolderForm={setIsSendFolderForm} files={files} folderData={folderData} setFiles={setFiles} templateId={templateId} />
//         </div>
//         <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//           <label htmlFor="newFolder" style={{ cursor: "pointer" }} onClick={handleCreateFolderClick}>
//             <FaRegFolderClosed
//               style={{
//                 color: "#e87800",
//                 fontSize: "15px",
//               }}
//             />
//           </label>

//           <label id="newFolder" style={{ cursor: "pointer" }} onClick={handleCreateFolderClick}>
//             Create Folder
//           </label>

//           <input
//             type="file"
//             id="fileInput"
//             onChange={(e) => {
//               handleFileChange(e);
//               handleFileUpload(e);
//             }}
//             style={{ display: "none" }}
//           />
//         </div>
//         {/* //!create folder  */}
//         <CreateFolder isFolderFormOpen={isFolderFormOpen} setIsFolderFormOpen={setIsFolderFormOpen} folderData={folderData} templateId={templateId} />
//       </div>
//       {/* /fetch folder */}
//       <FetchFolder folderData={folderData} setSelectedFolder={setSelectedFolder} selectedFolder={selectedFolder} templateId={templateId} />
//     </div>
//   );
// }

// export default FolderList;




import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaRegFolderClosed } from "react-icons/fa6";
import { HiDocumentArrowUp } from "react-icons/hi2";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { Box, Button, Typography, IconButton, Divider, Input,Paper } from "@mui/material";
import FetchFolder from "./FetchFolder";
import UploadDocument from "./UploadDocument";
import CreateFolder from "./CreateFolder";
import UploadFolder from "./UploadFolder";

function FolderList({ tempName, fetchAllFolders, folderData, templateId }) {
  const API_KEY = process.env.REACT_APP_API_IP;
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [folder, setFolder] = useState(null);
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [isSendFolderForm, setIsSendFolderForm] = useState(false);
  const [isDocumentForm, setIsDocumentForm] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState();

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  useEffect(() => {
    console.log(templateId);
  }, [templateId]);

  const handleFolderChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setIsSendFolderForm(true);
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

  return (
    <Box sx={{ padding: 3 }} component={Paper}>
      <Typography variant="h6">
        Template Name: <strong>{tempName}</strong>
      </Typography>
      <Divider sx={{ marginY: 2 }} />

      <Box className="uploads-documents-links" sx={{ display: "flex",  gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton component="label" htmlFor="fileInput" sx={{ color: "#e87800" }}>
            <HiDocumentArrowUp size={24} />
          </IconButton>
          <Typography variant="body1" component="label" htmlFor="fileInput" sx={{ cursor: "pointer" }}>
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
          <IconButton component="label" htmlFor="folderInput" sx={{ color: "#e87800" }}>
            <MdOutlineDriveFolderUpload size={24} />
          </IconButton>
          <Typography variant="body1" component="label" htmlFor="folderInput" sx={{ cursor: "pointer" }}>
            Select Folder
          </Typography>
          <Input
            type="file"
            id="folderInput"
            directory=""
            webkitdirectory=""
            onChange={handleFolderChange}
            sx={{ display: "none" }}
            multiple
          />
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
          <IconButton onClick={handleCreateFolderClick} sx={{ color: "#e87800" }}>
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

      <FetchFolder
        folderData={folderData}
        setSelectedFolder={setSelectedFolder}
        selectedFolder={selectedFolder}
        templateId={templateId}
      />
    </Box>
  );
}

export default FolderList;

