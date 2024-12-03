// import React, { useState, useEffect, useRef } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { HiDocumentArrowUp } from "react-icons/hi2";
// import { MdOutlineDriveFolderUpload } from "react-icons/md";
// import { FaRegFolderClosed } from "react-icons/fa6";
// import { FaTimes } from "react-icons/fa";
// import { BsQuestionCircle } from "react-icons/bs";
// import { TbFolders } from "react-icons/tb";
// // import { CiMenuKebab } from "react-icons/ci";
// // import { Navigate, useNavigate } from "react-router-dom";
// // import { SlOptionsVertical } from "react-icons/sl";
// import { FaFolder } from "react-icons/fa";
// import { FaFolderOpen } from "react-icons/fa6";
// import { TbUserEdit } from "react-icons/tb";
// import { HiDotsVertical } from "react-icons/hi";
// import { IoEyeSharp } from "react-icons/io5";
// import { LuEyeOff } from "react-icons/lu";
// // import "../pages/folderttemp.css";

// const Documents = () => {
//   const [isOpenClientDocs, setIsOpenClientDocs] = useState(false);
//   const [isOpenSharedDocs, setIsOpenSharedDocs] = useState(false);
//   const [isOpenPrivate, setIsOpenPrivate] = useState(false);
//   const [showClientOptions, setShowClientOptions] = useState(false);
//   const [showSharedOptions, setShowSharedOptions] = useState(false);
//   const [showPrivateOptions, setShowPrivateOptions] = useState(false);
//   const [isFormOpen, setIsFormOpen] = useState(false);

//   //  to oprn form inside of create folder
//   const handleCreateFolderClick = () => {
//     setIsFormOpen(!isFormOpen);
//   };

//   const handleFormClose = () => {
//     setIsFormOpen(false);
//   };
//   // const navigate = useNavigate();
//   // for toghle folder icons


//   const toggleSidebar = () => {
//     setIsFormOpen(!isFormOpen);
//   };

//   const closeSidebar = () => {
//     setIsFormOpen(false);
//   };

//   const toggleClientDocs = () => {
//     setIsOpenClientDocs(!isOpenClientDocs);
//   };

//   const toggleSharedDocs = () => {
//     setIsOpenSharedDocs(!isOpenSharedDocs);
//   };

//   const togglePrivate = () => {
//     setIsOpenPrivate(!isOpenPrivate);
//   };

//   const [showForm, setShowForm] = useState(false);
//   const [tempName, setTempName] = useState("");
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [selectedFolder, setSelectedFolder] = useState(null);
//   const fileInputRef = useRef(null);
//   const folderInputRef = useRef(null);

//   const handleCreateTemplate = () => {
//     setShowForm(true);
//   };

//   const handleSaveTemplate = async () => {
//     // Check if the template name is empty
//     if (tempName.trim() === "") {
//       // Display a toast error message if the template name is empty
//       toast.error("Template name cannot be empty");
//       return;
//     }

//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//       templatename: tempName,
//     });

//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow",
//     };

//     fetch("http://192.168.1.116:8080/common/folder", requestOptions)
//       .then((response) => response.text())
//       .then((result) => {
//         console.log(result);
//         // Display success toast
//         toast.success("Template saved successfully");
//         // Reset the form
//         setShowForm(false);
//         setTempName("");
//       })
//       .catch((error) => {
//         console.error(error);
//         // Display error toast
//         toast.error("Failed to save template");
//       });

//     setTimeout(() => {
//       window.location.reload();
//     }, 1000);
//   };
//   const handleCancel = () => {
//     setShowForm(false);
//     setTempName("");
//   };

//   //get all templateName Record
//   const [folderTemplates, setFolderTemplates] = useState([]);

//   useEffect(() => {
//     async function fetchFolderTemplates() {
//       try {
//         const response = await fetch("http://192.168.1.116:8080/common/folder");
//         if (!response.ok) {
//           throw new Error("Failed to fetch folder templates");
//         }
//         const data = await response.json();
//         setFolderTemplates(data.folderTemplates);
//       } catch (error) {
//         console.error("Error fetching folder templates:", error);
//       }
//     }

//     fetchFolderTemplates();
//   }, []);

//   //documents Upload

//   const handleFileChange = (event) => {
//     setSelectedFiles(event.target.files);
//   };

//   const handleButtonClick = () => {
//     fileInputRef.current.click();
//     folderInputRef.current.click();
//   };

//   //folder Upload
//   const handleFolderChange = (event) => {
//     setSelectedFolder(event.target.files[0]);
//   };

//   const handleUploadFolder = async () => {
//     if (!selectedFolder) {
//       alert("Please select a folder to upload");
//       return;
//     }
//   };

//   //create folder

//   const [folderName, setFolderName] = useState("");

//   const handleInputChange = (e) => {
//     setFolderName(e.target.value);
//   };

//   const [selectedOption, setSelectedOption] = useState(null);

//   const handleOptionChange = (option) => {
//     setSelectedOption(option);
//   };

//   const [openMenuId, setOpenMenuId] = useState(null);

//   const toggleMenufolder = (menuId) => {
//     setOpenMenuId(openMenuId === menuId ? null : menuId);
//   };

//   const handleCreateFolder = () => {

//   };

//   const handleEditFolder = () => {
//     // Handle edit folder action
//   };

//   const handleDeleteFolder = () => {
//     // Handle delete folder action
//   };

//   const toggleMenu = (_id) => {
//     setOpenMenuId(openMenuId === _id ? null : _id);
//   };

//   const handleEdit = (_id) => {
//     // Implement logic for editing here
//     // console.log("Edit action triggered for template id: ", templateId);
//     // navigate('FoldertempUpdate/'+_id)
//   };

//   //delete template
//   const handleDelete = (_id) => {
//     const requestOptions = {
//       method: "DELETE",
//       redirect: "follow",
//     };

//     fetch("http://192.168.1.116:8080/common/folder/" + _id, requestOptions)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to delete item");
//         }
//         return response.text();
//       })
//       .then((result) => {
//         console.log(result);
//         toast.success("Item deleted successfully");
//       })
//       .catch((error) => {
//         console.error(error);
//         toast.error("Failed to delete item");
//       })
//       .finally(() => {
//         setTimeout(() => {
//           window.location.reload();
//         }, 1000);
//       });
//   };

//   ///Folderstructure
//   const [tempvalues, setTempValues] = useState();
//   const [foldersvalue, setfoldervalue] = useState();
//   const [tempNameNew, setTempNameNew] = useState();
//   const [templateData, setTemplateData] = useState(null);

//   useEffect(() => {
//     getfolders();
//   }, []);

//   const getfolders = async () => {
//     try {
//       const response = await fetch(
//         "http://192.168.1.116:8080/common/folder-structure/"
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch data");
//       }
//       const data = await response.json();

//       // console.log('Fetched data:', data);
//       setTemplateData(data);

//       setfoldervalue(data.folderStructure);
//       tempallvalue();
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   console.log(foldersvalue);

//   const [selectedFolderget, setSelectedFolderget] = useState(null);

//   const handleFolderClick = (folderName) => {
//     if (selectedFolderget === folderName) {
//       setSelectedFolderget(null); // Hide children if folder is already selected
//     } else {
//       setSelectedFolderget(folderName); // Show folder name data
//     }
//   };

//   const tempallvalue = () => {
//     setTempNameNew(tempvalues);
//   };

//   return (
//     <div >
//       <div className="form-container">
//         <div>
//           <input
//             type="file"
//             multiple
//             ref={fileInputRef}
//             style={{ display: "none" }}
//             onChange={handleFileChange}
//           />
//           <button
//             style={{
//               background: "none",
//               color: "black",
//               border: "none",
//               marginTop: "10px",
//               color: "#1976d3",
//               fontWeight: "bold",
//             }}
//             onClick={handleButtonClick}
//           >
//             <HiDocumentArrowUp />
//             Upload Documents{" "}
//           </button>

//           <input
//             type="folder"
//             directory=""
//             webkitdirectory=""
//             ref={folderInputRef}
//             style={{ display: "none" }}
//             onChange={handleFolderChange}
//           />
//           <button
//             style={{
//               background: "none",
//               color: "black",
//               border: "none",
//               marginTop: "10px",
//               color: "#1976d3",
//               fontWeight: "bold",
//             }}
//             onClick={handleButtonClick}
//           >
//             <MdOutlineDriveFolderUpload />
//             Upload Folder
//           </button>

//           <button
//             style={{
//               background: "none",
//               color: "black",
//               border: "none",
//               marginTop: "10px",
//               color: "#1976d3",
//               fontWeight: "bold",
//             }}
//             onClick={toggleSidebar}
//           >
//             <FaRegFolderClosed />
//             Create Folder
//           </button>
//           <button
//             style={{
//               background: "none",
//               color: "black",
//               border: "none",
//               marginTop: "10px",
//               color: "#1976d3",
//               fontWeight: "bold",
//             }}

//           >
//            <TbFolders />
//             Apply folder template
//           </button>
//           <div
//             className={`folder-form ${isFormOpen ? "form-open" : ""}`}
//           >
//             <div className="sidebarfolder">

//               <FaTimes style={{ color: '#1976d3', float: 'right' }} onClick={closeSidebar} />

//               <div className="form_create_folder">
//                 <div className="h1">
//                   <h3> Create Folder</h3>
//                 </div>

//                 <div className="input_lable">
//                   <label>Folder Name</label>
//                   <input
//                     style={{ border: "1px solid black" }}
//                     type="text"
//                     value={folderName}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="form-privacy">
//                   <span>Privacy</span>
//                   <BsQuestionCircle className="privacy-icon" />

//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       marginLeft: "10px",
//                       fontSize: "14px",
//                       color: "#2b2b2b",
//                     }}
//                   >
//                     <label>
//                       <input
//                         type="radio"
//                         value="Private"
//                         checked={selectedOption === "Private"}
//                         onChange={() => handleOptionChange("Private")}
//                       />
//                       Private
//                     </label>
//                     <label>
//                       <input
//                         type="radio"
//                         value="Client Can View"
//                         checked={selectedOption === "Client Can View"}
//                         onChange={() =>
//                           handleOptionChange("Client Can View")
//                         }
//                       />
//                       Client Can View
//                     </label>
//                     <label>
//                       <input
//                         type="radio"
//                         value="Client Can View and edit"
//                         checked={
//                           selectedOption === "Client Can View and edit"
//                         }
//                         onChange={() =>
//                           handleOptionChange("Client Can View and edit")
//                         }
//                       />
//                       Client Can View and edit
//                     </label>
//                     <p style={{ fontWeight: "bold" }}>
//                       {`selectedOption
//                             ? Selected : ${selectedOption}
//                             : "No option selected"`}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="create-folder-buttons">
//                   <div className="s-btn">
//                     <button onClick={handleCreateFolder}>save</button>
//                   </div>
//                   <div className="cnsl-btn">
//                     <button onClick={closeSidebar}>Cancel</button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* <div>
//           {foldersvalue
//             ? foldersvalue.map((folder, index) => (
//               <div key={index}>
//                 <div onClick={() => handleFolderClick(folder.name)}>
//                   <table >
//                     <tbody >
//                       <tr>
//                         <td>
//                           {" "}
//                           {selectedFolderget === folder.name
//                             ? folder.name
//                             : folder.name}
//                         </td>

//                         <td>
//                           <div
//                             className="ci-menu-kebab"
//                             onClick={() =>
//                               toggleMenufolder("folderMenu1")
//                             }
//                             style={{
//                               cursor: "pointer",
//                               fontSize: "20px",
//                             }}
//                           >
//                             &#8942;
//                           </div>
//                           {openMenuId === "folderMenu1" && (
//                             <div className="menu-options">
//                               <div
//                                 onClick={handleCreateFolder}
//                                 style={{
//                                   color: "blue",
//                                   cursor: "pointer",
//                                 }}
//                               >
//                                 Create Folder
//                               </div>
//                               <div
//                                 onClick={handleEditFolder}
//                                 style={{
//                                   color: "blue",
//                                   cursor: "pointer",
//                                 }}
//                               >
//                                 Edit
//                               </div>
//                               <div
//                                 onClick={handleDeleteFolder}
//                                 style={{
//                                   color: "red",
//                                   cursor: "pointer",
//                                 }}
//                               >
//                                 Delete
//                               </div>
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//                 {selectedFolderget === folder.name &&
//                   folder.children.length > 0 && (
//                     <div>
//                       {folder.children.map((child, childIndex) => (
//                         <div key={childIndex}>{child.name}</div>
//                       ))}
//                     </div>
//                   )}
//               </div>
//             ))
//             : null}
//         </div> */}
//         <hr></hr>

//         <div className="documents">
//           <div
//             className="client_upload_documents"
//             onClick={toggleClientDocs}
//           >
//             <p>
//               {isOpenClientDocs ? (
//                 <FaFolderOpen
//                   style={{
//                     color: "#e87800",
//                     fontSize: "15px",
//                     marginRight: "10px",
//                   }}
//                 />
//               ) : (
//                 <FaFolder
//                   style={{
//                     color: "#e87800",
//                     fontSize: "15px",
//                     marginRight: "10px",
//                   }}
//                 />
//               )}
//               Client uploaded documents{" "}
//               <div
//                 style={{
//                   float: "right",
//                   alignItems: "center",
//                   display: "flex",
//                   gap: "5px",
//                 }}
//               >
//                 <TbUserEdit
//                   style={{
//                     color: "black",
//                     fontWeight: "bold",
//                     fontSize: "20px",
//                   }}
//                 />
//                 <HiDotsVertical
//                   onClick={() => setShowClientOptions(!showClientOptions)}
//                   style={{
//                     fontSize: "20px",
//                     color: "#0077cc",
//                     cursor: "pointer",
//                   }}
//                 />
//                 {showClientOptions && (
//                   <div className="dropdown-options">
//                     <span onClick={toggleSidebar}>create folder</span>
//                     <span>Edite</span>
//                     <span>Delet</span>
//                   </div>
//                 )}
//               </div>
//             </p>
//           </div>
//           <hr />

//           <div className="shared_docs" onClick={toggleSharedDocs}>
//             <p>
//               {isOpenSharedDocs ? (
//                 <FaFolderOpen
//                   style={{
//                     color: "#e87800",
//                     fontSize: "15px",
//                     marginRight: "10px",
//                   }}
//                 />
//               ) : (
//                 <FaFolder
//                   style={{
//                     color: "#e87800",
//                     fontSize: "15px",
//                     marginRight: "10px",
//                   }}
//                 />
//               )}
//               Firm docs shared with client
//               <div
//                 style={{
//                   float: "right",
//                   alignItems: "center",
//                   display: "flex",
//                   gap: "5px",
//                 }}
//               >
//                 <IoEyeSharp
//                   style={{ color: "rgb(36, 200, 117)", fontSize: "20px" }}
//                 />
//                 <HiDotsVertical
//                   onClick={() => setShowSharedOptions(!showSharedOptions)}
//                   style={{
//                     fontSize: "20px",
//                     color: "#0077cc",
//                     cursor: "pointer",
//                   }}
//                 />
//                 {showSharedOptions && (
//                   <div className="dropdown-options">
//                     <span onClick={toggleSidebar}>create folder</span>
//                     <span>Edite</span>
//                     <span>Delet</span>
//                   </div>
//                 )}
//               </div>
//             </p>
//           </div>
//           <hr />

//           <div className="private" onClick={togglePrivate}>
//             <p>
//               {isOpenPrivate ? (
//                 <FaFolderOpen
//                   style={{
//                     color: "#e87800",
//                     fontSize: "15px",
//                     marginRight: "10px",
//                   }}
//                 />
//               ) : (
//                 <FaFolder
//                   style={{
//                     color: "#e87800",
//                     fontSize: "15px",
//                     marginRight: "10px",
//                   }}
//                 />
//               )}
//               Private{" "}
//               <div
//                 style={{
//                   float: "right",
//                   alignItems: "center",
//                   display: "flex",
//                   gap: "5px",
//                 }}
//               >
//                 <LuEyeOff
//                   style={{ color: "rgb(102, 118, 142)", fontSize: "20px" }}
//                 />
//                 <HiDotsVertical
//                   onClick={() => setShowPrivateOptions(!showPrivateOptions)}
//                   style={{
//                     fontSize: "20px",
//                     color: "#0077cc",
//                     cursor: "pointer",
//                   }}
//                 />
//                 {showPrivateOptions && (
//                   <div className="dropdown-options">
//                     <span onClick={toggleSidebar}>create folder</span>
//                     <span>Edite</span>
//                     <span>Delet</span>
//                   </div>
//                 )}
//               </div>
//             </p>
//           </div>
//           <hr />
//         </div>

//         {/* <div className="temp_buttons">
//           <button className="Save" onClick={handleSaveTemplate}>
//             Save & Exit
//           </button>
//           <button className="cnsl" onClick={handleCancel}>
//             Cancel
//           </button>
//         </div> */}
//       </div>

//       <ToastContainer />

//     </div>
//   );
// };

// export default Documents;

// import { Autocomplete, Box, Button, Typography } from '@mui/material'
// import React,{ useState, useEffect,} from 'react'

// const Documents = () => {
//   const API_KEY = process.env.REACT_APP_API_IP;
//   const [folderTemplates, setFolderTemplates] = useState([]);

//   useEffect(() => {
//     async function fetchFolderTemplates() {
//       try {
//         const url = `${API_KEY}/common/folder`;
//         const response = await fetch(url);
//         if (!response.ok) {
//           throw new Error("Failed to fetch folder templates");
//         }
//         const data = await response.json();
//         setFolderTemplates(data.folderTemplates);
//       } catch (error) {
//         console.error("Error fetching folder templates:", error);
//       }
//     }

//     fetchFolderTemplates();
//   }, []);
//   return (
//     <Box>
//       <Typography>Assign folder template</Typography>
//       <Autocomplete/>

//       <Button></Button>
//     </Box>
//   )
// }

// export default Documents


import { Autocomplete, Box, Button, Typography, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
const Documents = () => {
  const API_KEY = process.env.REACT_APP_API_IP;
  const [folderTemplates, setFolderTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { data } = useParams();
  console.log(data);

  useEffect(() => {
    fetchPipelineData();
  }, []);
 
 
  const fetchPipelineData = async () => {
    try {
      const url = `${API_KEY}/common/folder`;
      const response = await fetch(url);
      const data = await response.json();
      setFolderTemplates(data.folderTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSelectTemplate = (selectedOptions) => {
    setSelectedTemplate(selectedOptions);
  };
  const optionpipeline = folderTemplates.map((folderTemplates) => ({
    value: folderTemplates._id,
    label: folderTemplates.templatename,
  }));


  const assignfoldertemp =()=>{
    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  accountId: data,
foldertempId: selectedTemplate.value,
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};
console.log(raw)
fetch("http://127.0.0.1:8002/clientdocs/accountfoldertemp", requestOptions)
  .then((response) => response.json())
  .then((result) => {
    console.log(result)
    fetchFolders(data);
  })
  .catch((error) => console.error(error));
  }

// Component to render folders and files recursively
const FolderContents = ({ contents }) => {
  return (
    <ul>
      {contents.map((item, index) => (
        <li key={index}>
          {item.type === 'folder' ? (
            <details>
              <summary>📁 {item.name}</summary>
              <FolderContents contents={item.contents} />
            </details>
          ) : (
            <span>📄 {item.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
};


  const [folderdata, setData] = useState(null); // Store the API response
  const [error, setError] = useState(null); // Store error if any
  const [loading, setLoading] = useState(true); // Track loading state

  const fetchFolders = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8002/clientdocs/folders/${data}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setData(result); // Set the fetched data
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
   fetchFolders(data);
  }, []);

  if (loading) {
    return <p>Loading folder structure...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Assign Folder Template
      </Typography>
      <Autocomplete
        options={optionpipeline}
        getOptionLabel={(option) => option.label}
        value={selectedTemplate}
        onChange={(event, newValue) => handleSelectTemplate(newValue)}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
          >
            {option.label}
          </Box>
        )}
        renderInput={(params) => <TextField {...params} sx={{ backgroundColor: "#fff" }} placeholder="Pipeline" variant="outlined" size="small" />}
        sx={{ width: "100%", marginTop: "8px" }}
        clearOnEscape // Enable clearable functionality
      />
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
       onClick={assignfoldertemp}
          disabled={!selectedTemplate}
        >
          Assign Template
        </Button>
      </Box>


      <Typography>Show folders and file</Typography>
      <Box> {folderdata && folderdata.contents ? (
        <FolderContents contents={folderdata.contents} />
      ) : (
        <p>No contents found.</p>
      )}</Box>
    </Box>
  );
};

export default Documents;
