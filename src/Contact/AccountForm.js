import {
  ListItem,
  Box,
  Grid,
  Menu,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
  FormControl,
  RadioGroup,
  Radio,
  Button,
  Select,
  Chip,
  MenuItem,
  TextField,
  useMediaQuery,
  Autocomplete,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { useTheme } from "@mui/material/styles";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import React, { useState, useEffect } from "react";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import axios from "axios";
import "react-phone-input-2/lib/style.css";
import { InputLabel } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "./contact.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
const AccountForm = ({ handleNewDrawerClose, handleDrawerClose }) => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  const API_KEY = process.env.REACT_APP_API_IP;
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedOption, setSelectedOption] = useState("Account Info");
  const [accountType, setAccountType] = useState("Individual");
  const [accountName, setaccountName] = useState("");
  const [companyname, setcompanyname] = useState("");
  const [cCountry, SetCCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [newUserId, setNewUserId] = useState("");
  // const [state, setstate] = useState('')
  const [cStreetAddress, SetCStreetAddress] = useState("");
  const [cCity, setCcity] = useState("");
  const [cStateProvince, SetCStateProvince] = useState("");
  const [cZipPostalCode, SetCZipPostalCode] = useState("");
  const [activeStep, setActiveStep] = useState("Account Info");

  const handleOptionChange = (event, value) => {
    setSelectedOption(value || event.target.value);
    setActiveStep(value || event.target.value);
  };

  const handleAccountTypeChange = (event) => {
    setAccountType(event.target.value);
  };

  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedTeamMemberValues, setCombinedTeamMemberValues] = useState([]);
  const [userData, setUserData] = useState([]);

  // console.log(combinedValues)
  useEffect(() => {
    fetchUserData();
  }, []);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchUserData = async () => {
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
    setCombinedTeamMemberValues(selectedValues);
  };
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const countryData = response.data.map((country) => ({
          name: country.name.common,
          code: country.cca2,
        }));
        setCountries(countryData);
      })
      .catch((error) => console.error("Error fetching country data:", error));
  }, []);

  //   useEffect(() => {
  //     axios
  //         .get('https://restcountries.com/v3.1/all')
  //         .then((response) => {
  //             const countryData = response.data.map((country) => ({
  //                 name: country.name.common,
  //                 code: country.cca2,
  //             }));
  //             setCountries(countryData);
  //         })
  //         .catch((error) =>
  //             console.error('Error fetching country data:', error)
  //         );
  // }, []);

  const [selectedTags, setSelectedTags] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);

  const handleTagChange = (event, newValue) => {
    setSelectedTags(newValue.map((option) => option.value));
    // Send selectedValues array to your backend
    console.log(
      "Selected Values:",
      newValue.map((option) => option.value)
    );
    // Assuming setCombinedValues is a function to send the values to your backend
    setCombinedValues(newValue.map((option) => option.value));
  };

  //Tag FetchData ================
  const [tags, setTags] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //  for tags
  const calculateWidth = (tagName) => {
    const baseWidth = 10; // base width for each tag
    const charWidth = 8; // approximate width of each character
    const padding = 10; // padding on either side
    return baseWidth + charWidth * tagName.length + padding;
  };

  const tagsOptions = tags.map((tag) => ({
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

  // folder templates
  const [folderTemplates, setFolderTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

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
  const handleSelectTemplate = (selectedOptions) => {
    setSelectedTemplate(selectedOptions);
  };
  const optionfolder = folderTemplates.map((folderTemplates) => ({
    value: folderTemplates._id,
    label: folderTemplates.templatename,
  }));
  const [AccountId, setAccountId] = useState();
  const [folderTempId, setFolderTempId] = useState();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedContactCountry, setSelectedContactCountry] = useState(null);
  // create account
  // const handleSubmit = () => {
  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");

  //   if (accountType === "Individual") {
  //     const raw = JSON.stringify({
  //       clientType: accountType,
  //       accountName: accountName,
  //       tags: combinedValues,
  //       teamMember: combinedTeamMemberValues,
  //     });

  //     const requestOptions = {
  //       method: "POST",
  //       headers: myHeaders,
  //       body: raw,
  //       redirect: "follow",
  //     };
  //     const url = `${ACCOUNT_API}/accounts/accountdetails`;
  //     fetch(url, requestOptions)
  //       .then((response) => response.json())
  //       .then((result) => {
  //         console.log(result);
  //         console.log(result.newAccount._id); // Log the result
  //         setAccountId(result.newAccount._id);
  //         setAccountData(result.newAccount)
  //         fetchAccountDataById(result.newAccount._id)
  //         // updateContactsAccountId(result.newAccount._id);
  //         toast.success("Form submitted successfully"); // Display success toast
  //         // window.location.reload();
  //         // handleDrawerClose();
  //         // handleNewDrawerClose();
  //         // navigate('/clients/accounts');
  //       })
  //       .catch((error) => {
  //         console.error(error); // Log the error
  //         toast.error("An error occurred while submitting the form"); // Display error toast
  //       });
  //   } else if (accountType === "Company") {
  //     const raw = JSON.stringify({
  //       clientType: accountType,
  //       accountName: accountName,
  //       tags: combinedValues,
  //       teamMember: combinedTeamMemberValues,
  //       companyName: companyname,
  //       country: selectedCountry,
  //       streetAddress: cStreetAddress,
  //       state: cStateProvince,
  //       city: cCity,
  //       postalCode: cZipPostalCode,
  //     });
  //     console.log(raw);
  //     const requestOptions = {
  //       method: "POST",
  //       headers: myHeaders,
  //       body: raw,
  //       redirect: "follow",
  //     };
  //     const url = `${ACCOUNT_API}/accounts/accountdetails`;
  //     fetch(url, requestOptions)
  //       .then((response) => response.json())
  //       .then((result) => {
  //         console.log(result); // Log the result
  //         console.log(result.newAccount._id);
  //         setAccountId(result.newAccount._id);
  //          setAccountData(result.newAccount)
  //         fetchAccountDataById(result.newAccount._id)
  //         // updateContactsAccountId(result.newAccount._id);
  //         toast.success("Form submitted successfully"); // Display success toast
  //         // window.location.reload();
  //         // handleDrawerClose();
  //         // handleNewDrawerClose();
  //       })
  //       .catch((error) => {
  //         console.error(error); // Log the error
  //         toast.error("An error occurred while submitting the form"); // Display error toast
  //       });
  //   }
  //   //todo contact
  // };

  // const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const SEVER_PORT = process.env.REACT_APP_SERVER_URI;
  const CLIENT_PORT = process.env.REACT_APP_CLIENT_SERVER_URI;

  // const clientCreatedmail = (email) => {
  //   const port = window.location.port;
  //   const urlportlogin = `${SEVER_PORT}/`;
  //   console.log(urlportlogin)

  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");

  //   const url = urlportlogin;
  //   const raw = JSON.stringify({
  //     email: email,
  //     url: url,
  //   });

  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };
  //   const urlusersavedmail = `${LOGIN_API}/clientsavedemail/`;
  //   fetch(urlusersavedmail, requestOptions)
  //     .then((response) => response.json())

  //     .then((result) => {
  //       console.log(result);
  //     })
  //     .catch((error) => console.error(error));
  // };

  const updateAcountUserId = (UserId, accountuserid) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      userid: UserId,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const Url = `${ACCOUNT_API}/accounts/accountdetails/${accountuserid}`;
    console.log(Url);

    fetch(Url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })

      .catch((error) => console.error(error));
  };
  const handleSubmit = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (accountType === "Individual") {
      const raw = JSON.stringify({
        clientType: accountType,
        accountName: accountName,
        tags: combinedValues,
        teamMember: combinedTeamMemberValues,
        foldertemplate: selectedTemplate.value,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${ACCOUNT_API}/accounts/accountdetails`;
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          const newAccountId = result.newAccount._id;
          console.log(result.newAccount._id); // Log the result
          setAccountId(result.newAccount._id);
          console.log(result.newAccount.foldertemplate);
          setFolderTempId(result.newAccount.foldertemplate);
          addFolderTemplate(newAccountId);

          // Assign the folder template after creating the account
          assignfoldertemp(newAccountId, result.newAccount.foldertemplate);
          setAccountData(result.newAccount);
          fetchAccountDataById(result.newAccount._id);
          // updateContactsAccountId(result.newAccount._id);
          toast.success("Form submitted successfully"); // Display success toast
        })
        .catch((error) => {
          console.error(error); // Log the error
          toast.error("An error occurred while submitting the form"); // Display error toast
        });
    } else if (accountType === "Company") {
      const raw = JSON.stringify({
        clientType: accountType,
        accountName: accountName,
        tags: combinedValues,
        teamMember: combinedTeamMemberValues,
        companyName: companyname,
        country: selectedCountry,
        streetAddress: cStreetAddress,
        state: cStateProvince,
        city: cCity,
        postalCode: cZipPostalCode,
        foldertemplate: selectedTemplate.value,
      });
      console.log(raw);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${ACCOUNT_API}/accounts/accountdetails`;
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result); // Log the result
          console.log(result.newAccount._id);
          setAccountId(result.newAccount._id);
          addFolderTemplate(result.newAccount._id);
          // updateContactsAccountId(result.newAccount._id);
          toast.success("Form submitted successfully"); // Display success toast
        })
        .catch((error) => {
          console.error(error); // Log the error
          toast.error("An error occurred while submitting the form"); // Display error toast
        });
    }
    //todo contact
  };
  const CLIENT_DOCS_API = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  const addFolderTemplate = (accountId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountId: accountId,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(raw);
    console.log("Creating folder for account:", accountId);
    fetch(`${CLIENT_DOCS_API}/clientdocs/clients`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  const assignfoldertemp = (accountId, foldertempId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountId: accountId,
      foldertempId: foldertempId,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    console.log(raw);
    fetch(`${CLIENT_DOCS_API}/clientdocs/accountfoldertemp`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };
  const [phoneNumbers, setPhoneNumbers] = useState([]);

  // const handleDeletePhoneNumber = (id) => {
  //   setPhoneNumbers((prevPhoneNumbers) =>
  //     prevPhoneNumbers.filter((item) => item.id !== id)
  //   );
  // };
  const handleDeletePhoneNumber = (phoneIndex) => {
    setPhoneNumbers((prevPhoneNumbers) => {
      // Create a new array excluding the phone number at the specified index
      return prevPhoneNumbers.filter((_, index) => index !== phoneIndex);
    });
  };

  //for creating multiple forms when click on Add New Contact
  const [contactCount, setContactCount] = useState(1);

  //*Dipeeka */

  // const updateContactsAccountId = (newAccountId) => {
  //   setContacts(contacts.map(contact => ({
  //     ...contact,
  //     accountid: newAccountId
  //   })));
  // };
  const [contacts, setContacts] = useState([]);

  // const [contacts, setContacts] = useState([{ firstName: "", middleName: "", lastName: "", contactName: "", companyName: "", note: "", ssn: "", email: "", login: "false", notify: "false", emailSync: "false", tags: [], phoneNumbers: [], country: "", streetAddress: "", city: "", state: "", postalCode: "", accountid: AccountId }]);

  console.log(contacts);

  const addNewContact = () => {
    setContacts([
      ...contacts,
      {
        firstName: "",
        middleName: "",
        lastName: "",
        contactName: "",
        companyName: "",
        note: "",
        ssn: "",
        email: "",
        login: "false",
        notify: "false",
        emailSync: "false",
        tags: [],
        phoneNumbers: [],
        country: "",
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        accountid: AccountId,
      },
    ]);
    setContactCount(contactCount + 1);
  };

  // const handleContactInputChange = (index, event) => {
  //   const { name, value } = event.target;
  //   const updatedContacts = [...contacts];
  //   updatedContacts[index] = { ...updatedContacts[index], [name]: value };
  //   setContacts(updatedContacts);
  // };

  const handleContactInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedContacts = [...contacts];
    updatedContacts[index] = { ...updatedContacts[index], [name]: value };

    // Automatically update the contact name based on first, middle, and last names
    const firstName = updatedContacts[index].firstName || "";
    const middleName = updatedContacts[index].middleName || "";
    const lastName = updatedContacts[index].lastName || "";
    updatedContacts[index].contactName =
      `${firstName} ${middleName} ${lastName}`.trim();

    setContacts(updatedContacts);
  };

  const handleContactSwitchChange = (index, fieldName, checked) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [fieldName]: checked ? "true" : "false",
    };
    setContacts(updatedContacts);
  };

  const handleContactPhoneNumberChange = (index, phoneIndex, phoneValue) => {
    setContacts((prevContacts) => {
      const updatedContacts = [...prevContacts];
      const contact = updatedContacts[index];

      // Ensure the phoneNumbers array has enough elements
      if (contact.phoneNumbers.length <= phoneIndex) {
        contact.phoneNumbers = [
          ...contact.phoneNumbers,
          ...Array(phoneIndex + 1 - contact.phoneNumbers.length).fill({
            phone: "",
          }),
        ];
      }

      // Update the phone number
      contact.phoneNumbers[phoneIndex] = {
        ...contact.phoneNumbers[phoneIndex],
        phone: phoneValue,
      };
      return updatedContacts;
    });
  };

  // const handleContactAddressChange = (index, field, value) => {
  //   setContacts((prevContacts) => {
  //     const updatedContacts = [...prevContacts];
  //     updatedContacts[index] = {
  //       ...updatedContacts[index],
  //       address: {
  //         ...updatedContacts[index].address,
  //         [field]: value
  //       }
  //     };
  //     return updatedContacts;
  //   });
  // };

  const handleContactAddressChange = (index, field, value) => {
    setContacts((prevContacts) => {
      const updatedContacts = [...prevContacts];
      updatedContacts[index] = {
        ...updatedContacts[index],
        [field]: value, // Set the field (streetAddress, city, etc.) to the new value
      };
      return updatedContacts;
    });
  };

  const handleContactTagChange = (index, event, newValue) => {
    // Map newValue to get an array of option values
    const selectedTags = newValue.map((option) => option.value);

    // Update the contacts state
    setContacts((prevContacts) => {
      const updatedContacts = [...prevContacts];
      updatedContacts[index].tags = selectedTags;
      return updatedContacts;
    });

    // Log the selected tags
    console.log("Selected Tags for contact", index, ":", selectedTags);

    // Update combined values
    setCombinedValues((prevCombinedValues) => [
      ...prevCombinedValues,
      ...selectedTags,
    ]);
  };
  const clientalldata = (userId, email, firstName, middleName, lastName) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: email,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      userid: userId,

      // phoneNumber: phoneNumber,
      accountName: accountName,
      password: "Demo@123",
      cpassword: "Demo@123",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(raw);
    const url = `${LOGIN_API}/admin/clientsignup/`;

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        console.log(result.client._id);
        // setClientIdUpdate(result.client._id)
        // newUser(result.client._id);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error signing up. Please try again.");
      });
  };
  const newUser = (accountid, email, firstName, middleName, lastName) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      username: firstName, // Use the first name as username
      email, // Use the provided email
      password: firstName, // Replace with a dynamic password logic if needed
      role: "Client",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${LOGIN_API}/common/login/signup`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        console.log(result._id);
        setNewUserId(result._id);
        // Update account with the newly created user ID
        updateAcountUserId(result._id, accountid);
        clientalldata(result._id, email, firstName, middleName, lastName);
        clientCreatedmail(email, personalMessage, result._id);
        // Optional: Trigger user created email notification
        // userCreatedmail();
      })
      .catch((error) => console.error(error));
  };

  console.log(newUserId);

  const handleContactAddPhoneNumber = () => {
    setPhoneNumbers((prevPhoneNumbers) => [
      ...prevPhoneNumbers,
      { id: Date.now(), phone: "", isPrimary: false },
    ]);
  };

  const handlesubmitContact = () => {
    console.log(contacts);
    //  const url =`${CONTACT_API}/contacts/`

    fetch(`${CONTACT_API}/contacts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contacts),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        handleDrawerClose();
        handleNewDrawerClose();
        const contactIds = data.newContacts.map((contact) => contact._id);
        updateContactstoAccount(contactIds);

        const filteredContacts = data.newContacts.filter(
          (contact) => contact.login
        );

        console.log("Filtered Contacts:", filteredContacts);

        filteredContacts.forEach((contact) => {
          newUser(
            contact.accountid,
            contact.email,
            contact.firstName,
            contact.middleName,
            contact.lastName
          );
        });

        // toast.success("Contact created successfully!");
        toast.success("Contact created successfully!");

        navigate("/clients/accounts");
        // Handle successful submission (e.g., clear forms, show success message)
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors (e.g., show error message)
      });
  };
  const handleopendialog = () => {
    setIsModalVisible(true);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [personalMessage, setPersonalMessage] = useState("");

  const handleCloseModal = () => {
    setIsModalVisible(false); // Hide the modal when close is clicked
  };

  const handleMessageChange = (event) => {
    setPersonalMessage(event.target.value); // Update personal message input
  };
  const updateContactstoAccount = (contactsIds) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const existingContactIds = contactData.map((contact) => contact._id);
    const combinedContacts = [
      ...new Set([...existingContactIds, ...contactsIds]),
    ];

    const raw = JSON.stringify({
      contacts: combinedContacts,
    });

    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${ACCOUNT_API}/accounts/accountdetails/${AccountId}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.error(error));
  };

  // link existing contacts
  const [open, setOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedContact, setExpandedContact] = useState(null);
  const [uniqueTags, setUniqueTags] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactName, setContactName] = useState(null);
  const [contactData, setContactData] = useState([]);
  const [accountData, setAccountData] = useState(null);
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContact(null); // Reset selected contact when menu closes
  };

  const handleExpandClick = (contactId) => {
    // Toggle between expanding and collapsing the selected contact
    setExpandedContact((prevExpanded) =>
      prevExpanded === contactId ? null : contactId
    );
  };

  const handleMenuClick = (event, id, contactName) => {
    setAnchorEl(event.currentTarget);
    setSelectedContact(id); // Set the selected contact ID here
    setContactName(contactName);
  };

  const handleEditDescription = async () => {
    handleMenuClose();
    console.log(selectedContact);
    try {
      const url = `${CONTACT_API}/contacts/${selectedContact}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setSelectedContact(data.contact);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleUnlink = () => {
    removecontactidfromaccount(selectedContact);
    handleMenuClose();
  };

  const handleContactUpdated = () => {
    fetchAccountDataById(accountDatabyid._id); // Refetch contacts when updated
  };

  const [allContactData, setAllContactData] = useState([]);
  // const fetchContacts = async () => {
  //   try {
  //     const response = await axios.get(`${CONTACT_API}/contacts/contactlist/list/`);
  //     console.log(response)
  //     setAllContactData(response.data.contactlist);
  //   } catch (error) {
  //     console.error("API Error:", error);
  //   }
  // };

  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        `${CONTACT_API}/contacts/contactlist/list/`
      );
      const flattenedContacts = response.data.contactlist.map((contact) => ({
        ...contact,
        phoneNumbers: contact.phoneNumbers
          .flat()
          .map((phoneObj) => phoneObj.phone),
        tags: contact.tags.flat().map((tagObj) => ({
          _id: tagObj._id,
          tagName: tagObj.tagName,
          tagColour: tagObj.tagColour,
        })),
      }));
      setAllContactData(flattenedContacts);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const removecontactidfromaccount = (contactId) => {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };
    fetch(
      `${ACCOUNT_API}/accounts/accountdetails/removecontactfromaccount/${AccountId}/${contactId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        handleContactUpdated();
      })
      .catch((error) => console.error(error));
  };

  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [accountDatabyid, setAccountDatabyid] = useState([]);

  const fetchAccountDataById = (accountId) => {
    fetch(
      `${ACCOUNT_API}/accounts/accountdetails/getAccountbyIdAll/${accountId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setAccountDatabyid(result.account);
        setContactData(result.account.contacts);
      })
      .catch((error) => console.error(error));
  };

  const getSelectedIds = () => selectedContacts.join(", ");

  // const setFilteredContact = () => {
  //   setFilteredContacts(
  //     allContactData.filter((contact) =>
  //       contact.name && contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  //     )
  //   );
  // };

  const setFilteredContact = () => {
    console.log("Search Query:", searchQuery);
    console.log("All Contacts Data:", allContactData);

    if (!searchQuery) {
      console.warn("Search query is empty");
      setFilteredContacts(allContactData); // Show all contacts if there's no search query
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = allContactData.filter((contact) => {
      console.log("Contact Name:", contact.name); // Log each contact name for inspection
      return (
        contact.name && contact.name.toLowerCase().includes(lowerCaseQuery)
      );
    });

    setFilteredContacts(filtered);
    console.log("Filtered Contacts:", filtered); // Log the result of filtering
  };

  console.log(allContactData);
  console.log(filteredContacts);
  const handleClickOpen = () => {
    setOpen(true);
    fetchContacts();
    // setFilteredContact();
  };

  console.log(contactData);
  console.log(filteredContacts);

  useEffect(() => {
    setFilteredContact();
  }, [searchQuery, allContactData]);

  const handleLinkAccounts = () => {
    linkContactsToAccount(selectedContacts);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  console.log(newUserId);
  const clientCreatedmail = (email, personalMessage, userid) => {
    const port = window.location.port;
    const urlportlogin = `${CLIENT_PORT}/updatepassword`;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const url = urlportlogin;
    const raw = JSON.stringify({
      email: email,
      personalMessage: personalMessage,
      url: url,
      AccountId: userid,
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const urlusersavedmail = `${LOGIN_API}/clientsavedemail/`;
    console.log(urlusersavedmail);
    fetch(urlusersavedmail, requestOptions)
      .then((response) => response.json())

      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.error(error));
  };

  const linkContactsToAccount = (selectedContacts) => {
    const existingContactIds = contactData.map((contact) => contact._id);
    const combinedContacts = [
      ...new Set([...existingContactIds, ...selectedContacts]),
    ]; // Deduplicate contacts
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contacts: combinedContacts }),
    };
    console.log(requestOptions.body);
    fetch(
      `${ACCOUNT_API}/accounts/accountdetails/${accountDatabyid._id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        handleDialogClose();
        fetchAccountDataById(accountDatabyid._id);
        toast.success("Contact added successfully");
      })
      .catch((error) => console.error(error));
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid grey",
        }}
      >
        <Typography variant="h6">New Account</Typography>
        <RxCross2
          style={{ cursor: "pointer" }}
          onClick={handleNewDrawerClose}
        />
      </Box>
      <Box className="account-form" sx={{ height: "90vh", overflowY: "auto" }}>
        <Box>
          <FormControl
            sx={{ width: "100%", display: "flex", alignItems: "center" }}
          >
            <RadioGroup
              row
              aria-labelledby="main-radio-buttons-group-label"
              name="main-radio-buttons-group"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <Box className="account-contact-info">
                {activeStep === "Contact Info" ? (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mr: 2,
                          gap: 2,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          handleOptionChange(null, "Account Info");
                        }}
                      >
                        <CheckCircleRoundedIcon style={{ color: "green" }} />
                        <Typography>Account Info</Typography>
                      </Box>

                      <ArrowForwardIosRoundedIcon />
                      <FormControlLabel
                        value="Contact Info"
                        control={<Radio checked />}
                        label="Contact Info"
                        sx={{ ml: 2 }}
                      />
                    </Box>
                  </>
                ) : (
                  <>
                    <FormControlLabel
                      value="Account Info"
                      control={
                        <Radio checked={selectedOption === "Account Info"} />
                      }
                      label="Account Info"
                      sx={{ mb: 2 }}
                    />
                    <ArrowForwardIosRoundedIcon />
                    <FormControlLabel
                      value="Contact Info"
                      control={
                        <Radio checked={selectedOption === "Contact Info"} />
                      }
                      label="Contact Info"
                      sx={{ mb: 2, ml: 2 }}
                    />
                  </>
                )}
              </Box>
            </RadioGroup>
          </FormControl>
        </Box>
        <Box sx={{ p: 2 }}>
          {selectedOption === "Account Info" && (
            <Box>
              {/* <Typography sx={{fontWeight:'bold'}}>Client Type</Typography> */}
              <Box>
                <h3>Client Type</h3>
              </Box>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="account-type-radio-buttons-group-label"
                  name="account-type-radio-buttons-group"
                  value={accountType}
                  onChange={handleAccountTypeChange}
                >
                  <FormControlLabel
                    value="Individual"
                    control={<Radio />}
                    label="Individual"
                  />
                  <FormControlLabel
                    value="Company"
                    control={<Radio />}
                    label="Company"
                  />
                </RadioGroup>
              </FormControl>
              {accountType === "Individual" && (
                <Box>
                  <Box>
                    <Box
                      className="account-Type-options"
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Box>
                        <h3>Account Info</h3>
                      </Box>

                      {/* <Box className='HelpOutlineRoundedIcon'></Box> */}

                      <Box className="MoreVertRoundedIcon">
                        <HelpOutlineRoundedIcon />
                        <MoreVertRoundedIcon />
                      </Box>
                    </Box>

                    <Box>
                      <InputLabel sx={{ color: "black" }}>
                        Account Name
                      </InputLabel>

                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Account Name"
                        value={accountName}
                        onChange={(e) => setaccountName(e.target.value)}
                        margin="normal"
                      />
                    </Box>

                    <Box>
                      <InputLabel sx={{ color: "black" }}>Tags</InputLabel>

                      <Autocomplete
                        multiple
                        size="small"
                        id="tags-outlined"
                        options={tagsOptions}
                        getOptionLabel={(option) => option.label}
                        value={tagsOptions.filter((option) =>
                          selectedTags.includes(option.value)
                        )}
                        onChange={handleTagChange}
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
                            sx={{ width: "100%", marginTop: "8px" }}
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
                      <InputLabel sx={{ color: "black" }}>
                        Team Member
                      </InputLabel>
                      <Autocomplete
                        multiple
                        sx={{ mt: 2 }}
                        options={options}
                        size="small"
                        getOptionLabel={(option) => option.label}
                        value={selectedUser}
                        onChange={handleUserChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Assignees"
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                      />
                    </Box>
                    <Box>
                      <Typography>Folder Template</Typography>
                      <Autocomplete
                        options={optionfolder}
                        getOptionLabel={(option) => option.label}
                        value={selectedTemplate}
                        onChange={(event, newValue) =>
                          handleSelectTemplate(newValue)
                        }
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
                          <TextField
                            {...params}
                            sx={{ backgroundColor: "#fff" }}
                            placeholder="select folder template"
                            variant="outlined"
                            size="small"
                          />
                        )}
                        sx={{ width: "100%", marginTop: "8px" }}
                        clearOnEscape // Enable clearable functionality
                      />
                    </Box>
                  </Box>
                </Box>
              )}
              {accountType === "Company" && (
                <Box>
                  <form>
                    <Box>
                      <Box>
                        <InputLabel sx={{ color: "black" }}>
                          Account Name
                        </InputLabel>

                        <TextField
                          value={accountName}
                          onChange={(e) => setaccountName(e.target.value)}
                          placeholder="Account Name"
                          fullWidth
                          size="small"
                          margin="normal"
                        />
                      </Box>

                      <Box>
                        <InputLabel sx={{ color: "black" }}>
                          Company Name
                        </InputLabel>
                        <TextField
                          fullWidth
                          size="small"
                          margin="normal"
                          value={companyname}
                          onChange={(e) => setcompanyname(e.target.value)}
                          placeholder="Company Name"
                        />
                      </Box>

                      <Box>
                        <InputLabel sx={{ color: "black" }}>Tags</InputLabel>

                        <Autocomplete
                          multiple
                          options={tagsOptions}
                          getOptionLabel={(option) => option.label}
                          // value={selectedTags}
                          value={tagsOptions.filter((option) =>
                            selectedTags.includes(option.value)
                          )}
                          onChange={handleTagChange}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                key={option.value}
                                label={option.label}
                                style={option.customTagStyle}
                                {...getTagProps({ index })}
                              />
                            ))
                          }
                          renderOption={(props, option) => (
                            <Box
                              component="li"
                              {...props}
                              style={option.customStyle}
                            >
                              {option.label}
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              size="small"
                              placeholder="select tags"
                            />
                          )}
                          sx={{ width: "100%", marginTop: "8px" }}
                        />
                      </Box>

                      <Box mt={2}>
                        <InputLabel sx={{ color: "black" }}>
                          Team Member
                        </InputLabel>

                        <Autocomplete
                          multiple
                          sx={{ mt: 2 }}
                          options={options}
                          size="small"
                          getOptionLabel={(option) => option.label}
                          value={selectedUser}
                          onChange={handleUserChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              placeholder="Assignees"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.value === value.value
                          }
                        />
                      </Box>
                    </Box>
                    <Box>
                      <Typography>Folder Template</Typography>
                      <Autocomplete
                        options={optionfolder}
                        getOptionLabel={(option) => option.label}
                        value={selectedTemplate}
                        onChange={(event, newValue) =>
                          handleSelectTemplate(newValue)
                        }
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
                          <TextField
                            {...params}
                            sx={{ backgroundColor: "#fff" }}
                            placeholder="select folder template"
                            variant="outlined"
                            size="small"
                          />
                        )}
                        sx={{ width: "100%", marginTop: "8px" }}
                        clearOnEscape // Enable clearable functionality
                      />
                    </Box>
                    <>
                      <Typography variant="h6" gutterBottom mt={3}>
                        Address
                      </Typography>
                      <Box>
                        <InputLabel sx={{ color: "black" }}>Country</InputLabel>
                        <Autocomplete
                          size="small"
                          options={countries}
                          getOptionLabel={(option) => option.name}
                          // value={cCountry}
                          // onChange={(event, newValue) => SetCCountry(newValue)}
                          value={selectedCountry}
                          onChange={(event, newValue) =>
                            setSelectedCountry(newValue)
                          }
                          renderOption={(props, option) => (
                            <ListItem
                              {...props}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px",
                                borderBottom: "1px solid #ddd",
                                cursor: "pointer",
                              }}
                            >
                              <Typography sx={{ fontWeight: 500 }}>
                                {option.name}
                              </Typography>
                              <Typography
                                sx={{ fontSize: "0.9rem", color: "gray" }}
                              >
                                {option.code}
                              </Typography>
                            </ListItem>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Country"
                              variant="outlined"
                              sx={{ marginTop: "8px", width: "100%" }}
                            />
                          )}
                        />
                        {/* <Select
                          size='small'
                          value={cCountry}
                          onChange={(e) => SetCCountry(e.target.value)}
                          sx={{
                            marginTop: '8px',
                            width: '100%',

                          }}
                        >
                          {countries.map((country) => (
                            <MenuItem key={country.code} value={country.code}>
                              {country.name}
                            </MenuItem>
                          ))}
                        </Select> */}
                      </Box>
                      <Box>
                        <InputLabel sx={{ color: "black", mt: 2 }}>
                          Street address
                        </InputLabel>
                        <TextField
                          placeholder="Street address"
                          value={cStreetAddress}
                          onChange={(e) => SetCStreetAddress(e.target.value)}
                          size="small"
                          fullWidth
                          margin="normal"
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: isSmallScreen ? "column" : "row",
                          gap: isSmallScreen ? 2 : 5,
                          mt: 2,
                        }}
                      >
                        <Box>
                          <InputLabel sx={{ color: "black" }}>City</InputLabel>

                          <TextField
                            fullWidth
                            margin="normal"
                            name="city"
                            value={cCity}
                            onChange={(e) => setCcity(e.target.value)}
                            placeholder="City"
                            size="small"
                          />
                        </Box>
                        <Box>
                          <InputLabel sx={{ color: "black" }}>
                            State/Province
                          </InputLabel>

                          <TextField
                            margin="normal"
                            name="state"
                            fullWidth
                            value={cStateProvince}
                            onChange={(e) => SetCStateProvince(e.target.value)}
                            placeholder="State/Province"
                            size="small"
                          />
                        </Box>
                        <Box>
                          <InputLabel sx={{ color: "black" }}>
                            ZIP/Postal Code
                          </InputLabel>

                          <TextField
                            margin="normal"
                            fullWidth
                            name="postalCode"
                            value={cZipPostalCode}
                            onChange={(e) => SetCZipPostalCode(e.target.value)}
                            placeholder="ZIP/Postal Code"
                            size="small"
                          />
                        </Box>
                      </Box>
                    </>
                  </form>
                </Box>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ borderRadius: "10px", mt: 3 }}
                onClick={() => {
                  handleOptionChange(null, "Contact Info");
                  handleSubmit();
                }}
              >
                Continue
              </Button>
            </Box>
          )}
        </Box>
        <Box>
          {selectedOption === "Contact Info" && (
            <Box className="create_new_contactform-container">
              <Box className="create_new_contactform-container">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <h3 style={{ marginLeft: "20px" }}>Contacts</h3>
                  <Box
                    onClick={handleClickOpen}
                    sx={{
                      color: "#1976d3",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "5px",
                    }}
                  >
                    <AddCircleOutlineIcon />
                    <Typography>Link existing contact</Typography>
                  </Box>
                </Box>

                <Box>
                  {contactData.length > 0 ? (
                    contactData.map((contact) => (
                      <Box key={contact._id} sx={{ padding: 2 }}>
                        {/* Header Section - Always Visible */}
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item xs="auto">
                            <Button
                              variant="text"
                              sx={{
                                padding: 0,
                                minWidth: "auto",
                                marginRight: 1,
                              }}
                              onClick={() => handleExpandClick(contact._id)}
                            >
                              <ExpandMoreIcon />
                            </Button>
                          </Grid>
                          <Grid item xs>
                            <Typography variant="h6" textAlign="left">
                              {contact.firstName} {contact.middleName}{" "}
                              {contact.lastName}
                            </Typography>
                          </Grid>
                          <Grid item xs="auto">
                            <IconButton
                              aria-label="more options"
                              size="small"
                              onClick={(e) =>
                                handleMenuClick(e, contact._id, contactName)
                              }
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Grid>
                        </Grid>

                        {/* Dropdown Menu */}
                        <Menu
                          anchorEl={anchorEl}
                          open={menuOpen} // Use derived state here
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={handleEditDescription}>
                            Edit Existing Contact
                          </MenuItem>
                          <MenuItem onClick={handleUnlink}>Unlink</MenuItem>
                        </Menu>

                        {/* Show Company Name, Email, and Toggles Always */}
                        <Box sx={{ marginY: 2, marginLeft: 4 }}>
                          {/* Company Name */}
                          <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            gutterBottom
                            textAlign="left"
                          >
                            Company Name
                          </Typography>
                          <Typography variant="body2" textAlign="left">
                            {contact.companyName}
                          </Typography>

                          {/* Email */}
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            textAlign="left"
                            sx={{ marginTop: 1 }}
                          >
                            {contact.email}
                          </Typography>

                          {/* Toggle Switches */}
                          <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                            <FormControlLabel
                              control={
                                <Switch checked={contact.login} readOnly />
                              }
                              label="Login"
                            />
                            <FormControlLabel
                              control={
                                <Switch checked={contact.notify} disabled />
                              }
                              label="Notify"
                            />
                            <FormControlLabel
                              control={
                                <Switch checked={contact.emailSync} readOnly />
                              }
                              label="Email Sync"
                            />
                          </Box>
                        </Box>

                        {/* Conditionally Render Details on Expand */}
                        {expandedContact === contact._id && (
                          <Box sx={{ marginY: 2, marginLeft: 4 }}>
                            {/* Additional Details */}
                            {/* Note Section */}
                            <Box sx={{ marginTop: 2 }}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                                textAlign="left"
                              >
                                Note
                              </Typography>
                              <Typography variant="body2" textAlign="left">
                                {contact.note}
                              </Typography>
                            </Box>

                            {/* SSN Section */}
                            <Box sx={{ marginTop: 2 }}>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                gutterBottom
                                textAlign="left"
                              >
                                SSN
                              </Typography>
                              <Typography variant="body2" textAlign="left">
                                {contact.ssn}
                              </Typography>
                            </Box>

                            {/* Address Section */}
                            <Box>
                              <Typography variant="h6" textAlign="left">
                                Address
                              </Typography>
                              <Box sx={{ marginY: 1 }}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  gutterBottom
                                  textAlign="left"
                                >
                                  Country
                                </Typography>
                                <Typography variant="body2" textAlign="left">
                                  {contact.country.name}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  gutterBottom
                                  textAlign="left"
                                >
                                  Street Address
                                </Typography>
                                <Typography variant="body2" textAlign="left">
                                  {contact.streetAddress || "N/A"}
                                </Typography>
                              </Box>
                              <Grid container spacing={0}>
                                <Grid item xs={4}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                    gutterBottom
                                    textAlign="left"
                                  >
                                    City
                                  </Typography>
                                  <Typography variant="body2" textAlign="left">
                                    {contact.city || "N/A"}
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                    gutterBottom
                                    textAlign="left"
                                  >
                                    State / Province
                                  </Typography>
                                  <Typography variant="body2" textAlign="left">
                                    {contact.state || "N/A"}
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                    gutterBottom
                                    textAlign="left"
                                  >
                                    ZIP / Postal Code
                                  </Typography>
                                  <Typography variant="body2" textAlign="left">
                                    {contact.postalCode || "N/A"}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>

                            {/* Linked Accounts Section */}
                            {contact.tags && (
                              <Box>
                                <Typography variant="h6" textAlign="left">
                                  Linked Accounts
                                </Typography>
                                <Box>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                    gutterBottom
                                    textAlign="left"
                                  >
                                    Linked accounts
                                  </Typography>
                                  {contact.tags.map((tag, index) => (
                                    <Box
                                      key={index}
                                      sx={{
                                        display: "inline-block",
                                        backgroundColor:
                                          tag.tagColour || "#f0f0f0",
                                        borderRadius: "20px",
                                        padding: "4px 12px",
                                        margin: "4px",
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        component="span"
                                        textAlign="left"
                                      >
                                        {accountData.accountName}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </Box>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="h6">No linked contacts</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Link an existing contact or add a new one to finish
                        creating the account.
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* MUI Dialog */}
                <Dialog open={open} onClose={handleDialogClose}>
                  <DialogTitle>Search for a Contact</DialogTitle>
                  <Divider />
                  <DialogContent>
                    <DialogContentText>
                      Search for an existing contact by entering their name,
                      phone number, or email. If the contact is not in your CRM,
                      click "Cancel" and create one on the previous page.
                    </DialogContentText>

                    <Box mt={5}>
                      <InputLabel sx={{ color: "black" }}>
                        Serch for contact
                      </InputLabel>
                      <Autocomplete
                        multiple
                        options={filteredContacts}
                        getOptionLabel={(option) => option.name}
                        // onInputChange={(event, newValue) => setSearchQuery(newValue)}
                        onChange={(event, newValue) => {
                          const ids = newValue.map((contact) => contact.id);
                          setSelectedContacts(ids);
                          console.log(getSelectedIds());
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Search contacts..."
                            onFocus={(e) => e.stopPropagation()}
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {option.name}
                          </li>
                        )}
                        fullWidth
                        disableClearable
                        value={filteredContacts.filter((contact) =>
                          selectedContacts.includes(contact.id)
                        )}
                      />
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button variant="contained" onClick={handleLinkAccounts}>
                      Add
                    </Button>
                    <Button onClick={handleDialogClose} color="primary">
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>

              {contacts.map((contact, index) => (
                <Box
                  style={{
                    border: "1px solid #e2e8f0",
                    margin: "15px",
                    borderRadius: "8px",
                    height: "55vh",
                    overflowY: "auto",
                    padding: "15px",
                  }}
                  className="create_new_contactform"
                >
                  <Typography variant="h6" gutterBottom sx={{ ml: 1 }}>
                    Contact {index + 1}
                  </Typography>
                  <Box>
                    <form>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: isSmallScreen ? "column" : "row",
                          gap: isSmallScreen ? 2 : 5,
                          padding: "1px 5px 0 5px",
                        }}
                      >
                        <Box>
                          <InputLabel sx={{ color: "black" }}>
                            First Name
                          </InputLabel>
                          <TextField
                            margin="normal"
                            fullWidth
                            name="firstName"
                            placeholder="First Name"
                            size="small"
                            onChange={(e) => handleContactInputChange(index, e)}
                          />
                        </Box>
                        <Box>
                          <InputLabel sx={{ color: "black" }}>
                            Middle Name
                          </InputLabel>
                          <TextField
                            margin="normal"
                            fullWidth
                            name="middleName"
                            placeholder="Middle Name"
                            size="small"
                            onChange={(e) => handleContactInputChange(index, e)}
                          />
                        </Box>
                        <Box>
                          <InputLabel sx={{ color: "black" }}>
                            Last Name
                          </InputLabel>
                          <TextField
                            fullWidth
                            name="lastName"
                            margin="normal"
                            placeholder="Last name"
                            size="small"
                            onChange={(e) => handleContactInputChange(index, e)}
                          />
                        </Box>
                      </Box>
                      <Box>
                        <InputLabel sx={{ color: "black" }}>
                          Contact Name
                        </InputLabel>
                        <TextField
                          name="contactName"
                          fullWidth
                          placeholder="Contact Name"
                          margin="normal"
                          size="small"
                          value={contact.contactName}
                          onChange={(e) => handleContactInputChange(index, e)}
                        />
                      </Box>
                      <Box>
                        <InputLabel sx={{ color: "black" }}>
                          Company Name
                        </InputLabel>
                        <TextField
                          fullWidth
                          name="companyName"
                          margin="normal"
                          placeholder="Company Name"
                          size="small"
                          onChange={(e) => handleContactInputChange(index, e)}
                        />
                      </Box>
                      <Box>
                        <InputLabel sx={{ color: "black" }}>Note</InputLabel>
                        <TextField
                          fullWidth
                          multiline
                          name="note"
                          margin="normal"
                          placeholder="Note"
                          size="small"
                          onChange={(e) => handleContactInputChange(index, e)}
                        />
                      </Box>
                      <Box>
                        <InputLabel sx={{ color: "black" }}>SSN</InputLabel>
                        <TextField
                          fullWidth
                          name="ssn"
                          margin="normal"
                          placeholder="SSN"
                          size="small"
                          onChange={(e) => handleContactInputChange(index, e)}
                        />
                      </Box>
                      <Box>
                        <InputLabel sx={{ color: "black" }}>Email</InputLabel>
                        <TextField
                          fullWidth
                          name="email"
                          margin="normal"
                          placeholder="Email"
                          size="small"
                          onChange={(e) => handleContactInputChange(index, e)}
                        />
                      </Box>
                      {/* Switches for Login, Notify, and Email Sync */}
                      <Box sx={{ mt: 1 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={contact.login === "true"}
                              onChange={(e) =>
                                handleContactSwitchChange(
                                  index,
                                  "login",
                                  e.target.checked
                                )
                              }
                              color="primary"
                            />
                          }
                          label="Login"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={contact.notify === "true"}
                              onChange={(e) =>
                                handleContactSwitchChange(
                                  index,
                                  "notify",
                                  e.target.checked
                                )
                              }
                              color="primary"
                            />
                          }
                          label="Notify"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={contact.emailSync === "true"}
                              onChange={(e) =>
                                handleContactSwitchChange(
                                  index,
                                  "emailSync",
                                  e.target.checked
                                )
                              }
                              color="primary"
                            />
                          }
                          label="Email Sync"
                        />
                      </Box>

                      <Box key={contact.id}>
                        <InputLabel sx={{ color: "black" }}>Tags</InputLabel>

                        <Autocomplete
                          multiple
                          options={tagsoptions}
                          getOptionLabel={(option) => option.label}
                          value={tagsoptions.filter((option) =>
                            (contact.tags || []).includes(option.value)
                          )}
                          // value={contact.selectedTags || []} // Ensure it's an array
                          onChange={(event, newValue) =>
                            handleContactTagChange(index, event, newValue)
                          }
                          renderTags={(tagValue, getTagProps) =>
                            tagValue.map((option, index) => (
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
                              size="small"
                              placeholder="Select tags"
                              sx={{ width: "100%", marginTop: "8px" }}
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
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ ml: 1, fontWeight: "bold", mt: 3 }}
                      >
                        Phone Numbers
                      </Typography>
                      {phoneNumbers.map((phone, phoneIndex) => (
                        <Box
                          key={phone.id}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 2,
                            ml: 1,
                            mb: 2,
                          }}
                        >
                          {phone.isPrimary && (
                            <Chip
                              label="Primary phone"
                              color="primary"
                              size="small"
                              sx={{ position: "absolute", mt: -3 }}
                            />
                          )}
                          <PhoneInput
                            country={"us"}
                            value={phone.phone}
                            onChange={(phoneValue) =>
                              handleContactPhoneNumberChange(
                                index,
                                phoneIndex,
                                phoneValue
                              )
                            }
                            inputStyle={{
                              width: "100%",
                            }}
                            buttonStyle={{
                              borderTopLeftRadius: "8px",
                              borderBottomLeftRadius: "8px",
                            }}
                            containerStyle={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          />
                          <AiOutlineDelete
                            onClick={() => handleDeletePhoneNumber(phoneIndex)}
                            style={{ cursor: "pointer", color: "red" }}
                          />
                        </Box>
                      ))}

                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: isSmallScreen ? "center" : "flex-start",
                          ml: 1,
                          cursor: "pointer",
                          color: "blue",
                          fontWeight: 600,
                        }}
                        onClick={() => handleContactAddPhoneNumber(index)}
                      >
                        <AiOutlinePlusCircle style={{ marginTop: "20px" }} />
                        <p>Add phone number</p>
                      </Box>

                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ ml: 1, fontWeight: "bold", mt: 3 }}
                      >
                        Address
                      </Typography>

                      <Box key={contact.id}>
                        {/* Country Selection */}
                        <Box>
                          <InputLabel sx={{ color: "black" }}>
                            Country
                          </InputLabel>

                          <Autocomplete
                            size="small"
                            options={countries}
                            getOptionLabel={(option) => option.name}
                            value={contact.country} // Update to reflect the contact's current country
                            onChange={(event, newValue) => {
                              // Update the contact's country in the contacts state
                              const updatedContact = {
                                ...contact,
                                country: newValue, // Assuming newValue is an object { name, code }
                              };
                              setContacts((prevContacts) => {
                                const updatedContacts = [...prevContacts];
                                updatedContacts[index] = updatedContact; // Update the specific contact
                                return updatedContacts;
                              });
                            }}
                            renderOption={(props, option) => (
                              <ListItem
                                {...props}
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  padding: "8px",
                                  borderBottom: "1px solid #ddd",
                                  cursor: "pointer",
                                }}
                              >
                                <Typography sx={{ fontWeight: 500 }}>
                                  {option.name}
                                </Typography>
                                <Typography
                                  sx={{ fontSize: "0.9rem", color: "gray" }}
                                >
                                  {option.code}
                                </Typography>
                              </ListItem>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Country"
                                variant="outlined"
                                sx={{ marginTop: "8px", width: "100%" }}
                              />
                            )}
                          />
                        </Box>
                      </Box>
                      <Box>
                        <InputLabel sx={{ color: "black", mt: 2 }}>
                          Street address
                        </InputLabel>
                        <TextField
                          fullWidth
                          name="streetAddress"
                          margin="normal"
                          placeholder="Street address"
                          size="small"
                          onChange={(e) =>
                            handleContactAddressChange(
                              index,
                              "streetAddress",
                              e.target.value
                            )
                          }
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: isSmallScreen ? "column" : "row",
                          gap: isSmallScreen ? 2 : 5,
                          mt: 2,
                        }}
                      >
                        <Box>
                          <InputLabel sx={{ color: "black" }}>City</InputLabel>
                          <TextField
                            fullWidth
                            margin="normal"
                            name="city"
                            placeholder="City"
                            size="small"
                            onChange={(e) =>
                              handleContactAddressChange(
                                index,
                                "city",
                                e.target.value
                              )
                            }
                          />
                        </Box>
                        <Box>
                          <InputLabel sx={{ color: "black" }}>
                            State/Province
                          </InputLabel>
                          <TextField
                            margin="normal"
                            name="state"
                            fullWidth
                            placeholder="State/Province"
                            size="small"
                            onChange={(e) =>
                              handleContactAddressChange(
                                index,
                                "state",
                                e.target.value
                              )
                            }
                          />
                        </Box>
                        <Box>
                          <InputLabel sx={{ color: "black" }}>
                            ZIP/Postal Code
                          </InputLabel>
                          <TextField
                            margin="normal"
                            fullWidth
                            name="postalCode"
                            placeholder="ZIP/Postal Code"
                            size="small"
                            onChange={(e) =>
                              handleContactAddressChange(
                                index,
                                "postalCode",
                                e.target.value
                              )
                            }
                          />
                        </Box>
                      </Box>
                    </form>
                  </Box>
                </Box>
              ))}

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  ml: 1,
                  cursor: "pointer",
                  color: "#1976d3",
                  fontWeight: 600,
                  marginLeft: "20px",
                }}
              >
                <AiOutlinePlusCircle />
                <p onClick={addNewContact}>Add New Contact</p>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  padding: "1px 5px 0 5px",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    mt: 2,
                    ml: 3,
                    borderRadius: "10px",
                  }}
                  onClick={() => {
                    handleOptionChange(null, "Account Info");
                  }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    mt: 2,

                    borderRadius: "10px",
                  }}
                  // onClick={handlesubmitContact}
                  onClick={handleopendialog}
                >
                  Create
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  // onClick={onClose}
                  sx={{
                    mt: 2,

                    borderRadius: "10px",
                  }}
                >
                  Cancel
                </Button>
              </Box>

              {/* Material-UI Dialog for Modal */}
              <Dialog open={isModalVisible} onClose={handleCloseModal}>
                <DialogTitle>Add portal access</DialogTitle>
                <DialogContent>
                  <p>You are adding portal access for the following users:</p>
                  <div>{contacts.email}</div>
                  <TextField
                    label="Personal message"
                    variant="outlined"
                    fullWidth
                    value={personalMessage}
                    onChange={handleMessageChange}
                    // onChange={(e) => handleContactInputChange(index, e)}
                    sx={{ mt: 2 }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseModal} color="primary">
                    Skip
                  </Button>
                  <Button onClick={handlesubmitContact} color="primary">
                    Send
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AccountForm;
