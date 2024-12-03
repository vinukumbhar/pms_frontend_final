import { Box, ListItem, Chip, Grid, Typography, Divider, Button, Autocomplete, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormControl, InputLabel, RadioGroup, Radio, TextField, IconButton, Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme, useMediaQuery, Menu, MenuItem, Select, Drawer } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { toast } from "react-toastify";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import ContactUpdateForm from "./contactupdate";

const Accountupdate = ({ onClose, selectedAccount }) => {
  const theme = useTheme();
  const USER_API = process.env.REACT_APP_USER_URL;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedOption, setSelectedOption] = useState("Account Info");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const isMobile = useMediaQuery("(max-width: 1000px)");

  const handleOptionChange = (event, value) => {
    setSelectedOption(value || event.target.value);
    setActiveStep(value || event.target.value);
  };
  const [activeStep, setActiveStep] = useState("Account Info");
  const [accountType, setAccountType] = useState("Individual");
  const handleAccountTypeChange = (event) => {
    setAccountType(event.target.value);
  };

  //for tags
  const [combinedValues, setCombinedValues] = useState([]);

  //Tag FetchData ================

  useEffect(() => {
    fetchData();
  }, []);
  const [tags, setTags] = useState([]);
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

  const [userData, setUserData] = useState([]);

  // console.log(combinedValues)
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const url = `${USER_API}/api/auth/users`;
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const calculateWidth = (tagName) => {
    // const options = userData.map((user) => ({
    //     value: user._id,
    //     label: user.username,
    // }));
    const baseWidth = 10; // base width for each tag
    const charWidth = 8; // approximate width of each character
    const padding = 10; // padding on either side
    return baseWidth + charWidth * tagName.length + padding;
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
    setCombinedValues((prevCombinedValues) => [...prevCombinedValues, ...selectedTags]);
  };

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

  const [countries, setCountries] = useState([]);
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

  const [phoneNumbers, setPhoneNumbers] = useState([]);

  const handleDeletePhoneNumber = (phoneIndex) => {
    setPhoneNumbers((prevPhoneNumbers) => {
      // Create a new array excluding the phone number at the specified index
      return prevPhoneNumbers.filter((_, index) => index !== phoneIndex);
    });
  };
  const handleContactPhoneNumberChange = (index, phoneIndex, phoneValue) => {
    setContacts((prevContacts) => {
      const updatedContacts = [...prevContacts];
      const contact = updatedContacts[index];

      // Ensure the phoneNumbers array has enough elements
      if (contact.phoneNumbers.length <= phoneIndex) {
        contact.phoneNumbers = [...contact.phoneNumbers, ...Array(phoneIndex + 1 - contact.phoneNumbers.length).fill({ phone: "" })];
      }

      // Update the phone number
      contact.phoneNumbers[phoneIndex] = { ...contact.phoneNumbers[phoneIndex], phone: phoneValue };
      return updatedContacts;
    });
  };
  const handleContactAddPhoneNumber = () => {
    setPhoneNumbers((prevPhoneNumbers) => [...prevPhoneNumbers, { id: Date.now(), phone: "", isPrimary: false }]);
  };

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

  //for creating multiple forms when click on Add New Contact
  const [contactCount, setContactCount] = useState(1);

  //*Dipeeka */

  const [AccountId, setAccountId] = useState();

  // const [contacts, setContacts] = useState([{ firstName: '', middleName: '', lastName: '', contactName: '', companyName: '', note: '', ssn: '', email: '', login: 'false', notify: 'false', emailSync: 'false', tags: [], phoneNumbers: [], country: '', streetAddress: '', city: '', state: '', postalCode: '', accountid: AccountId }]);
  const [contacts, setContacts] = useState([]);

  console.log(contacts);

  const addNewContact = () => {
    setContacts([...contacts, { firstName: "", middleName: "", lastName: "", contactName: "", companyName: "", note: "", ssn: "", email: "", login: "false", notify: "false", emailSync: "false", tags: [], phoneNumbers: [], country: "", streetAddress: "", city: "", state: "", postalCode: "", accountid: AccountId }]);
    setContactCount(contactCount + 1);
  };

  const handleContactSwitchChange = (index, fieldName, checked) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = { ...updatedContacts[index], [fieldName]: checked ? "true" : "false" };
    setContacts(updatedContacts);
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedTeamMemberValues, setCombinedTeamMemberValues] = useState([]);

  const handleUserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setCombinedTeamMemberValues(selectedValues);
  };
  console.log(combinedTeamMemberValues);
  //Account Data Integration
  const [accountName, setaccountName] = useState("");
  const [companyname, setcompanyname] = useState("");
  const [combinedTagsValues, setCombinedTagsValues] = useState([]);
  const [tagsNew, setTagsNew] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({ name: "", code: "" });
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    if (selectedAccount) {
      console.log(selectedAccount._id);
      setAccountType(selectedAccount.clientType);
      setaccountName(selectedAccount.accountName);
      // setContacts(selectedAccount.contacts)
      // Safely check if companyAddress exists before accessing its properties
      if (selectedAccount.companyAddress) {
        setcompanyname(selectedAccount.companyAddress.companyName);
        setSelectedCountry({
          name: selectedAccount.companyAddress.country?.name || "", // Use name field or an empty string
          code: selectedAccount.companyAddress.country?.code || "", // Use code field or an empty string
        });
        setStreetAddress(selectedAccount.companyAddress.streetAddress || "");
        setCity(selectedAccount.companyAddress.city || "");
        setState(selectedAccount.companyAddress.state || "");
        setPostalCode(selectedAccount.companyAddress.postalCode || "");
      } else {
        // Reset to empty or default values if companyAddress is undefined
        setcompanyname("");
        setSelectedCountry({ name: "", code: "" });
        setStreetAddress("");
        setCity("");
        setState("");
        setPostalCode("");
      }

      // Map Team Members
      const mappedTeamMembers = selectedAccount.teamMember.map((member) => ({
        value: member._id,
        label: member.username,
        email: member.email,
        customStyle: {
          fontSize: "15px",
        },
      }));

      // Set selected team members in state
      setSelectedUser(mappedTeamMembers.filter((member) => selectedAccount.teamMember.some((selected) => selected._id === member.value)));

      setCombinedTeamMemberValues(
        mappedTeamMembers.filter((member) => selectedAccount.teamMember.some((selected) => selected._id === member.value)).map((member) => member.value) // Extract only the 'value' (ID) here
      );
      // Map Tags
      const mappedTags =
        selectedAccount.tags?.map((tag) => ({
          value: tag._id,
          label: tag.tagName,
          colour: tag.tagColour,
          customTagStyle: {
            backgroundColor: tag.tagColour,
            color: "#fff",
            alignItems: "center",
            textAlign: "center",
            padding: "2px 8px", // Note: Corrected padding format
            fontSize: "15px",
            cursor: "pointer",
          },
        })) || [];

      // Set the available tags and the selected tag values in the state
      setTagsNew(mappedTags);
      setCombinedTagsValues(mappedTags.map((tag) => tag.value)); // Assuming combinedTagsValues holds the selected tag IDs
    }
  }, [selectedAccount]);

  const handleCountryChange = (event) => {
    const selectedCode = event.target.value;
    const selectedCountryObj = countries.find((country) => country.code === selectedCode);

    setSelectedCountry({
      name: selectedCountryObj.name,
      code: selectedCode,
    });
  };

  // create account
  const handleSubmit = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (accountType === "Individual") {
      const raw = JSON.stringify({
        clientType: accountType,
        accountName: accountName,
        tags: combinedTagsValues,
        teamMember: combinedTeamMemberValues,
      });
      console.log(raw);
      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${ACCOUNT_API}/accounts/accountdetails/${selectedAccount._id}`;
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          console.log(result.updatedAccount); // Log the result
          setAccountId(result.updatedAccount._id);
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
        tags: combinedTagsValues,
        teamMember: combinedTeamMemberValues,
        companyName: companyname,
        country: selectedCountry,
        streetAddress: streetAddress,
        state: state,
        city: city,
        postalCode: postalCode,
      });
      console.log(raw);
      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${ACCOUNT_API}/accounts/accountdetails/${selectedAccount._id}`;
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result); // Log the result
          console.log(result.updatedAccount._id);
          setAccountId(result.updatedAccount._id);
          // updateContactsAccountId(result.newAccount._id);
          toast.success("Form submitted successfully"); // Display success toast
        })
        .catch((error) => {
          console.error(error); // Log the error
          toast.error("An error occurred while submitting the form"); // Display error toast
        });
    }
  };

  // This state will keep track of which contact's details are expanded
  const [expandedContact, setExpandedContact] = useState(null);

  const handleExpandClick = (contactId) => {
    // Toggle between expanding and collapsing the selected contact
    setExpandedContact((prevExpanded) => (prevExpanded === contactId ? null : contactId));
  };

  const [selectedContact, setSelectedContact] = useState(null);
  const [contactName, setContactName] = useState(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContact(null); // Reset selected contact when menu closes
  };

  const handleMenuClick = (event, id, contactName) => {
    setAnchorEl(event.currentTarget);
    setSelectedContact(id); // Set the selected contact ID here
    setContactName(contactName);
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  //Contact Update
  const [uniqueTags, setUniqueTags] = useState([]);

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

  const [contactData, setContactData] = useState([]);

  const handleContactUpdated = () => {
    fetchContacts(); // Refetch contacts when updated
  };
  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${CONTACT_API}/contacts/contactlist/list/`);
      setContactData(response.data.contactlist);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const removecontactidfromaccount = (contactId) => {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };
    fetch(`${ACCOUNT_API}/accounts/accountdetails/removecontactfromaccount/${selectedAccount._id}/${contactId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        handleContactUpdated();
      })
      .catch((error) => console.error(error));
  };

  const handleUnlink = () => {
    removecontactidfromaccount(selectedContact);
    handleMenuClose();
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
        // handleDrawerClose();
        // handleNewDrawerClose();
        const contactIds = data.newContacts.map((contact) => contact._id);
        updateContactstoAccount(contactIds);
        toast.success("Contact created successfully!");
        navigate("/clients/accounts");
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors (e.g., show error message)
      });
  };

  const updateContactstoAccount = (contactsIds) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const existingContactIds = selectedAccount.contacts.map((contact) => contact._id);

    // Combine existing contact IDs with the new ones
    const combinedContacts = [...existingContactIds, ...contactsIds];

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

    fetch(`${ACCOUNT_API}/accounts/accountdetails/${selectedAccount._id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.error(error));
  };

  const handleContactInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedContacts = [...contacts];
    updatedContacts[index] = { ...updatedContacts[index], [name]: value };

    // Automatically update the contact name based on first, middle, and last names
    const firstName = updatedContacts[index].firstName || "";
    const middleName = updatedContacts[index].middleName || "";
    const lastName = updatedContacts[index].lastName || "";
    updatedContacts[index].contactName = `${firstName} ${middleName} ${lastName}`.trim();

    setContacts(updatedContacts);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: "1px solid grey" }}>
        <Typography variant="h6">Edit account</Typography>
        <RxCross2 style={{ cursor: "pointer" }} onClick={onClose} />
      </Box>
      <Box className="account-form" sx={{ height: "90vh", overflowY: "auto" }}>
        <Box>
          <FormControl sx={{ width: "100%", display: "flex", alignItems: "center" }}>
            <RadioGroup row aria-labelledby="main-radio-buttons-group-label" name="main-radio-buttons-group" value={selectedOption} onChange={handleOptionChange}>
              <Box className="account-contact-info">
                {activeStep === "Contact Info" ? (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mr: 2, gap: 2, cursor: "pointer" }}
                        onClick={() => {
                          handleOptionChange(null, "Account Info");
                        }}
                      >
                        <CheckCircleRoundedIcon style={{ color: "green" }} />
                        <Typography>Account Info</Typography>
                      </Box>

                      <ArrowForwardIosRoundedIcon />
                      <FormControlLabel value="Contact Info" control={<Radio checked />} label="Contact Info" sx={{ ml: 2 }} />
                    </Box>
                  </>
                ) : (
                  <>
                    <FormControlLabel value="Account Info" control={<Radio checked={selectedOption === "Account Info"} />} label="Account Info" sx={{ mb: 2 }} />
                    <ArrowForwardIosRoundedIcon />
                    <FormControlLabel value="Contact Info" control={<Radio checked={selectedOption === "Contact Info"} />} label="Contact Info" sx={{ mb: 2, ml: 2 }} />
                  </>
                )}
              </Box>
            </RadioGroup>
          </FormControl>
          <Box sx={{ p: 2 }}>
            {selectedOption === "Account Info" && (
              <Box>
                {/* Client Type Heading */}
                <Box>
                  <h3>Client Type</h3>
                </Box>
                {/* Account Type Radio Buttons */}
                <FormControl>
                  <RadioGroup row aria-labelledby="account-type-radio-buttons-group-label" name="account-type-radio-buttons-group" value={accountType} onChange={handleAccountTypeChange}>
                    <FormControlLabel value="Individual" control={<Radio />} label="Individual" />
                    <FormControlLabel value="Company" control={<Radio />} label="Company" />
                  </RadioGroup>
                </FormControl>

                {/* Account Info for Individual Type */}
                {/* {accountType === 'Individ/ual' && ( */}
                <Box>
                  <Box className="account-Type-options" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <h3>Account Info</h3>

                    {/* Help and More Options Icons */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <HelpOutlineRoundedIcon />
                      <MoreVertRoundedIcon />
                    </Box>
                  </Box>
                  <Box>
                    <InputLabel sx={{ color: "black" }}>Account Name</InputLabel>
                    <TextField size="small" fullWidth placeholder="Account Name" margin="normal" value={accountName} onChange={(e) => setaccountName(e.target.value)} />
                  </Box>
                  <Box>
                    <InputLabel sx={{ color: "black" }}>Company Name</InputLabel>
                    <TextField size="small" fullWidth placeholder="Company Name" margin="normal" value={companyname} onChange={(e) => setcompanyname(e.target.value)} />
                  </Box>
                  <Box>
                    <InputLabel sx={{ color: "black" }}>Tags</InputLabel>
                    <Autocomplete
                      multiple
                      size="small"
                      id="tags-outlined"
                      options={tagsoptions}
                      getOptionLabel={(option) => option.label}
                      value={tagsoptions.filter((option) => combinedTagsValues.includes(option.value))}
                      onChange={(event, newSelectedTags) => setCombinedTagsValues(newSelectedTags.map((tag) => tag.value))}
                      renderTags={(selected, getTagProps) => selected.map((option, index) => <Chip key={option.value} label={option.label} style={option.customTagStyle} {...getTagProps({ index })} />)}
                      renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Tags" sx={{ width: "100%", marginTop: "8px" }} />}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} style={option.customTagStyle}>
                          {option.label}
                        </Box>
                      )}
                    />
                  </Box>
                  <Box mt={2}>
                    <InputLabel sx={{ color: "black" }}>Team Member</InputLabel>
                    <Autocomplete
                      multiple
                      sx={{ mt: 2 }}
                      options={options}
                      size="small"
                      getOptionLabel={(option) => option.label}
                      value={options.filter((option) => selectedUser.some((selected) => selected.value === option.value))}
                      onChange={handleUserChange} // Updated to use `handleUserChange` function
                      renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Assignees" />}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                    />
                  </Box>
                  <Box>
                    <Typography>
                      <h3>Company address</h3>
                    </Typography>
                  </Box>
                  <Box>
                    <InputLabel sx={{ color: "black" }}>Country</InputLabel>
                    <Select
                      size="small"
                      value={selectedCountry.code}
                      onChange={handleCountryChange}
                      sx={{
                        width: "100%",
                        marginTop: "8px",
                      }}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country.code} value={country.code}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <Box>
                    <InputLabel sx={{ color: "black", mt: 2 }}>Street address</InputLabel>
                    <TextField
                      placeholder="Street address"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      // onChange={(e) => SetCStreetAddress(e.target.value)}
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
                      <TextField fullWidth margin="normal" name="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" size="small" />
                    </Box>
                    <Box>
                      <InputLabel sx={{ color: "black" }}>State/Province</InputLabel>
                      <TextField
                        margin="normal"
                        name="state"
                        fullWidth
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        // onChange={(e) => SetCStateProvince(e.target.value)}
                        placeholder="State/Province"
                        size="small"
                      />
                    </Box>
                    <Box>
                      <InputLabel sx={{ color: "black" }}>ZIP/Postal Code</InputLabel>

                      <TextField
                        margin="normal"
                        fullWidth
                        name="postalCode"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        // onChange={(e) => SetCZipPostalCode(e.target.value)}
                        placeholder="ZIP/Postal Code"
                        size="small"
                      />
                    </Box>
                  </Box>
                </Box>
                {/* // }? */}
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
        </Box>

        {selectedOption === "Contact Info" && (
          <>
            <Box className="create_new_contactform-container">
              <Box className="create_new_contactform-container">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 style={{ marginLeft: "20px" }}>Contacts</h3>
                  <Box onClick={handleClickOpen} sx={{ color: "#1976d3", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "5px" }}>
                    <AddCircleOutlineIcon />
                    <Typography>Link existing contact</Typography>
                  </Box>
                </Box>

                <Box>
                  {selectedAccount.contacts.map((contact) => (
                    <Box key={contact._id} sx={{ padding: 2 }}>
                      {/* Header Section - Always Visible */}
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs="auto">
                          <Button variant="text" sx={{ padding: 0, minWidth: "auto", marginRight: 1 }} onClick={() => handleExpandClick(contact._id)}>
                            <ExpandMoreIcon />
                          </Button>
                        </Grid>
                        <Grid item xs>
                          <Typography variant="h6" textAlign="left">
                            {contact.firstName} {contact.middleName} {contact.lastName}
                          </Typography>
                        </Grid>
                        <Grid item xs="auto">
                          <IconButton aria-label="more options" size="small" onClick={(e) => handleMenuClick(e, contact._id, contactName)}>
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
                        <MenuItem onClick={handleEditDescription}>Edit Existing Contact</MenuItem>
                        <MenuItem onClick={handleUnlink}>Unlink</MenuItem>
                      </Menu>

                      {/* Show Company Name, Email, and Toggles Always */}
                      <Box sx={{ marginY: 2, marginLeft: 4 }}>
                        {/* Company Name */}
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom textAlign="left">
                          Company Name
                        </Typography>
                        <Typography variant="body2" textAlign="left">
                          {contact.companyName}
                        </Typography>

                        {/* Email */}
                        <Typography variant="body2" color="textSecondary" textAlign="left" sx={{ marginTop: 1 }}>
                          {contact.email}
                        </Typography>

                        {/* Toggle Switches */}
                        <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                          <FormControlLabel control={<Switch checked={contact.login} readOnly />} label="Login" />
                          <FormControlLabel control={<Switch checked={contact.notify} disabled />} label="Notify" />
                          <FormControlLabel control={<Switch checked={contact.emailSync} readOnly />} label="Email Sync" />
                        </Box>
                      </Box>

                      {/* Conditionally Render Details on Expand */}
                      {expandedContact === contact._id && (
                        <Box sx={{ marginY: 2, marginLeft: 4 }}>
                          {/* Additional Details */}
                          {/* Note Section */}
                          <Box sx={{ marginTop: 2 }}>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom textAlign="left">
                              Note
                            </Typography>
                            <Typography variant="body2" textAlign="left">
                              {contact.note}
                            </Typography>
                          </Box>

                          {/* SSN Section */}
                          <Box sx={{ marginTop: 2 }}>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom textAlign="left">
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
                              <Typography variant="subtitle2" color="textSecondary" gutterBottom textAlign="left">
                                Country
                              </Typography>
                              <Typography variant="body2" textAlign="left">
                                {contact.country.name}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="textSecondary" gutterBottom textAlign="left">
                                Street Address
                              </Typography>
                              <Typography variant="body2" textAlign="left">
                                {contact.streetAddress || "N/A"}
                              </Typography>
                            </Box>
                            <Grid container spacing={0}>
                              <Grid item xs={4}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom textAlign="left">
                                  City
                                </Typography>
                                <Typography variant="body2" textAlign="left">
                                  {contact.city || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom textAlign="left">
                                  State / Province
                                </Typography>
                                <Typography variant="body2" textAlign="left">
                                  {contact.state || "N/A"}
                                </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom textAlign="left">
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
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom textAlign="left">
                                  Linked accounts
                                </Typography>
                                {contact.tags.map((tag, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      display: "inline-block",
                                      backgroundColor: tag.tagColour || "#f0f0f0",
                                      borderRadius: "20px",
                                      padding: "4px 12px",
                                      margin: "4px",
                                    }}
                                  >
                                    <Typography variant="body2" component="span" textAlign="left">
                                      {selectedAccount.accountName}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>

                <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} sx={{ width: 600 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", ml: 1 }}>
                    <Typography sx={{ fontWeight: "bold" }} variant="h6">
                      Edit Contact
                    </Typography>
                    <IconButton onClick={() => setIsDrawerOpen(false)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <Divider />
                  {selectedContact && (
                    <ContactUpdateForm
                      selectedContact={selectedContact}
                      uniqueTags={uniqueTags}
                      // Pass additional props needed by ContactForm
                      handleTagChange={() => {}}
                      handlePhoneNumberChange={() => {}}
                      handleDeletePhoneNumber={() => {}}
                      handleAddPhoneNumber={() => {}}
                      handleCountryChange={() => {}}
                      sendingData={() => {}}
                      handleClose={() => setIsDrawerOpen(false)}
                      isSmallScreen={isMobile}
                      onContactUpdated={handleContactUpdated}
                    />
                  )}
                </Drawer>

                {/* MUI Dialog */}
                <Dialog open={open} onClose={onClose}>
                  <DialogTitle>Search for a Contact</DialogTitle>
                  <Divider />
                  <DialogContent>
                    <DialogContentText>Search for an existing contact by entering their name, phone number, or email. If the contact is not in your CRM, click "Cancel" and create one on the previous page.</DialogContentText>

                    <Box mt={5}>
                      <InputLabel sx={{ color: "black" }}>Serch for contact</InputLabel>
                      <TextField
                        margin="normal"
                        fullWidth
                        name="postalCode"
                        // onChange={(e) => SetCZipPostalCode(e.target.value)}
                        placeholder="start typng the contact name,phone number or email to serch"
                        size="small"
                      />
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button variant="contained">Add</Button>
                    <Button onClick={onClose} color="primary">
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>

              {contacts.map((contact, index) => (
                <Box style={{ border: "1px solid #e2e8f0", margin: "15px", borderRadius: "8px", height: "55vh", overflowY: "auto", padding: "15px" }} className="create_new_contactform">
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
                          <InputLabel sx={{ color: "black" }}>First Name</InputLabel>
                          <TextField margin="normal" fullWidth name="firstName" placeholder="First Name" size="small" onChange={(e) => handleContactInputChange(index, e)} />
                        </Box>
                        <Box>
                          <InputLabel sx={{ color: "black" }}>Middle Name</InputLabel>
                          <TextField margin="normal" fullWidth name="middleName" placeholder="Middle Name" size="small" onChange={(e) => handleContactInputChange(index, e)} />
                        </Box>
                        <Box>
                          <InputLabel sx={{ color: "black" }}>Last Name</InputLabel>
                          <TextField fullWidth name="lastName" margin="normal" placeholder="Last name" size="small" onChange={(e) => handleContactInputChange(index, e)} />
                        </Box>
                      </Box>
                      <Box>
                        <InputLabel sx={{ color: "black" }}>Contact Name</InputLabel>
                        <TextField name="contactName" fullWidth placeholder="Contact Name" margin="normal" size="small" value={contact.contactName} onChange={(e) => handleContactInputChange(index, e)} />
                      </Box>
                      <Box>
                        <InputLabel sx={{ color: "black" }}>Company Name</InputLabel>
                        <TextField fullWidth name="companyName" margin="normal" placeholder="Company Name" size="small" onChange={(e) => handleContactInputChange(index, e)} />
                      </Box>
                      <Box>
                        <InputLabel sx={{ color: "black" }}>Note</InputLabel>
                        <TextField fullWidth multiline name="note" margin="normal" placeholder="Note" size="small" onChange={(e) => handleContactInputChange(index, e)} />
                      </Box>
                      <Box>
                        <InputLabel sx={{ color: "black" }}>SSN</InputLabel>
                        <TextField fullWidth name="ssn" margin="normal" placeholder="SSN" size="small" onChange={(e) => handleContactInputChange(index, e)} />
                      </Box>
                      <Box>
                        <InputLabel sx={{ color: "black" }}>Email</InputLabel>
                        <TextField fullWidth name="email" margin="normal" placeholder="Email" size="small" onChange={(e) => handleContactInputChange(index, e)} />
                      </Box>
                      {/* Switches for Login, Notify, and Email Sync */}
                      <Box sx={{ mt: 1 }}>
                        <FormControlLabel control={<Switch checked={contact.login === "true"} onChange={(e) => handleContactSwitchChange(index, "login", e.target.checked)} color="primary" />} label="Login" />
                        <FormControlLabel control={<Switch checked={contact.notify === "true"} onChange={(e) => handleContactSwitchChange(index, "notify", e.target.checked)} color="primary" />} label="Notify" />
                        <FormControlLabel control={<Switch checked={contact.emailSync === "true"} onChange={(e) => handleContactSwitchChange(index, "emailSync", e.target.checked)} color="primary" />} label="Email Sync" />
                      </Box>

                      <Box key={contact.id}>
                        <InputLabel sx={{ color: "black" }}>Tags</InputLabel>

                        <Autocomplete
                          multiple
                          options={tagsoptions}
                          getOptionLabel={(option) => option.label}
                          value={tagsoptions.filter((option) => (contact.tags || []).includes(option.value))}
                          // value={contact.selectedTags || []} // Ensure it's an array
                          onChange={(event, newValue) => handleContactTagChange(index, event, newValue)}
                          renderTags={(tagValue, getTagProps) => tagValue.map((option, index) => <Chip key={option.value} label={option.label} style={option.customTagStyle} {...getTagProps({ index })} />)}
                          renderInput={(params) => <TextField {...params} variant="outlined" size="small" placeholder="Select tags" sx={{ width: "100%", marginTop: "8px" }} />}
                          renderOption={(props, option) => (
                            <Box component="li" {...props} style={option.customStyle}>
                              {option.label}
                            </Box>
                          )}
                        />
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ ml: 1, fontWeight: "bold", mt: 3 }}>
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
                          {phone.isPrimary && <Chip label="Primary phone" color="primary" size="small" sx={{ position: "absolute", mt: -3 }} />}
                          <PhoneInput
                            country={"us"}
                            value={phone.phone}
                            onChange={(phoneValue) => handleContactPhoneNumberChange(index, phoneIndex, phoneValue)}
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
                          <AiOutlineDelete onClick={() => handleDeletePhoneNumber(phoneIndex)} style={{ cursor: "pointer", color: "red" }} />
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

                      <Typography variant="h6" gutterBottom sx={{ ml: 1, fontWeight: "bold", mt: 3 }}>
                        Address
                      </Typography>

                      <Box key={contact.id}>
                        {/* Country Selection */}
                        <Box>
                          <InputLabel sx={{ color: "black" }}>Country</InputLabel>

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
                                <Typography sx={{ fontWeight: 500 }}>{option.name}</Typography>
                                <Typography sx={{ fontSize: "0.9rem", color: "gray" }}>{option.code}</Typography>
                              </ListItem>
                            )}
                            renderInput={(params) => <TextField {...params} placeholder="Country" variant="outlined" sx={{ marginTop: "8px", width: "100%" }} />}
                          />
                        </Box>
                      </Box>
                      <Box>
                        <InputLabel sx={{ color: "black", mt: 2 }}>Street address</InputLabel>
                        <TextField fullWidth name="streetAddress" margin="normal" placeholder="Street address" size="small" onChange={(e) => handleContactAddressChange(index, "streetAddress", e.target.value)} />
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
                          <TextField fullWidth margin="normal" name="city" placeholder="City" size="small" onChange={(e) => handleContactAddressChange(index, "city", e.target.value)} />
                        </Box>
                        <Box>
                          <InputLabel sx={{ color: "black" }}>State/Province</InputLabel>
                          <TextField margin="normal" name="state" fullWidth placeholder="State/Province" size="small" onChange={(e) => handleContactAddressChange(index, "state", e.target.value)} />
                        </Box>
                        <Box>
                          <InputLabel sx={{ color: "black" }}>ZIP/Postal Code</InputLabel>
                          <TextField margin="normal" fullWidth name="postalCode" placeholder="ZIP/Postal Code" size="small" onChange={(e) => handleContactAddressChange(index, "postalCode", e.target.value)} />
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
                  onClick={handlesubmitContact}
                >
                  Create
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  onClick={onClose}
                  sx={{
                    mt: 2,

                    borderRadius: "10px",
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Accountupdate;
