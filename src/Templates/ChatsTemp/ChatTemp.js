import React, { useState, useEffect } from 'react';
import { useNavigate, } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  TextField,
  InputLabel,
  Autocomplete,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  Popover,
  IconButton,
  Alert,
  Checkbox,
  
} from '@mui/material';
import Editor from '../Texteditor/Editor';
import { CiMenuKebab } from "react-icons/ci";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiPlusCircle } from "react-icons/fi";
import { PiDotsSixVerticalBold } from "react-icons/pi";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
const ChatTemp = () => {
  const navigate = useNavigate();
  const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const [chatTemplates, setChatTemplates] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [selecteduser, setSelectedUser] = useState('');
  const [inputText, setInputText] = useState('');
  const [userData, setUserData] = useState([]);

  // const [emailBody, setEmailBody] = useState('');
  const [daysuntilNextReminder, setDaysuntilNextReminder] = useState('3');
  const [noOfReminder, setNoOfReminder] = useState(1);
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [selectedShortcut, setSelectedShortcut] = useState('');
  const handleCreateChat = () => {
    setShowForm(true);
  };

  const [checkedSubtasks, setCheckedSubtasks] = useState([]);

  const handleCheckboxChange = (id) => {
    setCheckedSubtasks((prevChecked) => 
      prevChecked.includes(id) 
        ? prevChecked.filter(checkedId => checkedId !== id) 
        : [...prevChecked, id]
    );
  };
  
  const [subtasks, setSubtasks] = useState([{ id: '1', text: '', }]);

  const handleAddSubtask = () => {
    const newId = String(subtasks.length + 1);
    setSubtasks([...subtasks, { id: newId, text: "" }]);
  };

  // const handleInputChange = (id, value) => {
  //   setSubtasks(subtasks.map((subtask) => (subtask.id === id ? { ...subtask, text: value } : subtask)));
  // };

  const handleInputChange = (id, value) => {
    // setSubtasks((prevSubtasks) => {
    //   return prevSubtasks.map((subtask) =>
    //     subtask.id === id ? { ...subtask, text: value } : subtask
    //   );
    // });
    setSubtasks((prevSubtasks) => 
      prevSubtasks.map((subtask) => 
        subtask.id === id ? { ...subtask, text: value } : subtask
      )
    );
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
  };

  const [SubtaskSwitch, setSubtaskSwitch] = useState(false);
  const handleSubtaskSwitch = (checked) => {
    setSubtaskSwitch(checked);
  };
  const handleDragEnd = (result) => {
    // Ensure a valid drop location
    if (!result.destination) return;

    // Reorder subtasks based on the drag-and-drop result
    const newSubtasks = Array.from(subtasks);
    const [reorderedItem] = newSubtasks.splice(result.source.index, 1);
    newSubtasks.splice(result.destination.index, 0, reorderedItem);

    // Update the state with the new order of subtasks
    setSubtasks(newSubtasks);
  };

  const handleCloseChatTemp = () => {
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
    if (templateName || selecteduser || description) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [templateName, selecteduser, description]);

  //  for shortcodes
  const [showDropdown, setShowDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState('contacts');

  const [anchorEl, setAnchorEl] = useState(null);
  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };



  const handleAddShortcut = (shortcut) => {
    setInputText((prevText) => prevText + `[${shortcut}]`);
    setShowDropdown(false);
  };

  useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes('')));
  }, [shortcuts]);

  useEffect(() => {
    // Set shortcuts based on selected option
    if (selectedOption === 'contacts') {
      const contactShortcuts = [
        { title: 'Account Shortcodes', isBold: true },
        { title: 'Account Name', isBold: false, value: 'ACCOUNT_NAME' },
        { title: 'Custom field:Website', isBold: false, value: 'ACCOUNT_CUSTOM_FIELD:Website' },
        { title: 'Contact Shortcodes', isBold: true, },
        { title: 'Contact Name', isBold: false, value: 'CONTACT_NAME' },
        { title: 'First Name', isBold: false, value: 'FIRST_NAME' },
        { title: 'Middle Name', isBold: false, value: 'MIDDLE_NAME' },
        { title: 'Last Name', isBold: false, value: 'LAST_NAME' },
        { title: 'Phone number', isBold: false, value: 'PHONE_NUMBER' },
        { title: 'Country', isBold: false, value: 'COUNTRY' },
        { title: 'Company name', isBold: false, value: 'COMPANY_NAME ' },
        { title: 'Street address', isBold: false, value: 'STREET_ADDRESS' },
        { title: 'City', isBold: false, value: 'CITY' },
        { title: 'State/Province', isBold: false, value: 'STATE / PROVINCE' },
        { title: 'Zip/Postal code', isBold: false, value: 'ZIP / POSTAL CODE' },
        { title: 'Custom field:Email', isBold: false, value: 'CONTACT_CUSTOM_FIELD:Email' },
        { title: 'Date Shortcodes', isBold: true },
        { title: 'Current day full date', isBold: false, value: 'CURRENT_DAY_FULL_DATE' },
        { title: 'Current day number', isBold: false, value: 'CURRENT_DAY_NUMBER' },
        { title: 'Current day name', isBold: false, value: 'CURRENT_DAY_NAME' },
        { title: 'Current week', isBold: false, value: 'CURRENT_WEEK' },
        { title: 'Current month number', isBold: false, value: 'CURRENT_MONTH_NUMBER' },
        { title: 'Current month name', isBold: false, value: 'CURRENT_MONTH_NAME' },
        { title: 'Current quarter', isBold: false, value: 'CURRENT_QUARTER' },
        { title: 'Current year', isBold: false, value: 'CURRENT_YEAR' },
        { title: 'Last day full date', isBold: false, value: 'LAST_DAY_FULL_DATE' },
        { title: 'Last day number', isBold: false, value: 'LAST_DAY_NUMBER' },
        { title: 'Last day name', isBold: false, value: 'LAST_DAY_NAME' },
        { title: 'Last week', isBold: false, value: 'LAST_WEEK' },
        { title: 'Last month number', isBold: false, value: 'LAST_MONTH_NUMBER' },
        { title: 'Last month name', isBold: false, value: 'LAST_MONTH_NAME' },
        { title: 'Last quarter', isBold: false, value: 'LAST_QUARTER' },
        { title: 'Last_year', isBold: false, value: 'LAST_YEAR' },
        { title: 'Next day full date', isBold: false, value: 'NEXT_DAY_FULL_DATE' },
        { title: 'Next day number', isBold: false, value: 'NEXT_DAY_NUMBER' },
        { title: 'Next day name', isBold: false, value: 'NEXT_DAY_NAME' },
        { title: 'Next week', isBold: false, value: 'NEXT_WEEK' },
        { title: 'Next month number', isBold: false, value: 'NEXT_MONTH_NUMBER' },
        { title: 'Next month name', isBold: false, value: 'NEXT_MONTH_NAME' },
        { title: 'Next quarter', isBold: false, value: 'NEXT_QUARTER' },
        { title: 'Next year', isBold: false, value: 'NEXT_YEAR' }
      ];
      setShortcuts(contactShortcuts);
    } else if (selectedOption === 'account') {
      const accountShortcuts = [
        { title: 'Account Shortcodes', isBold: true },
        { title: 'Account Name', isBold: false, value: 'ACCOUNT_NAME' },
        { title: 'Custom field:Website', isBold: false, value: 'ACCOUNT_CUSTOM_FIELD:Website' },
        { title: 'Date Shortcodes', isBold: true },
        { title: 'Current day full date', isBold: false, value: 'CURRENT_DAY_FULL_DATE' },
        { title: 'Current day number', isBold: false, value: 'CURRENT_DAY_NUMBER' },
        { title: 'Current day name', isBold: false, value: 'CURRENT_DAY_NAME' },
        { title: 'Current week', isBold: false, value: 'CURRENT_WEEK' },
        { title: 'Current month number', isBold: false, value: 'CURRENT_MONTH_NUMBER' },
        { title: 'Current month name', isBold: false, value: 'CURRENT_MONTH_NAME' },
        { title: 'Current quarter', isBold: false, value: 'CURRENT_QUARTER' },
        { title: 'Current year', isBold: false, value: 'CURRENT_YEAR' },
        { title: 'Last day full date', isBold: false, value: 'LAST_DAY_FULL_DATE' },
        { title: 'Last day number', isBold: false, value: 'LAST_DAY_NUMBER' },
        { title: 'Last day name', isBold: false, value: 'LAST_DAY_NAME' },
        { title: 'Last week', isBold: false, value: 'LAST_WEEK' },
        { title: 'Last month number', isBold: false, value: 'LAST_MONTH_NUMBER' },
        { title: 'Last month name', isBold: false, value: 'LAST_MONTH_NAME' },
        { title: 'Last quarter', isBold: false, value: 'LAST_QUARTER' },
        { title: 'Last_year', isBold: false, value: 'LAST_YEAR' },
        { title: 'Next day full date', isBold: false, value: 'NEXT_DAY_FULL_DATE' },
        { title: 'Next day number', isBold: false, value: 'NEXT_DAY_NUMBER' },
        { title: 'Next day name', isBold: false, value: 'NEXT_DAY_NAME' },
        { title: 'Next week', isBold: false, value: 'NEXT_WEEK' },
        { title: 'Next month number', isBold: false, value: 'NEXT_MONTH_NUMBER' },
        { title: 'Next month name', isBold: false, value: 'NEXT_MONTH_NAME' },
        { title: 'Next quarter', isBold: false, value: 'NEXT_QUARTER' },
        { title: 'Next year', isBold: false, value: 'NEXT_YEAR' }
      ];
      setShortcuts(accountShortcuts);
    }
  }, [selectedOption]);
  console.log(selectedOption)
  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };
  //Integration 

  const handlechatsubject = (e) => {
    const { value } = e.target;
    setInputText(value);
  };

  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const handleuserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);

  };
  // const [sendreminderstoclient, setsendreminderstoclient] = useState(false);
  // const handleDateSwitchChange = (checked) => {
  //     setsendreminderstoclient(checked);
  // };

  const [absoluteDate, setAbsoluteDates] = useState(false);
  const handleAbsolutesDates = (checked) => {
    setAbsoluteDates(checked);
  };

  const handleEditorChange = (content) => {
    setDescription(content);
  };

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
  useEffect(() => {
    fetchData();
  }, []);

  const fetchChatTemplates = async () => {
    try {
      const url = `${CHAT_API}/Workflow/chats/chattemplate`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch Chat templates');
      }
      const data = await response.json();
      setChatTemplates(data.chatTemplate);


    } catch (error) {
      console.error('Error fetching Chat templates:', error);
    }

  };
  useEffect(() => {
    fetchChatTemplates();
  }, []);

  const handleClearTemplate = () => {
    setTemplateName('');
    setSelectedUser('');
    setInputText('');
    setNoOfReminder('');
    setSubtaskSwitch(false)
    setDescription('');
    setDaysuntilNextReminder('');
    subtasks([])
    setCheckedSubtasks([])
  }
  //**  save chat code */
  const savechat = async () => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const subtaskData = subtasks.map(({ id, text }) => ({
      id,
      text,
      
checked: checkedSubtasks.includes(id), // Check if ID is in the checkedSubtasks array
    }));

    const raw = JSON.stringify({
      templatename: templateName,
      from: selecteduser.value,
      chatsubject: inputText,
      description: description,
      sendreminderstoclient: absoluteDate,
      daysuntilnextreminder: daysuntilNextReminder,
      numberofreminders: noOfReminder,
      clienttasks: subtaskData,
      isclienttaskchecked:SubtaskSwitch,
      active: "true"
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const url = `${CHAT_API}/Workflow/chats/chattemplate`;
    fetch(url, requestOptions)
      .then((response) => {
        console.log(response)
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((result) => {
        console.log(result.message)
        // toast.success("Invoice created successfully");
        if (result && result.message === "ChatTemplate created successfully") {
          handleClearTemplate();
          fetchChatTemplates();
          toast.success("ChatTemplate created successfully");
          // handleCloseChatTemp()
          setShowForm(false);
        } else {
          toast.error(result.message || "Failed to create Chat Template");
        }
      })
      .catch((error) => console.error(error));
  }
const saveSchat= async () => {
  if (!validateForm()) {
    return; // Prevent form submission if validation fails
  }
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const subtaskData = subtasks.map(({ id, text }) => ({
    id,
    text,
    
checked: checkedSubtasks.includes(id), // Check if ID is in the checkedSubtasks array
  }));
  const raw = JSON.stringify({
    templatename: templateName,
    from: selecteduser.value,
    chatsubject: inputText,
    description: description,
    sendreminderstoclient: absoluteDate,
    daysuntilnextreminder: daysuntilNextReminder,
    numberofreminders: noOfReminder,
    clienttasks: subtaskData,
      isclienttaskchecked:SubtaskSwitch,
    active: "true"
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  const url = `${CHAT_API}/Workflow/chats/chattemplate`;
  fetch(url, requestOptions)
    .then((response) => {
      console.log(response)
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((result) => {
      console.log(result.message)
      // toast.success("Invoice created successfully");
      if (result && result.message === "ChatTemplate created successfully") {
      
        fetchChatTemplates();
        toast.success("ChatTemplate created successfully");
       
      } else {
        toast.error(result.message || "Failed to create Chat Template");
      }
    })
    .catch((error) => console.error(error));
}
  //Edit
  const handleEdit = (_id) => {
    navigate("chatTemplateUpdate/" + _id);
  };

  //delete template
  const handleDelete = (_id) => {

    // Show a confirmation prompt
    const isConfirmed = window.confirm("Are you sure you want to delete this chat template?");
        
    // Proceed with deletion if confirmed
    if (isConfirmed) {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow"
    };

    // Ensure the URL is correct, with _id appended correctly
    const url = `${CHAT_API}/Workflow/chats/chattemplate/${_id}`;

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete item');
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        toast.success('Item deleted successfully');
        fetchChatTemplates();
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to delete item');
      });
    }

  };
  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
  };

  const columns = [
    {
      accessorKey: 'templatename', // Access the template name
      header: 'Name',
      Cell: ({ row }) => (
        <Typography
          sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: 'bold' }}
          onClick={() => handleEdit(row.original._id)}
        >
          {row.original.templatename}
        </Typography>
      ),
    },
    {
      accessorKey: 'chatsubject', // Access the template name
      header: 'Subject',
      
    },
    {
      // accessorKey: 'templatename', // Access the template name
      header: 'Used in Pipeline',
     
    },
    {
      accessorKey: 'settings', // Add settings column
      header: 'Settings',
      Cell: ({ row }) => (
        // <>
        //   <IconButton aria-label="edit" onClick={() => handleEdit(row.original._id)}>
        //     <EditIcon />
        //   </IconButton>
        //   <IconButton aria-label="delete" onClick={() => handleDelete(row.original._id)}>
        //     <DeleteIcon />
        //   </IconButton>
        // </>
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
  ];

  const table = useMaterialReactTable({
    columns,
    data: chatTemplates,
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

  const [templateNameError, setTemplateNameError] = useState('');
  const [selectedUserError, setSelectedUserError] = useState('');
  const [inputTextError, setInputTextError] = useState('');


  const validateForm = () => {
    let isValid = true;

  
    if (!templateName) {
      setTemplateNameError("Template name is required");
      
      isValid = false;
    } else {
      setTemplateNameError('');
    }

    if (!selecteduser) {
      setSelectedUserError('Please select a user');
      isValid = false;
    } else {
      setSelectedUserError('');
    }

    if (inputText.trim() === '') {
      setInputTextError('Chat subject is required');
      isValid = false;
    } else {
      setInputTextError('');
    }



    return isValid;
  };

  return (
    <Container>
      {!showForm ? (
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleCreateChat} sx={{ mb: 3 }}>
            Create Chat Template
          </Button>

          <MaterialReactTable
            columns={columns}

            table={table}
          />
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Box>
            <form>
              <Box>
                <Typography variant='h5' gutterBottom>Create Chat Template</Typography>
                <Box mt={2} mb={2}><hr /></Box>
                <Grid container spacing={2} ml={1} mt={2}>
                  <Grid item xs={12} sm={5}>
                    <Box>

                      <Box>
                        <InputLabel sx={{ color: 'black' }}> Name</InputLabel>
                        <TextField
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                          error={!!templateNameError}

                          fullWidth
                          name="TemplateName"
                          placeholder="Template Name"
                          size="small"
                          sx={{ mt: 2 }}
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


                        <InputLabel sx={{ color: 'black' }}>From</InputLabel>


                        <Autocomplete

                          options={options}
                          sx={{ mt: 2, mb: 2 }}
                          size='small'
                          value={selecteduser}
                          onChange={handleuserChange}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          getOptionLabel={(option) => option.label || ""}
                          renderInput={(params) => (
                            <>
                              <TextField
                                {...params}
                                error={!!selectedUserError}

                                placeholder="Form"
                              />
                              {(!!selectedUserError) && <Alert sx={{
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
                                {selectedUserError}
                              </Alert>}
                            </>
                          )}
                          isClearable={true}

                        />

                      </Box>

                      <Box>

                        <InputLabel sx={{ color: 'black' }}>Subject</InputLabel>

                        <TextField
                          sx={{ mt: 2 }}
                          fullWidth
                          name="subject"
                          value={inputText + selectedShortcut} onChange={handlechatsubject}
                          placeholder="Subject"
                          size="small"
                          error={!!inputTextError}

                        />
                        {(!!inputTextError) && <Alert sx={{
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
                          {inputTextError}
                        </Alert>}
                      </Box>
                      <Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={toggleDropdown}
                          sx={{ mt: 2 }}
                        >
                          Add Shortcode
                        </Button>

                        <Popover
                          open={showDropdown}
                          anchorEl={anchorEl}
                          onClose={handleCloseDropdown}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                          }}
                        >
                          <Box >
                            <List className="dropdown-list" sx={{ width: '300px', height: '300px', cursor: 'pointer' }}>
                              {filteredShortcuts.map((shortcut, index) => (
                                <ListItem
                                  key={index}
                                  onClick={() => handleAddShortcut(shortcut.value)}
                                >
                                  <ListItemText
                                    primary={shortcut.title}
                                    primaryTypographyProps={{
                                      style: {
                                        fontWeight: shortcut.isBold ? 'bold' : 'normal',
                                      },
                                    }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        </Popover>
                      </Box>

                      <Box sx={{ mt: 3, width: '100%',mb:6 }}>
                        <Editor onChange={handleEditorChange} />
                      </Box>

                      <Box mt={2}>
                        <Box display={'flex'} alignItems={'center'} >
                          <Box>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={absoluteDate}
                                  onChange={(event) => handleAbsolutesDates(event.target.checked)}
                                  // checked={sendreminderstoclient}
                                  // onChange={(event)=>handleDateSwitchChange(event.target.checked)}
                                  color="primary"
                                />
                              }

                            />
                          </Box>
                          <Typography variant='h6'>Send reminders to clients</Typography>

                        </Box>
                        {absoluteDate && (
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
                      </Box>
                    </Box>
                  </Grid>
                  <Grid  item xs={12} sm={0.4} sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Box
                      sx={{
                        borderLeft: '1px solid black',
                        height: '100%',
                        ml: 2.5
                      }}
                    ></Box>
                  </Grid>
               
                  <Grid item xs={12} sm={5.8} ml={{ xs: 0, sm: 2 }}>
                      <div className="B">

                        <DragDropContext onDragEnd={handleDragEnd}>

                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant='h6'>Client tasks</Typography>
                            <FormControlLabel
                              control={
                                <Switch onChange={(event) => handleSubtaskSwitch(event.target.checked)} checked={SubtaskSwitch} color="primary" />
                              }

                            />
                          </Box>
                         
                          {SubtaskSwitch && (
                            <Droppable droppableId="subtaskList">
                              {(provided) => (
                                <div className="subtask-input" {...provided.droppableProps} ref={provided.innerRef}>

                                  {(subtasks.length > 0 ? subtasks : [{ id: 'default', text: '' }]).map((subtask, index) => (
                                    <Draggable key={subtask.id} draggableId={subtask.id} index={index}>
                                      {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>

                                          <Box display="flex" gap="30px" alignItems="center">
                                            <Checkbox
                                              style={{ cursor: 'pointer' }}
                                              // checked={subtask.checked}
                                              checked={checkedSubtasks.includes(subtask.id)}
                                              onChange={() => handleCheckboxChange(subtask.id, subtask.checked)}
                                            />
                                            <TextField
                                              placeholder="Things To do"
                                              value={subtask.text}
                                              size='small'
                                              margin='normal'
                                              fullWidth
                                              onChange={(e) => handleInputChange(subtask.id, e.target.value)}
                                              variant="outlined"
                                            />
                                            <IconButton onClick={() => handleDeleteSubtask(subtask.id)} style={{ cursor: 'pointer' }}>
                                              <RiDeleteBin6Line />
                                            </IconButton>
                                            <IconButton style={{ cursor: 'move' }}>
                                              <PiDotsSixVerticalBold />
                                            </IconButton>
                                          </Box>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}

                                  {provided.placeholder}
                                  <Box sx={{ cursor: 'pointer' }} onClick={handleAddSubtask} style={{ margin: "10px", color: "#1976d3" }}>
                                    <FiPlusCircle /> Add Subtasks
                                  </Box>
                                </div>
                              )}
                            </Droppable>
                          )}

                        </DragDropContext>
                      </div>
                    </Grid>
                </Grid>
                <Divider mt={2} />
                <Box sx={{ pt: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Button variant="contained" color="primary" onClick={savechat}>Save & exit</Button>
                  <Button variant="contained" color="primary" onClick={saveSchat}>Save</Button>
                  <Button variant="outlined" onClick={handleCloseChatTemp}>Cancel</Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default ChatTemp;