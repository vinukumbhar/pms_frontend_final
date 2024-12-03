import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import FolderTemplateTable from "./FolderTemplateTable";
import NameFolderTemp from "./NameFolderTemp";
import FolderList from "./FolderList";
import TemplateName from "./TemplateName";
import { Box, Typography, Paper } from "@mui/material";
import FolderTempEdit from "./FolderTempEdit";

const FolderTemp = () => {
  const API_KEY = process.env.REACT_APP_API_IP;
  const [isOpenClientDocs, setIsOpenClientDocs] = useState(false);
  const [isOpenSharedDocs, setIsOpenSharedDocs] = useState(false);
  const [isOpenPrivate, setIsOpenPrivate] = useState(false);
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [isDocumentForm, setIsDocumentForm] = useState(false);
  const [isTempEditForm, setIsTempEditForm] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [tempName, setTempName] = useState("");
  const [clientFolder, setClientFolder] = useState("Client uploaded document");
  const [firmFolder, setFirmFolder] = useState("Firm Doc shared with client");
  const [privateFolder, setPrivateFolder] = useState("Private");
  const [templateId, setTemplateId] = useState();

  const handleCancel = () => {
    setShowTable(false);
    setTempName("");
  };

  //get all templateName Record
  const [folderTemplates, setFolderTemplates] = useState([]);

  useEffect(() => {
    async function fetchFolderTemplates() {
      try {
        const url = `${API_KEY}/common/folder`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch folder templates");
        }
        const data = await response.json();
        setFolderTemplates(data.folderTemplates);
      } catch (error) {
        console.error("Error fetching folder templates:", error);
      }
    }

    fetchFolderTemplates();
  }, []);

  const handleEdit = (_id) => {
    // Implement logic for editing here
    console.log("Edit action triggered for template id: ", _id);
    setIsDocumentForm(true);
    setShowTable(!showTable);
    setTemplateName(false);
    setIsTempEditForm(true);
    setTemplateId(_id);

    // navigate('FoldertempUpdate/'+_id)
  };

  const [showTable, setShowTable] = useState(true);
  const [templateName, setTemplateName] = useState(false);
  const [folderList, setFolderList] = useState(false);

  const handleCreateTemplate = () => {
    setShowTable(!showTable);
    setTemplateName(true);
    console.log(templateName);
  };

  useEffect(() => {
    console.log(templateId);
  }, [templateId]);

  // todo
  const handleSaveTemplate = async () => {
    // Check if the template name is empty
    if (tempName.trim() === "") {
      // Display a toast error message if the template name is empty
      toast.error("Template name cannot be empty");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      templatename: tempName,
      clientFolder: clientFolder,
      firmFolder: firmFolder,
      privateFolder: privateFolder,
    });
    console.log(raw);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${API_KEY}/common/folder`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.id);
        fetchAllFolders(result.id);
        setTemplateId(result.id);

        // Display success toast
        toast.success("Template saved successfully");
        // Reset the form
        setShowForm(false);
      })
      .catch((error) => {
        console.error(error);
        // Display error toast
        toast.error("Failed to save template");
      });

    // window.location.reload();
    setFolderList(true);
    setTemplateName(false);
  };

  const [folderData, setFolderData] = useState([]);
  const fetchAllFolders = async (id) => {
    try {
      const url = `${API_KEY}/allFolders/${id}`;

      const response = await axios.get(url);
      setFolderData(response.data.folders);
      console.log(response);
    } catch (error) {
      console.error("Error fetching all folders:", error.response.data.error);
    }
  };

  return (
    <>
      <Box sx={{ borderRadius: "10px", padding: "20px" }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Folder Templates
          </Typography>
        </Box>

        <Box>
          {showTable && <FolderTemplateTable handleCreateTemplate={handleCreateTemplate} folderTemplates={folderTemplates} handleEdit={handleEdit} />}
          {templateName && <TemplateName handleSaveTemplate={handleSaveTemplate} handleCancel={handleCancel} tempName={tempName} setTempName={setTempName} />}

          {folderList && <FolderList tempName={tempName} folderData={folderData} fetchAllFolders={fetchAllFolders} templateId={templateId} />}
          {isTempEditForm && <FolderTempEdit tempName={tempName} folderData={folderData} fetchAllFolders={fetchAllFolders} templateId={templateId} />}
        </Box>
      </Box>
    </>
  );
};

export default FolderTemp;

{
  /* <div className="container">
        <h1>Folder Template</h1>
        <div className="subtitle" style={{ border: "1px solid #f1f3f5", padding: "10px", borderRadius: "15px", marginTop: "25px" }}>
          {showTable && <FolderTemplateTable handleCreateTemplate={handleCreateTemplate} folderTemplates={folderTemplates} handleEdit={handleEdit} />}
           {templateName && <TemplateName handleSaveTemplate={handleSaveTemplate} handleCancel={handleCancel} tempName={tempName} setTempName={setTempName}/>}
          {templateName && <NameFolderTemp handleSaveTemplate={handleSaveTemplate} handleCancel={handleCancel} tempName={tempName} setTempName={setTempName} />}
          {folderList && <FolderList tempName={tempName} folderData={folderData} fetchAllFolders={fetchAllFolders} templateId={templateId}/>}
         
        </div>
      </div> */
}
