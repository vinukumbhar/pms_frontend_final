// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { Box, Button, Typography, Container, Paper, Autocomplete, TextField, Switch, FormControlLabel, Divider, IconButton, useMediaQuery, useTheme, Alert, Drawer, List, Checkbox, Chip, ListItem, ListItemText } from "@mui/material";
// import makeAnimated from "react-select/animated";
// import { AiOutlineSearch } from "react-icons/ai";
// import { IoMdArrowRoundBack } from "react-icons/io";
// import Select from "react-select";
// import Grid from "@mui/material/Unstable_Grid2";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { LuPlusCircle, LuPenLine } from "react-icons/lu";
// import { RxDragHandleDots2 } from "react-icons/rx";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { RxCross2 } from "react-icons/rx";
// import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
// import { CiMenuKebab } from "react-icons/ci";
// import { useNavigate } from "react-router-dom";

// const PipelineTemp = () => {
//   const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
//   const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;
//   const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
//   const [isConditionsFormOpen, setIsConditionsFormOpen] = useState(false);
//   const [isAnyCheckboxChecked, setIsAnyCheckboxChecked] = useState(false);
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [tempSelectedTags, setTempSelectedTags] = useState([]);

//   const handleAddConditions = () => {
//     setIsConditionsFormOpen(!isConditionsFormOpen);
//   };

//   const handleGoBack = () => {
//     setIsConditionsFormOpen(false);
//   };

//   const handleCheckboxChange = (tag) => {
//     const updatedSelectedTags = tempSelectedTags.includes(tag) ? tempSelectedTags.filter((t) => t._id !== tag._id) : [...tempSelectedTags, tag];
//     setTempSelectedTags(updatedSelectedTags);
//     setIsAnyCheckboxChecked(updatedSelectedTags.length > 0);
//   };

//   const handleAddTags = () => {
//     setSelectedTags([...selectedTags, ...tempSelectedTags.filter((tag) => !selectedTags.some((t) => t._id === tag._id))]);
//     setIsConditionsFormOpen(false);
//     setTempSelectedTags([]);
//   };
//   const [isConditionsInvoiceFormOpen, setIsConditionsInvoiceFormOpen] = useState(false);
//   const [isAnyCheckboxInvoiceChecked, setIsAnyCheckboxInvoiceChecked] = useState(false);
//   const [selectedInvoiceTags, setSelectedInvoiceTags] = useState([]);
//   const [searchInvoiceTerm, setSearchInvoiceTerm] = useState("");
//   const [tempSelectedInvoiceTags, setTempSelectedInvoiceTags] = useState([]);

//   const handleInvoiceAddConditions = () => {
//     setIsConditionsInvoiceFormOpen(!isConditionsInvoiceFormOpen);
//   };

//   const handleInvoiceGoBack = () => {
//     setIsConditionsInvoiceFormOpen(false);
//   };

//   const handleInvoiceCheckboxChange = (tag) => {
//     const updatedInvoiceSelectedTags = tempSelectedInvoiceTags.includes(tag) ? tempSelectedInvoiceTags.filter((t) => t._id !== tag._id) : [...tempSelectedInvoiceTags, tag];
//     setTempSelectedInvoiceTags(updatedInvoiceSelectedTags);
//     setIsAnyCheckboxInvoiceChecked(updatedInvoiceSelectedTags.length > 0);
//   };

//   const handleInvoiceAddTags = () => {
//     setSelectedInvoiceTags([...selectedInvoiceTags, ...tempSelectedInvoiceTags.filter((tag) => !selectedTags.some((t) => t._id === tag._id))]);
//     setIsConditionsInvoiceFormOpen(false);
//     setTempSelectedInvoiceTags([]);
//   };
//   const animatedComponents = makeAnimated();
//   const [addEmailTemplates, setAddEmailTemplates] = useState([]);
//   const [addInvoiceTemplates, setAddInvoiceTemplates] = useState([]);
//   const [selectedEmailTemplate, setSelectedEmailTemplate] = useState(null);
//   const [selectedInvoiceTemplate, setSelectedInvoiceTemplate] = useState(null);
//   const handleEmailTemplateChange = (selectedOption) => {
//     setSelectedEmailTemplate(selectedOption);
//   };
//   const handleInvoiceTemplateChange = (selectedOption) => {
//     setSelectedInvoiceTemplate(selectedOption);
//   };
//   useEffect(() => {
//     fetchEmailTemplates();
//     fectInvoiceTemplates();
//   }, []);

//   const fetchEmailTemplates = async () => {
//     try {
//       const url = `${EMAIL_API}/workflow/emailtemplate`;
//       const response = await fetch(url);
//       const data = await response.json();
//       setAddEmailTemplates(data.emailTemplate);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const emailTemplateOptions = addEmailTemplates.map((temp) => ({
//     value: temp._id,
//     label: temp.templatename,
//   }));
//   const fectInvoiceTemplates = async () => {
//     try {
//       const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate`;
//       const response = await fetch(url);
//       const data = await response.json();
//       setAddInvoiceTemplates(data.invoiceTemplate);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const invoiceTemplateOptions = addInvoiceTemplates.map((temp) => ({
//     value: temp._id,
//     label: temp.templatename,
//   }));

//   const [tags, setTags] = useState([]);

//   useEffect(() => {
//     fetchTags();
//   }, []);

//   const fetchTags = async () => {
//     try {
//       const url = `${TAGS_API}/tags`;
//       const response = await fetch(url);
//       const data = await response.json();
//       setTags(data.tags);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const calculateWidth = (label) => Math.min(label.length * 8, 200);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };
//   const handleInvoiceSearchChange = (e) => {
//     setSearchInvoiceTerm(e.target.value);
//   };
//   const filteredTags = tags.filter((tag) => tag.tagName.toLowerCase().includes(searchTerm.toLowerCase()));
//   const filteredInvoiceTags = tags.filter((tag) => tag.tagName.toLowerCase().includes(searchInvoiceTerm.toLowerCase()));
//   const selectedTagElements = selectedTags.map((tag) => (
//     <Box
//       key={tag._id}
//       sx={{
//         backgroundColor: tag.tagColour,
//         borderRadius: "20px",
//         color: "#fff",
//         fontSize: "12px",
//         fontWeight: "600",
//         textAlign: "center",
//         padding: "3px",
//         marginBottom: "5px",
//         marginRight: "5px",
//         display: "inline-block",
//         width: `${calculateWidth(tag.tagName)}px`,
//       }}
//     >
//       {tag.tagName}
//     </Box>
//   ));

//   const selectedInvoiceTagElements = selectedInvoiceTags.map((tag) => (
//     <Box
//       key={tag._id}
//       sx={{
//         backgroundColor: tag.tagColour,
//         borderRadius: "20px",
//         color: "#fff",
//         fontSize: "12px",
//         fontWeight: "600",
//         textAlign: "center",
//         padding: "3px",
//         marginBottom: "5px",
//         marginRight: "5px",
//         display: "inline-block",
//         width: `${calculateWidth(tag.tagName)}px`,
//       }}
//     >
//       {tag.tagName}
//     </Box>
//   ));

//   const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const [showForm, setShowForm] = useState(false);
//   const [pipelineName, setPipelineName] = useState("");
//   const [isFormDirty, setIsFormDirty] = useState(false);
//   const handleCreatePipeline = () => {
//     setShowForm(true); // Show the form when button is clicked
//   };
//   const [stages, setStages] = useState([{ name: "", autoMove: false, automations: [{ conditions: [], templates: "", action: "" }] }]);

//   const handleAddStage = () => {
//     const newStage = {
//       name: "",
//       conditions: [],
//       automations: [{ conditions: [], templates: "", action: "" }],
//       autoMove: false,
//       showDropdown: false,
//       activeAction: null,
//     };
//     setStages([...stages, newStage]);
//   };
//   const handleStageNameChange = (e, index) => {
//     const newStages = [...stages]; // Create a copy of the stages array
//     newStages[index].name = e.target.value; // Update the name of the specific stage
//     setStages(newStages); // Update the state with the modified stages array
//   };

//   const handleDeleteStage = (index) => {
//     const updatedStages = [...stages];
//     updatedStages.splice(index, 1);
//     setStages(updatedStages);
//   };

//   const handleAutoMoveChange = (index) => {
//     const updatedStages = stages.map((stage, idx) => (idx === index ? { ...stage, autoMove: !stage.autoMove } : stage));
//     setStages(updatedStages);
//   };
//   const createPipe = () => {
//     console.log(stages);
//     const data = {
//       pipelineName: pipelineName,
//       stages: stages,
//     };
//     console.log(data);
//     const config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: `${PIPELINE_API}/workflow/pipeline/createpipeline`,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       data: data,
//     };

//     axios
//       .request(config)
//       .then((response) => {
//         console.log(JSON.stringify(response.data));
//         // Display success toast
//         fetchPipelineData();
//         toast.success("Pipeline created successfully");
//         setShowForm(false);
//         clearForm();
//         // Additional success handling here
//       })
//       .catch((error) => {
//         console.log(error);
//         // Display error toast
//         toast.error("Failed to create pipeline");
//         // Additional error handling here
//       });
//   };

//   const clearForm = () => {
//     setPipelineName("");
//     setStages([]);
//   };

//   const [pipelineData, setPipelineData] = useState([]);

//   useEffect(() => {
//     fetchPipelineData();
//   }, []);

//   const fetchPipelineData = async () => {
//     try {
//       const url = `${PIPELINE_API}/workflow/pipeline/pipelines`;
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error("Failed to fetch pipeline data");
//       }
//       const data = await response.json();
//       setPipelineData(data.pipeline);
//     } catch (error) {
//       console.error("Error fetching pipeline data:", error);
//     }
//   };
//   const handleEdit = (_id) => {
//     // Implement logic for editing here
//     // console.log("Edit action triggered for template id: ", templateId);
//     navigate("PipelineTemplateUpdate/" + _id);
//   };

//   //delete template
//   const handleDelete = async (_id) => {
//     // Show a confirmation prompt
//     const isConfirmed = window.confirm("Are you sure you want to delete this pipeline?");

//     // Proceed with deletion if confirmed
//     if (isConfirmed) {
//       const config = {
//         method: "delete",
//         maxBodyLength: Infinity,
//         url: `${PIPELINE_API}/workflow/pipeline/pipeline/${_id}`,
//         headers: {},
//       };

//       try {
//         const response = await axios.request(config);
//         console.log("Delete response:", response.data);
//         toast.success("Item deleted successfully");
//         fetchPipelineData();
//         // Optionally, you can refresh the data or update the state to reflect the deletion
//       } catch (error) {
//         console.error("Error deleting pipeline:", error);
//       }
//     }
//   };

//   const [tempIdget, setTempIdGet] = useState("");
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const toggleMenu = (_id) => {
//     setOpenMenuId(openMenuId === _id ? null : _id);
//     setTempIdGet(_id);
//   };
//   // console.log(tempIdget)
//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "pipelineName",
//         header: "Name",
//         Cell: ({ row }) => (
//           <Typography sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: "bold" }} onClick={() => handleEdit(row.original._id)}>
//             {row.original.pipelineName}
//           </Typography>
//         ),
//       },
//       {
//         accessorKey: "Setting",
//         header: "Setting",
//         Cell: ({ row }) => (
//           <IconButton onClick={() => toggleMenu(row.original._id)} style={{ color: "#2c59fa" }}>
//             <CiMenuKebab style={{ fontSize: "25px" }} />
//             {openMenuId === row.original._id && (
//               <Box sx={{ position: "absolute", zIndex: 1, backgroundColor: "#fff", boxShadow: 1, borderRadius: 1, p: 1, left: "30px", m: 2 }}>
//                 <Typography
//                   sx={{ fontSize: "12px", fontWeight: "bold" }}
//                   onClick={() => {
//                     handleEdit(row.original._id);
//                   }}
//                 >
//                   Edit
//                 </Typography>
//                 <Typography sx={{ fontSize: "12px", color: "red", fontWeight: "bold" }} onClick={() => handleDelete(row.original._id)}>
//                   Delete
//                 </Typography>
//               </Box>
//             )}
//           </IconButton>
//         ),
//       },
//     ],
//     [openMenuId]
//   );

//   const table = useMaterialReactTable({
//     columns,
//     data: pipelineData,
//     enableBottomToolbar: true,
//     enableStickyHeader: true,
//     columnFilterDisplayMode: "custom", // Render own filtering UI
//     enableRowSelection: true, // Enable row selection
//     enablePagination: true,
//     muiTableContainerProps: { sx: { maxHeight: "400px" } },
//     initialState: {
//       columnPinning: { left: ["mrt-row-select", "tagName"], right: ["settings"] },
//     },
//     muiTableBodyCellProps: {
//       sx: (theme) => ({
//         backgroundColor: theme.palette.mode === "dark-theme" ? theme.palette.grey[900] : theme.palette.grey[50],
//       }),
//     },
//   });
//   const handleClosePipelineTemp = () => {
//     if (isFormDirty) {
//       const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
//       if (!confirmClose) {
//         return;
//       }
//     }
//     setShowForm(false);
//   };

//   // Detect form changes
//   useEffect(() => {
//     if (pipelineName) {
//       setIsFormDirty(true);
//     } else {
//       setIsFormDirty(false);
//     }
//   }, [pipelineName]);

//   // automations
//   const [activeAction, setActiveAction] = useState(null);
//   const [isAutoFormOpen, setAutoFormOpen] = useState(false);
//   // const [showAutoMoveDropdown, setShowAutoMoveDropdown] = useState(false);
//   const [activeStageIndex, setActiveStageIndex] = useState(null);
//   const [showAutoMoveDropdown, setShowAutoMoveDropdown] = useState({});
//   const handleToggleAutoMoveDropdown = (index) => {
//     setShowAutoMoveDropdown((prev) => ({
//       ...prev,
//       [index]: !prev[index], // Toggle the dropdown for the selected stage
//     }));
//     setActiveStageIndex(index);
//   };
//   const handleOpenDrawer = (index, action) => {
//     toggleForm(index); // Track which stage is currently active
//     setActiveStageIndex(index);
//     const newItemNumber = items.length + 1;
//     const newItem = { id: `${newItemNumber}-${Date.now()}`, action };
//     setItems([...items]);
//     // setActiveAction(action);
//   };
//   const automoveActions = ["Send invoice", "Send email", "Send Organizer"];
//   const handleActionSelect = (action, index) => {
//     setActiveAction(action);
//     toggleForm(index);
//     const newItemNumber = items.length + 1;
//     const newItem = { id: `${newItemNumber}-${Date.now()}`, action };
//     setItems([...items, newItem]);
//     setShowAutoMovesDropdown(false);
//   };
//   const handleFormClose = () => {
//     setAutoFormOpen(false);
//     setActiveAction(null);
//     setItems([]);
//   };

//   const toggleForm = (index) => {
//     setItems([]); // Clear previous items
//     // setAutomations((prevAutomations) => {
//     //   const updatedAutomations = [...prevAutomations];
//     //   updatedAutomations[index] = []; // Ensure no previous automations appear
//     //   return updatedAutomations;
//     // });
//     setAutoFormOpen((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));

//     setShowAutoMoveDropdown(false);
//   };

//   // setSelectedEmailTemplate("");
//   // setSelectedEmailTemplate("");
//   // setSelectedInvoiceTags([]);
//   // setSelectedTags([]);
//   // setItems([]);
//   const [items, setItems] = useState([]);
//   const [showAutoMovesDropdown, setShowAutoMovesDropdown] = useState(false);
//   const automoveActionsForm = ["Send invoice", "Send email", "Send Organizer"];
//   const handleAddItems = (action) => {
//     // const newItemNumber = items.length + 1;
//     // const newItem = { id: newItemNumber, action };
//     const newItemNumber = items.length + 1;
//     const newItem = { id: `${newItemNumber}-${Date.now()}`, action };
//     setItems([...items, newItem]);
//     setShowAutoMovesDropdown(false);
//   };

//   // Function to render content based on action
//   //normal render
//   const renderActionContent = (action, index) => {
//     const automationsForStage = automations[index] || [];

//     switch (action) {
//       case "Send invoice":
//         return (
//           <>
//             {/* <Box>
//               <List>
//                 {automationsForStage.map((automation) => (
//                   <Paper elevation={3} sx={{ borderRadius: "10px" }}>
//                     <li key={automation.id} style={{ textAlign: "left", listStyle: "none", padding: "15px", marginTop: 10, borderRadius: "5px" }}>
//                       <Box sx={{ fontWeight: "bold" }}>
//                         {automation.id}.{automation.action}
//                       </Box>
//                       {automation.templates.label} <br />
//                       <Typography sx={{ fontWeight: "bold" }}>Conditions</Typography>
//                       {automation.conditions.map((condition) => (
//                         <Box key={condition._id}>
//                           <span
//                             style={{
//                               backgroundColor: condition.tagColour,
//                               borderRadius: "20px",
//                               color: "#fff",
//                               fontSize: "12px",
//                               fontWeight: "600",
//                               textAlign: "center",
//                               padding: "3px",
//                               display: "inline-block",
//                               width: `${calculateWidth(condition.tagName)}px`,
//                             }}
//                           >
//                             {condition.tagName}
//                           </span>
//                         </Box>
//                       ))}
//                     </li>
//                   </Paper>
//                 ))}
//               </List>
//             </Box> */}

//             <Box sx={{ paddingTop: "20px" }}>
//               {/* <Typography>vinayk</Typography> */}
//               <Grid container direction="column" spacing={2}>
//                 <Grid item>
//                   <Typography mb={1}>Select invoice template</Typography>
//                   <Select className="select-dropdown" placeholder="Select invoice template" options={invoiceTemplateOptions} components={makeAnimated()} isSearchable isClearable onChange={handleInvoiceTemplateChange} value={selectedInvoiceTemplate} />
//                 </Grid>

//                 <Grid item>
//                   {selectedInvoiceTags.length > 0 && (
//                     <Grid container alignItems="center" gap={1}>
//                       <Typography>Only for:</Typography>
//                       <Grid item>{selectedInvoiceTagElements}</Grid>
//                     </Grid>
//                   )}
//                 </Grid>

//                 <Grid item>
//                   <Typography onClick={handleInvoiceAddConditions} sx={{ cursor: "pointer", color: "blue", fontWeight: "bold" }}>
//                     Add conditions
//                   </Typography>
//                 </Grid>
//               </Grid>
//             </Box>

//             <Drawer anchor="right" open={isConditionsInvoiceFormOpen} onClose={handleInvoiceGoBack} PaperProps={{ sx: { width: "550px", padding: 2 } }}>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <IconButton onClick={handleInvoiceGoBack}>
//                   <IoMdArrowRoundBack fontSize="large" color="blue" />
//                 </IconButton>
//                 <Typography variant="h6">Add conditions</Typography>
//               </Box>

//               <Box sx={{ padding: 2 }}>
//                 <Typography variant="body1">Apply automation only for accounts with these tags</Typography>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   variant="outlined"
//                   placeholder="Search..."
//                   value={searchInvoiceTerm}
//                   onChange={handleInvoiceSearchChange}
//                   InputProps={{
//                     startAdornment: <AiOutlineSearch style={{ marginRight: 8 }} />,
//                   }}
//                   sx={{ marginTop: 2 }}
//                 />

//                 <Box sx={{ marginTop: 2 }}>
//                   {filteredInvoiceTags.map((tag) => (
//                     <Box key={tag._id} sx={{ display: "flex", alignItems: "center", gap: 3, borderBottom: "1px solid grey", paddingBottom: 1 }}>
//                       <Checkbox checked={tempSelectedInvoiceTags.includes(tag)} onChange={() => handleInvoiceCheckboxChange(tag)} />
//                       <Chip label={tag.tagName} sx={{ backgroundColor: tag.tagColour, color: "#fff", fontWeight: "500", borderRadius: "20px", marginRight: 1 }} />
//                     </Box>
//                   ))}
//                 </Box>

//                 <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
//                   <Button variant="contained" color="primary" disabled={!isAnyCheckboxInvoiceChecked} onClick={handleInvoiceAddTags}>
//                     Add
//                   </Button>
//                   <Button variant="outlined" color="primary" onClick={handleInvoiceGoBack}>
//                     Cancel
//                   </Button>
//                 </Box>
//               </Box>
//             </Drawer>
//           </>
//         );

//       case "Send email":
//         return (
//           <>
//             {/* <Box>
//               <List>
//                 {automationsForStage.map((automation) => (
//                   <Paper elevation={3} sx={{ borderRadius: "10px" }}>
//                     <li key={automation.id} style={{ textAlign: "left", listStyle: "none", padding: "15px", marginTop: 10, borderRadius: "5px" }}>
//                       <Box sx={{ fontWeight: "bold" }}>
//                         {automation.id}.{automation.action}
//                       </Box>
//                       {automation.templates.label} <br />
//                       <Typography sx={{ fontWeight: "bold" }}>Conditions</Typography>
//                       {automation.conditions.map((condition) => (
//                         <Box key={condition._id}>
//                           <span
//                             style={{
//                               backgroundColor: condition.tagColour,
//                               borderRadius: "20px",
//                               color: "#fff",
//                               fontSize: "12px",
//                               fontWeight: "600",
//                               textAlign: "center",
//                               padding: "3px",
//                               display: "inline-block",
//                               width: `${calculateWidth(condition.tagName)}px`,
//                             }}
//                           >
//                             {condition.tagName}
//                           </span>
//                         </Box>
//                       ))}
//                     </li>
//                   </Paper>
//                 ))}
//               </List>
//             </Box> */}
//             <Box sx={{ paddingTop: "20px" }}>
//               <Grid container direction="column" spacing={2}>
//                 <Grid item>
//                   <Typography mb={1}>Select template</Typography>
//                   <Select className="select-dropdown" placeholder="Select template" options={emailTemplateOptions} components={animatedComponents} isSearchable isClearable onChange={handleEmailTemplateChange} value={selectedEmailTemplate} />
//                 </Grid>

//                 <Grid item>
//                   {selectedTags.length > 0 && (
//                     <Grid container alignItems="center" gap={1}>
//                       <Typography>Only for:</Typography>
//                       <Grid item>{selectedTagElements}</Grid>
//                     </Grid>
//                   )}
//                 </Grid>

//                 <Grid item>
//                   <Typography onClick={handleAddConditions} sx={{ cursor: "pointer", color: "blue", fontWeight: "bold" }}>
//                     Add conditions
//                   </Typography>
//                 </Grid>
//               </Grid>
//             </Box>

            // <Drawer anchor="right" open={isConditionsFormOpen} onClose={handleGoBack} PaperProps={{ sx: { width: "550px", padding: 2 } }}>
            //   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            //     <IconButton onClick={handleGoBack}>
            //       <IoMdArrowRoundBack fontSize="large" color="blue" />
            //     </IconButton>
            //     <Typography variant="h6">Add conditions</Typography>
            //   </Box>

            //   <Box sx={{ padding: 2 }}>
            //     <Typography variant="body1">Apply automation only for accounts with these tags</Typography>
            //     <TextField
            //       fullWidth
            //       size="small"
            //       variant="outlined"
            //       placeholder="Search..."
            //       value={searchTerm}
            //       onChange={handleSearchChange}
            //       InputProps={{
            //         startAdornment: <AiOutlineSearch style={{ marginRight: 8 }} />,
            //       }}
            //       sx={{ marginTop: 2 }}
            //     />

            //     <Box sx={{ marginTop: 2 }}>
            //       {filteredTags.map((tag) => (
            //         <Box key={tag._id} sx={{ display: "flex", alignItems: "center", gap: 3, borderBottom: "1px solid grey", paddingBottom: 1 }}>
            //           <Checkbox checked={tempSelectedTags.includes(tag)} onChange={() => handleCheckboxChange(tag)} />
            //           <Chip label={tag.tagName} sx={{ backgroundColor: tag.tagColour, color: "#fff", fontWeight: "500", borderRadius: "20px", marginRight: 1 }} />
            //         </Box>
            //       ))}
            //     </Box>

            //     <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
            //       <Button variant="contained" color="primary" disabled={!isAnyCheckboxChecked} onClick={handleAddTags}>
            //         Add
            //       </Button>
            //       <Button variant="outlined" color="primary" onClick={handleGoBack}>
            //         Cancel
            //       </Button>
            //     </Box>
            //   </Box>
            // </Drawer>
//           </>
//         );

//       case "Send Organizer":
//         return <>Send Organizer</>;
//       // Add cases for other actions here
//       default:
//         return null;
//     }
//   };
//   const handleDeleteItems = (id) => {
//     // Filter out the folder with the given id
//     const updatedItems = items.filter((item) => item.id !== id);
//     // Update the ids of remaining folders
//     const updatedItemsWithIds = updatedItems.map((item, index) => ({ ...item, id: index + 1 }));
//     setItems(updatedItemsWithIds);
//   };
//   // Function to render header content based on action

//   const [automations, setAutomations] = useState([]);

//   const handleSaveAutomations = (stageIndex) => {
//     // Construct saved automations specific to the current stage
//     const newAutomations = items.map((item) => {
//       const automationData = {
//         id: item.id,
//         action: item.action,
//       };

//       // Capture additional data for specific actions
//       if (item.action === "Send email") {
//         automationData.templates = selectedEmailTemplate;
//         automationData.conditions = selectedTags;
//         // setSelectedEmailTemplate(null);
//         // setSelectedTags([]);
//       }
//       if (item.action === "Send invoice") {
//         automationData.templates = selectedInvoiceTemplate;
//         automationData.conditions = selectedInvoiceTags;
//         // setSelectedInvoiceTemplate(null);
//         // setSelectedInvoiceTags([]);
//       }

//       return automationData;
//     });

//     // Retrieve existing automations for this stage, if any, and append new automations
//     setStages((prevStages) => {
//       const updatedStages = [...prevStages];
//       const existingAutomations = updatedStages[stageIndex].automations || [];
//       updatedStages[stageIndex] = {
//         ...updatedStages[stageIndex],
//         automations: [...existingAutomations, ...newAutomations], // Append new automations
//       };

//       return updatedStages;
//     });

//     setAutomations((prevAutomations) => {
//       //const updatedAutomations = [...prevAutomations];
//       const updatedAutomations = [];
//       const existingAutomations = updatedAutomations[stageIndex] || [];
//       updatedAutomations[stageIndex] = [...existingAutomations, ...newAutomations]; // Append new automations

//       return updatedAutomations;
//     });

//     console.log("Saved Automations for Stage", stageIndex, ":", newAutomations);
//     setAutoFormOpen(false);
//     // setItems([]); // Clear items after saving
//   };

//   //render for stages
//   const renderAutomationsForStage = (index) => {
//     const automationsForStage = automations[index] || []; // Get automations for the specific stage
//     return (
//       <Box>
//         <List>
//           {automationsForStage.map((automation) => (
//             <Paper elevation={3} sx={{ borderRadius: "10px" }}>
//               <li key={automation.id} style={{ textAlign: "left", listStyle: "none", padding: "15px", marginTop: 10, borderRadius: "5px" }}>
//                 <Box sx={{ fontWeight: "bold" }}>
//                   {automation.id}.{automation.action}
//                 </Box>
//                 {automation.templates.label} <br />
//                 <Typography sx={{ fontWeight: "bold" }}>Conditions</Typography>
//                 {automation.conditions.map((condition) => (
//                   <Box key={condition._id}>
//                     <span
//                       style={{
//                         backgroundColor: condition.tagColour,
//                         borderRadius: "20px",
//                         color: "#fff",
//                         fontSize: "12px",
//                         fontWeight: "600",
//                         textAlign: "center",
//                         padding: "3px",
//                         display: "inline-block",
//                         width: `${calculateWidth(condition.tagName)}px`,
//                       }}
//                     >
//                       {condition.tagName}
//                     </span>
//                   </Box>
//                 ))}
//               </li>
//             </Paper>
//           ))}
//         </List>
//       </Box>
//     );
//   };
//   return (
//     <Container>
//       {!showForm ? (
//         <Box sx={{ mt: 2 }}>
//           <Button variant="contained" color="primary" onClick={handleCreatePipeline} sx={{ mb: 3 }}>
//             Create Pipeline
//           </Button>

//           <MaterialReactTable columns={columns} table={table} />
//         </Box>
//       ) : (
//         <Box
//           sx={{
//             mt: 2,
//           }}
//         >
//           <Box>
//             <form>
//               <Box>
//                 <Typography variant="h5" gutterBottom>
//                   {" "}
//                   Create Pipelines
//                 </Typography>
//                 <Box mt={2} mb={2}>
//                   <hr />
//                 </Box>
//                 <Grid container spacing={2}>
//                   <Grid xs={12} sm={5.8}>
//                     <Box>
//                       {/* <InputLabel className="pipeline-lable">Pipeline Name</InputLabel> */}
//                       <label className="pipeline-lable">Pipeline Name</label>
//                       <TextField fullWidth value={pipelineName} onChange={(e) => setPipelineName(e.target.value)} sx={{ mt: 1.5, backgroundColor: "#fff" }} size="small" placeholder="Pipeline Name" />
//                     </Box>
//                   </Grid>
//                 </Grid>
//                 <Box mt={5} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
//                   <Typography variant="h6">Stages</Typography>
//                   <Button variant="contained" startIcon={<LuPlusCircle />} onClick={handleAddStage}>
//                     Add stage
//                   </Button>
//                 </Box>
//                 <Box mt={2}>
//                   <hr />
//                 </Box>
//                 <Box sx={{ margin: "20px 0 10px 10px" }}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       gap: "10px",
//                       overflowX: "auto",
//                       marginBottom: "10%",
//                       flexDirection: isSmallScreen ? "column" : "row",
//                     }}
//                   >
//                     {stages.map((stage, index) => (
//                       <Paper
//                         key={index}
//                         sx={{
//                           height: "auto",
//                           marginTop: "20px",
//                           borderRadius: "10px",
//                           boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
//                           width: isSmallScreen ? "90%" : "20%",
//                           marginBottom: "20px",
//                           marginLeft: isSmallScreen ? "0" : "5px",
//                           alignSelf: isSmallScreen ? "center" : "flex-start",
//                         }}
//                       >
//                         <Box sx={{ margin: "10px" }}>
//                           <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
//                             <RxDragHandleDots2 />
//                             <Box sx={{ display: "flex", alignItems: "center", gap: "10px", flexGrow: 1 }}>
//                               <LuPenLine />
//                               <TextField variant="outlined" placeholder="Stage Name" sx={{ flexGrow: 1 }} size="small" margin="normal" value={stage.name} onChange={(e) => handleStageNameChange(e, index)} />
//                             </Box>
//                             <IconButton onClick={() => handleDeleteStage(index)}>
//                               <RiDeleteBin6Line sx={{ color: "red", cursor: "pointer" }} />
//                             </IconButton>
//                           </Box>
//                           <Divider />
//                           <Box m={2}>
//                             <Typography variant="h6" sx={{ fontSize: "15px", fontWeight: "bold" }}>
//                               Stage conditions
//                             </Typography>
//                             {index === 0 ? <Typography variant="body2">First stage can't have conditions</Typography> : index === stages.length - 1 ? <Typography variant="body2">Last stage can't have conditions</Typography> : <Typography variant="body2">Job enters this stage if conditions are met</Typography>}
//                             {index > 0 && index !== stages.length - 1 && (
//                               <Box sx={{ marginTop: "10px" }}>
//                                 <Typography variant="body2" sx={{ cursor: "pointer", color: "blue", fontWeight: "bold" }}>
//                                   Add conditions
//                                 </Typography>
//                               </Box>
//                             )}

//                             <Typography variant="h6" sx={{ fontSize: "15px", fontWeight: "bold", mt: 2 }}>
//                               Automations
//                             </Typography>
//                             <Typography variant="body2">Triggered when job enters stage</Typography>
//                             {/* <Typography variant="body2" sx={{ cursor: "pointer", color: "blue", fontWeight: "bold", mt: 2 }} onClick={() => handleToggleAutoMoveDropdown(index)}>
//                               Added automation
//                               {stage.automations && stage.automations.length > 0 ? "Edit automation" : "Add automation"}
//                             </Typography> */}
//                             <Typography
//                               variant="body2"
//                               sx={{ cursor: "pointer", color: "blue", fontWeight: "bold", mt: 2 }}
//                               onClick={() => {
//                                 if (stage.automations && stage.automations.length > 1) {
//                                   handleOpenDrawer(index); // Open drawer for "Edit automation"
//                                 } else {
//                                   handleToggleAutoMoveDropdown(index); // Toggle dropdown for "Add automation"
//                                 }
//                               }}
//                             >
//                               {stage.automations && stage.automations.length > 1 ? "Edit automation" : "Add automation"}
//                             </Typography>

//                             <Box>{renderAutomationsForStage(index)}</Box>

//                             <Typography variant="h6" sx={{ fontSize: "15px", mt: 2, fontWeight: "bold" }}>
//                               Automove
//                             </Typography>
//                             <Typography variant="body2">Move jobs automatically when linked actions are completed</Typography>

//                             {showAutoMoveDropdown[index] && (
//                               <div className="automove-dropdown">
//                                 {automoveActions.map((action, idx) => (
//                                   <li key={idx} onClick={() => handleActionSelect(action, index)}>
//                                     {action}
//                                   </li>
//                                 ))}
//                               </div>
//                             )}

//                             <Box sx={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
//                               <Switch onChange={() => handleAutoMoveChange(index)} checked={stage.autoMove} color="primary" />
//                               <Typography sx={{ cursor: "pointer" }}>Automove jobs</Typography>
//                             </Box>
//                           </Box>
//                         </Box>
//                         {/* drwaer edit */}
//                         <Drawer anchor="right" open={isAutoFormOpen[index] && !!activeAction} onClose={() => toggleForm(index)} PaperProps={{ sx: { width: 550 } }}>
//                           <Box>
//                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
//                               <Typography variant="h4">Automations - Stage {activeStageIndex}</Typography>
//                               <IconButton onClick={() => toggleForm(index)}>
//                                 <RxCross2 />
//                               </IconButton>
//                             </Box>
//                             <Box>
//                               <Box style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
//                                 <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//                                   {items.map((item, index) => (
//                                     <Box key={item.id}>
//                                       <Box style={{ border: "1px solid #B2BEB5", borderRadius: "10px", padding: "10px" }}>
//                                         <Box style={{ display: "flex", gap: "10px", fontSize: "20px", fontWeight: "550", justifyContent: "space-between", alignItems: "center" }}>
//                                           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                                             <RxDragHandleDots2 /> {item.id}. {item.action}
//                                           </Box>

//                                           <IconButton onClick={() => handleDeleteItems(item.id)}>
//                                             <RiDeleteBin6Line />
//                                           </IconButton>
//                                         </Box>
//                                         {renderActionContent(item.action, index)}
//                                       </Box>
//                                     </Box>
//                                   ))}
//                                 </Box>
//                                 <Box>
//                                   <Box
//                                     style={{
//                                       display: "flex",
//                                       gap: "10px",
//                                       alignItems: "center",
//                                       cursor: "pointer",
//                                       margin: "15px 0",
//                                     }}
//                                   >
//                                     <LuPlusCircle style={{ color: "blue" }} />
//                                     <li
//                                       style={{
//                                         listStyle: "none",
//                                         cursor: "pointer",
//                                         color: "blue",
//                                         fontWeight: "bold",
//                                       }}
//                                       onClick={() => setShowAutoMovesDropdown(!showAutoMovesDropdown)}
//                                     >
//                                       add automove
//                                     </li>
//                                   </Box>
//                                   {showAutoMovesDropdown && (
//                                     <Box className="automove-dropdown2">
//                                       <List>
//                                         {automoveActionsForm.map((action, index) => (
//                                           <li key={index} onClick={() => handleAddItems(action)}>
//                                             {action}
//                                           </li>
//                                         ))}
//                                       </List>
//                                     </Box>
//                                   )}
//                                 </Box>
//                                 <Box>
//                                   <Button onClick={() => handleSaveAutomations(index)} variant="contained" color="primary" sx={{ marginTop: "15px" }}>
//                                     Save
//                                   </Button>
//                                 </Box>
//                               </Box>
//                             </Box>
//                           </Box>
//                         </Drawer>
//                       </Paper>
//                     ))}
//                     <Box mt={3}>
//                       <Button variant="contained" startIcon={<LuPlusCircle />} onClick={handleAddStage}>
//                         Add stage
//                       </Button>
//                     </Box>
//                   </Box>
//                 </Box>

//                 <Box sx={{ pt: 2, display: "flex", alignItems: "center", gap: 5 }}>
//                   <Button variant="contained" color="primary" onClick={createPipe}>
//                     Save & exit
//                   </Button>
//                 </Box>
//               </Box>
//             </form>
//           </Box>
//         </Box>
//       )}
//     </Container>
//   );
// };

// export default PipelineTemp;

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Box, Button, Typography, Container, Paper, Autocomplete, TextField, Switch, FormControlLabel, Divider, IconButton, useMediaQuery, useTheme, Alert, Drawer, List, Checkbox, Chip, ListItem, ListItemText } from "@mui/material";
import makeAnimated from "react-select/animated";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import Select from "react-select";
import Grid from "@mui/material/Unstable_Grid2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuPlusCircle, LuPenLine } from "react-icons/lu";
import { RxDragHandleDots2 } from "react-icons/rx";
import { toast } from "react-toastify";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import SendEmail from "./Automations/SendEmail";
import SendInvoice from "./Automations/SendInvoice";
const PipelineTemp = () => {
  const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
  const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;
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
    const updatedSelectedTags = tempSelectedTags.includes(tag) ? tempSelectedTags.filter((t) => t._id !== tag._id) : [...tempSelectedTags, tag];
    setTempSelectedTags(updatedSelectedTags);
    setIsAnyCheckboxChecked(updatedSelectedTags.length > 0);
  };

  const handleAddTags = () => {
    setSelectedTags([...selectedTags, ...tempSelectedTags.filter((tag) => !selectedTags.some((t) => t._id === tag._id))]);
    setIsConditionsFormOpen(false);
    setTempSelectedTags([]);
  };
  const [isConditionsInvoiceFormOpen, setIsConditionsInvoiceFormOpen] = useState(false);
  const [isAnyCheckboxInvoiceChecked, setIsAnyCheckboxInvoiceChecked] = useState(false);
  const [selectedInvoiceTags, setSelectedInvoiceTags] = useState([]);
  const [searchInvoiceTerm, setSearchInvoiceTerm] = useState("");
  const [tempSelectedInvoiceTags, setTempSelectedInvoiceTags] = useState([]);

  const handleInvoiceAddConditions = () => {
    setIsConditionsInvoiceFormOpen(!isConditionsInvoiceFormOpen);
  };

  const handleInvoiceGoBack = () => {
    setIsConditionsInvoiceFormOpen(false);
  };

  const handleInvoiceCheckboxChange = (tag) => {
    const updatedInvoiceSelectedTags = tempSelectedInvoiceTags.includes(tag) ? tempSelectedInvoiceTags.filter((t) => t._id !== tag._id) : [...tempSelectedInvoiceTags, tag];
    setTempSelectedInvoiceTags(updatedInvoiceSelectedTags);
    setIsAnyCheckboxInvoiceChecked(updatedInvoiceSelectedTags.length > 0);
  };

  const handleInvoiceAddTags = () => {
    setSelectedInvoiceTags([...selectedInvoiceTags, ...tempSelectedInvoiceTags.filter((tag) => !selectedTags.some((t) => t._id === tag._id))]);
    setIsConditionsInvoiceFormOpen(false);
    setTempSelectedInvoiceTags([]);
  };
  const animatedComponents = makeAnimated();
  const [addEmailTemplates, setAddEmailTemplates] = useState([]);
  const [addInvoiceTemplates, setAddInvoiceTemplates] = useState([]);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState(null);
  const [selectedInvoiceTemplate, setSelectedInvoiceTemplate] = useState(null);
  const handleEmailTemplateChange = (selectedOption) => {
    setSelectedEmailTemplate(selectedOption);
  };
  const handleInvoiceTemplateChange = (selectedOption) => {
    setSelectedInvoiceTemplate(selectedOption);
  };
  useEffect(() => {
    fetchEmailTemplates();
    fectInvoiceTemplates();
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

  const [tags, setTags] = useState([]);

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
  const handleInvoiceSearchChange = (e) => {
    setSearchInvoiceTerm(e.target.value);
  };
  const filteredTags = tags.filter((tag) => tag.tagName.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredInvoiceTags = tags.filter((tag) => tag.tagName.toLowerCase().includes(searchInvoiceTerm.toLowerCase()));
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

  const selectedInvoiceTagElements = selectedInvoiceTags.map((tag) => (
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

  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const JOBS_API = process.env.REACT_APP_JOBS_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const SORTJOBS_API = process.env.REACT_APP_SORTJOBS_URL;

  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [showForm, setShowForm] = useState(false);
  const [pipelineName, setPipelineName] = useState("");
  const [isFormDirty, setIsFormDirty] = useState(false);
  const handleCreatePipeline = () => {
    setShowForm(true); // Show the form when button is clicked
  };

  // sort jobs
  const [sortbyjobs, setSortbyJobs] = useState([]);
  const [selectedSortByJob, setSelectedSortByJob] = useState("");

  const handleSortingByJobs = (selectedOptions) => {
    setSelectedSortByJob(selectedOptions);
    console.log(selectedOptions);
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
      automations: [{ conditions: [], templates: "", action: "" }],
      autoMove: false,
      showDropdown: false,
      activeAction: null,
    };
    setStages([...stages, newStage]);
  };
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
    const updatedStages = stages.map((stage, idx) => (idx === index ? { ...stage, autoMove: !stage.autoMove } : stage));
    setStages(updatedStages);
  };

  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const url = `${USER_API}/api/auth/users`;
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
  const [selectedtemp, setselectedTemp] = useState();
  const handletemp = (selectedOptions) => {
    setselectedTemp(selectedOptions);
    console.log(selectedOptions);
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

  const createPipe = () => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    console.log(stages);

    const data = {
      pipelineName: pipelineName,
      availableto: combinedValues,
      sortjobsby: selectedSortByJob.value,
      defaultjobtemplate: selectedtemp.value,
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
    console.log(data);
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${PIPELINE_API}/workflow/pipeline/createpipeline`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
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
      defaultjobtemplate: selectedtemp.value,
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
      method: "post",
      maxBodyLength: Infinity,
      url: `${PIPELINE_API}/workflow/pipeline/createpipeline`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
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
    setPipelineName("");
    setSelectedUser([]);
    setCombinedValues([]);
    setSelectedSortByJob("");
    setselectedTemp(null);

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
  const handleEdit = (_id) => {
    // Implement logic for editing here
    // console.log("Edit action triggered for template id: ", templateId);
    navigate("PipelineTemplateUpdate/" + _id);
  };

  //delete template
  const handleDelete = async (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm("Are you sure you want to delete this pipeline?");

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${PIPELINE_API}/workflow/pipeline/pipeline/${_id}`,
        headers: {},
      };

      try {
        const response = await axios.request(config);
        console.log("Delete response:", response.data);
        toast.success("Item deleted successfully");
        fetchPipelineData();
        // Optionally, you can refresh the data or update the state to reflect the deletion
      } catch (error) {
        console.error("Error deleting pipeline:", error);
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
  const columns = useMemo(
    () => [
      {
        accessorKey: "pipelineName",
        header: "Name",
        Cell: ({ row }) => (
          <Typography sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: "bold" }} onClick={() => handleEdit(row.original._id)}>
            {row.original.pipelineName}
          </Typography>
        ),
      },
      {
        accessorKey: "Setting",
        header: "Setting",
        Cell: ({ row }) => (
          <IconButton onClick={() => toggleMenu(row.original._id)} style={{ color: "#2c59fa" }}>
            <CiMenuKebab style={{ fontSize: "25px" }} />
            {openMenuId === row.original._id && (
              <Box sx={{ position: "absolute", zIndex: 1, backgroundColor: "#fff", boxShadow: 1, borderRadius: 1, p: 1, left: "30px", m: 2 }}>
                <Typography
                  sx={{ fontSize: "12px", fontWeight: "bold" }}
                  onClick={() => {
                    handleEdit(row.original._id);
                  }}
                >
                  Edit
                </Typography>
                <Typography sx={{ fontSize: "12px", color: "red", fontWeight: "bold" }} onClick={() => handleDelete(row.original._id)}>
                  Delete
                </Typography>
              </Box>
            )}
          </IconButton>
        ),
      },
    ],
    [openMenuId]
  );

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
      columnPinning: { left: ["mrt-row-select", "tagName"], right: ["settings"] },
    },
    muiTableBodyCellProps: {
      sx: (theme) => ({
        backgroundColor: theme.palette.mode === "dark-theme" ? theme.palette.grey[900] : theme.palette.grey[50],
      }),
    },
  });
  const handleClosePipelineTemp = () => {
    if (isFormDirty) {
      const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
      if (!confirmClose) {
        return;
      }
    }
    setShowForm(false);
  };

  // Detect form changes
  useEffect(() => {
    if (pipelineName || Assignees || selectedtemp || selectedSortByJob || selectedtemp) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [pipelineName, Assignees, selectedtemp, selectedSortByJob, selectedtemp]);

  const [pipelineNameError, setPipelineNameError] = useState("");
  const [sortByJobError, setSortByJobError] = useState("");
  const [templateError, setTemplateError] = useState("");
  const [userError, setUserError] = useState("");
  const validateForm = () => {
    let isValid = true;
    if (!pipelineName) {
      setPipelineNameError("Pipeline name is required");

      isValid = false;
    } else {
      setPipelineNameError("");
    }
    if (!selectedSortByJob) {
      setSortByJobError("Sort By Job is required.");
      isValid = false;
    } else {
      setSortByJobError("");
    }

    if (!selectedtemp) {
      setTemplateError("Job Template is required.");
      isValid = false;
    } else {
      setTemplateError("");
    }

    if (selectedUser.length === 0) {
      setUserError("At least one user must be selected.");
      isValid = false;
    } else {
      setUserError("");
    }

    return isValid;
  };

  // automations
  const [activeAction, setActiveAction] = useState(null);
  const [isAutoFormOpen, setAutoFormOpen] = useState(false);
  // const [showAutoMoveDropdown, setShowAutoMoveDropdown] = useState(false);
  const [showAutoMoveDropdown, setShowAutoMoveDropdown] = useState({});
  const handleToggleAutoMoveDropdown = (index) => {
    setShowAutoMoveDropdown((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the dropdown for the selected stage
    }));
  };
  const automoveActions = ["Apply folder template", "Update account tags", "Send invoice", "Create organozer", "Create task", "Send proposal/EL", "Send email", "Send message", "Update account access", "Update job assignees", "Add wiki page"];
  const handleActionSelect = (action) => {
    setActiveAction(action);
    toggleForm();
    const newItemNumber = items.length + 1;
    const newItem = { id: newItemNumber, action };
    setItems([...items, newItem]);
    setShowAutoMovesDropdown(false);
  };
  const handleFormClose = () => {
    setAutoFormOpen(false);
    setActiveAction(null);
    setItems([]);
  };

  const toggleForm = () => {
    setAutoFormOpen(!isAutoFormOpen);
    setShowAutoMoveDropdown(false);
  };

  const [items, setItems] = useState([]);
  const [showAutoMovesDropdown, setShowAutoMovesDropdown] = useState(false);
  const automoveActionsForm = ["Apply folder template", "Update account tags", "Send invoice", "Create organizer", "Create task", "Send proposal/EL", "Send email", "Send message", "Update account access", "Update job assignees", "Add wiki page"];
  const handleAddItems = (action) => {
    const newItemNumber = items.length + 1;
    const newItem = { id: newItemNumber, action };
    setItems([...items, newItem]);
    setShowAutoMovesDropdown(false);
  };

  // Function to render content based on action
  const renderActionContent = (action, conditions, templates) => {
    console.log("vinayak", conditions, templates);
    switch (action) {
      case "Send invoice":
        return (
          <>
            <SendInvoice stages={stages} isConditionsInvoiceFormOpen={isConditionsInvoiceFormOpen} handleInvoiceGoBack={handleInvoiceGoBack} handleInvoiceAddConditions={handleInvoiceAddConditions} selectedInvoiceTags={selectedInvoiceTags} selectedInvoiceTagElements={selectedInvoiceTagElements} invoiceTemplateOptions={invoiceTemplateOptions} selectedInvoiceTemplate={selectedInvoiceTemplate} handleInvoiceTemplateChange={handleInvoiceTemplateChange} tempSelectedInvoiceTags={tempSelectedInvoiceTags} handleInvoiceCheckboxChange={handleInvoiceCheckboxChange} filteredInvoiceTags={filteredInvoiceTags} isAnyCheckboxInvoiceChecked={isAnyCheckboxInvoiceChecked} handleInvoiceAddTags={handleInvoiceAddTags} searchInvoiceTerm={searchInvoiceTerm} handleInvoiceSearchChange={handleInvoiceSearchChange} />
          </>
        );
      case "Create organizer":
        return (
          <>
            <Box ml={2}>Account tags updated</Box>
          </>
        );
      case "Send email":
        return (
          <>
            <SendEmail isConditionsFormOpen={isConditionsFormOpen} handleGoBack={handleGoBack} handleAddConditions={handleAddConditions} selectedTags={selectedTags} selectedTagElements={selectedTagElements} emailTemplateOptions={emailTemplateOptions} selectedEmailTemplate={selectedEmailTemplate} handleEmailTemplateChange={handleEmailTemplateChange} tempSelectedTags={tempSelectedTags} handleCheckboxChange={handleCheckboxChange} filteredTags={filteredTags} isAnyCheckboxChecked={isAnyCheckboxChecked} handleAddTags={handleAddTags} searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
          </>
        );
      // Add cases for other actions here
      default:
        return null;
    }
  };
  const handleDeleteItems = (id) => {
    // Filter out the folder with the given id
    const updatedItems = items.filter((item) => item.id !== id);
    // Update the ids of remaining folders
    const updatedItemsWithIds = updatedItems.map((item, index) => ({ ...item, id: index + 1 }));
    setItems(updatedItemsWithIds);
  };
  // Function to render header content based on action

  const [automations, setAutomations] = useState([]);

  const [stageAutomations, setStageAutomations] = useState({});

  useEffect(() => {
    // Initialize state for each stage
    const initialAutomations = stages.reduce((acc, stage, index) => {
      acc[index] = []; // Assuming each stage starts with no automations
      return acc;
    }, {});
    setStageAutomations(initialAutomations);
  }, [stages]);

  const handleSaveAutomations = (stageIndex) => {
    // Construct saved automations specific to the current stage
    const newAutomations = items.map((item) => {
      const automationData = {
        id: item.id,
        action: item.action,
      };

      // Capture additional data for specific actions
      if (item.action === "Send email") {
        automationData.templates = selectedEmailTemplate;
        automationData.conditions = selectedTags;
      }
      if (item.action === "Send invoice") {
        automationData.templates = selectedInvoiceTemplate;
        automationData.conditions = selectedInvoiceTags;
      }

      return automationData;
    });

    // Append new automations to the existing automations for the specified stage in `stages`
    setStages((prevStages) => {
      const updatedStages = [...prevStages];
      const existingAutomations = updatedStages[stageIndex].automations || [];
      updatedStages[stageIndex] = {
        ...updatedStages[stageIndex],
        automations: [...existingAutomations, ...newAutomations], // Append new automations
      };

      return updatedStages;
    });

    // Append new automations to the existing automations for the specified stage in `automations`
    setAutomations((prevAutomations) => {
      const updatedAutomations = [...prevAutomations];
      const existingAutomations = updatedAutomations[stageIndex] || [];
      updatedAutomations[stageIndex] = [...existingAutomations, ...newAutomations]; // Append new automations

      return updatedAutomations;
    });

    //console.log("Saved Automations for Stage", stageIndex, ":", newAutomations);
    setAutoFormOpen(false);
    // setItems([]); // Clear items after saving
  };

  const renderAutomationsForStage = (index) => {
    const automationsForStage = automations[index] || []; // Get automations for the specific stage
    return (
      <Box>
        <List>
          {automationsForStage.map((automation) => (
            <Paper elevation={3} sx={{ borderRadius: "10px" }}>
              <li key={automation.id} style={{ textAlign: "left", listStyle: "none", padding: "15px", marginTop: 10, borderRadius: "5px" }}>
                <Box sx={{ fontWeight: "bold" }}>
                  {automation.id}.{automation.action}
                </Box>
                {automation.templates.label} <br />
                <Typography sx={{ fontWeight: "bold" }}>Conditions</Typography>
                {automation.conditions.map((condition) => (
                  <Box key={condition._id}>
                    <span
                      style={{
                        backgroundColor: condition.tagColour,
                        borderRadius: "20px",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: "600",
                        textAlign: "center",
                        padding: "2px 8px",
                        display: "inline-block",
                        width: `${calculateWidth(condition.tagName)}px`,
                      }}
                    >
                      {condition.tagName}
                    </span>
                  </Box>
                ))}
              </li>
            </Paper>
          ))}
        </List>
      </Box>
    );
  };
  return (
    <Container>
      {!showForm ? (
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleCreatePipeline} sx={{ mb: 3 }}>
            Create Pipeline
          </Button>

          <MaterialReactTable columns={columns} table={table} />
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
                <Typography variant="h5" gutterBottom>
                  {" "}
                  Create Pipelines
                </Typography>
                <Box mt={2} mb={2}>
                  <hr />
                </Box>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={5.8}>
                    <Box>
                      {/* <InputLabel className="pipeline-lable">Pipeline Name</InputLabel> */}
                      <label className="pipeline-lable">Pipeline Name</label>
                      <TextField
                        fullWidth
                        value={pipelineName}
                        onChange={(e) => setPipelineName(e.target.value)}
                        error={!!pipelineNameError}
                        // helperText={pipelineNameError}
                        sx={{ mt: 1.5, backgroundColor: "#fff" }}
                        size="small"
                        placeholder="Pipeline Name"
                      />
                      {!!pipelineNameError && (
                        <Alert
                          sx={{
                            width: "96%",
                            p: "0", // Adjust padding to control the size
                            pl: "4%",
                            height: "23px",
                            borderRadius: "10px",
                            borderTopLeftRadius: "0",
                            borderTopRightRadius: "0",
                            fontSize: "15px",
                            display: "flex",
                            alignItems: "center", // Center content vertically
                            "& .MuiAlert-icon": {
                              fontSize: "16px", // Adjust the size of the icon
                              mr: "8px", // Add margin to the right of the icon
                            },
                          }}
                          variant="filled"
                          severity="error"
                        >
                          {pipelineNameError}
                        </Alert>
                      )}
                    </Box>
                    <Box mt={1}>
                      <label className="pipeline-lable">Available To</label>
                      <Autocomplete
                        multiple
                        sx={{ marginTop: "8px", backgroundColor: "#fff" }}
                        options={options}
                        size="small"
                        getOptionLabel={(option) => option.label}
                        value={selectedUser}
                        onChange={handleUserChange}
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
                            <TextField {...params} variant="outlined" error={!!userError} placeholder="Available To" />
                            {!!userError && (
                              <Alert
                                sx={{
                                  width: "96%",
                                  p: "0", // Adjust padding to control the size
                                  pl: "4%",
                                  height: "23px",
                                  borderRadius: "10px",
                                  borderTopLeftRadius: "0",
                                  borderTopRightRadius: "0",
                                  fontSize: "15px",
                                  display: "flex",
                                  alignItems: "center", // Center content vertically
                                  "& .MuiAlert-icon": {
                                    fontSize: "16px", // Adjust the size of the icon
                                    mr: "8px", // Add margin to the right of the icon
                                  },
                                }}
                                variant="filled"
                                severity="error"
                              >
                                {userError}
                              </Alert>
                            )}
                          </>
                        )}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                      />
                    </Box>
                    <Box mt={2}>
                      {/* <InputLabel sx={{ color: 'black' }}>Sort jobs by</InputLabel> */}
                      <label className="pipeline-lable">Sort jobs by</label>
                      <Autocomplete
                        className="select-dropdown"
                        options={optionsort} // The array of options
                        value={selectedSortByJob} // The currently selected value
                        onChange={(event, newValue) => handleSortingByJobs(newValue)} // Handle selection change
                        getOptionLabel={(option) => option.label || ""} // Display label for each option
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
                              placeholder="Sort By Job"
                              size="small"
                              error={!!sortByJobError}
                              // helperText={sortByJobError}
                              sx={{ width: "100%", marginTop: "8px", backgroundColor: "#fff" }}
                              variant="outlined"
                              InputLabelProps={{ shrink: true }}
                            />
                            {!!sortByJobError && (
                              <Alert
                                sx={{
                                  width: "96%",
                                  p: "0", // Adjust padding to control the size
                                  pl: "4%",
                                  height: "23px",
                                  borderRadius: "10px",
                                  borderTopLeftRadius: "0",
                                  borderTopRightRadius: "0",
                                  fontSize: "15px",
                                  display: "flex",
                                  alignItems: "center", // Center content vertically
                                  "& .MuiAlert-icon": {
                                    fontSize: "16px", // Adjust the size of the icon
                                    mr: "8px", // Add margin to the right of the icon
                                  },
                                }}
                                variant="filled"
                                severity="error"
                              >
                                {sortByJobError}
                              </Alert>
                            )}
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
                        value={selectedtemp}
                        onChange={(event, newValue) => handletemp(newValue)}
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
                        renderInput={(params) => (
                          <>
                            <TextField
                              {...params}
                              error={!!templateError}
                              // helperText={templateError}
                              sx={{ backgroundColor: "#fff" }}
                              placeholder="Default job template"
                              variant="outlined"
                              size="small"
                            />
                            {!!templateError && (
                              <Alert
                                sx={{
                                  width: "96%",
                                  p: "0", // Adjust padding to control the size
                                  pl: "4%",
                                  height: "23px",
                                  borderRadius: "10px",
                                  borderTopLeftRadius: "0",
                                  borderTopRightRadius: "0",
                                  fontSize: "15px",
                                  display: "flex",
                                  alignItems: "center", // Center content vertically
                                  "& .MuiAlert-icon": {
                                    fontSize: "16px", // Adjust the size of the icon
                                    mr: "8px", // Add margin to the right of the icon
                                  },
                                }}
                                variant="filled"
                                severity="error"
                              >
                                {templateError}
                              </Alert>
                            )}
                          </>
                        )}
                        sx={{ width: "100%", marginTop: "8px" }}
                        clearOnEscape // Enable clearable functionality
                      />
                    </Box>

                    <Box mt={3}>
                      <Typography variant="h6">Job card fields</Typography>
                      <Grid container spacing={5} mt={2}>
                        <Grid item xs={4}>
                          <Box mt={2}>
                            <FormControlLabel control={<Switch checked={Account_id} onChange={handleAccount_idChange} color="primary" />} label={"Account ID"} />
                          </Box>
                          <Box mt={2}>
                            <FormControlLabel control={<Switch checked={Days_on_stage} onChange={handleDays_on_stageChange} color="primary" />} label={"Days on stage"} />
                          </Box>
                          <Box mt={2}>
                            <FormControlLabel control={<Switch checked={Account_tags} onChange={handleAccount_tagsChange} color="primary" />} label={"Account tags"} />
                          </Box>
                        </Grid>

                        <Grid item xs={4}>
                          <Box mt={2}>
                            <FormControlLabel control={<Switch checked={startDate} onChange={handleStartDateChange} color="primary" />} label={"Start date"} />
                          </Box>
                          <Box mt={2}>
                            <FormControlLabel control={<Switch checked={Name} onChange={handleNameSwitchChange} color="primary" />} label={"Name"} />
                          </Box>
                          <Box mt={2}>
                            <FormControlLabel control={<Switch checked={Due_date} onChange={handleDue_dateChange} color="primary" />} label={"Due date"} />
                          </Box>
                        </Grid>

                        <Grid item xs={4}>
                          <Box mt={2}>
                            <FormControlLabel control={<Switch checked={Description} onChange={handleDescriptionChange} color="primary" />} label={"Description"} />
                          </Box>
                          <Box mt={2}>
                            <FormControlLabel control={<Switch checked={Assignees} onChange={handleAssigneesChange} color="primary" />} label={"Assignees"} />
                          </Box>
                          <Box mt={2}>
                            <FormControlLabel control={<Switch checked={Priority} onChange={handlePriorityChange} color="primary" />} label={"Priority"} />
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={0.4} sx={{ display: { xs: "none", sm: "block" } }}>
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
                <Box mt={5} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                  <Typography variant="h6">Stages</Typography>
                  <Button variant="contained" startIcon={<LuPlusCircle />} onClick={handleAddStage}>
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
                          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                          width: isSmallScreen ? "90%" : "20%",
                          marginBottom: "20px",
                          marginLeft: isSmallScreen ? "0" : "5px",
                          alignSelf: isSmallScreen ? "center" : "flex-start",
                        }}
                      >
                        <Box sx={{ margin: "10px" }}>
                          <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <RxDragHandleDots2 />
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", flexGrow: 1 }}>
                              <LuPenLine />
                              <TextField variant="outlined" placeholder="Stage Name" sx={{ flexGrow: 1 }} size="small" margin="normal" value={stage.name} onChange={(e) => handleStageNameChange(e, index)} />
                            </Box>
                            <IconButton onClick={() => handleDeleteStage(index)}>
                              <RiDeleteBin6Line sx={{ color: "red", cursor: "pointer" }} />
                            </IconButton>
                          </Box>
                          <Divider />
                          <Box m={2}>
                            <Typography variant="h6" sx={{ fontSize: "15px", fontWeight: "bold" }}>
                              Stage conditions
                            </Typography>
                            {index === 0 ? <Typography variant="body2">First stage can't have conditions</Typography> : index === stages.length - 1 ? <Typography variant="body2">Last stage can't have conditions</Typography> : <Typography variant="body2">Job enters this stage if conditions are met</Typography>}
                            {index > 0 && index !== stages.length - 1 && (
                              <Box sx={{ marginTop: "10px" }}>
                                <Typography variant="body2" sx={{ cursor: "pointer", color: "blue", fontWeight: "bold" }}>
                                  Add conditions
                                </Typography>
                              </Box>
                            )}

                            <Typography variant="h6" sx={{ fontSize: "15px", fontWeight: "bold", mt: 2 }}>
                              Automations
                            </Typography>
                            <Typography variant="body2">Triggered when job enters stage</Typography>
                            <Typography variant="body2" sx={{ cursor: "pointer", color: "blue", fontWeight: "bold", mt: 2 }} onClick={() => handleToggleAutoMoveDropdown(index)}>
                              Added automation
                            </Typography>

                            <Box>{renderAutomationsForStage(index)}</Box>

                            <Typography variant="h6" sx={{ fontSize: "15px", mt: 2, fontWeight: "bold" }}>
                              Automove
                            </Typography>
                            <Typography variant="body2">Move jobs automatically when linked actions are completed</Typography>

                            {showAutoMoveDropdown[index] && (
                              <div className="automove-dropdown">
                                {automoveActions.map((action, idx) => (
                                  <li key={idx} onClick={() => handleActionSelect(action)}>
                                    {action}
                                  </li>
                                ))}
                              </div>
                            )}

                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                              <Switch onChange={() => handleAutoMoveChange(index)} checked={stage.autoMove} color="primary" />
                              <Typography sx={{ cursor: "pointer" }}>Automove jobs</Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* dedit */}
                        <Drawer anchor="right" open={isAutoFormOpen && !!activeAction} onClose={handleFormClose} PaperProps={{ sx: { width: 550 } }}>
                          <Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
                              <Typography variant="h4">Automations</Typography>
                              <IconButton onClick={handleFormClose}>
                                <RxCross2 />
                              </IconButton>
                            </Box>
                            <Box>
                              <Box style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
                                <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                  {items.map((item, index) => (
                                    <Box key={item.id}>
                                      <Box style={{ border: "1px solid #B2BEB5", borderRadius: "10px", padding: "10px" }}>
                                        <Box style={{ display: "flex", gap: "10px", fontSize: "20px", fontWeight: "550", justifyContent: "space-between", alignItems: "center" }}>
                                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <RxDragHandleDots2 /> {item.id}. {item.action}
                                          </Box>

                                          <IconButton onClick={() => handleDeleteItems(item.id)}>
                                            <RiDeleteBin6Line />
                                          </IconButton>
                                        </Box>
                                        {renderActionContent(item.action, item.conditions, item.templates)}
                                      </Box>
                                    </Box>
                                  ))}
                                </Box>
                                <Box>
                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      alignItems: "center",
                                      cursor: "pointer",
                                      margin: "15px 0",
                                    }}
                                  >
                                    <LuPlusCircle style={{ color: "blue" }} />
                                    <li
                                      style={{
                                        listStyle: "none",
                                        cursor: "pointer",
                                        color: "blue",
                                        fontWeight: "bold",
                                      }}
                                      onClick={() => setShowAutoMovesDropdown(!showAutoMovesDropdown)}
                                    >
                                      add automove
                                    </li>
                                  </Box>
                                  {showAutoMovesDropdown && (
                                    <Box className="automove-dropdown2">
                                      <List>
                                        {automoveActionsForm.map((action, index) => (
                                          <li key={index} onClick={() => handleAddItems(action)}>
                                            {action}
                                          </li>
                                        ))}
                                      </List>
                                    </Box>
                                  )}
                                </Box>
                                <Box>
                                  <Button onClick={() => handleSaveAutomations(index)} variant="contained" color="primary" sx={{ marginTop: "15px" }}>
                                    Save
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Drawer>
                      </Paper>
                    ))}
                    <Box mt={3}>
                      <Button variant="contained" startIcon={<LuPlusCircle />} onClick={handleAddStage}>
                        Add stage
                      </Button>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ pt: 2, display: "flex", alignItems: "center", gap: 5 }}>
                  <Button variant="contained" color="primary" onClick={createPipe}>
                    Save & exit
                  </Button>
                  <Button variant="contained" color="primary" onClick={createSavePipe}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={handleClosePipelineTemp}>
                    Cancel
                  </Button>
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
