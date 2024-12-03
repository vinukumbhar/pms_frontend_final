import React, { useState, useEffect, useMemo } from 'react';
import Section from './organizertempSection';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box, Button, TextField, IconButton, Typography, Alert, Table, TableBody, TableCell, TableHead, TableRow, Paper, Dialog,
  DialogContent,
  Drawer, InputLabel,
  LinearProgress, Select, MenuItem, Tooltip,
  FormControl, FormControlLabel, Switch, FormGroup
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IoClose } from "react-icons/io5";
const OrganizersTemp = () => {

  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const navigate = useNavigate();
  // const handlePreview = () => {
  //   // Gather all the necessary data for the preview
  // const data = {

  //   sections, // This contains all your sections and their elements
  // };

  // // You can also use any other required data from your state here
  // console.log("Data for preview:", data);

  //   // Navigate to the desired path with data if necessary (you might want to pass it through state)
  //   navigate('/organizerpreview', { state: { data } });
  // };

  const [templateName, setTemplateName] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  // const [sectionSettings, setSectionSettings] = useState({}); 
  const handleSectionSaveData = (settings) => {
    // Update the specific section with the new settings
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === selectedSection.id
          ? { ...section, sectionSettings: settings }
          : section
      )
    );
  };
  const addSection = () => {
    const newSection = {
      id: Date.now(), name: `Section ${sections.length + 1}`, text: '', formElements: [], sectionSettings: {
        sectionRepeatingMode: false,
        buttonName: '',
        conditional: false,
        mode: '',
        conditions: [
          {
            question: '',
            answer: ''
          }
        ]
      }
    };
    setSections([...sections, newSection]);
    setSelectedSection(newSection);

  };
  console.log(sections)
  // console.log(selectedSection)

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const handleDeleteSection = (id) => {
    const newSections = sections.filter(section => section.id !== id);
    setSections(newSections);
    if (selectedSection && selectedSection.id === id) {
      setSelectedSection(null);
    }
  };
  const handleUpdateSection = (id, newText, newFormElements, newSectionSettings) => {
    setSections(prevSections => prevSections.map(section =>
      section.id === id
        ? {
          ...section,
          text: newText,
          formElements: newFormElements,
          sectionSettings: {
            ...section.sectionSettings, // retain existing settings
            ...newSectionSettings // apply updates
          }
        }
        : section
    ));
  };
  const handleDuplicateSection = (sectionId) => {
    const sectionToDuplicate = sections.find(section => section.id === sectionId);
    if (sectionToDuplicate) {
      const duplicatedSection = {
        ...sectionToDuplicate,
        text: `${sectionToDuplicate.text} (Copy)`,
        id: Date.now(), // Assign a new ID for the duplicated section
      };
      setSections([...sections, duplicatedSection]);
    }
  };
  const [showOrganizerTemplateForm, setShowOrganizerTemplateForm] = useState(false);

  const handleCreateInvoiceClick = () => {
    setShowOrganizerTemplateForm(true);
  };
  function truncateText(text, maxWords) {
    const words = text.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + ' ..';
    }
    return text;
  }
  const handleFormSave = (elementId, formData) => {
    setSections(prevSections =>
      prevSections.map(section => ({
        ...section,
        formElements: section.formElements.map(el =>
          el.id === elementId ? { ...el, questionsectionsettings: formData } : el
        )
      }))
    );
  };
  const saveandexitOrganizerTemp = () => {

    console.log(sections)
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const organizersettings = {
      notifyaboutdocumentupload: loginChecked, // Example state
      organizerselfservice: notifyChecked,          // Example state
      automaticallysealaftersubmission: emailSyncChecked, // Example state
      sendreminderstoclient: autoSaveChecked,        // Example state
      daysuntilnextreminder: daysuntilNextReminder,        // Example state
      numberofreminders: noOfReminder                 // Example state
    };
  

    const raw = JSON.stringify({
      templatename: templateName,
      organizerName: organizerName,

      sections: sections.map(section => ({
        name: section.text,
        text: section.text,
        id: section.id.toString(),
        sectionsettings: section.sectionSettings || {},
        formElements: section.formElements.map(element => ({
          type: element.type,
          id: element.id,
          sectionid: element.sectionid,
          options: element.options.map(option => ({
            id: option.id,
            text: option.text
          })),
          text: element.text,

          questionsectionsettings: element.questionsectionsettings || {}
        })),

      })),
      organizersettings: organizersettings, 
      active: true
    });

    console.log(raw)
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result && result.message === "Organizer Template created successfully") {
          toast.success("Organizer Template created successfully");
          setShowOrganizerTemplateForm(false);
          setTemplateName('');
          setOrganizerName('');
          setSections([]);
          setSelectedSection(null);
          fetchOrganizerTemplates();
          setNotifyChecked(false);
          setLoginChecked(false);
          setAutoSaveChecked(false);
          setEmailSyncChecked(false);
          setNoOfReminder(1);
          setDaysuntilNextReminder(3);

        } else {
          toast.error(result.error || "Failed to create Organizer Template");
        }
      })
      .catch((error) => console.error(error));
  }
  const saveOrganizerTemp = () => {

    console.log(sections)
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const organizersettings = {
      notifyaboutdocumentupload: loginChecked, // Example state
      organizerselfservice: notifyChecked,          // Example state
      automaticallysealaftersubmission: emailSyncChecked, // Example state
      sendreminderstoclient: autoSaveChecked,        // Example state
      daysuntilnextreminder: daysuntilNextReminder,        // Example state
      numberofreminders: noOfReminder                 // Example state
    };

    const raw = JSON.stringify({
      templatename: templateName,
      organizerName: organizerName,
      sections: sections.map(section => ({
        name: section.text,
        text: section.text,
        id: section.id.toString(),
        sectionsettings: section.sectionSettings || {},
        formElements: section.formElements.map(element => ({
          type: element.type,
          id: element.id,
          sectionid: element.sectionid,
          options: element.options.map(option => ({
            id: option.id,
            text: option.text
          })),
          text: element.text,
          questionsectionsettings: element.questionsectionsettings || {}
        })),

      })),
      organizersettings: organizersettings,
      active: true
    });

    console.log(raw)
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result && result.message === "Organizer Template created successfully") {
          toast.success("Organizer Template created successfully");


        } else {
          toast.error(result.error || "Failed to create Organizer Template");
        }
      })
      .catch((error) => console.error(error));
  }
  const [organizerTemplatesData, setOrganizerTemplatesData] = useState([]);
  const fetchOrganizerTemplates = async () => {
    try {
      const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch email templates');
      }
      const data = await response.json();

      setOrganizerTemplatesData(data.OrganizerTemplates);

    } catch (error) {
      console.error('Error fetching email templates:', error);

    }
  };
  const handleEdit = (_id) => {
    navigate('OrganizerTempUpdate/' + _id)

  };
  //delete template
  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm("Are you sure you want to delete this organizer template?");

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow"
      };
      const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/`;
      fetch(url + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete item');
          }
          return response.text();
        })
        .then((result) => {
          console.log(result);
          toast.success('Item deleted successfully');
          fetchOrganizerTemplates();
          // setshowOrganizerTemplateForm(false);
        })
        .catch((error) => {
          console.error(error);
          toast.error('Failed to delete item');
        });
    }
  };
  useEffect(() => {
    fetchOrganizerTemplates();
  }, []);
  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
  };

  const [isFormDirty, setIsFormDirty] = useState(false);
  const handleCancel = () => {

    if (isFormDirty) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmClose) {
        return;
      }
    }
    setShowOrganizerTemplateForm(false);
  };

  // Detect form changes
  useEffect(() => {
    if (templateName || organizerName) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [templateName, organizerName]);

  const [templateNameError, setTemplateNameError] = useState('');
  const [organizerError, setOrganizerError] = useState('');

  const validateForm = () => {
    let isValid = true;
    if (!templateName) {
      setTemplateNameError("Template name is required");

      isValid = false;
    } else {
      setTemplateNameError('');
    }

    if (!organizerName) {
      setOrganizerError('Organizer name is required');
      isValid = false;
    } else {
      setOrganizerError('');
    }
    return isValid;
  };

  const handleDuplicateTemplate = async (templateId) => {
    // Find the template by its ID
    const templateToDuplicate = organizerTemplatesData.find(template => template._id === templateId);
    if (!templateToDuplicate) {
      toast.error('Template not found');
      return;
    }
    // Create a new template object (with new ID and modified template name)
    const duplicatedTemplate = {
      ...templateToDuplicate,
      templatename: `${templateToDuplicate.templatename} (Copy)`, // Indicate it's a duplicate
      // _id: undefined, // Remove the ID since we want to create a new one
      sections: templateToDuplicate.sections.map(section => ({
        ...section,
        id: Date.now().toString() + section.id, // Generate a new unique ID for the section
      })),
    };
    try {
      // Prepare request options
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify(duplicatedTemplate);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      // Send the duplicated template to the server
      const response = await fetch(`${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate`, requestOptions);
      const result = await response.json();

      if (result.message === "Organizer Template created successfully") {
        toast.success("Template duplicated successfully");
        fetchOrganizerTemplates(); // Refresh the list after duplication
      } else {
        toast.error(result.error || "Failed to duplicate template");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error duplicating template");
    }
  };

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const handlePreview = () => {
    setPreviewDialogOpen(true); // Open the dialog
    const data = {

      sections, // This contains all your sections and their elements
    };

    // You can also use any other required data from your state here
    console.log("Data for preview:", data);
  };

  const handleClosePreview = () => {
    setPreviewDialogOpen(false); // Close the dialog
  };

  const [startDate, setStartDate] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  // const totalSteps = sections.length;

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleNext = () => {
    if (activeStep < totalSteps - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleDropdownChange = (event) => {
    const selectedIndex = event.target.value;
    setActiveStep(selectedIndex);
  };

  const [radioValues, setRadioValues] = useState({});
  const [checkboxValues, setCheckboxValues] = useState({});
  const [answeredElements, setAnsweredElements] = useState({});

  const handleRadioChange = (value, elementText) => {
    setRadioValues((prevValues) => ({
      ...prevValues,
      [elementText]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [elementText]: true,
    }));
  };

  const handleCheckboxChange = (value, elementText) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [elementText]: {
        ...prevValues[elementText],
        [value]: !prevValues[elementText]?.[value],
      },
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [elementText]: true,
    }));
  };

  const [selectedValue, setSelectedValue] = useState(null);
  const handleChange = (event, elementText) => {
    setSelectedValue(event.target.value);
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [elementText]: true,
    }));
  };

  const [inputValues, setInputValues] = useState({});
  const handleInputChange = (event, elementText) => {
    const { value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [elementText]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [elementText]: true,
    }));
  };

  const [selectedDropdownValue, setSelectedDropdownValue] = useState('');
  const handleDropdownValueChange = (event, elementText) => {
    setSelectedDropdownValue(event.target.value);
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [elementText]: true,
    }));
  };

  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.innerText || tempDiv.textContent || '';
  };

  // const shouldShowElement = (element) => {
  //   if (!element.questionsectionsettings?.conditional) return true;

  //   const condition = element.questionsectionsettings?.conditions?.[0];
  //   // if (condition && condition.question && condition.answer) {
  //   //   return condition.answer === radioValues[condition.question];
  //   // }
  //   if (condition && condition.question && condition.answer) {
  //     // return condition.answer === radioValues[condition.question];
  //      // Check radio values
  //      if (radioValues[condition.question] === condition.answer) {
  //       return true;
  //   }

  //   // Check checkbox values
  //   if (checkboxValues[condition.question] === condition.answer) {
  //       return true;
  //   }

  //   // Check dropdown value
  //   if (selectedDropdownValue === condition.answer) {
  //       return true;
  //   }

  //   // If none match, return false
  //   // return false;
  //   }
  //   return true;
  // };


//   const shouldShowElement = (element) => {
//     if (!element.questionsectionsettings?.conditional) return true;

//     const condition = element.questionsectionsettings?.conditions?.[0];

//     if (condition && condition.question && condition.answer) {
//         const radioAnswer = radioValues[condition.question];
//         const checkboxAnswer = checkboxValues[condition.question];
//         const dropdownAnswer = selectedDropdownValue;

//         // For radio buttons
//         if (radioAnswer !== undefined && condition.answer === radioAnswer) {
//             return true;
//         }

//         // For checkboxes: check if the condition answer is in the selected checkbox values
//         if (checkboxAnswer && checkboxAnswer[condition.answer]) {
//             return true;
//         }

//         // For dropdowns: check if the condition answer matches the selected dropdown value
//         if (dropdownAnswer !== undefined && condition.answer === dropdownAnswer) {
//             return true;
//         }

//         return false;
//     }
//     return true;
// };



const shouldShowElement = (element) => {
  const settings = element.questionsectionsettings;

  // If the element isn't conditional, show it by default
  if (!settings?.conditional) return true;

  const conditions = settings?.conditions || [];

  // Check if all conditions are satisfied
  for (const condition of conditions) {
      const { question, answer } = condition;

      if (question && answer) {
          const radioAnswer = radioValues[question];
          const checkboxAnswer = checkboxValues[question];
          const dropdownAnswer = selectedDropdownValue;

          // For radio buttons
          if (radioAnswer !== undefined && radioAnswer === answer) {
              continue;
          }

          // For checkboxes: check if the condition answer is in the selected checkbox values
          if (checkboxAnswer && checkboxAnswer[answer]) {
              continue;
          }

          // For dropdowns: check if the condition answer matches the selected dropdown value
          if (dropdownAnswer !== undefined && dropdownAnswer === answer) {
              continue;
          }

          // If any condition is not satisfied, hide the element
          return false;
      }
  }

  // All conditions are satisfied, show the element
  return true;
};


  const totalElements = sections[activeStep]?.formElements.length || 0;
  const answeredCount = sections[activeStep]?.formElements.filter(
    (element) => answeredElements[element.text]
  ).length || 0;

  // Check whether to display the section
  // const shouldShowSection = (sections) => {
  //   if (!sections.sectionsettings?.conditional) return true;

  //   const condition = sections.sectionsettings?.conditions?.[0];
  //   if (condition && condition.question && condition.answer) {
  //     // return condition.answer === radioValues[condition.question];
  //      // Check radio values
  //      if (radioValues[condition.question] === condition.answer) {
  //       return true;
  //   }

  //   // Check checkbox values
  //   if (checkboxValues[condition.question] === condition.answer) {
  //       return true;
  //   }

  //   // Check dropdown value
  //   if (selectedDropdownValue === condition.answer) {
  //       return true;
  //   }

  //   // If none match, return false
  //   // return false;
  //   }
  //   return true;
  // };
//   const shouldShowSection = (section) => {
//     if (!section.sectionsettings?.conditional) return true;

//     const condition = section.sectionsettings?.conditions?.[0];
//     if (condition && condition.question && condition.answer) {
//         const radioAnswer = radioValues[condition.question];
//         const checkboxAnswer = checkboxValues[condition.question];
//         const dropdownAnswer = selectedDropdownValue;

//         // For radio buttons
//         if (radioAnswer !== undefined && condition.answer === radioAnswer) {
//             return true;
//         }

//         // For checkboxes: check if the condition answer is in the selected checkbox values
//         if (checkboxAnswer && checkboxAnswer[condition.answer]) {
//             return true;
//         }

//         // For dropdowns: check if the condition answer matches the selected dropdown value
//         if (dropdownAnswer !== undefined && condition.answer === dropdownAnswer) {
//             return true;
//         }

//         return false;
//     }

//     return true;
// };

// const shouldShowSection = (section) => {
//   const settings = section.sectionSettings;

//   if (!settings?.conditional) return true;

//   const conditions = settings?.conditions || [];

//   // Show the section if any condition is satisfied
//   return conditions.some((condition) => {
//       const { question, answer } = condition;

//       if (question && answer) {
//           const radioAnswer = radioValues[question];
//           const checkboxAnswer = checkboxValues[question];
//           const dropdownAnswer = selectedDropdownValue;

//           if (radioAnswer === answer) return true;
//           if (checkboxAnswer && checkboxAnswer[answer]) return true;
//           if (dropdownAnswer === answer) return true;
//       }

//       return false;
//   });
// };
const shouldShowSection = (section) => {
  const settings = section.sectionSettings;

  // If the section isn't conditional, show it by default
  if (!settings?.conditional) return true;

  const conditions = settings?.conditions || [];

  // Check if every condition is satisfied
  return conditions.every((condition) => {
      const { question, answer } = condition;

      if (question && answer) {
          const radioAnswer = radioValues[question];
          const checkboxAnswer = checkboxValues[question];
          const dropdownAnswer = selectedDropdownValue;

          // For radio buttons
          if (radioAnswer === answer) return true;

          // For checkboxes: check if the condition answer is in the selected checkbox values
          if (checkboxAnswer && checkboxAnswer[answer]) return true;

          // For dropdowns: check if the condition answer matches the selected dropdown value
          if (dropdownAnswer === answer) return true;
      }

      // If a condition is not satisfied, return false
      return false;
  });
};


  // const getVisibleSections = () => {
  //     return sections.filter(shouldShowSection);
  // };
  const getVisibleSections = () => sections.filter(shouldShowSection);

  const visibleSections = getVisibleSections();
  const totalSteps = visibleSections.length;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));


  const [loginChecked, setLoginChecked] = useState(false);
  const [notifyChecked, setNotifyChecked] = useState(false);
  const [emailSyncChecked, setEmailSyncChecked] = useState(false);
  const [autoSaveChecked, setAutoSaveChecked] = useState(false);

  // Handlers for toggling switches
  const handleLoginToggle = (checked) => {
    setLoginChecked(checked);
  };

  const handleNotifyToggle = (checked) => {
    setNotifyChecked(checked);
  };

  const handleEmailSyncToggle = (checked) => {
    setEmailSyncChecked(checked);
  };

  const handleAutoSaveToggle = (checked) => {
    setAutoSaveChecked(checked);
  };
  const [daysuntilNextReminder, setDaysuntilNextReminder] = useState('3');
  const [noOfReminder, setNoOfReminder] = useState(1);
  return (
    <Box p={3}>
      {!showOrganizerTemplateForm && (
        <Box sx={{ mt: 2 }}>

          <Button variant="contained" onClick={handleCreateInvoiceClick} sx={{ mb: 3 }}>Create Template</Button>
          {/* <MaterialReactTable columns={columns} table={table} /> */}
          <Paper>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Template Name</strong></TableCell>
                  <TableCell><strong>Used in Pipelines</strong></TableCell>
                  <TableCell><strong></strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {organizerTemplatesData.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>
                      <Typography
                        sx={{ color: '#2c59fa', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => handleEdit(row._id)}
                      >
                        {row.templatename}
                      </Typography>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell sx={{ textAlign: 'end' }}>
                      <IconButton onClick={() => toggleMenu(row._id)} style={{ color: '#2c59fa' }}>
                        <CiMenuKebab style={{ fontSize: '25px' }} />
                        {openMenuId === row._id && (
                          <Box
                            sx={{
                              position: 'absolute',
                              zIndex: 1,
                              backgroundColor: '#fff',
                              boxShadow: 1,
                              borderRadius: 1,
                              p: 1,
                              // left:0,
                              right: '30px',
                              m: 2,
                              top: '10px', width: '150px', textAlign: 'start'
                            }}
                          >
                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Publice to Marketplace</Typography>
                            <Typography
                              sx={{ fontSize: '12px', fontWeight: 'bold' }}
                              onClick={() => handleEdit(row._id)}
                            >
                              Edit
                            </Typography>
                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }} onClick={() => handleDuplicateTemplate(row._id)}>Duplicate</Typography>
                            <Typography
                              sx={{ fontSize: '12px', color: 'red', fontWeight: 'bold' }}
                              onClick={() => handleDelete(row._id)}
                            >
                              Delete
                            </Typography>
                          </Box>
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

        </Box>
      )}
      {showOrganizerTemplateForm && (
        <>
          <Box>
            <Box sx={{ display: 'flex', alighItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant='h4'>Create Template</Typography>
              <Box>
                <Button variant="text" onClick={handlePreview} >Preview</Button>
                <Button variant="text" onClick={handleDrawerOpen} >Setting</Button>
              </Box>

            </Box>
            <Box>
              <label className='organizer-input-label'>Template Name</label>
              <TextField

                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                fullWidth
                size='small'

                placeholder='Template name'
                sx={{ backgroundColor: '#fff', mt: 2 }}
                className='organizer-input-label'
                error={!!templateNameError}
              />
              {(!!templateNameError) && <Alert sx={{
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
                {templateNameError}
              </Alert>}
            </Box>
            <Box mt={2}>
              <label className='organizer-input-label'>Organizer name</label>
              <TextField

                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                fullWidth
                size='small'
                error={!!organizerError}
                placeholder='Organizer name'
                className='organizer-input-label'
                sx={{ backgroundColor: '#fff', mt: 2 }}
              />
              {(!!organizerError) && <Alert sx={{
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
                {organizerError}
              </Alert>}
            </Box>

          </Box>
          <Box className="organizer-container" sx={{ display: "flex", marginTop: "40px", height: "auto", width: "100%", gap: 3 }}>
            <Box className="left-org-container" sx={{ padding: '10px', width: "30%", height: "auto", p: 2 }}>
              <Box className="smooth-dnd-container vertical" >
                {sections.map((section) => (
                  <Box key={section.id} sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      placeholder={`Section Name`}
                      className='section-name'
                      size='small'
                      margin='normal'
                      value={truncateText(section.text, 5)}
                      InputProps={{
                        readOnly: true
                      }}
                      sx={{ backgroundColor: '#fff' }}
                      onClick={() => handleSectionClick(section)}
                      fullWidth
                    />

                  </Box>
                ))}
              </Box>
              <Box sx={{ width: "50%", height: "25px", marginTop: "20px" }}>
                <Button
                  variant="contained"
                  onClick={addSection}
                >
                  New section
                </Button>
              </Box>
            </Box>
            <Box className="right-container" sx={{ borderRadius: '20px', width: "70%", height: "auto" }}>
              {selectedSection && (
                <Section
                  section={selectedSection}
                  onDelete={handleDeleteSection}
                  onUpdate={handleUpdateSection}
                  onDuplicate={handleDuplicateSection}
                  onSaveFormData={handleFormSave}
                  onSaveSectionData={handleSectionSaveData}
                  sections={sections}
                />
              )}
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: "10px", marginLeft: "10px", marginBottom: "20px", marginTop: '20px' }}>
            <Button type="submit"
              variant="contained"
              color="primary"
              onClick={saveandexitOrganizerTemp}>Save & exit</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={saveOrganizerTemp}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>


          <Drawer
            anchor='right'
            open={isDrawerOpen}
            onClose={handleDrawerClose}
            PaperProps={{
              id: 'tag-drawer',
              sx: {
                borderRadius: isSmallScreen ? '0' : '10px 0 0 10px',
                width: isSmallScreen ? '100%' : 500,
                maxWidth: '100%',
                [theme.breakpoints.down('sm')]: {
                  width: '100%',
                },

              }
            }}
          >
            <Box sx={{ borderRadius: isSmallScreen ? '0' : '15px' }} role="presentation">
              <Box>
                <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: "#EEEEEE" }}>
                  <Typography variant="h6" >
                    Organizer settings
                  </Typography>
                  <IoClose onClick={handleDrawerClose} style={{ cursor: 'pointer' }} />
                </Box>
                <Box sx={{ pr: 2, pl: 2, pt: 2 }}>
                  <FormGroup>
                    {/* Switch for Login */}
                    <FormControlLabel
                      control={<Switch checked={loginChecked} onChange={(event) => handleLoginToggle(event.target.checked)} />}
                      label="Notify about document upload"
                    />
                    {/* Switch for Notify */}
                    <FormControlLabel
                      control={<Switch checked={notifyChecked} onChange={(event) => handleNotifyToggle(event.target.checked)} />}
                      label="Organizer self service"
                    />
                    {/* Switch for Email Sync */}
                    <FormControlLabel
                      control={<Switch checked={emailSyncChecked} onChange={(event) => handleEmailSyncToggle(event.target.checked)} />}
                      label="Automatically seal after submission"
                    />
                    {/* Switch for Auto-Save */}
                    <FormControlLabel
                      control={<Switch checked={autoSaveChecked} onChange={(event) => handleAutoSaveToggle(event.target.checked)} />}
                      label="Send reminders to clients"
                    />

                    {autoSaveChecked && (
                      <Box mb={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 2 }}>

                          <Box>
                            <InputLabel sx={{ color: 'black' }}>Days until next reminder</InputLabel>
                            <TextField
                              // margin="normal"
                              fullWidth
                              name="Daysuntilnextreminder"
                              value={daysuntilNextReminder}
                              onChange={(e) => setDaysuntilNextReminder(e.target.value)}
                              placeholder="Days until next reminder"
                              size="small"
                              sx={{ mt: 2 }}
                            />
                          </Box>

                          <Box>
                            <InputLabel sx={{ color: 'black' }}>No Of reminders</InputLabel>
                            <TextField

                              fullWidth
                              name="No Of reminders"
                              value={noOfReminder}
                              onChange={(e) => setNoOfReminder(e.target.value)}

                              placeholder="NoOfreminders"
                              size="small"
                              sx={{ mt: 2 }}
                            />
                          </Box>

                        </Box>
                      </Box>
                    )}
                  </FormGroup>
                </Box>
              </Box>
            </Box>
          </Drawer>

          <Dialog open={previewDialogOpen} onClose={handleClosePreview} fullScreen >

            <DialogContent >


              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '2px solid #3FA2F6', p: 2, mb: 3, borderRadius: '10px', backgroundColor: '#96C9F4' }}>
                      <Box >
                        <Typography fontWeight='bold'>Preview mode</Typography>
                        <Typography>The client sees your organizer like this</Typography>
                      </Box>
                      <Button variant='text' onClick={handleClosePreview} >Back to edit</Button>
                    </Box>
                    <Typography variant='text' gutterBottom>
                      {organizerName}
                    </Typography>

                    <FormControl fullWidth sx={{ marginBottom: '10px', marginTop: '10px' }}>
                      <Select
                        value={activeStep}
                        onChange={handleDropdownChange}
                        size='small'
                      >
                        {/* {sections.map((section, index) => (
                            <MenuItem key={index} value={index}>
                                {section.text} ({answeredCount}/{totalElements})
                            </MenuItem>
                        ))} */}
                        {visibleSections.map((section, index) => (
                          <MenuItem key={index} value={index}>
                            {section.text} ({answeredCount}/{totalElements})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Box mt={2} mb={2}>
                      <LinearProgress variant="determinate" value={(activeStep + 1) / totalSteps * 100} />
                    </Box>

                    {/* {sections
                    .filter(shouldShowSection) // Filter sections based on conditions
                    .map((section, sectionIndex) => (
                        sectionIndex === activeStep && ( */}
                    <Box sx={{ pl: 20, pr: 20 }}>
                      {visibleSections.map((section, sectionIndex) => (
                        sectionIndex === activeStep && (
                          <Box key={section.text}>
                            {section.formElements.map((element) => (
                              shouldShowElement(element) && (
                                <Box key={element.text} >
                                  {(element.type === 'Free Entry' || element.type === 'Number' || element.type === 'Email') && (
                                    <Box>
                                      <Typography fontSize='18px' mb={1} mt={1}>{element.text}</Typography>
                                      <TextField
                                        variant="outlined"
                                        size='small'
                                        multiline
                                        fullWidth
                                        // margin='normal'
                                        placeholder={`${element.type} Answer`}
                                        inputProps={{
                                          type: element.type === 'Free Entry' ? 'text' : element.type.toLowerCase(),
                                        }}
                                        maxRows={8}
                                        style={{ display: 'block', marginTop: '15px' }}
                                        value={inputValues[element.text] || ''}
                                        onChange={(e) => handleInputChange(e, element.text)}
                                      />
                                    </Box>
                                  )}

                                  {element.type === 'Radio Buttons' && (
                                    <Box>
                                      <Typography fontSize='18px' mb={1} mt={1} >{element.text}</Typography>
                                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {element.options.map((option) => (
                                          <Button
                                            key={option.text}
                                            variant={radioValues[element.text] === option.text ? 'contained' : 'outlined'}
                                            onClick={() => handleRadioChange(option.text, element.text)}
                                          >
                                            {option.text}
                                          </Button>
                                        ))}
                                      </Box>
                                    </Box>
                                  )}

                                  {element.type === 'Checkboxes' && (
                                    <Box>
                                      <Typography fontSize='18px' >{element.text}</Typography>
                                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {element.options.map((option) => (
                                          <Button
                                            key={option.text}
                                            variant={checkboxValues[element.text]?.[option.text] ? 'contained' : 'outlined'}
                                            onClick={() => handleCheckboxChange(option.text, element.text)}
                                          >
                                            {option.text}
                                          </Button>
                                        ))}
                                      </Box>
                                    </Box>
                                  )}

                                  {element.type === 'Yes/No' && (
                                    <Box>
                                      <Typography fontSize='18px' >{element.text}</Typography>
                                      <Box sx={{ display: 'flex', gap: 1 }}>
                                        {element.options.map((option) => (
                                          <Button
                                            key={option.text}
                                            variant={selectedValue === option.text ? 'contained' : 'outlined'}
                                            onClick={(event) => handleChange(event, element.text)}
                                          >
                                            {option.text}
                                          </Button>
                                        ))}
                                      </Box>
                                    </Box>
                                  )}

                                  {element.type === 'Dropdown' && (
                                    <Box>
                                      <Typography fontSize='18px' >{element.text}</Typography>
                                      <FormControl fullWidth>
                                        <Select
                                          value={selectedDropdownValue}
                                          onChange={(event) => handleDropdownValueChange(event, element.text)}
                                          size='small'
                                        >
                                          {element.options.map((option) => (
                                            <MenuItem key={option.text} value={option.text}>
                                              {option.text}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    </Box>
                                  )}

                                  {element.type === 'Date' && (
                                    <Box>
                                      <Typography fontSize='18px' >{element.text}</Typography>
                                      <DatePicker
                                        format="DD/MM/YYYY"
                                        sx={{ width: '100%', backgroundColor: '#fff' }}
                                        selected={startDate}
                                        onChange={handleStartDateChange}
                                        renderInput={(params) => <TextField {...params} size="small" />}
                                        onOpen={() => setAnsweredElements((prevAnswered) => ({
                                          ...prevAnswered,
                                          [element.text]: true,
                                        }))}
                                      />
                                    </Box>
                                  )}
                                  {/* File Upload */}
                                  {element.type === "File Upload" && (
                                    <Box>
                                      <Typography fontSize='18px' mb={1} mt={2}>{element.text}</Typography>
                                      {/* <Tooltip title="Unavailable in preview mode" placement="top">
                                                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                                            <Button variant="contained" color="primary" disabled>
                                                                Upload
                                                            </Button>
                                                        </Box>
                                                    </Tooltip> */}
                                      <Tooltip title="Unavailable in preview mode" placement="top">
                                        <Box sx={{ position: 'relative', width: '100%' }}>
                                          <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            // margin="normal"
                                            disabled
                                            placeholder="Add Document"
                                            sx={{
                                              cursor: 'not-allowed',
                                              '& .MuiInputBase-input': {
                                                pointerEvents: 'none',
                                                cursor: 'not-allowed',
                                              },
                                            }}
                                          />
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                  )}
                                  {element.type === "Text Editor" && (
                                    <Box mt={2} mb={2}>
                                      <Typography>{stripHtmlTags(element.text)}</Typography>
                                    </Box>
                                  )}
                                </Box>
                              )
                            ))}
                          </Box>
                        )
                      ))}

                      <Box mt={3} display='flex' gap={3} alignItems='center'>
                        <Button disabled={activeStep === 0} onClick={handleBack} variant='contained'>
                          Back
                        </Button>
                        <Button onClick={handleNext} disabled={activeStep === totalSteps - 1} variant='contained'>
                          Next
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </LocalizationProvider>
              </Box>
            </DialogContent>

          </Dialog>
        </>
      )}

    </Box>
  );
};

export default OrganizersTemp;
