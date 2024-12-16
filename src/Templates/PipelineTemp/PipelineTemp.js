import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Autocomplete,
  TextField,
  Switch, FormControlLabel,
  Divider, IconButton,
  useMediaQuery,
  useTheme, Alert, Drawer, Checkbox, Chip, Menu, MenuItem, Card, CardContent,
} from '@mui/material';
import { CircularProgress } from "@mui/material";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import Grid from '@mui/material/Unstable_Grid2';
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuPlusCircle, LuPenLine } from "react-icons/lu";
import { RxDragHandleDots2 } from "react-icons/rx";
import { toast } from 'react-toastify';
import axios from 'axios';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { RxCross2 } from "react-icons/rx";
const PipelineTemp = () => {

  const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;
  const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const JOBS_API = process.env.REACT_APP_JOBS_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const SORTJOBS_API = process.env.REACT_APP_SORTJOBS_URL;
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_TEMP_URL;
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;

  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [showForm, setShowForm] = useState(false);
  const [pipelineName, setPipelineName] = useState('');
  const [isFormDirty, setIsFormDirty] = useState(false);
  const handleCreatePipeline = () => {
    setShowForm(true); // Show the form when button is clicked
  };



  // sort jobs
  const [sortbyjobs, setSortbyJobs] = useState([]);
  const [selectedSortByJob, setSelectedSortByJob] = useState('');

  const handleSortingByJobs = (selectedOptions) => {
    setSelectedSortByJob(selectedOptions);
    console.log(selectedOptions)
  }

  useEffect(() => {
    fetchSortByJob();
  }, []);

  const fetchSortByJob = async () => {
    try {
      const url = `${SORTJOBS_API}/sortjobs/sortjobby`;
      const response = await fetch(url);
      const data = await response.json();
      setSortbyJobs(data.sortJobsBy);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const optionsort = sortbyjobs.map((sort) => ({
    value: sort._id,
    label: sort.description
  }));

  const [Account_id, setAccount_id] = useState(false);
  const handleAccount_idChange = (event) => {
    setAccount_id(event.target.checked);
  };
  const [Days_on_stage, setDays_on_stage] = useState(false);
  const handleDays_on_stageChange = (event) => {
    setDays_on_stage(event.target.checked);
  };
  const [Account_tags, setAccount_tags] = useState(false);
  const handleAccount_tagsChange = (event) => {
    setAccount_tags(event.target.checked);
  };
  const [startDate, setStartDate] = useState(false);
  const handleStartDateChange = (event) => {
    setStartDate(event.target.checked);
  };
  const [Name, setName] = useState(false);
  const handleNameSwitchChange = (event) => {
    setName(event.target.checked);
  };
  const [Due_date, setDue_date] = useState(false);
  const handleDue_dateChange = (event) => {
    setDue_date(event.target.checked);
  };
  const [Priority, setPriority] = useState(false);
  const [Description, setDescription] = useState(false);
  const [Assignees, setAssignees] = useState(false);
  const handlePriorityChange = (event) => {
    setPriority(event.target.checked);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.checked);
  };
  const handleAssigneesChange = (event) => {
    setAssignees(event.target.checked);
  };


  const [stages, setStages] = useState([]);

  const handleAddStage = () => {
    const newStage = {
      name: '', conditions: [], automations: [], autoMove: false, showDropdown: false, activeAction: null
    };
    setStages([...stages, newStage]);
  };

  //Automation code
  const [anchorEl, setAnchorEl] = useState(null);
  const [ehitAnchorEl, setEditAnchorEl] = useState(null);
  const [isConditionsEditFormOpen, setIsConditionsEditFormOpen] = useState(false)
  const [addNewAutomation, setAddNewAutomation] = useState(null);
  const handleAddAutomationClick = (event) => {
    setAddNewAutomation(event.currentTarget);
  }
  const handleEditClick = (event, index) => {
    setEditAnchorEl(event.currentTarget);
    SetStageSelected(index);  // Save the selected stage index
    console.log(index)
  };
  const handleEditConditions = (index) => {
    const currentAutomation = selectedAutomationData[index];
    setStageAutomationTags(currentAutomation.tags || []); // Use existing tags or default to an empty array
    setIsConditionsEditFormOpen(true); // Open the drawer
  }
  const handleDeleteAutomation = (index) => {
    const updatedAutomations = selectedAutomationData.filter((_, i) => i !== index);
    setSelectedAutomationData(updatedAutomations);
  };
  const handleEditGoBack = () => {
    setIsConditionsEditFormOpen(false);
  };
  const handleMenuItemSelect = (type) => {
    let newAutomation = {};

    switch (type) {
      case "Send Email":
        newAutomation = { type: "Send Email", template: null, tags: [] };
        break;
      case "Send Invoice":
        newAutomation = { type: "Send Invoice", template: null, tags: [] };
        break;
      case "Send Proposal/Els":
        newAutomation = { type: "Send Proposal/Els", template: null, tags: [] };
        break;
      case "Create Organizer":
        newAutomation = { type: "Create Organizer", template: null, tags: [] };
        break;
      default:
        break;
    }

    setSelectedAutomationData([...selectedAutomationData, newAutomation]);
    setEditAnchorEl(null); // Close the menu
    setIsEditDrawerOpen(true); // Open the edit drawer
  };
  const handleEditClose = () => {
    setEditAnchorEl(null);
  };
  const handleAddNewClose = () => {
    setAddNewAutomation(null)
  }
  
  const handleAutomationOptionClick = (actionType) => {
    SetAutomationSelect(actionType);// Perform the action based on the selected option
    handleAddNewClose(); // Close the dropdown
  };
  const handleEditTemplateChange = (index, newValue) => {
    const updatedData = [...selectedAutomationData];
    updatedData[index].template = newValue;
    setSelectedAutomationData(updatedData);
  };

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedAutomationData, setSelectedAutomationData] = useState([]);
  // const handleClick = (event, index, actionType) => {
  //   setAnchorEl(event.currentTarget);
  //   SetStageSelected(index); // Save the selected stage index

  //   // If the action is to edit, open the drawer
  //   if (actionType === "edit") {
  //     setSelectedAutomationData(stages[index].automations); // Assuming automations is an array
  //     setIsEditDrawerOpen(true); // Open the drawer
  //   }
  //   console.log(index);
  // };
  const [editingStageIndex, setEditingStageIndex] = useState(null);
  const handleClick = (event, index, actionType) => {
    setAnchorEl(event.currentTarget); // Opens the menu
    SetStageSelected(index); // Stores the selected stage index

    // if (actionType === "edit") {
    //     // Ensure automation data exists before accessing
    //     const automations = stages[index]?.automations || [];
    //     setSelectedAutomationData(automations); // Populate drawer with automations
    //     setIsEditDrawerOpen(true); // Open the edit automation drawer
    // }
    if (actionType === "edit") {
      const automations = stages[index]?.automations || [];
      if (automations.length > 0) { // Only proceed if automations exist
        setSelectedAutomationData(automations); // Populate drawer with automations
        setIsEditDrawerOpen(true); // Open the edit automation drawer
        setAnchorEl(null)
        setEditingStageIndex(index)
      } else {
        console.log("No automations available to edit for this stage.");
      }
    }
    console.log("Stage Index:", index);
  };
  // const handleEditCheckboxChange = (tag) => {
  //   // Check if the tag is already selected in tempSelectedTags
  //   setTempSelectedTags((prevTags) => {
  //     const isSelected = prevTags.some((selectedTag) => selectedTag._id === tag._id);

  //     // If the tag is already selected, remove it
  //     if (isSelected) {
  //       return prevTags.filter((selectedTag) => selectedTag._id !== tag._id);
  //     }

  //     // If the tag is not selected, add it
  //     return [...prevTags, tag];
  //   });

  //   // Sync changes with stageAutomationTags
  //   setStageAutomationTags((prevTags) => {
  //     const isInStage = prevTags.some((existingTag) => existingTag._id === tag._id);

  //     // If the tag exists in stageAutomationTags and is being unchecked, remove it
  //     if (isInStage && tempSelectedTags.some((selectedTag) => selectedTag._id === tag._id)) {
  //       return prevTags.filter((existingTag) => existingTag._id !== tag._id);
  //     }

  //     // Otherwise, return the original stageAutomationTags
  //     return prevTags;
  //   });
  // };

  const handleEditCheckboxChange = (tag, index) => {
    // Find the selected automation by index
    const updatedAutomation = [...selectedAutomationData];
    const automation = updatedAutomation[index];

    // Check if the tag is already selected
    const isTagSelected = automation.tags.some((existingTag) => existingTag._id === tag._id);

    if (isTagSelected) {
      // Remove the tag if already selected
      automation.tags = automation.tags.filter((existingTag) => existingTag._id !== tag._id);
    } else {
      // Add the tag if not selected
      automation.tags.push(tag);
    }

    // Update the state with the modified automation
    setSelectedAutomationData(updatedAutomation);
  };
  // const handleEditAddTags = () => {
  //   const updatedTags = [
  //     ...stageAutomationTags,
  //     ...tempSelectedTags.filter(
  //       (newTag) => !stageAutomationTags.some((existingTag) => existingTag._id === newTag._id)
  //     ),
  //   ];

  //   console.log("Merged Tags:", updatedTags);

  //   // Update the tags in the selected automation object
  //   setSelectedAutomationData((prevData) =>
  //     prevData.map((automation) => {
  //       if (selectedAutomationData.includes(automation)) {
  //         return {
  //           ...automation,
  //           tags: updatedTags, // Add updated tags to automation
  //         };
  //       }
  //       return automation;
  //     })
  //   );

  //   setIsConditionsEditFormOpen(false); // Close the drawer

  // };


  const [selectedAutomationIndex, setSelectedAutomationIndex] = useState(null);

  const handleEditAddTags = () => {
    const updatedTags = [
      ...selectedAutomationData[selectedAutomationIndex].tags,  // Only update tags for the selected automation
      ...tempSelectedTags.filter(
        (newTag) => !selectedAutomationData[selectedAutomationIndex].tags.some(
          (existingTag) => existingTag._id === newTag._id
        )
      ),
    ];

    console.log("Updated Tags for Selected Automation:", updatedTags);

    // Update the tags for the selected automation only
    setSelectedAutomationData((prevData) =>
      prevData.map((automation, idx) => {
        if (idx === selectedAutomationIndex) {
          return {
            ...automation,
            tags: updatedTags, // Add updated tags to the selected automation
          };
        }
        return automation;
      })
    );

    setTempSelectedTags([]); // Clear the temporary selected tags
    setIsConditionsEditFormOpen(false); // Close the drawer
  };


  // const handleEditSaveAutomation = (index) => {
  //   // Ensure the automation data has been updated
  //   const updatedStages = [...stages];  // Create a copy of stages array
  //   updatedStages[index].automations = selectedAutomationData; // Update the automations for the specific stage

  //   // Set the new stages array
  //   setStages(updatedStages);

  //   // Close the drawer after saving the automation
  //   setIsEditDrawerOpen(false);
  //   toast.success("automation edited successfully")
  // };

  const handleEditSaveAutomation = () => {
    if (editingStageIndex === null) return; // Ensure the stage index is valid
    
    console.log("Save automation for stage:", editingStageIndex);
  
    // Update the automations for the selected stage
    const updatedStages = [...stages];
    updatedStages[editingStageIndex].automations = selectedAutomationData;
  
    // Update the stages state
    setStages(updatedStages);
  
    // Close the drawer and show success message
    setIsEditDrawerOpen(false);
    toast.success("Automation edited successfully");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // handleUpdateDrawer
  const [updateDrawer, setupdateDrawer] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [automationSelect, SetAutomationSelect] = useState();
  const [stageSelected, SetStageSelected] = useState();

  const handleDrawerOpen = (option, index) => {
    setIsDrawerOpen(true);
    SetAutomationSelect(option);
    SetStageSelected(index);
    console.log(index)
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  }

  const handleAddAutomation = (stageSelected, option) => {
    // Handle option action here
    console.log("Adding automation to stage index:", stageSelected);
    console.log("automation  clicked!");
    // const newStages = [...stages]; // Create a copy of the stages array
    // newStages[stageSelected].automations.push(option); // Append the new option
    // setStages(newStages); // Update the state with the modified stages array
    // console.log(newStages)
    console.log("Added automation to stage", stageSelected, option);
    handleDrawerOpen(option, stageSelected);
    handleClose();
  };



  const [addEmailTemplates, setAddEmailTemplates] = useState([]);
  const [addInvoiceTemplates, setAddInvoiceTemplates] = useState([]);
  const [addProposalsandElsTeplates, setAddProposalsandElsTeplates] = useState([]);
  const [addOrganizerTemplates, setAddOrganizerTemplates] = useState([]);
  useEffect(() => {
    fetchEmailTemplates();
    fectInvoiceTemplates();
    fectProposalandElsTemp();
    fetchOrganizerTemplates();
  }, []);
  const fetchEmailTemplates = async () => {
    try {
      const url = `${EMAIL_API}/workflow/emailtemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setAddEmailTemplates(data.emailTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const emailTemplateOptions = addEmailTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));
  const fectInvoiceTemplates = async () => {
    try {
      const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setAddInvoiceTemplates(data.invoiceTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const invoiceTemplateOptions = addInvoiceTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));



  const fectProposalandElsTemp = async () => {
    try {
      const url = `${PROPOSAL_API}/workflow/proposalesandels/proposalesandels`;
      const response = await fetch(url);
      const data = await response.json();
      setAddProposalsandElsTeplates(data.proposalesAndElsTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const proposalElsOptions = addProposalsandElsTeplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));



  const fetchOrganizerTemplates = async () => {
    try {
      const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setAddOrganizerTemplates(data.OrganizerTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const organizerOptions = addOrganizerTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  const [selectedtemp, setselectedTemp] = useState();
  const handletemp = (selectedOptions) => {
    setselectedTemp(selectedOptions);
  };

  // condition tags
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [isConditionsFormOpen, setIsConditionsFormOpen] = useState(false);
  const [isAnyCheckboxChecked, setIsAnyCheckboxChecked] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedTags, setTempSelectedTags] = useState([]);
  const [stageAutomationTags, setStageAutomationTags] = useState([]);

  const handleAddConditions = () => {
    setIsConditionsFormOpen(!isConditionsFormOpen);
  };

  const handleGoBack = () => {
    setIsConditionsFormOpen(false);
  };


  const handleCheckboxChange = (tag) => {
    const updatedSelectedTags = tempSelectedTags.includes(tag) ? tempSelectedTags.filter((t) => t._id !== tag._id) : [...tempSelectedTags, tag];
    setTempSelectedTags(updatedSelectedTags);
    setIsAnyCheckboxChecked(updatedSelectedTags.length > 0);
  };


  const handleAddTags = () => {
    setSelectedTags([...selectedTags, ...tempSelectedTags.filter((tag) => !selectedTags.some((t) => t._id === tag._id))]);
    setIsConditionsFormOpen(false);
    setTempSelectedTags([]);
  };
  const [tags, setTags] = useState([]);
  console.log(selectedTags)
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const url = `${TAGS_API}/tags`;
      const response = await fetch(url);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateWidth = (label) => Math.min(label.length * 8, 200);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const filteredTags = tags.filter((tag) => tag.tagName.toLowerCase().includes(searchTerm.toLowerCase()));
  const selectedTagElements = selectedTags.map((tag) => (
    <Box
      key={tag._id}
      sx={{
        backgroundColor: tag.tagColour,
        borderRadius: "20px",
        color: "#fff",
        fontSize: "12px",
        fontWeight: "600",
        textAlign: "center",
        padding: "3px",
        marginBottom: "5px",
        marginRight: "5px",
        display: "inline-block",
        width: `${calculateWidth(tag.tagName)}px`,
      }}
    >
      {tag.tagName}
    </Box>
  ));
  // Function to render content based on action
  const renderActionContent = (automationSelect, index) => {
    switch (automationSelect) {
      case "Send Invoice":
        return (
          <>

            <Grid item ml={2}>
              {automationSelect}
              <Typography mb={1}>Select template</Typography>
              <Autocomplete
                options={invoiceTemplateOptions}
                getOptionLabel={(option) => option.label}
                value={selectedtemp}
                onChange={(event, newValue) => handletemp(newValue)}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                  >
                    {option.label}
                  </Box>
                )}
                renderInput={(params) => (
                  <>
                    <TextField
                      {...params}
                      // helperText={templateError}
                      sx={{ backgroundColor: "#fff" }}
                      placeholder="Select Template"
                      variant="outlined"
                      size="small"
                    />
                  </>
                )}
                sx={{ width: "100%", marginTop: "8px" }}
                clearOnEscape // Enable clearable functionality
              />
              {selectedTags.length > 0 && (
                <Grid container alignItems="center" gap={1}>
                  <Typography>Only for:</Typography>
                  <Grid item>{selectedTagElements}</Grid>
                </Grid>
              )}
              <Button variant="text" onClick={handleAddConditions}>Add Conditions</Button>


              <Button variant="contained" onClick={handleSaveAutomation(index)}>
                Save Automation
              </Button>
            </Grid>
            <Drawer anchor="right" open={isConditionsFormOpen} onClose={handleGoBack} PaperProps={{ sx: { width: "550px", padding: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                  <IoMdArrowRoundBack fontSize="large" color="blue" />
                </IconButton>
                <Typography variant="h6">Add conditions</Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">Apply automation only for accounts with these tags</Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <AiOutlineSearch style={{ marginRight: 8 }} />,
                  }}
                  sx={{ marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2 , height:'68vh', overflowY:'auto'}}>
                  {filteredTags.map((tag) => (
                    <Box key={tag._id} sx={{ display: "flex", alignItems: "center", gap: 3, borderBottom: "1px solid grey", paddingBottom: 1,}}>
                      <Checkbox checked={tempSelectedTags.includes(tag)} onChange={() => handleCheckboxChange(tag)} />
                      <Chip label={tag.tagName} sx={{ backgroundColor: tag.tagColour, color: "#fff", fontWeight: "500", borderRadius: "20px", marginRight: 1 }} />
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                  <Button variant="contained" color="primary" disabled={!isAnyCheckboxChecked} onClick={handleAddTags}>
                    Add
                  </Button>
                  <Button variant="outlined" color="primary" onClick={handleGoBack}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Drawer>
          </>
        );
      case "Send Proposal/Els":
        return (
          <Box p={2}>

            <Grid item >
            {automationSelect}
              <Typography mb={1}>Select template</Typography>
              <Autocomplete
                options={proposalElsOptions}
                getOptionLabel={(option) => option.label}
                value={selectedtemp}
                onChange={(event, newValue) => handletemp(newValue)}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                  >
                    {option.label}
                  </Box>
                )}
                renderInput={(params) => (
                  <>
                    <TextField
                      {...params}
                      // helperText={templateError}
                      sx={{ backgroundColor: "#fff" }}
                      placeholder="Select Template"
                      variant="outlined"
                      size="small"
                    />
                  </>
                )}
                sx={{ width: "100%", marginTop: "8px" }}
                clearOnEscape // Enable clearable functionality
              />

              {selectedTags.length > 0 && (
                <Grid container alignItems="center" gap={1}>
                  <Typography>Only for:</Typography>
                  <Grid item>{selectedTagElements}</Grid>
                </Grid>
              )}
              <Button variant="text" onClick={handleAddConditions}>Add Conditions</Button>


            </Grid>
            <Button variant="contained" onClick={handleSaveAutomation(index)}>
              Save Automation
            </Button>

            <Drawer anchor="right" open={isConditionsFormOpen} onClose={handleGoBack} PaperProps={{ sx: { width: "550px", padding: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                  <IoMdArrowRoundBack fontSize="large" color="blue" />
                </IconButton>
                <Typography variant="h6">Add conditions</Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">Apply automation only for accounts with these tags</Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <AiOutlineSearch style={{ marginRight: 8 }} />,
                  }}
                  sx={{ marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2 ,height:'68vh', overflowY:'auto'}}>
                  {filteredTags.map((tag) => (
                    <Box key={tag._id} sx={{ display: "flex", alignItems: "center", gap: 3, borderBottom: "1px solid grey", paddingBottom: 1 }}>
                      <Checkbox checked={tempSelectedTags.includes(tag)} onChange={() => handleCheckboxChange(tag)} />
                      <Chip label={tag.tagName} sx={{ backgroundColor: tag.tagColour, color: "#fff", fontWeight: "500", borderRadius: "20px", marginRight: 1 }} />
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                  <Button variant="contained" color="primary" disabled={!isAnyCheckboxChecked} onClick={handleAddTags}>
                    Add
                  </Button>
                  <Button variant="outlined" color="primary" onClick={handleGoBack}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Drawer>
          </Box>
        );
      case "Send Email":
        return (
          <>
            <Box p={2}>
              <Grid item >
              {automationSelect}
                <Typography mb={1}>Select template</Typography>
                <Autocomplete
                  options={emailTemplateOptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue)}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      {...props}
                      sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                    >
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <>
                      <TextField
                        {...params}
                        // helperText={templateError}
                        sx={{ backgroundColor: "#fff" }}
                        placeholder="Select Template"
                        variant="outlined"
                        size="small"
                      />
                    </>
                  )}
                  sx={{ width: "100%", marginTop: "8px" }}
                  clearOnEscape // Enable clearable functionality
                />
                {selectedTags.length > 0 && (
                  <Grid container alignItems="center" gap={1}>
                    <Typography>Only for:</Typography>
                    <Grid item>{selectedTagElements}</Grid>
                  </Grid>
                )}
                <Button variant="text" onClick={handleAddConditions}>Add Conditions</Button>



              </Grid>
              <Button variant="contained" onClick={handleSaveAutomation(stageSelected)}>
                Save Automation
              </Button>
            </Box>
            {/* Condition tags for automation */}
            <Drawer anchor="right" open={isConditionsFormOpen} onClose={handleGoBack} PaperProps={{ sx: { width: "550px", padding: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                  <IoMdArrowRoundBack fontSize="large" color="blue" />
                </IconButton>
                <Typography variant="h6">Add conditions</Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">Apply automation only for accounts with these tags</Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <AiOutlineSearch style={{ marginRight: 8 }} />,
                  }}
                  sx={{ marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2,height:'68vh', overflowY:'auto' }}>
                  {filteredTags.map((tag) => (
                    <Box key={tag._id} sx={{ display: "flex", alignItems: "center", gap: 3, borderBottom: "1px solid grey", paddingBottom: 1 }}>
                      <Checkbox checked={tempSelectedTags.includes(tag)} onChange={() => handleCheckboxChange(tag)} />
                      <Chip label={tag.tagName} sx={{ backgroundColor: tag.tagColour, color: "#fff", fontWeight: "500", borderRadius: "20px", marginRight: 1 }} />
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                  <Button variant="contained" color="primary" disabled={!isAnyCheckboxChecked} onClick={handleAddTags}>
                    Add
                  </Button>
                  <Button variant="outlined" color="primary" onClick={handleGoBack}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Drawer>
          </>
        );
      case "Create Organizer":
        return (
          <>
            <Box p={2}>
              <Grid item >
                <Typography mb={1}>Select template</Typography>
                <Autocomplete
                  options={organizerOptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue)}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      {...props}
                      sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                    >
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <>
                      <TextField
                        {...params}
                        // helperText={templateError}
                        sx={{ backgroundColor: "#fff" }}
                        placeholder="Select Template"
                        variant="outlined"
                        size="small"
                      />
                    </>
                  )}
                  sx={{ width: "100%", marginTop: "8px" }}
                  clearOnEscape // Enable clearable functionality
                />
                {selectedTags.length > 0 && (
                  <Grid container alignItems="center" gap={1}>
                    <Typography>Only for:</Typography>
                    <Grid item>{selectedTagElements}</Grid>
                  </Grid>
                )}
                <Button variant="text" onClick={handleAddConditions}>Add Conditions</Button>



              </Grid>
              <Button variant="contained" onClick={handleSaveAutomation(stageSelected)}>
                Save Automation
              </Button>
            </Box>
            {/* Condition tags for automation */}
            <Drawer anchor="right" open={isConditionsFormOpen} onClose={handleGoBack} PaperProps={{ sx: { width: "550px", padding: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                  <IoMdArrowRoundBack fontSize="large" color="blue" />
                </IconButton>
                <Typography variant="h6">Add conditions</Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">Apply automation only for accounts with these tags</Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <AiOutlineSearch style={{ marginRight: 8 }} />,
                  }}
                  sx={{ marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2 ,height:'68vh', overflowY:'auto'}}>
                  {filteredTags.map((tag) => (
                    <Box key={tag._id} sx={{ display: "flex", alignItems: "center", gap: 3, borderBottom: "1px solid grey", paddingBottom: 1 }}>
                      <Checkbox checked={tempSelectedTags.includes(tag)} onChange={() => handleCheckboxChange(tag)} />
                      <Chip label={tag.tagName} sx={{ backgroundColor: tag.tagColour, color: "#fff", fontWeight: "500", borderRadius: "20px", marginRight: 1 }} />
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                  <Button variant="contained" color="primary" disabled={!isAnyCheckboxChecked} onClick={handleAddTags}>
                    Add
                  </Button>
                  <Button variant="outlined" color="primary" onClick={handleGoBack}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Drawer>
          </>
        );
      // Add cases for other actions here
      default:
        return null;
    }
  };

  // handleTemplateChange

  // const handleSaveAutomation = (index) => {
  //   return () => {
  //     const updatedStages = [...stages];
  //     const selectedAutomation = {
  //       type: automationSelect, // The type of automation (e.g., "Send Email")
  //       template: selectedtemp ? { label: selectedtemp.label, value: selectedtemp.value } : null, // Store label and value of selected template
  //       tags: selectedTags.map(tag => ({ // Map selectedTags to include necessary tag data
  //         _id: tag._id,
  //         tagName: tag.tagName,
  //         tagColour: tag.tagColour,
  //       })),
  //     };
  //     updatedStages[index].automations.push(selectedAutomation);
  //     setStages(updatedStages);
  //     console.log("Automation saved for stage:", index, selectedAutomation);
  //     setselectedTemp(null); // Clear the selected template after saving
  //     setSelectedTags([])
  //     setIsAnyCheckboxChecked(false)
  //     handleDrawerClose();
  //   };
  // };




  const handleSaveAutomation = (index) => {
    return () => {
      const updatedStages = [...stages];
      console.log("Updated Stages before update:", updatedStages);
  
      const selectedAutomation = {
        type: automationSelect,
        template: selectedtemp ? { label: selectedtemp.label, value: selectedtemp.value } : null,
        tags: selectedTags.map(tag => ({
          _id: tag._id,
          tagName: tag.tagName,
          tagColour: tag.tagColour,
        })),
      };
  
      // Make sure the right stage is getting updated
      updatedStages[index] = {
        // ...updatedStages[index], // Ensure we keep the other properties of the stage intact
        automations: [...updatedStages[index].automations, selectedAutomation], // Add the new automation to automations
      };
  
      setStages(updatedStages);
      console.log("Automation saved for stage:", index, selectedAutomation);
  
      // Reset form fields
      setselectedTemp(null);
      setSelectedTags([]);
      setIsAnyCheckboxChecked(false);
      handleDrawerClose();
    };
  };

  // const handleEditCheckboxChange = (tag) => {
  //   console.log("Tag clicked:", tag);

  //   // Update tempSelectedTags based on selection/deselection
  //   setTempSelectedTags((prevTags) => {
  //     const isSelected = prevTags.some((selectedTag) => selectedTag._id === tag._id);
  //     if (isSelected) {
  //       console.log("Removing tag:", tag);
  //       return prevTags.filter((selectedTag) => selectedTag._id !== tag._id);
  //     } else {
  //       console.log("Adding tag:", tag);
  //       return [...prevTags, tag];
  //     }
  //   });

  //   // Update stageAutomationTags for immediate visual feedback if needed
  //   setStageAutomationTags((prevTags) => {
  //     if (!prevTags.some((existingTag) => existingTag._id === tag._id)) {
  //       console.log("Adding to stageAutomationTags:", tag);
  //       return [...prevTags, tag];
  //     }
  //     return prevTags;
  //   });
  // };




  const handleStageNameChange = (e, index) => {
    const newStages = [...stages]; // Create a copy of the stages array
    newStages[index].name = e.target.value; // Update the name of the specific stage
    setStages(newStages); // Update the state with the modified stages array
  };

  const handleDeleteStage = (index) => {
    const updatedStages = [...stages];
    updatedStages.splice(index, 1);
    setStages(updatedStages);
  };

  const handleAutoMoveChange = (index) => {
    const updatedStages = stages.map((stage, idx) => (
      idx === index ? { ...stage, autoMove: !stage.autoMove } : stage
    ));
    setStages(updatedStages);
  };

  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchData = async () => {
    try {
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setCombinedValues(selectedValues);
  };
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  //Default Jobt template get 
  const [Defaulttemp, setDefaultTemp] = useState([]);
  const [selectedJobtemp, setselectedJobTemp] = useState();
  const handleJobtemp = (selectedOptions) => {
    setselectedJobTemp(selectedOptions);
    console.log(selectedOptions)
  }
  useEffect(() => {
    fetchtemp();
  }, []);

  const fetchtemp = async () => {
    try {
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setDefaultTemp(data.JobTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const optiontemp = Defaulttemp.map((temp) => ({
    value: temp._id,
    label: temp.templatename

  }));


  const createPipe = () => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    console.log(stages)

    const data = {
      pipelineName: pipelineName,
      availableto: combinedValues,
      sortjobsby: selectedSortByJob.value,
      defaultjobtemplate: selectedJobtemp.value,
      accountId: Account_id,
      description: Description,
      duedate: Due_date,
      accounttags: Account_tags,
      priority: Priority,
      days_on_Stage: Days_on_stage,
      assignees: Assignees,
      name: Name,
      startdate: startDate,
      stages: stages,

    };
    console.log(data)
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${PIPELINE_API}/workflow/pipeline/createpipeline`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data,
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        // Display success toast
        fetchPipelineData();
        toast.success("Pipeline created successfully");
        setShowForm(false);
        clearForm();
        // Additional success handling here
      })
      .catch((error) => {
        console.log(error);
        // Display error toast
        toast.error("Failed to create pipeline");
        // Additional error handling here
      });
  };
  const createSavePipe = () => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    const data = {
      pipelineName: pipelineName,
      availableto: combinedValues,
      sortjobsby: selectedSortByJob.value,
      defaultjobtemplate: selectedJobtemp.value,
      accountId: Account_id,
      description: Description,
      duedate: Due_date,
      accounttags: Account_tags,
      priority: Priority,
      days_on_Stage: Days_on_stage,
      assignees: Assignees,
      name: Name,
      startdate: startDate,
      stages: stages,
    };

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${PIPELINE_API}/workflow/pipeline/createpipeline`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data,
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        // Display success toast
        fetchPipelineData();
        toast.success("Pipeline created successfully");

        // Additional success handling here
      })
      .catch((error) => {
        console.log(error);
        // Display error toast
        toast.error("Failed to create pipeline");
        // Additional error handling here
      });
  };
  const clearForm = () => {
    setPipelineName('');
    setSelectedUser([]);
    setCombinedValues([]);
    setSelectedSortByJob('');
    setselectedJobTemp(null);

    setAccount_id(false);
    setDays_on_stage(false);
    setAccount_tags(false);
    setStartDate(false);
    setName(false);
    setDue_date(false);
    setPriority(false);
    setDescription(false);
    setAssignees(false);

    setStages([]);


  };


  const [pipelineData, setPipelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchPipelineData();
  }, []);

  const fetchPipelineData = async () => {
    setLoading(true);
    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 3000));
    try {

      const url = `${PIPELINE_API}/workflow/pipeline/pipelines`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch pipeline data');
      }
      const data = await response.json();
      setPipelineData(data.pipeline);
    } catch (error) {
      console.error('Error fetching pipeline data:', error);
    }
    finally {
      await loaderDelay;
      setLoading(false); // Stop loader
    }
  };
  const handleEdit = (_id) => {
    // Implement logic for editing here
    // console.log("Edit action triggered for template id: ", templateId);
    navigate('PipelineTemplateUpdate/' + _id)

  };


  //delete template
  const handleDelete = async (_id) => {

    // Show a confirmation prompt
    const isConfirmed = window.confirm("Are you sure you want to delete this pipeline?");

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `${PIPELINE_API}/workflow/pipeline/pipeline/${_id}`,
        headers: {}
      };

      try {
        const response = await axios.request(config);
        console.log('Delete response:', response.data);
        toast.success('Item deleted successfully');
        fetchPipelineData();
        // Optionally, you can refresh the data or update the state to reflect the deletion
      } catch (error) {
        console.error('Error deleting pipeline:', error);
      }
    }
  };

  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
  };
  // console.log(tempIdget)
  const columns = useMemo(() => [
    {
      accessorKey: 'pipelineName',
      header: 'Name',
      Cell: ({ row }) => (
        <Typography
          sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: 'bold' }}
          onClick={() => handleEdit(row.original._id)}
        >
          {row.original.pipelineName}
        </Typography>
      ),

    },
    {
      accessorKey: 'Setting', header: 'Setting',
      Cell: ({ row }) => (
        <IconButton onClick={() => toggleMenu(row.original._id)} style={{ color: "#2c59fa" }}>
          <CiMenuKebab style={{ fontSize: "25px" }} />
          {openMenuId === row.original._id && (
            <Box sx={{ position: 'absolute', zIndex: 1, backgroundColor: '#fff', boxShadow: 1, borderRadius: 1, p: 1, left: '30px', m: 2 }}>
              <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }} onClick={() => {
                handleEdit(row.original._id);

              }} >Edit</Typography>
              <Typography sx={{ fontSize: '12px', color: 'red', fontWeight: 'bold' }} onClick={() => handleDelete(row.original._id)}>Delete</Typography>
            </Box>
          )}
        </IconButton>

      ),

    },

  ], [openMenuId]);

  const table = useMaterialReactTable({
    columns,
    data: pipelineData,
    enableBottomToolbar: true,
    enableStickyHeader: true,
    columnFilterDisplayMode: "custom", // Render own filtering UI
    enableRowSelection: true, // Enable row selection
    enablePagination: true,
    muiTableContainerProps: { sx: { maxHeight: "400px" } },
    initialState: {
      columnPinning: { left: ["mrt-row-select", "tagName"], right: ['settings'], },
    },
    muiTableBodyCellProps: {
      sx: (theme) => ({
        backgroundColor: theme.palette.mode === "dark-theme" ? theme.palette.grey[900] : theme.palette.grey[50],
      }),
    },
  });
  const handleClosePipelineTemp = () => {
    if (isFormDirty) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmClose) {
        return;
      }
    }
    setShowForm(false);
  };

  // Detect form changes
  useEffect(() => {
    if (pipelineName || Assignees || selectedJobtemp || selectedSortByJob) {
      setIsFormDirty(true);

    } else {
      setIsFormDirty(false);
    }
  }, [pipelineName, Assignees, selectedJobtemp, selectedSortByJob,]);

  const [pipelineNameError, setPipelineNameError] = useState('');
  const [sortByJobError, setSortByJobError] = useState('');
  const [templateError, setTemplateError] = useState('');
  const [userError, setUserError] = useState('');
  const validateForm = () => {
    let isValid = true;
    if (!pipelineName) {
      setPipelineNameError("Pipeline name is required");

      isValid = false;
    } else {
      setPipelineNameError('');
    }
    if (!selectedSortByJob) {
      setSortByJobError('Sort By Job is required.');
      isValid = false;
    } else {
      setSortByJobError('');
    }

    if (!selectedJobtemp) {
      setTemplateError('Job Template is required.');
      isValid = false;
    } else {
      setTemplateError('');
    }

    if (selectedUser.length === 0) {
      setUserError('At least one user must be selected.');
      isValid = false;
    } else {
      setUserError('');
    }


    return isValid;
  };


  return (
    <Container>
      {!showForm ? (
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleCreatePipeline} sx={{ mb: 3 }}>
            Create Pipeline
          </Button>

          {/* <MaterialReactTable columns={columns} table={table} /> */}
          {loading ? (
  <Box sx={{display:'flex',alignItems:'center', justifyContent:'center'}}> <CircularProgress style={{fontSize:'300px', color:'blue'}}/></Box>):( <MaterialReactTable columns={columns} table={table} />)
}

        </Box>
      ) : (
        <Box
          sx={{
            mt: 2,

          }}
        >

          <Box>
            <form>
              <Box>
                <Typography variant='h5' gutterBottom>  Create Pipelines</Typography>
                <Box mt={2} mb={2}><hr /></Box>
                <Grid container spacing={2} >
                  <Grid xs={12} sm={5.8}>
                    <Box >
                      {/* <InputLabel className="pipeline-lable">Pipeline Name</InputLabel> */}
                      <label className="pipeline-lable">Pipeline Name</label>
                      <TextField
                        fullWidth
                        value={pipelineName}
                        onChange={(e) => setPipelineName(e.target.value)}

                        error={!!pipelineNameError}
                        // helperText={pipelineNameError}
                        sx={{ mt: 1.5, backgroundColor: '#fff' }}
                        size="small"
                        placeholder='Pipeline Name'
                      />
                      {(!!pipelineNameError) && <Alert sx={{
                        width: '96%',
                        p: '0', // Adjust padding to control the size
                        pl: '4%', height: '23px',
                        borderRadius: '10px',
                        borderTopLeftRadius: '0',
                        borderTopRightRadius: '0',
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center', // Center content vertically
                        '& .MuiAlert-icon': {
                          fontSize: '16px', // Adjust the size of the icon
                          mr: '8px', // Add margin to the right of the icon
                        },
                      }} variant="filled" severity="error" >
                        {pipelineNameError}
                      </Alert>}
                    </Box>
                    <Box mt={1}>
                      <label className="pipeline-lable">Available To</label>
                      <Autocomplete
                        multiple
                        sx={{ marginTop: '8px', backgroundColor: '#fff' }}
                        options={options}
                        size='small'
                        getOptionLabel={(option) => option.label}
                        value={selectedUser}
                        onChange={handleUserChange}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            sx={{ cursor: 'pointer', margin: '5px 10px' }} // Add cursor pointer style
                          >
                            {option.label}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <>
                            <TextField {...params} variant="outlined" error={!!userError}
                              placeholder="Available To" />
                            {(!!userError) && <Alert sx={{
                              width: '96%',
                              p: '0', // Adjust padding to control the size
                              pl: '4%', height: '23px',
                              borderRadius: '10px',
                              borderTopLeftRadius: '0',
                              borderTopRightRadius: '0',
                              fontSize: '15px',
                              display: 'flex',
                              alignItems: 'center', // Center content vertically
                              '& .MuiAlert-icon': {
                                fontSize: '16px', // Adjust the size of the icon
                                mr: '8px', // Add margin to the right of the icon
                              },
                            }} variant="filled" severity="error" >
                              {userError}
                            </Alert>}
                          </>
                        )}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                      />
                    </Box>
                    <Box mt={2}>
                      {/* <InputLabel sx={{ color: 'black' }}>Sort jobs by</InputLabel> */}
                      <label className="pipeline-lable">Sort jobs by</label>
                      <Autocomplete
                        className='select-dropdown'
                        options={optionsort} // The array of options
                        value={selectedSortByJob} // The currently selected value
                        onChange={(event, newValue) => handleSortingByJobs(newValue)} // Handle selection change
                        getOptionLabel={(option) => option.label || ''} // Display label for each option
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            sx={{ cursor: 'pointer', margin: '5px 10px' }} // Add cursor pointer style
                          >
                            {option.label}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <>
                            <TextField
                              {...params}
                              placeholder="Sort By Job"
                              size="small"
                              error={!!sortByJobError}
                              // helperText={sortByJobError}
                              sx={{ width: '100%', marginTop: '8px', backgroundColor: '#fff' }}
                              variant="outlined"
                              InputLabelProps={{ shrink: true }}

                            />
                            {(!!sortByJobError) && <Alert sx={{
                              width: '96%',
                              p: '0', // Adjust padding to control the size
                              pl: '4%', height: '23px',
                              borderRadius: '10px',
                              borderTopLeftRadius: '0',
                              borderTopRightRadius: '0',
                              fontSize: '15px',
                              display: 'flex',
                              alignItems: 'center', // Center content vertically
                              '& .MuiAlert-icon': {
                                fontSize: '16px', // Adjust the size of the icon
                                mr: '8px', // Add margin to the right of the icon
                              },
                            }} variant="filled" severity="error" >
                              {sortByJobError}
                            </Alert>}
                          </>
                        )}
                        isOptionEqualToValue={(option, value) => option.value === value.value} // To handle equality
                        disableClearable={false} // Enable clearing selection
                        clearOnEscape // Clear selection when escape is pressed
                      />
                    </Box>
                    <Box mt={2}>
                      {/* <InputLabel sx={{ color: 'black' }}>Default job template</InputLabel> */}
                      <label className="pipeline-lable">Default job template</label>
                      <Autocomplete
                        options={optiontemp}
                        getOptionLabel={(option) => option.label}
                        value={selectedJobtemp}
                        onChange={(event, newValue) => handleJobtemp(newValue)}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            sx={{ cursor: 'pointer', margin: '5px 10px' }} // Add cursor pointer style
                          >
                            {option.label}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <>
                            <TextField
                              {...params}
                              error={!!templateError}
                              // helperText={templateError}
                              sx={{ backgroundColor: '#fff' }}
                              placeholder="Default job template"
                              variant="outlined"
                              size="small"
                            />
                            {(!!templateError) && <Alert sx={{
                              width: '96%',
                              p: '0', // Adjust padding to control the size
                              pl: '4%', height: '23px',
                              borderRadius: '10px',
                              borderTopLeftRadius: '0',
                              borderTopRightRadius: '0',
                              fontSize: '15px',
                              display: 'flex',
                              alignItems: 'center', // Center content vertically
                              '& .MuiAlert-icon': {
                                fontSize: '16px', // Adjust the size of the icon
                                mr: '8px', // Add margin to the right of the icon
                              },
                            }} variant="filled" severity="error" >
                              {templateError}
                            </Alert>}
                          </>
                        )}
                        sx={{ width: '100%', marginTop: '8px' }}
                        clearOnEscape // Enable clearable functionality
                      />
                    </Box>

                    <Box mt={3}>
                      <Typography variant='h6'>Job card fields</Typography>
                      <Grid container spacing={5} mt={2} >
                        <Grid item xs={4}>
                          <Box mt={2}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={Account_id}
                                  onChange={handleAccount_idChange}
                                  color="primary"

                                />
                              }
                              label={"Account ID"}
                            />
                          </Box>
                          <Box mt={2}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={Days_on_stage}
                                  onChange={handleDays_on_stageChange}
                                  color="primary"
                                />
                              }
                              label={"Days on stage"}
                            />
                          </Box>
                          <Box mt={2}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={Account_tags}
                                  onChange={handleAccount_tagsChange}
                                  color="primary"
                                />
                              }
                              label={"Account tags"}
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={4}>
                          <Box mt={2}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={startDate}
                                  onChange={handleStartDateChange}
                                  color="primary"
                                />
                              }
                              label={"Start date"}
                            />
                          </Box>
                          <Box mt={2}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={Name}
                                  onChange={handleNameSwitchChange}
                                  color="primary"
                                />
                              }
                              label={"Name"}
                            />
                          </Box>
                          <Box mt={2}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={Due_date}
                                  onChange={handleDue_dateChange}
                                  color="primary"
                                />
                              }
                              label={"Due date"}
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={4}>
                          <Box mt={2}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={Description}
                                  onChange={handleDescriptionChange}
                                  color="primary"
                                />
                              }
                              label={"Description"}
                            />
                          </Box>
                          <Box mt={2}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={Assignees}
                                  onChange={handleAssigneesChange}
                                  color="primary"
                                />
                              }
                              label={"Assignees"}
                            />
                          </Box>
                          <Box mt={2}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={Priority}
                                  onChange={handlePriorityChange}
                                  color="primary"
                                />
                              }
                              label={"Priority"}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={0.4} sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Box
                      sx={{
                        borderLeft: '1px solid black',
                        height: '100%',
                        ml: 1.5
                      }}
                    ></Box>
                  </Grid>
                  <Grid xs={12} sm={5.8}>
                    <Typography>Default recurrence setting</Typography>
                  </Grid>

                </Grid>
                <Box mt={5} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                  <Typography variant='h6'>Stages</Typography>
                  <Button
                    variant="contained"
                    startIcon={<LuPlusCircle />}
                    onClick={handleAddStage}

                  >
                    Add stage
                  </Button>
                </Box>
                <Box mt={2}><hr /></Box>
                <Box sx={{ margin: '20px 0 10px 10px' }}>
                  <Box sx={{
                    display: 'flex',
                    gap: '10px',
                    overflowX: 'auto',
                    marginBottom: '10%',
                    flexDirection: isSmallScreen ? 'column' : 'row'
                  }}>
                    {stages.map((stage, index) => (

                      <Paper
                        key={index}
                        sx={{
                          height: 'auto',
                          marginTop: '20px',
                          borderRadius: '10px',
                          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                          width: isSmallScreen ? '90%' : '20%',
                          marginBottom: '20px',
                          marginLeft: isSmallScreen ? '0' : '5px',
                          alignSelf: isSmallScreen ? 'center' : 'flex-start'
                        }}
                      >
                        <Box sx={{ margin: '10px' }}>
                          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <RxDragHandleDots2 />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexGrow: 1 }}>
                              <LuPenLine />
                              <TextField
                                variant="outlined"
                                placeholder="Stage Name"
                                sx={{ flexGrow: 1 }}
                                size='small'
                                margin='normal'
                                value={stage.name} onChange={(e) => handleStageNameChange(e, index)}
                              />
                            </Box>
                            <IconButton onClick={() => handleDeleteStage(index)}>
                              <RiDeleteBin6Line sx={{ color: 'red', cursor: 'pointer' }} />
                            </IconButton>
                          </Box>
                          <Divider />
                          <Box m={2}>
                            <Typography variant="h6" sx={{ fontSize: '15px', fontWeight: 'bold' }}>Stage conditions</Typography>
                            {index === 0 ? (
                              <Typography variant="body2">First stage can't have conditions</Typography>
                            ) : index === stages.length - 1 ? (
                              <Typography variant="body2">Last stage can't have conditions</Typography>
                            ) : (
                              <Typography variant="body2">Job enters this stage if conditions are met</Typography>
                            )}
                            {index > 0 && index !== stages.length - 1 && (
                              <Box sx={{ marginTop: '10px' }}>
                                <Typography variant="body2" sx={{ cursor: 'pointer', color: 'blue', fontWeight: 'bold' }}  >Add conditions</Typography>


                              </Box>
                            )}

                            <Typography variant="h6" sx={{ fontSize: '15px', fontWeight: 'bold', mt: 2 }}>Automations</Typography>
                            <Typography variant="body2">Triggered when job enters stage</Typography>
                            <Typography variant="body2" sx={{ cursor: 'pointer', color: 'blue', fontWeight: 'bold', mt: 2 }} onClick={(e) => handleClick(e, index, "edit")}> {stage.automations.length > 0 ? "Edit automation" : "Add automation"}</Typography>

                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleClose}
                            >
                              <MenuItem
                                onClick={() =>
                                  handleAddAutomation(stageSelected, "Send Email")
                                }
                              >
                                Send Email
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleAddAutomation(stageSelected, "Send Invoice")
                                }
                              >
                                Send Invoice
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleAddAutomation(stageSelected, "Send Proposal/Els")
                                }
                              >
                                Send Proposal/Els
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleAddAutomation(stageSelected, "Create Organizer")
                                }
                              >
                                Create Organizer
                              </MenuItem>
                              {/* Send Proposal/Els */}
                            </Menu>

                            <Drawer
                              anchor="right"
                              open={isDrawerOpen}
                              onClose={handleDrawerClose}
                              PaperProps={{
                                id: "tag-drawer",
                                sx: {
                                  borderRadius: isSmallScreen
                                    ? "0"
                                    : "10px 0 0 10px",
                                  width: isSmallScreen ? "100%" : 500,
                                  maxWidth: "100%",
                                  [theme.breakpoints.down("sm")]: {
                                    width: "100%",
                                  },
                                },
                              }}
                            >
                              {/* {automationSelect} */}
                              <Box>Add Automation</Box>

                              {renderActionContent(automationSelect, index)}
                             
                            
                            </Drawer>
                            <Drawer
                              anchor="right"
                              open={isEditDrawerOpen}
                              onClose={() => setIsEditDrawerOpen(false)}
                              PaperProps={{
                                id: "edit-automation-drawer",
                                sx: {
                                  borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
                                  width: isSmallScreen ? "100%" : 500,
                                  maxWidth: "100%",
                                  [theme.breakpoints.down("sm")]: {
                                    width: "100%",
                                  },
                                },
                              }}
                            >
                              <Box sx={{ padding: "20px" }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                                    Edit Automations
                                  </Typography>
                                  <RxCross2 onClick={() => setIsEditDrawerOpen(false)} style={{ fontSize: '30px', cursor: 'pointer' }} />
                                </Box>


                                <Box >
                                  {selectedAutomationData.length > 0 ? (
                                    selectedAutomationData.map((automation, index) => (
                                      <Box>
                                        <Box
                                          key={index}
                                          sx={{
                                            border: "2px solid #ddd",
                                            borderRadius: "8px",
                                            padding: 2,
                                            marginBottom: 2,
                                          }}
                                        >
                                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography>{index + 1}.{automation.type || "No Type"}</Typography>
                                            <IconButton onClick={() => handleDeleteAutomation(index)}>
                                              <DeleteIcon color="error" />
                                            </IconButton>
                                          </Box>
                                          <Typography variant="body2" sx={{ marginTop: 2 }}>
                                            Select Template
                                          </Typography>
                                          <Autocomplete

                                            options={
                                              automation.type === "Send Email"
                                                ? emailTemplateOptions
                                                : automation.type === "Send Invoice"
                                                  ? invoiceTemplateOptions
                                                  : automation.type === "Create Organizer"
                                                    ? organizerOptions
                                                    : automation.type === "Send Proposal/Els"
                                                      ? proposalElsOptions
                                                      : []
                                            }
                                            getOptionLabel={(option) => option.label}
                                            value={automation.template || null}
                                            onChange={(event, newValue) => handleEditTemplateChange(index, newValue)}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                variant="outlined"
                                                size="small"
                                                placeholder="Select Template"
                                              />
                                            )}
                                          />

                                          {automation.tags && automation.tags.length > 0 && (
                                            <Box sx={{ marginTop: "10px" }}>
                                              <Typography variant="body2">Only For:</Typography>
                                              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                                {automation.tags.map((tag) => (
                                                  <Chip
                                                    key={tag._id}
                                                    label={tag.tagName}
                                                    sx={{
                                                      backgroundColor: tag.tagColour,
                                                      color: "#fff",
                                                      fontWeight: "500",
                                                      borderRadius: "20px",
                                                      marginRight: 1,
                                                    }}
                                                  />
                                                ))}
                                              </Box>
                                            </Box>
                                          )}
                                          <Button
                                            variant="text"
                                            sx={{ marginTop: 2 }}
                                            // onClick={() => handleEditConditions(index)}
                                            onClick={() => {
                                              setSelectedAutomationIndex(index);  // Set the selected index here
                                              handleEditConditions(index);
                                            }}
                                          >
                                            Add Conditions
                                          </Button>
                                        </Box>
                                        <Drawer anchor="right" open={isConditionsEditFormOpen} onClose={handleEditGoBack} PaperProps={{ sx: { width: "550px", padding: 2 } }}>
                                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <IconButton onClick={handleEditGoBack}>
                                              <IoMdArrowRoundBack fontSize="large" color="blue" />
                                            </IconButton>
                                            <Typography variant="h6">Add conditions</Typography>
                                          </Box>

                                          <Box sx={{ padding: 2 }}>
                                            <Typography variant="body1">Apply automation only for accounts with these tags</Typography>
                                            <TextField
                                              fullWidth
                                              size="small"
                                              variant="outlined"
                                              placeholder="Search..."
                                              value={searchTerm}
                                              onChange={handleSearchChange}
                                              InputProps={{
                                                startAdornment: <AiOutlineSearch style={{ marginRight: 8 }} />,
                                              }}
                                              sx={{ marginTop: 2 }}
                                            />

                                            <Box sx={{ marginTop: 2 ,height:'68vh', overflowY:'auto'}}>
                                              {filteredTags.map((tag) => (
                                                <Box
                                                  key={tag._id}
                                                  sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 3,
                                                    borderBottom: "1px solid grey",
                                                    paddingBottom: 1,
                                                  }}
                                                >

                                                  <Checkbox
                                                    // checked={
                                                    //   stageAutomationTags.some((existingTag) => existingTag._id === tag._id) ||
                                                    //   tempSelectedTags.some((selectedTag) => selectedTag._id === tag._id)
                                                    // }
                                                    // onChange={() => handleEditCheckboxChange(tag)}

                                                    checked={selectedAutomationData[index]?.tags.some(
                                                      (existingTag) => existingTag._id === tag._id
                                                    )}
                                                    onChange={() => handleEditCheckboxChange(tag, index)}
                                                  />


                                                  <Chip
                                                    label={tag.tagName}
                                                    sx={{
                                                      backgroundColor: tag.tagColour,
                                                      color: "#fff",
                                                      fontWeight: "500",
                                                      borderRadius: "20px",
                                                      marginRight: 1,
                                                    }}
                                                  />
                                                </Box>
                                              ))}
                                            </Box>

                                            <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                                              <Button variant="contained" color="primary" onClick={() => {
                                                handleEditAddTags();
                                                // Clear the selected tags
                                                setTempSelectedTags([]);
                                              }}>
                                                Add
                                              </Button>
                                              <Button variant="outlined" color="primary" onClick={handleEditGoBack}>
                                                Cancel
                                              </Button>
                                            </Box>
                                          </Box>
                                        </Drawer>
                                      </Box>
                                    ))
                                  ) : (
                                    <Typography variant="body2" sx={{ marginTop: 2 }}>
                                      No automations selected.
                                    </Typography>
                                  )}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                  <Button
                                    variant="text"
                                    sx={{ marginTop: 2 }}
                                    onClick={(e) => handleEditClick(e)}
                                  >
                                    Add Automations
                                  </Button>
                                  <Button
                                    variant="contained"
                                    sx={{ marginTop: 2 }}
                                    onClick={() => handleEditSaveAutomation()}
                                  >
                                    Save Automation
                                  </Button>

                                </Box>
                                <Menu
                                  anchorEl={ehitAnchorEl}
                                  open={Boolean(ehitAnchorEl)}
                                  onClose={handleEditClose}
                                >
                                  <MenuItem onClick={() => handleMenuItemSelect("Send Email")}>Send Email</MenuItem>
                                  <MenuItem onClick={() => handleMenuItemSelect("Send Invoice")}>Send Invoice</MenuItem>
                                  <MenuItem onClick={() => handleMenuItemSelect("Send Proposal/Els")}>Send Proposal/Els</MenuItem>
                                  <MenuItem onClick={() => handleMenuItemSelect("Create Organizer")}>Create Organizer</MenuItem>

                                </Menu>
                              </Box>
                            </Drawer>

                            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
                              {stage.automations.length > 0 && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                                  {stage.automations.map((automation, idx) => (
                                    <Card key={idx} sx={{ width: '100%', }}>
                                      <CardContent>
                                        <Typography variant="h6" component="div">
                                          <b>{idx + 1}.{automation.type}</b>
                                        </Typography>
                                        {automation.template && (
                                          <Typography color="text.secondary">
                                            {automation.template.label}
                                          </Typography>
                                        )}
                                        {/* Display tags with tag color and name */}
                                        {automation.tags && automation.tags.length > 0 && (
                                          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", marginTop: 2 }}>
                                            <Typography variant="body2">Conditions:</Typography>
                                            {automation.tags.map((tag) => (
                                              <Box
                                                key={tag._id}
                                                sx={{
                                                  backgroundColor: tag.tagColour,
                                                  color: "#fff",
                                                  fontSize: "12px",
                                                  fontWeight: "600",
                                                  textAlign: "center",
                                                  padding: "3px 8px",
                                                  borderRadius: "12px",
                                                  marginBottom: "4px",
                                                }}
                                              >
                                                {tag.tagName}
                                              </Box>
                                            ))}
                                          </Box>
                                        )}
                                      </CardContent>
                                    </Card>
                                  ))}
                                </Box>
                              )}
                            </Box>


                            <Typography variant="h6" sx={{ fontSize: '15px', mt: 2, fontWeight: 'bold' }}>Automove</Typography>
                            <Typography variant="body2">Move jobs automatically when linked actions are completed</Typography>





                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                              <Switch
                                onChange={() => handleAutoMoveChange(index)}
                                checked={stage.autoMove}
                                color="primary"
                              />
                              <Typography sx={{ cursor: "pointer" }}>Automove jobs</Typography>
                            </Box>
                          </Box>
                        </Box>

                      </Paper>



                    ))}

                    <Box mt={3}>
                      <Button
                        variant="contained"
                        startIcon={<LuPlusCircle />}
                        onClick={handleAddStage}

                      >
                        Add stage
                      </Button>
                    </Box>

                  </Box>

                </Box>

                <Box sx={{ pt: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Button variant="contained" color="primary" onClick={createPipe}>Save & exit</Button>
                  <Button variant="contained" color="primary" onClick={createSavePipe}>Save</Button>
                  <Button variant="outlined" onClick={handleClosePipelineTemp}>Cancel</Button>
                </Box>
              </Box>
            </form>


          </Box>
        </Box>
      )}
    </Container>
  );
};

export default PipelineTemp;





{/* <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
                              {stage.automations.length > 0 && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                                  {stage.automations.map((automation, idx) => (
                                    <Box>
                                      <Card key={idx} sx={{ width: '100%', }}>
                                        <CardContent>
                                          <Typography variant="h6" component="div">
                                            <b
                                              onClick={() => {
                                                handleUpdateDrawer();
                                                setAutomationEditType(automation.type);
                                                setAutomationSelectEdit(automation.template.label);

                                              }}
                                              style={{ cursor: 'pointer' }}
                                            >
                                              {automation.type}
                                              {console.log("vinayak test ", automation.template.label)}
                                            </b>
                                          </Typography>
                                          {automation.template && (
                                            <Typography color="text.secondary">
                                              {automation.template.label}
                                            </Typography>
                                          )}
                                        
                                          {automation.tags && automation.tags.length > 0 && (
                                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", marginTop: 2 }}>
                                              <Typography variant="body2">Conditions:</Typography>
                                              {automation.tags.map((tag) => (
                                                <Box
                                                  key={tag._id}
                                                  sx={{
                                                    backgroundColor: tag.tagColour,
                                                    color: "#fff",
                                                    fontSize: "12px",
                                                    fontWeight: "600",
                                                    textAlign: "center",
                                                    padding: "3px 8px",
                                                    borderRadius: "12px",
                                                    marginBottom: "4px",
                                                  }}
                                                >
                                                  {tag.tagName}
                                                </Box>
                                              ))}
                                            </Box>
                                          )}
                                        </CardContent>
                                      </Card>

                                    
                                      <Drawer
                                        anchor="right"
                                        open={updateDrawer}
                                        onClose={handleUpdateDrawerClose}
                                        PaperProps={{
                                          id: "tag-drawer",
                                          sx: {
                                            borderRadius: isSmallScreen
                                              ? "0"
                                              : "10px 0 0 10px",
                                            width: isSmallScreen ? "100%" : 500,
                                            maxWidth: "100%",
                                            [theme.breakpoints.down("sm")]: {
                                              width: "100%",
                                            },
                                          },
                                        }}
                                      >
                                        <Typography>Automation Edit</Typography>
                                        {automation.type}


                                        {renderActionContentedit(automationSelectEditType, automationSelectEdit, index)}

                                      </Drawer>
                                    </Box>
                                  ))}
                                </Box>
                              )}
                            </Box> */}