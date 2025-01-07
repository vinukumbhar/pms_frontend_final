// import { FaTimes } from "react-icons/fa";
// import {
//   Drawer,
//   IconButton,
//   Typography,
// } from "@mui/material";
// import "./foldertemp.css";
// export default function CreateFolder({
//   isFolderFormOpen,
//   handleFormClose
// }) {
  
//   return (
//     <Drawer
//       anchor="right"
//       open={isFolderFormOpen}
//       onClose={handleFormClose}
//       PaperProps={{ sx: { width: 800 } }} // Set width of the Drawer
//     >
//       <div style={{ padding: 16 }}>
//         <Typography
//           variant="h6"
//           component="div"
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           Create Folder
//           <IconButton aria-label="close" onClick={handleFormClose}>
//             <FaTimes style={{ color: "#1976d3" }} />
//           </IconButton>
//         </Typography>

       
//       </div>
//     </Drawer>
//   );
// }


import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { FaFolder, FaFolderOpen,  } from "react-icons/fa";

import { Drawer, IconButton, Typography,   List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse, } from "@mui/material";
import "./foldertemp.css";

export default function CreateFolder({
  isFolderFormOpen,
  handleFormClose,
  API_KEY,
  templateId,
}) {
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState(null);
// console.log("folderslist",folders)
  useEffect(() => {
    // if (!isFolderFormOpen) return; 
    console.log(templateId)

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

        setFolders(addIsOpenProperty(response.data.folders || []));
      } catch (err) {
        console.error("Error fetching all folders:", err);
        setError(err.message || "An error occurred");
      }
    };

    fetchFolders();
  }, [ API_KEY, templateId]);

  const toggleFolder = (folderId) => {
    const updateFolders = (folders) =>
      folders.map((folder) =>
        folder.id === folderId
          ? { ...folder, isOpen: !folder.isOpen }
          : {
              ...folder,
              contents: folder.contents
                ? updateFolders(folder.contents)
                : folder.contents,
            }
      );

    setFolders(updateFolders(folders));
  };

  // const renderFolders = (folders) =>
  //   folders.map((folder) => (
  //     <React.Fragment key={folder.id}>
  //       <ListItem
         
  //         onClick={() => toggleFolder(folder.id)}
  //         sx={{ pl: folder.id.split("-").length * 2 }}
  //       >
  //         <ListItemIcon>
  //           {folder.isOpen ? "📂" :"📁"}
  //         </ListItemIcon>
  //         <ListItemText primary={folder.folder} />
  //       </ListItem>
  //       <Collapse in={folder.isOpen} timeout="auto" unmountOnExit>
  //         <List disablePadding>
  //           {folder.contents.length > 0
  //             ? renderFolders(folder.contents)
  //             : null}
  //         </List>
  //       </Collapse>
  //     </React.Fragment>
  //   ));


  const renderFolderOrFile = (item) => {
    if (item.file) {
      // Render file
      return (
        <ListItem key={item.id} sx={{ pl: item.id.split("-").length * 2 }}>
         📄
          <ListItemText primary={item.file} sx={{ ml: 1 }} />
        </ListItem>
      );
    } else if (item.folder) {
      // Render folder
      return (
        <div key={item.id}>
          <ListItem  onClick={() => toggleFolder(item.id)} sx={{ pl: item.id.split("-").length * 2 }}>
          {item.isOpen ? "📂" : "📁"}
            <ListItemText primary={item.folder} sx={{ ml: 1 }} />
          </ListItem>
          {item.isOpen && item.contents && item.contents.length > 0 && (
            <List>{item.contents.map((subItem) => renderFolderOrFile(subItem))}</List>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Drawer
      anchor="right"
      open={isFolderFormOpen}
      onClose={handleFormClose}
      PaperProps={{ sx: { width: 800 } }} // Set width of the Drawer
    >
      <div style={{ padding: 16 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Create Folder
          <IconButton aria-label="close" onClick={handleFormClose}>
            <FaTimes style={{ color: "#1976d3" }} />
          </IconButton>
        </Typography>

       
        <List>{folders.map((folder) => renderFolderOrFile(folder))}</List>
    
      </div>
    </Drawer>
  );
}
