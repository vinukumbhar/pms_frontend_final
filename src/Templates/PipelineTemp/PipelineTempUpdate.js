import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Drawer,
  Checkbox,
  Chip,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Container,
  Paper,
  Autocomplete,
  TextField,
  InputLabel,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuPlusCircle, LuPenLine } from "react-icons/lu";
import { RxDragHandleDots2 } from "react-icons/rx";
import { toast } from "react-toastify";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { RxCross2 } from "react-icons/rx";
const PipelineTempUpdate = () => {
  const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;
  const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const JOBS_API = process.env.REACT_APP_JOBS_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const SORTJOBS_API = process.env.REACT_APP_SORTJOBS_URL;
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_TEMP_URL;
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // sort jobs
  const [sortbyjobs, setSortbyJobs] = useState([]);
  const [selectedSortByJob, setSelectedSortByJob] = useState("");
  const handleSortingByJobs = (selectedOptions) => {
    setSelectedSortByJob(selectedOptions);
  };
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
    label: sort.description,
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
      name: "",
      conditions: [],
      automations: [],
      autoMove: false,
      showDropdown: false,
      activeAction: null,
    };
    setStages([...stages, newStage]);
  };
  const handleStageNameChange = (e, index) => {
    const newStages = [...stages];
    newStages[index].name = e.target.value;
    setStages(newStages);
  };

  const handleDeleteStage = (index) => {
    const updatedStages = [...stages];
    updatedStages.splice(index, 1);
    setStages(updatedStages);
  };

  const handleAutoMoveChange = (index) => {
    const updatedStages = stages.map((stage, idx) =>
      idx === index ? { ...stage, autoMove: !stage.autoMove } : stage
    );
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
  const [selectedJobtemp, setselectedJobTemp] = useState(() => {
    return localStorage.getItem("selectedtemp") || null;
  });
  const handleJobtemp = async (event, selectedtemp) => {
    setselectedJobTemp(selectedtemp);
  };
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
    label: temp.templatename,
  }));

  const [pipelineData, setPipelineData] = useState([]);

  useEffect(() => {
    fetchPipelineData();
  }, []);

  const fetchPipelineData = async () => {
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipelines`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch pipeline data");
      }
      const data = await response.json();
      setPipelineData(data.pipeline);
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
    }
  };

  const [piplineName, setPipeLineName] = useState("");

  //data send
  const updatePipe = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      pipelineName: piplineName,
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
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${id}`;
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        toast.success("Pipeline Updated successfully");
      })
      .catch((error) => {
        toast.error("Failed to Updated pipeline");
      });
  };
  const updateSavePipe = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      pipelineName: piplineName,
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
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${id}`;
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        toast.success("Pipeline Updated successfully");
        // setTimeout(() => navigate("/createpipeline"), 1000);
      })
      .catch((error) => {
        toast.error("Failed to Updated pipeline");
      });
  };

  //get all templateName Record

  useEffect(() => {
    const fetchPipelineData = async () => {
      try {
        const url = `${PIPELINE_API}/workflow/pipeline/pipeline/pipelinelist/${id}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch pipeline data");
        }
        const data = await response.json();
        console.log(data.pipelineTemplate);
        setPipelineData(data.pipelineTemplate);

        setStages(data.pipelineTemplate.stages);
        console.log("janavi",data.pipelineTemplate.stages)

        if (data.pipelineTemplate && data.pipelineTemplate.availableto) {
          const assigneesData = data.pipelineTemplate.availableto.map(
            (assignee) => ({
              value: assignee._id,
              label: assignee.username,
            })
          );
          setSelectedUser(assigneesData);

          const selectedValues = assigneesData.map((option) => option.value);
          setCombinedValues(selectedValues);
        }

        if (data.pipelineTemplate && data.pipelineTemplate.sortjobsby) {
          const sortjobsbyData = {
            value: data.pipelineTemplate.sortjobsby._id,
            label: data.pipelineTemplate.sortjobsby.description,
          };

          setSelectedSortByJob(sortjobsbyData);
        }

        if (data.pipelineTemplate && data.pipelineTemplate.defaultjobtemplate) {
          const defaultjobtemplateData = {
            value: data.pipelineTemplate.defaultjobtemplate._id,
            label: data.pipelineTemplate.defaultjobtemplate.templatename,
          };

          setselectedJobTemp(defaultjobtemplateData);
        }
        setPipeLineName(data.pipelineTemplate.pipelineName);
        setAccount_id(data.pipelineTemplate.accountId);
        setPriority(data.pipelineTemplate.priority);
        setDays_on_stage(data.pipelineTemplate.days_on_Stage);
        setAccount_tags(data.pipelineTemplate.accounttags);
        setName(data.pipelineTemplate.name);
        setDue_date(data.pipelineTemplate.duedate);
        setDescription(data.pipelineTemplate.description);
        setAssignees(data.pipelineTemplate.assignees);
        setStartDate(data.pipelineTemplate.startdate);
      } catch (error) {
        console.error("Error fetching pipeline data:", error);
      }
    };

    fetchPipelineData();
  }, []);

  const handleButtonClick = () => {
    updatePipe();
    navigate("/firmtemp/pipelines");
  };
  // const hanleCloseupdate = ()=>{
  //   navigate("/firmtemp/templates/pipelines")
  // }
  const [isFormFilled, setIsFormFilled] = useState(false);
  const hanleCloseupdate = () => {
    if (isFormFilled) {
      const confirmCancel = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (confirmCancel) {
        navigate("/firmtemp/pipelines");
      }
    } else {
      navigate("/firmtemp/pipelines");
    }
  };
  useEffect(() => {
    // Check if form is filled
    const checkIfFormFilled = () => {
      if (
        piplineName ||
        selectedUser ||
        selectedSortByJob ||
        selectedJobtemp ||
        Account_id ||
        Days_on_stage ||
        Account_tags ||
        startDate ||
        Name ||
        Due_date ||
        Description ||
        Assignees ||
        Priority ||
        stages
      ) {
        setIsFormFilled(true);
      } else {
        setIsFormFilled(false);
      }
    };

    checkIfFormFilled();
  }, [
    piplineName,
    selectedUser,
    selectedSortByJob,
    selectedJobtemp,
    Account_id,
    Days_on_stage,
    Account_tags,
    startDate,
    Name,
    Due_date,
    Description,
    Assignees,
    Priority,
    stages,
  ]);

  //Automation code
  const [anchorEl, setAnchorEl] = useState(null);
  const [ehitAnchorEl, setEditAnchorEl] = useState(null);
  const [stageAutomationTags, setStageAutomationTags] = useState([]);
  const [isConditionsEditFormOpen, setIsConditionsEditFormOpen] =
    useState(false);
  // const handleClick = (event, index) => {
  //   setAnchorEl(event.currentTarget);
  //   SetStageSelected(index);  // Save the selected stage index
  //   console.log(index)
  // };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditClick = (event, index) => {
    setEditAnchorEl(event.currentTarget);
    SetStageSelected(index); // Save the selected stage index
    console.log(index);
  };
  const handleEditConditions = (index) => {
    const currentAutomation = selectedAutomationData[index];
    setStageAutomationTags(currentAutomation.tags || []); // Use existing tags or default to an empty array
    setIsConditionsEditFormOpen(true); // Open the drawer
  };
  const handleDeleteAutomation = (index) => {
    const updatedAutomations = selectedAutomationData.filter(
      (_, i) => i !== index
    );
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
      case "Apply folder template":
        newAutomation = {
          type: "Apply folder template",
          template: null,
          tags: [],
        };
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

  const handleEditTemplateChange = (index, newValue) => {
    const updatedData = [...selectedAutomationData];
    updatedData[index].template = newValue;
    setSelectedAutomationData(updatedData);
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedAutomationData, setSelectedAutomationData] = useState([]);
  const [automationSelect, SetAutomationSelect] = useState();
  const [stageSelected, SetStageSelected] = useState();
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
      if (automations.length > 0) {
        // Only proceed if automations exist
        setSelectedAutomationData(automations); // Populate drawer with automations
        setIsEditDrawerOpen(true); // Open the edit automation drawer
        setAnchorEl(null);
        setEditingStageIndex(index);
      } else {
        console.log("No automations available to edit for this stage.");
      }
    }
    console.log("Stage Index:", index);
  };
  const handleEditCheckboxChange = (tag, index) => {
    // Find the selected automation by index
    const updatedAutomation = [...selectedAutomationData];
    const automation = updatedAutomation[index];

    // Check if the tag is already selected
    const isTagSelected = automation.tags.some(
      (existingTag) => existingTag._id === tag._id
    );

    if (isTagSelected) {
      // Remove the tag if already selected
      automation.tags = automation.tags.filter(
        (existingTag) => existingTag._id !== tag._id
      );
    } else {
      // Add the tag if not selected
      automation.tags.push(tag);
    }

    // Update the state with the modified automation
    setSelectedAutomationData(updatedAutomation);
  };


  const handleSaveTagsAutomation = (index) => {
    return () => {
      const updatedStages = [...stages];
      console.log("Updated Stages before update:", updatedStages);

      const selectedAutomation = {
        type: automationSelect,
        addTags: addTags
          .map((tagId) => {
            const tag = tags.find((t) => t._id === tagId);
            return tag
              ? {
                  _id: tag._id,
                  tagName: tag.tagName,
                  tagColour: tag.tagColour,
                }
              : null;
          })
          .filter(Boolean), // Filter out any null values
        removeTags: removeTags
          .map((tagId) => {
            const tag = tags.find((t) => t._id === tagId);
            return tag
              ? {
                  _id: tag._id,
                  tagName: tag.tagName,
                  tagColour: tag.tagColour,
                }
              : null;
          })
          .filter(Boolean), // Filter out any null values

        // template: selectedtemp ? { label: selectedtemp.label, value: selectedtemp.value } : null,
        tags: selectedTags.map((tag) => ({
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
      // setAddTags([])
      // setRemoveTags([])
      setIsAnyCheckboxChecked(false);
      handleDrawerClose();
    };
  };
  const [selectedAutomationIndex, setSelectedAutomationIndex] = useState(null);

  const handleEditAddTags = () => {
    const updatedTags = [
      ...selectedAutomationData[selectedAutomationIndex].tags, // Only update tags for the selected automation
      ...tempSelectedTags.filter(
        (newTag) =>
          !selectedAutomationData[selectedAutomationIndex].tags.some(
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
  const handleDrawerOpen = (option, index) => {
    setIsDrawerOpen(true);
    SetAutomationSelect(option);
    SetStageSelected(index);
    console.log(index);
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
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
  const [addProposalsandElsTeplates, setAddProposalsandElsTeplates] = useState(
    []
  );
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

  // folder templates
  const API_KEY = process.env.REACT_APP_API_IP;
  const [folderTemplates, setFolderTemplates] = useState([]);

  useEffect(() => {
    fetchFolderData();
  }, []);

  const fetchFolderData = async () => {
    try {
      const url = `${API_KEY}/foldertemp/folder`;
      const response = await fetch(url);
      const data = await response.json();
      setFolderTemplates(data.folderTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const optionfolder = folderTemplates.map((folderTemplates) => ({
    value: folderTemplates._id,
    label: folderTemplates.templatename,
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
  const handleAddConditions = () => {
    setIsConditionsFormOpen(!isConditionsFormOpen);
  };

  const handleGoBack = () => {
    setIsConditionsFormOpen(false);
  };

  const handleCheckboxChange = (tag) => {
    const updatedSelectedTags = tempSelectedTags.includes(tag)
      ? tempSelectedTags.filter((t) => t._id !== tag._id)
      : [...tempSelectedTags, tag];
    setTempSelectedTags(updatedSelectedTags);
    setIsAnyCheckboxChecked(updatedSelectedTags.length > 0);
  };

  const handleAddTags = () => {
    setSelectedTags([
      ...selectedTags,
      ...tempSelectedTags.filter(
        (tag) => !selectedTags.some((t) => t._id === tag._id)
      ),
    ]);
    setIsConditionsFormOpen(false);
    setTempSelectedTags([]);
  };
  const [tags, setTags] = useState([]);
  console.log(selectedTags);
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
  const filteredTags = tags.filter((tag) =>
    tag.tagName.toLowerCase().includes(searchTerm.toLowerCase())
  );
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

  const [addTags, setAddTags] = useState([]); // Separate state for Add Tags
    const [removeTags, setRemoveTags] = useState([]); // Separate state for Remove Tags
  
    const tagsoptions = tags.map((tag) => ({
      value: tag._id,
      label: tag.tagName,
      colour: tag.tagColour,
      customStyle: {
        backgroundColor: tag.tagColour,
        color: "#fff",
        borderRadius: "8px",
        alignItems: "center",
        textAlign: "center",
        marginBottom: "5px",
        padding: "2px,8px",
        fontSize: "10px",
        width: `${calculateWidth(tag.tagName)}px`,
        margin: "7px",
        cursor: "pointer",
      },
      customTagStyle: {
        backgroundColor: tag.tagColour,
        color: "#fff",
        alignItems: "center",
        textAlign: "center",
        padding: "2px,8px",
        fontSize: "10px",
        cursor: "pointer",
      },
    }));
  
    const handleAddTagChange = (event, newValue) => {
      setAddTags(newValue.map((option) => option.value));
      console.log(
        "Selected Add Tags:",
        newValue.map((option) => option.value)
      );
    };
  
    const handleRemoveTagChange = (event, newValue) => {
      setRemoveTags(newValue.map((option) => option.value));
      console.log(
        "Selected Remove Tags:",
        newValue.map((option) => option.value)
      );
    };
  
    const handleSave = () => {
      console.log("Saved Data:");
      console.log("Add Tags:", addTags);
      console.log("Remove Tags:", removeTags);
    };
  
    const filteredAddTagsOptions = tagsoptions.filter(
      (option) => !removeTags.includes(option.value)
    );
  
    const filteredRemoveTagsOptions = tagsoptions.filter(
      (option) => !addTags.includes(option.value)
    );
  
  // Function to render content based on action
  const renderActionContent = (automationSelect, index) => {
    switch (automationSelect) {
      case "Send Invoice":
        return (
          <>
            <Grid item ml={2}>
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
              <Button variant="text" onClick={handleAddConditions}>
                Add Conditions
              </Button>

              <Button variant="contained" onClick={handleSaveAutomation(index)}>
                Save Automation
              </Button>
            </Grid>
            <Drawer
              anchor="right"
              open={isConditionsFormOpen}
              onClose={handleGoBack}
              PaperProps={{ sx: { width: "550px", padding: 2 } }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                  <IoMdArrowRoundBack fontSize="large" color="blue" />
                </IconButton>
                <Typography variant="h6">Add conditions</Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">
                  Apply automation only for accounts with these tags
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <AiOutlineSearch style={{ marginRight: 8 }} />
                    ),
                  }}
                  sx={{ marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
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
                        checked={tempSelectedTags.includes(tag)}
                        onChange={() => handleCheckboxChange(tag)}
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
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isAnyCheckboxChecked}
                    onClick={handleAddTags}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleGoBack}
                  >
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
            <Grid item>
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
              <Button variant="text" onClick={handleAddConditions}>
                Add Conditions
              </Button>
            </Grid>
            <Button variant="contained" onClick={handleSaveAutomation(index)}>
              Save Automation
            </Button>

            <Drawer
              anchor="right"
              open={isConditionsFormOpen}
              onClose={handleGoBack}
              PaperProps={{ sx: { width: "550px", padding: 2 } }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                  <IoMdArrowRoundBack fontSize="large" color="blue" />
                </IconButton>
                <Typography variant="h6">Add conditions</Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">
                  Apply automation only for accounts with these tags
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <AiOutlineSearch style={{ marginRight: 8 }} />
                    ),
                  }}
                  sx={{ marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
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
                        checked={tempSelectedTags.includes(tag)}
                        onChange={() => handleCheckboxChange(tag)}
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
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isAnyCheckboxChecked}
                    onClick={handleAddTags}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleGoBack}
                  >
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
              <Grid item>
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
                <Button variant="text" onClick={handleAddConditions}>
                  Add Conditions
                </Button>
              </Grid>
              <Button
                variant="contained"
                onClick={handleSaveAutomation(stageSelected)}
              >
                Save Automation
              </Button>
            </Box>
            {/* Condition tags for automation */}
            <Drawer
              anchor="right"
              open={isConditionsFormOpen}
              onClose={handleGoBack}
              PaperProps={{ sx: { width: "550px", padding: 2 } }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                  <IoMdArrowRoundBack fontSize="large" color="blue" />
                </IconButton>
                <Typography variant="h6">Add conditions</Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">
                  Apply automation only for accounts with these tags
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <AiOutlineSearch style={{ marginRight: 8 }} />
                    ),
                  }}
                  sx={{ marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
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
                        checked={tempSelectedTags.includes(tag)}
                        onChange={() => handleCheckboxChange(tag)}
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
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isAnyCheckboxChecked}
                    onClick={handleAddTags}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleGoBack}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Drawer>
          </>
        );
      case "Apply folder template":
        return (
          <>
            <Box p={2}>
              <Grid item>
                {automationSelect}
                <Typography mb={1}>Select template</Typography>
                <Autocomplete
                  options={optionfolder}
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
                <Button variant="text" onClick={handleAddConditions}>
                  Add Conditions
                </Button>
              </Grid>
              <Button
                variant="contained"
                onClick={handleSaveAutomation(stageSelected)}
              >
                Save Automation
              </Button>
            </Box>
            {/* Condition tags for automation */}
            <Drawer
              anchor="right"
              open={isConditionsFormOpen}
              onClose={handleGoBack}
              PaperProps={{ sx: { width: "550px", padding: 2 } }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                  <IoMdArrowRoundBack fontSize="large" color="blue" />
                </IconButton>
                <Typography variant="h6">Add conditions</Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">
                  Apply automation only for accounts with these tags
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <AiOutlineSearch style={{ marginRight: 8 }} />
                    ),
                  }}
                  sx={{ marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
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
                        checked={tempSelectedTags.includes(tag)}
                        onChange={() => handleCheckboxChange(tag)}
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
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isAnyCheckboxChecked}
                    onClick={handleAddTags}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleGoBack}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Drawer>
          </>
        );
      
        case "Update account tags":
          return (
            <>
              <Box p={2}>
                {automationSelect}
                <Grid item>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Box mt={2}>
                      <label className="task-input-label">Add Tags</label>
                      <Autocomplete
                        multiple
                        size="small"
                        id="tags-add-outlined"
                        options={filteredAddTagsOptions}
                        getOptionLabel={(option) => option.label}
                        value={tagsoptions.filter((option) =>
                          addTags.includes(option.value)
                        )}
                        onChange={handleAddTagChange}
                        renderTags={(selected, getTagProps) =>
                          selected.map((option, index) => (
                            <Chip
                              key={option.value}
                              label={option.label}
                              style={option.customTagStyle}
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Tags"
                            sx={{
                              width: "100%",
                              marginTop: "8px",
                              backgroundColor: "#fff",
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            style={option.customStyle}
                          >
                            {option.label}
                          </Box>
                        )}
                      />
                    </Box>
  
                    <Box mt={2}>
                      <label className="task-input-label">Remove Tags</label>
                      <Autocomplete
                        multiple
                        size="small"
                        id="tags-remove-outlined"
                        options={filteredRemoveTagsOptions}
                        getOptionLabel={(option) => option.label}
                        value={tagsoptions.filter((option) =>
                          removeTags.includes(option.value)
                        )}
                        onChange={handleRemoveTagChange}
                        renderTags={(selected, getTagProps) =>
                          selected.map((option, index) => (
                            <Chip
                              key={option.value}
                              label={option.label}
                              style={option.customTagStyle}
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Tags"
                            sx={{
                              width: "100%",
                              marginTop: "8px",
                              backgroundColor: "#fff",
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            style={option.customStyle}
                          >
                            {option.label}
                          </Box>
                        )}
                      />
                    </Box>
                  </Box>
  
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                  <Button variant="text" onClick={handleAddConditions}>
                    Add Conditions
                  </Button>
                </Grid>
                <Button
                  variant="contained"
                  onClick={handleSaveTagsAutomation(stageSelected)}
                >
                  Save Automation
                </Button>
              </Box>
              {/* Condition tags for automation */}
              <Drawer
                anchor="right"
                open={isConditionsFormOpen}
                onClose={handleGoBack}
                PaperProps={{ sx: { width: "550px", padding: 2 } }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton onClick={handleGoBack}>
                    <IoMdArrowRoundBack fontSize="large" color="blue" />
                  </IconButton>
                  <Typography variant="h6">Add conditions</Typography>
                </Box>
  
                <Box sx={{ padding: 2 }}>
                  <Typography variant="body1">
                    Apply automation only for accounts with these tags
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <AiOutlineSearch style={{ marginRight: 8 }} />
                      ),
                    }}
                    sx={{ marginTop: 2 }}
                  />
  
                  <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
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
                          checked={tempSelectedTags.includes(tag)}
                          onChange={() => handleCheckboxChange(tag)}
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
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!isAnyCheckboxChecked}
                      onClick={handleAddTags}
                    >
                      Add
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleGoBack}
                    >
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
              <Grid item>
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
                <Button variant="text" onClick={handleAddConditions}>
                  Add Conditions
                </Button>
              </Grid>
              <Button
                variant="contained"
                onClick={handleSaveAutomation(stageSelected)}
              >
                Save Automation
              </Button>
            </Box>
            {/* Condition tags for automation */}
            <Drawer
              anchor="right"
              open={isConditionsFormOpen}
              onClose={handleGoBack}
              PaperProps={{ sx: { width: "550px", padding: 2 } }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                  <IoMdArrowRoundBack fontSize="large" color="blue" />
                </IconButton>
                <Typography variant="h6">Add conditions</Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">
                  Apply automation only for accounts with these tags
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <AiOutlineSearch style={{ marginRight: 8 }} />
                    ),
                  }}
                  sx={{ marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
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
                        checked={tempSelectedTags.includes(tag)}
                        onChange={() => handleCheckboxChange(tag)}
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
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isAnyCheckboxChecked}
                    onClick={handleAddTags}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleGoBack}
                  >
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
  // const handleSaveAutomation = (index) => {
  //   return () => {
  //     const updatedStages = [...stages];
  //     console.log(updatedStages)
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
        template: selectedtemp
          ? { label: selectedtemp.label, value: selectedtemp.value }
          : null,
        tags: selectedTags.map((tag) => ({
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

  return (
    <Container>
      <Box sx={{ mt: 2 }}></Box>

      <Box
        sx={{
          mt: 2,
        }}
      >
        <Box>
          <form>
            <Box>
              <Typography variant="h5" gutterBottom>
                {" "}
                Edit Pipelines
              </Typography>
              <Box mt={2} mb={2}>
                <hr />
              </Box>
              <Grid container spacing={2}>
                <Grid xs={12} sm={5.8}>
                  <Box>
                    <InputLabel sx={{ color: "black" }}>
                      Pipeline Name
                    </InputLabel>

                    <TextField
                      size="small"
                      margin="normal"
                      placeholder="Pipeline Name"
                      fullWidth
                      value={piplineName}
                      onChange={(e) => setPipeLineName(e.target.value)}
                    />
                  </Box>
                  <Box mt={1}>
                    <InputLabel sx={{ color: "black" }}>
                      Available To
                    </InputLabel>
                    <Autocomplete
                      multiple
                      sx={{ marginTop: "8px" }}
                      options={options}
                      size="small"
                      getOptionLabel={(option) => option.label}
                      value={selectedUser}
                      onChange={handleUserChange}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          {...props}
                          sx={{ cursor: "pointer", margin: "5px 10px" }}
                        >
                          {option.label}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Available To"
                        />
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                    />
                  </Box>
                  <Box mt={2}>
                    <InputLabel sx={{ color: "black" }}>
                      Sort jobs by
                    </InputLabel>

                    <Autocomplete
                      className="select-dropdown"
                      options={optionsort}
                      value={selectedSortByJob}
                      onChange={(event, newValue) =>
                        handleSortingByJobs(newValue)
                      }
                      getOptionLabel={(option) => option.label || ""}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          {...props}
                          sx={{ cursor: "pointer", margin: "5px 10px" }}
                        >
                          {option.label}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Sort By Job"
                          size="small"
                          sx={{ width: "100%", marginTop: "8px" }}
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      disableClearable={false}
                      clearOnEscape
                    />
                  </Box>

                  <Box mt={2}>
                    <InputLabel sx={{ color: "black" }}>
                      Default job template
                    </InputLabel>

                    <Autocomplete
                      className="select-dropdown"
                      options={optiontemp}
                      value={selectedJobtemp}
                      onChange={handleJobtemp}
                      getOptionLabel={(option) => option.label || ""}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          {...props}
                          sx={{ cursor: "pointer", margin: "5px 10px" }}
                        >
                          {option.label}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Default job template"
                          size="small"
                          sx={{ width: "100%", marginTop: "8px" }}
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      disableClearable={false}
                      clearOnEscape
                    />
                  </Box>

                  <Box mt={3}>
                    <Typography variant="h6">Job card fields</Typography>
                    <Grid container spacing={5} mt={2}>
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
                <Grid
                  item
                  xs={12}
                  sm={0.4}
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  <Box
                    sx={{
                      borderLeft: "1px solid black",
                      height: "100%",
                      ml: 1.5,
                    }}
                  ></Box>
                </Grid>
                <Grid xs={12} sm={5.8}>
                  <Typography>Default recurrence setting</Typography>
                </Grid>
              </Grid>
              <Box
                mt={5}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography variant="h6">Stages</Typography>
                <Button
                  variant="contained"
                  startIcon={<LuPlusCircle />}
                  onClick={handleAddStage}
                >
                  Add stage
                </Button>
              </Box>
              <Box mt={2}>
                <hr />
              </Box>
              <Box sx={{ margin: "20px 0 10px 10px" }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    overflowX: "auto",
                    marginBottom: "10%",
                    flexDirection: isSmallScreen ? "column" : "row",
                  }}
                >
                 {stages.map((stage, index) => (
                      <Paper
                        key={index}
                        sx={{
                          height: "auto",
                          marginTop: "20px",
                          borderRadius: "10px",
                          boxShadow:
                            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                          width: isSmallScreen ? "90%" : "20%",
                          marginBottom: "20px",
                          marginLeft: isSmallScreen ? "0" : "5px",
                          alignSelf: isSmallScreen ? "center" : "flex-start",
                        }}
                      >
                        <Box sx={{ margin: "10px" }}>
                          <Box
                            sx={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "center",
                            }}
                          >
                            <RxDragHandleDots2 />
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                flexGrow: 1,
                              }}
                            >
                              <LuPenLine />
                              <TextField
                                variant="outlined"
                                placeholder="Stage Name"
                                sx={{ flexGrow: 1 }}
                                size="small"
                                margin="normal"
                                value={stage.name}
                                onChange={(e) =>
                                  handleStageNameChange(e, index)
                                }
                              />
                            </Box>
                            <IconButton
                              onClick={() => handleDeleteStage(index)}
                            >
                              <RiDeleteBin6Line
                                sx={{ color: "red", cursor: "pointer" }}
                              />
                            </IconButton>
                          </Box>
                          <Divider />
                          <Box m={2}>
                            <Typography
                              variant="h6"
                              sx={{ fontSize: "15px", fontWeight: "bold" }}
                            >
                              Stage conditions
                            </Typography>
                            {index === 0 ? (
                              <Typography variant="body2">
                                First stage can't have conditions
                              </Typography>
                            ) : index === stages.length - 1 ? (
                              <Typography variant="body2">
                                Last stage can't have conditions
                              </Typography>
                            ) : (
                              <Typography variant="body2">
                                Job enters this stage if conditions are met
                              </Typography>
                            )}
                            {index > 0 && index !== stages.length - 1 && (
                              <Box sx={{ marginTop: "10px" }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    cursor: "pointer",
                                    color: "blue",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Add conditions
                                </Typography>
                              </Box>
                            )}

                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: "15px",
                                fontWeight: "bold",
                                mt: 2,
                              }}
                            >
                              Automations
                            </Typography>
                            <Typography variant="body2">
                              Triggered when job enters stage
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                cursor: "pointer",
                                color: "blue",
                                fontWeight: "bold",
                                mt: 2,
                              }}
                              onClick={(e) => handleClick(e, index, "edit")}
                            >
                              {" "}
                              {stage.automations.length > 0
                                ? "Edit automation"
                                : "Add automation"}
                            </Typography>

                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleClose}
                            >
                              <MenuItem
                                onClick={() =>
                                  handleAddAutomation(
                                    stageSelected,
                                    "Send Email"
                                  )
                                }
                              >
                                Send Email
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleAddAutomation(
                                    stageSelected,
                                    "Send Invoice"
                                  )
                                }
                              >
                                Send Invoice
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleAddAutomation(
                                    stageSelected,
                                    "Send Proposal/Els"
                                  )
                                }
                              >
                                Send Proposal/Els
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleAddAutomation(
                                    stageSelected,
                                    "Create Organizer"
                                  )
                                }
                              >
                                Create Organizer
                              </MenuItem>
                              {/* <MenuItem
                                onClick={() =>
                                  handleAddAutomation(
                                    stageSelected,
                                    "Update account tags"
                                  )
                                }
                              >
                                Update account tags
                              </MenuItem> */}
                              {/* Send Proposal/Els */}
                              {/*  Apply folder template */}
                              <MenuItem
                                onClick={() =>
                                  handleAddAutomation(
                                    stageSelected,
                                    "Apply folder template"
                                  )
                                }
                              >
                                Apply folder template
                              </MenuItem>
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
                              <Box sx={{ padding: "20px" }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    mb: 2,
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    sx={{ fontWeight: "bold", mb: 2 }}
                                  >
                                    Edit Automations
                                  </Typography>
                                  <RxCross2
                                    onClick={() => setIsEditDrawerOpen(false)}
                                    style={{
                                      fontSize: "30px",
                                      cursor: "pointer",
                                    }}
                                  />
                                </Box>

                                <Box>
                                 

                                  {selectedAutomationData.length > 0 ? (
                                    selectedAutomationData.map(
                                      (automation, index) => {
                                        return (
                                          <Box key={index}>
                                            <Box
                                              sx={{
                                                border: "2px solid #ddd",
                                                borderRadius: "8px",
                                                padding: 2,
                                                marginBottom: 2,
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  justifyContent:
                                                    "space-between",
                                                }}
                                              >
                                                <Typography>
                                                  {index + 1}.{" "}
                                                  {automation.type || "No Type"}
                                                </Typography>
                                                <IconButton
                                                  onClick={() =>
                                                    handleDeleteAutomation(
                                                      index
                                                    )
                                                  }
                                                >
                                                  <DeleteIcon color="error" />
                                                </IconButton>
                                              </Box>

                                              {automation.type ===
                                              "Update account tags" ? (
                                                <>
                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      gap: 5,
                                                    }}
                                                  >
                                                    <Box mt={2}>
                                                      <label className="task-input-label">
                                                        Add Tags
                                                      </label>
                                                      <Autocomplete
                                                        multiple
                                                        size="small"
                                                        id={`tags-add-outlined-${index}`}
                                                        options={
                                                          filteredAddTagsOptions
                                                        }
                                                        getOptionLabel={(
                                                          option
                                                        ) => option.label}
                                                        value={tagsoptions.filter(
                                                          (option) =>
                                                            addTags.includes(
                                                              option.value
                                                            )
                                                        )}
                                                        onChange={(
                                                          event,
                                                          newValue
                                                        ) =>
                                                          handleAddTagChange(
                                                            event,
                                                            newValue,
                                                            index
                                                          )
                                                        }
                                                        renderTags={(
                                                          selected,
                                                          getTagProps
                                                        ) =>
                                                          selected.map(
                                                            (option, idx) => (
                                                              <Chip
                                                                key={
                                                                  option.value
                                                                }
                                                                label={
                                                                  option.label
                                                                }
                                                                style={
                                                                  option.customTagStyle
                                                                }
                                                                {...getTagProps(
                                                                  { index: idx }
                                                                )}
                                                              />
                                                            )
                                                          )
                                                        }
                                                        renderInput={(
                                                          params
                                                        ) => (
                                                          <TextField
                                                            {...params}
                                                            variant="outlined"
                                                            placeholder="Tags"
                                                            sx={{
                                                              width: "100%",
                                                              marginTop: "8px",
                                                              backgroundColor:
                                                                "#fff",
                                                            }}
                                                          />
                                                        )}
                                                      />
                                                    </Box>

                                                    <Box mt={2}>
                                                      <label className="task-input-label">
                                                        Remove Tags
                                                      </label>
                                                      <Autocomplete
                                                        multiple
                                                        size="small"
                                                        id={`tags-remove-outlined-${index}`}
                                                        options={
                                                          filteredRemoveTagsOptions
                                                        }
                                                        getOptionLabel={(
                                                          option
                                                        ) => option.label}
                                                        value={tagsoptions.filter(
                                                          (option) =>
                                                            removeTags.includes(
                                                              option.value
                                                            )
                                                        )}
                                                        onChange={(
                                                          event,
                                                          newValue
                                                        ) =>
                                                          handleRemoveTagChange(
                                                            event,
                                                            newValue,
                                                            index
                                                          )
                                                        }
                                                        renderTags={(
                                                          selected,
                                                          getTagProps
                                                        ) =>
                                                          selected.map(
                                                            (option, idx) => (
                                                              <Chip
                                                                key={
                                                                  option.value
                                                                }
                                                                label={
                                                                  option.label
                                                                }
                                                                style={
                                                                  option.customTagStyle
                                                                }
                                                                {...getTagProps(
                                                                  { index: idx }
                                                                )}
                                                              />
                                                            )
                                                          )
                                                        }
                                                        renderInput={(
                                                          params
                                                        ) => (
                                                          <TextField
                                                            {...params}
                                                            variant="outlined"
                                                            placeholder="Tags"
                                                            sx={{
                                                              width: "100%",
                                                              marginTop: "8px",
                                                              backgroundColor:
                                                                "#fff",
                                                            }}
                                                          />
                                                        )}
                                                      />
                                                    </Box>
                                                  </Box>
                                                  {automation.tags &&
                                                    automation.tags.length >
                                                      0 && (
                                                      <Box
                                                        sx={{
                                                          marginTop: "10px",
                                                        }}
                                                      >
                                                        <Typography variant="body2">
                                                          Only For:
                                                        </Typography>
                                                        <Box
                                                          sx={{
                                                            display: "flex",
                                                            gap: 1,
                                                            flexWrap: "wrap",
                                                          }}
                                                        >
                                                          {automation.tags.map(
                                                            (tag) => (
                                                              <Chip
                                                                key={tag._id}
                                                                label={
                                                                  tag.tagName
                                                                }
                                                                sx={{
                                                                  backgroundColor:
                                                                    tag.tagColour,
                                                                  color: "#fff",
                                                                  fontWeight:
                                                                    "500",
                                                                  borderRadius:
                                                                    "20px",
                                                                  marginRight: 1,
                                                                }}
                                                              />
                                                            )
                                                          )}
                                                        </Box>
                                                      </Box>
                                                    )}
                                                  <Button
                                                    variant="text"
                                                    sx={{ marginTop: 2 }}
                                                    // onClick={() => handleEditConditions(index)}
                                                    onClick={() => {
                                                      setSelectedAutomationIndex(
                                                        index
                                                      ); // Set the selected index here
                                                      handleEditConditions(
                                                        index
                                                      );
                                                    }}
                                                  >
                                                    Add Conditions
                                                  </Button>
                                                  <Box>
                                                    <Drawer
                                                      anchor="right"
                                                      open={
                                                        isConditionsEditFormOpen
                                                      }
                                                      onClose={handleEditGoBack}
                                                      PaperProps={{
                                                        sx: {
                                                          width: "550px",
                                                          padding: 2,
                                                        },
                                                      }}
                                                    >
                                                      <Box
                                                        sx={{
                                                          display: "flex",
                                                          alignItems: "center",
                                                          gap: 1,
                                                        }}
                                                      >
                                                        <IconButton
                                                          onClick={
                                                            handleEditGoBack
                                                          }
                                                        >
                                                          <IoMdArrowRoundBack
                                                            fontSize="large"
                                                            color="blue"
                                                          />
                                                        </IconButton>
                                                        <Typography variant="h6">
                                                          Add conditions
                                                        </Typography>
                                                      </Box>

                                                      <Box sx={{ padding: 2 }}>
                                                        <Typography variant="body1">
                                                          Apply automation only
                                                          for accounts with
                                                          these tags
                                                        </Typography>
                                                        <TextField
                                                          fullWidth
                                                          size="small"
                                                          variant="outlined"
                                                          placeholder="Search..."
                                                          value={searchTerm}
                                                          onChange={
                                                            handleSearchChange
                                                          }
                                                          InputProps={{
                                                            startAdornment: (
                                                              <AiOutlineSearch
                                                                style={{
                                                                  marginRight: 8,
                                                                }}
                                                              />
                                                            ),
                                                          }}
                                                          sx={{ marginTop: 2 }}
                                                        />

                                                        <Box
                                                          sx={{
                                                            marginTop: 2,
                                                            height: "68vh",
                                                            overflowY: "auto",
                                                          }}
                                                        >
                                                          {filteredTags.map(
                                                            (tag) => (
                                                              <Box
                                                                key={tag._id}
                                                                sx={{
                                                                  display:
                                                                    "flex",
                                                                  alignItems:
                                                                    "center",
                                                                  gap: 3,
                                                                  borderBottom:
                                                                    "1px solid grey",
                                                                  paddingBottom: 1,
                                                                }}
                                                              >
                                                                <Checkbox
                                                                  // checked={
                                                                  //   stageAutomationTags.some((existingTag) => existingTag._id === tag._id) ||
                                                                  //   tempSelectedTags.some((selectedTag) => selectedTag._id === tag._id)
                                                                  // }
                                                                  // onChange={() => handleEditCheckboxChange(tag)}

                                                                  checked={selectedAutomationData[
                                                                    index
                                                                  ]?.tags.some(
                                                                    (
                                                                      existingTag
                                                                    ) =>
                                                                      existingTag._id ===
                                                                      tag._id
                                                                  )}
                                                                  onChange={() =>
                                                                    handleEditCheckboxChange(
                                                                      tag,
                                                                      index
                                                                    )
                                                                  }
                                                                />

                                                                <Chip
                                                                  label={
                                                                    tag.tagName
                                                                  }
                                                                  sx={{
                                                                    backgroundColor:
                                                                      tag.tagColour,
                                                                    color:
                                                                      "#fff",
                                                                    fontWeight:
                                                                      "500",
                                                                    borderRadius:
                                                                      "20px",
                                                                    marginRight: 1,
                                                                  }}
                                                                />
                                                              </Box>
                                                            )
                                                          )}
                                                        </Box>

                                                        <Box
                                                          sx={{
                                                            display: "flex",
                                                            gap: 2,
                                                            marginTop: 2,
                                                          }}
                                                        >
                                                          <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => {
                                                              handleEditAddTags();
                                                              // Clear the selected tags
                                                              setTempSelectedTags(
                                                                []
                                                              );
                                                            }}
                                                          >
                                                            Add
                                                          </Button>
                                                          <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={
                                                              handleEditGoBack
                                                            }
                                                          >
                                                            Cancel
                                                          </Button>
                                                        </Box>
                                                      </Box>
                                                    </Drawer>
                                                  </Box>
                                                </>
                                              ) : (
                                                <>
                                                  <Typography
                                                    variant="body2"
                                                    sx={{ marginTop: 2 }}
                                                  >
                                                    Select Template
                                                  </Typography>
                                                  <Autocomplete
                                                    options={
                                                      automation.type ===
                                                      "Send Email"
                                                        ? emailTemplateOptions
                                                        : automation.type ===
                                                            "Send Invoice"
                                                          ? invoiceTemplateOptions
                                                          : automation.type ===
                                                              "Create Organizer"
                                                            ? organizerOptions
                                                            : automation.type ===
                                                                "Send Proposal/Els"
                                                              ? proposalElsOptions
                                                              
                                                              : automation.type ===
                                                              "Apply folder template"
                                                            ? optionfolder
                                                            :
                                                               [] 
                                                    }
                                                    getOptionLabel={(option) =>
                                                      option.label
                                                    }
                                                    value={
                                                      automation.template ||
                                                      null
                                                    }
                                                    onChange={(
                                                      event,
                                                      newValue
                                                    ) =>
                                                      handleEditTemplateChange(
                                                        index,
                                                        newValue
                                                      )
                                                    }
                                                    renderInput={(params) => (
                                                      <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        size="small"
                                                        placeholder="Select Template"
                                                      />
                                                    )}
                                                  />
                                                  {automation.tags &&
                                                    automation.tags.length >
                                                      0 && (
                                                      <Box
                                                        sx={{
                                                          marginTop: "10px",
                                                        }}
                                                      >
                                                        <Typography variant="body2">
                                                          Only For:
                                                        </Typography>
                                                        <Box
                                                          sx={{
                                                            display: "flex",
                                                            gap: 1,
                                                            flexWrap: "wrap",
                                                          }}
                                                        >
                                                          {automation.tags.map(
                                                            (tag) => (
                                                              <Chip
                                                                key={tag._id}
                                                                label={
                                                                  tag.tagName
                                                                }
                                                                sx={{
                                                                  backgroundColor:
                                                                    tag.tagColour,
                                                                  color: "#fff",
                                                                  fontWeight:
                                                                    "500",
                                                                  borderRadius:
                                                                    "20px",
                                                                  marginRight: 1,
                                                                }}
                                                              />
                                                            )
                                                          )}
                                                        </Box>
                                                      </Box>
                                                    )}
                                                  <Button
                                                    variant="text"
                                                    sx={{ marginTop: 2 }}
                                                    // onClick={() => handleEditConditions(index)}
                                                    onClick={() => {
                                                      setSelectedAutomationIndex(
                                                        index
                                                      ); // Set the selected index here
                                                      handleEditConditions(
                                                        index
                                                      );
                                                    }}
                                                  >
                                                    Add Conditions
                                                  </Button>
                                                  <Box>
                                                    <Drawer
                                                      anchor="right"
                                                      open={
                                                        isConditionsEditFormOpen
                                                      }
                                                      onClose={handleEditGoBack}
                                                      PaperProps={{
                                                        sx: {
                                                          width: "550px",
                                                          padding: 2,
                                                        },
                                                      }}
                                                    >
                                                      <Box
                                                        sx={{
                                                          display: "flex",
                                                          alignItems: "center",
                                                          gap: 1,
                                                        }}
                                                      >
                                                        <IconButton
                                                          onClick={
                                                            handleEditGoBack
                                                          }
                                                        >
                                                          <IoMdArrowRoundBack
                                                            fontSize="large"
                                                            color="blue"
                                                          />
                                                        </IconButton>
                                                        <Typography variant="h6">
                                                          Add conditions
                                                        </Typography>
                                                      </Box>

                                                      <Box sx={{ padding: 2 }}>
                                                        <Typography variant="body1">
                                                          Apply automation only
                                                          for accounts with
                                                          these tags
                                                        </Typography>
                                                        <TextField
                                                          fullWidth
                                                          size="small"
                                                          variant="outlined"
                                                          placeholder="Search..."
                                                          value={searchTerm}
                                                          onChange={
                                                            handleSearchChange
                                                          }
                                                          InputProps={{
                                                            startAdornment: (
                                                              <AiOutlineSearch
                                                                style={{
                                                                  marginRight: 8,
                                                                }}
                                                              />
                                                            ),
                                                          }}
                                                          sx={{ marginTop: 2 }}
                                                        />

                                                        <Box
                                                          sx={{
                                                            marginTop: 2,
                                                            height: "68vh",
                                                            overflowY: "auto",
                                                          }}
                                                        >
                                                          {filteredTags.map(
                                                            (tag) => (
                                                              <Box
                                                                key={tag._id}
                                                                sx={{
                                                                  display:
                                                                    "flex",
                                                                  alignItems:
                                                                    "center",
                                                                  gap: 3,
                                                                  borderBottom:
                                                                    "1px solid grey",
                                                                  paddingBottom: 1,
                                                                }}
                                                              >
                                                                <Checkbox
                                                                  // checked={
                                                                  //   stageAutomationTags.some((existingTag) => existingTag._id === tag._id) ||
                                                                  //   tempSelectedTags.some((selectedTag) => selectedTag._id === tag._id)
                                                                  // }
                                                                  // onChange={() => handleEditCheckboxChange(tag)}

                                                                  checked={selectedAutomationData[
                                                                    index
                                                                  ]?.tags.some(
                                                                    (
                                                                      existingTag
                                                                    ) =>
                                                                      existingTag._id ===
                                                                      tag._id
                                                                  )}
                                                                  onChange={() =>
                                                                    handleEditCheckboxChange(
                                                                      tag,
                                                                      index
                                                                    )
                                                                  }
                                                                />

                                                                <Chip
                                                                  label={
                                                                    tag.tagName
                                                                  }
                                                                  sx={{
                                                                    backgroundColor:
                                                                      tag.tagColour,
                                                                    color:
                                                                      "#fff",
                                                                    fontWeight:
                                                                      "500",
                                                                    borderRadius:
                                                                      "20px",
                                                                    marginRight: 1,
                                                                  }}
                                                                />
                                                              </Box>
                                                            )
                                                          )}
                                                        </Box>

                                                        <Box
                                                          sx={{
                                                            display: "flex",
                                                            gap: 2,
                                                            marginTop: 2,
                                                          }}
                                                        >
                                                          <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => {
                                                              handleEditAddTags();
                                                              // Clear the selected tags
                                                              setTempSelectedTags(
                                                                []
                                                              );
                                                            }}
                                                          >
                                                            Add
                                                          </Button>
                                                          <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={
                                                              handleEditGoBack
                                                            }
                                                          >
                                                            Cancel
                                                          </Button>
                                                        </Box>
                                                      </Box>
                                                    </Drawer>
                                                  </Box>
                                                </>
                                              )}
                                            </Box>
                                          </Box>
                                        );
                                      }
                                    )
                                  ) : (
                                    <Typography
                                      variant="body2"
                                      sx={{ marginTop: 2 }}
                                    >
                                      No automations selected.
                                    </Typography>
                                  )}
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 3,
                                  }}
                                >
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
                                  <MenuItem
                                    onClick={() =>
                                      handleMenuItemSelect("Send Email")
                                    }
                                  >
                                    Send Email
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() =>
                                      handleMenuItemSelect("Send Invoice")
                                    }
                                  >
                                    Send Invoice
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() =>
                                      handleMenuItemSelect("Send Proposal/Els")
                                    }
                                  >
                                    Send Proposal/Els
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() =>
                                      handleMenuItemSelect("Create Organizer")
                                    }
                                  >
                                    Create Organizer
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() =>
                                      handleMenuItemSelect(
                                        "Apply folder template"
                                      )
                                    }
                                  >
                                    Apply folder template
                                  </MenuItem>
                                  {/* Apply folder template */}
                                  {/* <MenuItem
                                    onClick={() =>
                                      handleMenuItemSelect(
                                        "Update account tags"
                                      )
                                    }
                                  >
                                    Update account tags
                                  </MenuItem> */}
                                </Menu>
                              </Box>
                            </Drawer>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column",
                                gap: 2,
                              }}
                            >
                              {stage.automations.length > 0 && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    width: "100%",
                                  }}
                                >
                                  {stage.automations.map((automation, idx) => (
                                    <Card key={idx} sx={{ width: "100%" }}>
                                      <CardContent>
                                        <Typography
                                          variant="h6"
                                          component="div"
                                        >
                                          <b>
                                            {idx + 1}.{automation.type}
                                          </b>
                                        </Typography>
                                        {automation.template && (
                                          <Typography color="text.secondary">
                                            {automation.template.label}
                                          </Typography>
                                        )}

                                        {/* Add Tags Section */}
                                        {automation.addTags &&
                                          automation.addTags.length > 0 && (
                                            <Box sx={{ marginTop: 2 }}>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                Add Tags:
                                              </Typography>
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  gap: 1,
                                                  flexWrap: "wrap",
                                                  marginTop: 1,
                                                }}
                                              >
                                                {automation.addTags.map(
                                                  (tag) => (
                                                    <Box
                                                      key={tag._id}
                                                      sx={{
                                                        backgroundColor:
                                                          tag.tagColour,
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
                                                  )
                                                )}
                                              </Box>
                                            </Box>
                                          )}

                                        {/* Remove Tags Section */}
                                        {automation.removeTags &&
                                          automation.removeTags.length > 0 && (
                                            <Box sx={{ marginTop: 2 }}>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                Remove Tags:
                                              </Typography>
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  gap: 1,
                                                  flexWrap: "wrap",
                                                  marginTop: 1,
                                                }}
                                              >
                                                {automation.removeTags.map(
                                                  (tag) => (
                                                    <Box
                                                      key={tag._id}
                                                      sx={{
                                                        backgroundColor:
                                                          tag.tagColour,
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
                                                  )
                                                )}
                                              </Box>
                                            </Box>
                                          )}

                                        {/* Display tags with tag color and name */}
                                        {automation.tags &&
                                          automation.tags.length > 0 && (
                                            <Box
                                              sx={{
                                                display: "flex",
                                                gap: 1,
                                                flexWrap: "wrap",
                                                marginTop: 2,
                                              }}
                                            >
                                              <Typography variant="body2">
                                                Conditions:
                                              </Typography>
                                              {automation.tags.map((tag) => (
                                                <Box
                                                  key={tag._id}
                                                  sx={{
                                                    backgroundColor:
                                                      tag.tagColour,
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

                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: "15px",
                                mt: 2,
                                fontWeight: "bold",
                              }}
                            >
                              Automove
                            </Typography>
                            <Typography variant="body2">
                              Move jobs automatically when linked actions are
                              completed
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginTop: "10px",
                              }}
                            >
                              <Switch
                                onChange={() => handleAutoMoveChange(index)}
                                checked={stage.autoMove}
                                color="primary"
                              />
                              <Typography sx={{ cursor: "pointer" }}>
                                Automove jobs
                              </Typography>
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

              <Box
                sx={{ pt: 2, display: "flex", alignItems: "center", gap: 5 }}
              >
                <Button
                  onClick={handleButtonClick}
                  variant="contained"
                  color="primary"
                >
                  Save & exit
                </Button>
                <Button
                  onClick={updateSavePipe}
                  variant="contained"
                  color="primary"
                >
                  Save
                </Button>
                <Button variant="outlined" onClick={hanleCloseupdate}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default PipelineTempUpdate;
