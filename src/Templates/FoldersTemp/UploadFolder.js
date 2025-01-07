import { Drawer, IconButton, Divider, Typography, Box } from "@mui/material";

import { FaTimes } from "react-icons/fa";
const UploadDocument = ({ isSendFolderForm, handleUploadFormClose }) => {
  const API_KEY = process.env.REACT_APP_FOLDER_URL;
 

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


      </Box>
    </Drawer>
  );
};

export default UploadDocument;
