

import React, { useState, useEffect } from "react";
import { FiPlusCircle } from "react-icons/fi";
import {
  Container, Box, Button, Typography, Chip, Drawer, TextField, InputLabel, Autocomplete, Switch, FormControlLabel, Divider, List, ListItem, ListItemText, Popover, IconButton, Checkbox,
} from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CloseIcon from '@mui/icons-material/Close';
import Editor from '../../Templates/Texteditor/Editor';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PiDotsSixVerticalBold } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Grid from '@mui/material/Grid';
import TelegramIcon from '@mui/icons-material/Telegram';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';


const Communication = () => {
  const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;
  // REACT_APP_CHAT_API
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const handleEditEditorChange = (newContent) => {
    setDescription(newContent);
  };
  const [editmessageid, setEditmessagid] = useState('')
  const handleEditClick = (desc) => {
    setSelectedMessage(desc.message);
    setIsEditing(true);
    setEditmessagid(desc._id)
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedMessage(null);
  };

  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
  const [open, setOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { data } = useParams();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [activeButton, setActiveButton] = useState("active");
  const [isActiveTrue, setIsActiveTrue] = useState(true);
  //for shortcode
  const [inputText, setInputText] = useState('');
  const [inputTextError, setInputTextError] = useState('');

  const [selectedShortcut, setSelectedShortcut] = useState('');
  const handlechatsubject = (e) => {
    const { value } = e.target;
    setInputText(value);
  };
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
  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  //for texteditor.
  const [description, setDescription] = useState('');
  const handleEditorChange = (content) => {
    setDescription(content);
  };
  const [noOfReminder, setNoOfReminder] = useState(1);
  const [daysuntilNextReminder, setDaysuntilNextReminder] = useState('3');
  const [absoluteDate, setAbsoluteDates] = useState(false);
  const handleAbsolutesDates = (checked) => {
    setAbsoluteDates(checked);
  };
  ///clienttask

  const [subtasks, setSubtasks] = useState([{ id: '1', text: '', checked: '' }]);
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newSubtasks = Array.from(subtasks);
    const [reorderedItem] = newSubtasks.splice(result.source.index, 1);
    newSubtasks.splice(result.destination.index, 0, reorderedItem);
    setSubtasks(newSubtasks);
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
  };

  const handleAddSubtask = () => {
    const newId = String(subtasks.length + 1);
    setSubtasks([...subtasks, { id: newId, text: "" }]);
  };

  const handleInputChange = (id, value) => {
    setSubtasks((prevSubtasks) =>
      prevSubtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, text: value } : subtask
      )
    );
  };

  const [checkedSubtasks, setCheckedSubtasks] = useState([]);

  const handleCheckboxChange = (id, description) => {
    setCheckedSubtasks(prevCheckedSubtasks => {
      const updatedCheckedSubtasks = prevCheckedSubtasks.includes(id)
        ? prevCheckedSubtasks.filter(checkedId => checkedId !== id)
        : [...prevCheckedSubtasks, id];
      console.log(updatedCheckedSubtasks);
      return updatedCheckedSubtasks;
    });
  };

  //chattemps
  const [chatTemplates, setChatTemplates] = useState([]);
  useEffect(() => {
    fetchChatTemplates();
    fetchAccountsData()
  }, []);

  useEffect(() => {
    accountwiseChatlist(data, isActiveTrue);
  }, []);

  const fetchChatTemplates = async () => {
    try {
      const url = `${CHAT_API}/Workflow/chats/chattemplate`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch ChatTemplate");
      }
      const data = await response.json();
      setChatTemplates(data.chatTemplate);
    } catch (error) {
      console.error("Error fetching ChatTemplate:", error);
    }
  };

  const invoiceoptions = chatTemplates.map((Chat) => ({
    value: Chat._id,
    label: Chat.templatename,
  }));

  const [selectInvoiceTemp, setSelectedInvoiceTemp] = useState("");
  const [templateId, setTemplateId] = useState(null);

  const handleInvoiceTempChange = async (event, newValue) => {
    setSelectedInvoiceTemp(newValue);
    if (newValue && newValue.value) {
      const templateId = newValue.value;
      setTemplateId(templateId);
      try {
        const url = `${CHAT_API}/workflow/chats/chattemplate/chattemplateList/${templateId}`;
        const response = await fetch(url);
        const result = await response.json();
        const chatTemplate = result.chatTemplate;

        setAbsoluteDates(chatTemplate.sendreminderstoclient)
        setTemplateName(chatTemplate.templatename);
        setInputText(chatTemplate.chatsubject);
        setDescription(chatTemplate.description);
        setDaysuntilNextReminder(chatTemplate.daysuntilnextreminder);
        setNoOfReminder(chatTemplate.numberofreminders);
        setSubtasks(chatTemplate.clienttasks.flat().map(task => ({
          id: task.id,
          text: task.text,
          checked: task.checked,
        })));
        console.log("Subtasks updated:", subtasks);
      } catch (error) {
        console.error("Error fetching chat template:", error);
      }
    }
  };

  const [templateName, setTemplateName] = useState('');
  //for accountwise 
  const [accountData, setAccountData] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState([]);


  const fetchAccountsData = async () => {
    try {
      const url = `${ACCOUNT_API}/accounts/account/accountdetailslist/`;
      const response = await fetch(url);
      const result = await response.json();

      if (Array.isArray(result.accountlist)) {
        setAccountData(result.accountlist);
        const selectedAccounts = result.accountlist
          .filter((account) => (Array.isArray(data) ? data.includes(account.id) : account.id === data))
          .map((selectedAccount) => ({
            label: selectedAccount.Name,
            value: selectedAccount.id,
          }));

        if (selectedAccounts.length > 0) {
          setSelectedAccount(selectedAccounts);
        } else {
          setSelectedAccount([]); // Clear if no matching accounts found
        }
      } else {
        console.error("Account list is not an array", result.accountlist);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const AccountsOptions = (accountData || []).map((account) => ({
    value: account.id,
    label: account.Name,
  }));

  const handleDelete = (valueToDelete) => {
    setSelectedAccount((prevSelected) => prevSelected.filter((value) => value !== valueToDelete));
  };
  const [chatId, setChatId] = useState()


  // mail for drawer btn
  const sendSaveChatMail = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountid: data,
      chattemplateid: templateId,
      username: accountName,
      "viewchatlink": "/login"
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${CHATTOCLIENT_API}/securechatsend`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }

  // mail for msgs
  const securemessagechatsend = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountid: data,
      chattemplateid: templateId,
      username: accountName,
      "viewchatlink": "/login"
    });
    console.log(raw)
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${CHATTOCLIENT_API}/securemessagechatsend`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }

  ///for drawer save btn
  const saveChat = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const selectedAccountIds = selectedAccount.map((account) => account.value);
    const subtaskData = subtasks.map(({ id, text, checked }) => ({
      id,
      text,
      checked: checked !== undefined ? checked : false // Ensure checked is either true or false
    }));
    const messageData = [{
      message: description,
      fromwhome: "Admin",
    }];

    const raw = JSON.stringify({
      accountids: selectedAccountIds,
      chattemplateid: selectInvoiceTemp?.value,
      templatename: templateName,
      // from: "65e7149c570b4c1aba9fcfd4",
      chatsubject: inputText + selectedShortcut,
      // description: description,
      description: messageData,
      sendreminderstoclient: absoluteDate,
      daysuntilnextreminder: daysuntilNextReminder,
      numberofreminders: noOfReminder,
      clienttasks: subtaskData,
      // isclienttaskchecked: SubtaskSwitch,
      active: "true"
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    console.log(raw)
    fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        toast.success("New Chat created successfully");
        sendSaveChatMail()
        setIsSubmitted(true);
        accountwiseChatlist(data, isActiveTrue);
        handleClose()
      })
      .catch((error) => {
        console.error("Fetch error: ", error.message);
        toast.error("Failed to create new chat. Please try again.");
      });
  };
  const [adminChatSubject, setAdminChatSubject] = useState()
  const [adminChatDiscription, setAdminChatDiscription] = useState()
  const [accountName, setAccountName] = useState()
  const [time, setTime] = useState()
  const [chatList, setChatList] = useState([]);
  const [adminChatClientsTask, setAdminChatClientsTask] = useState()

  const accountwiseChatlist = (data, isActiveTrue) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${CHATTOCLIENT_API}/chats/chatsaccountwise/isactivechat/${data}/${isActiveTrue}`
    console.log(url)
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("chats temp", result);
        if (result.chataccountwise && result.chataccountwise.length > 0) {
          result.chataccountwise.forEach((chat) => {
            // Log the message IDs in the description
            chat.description.forEach((message) => {
              setSubtasks(chat.clienttasks);
            });
            setAccountName(chat.accountid.accountName);
            setTime(chat.updatedAt)
            setSubtasks(chat.clienttasks)
            setSelectedmsgId(chat.description.map((msg) => msg._id))
            console.log("Message IDs:", chat.description.map((msg) => msg._id));
          });
          setIsSubmitted(true)
          setChatList(result.chataccountwise);
          console.log(result.chataccountwise)
        } else {
          setChatList(result.chataccountwise);
          console.log("No chat data available");
        }
      })
      .catch((error) => console.error(error));
  };
  console.log(chatList)
  const [expanded, setExpanded] = useState(false);
  const [activeChatIndex, setActiveChatIndex] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const [selectedContent, setSelectedContent] = useState('chat');
  const handleContentClick = (content) => {
    setSelectedContent(content); // Change the content when clicked
  };
  const formattedTime = new Date(time).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  }).replace(',', '');


  //delete chat
  const DeleteChat = () => {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow"
    };

    fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise/${chatId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete chat");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);

        toast.success("Chat deleted successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error deleting chat");
      });
  };

  //Archive Chat
  const ArchiveChat = () => {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      active: isActiveTrue
    });
    console.log(raw)
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    const url = (`${CHATTOCLIENT_API}/chats/chatsaccountwise/${chatId}`);
    console.log(url)
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success("Chat archived successfully!");
        setOpenDialog(false);
        setAnchorEl(null);
        if (isActiveTrue === true) {
          setActiveButton("active");
          setActiveorarchive("Archive");
        }
        else if (isActiveTrue === false) {
          setActiveButton("archived");
          setActiveorarchive("Active");
        }

        accountwiseChatlist(data, isActiveTrue)
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to archive chat. Please try again.");
      });
  }
  const [openDialog, setOpenDialog] = React.useState(false);
  const [activeorarchive, setActiveorarchive] = React.useState('Active');
  // const [openDialog, setOpenDialog] = React.useState(false);
  console.log(activeorarchive)
  const handleClickDialog = () => {
    setOpenDialog(true);

    if (activeorarchive === 'Archive') {
      setIsActiveTrue(false)
    }
    else if (activeorarchive === 'Active') {
      setIsActiveTrue(true)
    }

  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [allDescriptions, setAllDescriptions] = useState([]); // State to hold all descriptions


  const updateChatDescription = () => {
    if (!description.trim()) return;

    const newDescription = {
      message: description,
      fromwhome: "Admin"
    };
    setAllDescriptions((prevDescriptions) => [...prevDescriptions, newDescription]);
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      newDescriptions: [newDescription],
    });
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log("Payload:", raw);
    fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise/chatupdatemessage/${chatId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {

        console.log("Response:", result);
        securemessagechatsend()
        setAdminChatSubject(result.updatedChats.chatsubject);
        setAdminChatDiscription(result.updatedChats.description);
        setExpanded(true);
        setDescription("");
        setChatId(result.updatedChats._id)
        toast.success("Chat description updated successfully");
        accountwiseChatlist(data, isActiveTrue)
       
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to update chat description. Please try again.");
      });
  };

  const updateAdminChatDescription = (description) => {
    if (!description.trim()) return; // Do not send if description is empty
    const newDescription = {
      message: description,
      fromwhome: "Admin"
    };
    setAllDescriptions((prevDescriptions) => [...prevDescriptions, newDescription]);
    setDescription("");
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      newDescriptions: [newDescription],
    });
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log("Payload:", raw);
    fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise/chatupdatemessage/${chatId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {

        console.log("Response:", result);
        securemessagechatsend()
        setAdminChatSubject(result.updatedChats.chatsubject);
        setAdminChatDiscription(result.updatedChats.description);
        setExpanded(true);
        setChatId(result.updatedChats._id)
        toast.success("Chat description updated successfully");
        accountwiseChatlist(data, isActiveTrue)
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to update chat description. Please try again.");
      });
  };

  //for update msgs
  const [selectedmsgId, setSelectedmsgId] = useState()

  const updateMsgs = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log(description)
    const raw = JSON.stringify({
      chatId: chatId,
      messageId: editmessageid,
      newMessage: description,
    });
    console.log(raw)
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise/chatmessage/bymessageid/update`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setAdminChatSubject(result.updatedChat.chatsubject);
        setAdminChatDiscription(result.updatedChat.description);
        setExpanded(true);
        // setActiveChatIndex(index);
        setChatId(result.updatedChat._id)
        toast.success("message updated successfully!");
        accountwiseChatlist(data, isActiveTrue)
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to updated message. Please try again.");
      });
  }

  ///for delete message
  const handleDeleteClick = (desc) => {
    deletemessge(desc._id)
  };

  const deletemessge = (deletemessageid) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      chatId: chatId,
      messageId: deletemessageid,
      newMessage: description,
    });
    console.log(raw)
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise/chatmessage/bymessageid/delete`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setAdminChatSubject(result.updatedChat.chatsubject);
        setAdminChatDiscription(result.updatedChat.description);
        setExpanded(true);
        // setActiveChatIndex(index);
        setChatId(result.updatedChat._id)
        toast.success("message deleted successfully!");
        accountwiseChatlist(data, isActiveTrue)
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to deleted message. Please try again.");
      });
  }

  const handleActiveClick = () => {
    setIsActiveTrue(true);
    setActiveButton("active");
    setActiveorarchive("Archive");
    accountwiseChatlist(data, true);
    console.log("Active action triggered.");
  };

  const handleArchivedClick = () => {
    setIsActiveTrue(false);
    setActiveButton("archived");
    setActiveorarchive("Active");
    accountwiseChatlist(data, false);
    console.log("Archive action triggered.");
  };

  //for client task
  const [showClientTaskGrid, setShowClientTaskGrid] = useState(false);
  const handleAddClientTask = () => {
    setShowClientTaskGrid(true);
  };

  const handleAddTask = (groupIndex) => {
    console.log(groupIndex);
    const taskGroup = adminChatClientsTask[groupIndex];
    if (!Array.isArray(taskGroup)) return;
    const lastTask = taskGroup.length > 0 ? taskGroup[taskGroup.length - 1] : null;
    const newId = lastTask ? String(Number(lastTask.id) + 1) : "1";
    const newTask = { id: newId, text: "", checked: false };
    const updatedTasks = [...adminChatClientsTask];
    updatedTasks[groupIndex] = [...taskGroup, newTask];
    setAdminChatClientsTask(updatedTasks);
    console.log("Updated Tasks:", updatedTasks);
  };

  const handleDeleteTask = (groupIndex, taskId) => {
    const updatedTasks = adminChatClientsTask.map((group, idx) =>
      idx === groupIndex ? group.filter((task) => task.id !== taskId) : group
    );
    setAdminChatClientsTask(updatedTasks);
  };

  console.log(adminChatClientsTask)

  ///for resend client task
  const resendClientTask = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      chatId: chatId,
      newTask: adminChatClientsTask.flat()
    });
    console.log(raw);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise/addclienttask`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        const taskMessages = adminChatClientsTask.flat().map(task => task.text).join(", ");
        const description = `${taskMessages}`;
        console.log(description)

        updateAdminChatDescription(description)

      })
      .catch((error) => console.error(error));
  };



  const handleTaskTextChange = (groupIndex, taskIndex, newText) => {
    const updatedTasks = [...adminChatClientsTask];
    updatedTasks[groupIndex][taskIndex].text = newText;
    console.log(updatedTasks)
    setAdminChatClientsTask(updatedTasks); // Ensure this updates the state
  };



  return (
    <Box>

      <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
        <Typography m={1} variant="h4">
          <b>Chats & tasks</b>

        </Typography>
        <Box display={"flex"} alignItems={'center'} gap={2}>
          <Button
            style={{
              backgroundColor: activeButton === "active" ? "blue" : "transparent",
              color: activeButton === "active" ? "white" : "black",
              fontWeight: activeButton === "active" ? "bold" : "normal",
            }}
            onClick={handleActiveClick}
          >
            Active
          </Button>

          <Button
            style={{
              backgroundColor: activeButton === "archived" ? "blue" : "transparent",
              color: activeButton === "archived" ? "white" : "black",
              fontWeight: activeButton === "archived" ? "bold" : "normal",
            }}
            onClick={handleArchivedClick}
          >
            Archived
          </Button>
          <Box onClick={handleOpen}>
            <Button variant="contained">New Chat</Button>
          </Box>
        </Box>
      </Box>
      <Box

        border={'1px solid #e2e8f0'}
      >
        <Box mt={3}
          border={'1px solid #e2e8f0'}
          height={'auto'}
        >

          <Box>
            <Box>
              <Grid container spacing={3} sx={{ height: 'auto', mt: 2, }}>
                <Grid item xs={4} >
                  <Container sx={{ height: '90vh', borderRight: '1px solid #697991' }}>
                    {chatList.length > 0 && (
                      chatList.map((chat, index) => (
                        <Box key={index} mb={2}>
                          <Box display="flex" alignItems="center" mb={1}>
                            <TelegramIcon sx={{ color: 'rgb(113, 53, 247)', mr: 1 }} />
                            <Typography fontSize={13} color="#697991">
                              Chat with {chat.accountid.accountName} {/* Accessing accountName */}
                            </Typography>
                          </Box>
                          <Box
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                              setAdminChatSubject(chat.chatsubject);
                              setAdminChatDiscription(chat.description);
                              setExpanded(true);
                              setActiveChatIndex(index);
                              setAdminChatClientsTask(chat.clienttasks)
                              setChatId(chat._id)
                              console.log(chat._id)
                            }}
                          >
                            <Typography variant="h6" fontSize={16} noWrap ml={1}>
                              <b>{chat.chatsubject}</b>
                            </Typography>
                            <Typography
                              fontSize={14}
                              sx={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                WebkitLineClamp: 2, // Show only 2 lines
                                ml: 1
                              }}
                            >
                              {chat.description[0]?.message.replace(/<[^>]+>/g, '')} {/* Accessing message from description array */}
                            </Typography>

                            <Box display="flex" justifyContent="flex-end" ml={1}>
                              <Typography fontSize={13} color="#697991">
                                {formattedTime}
                              </Typography>

                            </Box>
                            <Divider
                              sx={{
                                borderColor: activeChatIndex === index ? '#2c85de' : '', // Active color and default color
                              }}
                            />
                          </Box>
                        </Box>

                      ))
                    )}
                  </Container>
                </Grid>
                {/* Second Grid: Shown on Expand */}
                <Grid item xs={6} ml={3}>
                  {expanded && (
                    <Box>
                      <Grid container spacing={3} sx={{ height: 'auto', mt: 2, }}>
                        <Grid item xs={showClientTaskGrid ? 9 : 12} >
                          <Box ml={1} >
                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                              <Typography fontSize={23}>
                                <strong>{adminChatSubject}</strong>


                              </Typography>
                              <MoreVertIcon onClick={handleMenuOpen} sx={{ color: '#1976d3', cursor: 'pointer' }} />
                            </Box>
                            <Divider sx={{ mt: 2 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px', mt: 2 }}>
                              <Typography
                                onClick={() => handleContentClick('chat')}
                                sx={{
                                  cursor: 'pointer',
                                  fontWeight: selectedContent === 'chat' ? 'bold' : 'normal',
                                  color: selectedContent === 'chat' ? '#1976d3' : 'inherit',
                                  borderBottom: selectedContent === 'chat' ? '3px solid #1976d3' : 'none', // Border for active state
                                  paddingBottom: '4px', // Adjust padding for the border
                                }}
                              >
                                Chat
                              </Typography>
                              <Typography
                                onClick={() => handleContentClick('reminders')}
                                sx={{
                                  cursor: 'pointer',
                                  fontWeight: selectedContent === 'reminders' ? 'bold' : 'normal',
                                  color: selectedContent === 'reminders' ? '#1976d3' : 'inherit',
                                  borderBottom: selectedContent === 'reminders' ? '3px solid #1976d3' : 'none', // Border for active state
                                  paddingBottom: '4px', // Adjust padding for the border
                                }}
                              >
                                Reminders
                              </Typography>
                              <Typography
                                onClick={() => handleContentClick('linkedjobs')}
                                sx={{
                                  cursor: 'pointer',
                                  fontWeight: selectedContent === 'linkedjobs' ? 'bold' : 'normal',
                                  color: selectedContent === 'linkedjobs' ? '#1976d3' : 'inherit',
                                  borderBottom: selectedContent === 'linkedjobs' ? '3px solid #1976d3' : 'none', // Border for active state
                                  paddingBottom: '4px', // Adjust padding for the border
                                }}
                              >
                                Linked Jobs
                              </Typography>
                              <Box sx={{ ml: 'auto', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
                                {/* <Typography color={'#1976d3'} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <AddCircleIcon /> Client request
                                </Typography> */}
                                <Typography color={'#1976d3'} onClick={handleAddClientTask}>
                                  Show Client task
                                </Typography>
                              </Box>
                            </Box>
                            <Divider sx={{ mt: 2 }} />
                            {/* Menu Component */}

                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleMenuClose}
                            >
                              <MenuItem
                                onClick={() => {
                                  const newStatus = isActiveTrue ? 'Archive' : 'Active';
                                  setActiveorarchive(newStatus);
                                  handleClickDialog(); // Executes the dialog logic
                                  // handleMenuClose(); // Close the menu after clicking
                                }}
                              >
                                {isActiveTrue ? 'Archive' : 'Active'}
                              </MenuItem>



                              <Dialog
                                open={openDialog}
                                onClose={handleCloseDialog}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                              >
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                  <DialogTitle id="alert-dialog-title" style={{ display: 'flex', alignItems: 'center' }}>
                                    {"Archive chat?"}
                                  </DialogTitle>
                                  <CloseIcon onClick={handleCloseDialog} sx={{ cursor: 'pointer' }} />
                                </Box>

                                <Divider />
                                <DialogContent>
                                  <DialogContentText id="alert-dialog-description">
                                    If this chat is no longer active, please archive it. This will remove it from the 'Active' queue for both you and the client.

                                  </DialogContentText>
                                </DialogContent>
                                <DialogActions>

                                  <Button variant="contained" onClick={ArchiveChat} autoFocus>
                                    Agree
                                  </Button>

                                  <Button onClick={handleCloseDialog}>Cancel</Button>
                                </DialogActions>
                              </Dialog>
                              <MenuItem onClick={DeleteChat} sx={{ color: '#eb5858' }} >Delete</MenuItem>
                            </Menu>
                            <Box mt={2}>
                              <Box>
                                {selectedContent === 'chat' && (
                                  <Box sx={{ width: '100%', mb: 6, }}>
                                    <Box
                                      sx={{
                                        overflowY: 'auto',
                                        height: '18vh',
                                        paddingRight: '10px',
                                      }}
                                    >
                                      {adminChatDiscription?.map((desc, index) => (
                                        <Box
                                          key={desc._id}

                                          // sx={{
                                          //   marginBottom: '10px',
                                          //   // backgroundColor: '#dbe1e8',
                                          //   //  backgroundColor: '#eff7ff', 
                                          //   backgroundColor: desc.fromwhome === 'admin' ? '#ffcccc' : desc.fromwhome === 'client' ? '#eff7ff' : '#dbe1e8',
                                          //   border: '1px solid transparent',
                                          //   borderRadius: '12px',
                                          //   padding: '30px 20px',
                                          //   width: 'fit-content',
                                          //   textAlign: 'left',

                                          //   marginLeft: desc.fromwhome === 'admin' ? 'auto' : '10px',  // Align right for admin
                                          //   marginRight: desc.fromwhome === 'client' ? 'auto' : '10px', // Align left for client
                                          //   boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                          //   position: 'relative',
                                          //   borderBottomRightRadius: '1px',
                                          // }}

                                          sx={{
                                            mb: '10px',
                                            backgroundColor:
                                              desc.fromwhome === 'admin'
                                                ? '#ffcccc'
                                                : desc.fromwhome === 'client'
                                                  ? '#eff7ff'
                                                  : '#dbe1e8',
                                            border: '1px solid transparent',
                                            borderRadius: '12px',
                                            padding: '30px 20px',
                                            width: 'fit-content',
                                            textAlign: 'left',
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                            position: 'relative',
                                            borderBottomRightRadius: '1px',
                                            ml: desc.fromwhome === 'client' ? 'auto' : '10px',
                                            mr: desc.fromwhome === 'admin' ? 'auto' : '10px',
                                          }}

                                        >
                                          <strong style={{ display: 'flex', alignItems: "center", justifyContent: 'space-between', marginBottom: '5px', color: '#333', }}>
                                            {desc.fromwhome}
                                            {/* {console.log(desc)} */}

                                            <Box>
                                              <BorderColorIcon onClick={() => handleEditClick(desc)} sx={{ cursor: 'pointer', color: 'rgb(25, 118, 211)', }} />
                                              <DeleteIcon onClick={() => handleDeleteClick(desc)} sx={{ color: '#eb5858', cursor: 'pointer' }} />
                                            </Box>

                                          </strong>
                                          <p
                                            style={{
                                              margin: 0,
                                              fontSize: '14px',
                                              lineHeight: '1.5',
                                              color: '#555',

                                            }}
                                            dangerouslySetInnerHTML={{
                                              __html: typeof desc.message === 'string' ? desc.message.replace(/<[^>]+>/g, '') : desc.message,
                                            }}
                                          />
                                          <span
                                            style={{
                                              display: 'block',
                                              marginTop: '8px',
                                              fontSize: '12px',
                                              color: '#aaa',
                                              textAlign: 'right',
                                              padding: 3
                                            }}
                                          >
                                          </span>



                                        </Box>
                                      ))}
                                    </Box>
                                    {!isEditing && (
                                      <Box sx={{ width: '100%', mb: 6 }}>
                                        <Box mt={5}>

                                          <Editor onChange={handleEditorChange} />
                                        </Box>
                                        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'flex-end' }}>
                                          <Button onClick={updateChatDescription} variant="contained">Send</Button>
                                        </Box>
                                      </Box>
                                    )}
                                    {isEditing && selectedMessage && (
                                      <Box>
                                        <Editor
                                          onChange={handleEditEditorChange}
                                          initialContent={selectedMessage}
                                        />
                                        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'flex-end' }}>
                                          <Button onClick={updateMsgs} variant="contained">Send</Button>
                                          <Button onClick={handleCancelEdit} sx={{ ml: 2 }}>Cancel</Button>
                                        </Box>
                                      </Box>
                                    )}

                                  </Box>
                                )}
                              </Box>
                              {selectedContent === 'reminders' && (
                                <TextField
                                  label="Reminders"
                                  variant="outlined"
                                  fullWidth
                                  sx={{ mt: 2 }}
                                />
                              )}
                              {selectedContent === 'linkedjobs' && (
                                <Typography>Linked jobs</Typography>
                              )}
                            </Box>

                          </Box>
                        </Grid>
                        {/* 3rd grid for client task */}
                        <Grid item xs={2}>
                          {showClientTaskGrid && (
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '90vh',
                                ml: 1,
                                borderLeft: '1px solid #697991',
                                width: '100%',
                              }}
                            >
                              {adminChatClientsTask && adminChatClientsTask.length > 0 ? (
                                adminChatClientsTask.map((taskGroup, groupIndex) => (
                                  <Box key={groupIndex} >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                      <Typography fontSize={25} whiteSpace="nowrap">
                                        <b>Client tasks</b>
                                      </Typography>
                                      <Button

                                        size="small"
                                        startIcon={<AddCircleIcon sx={{ fontSize: 12 }} />}
                                        sx={{ ml: 2, whiteSpace: 'nowrap' }}
                                        onClick={() => handleAddTask(groupIndex)}
                                      >
                                        Add Task
                                      </Button>
                                    </Box>
                                    <Divider sx={{ mt: 2, mb: 5, width: '100%' }} />

                                    {/* <Box m={1} width={'200%'}>
                                      {taskGroup && taskGroup.length > 0 ? (
                                        taskGroup.map((task, taskIndex) => (
                                        
                                          <Box key={task.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Checkbox
                                              style={{ cursor: 'pointer' }}

                                              checked={task.checked}
                                              onChange={() => handleCheckboxChange(task.id, task.checked)}
                                            />
                                            <TextField
                                              fullWidth
                                              variant="outlined"
                                              value={task.text}
                                              onChange={(e) => handleTaskTextChange(groupIndex, taskIndex, e.target.value)}
                                            />
                                            <IconButton
                                              color="error"
                                              onClick={() => handleDeleteTask(groupIndex, task.id)}
                                            >
                                              <DeleteIcon />
                                            </IconButton>



                                          </Box>

                                        ))

                                      ) : (
                                        <Box>No tasks in this group</Box>
                                      )}
                                    </Box> */}

                                    <Box m={1} width="300%">
                                      {taskGroup.length > 0 ? (
                                        taskGroup.map((task, taskIndex) => {
                                          // Log task to console for debugging
                                          console.log("Task:", taskGroup);
                                          const isChecked = task.checked === "true";
                                          return (
                                            <Box key={task.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                              <Checkbox
                                                checked={isChecked}
                                                onChange={() => handleCheckboxChange(task.id, task.checked)}
                                              />
                                              <TextField
                                                fullWidth
                                                variant="outlined"
                                                value={task.text}
                                                onChange={(e) =>
                                                  handleTaskTextChange(groupIndex, taskIndex, e.target.value)
                                                }
                                              />

                                              <IconButton
                                                color="error"
                                                onClick={() => handleDeleteTask(groupIndex, task.id)}
                                              >
                                                <DeleteIcon />
                                              </IconButton>
                                            </Box>
                                          );
                                        })
                                      ) : (
                                        <Typography>No tasks in this group</Typography>
                                      )}
                                    </Box>

                                    <Box mt={2} m={2} whiteSpace={'nowrap'}>
                                      <Button onClick={resendClientTask} variant="outlined"> Resend client task</Button>
                                    </Box>
                                  </Box>
                                ))
                              ) : (
                                <Box>No tasks available</Box>
                              )}
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Grid>
              </Grid>


            </Box>
          </Box>
          {/* )} */}
        </Box>

        {/* )} */}
      </Box>

      {/* Drawer Section */}
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: "40%",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Drawer Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 2 }}>
            <Typography variant="h6">New chat</Typography>
            <Box onClick={handleClose} sx={{ cursor: 'pointer', color: '#1976d3' }}>
              <CloseIcon />
            </Box>
          </Box>
          <Divider />


          <Box mt={2} m={1}>
            <InputLabel sx={{ color: 'black' }}>To</InputLabel>
            <Autocomplete
              multiple
              size="small"
              sx={{ marginTop: "10px" }}
              options={AccountsOptions}
              getOptionLabel={(option) => option.label}
              value={selectedAccount}
              onChange={(event, newValue) => {
                setSelectedAccount(newValue);
              }}
              renderTags={(selected, getTagProps) => selected.map((option, index) => <Chip key={option.value} label={option.label} {...getTagProps({ index })} onDelete={() => handleDelete(option.value)} />)}
              renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Select Accounts" />}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox checked={selectedAccount.some((acc) => acc.value === option.value)} style={{ marginRight: 8 }} />
                  {option.label}
                </li>
              )}
            />
          </Box>

          <Box m={1}>
            <InputLabel sx={{ color: "black" }}> Template</InputLabel>
            <Autocomplete
              options={invoiceoptions}
              getOptionLabel={(option) => option.label}
              value={selectInvoiceTemp}

              onChange={handleInvoiceTempChange}

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
                <TextField
                  {...params}
                  sx={{ backgroundColor: '#fff' }}
                  placeholder="Job Template"
                  variant="outlined"
                  size="small"
                />
              )}
              sx={{ width: '100%', marginTop: '8px' }}
              clearOnEscape // Enable clearable functionality
            />
          </Box>

          <Box m={1}>
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
          </Box>
          <Box m={1}>
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


          {/* <Box sx={{ m: 1 }}>
            <Editor initialContent={description} onChange={handleEditorChange} />
          </Box> */}

          <Box m={1}>
            <Box display={'flex'} alignItems={'center'} >
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={absoluteDate}
                      onChange={(event) => handleAbsolutesDates(event.target.checked)}
                      color="primary"
                    />
                  }

                />
              </Box>
              <Typography variant='h6'>Send reminders to clients</Typography>

            </Box>
            {absoluteDate && (
              <Box mb={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 2, m: 1 }}>

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

          <DragDropContext onDragEnd={handleDragEnd}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: 2 }}>
              <Typography variant='h6'>Client tasks</Typography>
              <Box sx={{ cursor: 'pointer' }} onClick={handleAddSubtask} style={{ margin: "10px", color: "#1976d3" }}>
                <FiPlusCircle /> Add Subtasks
              </Box>
            </Box>

            <Droppable droppableId="subtaskList">
              {(provided) => (
                <div className="subtask-input" {...provided.droppableProps} ref={provided.innerRef}>
                  {(subtasks.length > 0 ? subtasks : [{ id: 'default', text: '' }]).map((subtask, index) => (
                    <Draggable key={subtask.id} draggableId={subtask.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <Box display="flex" gap="30px" alignItems="center" m={1}>
                            <Checkbox
                              style={{ cursor: 'pointer' }}
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
                </div>
              )}
            </Droppable>
          </DragDropContext>


          {/* Drawer Actions */}
          <Box sx={{ p: 4, display: "flex", alignItems: "center", gap: 2, m: 2, }}>
            <Button


              variant="contained" color="primary"
              // onClick={sendSaveChatMail}
              onClick={saveChat}
            >
              Save
            </Button>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Communication;
