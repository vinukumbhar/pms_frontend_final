import "./foldertemp.css";

import {  Divider, Box, Typography, Drawer } from "@mui/material";
const UploadDocument = ({ isDocumentForm,handleUploadFormClose }) => {
  const API_KEY = process.env.REACT_APP_FOLDER_URL;
  

 
  return (
    <Drawer
      anchor="right"
      open={isDocumentForm}
      onClose={handleUploadFormClose}
      PaperProps={{
        sx: {
          width: 800,
        },
      }}
    >
      <Box sx={{ padding: "16px" }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Upload Documents</Typography>

        </Box>

        <Divider sx={{ my: 2 }} />

        
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
         
          
        </Box>
      </Box>
    </Drawer>
  );
};

export default UploadDocument;
