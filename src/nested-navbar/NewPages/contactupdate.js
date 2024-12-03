import React, { useState, useEffect } from "react";
import { Chip, Box, Button, InputLabel, MenuItem, Select, TextField, Typography, Autocomplete, Grid, IconButton } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Drawer, Checkbox } from "@mui/material";

const ContactUpdateForm = ({ onContactUpdated, selectedContact, handleClose, isSmallScreen }) => {
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  // State variables for form fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactName, setContactName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [note, setNote] = useState("");
  const [ssn, setSsn] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  // const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState({ name: "", code: "" });
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");

  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [tagsNew, setTagsNew] = useState([]);
  const [tags, setTags] = useState([]);
  const [contactId, setContactId] = useState(null); // Added state for contact ID
  const [combinedTagsValues, setCombinedTagsValues] = useState([]);

  console.log(selectedContact);
  useEffect(() => {
    if (selectedContact) {
      setFirstName(selectedContact.firstName || "");
      setMiddleName(selectedContact.middleName || "");
      setLastName(selectedContact.lastName || "");
      setContactName(selectedContact.contactName || "");
      setCompanyName(selectedContact.companyName || "");
      setNote(selectedContact.note || "");
      setSsn(selectedContact.ssn || "");
      setEmail(selectedContact.email || "");
      // setSelectedCountry(selectedContact.country || '');
      setSelectedCountry({
        name: selectedContact.country?.name || "", // Use name field or an empty string
        code: selectedContact.country?.code || "", // Use code field or an empty string
      });
      setStreetAddress(selectedContact.streetAddress || "");
      setCity(selectedContact.city || "");
      setState(selectedContact.state || "");
      setPostalCode(selectedContact.postalCode || "");
      setContactId(selectedContact._id || null); // Set contact ID
      // const flatPhoneNumbers = selectedContact.phoneNumbers?.[0] || [];
      // setPhoneNumbers(flatPhoneNumbers.map(phone => ({ id: Date.now(), phone, isPrimary: false })));
      // const flatPhoneNumbers = (selectedContact.phoneNumbers && selectedContact.phoneNumbers[0]) || [];
      // setPhoneNumbers(
      //   flatPhoneNumbers.map((phone) => ({
      //     id: Date.now(), // Using Date.now() is not ideal for IDs; consider a better unique ID generator
      //     phone: phone.phone,
      //     isPrimary: false, // Set according to your data logic
      //   }))
      // );
      // Flatten phoneNumbers array
      // const flatPhoneNumbers = selectedContact.phoneNumbers?.flat() || [];
      // setPhoneNumbers(
      //   flatPhoneNumbers.map((phone) => ({
      //     id: Date.now() + Math.random(), // Improved unique ID generation
      //     phone,
      //     isPrimary: false, // Set based on your logic
      //   }))
      // );

      // const flatPhoneNumbers = selectedContact.phoneNumbers?.flat() || [];
      // setPhoneNumbers(
      //   flatPhoneNumbers.map((phone) => ({
      //     id: Date.now() + Math.random(), // Improved unique ID generation
      //     phone: String(phone), // Ensure phone is a string
      //     isPrimary: false, // Set based on your logic
      //   }))
      // );
      const flatPhoneNumbers = selectedContact.phoneNumbers?.flat(2) || []; // Flatten to ensure no nested arrays
      setPhoneNumbers(
        flatPhoneNumbers.map((phoneObj) => ({
          id: Date.now() + Math.random(), // Improved unique ID generation
          phone: String(phoneObj.phone), // Access the phone property correctly
          isPrimary: false, // Set based on your logic
        }))
      );

      const flatTags = selectedContact.tags?.[0] || [];
      setTagsNew(
        flatTags.map((tag) => ({
          value: tag._id,
          label: tag.tagName,
          colour: tag.tagColour,
          customTagStyle: {
            backgroundColor: tag.tagColour,
            color: "#fff",
            alignItems: "center",
            textAlign: "center",
            padding: "2px,8px",
            fontSize: "15px",
            cursor: "pointer",
          },
        }))
      );
      getaccountbycontactid(selectedContact._id);
      // Set combinedTagsValues to match the tags in the contact
      setCombinedTagsValues(flatTags.map((tag) => tag._id));
      console.log("Tags:", selectedContact.tags);
    }
  }, [selectedContact]);

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

  const handleCountryChange = (event) => {
    const selectedCode = event.target.value;
    const selectedCountryObj = countries.find((country) => country.code === selectedCode);

    // Set the selected country as an object with name and code
    setSelectedCountry({
      name: selectedCountryObj.name,
      code: selectedCode,
    });
  };

  const handlePhoneNumberChange = (id, phone) => {
    setPhoneNumbers((prevPhoneNumbers) => prevPhoneNumbers.map((item) => (item.id === id ? { ...item, phone } : item)));
  };

  const handleAddPhoneNumber = () => {
    setPhoneNumbers((prevPhoneNumbers) => [...prevPhoneNumbers, { id: Date.now(), phone: "", isPrimary: false }]);
  };

  const handleDeletePhoneNumber = (id) => {
    setPhoneNumbers((prevPhoneNumbers) => prevPhoneNumbers.filter((item) => item.id !== id));
  };

  const handleTagChange = (event, newValue) => {
    setTagsNew(newValue);
    const selectedTagsValues = newValue.map((option) => option.value);
    setCombinedTagsValues(selectedTagsValues);
  };

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

  const [accountDataAll, setAccountDataAll] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${ACCOUNT_API}/accounts/account/accountdetailslist`,
          headers: {},
        };

        const response = await axios.request(config);
        setAccountDataAll(response.data.accountlist);
        console.log(response.data.accountlist);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchData();
  }, []);
  console.log(accountDataAll);

  const calculateWidth = (tagName) => {
    const baseWidth = 10;
    const charWidth = 8;
    const padding = 10;
    return baseWidth + charWidth * tagName.length + padding;
  };

  const options = tags.map((tag) => ({
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
      fontSize: "15px",
      cursor: "pointer",
    },
  }));

  const handleSave = async () => {
    const updatedContact = {
      firstName,
      middleName,
      lastName,
      contactName,
      companyName,
      note,
      ssn,
      email,
      // phoneNumbers,
      phoneNumbers: phoneNumbers.map((phone) => phone.phone),
      country: selectedCountry,
      streetAddress,
      city,
      state,
      postalCode,
      tags: combinedTagsValues,
    };
    console.log(updatedContact);
    try {
      const response = await fetch(`${CONTACT_API}/contacts/${contactId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContact),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Contact updated:", result);
        toast.success("Contact updated successfully!");
        if (onContactUpdated) {
          onContactUpdated(); // Call the callback function
        }
        handleClose(); // Close the form on success
      } else {
        console.error("Failed to update contact:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Failed to update contact");
    }
  };

  const [accountdata, SetAccountData] = useState([]);
  const getaccountbycontactid = (contactId) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(`${ACCOUNT_API}/accounts/accountdetails/accountbycontactid/${contactId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        SetAccountData(result.accounts);
      })
      .catch((error) => console.error(error));
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  // const handleDrawerOpen = () => {
  //     setDrawerOpen(true);
  // };
  const handleDrawerOpen = () => {
    // Initialize checkedAccounts when the drawer opens
    const initialCheckedAccounts = accountDataAll.filter((account) => Array.isArray(account.Contacts) && account.Contacts.some((contact) => contact._id === contactId)).map((account) => account.id);
    setCheckedAccounts(initialCheckedAccounts);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const [checkedAccounts, setCheckedAccounts] = useState([]);

  // Function to handle checkbox change
  // const handleCheckboxChange = (accountId) => {
  //     setCheckedAccounts((prev) => {
  //         if (prev.includes(accountId)) {
  //             // If the accountId is already checked, remove it
  //             return prev.filter((id) => id !== accountId);
  //         } else {
  //             // Otherwise, add it to the checked list
  //             return [...prev, accountId];
  //         }
  //     });
  // };
  const handleCheckboxChange = (accountId) => {
    setCheckedAccounts((prev) => {
      if (prev.includes(accountId)) {
        // If already checked, remove from checkedAccounts
        return prev.filter((id) => id !== accountId);
      } else {
        // Otherwise, add to checkedAccounts
        return [...prev, accountId];
      }
    });
  };

  // console.log(checkedAccounts);

  const updatecontactidtoAccounts = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountIds: checkedAccounts,
      contactId: contactId,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${ACCOUNT_API}/accounts/accountdetails/updatecontacts/byaccountIds`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  // const [accountdata, setAccountData] = useState(initialAccountData);

  const handleRemoveAccount = (accountId) => {
    removecontactidfromaccount(accountId);
    const updatedAccountData = accountdata.filter((account) => account._id !== accountId);
    SetAccountData(updatedAccountData); // Update the state to remove the clicked account
  };

  const removecontactidfromaccount = (accountId) => {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };
    fetch(`${ACCOUNT_API}/accounts/accountdetails/removecontactfromaccount/${accountId}/${contactId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form style={{ paddingRight: "3%", paddingLeft: "3%", height: "90vh", overflowY: "auto" }} className="contact-form">
      <Typography variant="h6" gutterBottom sx={{ ml: 1, fontWeight: "bold", mt: 2 }}>
        Contact info
      </Typography>
      <Box sx={{ display: "flex", flexDirection: isSmallScreen ? "column" : "row", gap: isSmallScreen ? 2 : 5, padding: "1px 5px 0 5px" }}>
        <Box>
          <InputLabel sx={{ color: "black" }}>First name</InputLabel>
          <TextField margin="normal" fullWidth name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" size="small" />
        </Box>
        <Box>
          <InputLabel sx={{ color: "black" }}>Middle Name</InputLabel>
          <TextField margin="normal" fullWidth name="middleName" value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Middle Name" size="small" />
        </Box>
        <Box>
          <InputLabel sx={{ color: "black" }}>Last Name</InputLabel>
          <TextField fullWidth name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} margin="normal" placeholder="Last name" size="small" />
        </Box>
      </Box>
      <Box>
        <InputLabel sx={{ color: "black" }}>Contact Name</InputLabel>
        <TextField name="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} fullWidth placeholder="Contact Name" margin="normal" size="small" />
      </Box>
      <Box>
        <InputLabel sx={{ color: "black" }}>Company Name</InputLabel>
        <TextField fullWidth name="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} margin="normal" placeholder="Company Name" size="small" />
      </Box>
      <Box>
        <InputLabel sx={{ color: "black" }}>Note</InputLabel>
        <TextField fullWidth name="note" value={note} onChange={(e) => setNote(e.target.value)} margin="normal" placeholder="Note" size="small" />
      </Box>
      <Box>
        <InputLabel sx={{ color: "black" }}>SSN</InputLabel>
        <TextField fullWidth name="ssn" value={ssn} onChange={(e) => setSsn(e.target.value)} margin="normal" placeholder="SSN" size="small" />
      </Box>
      <Box>
        <InputLabel sx={{ color: "black" }}>Email</InputLabel>
        <TextField fullWidth name="email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" placeholder="Email" size="small" />
      </Box>
      <Box>
        <InputLabel sx={{ color: "black" }}>Tags</InputLabel>
        <Autocomplete
          multiple
          size="small"
          id="tags-outlined"
          options={options}
          getOptionLabel={(option) => option.label}
          value={tagsNew}
          onChange={handleTagChange}
          renderTags={(selected, getTagProps) => selected.map((option, index) => <Chip key={option.value} label={option.label} style={option.customTagStyle} {...getTagProps({ index })} />)}
          renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Tags" sx={{ width: "100%", marginTop: "8px" }} />}
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
      {phoneNumbers.map((phone) => (
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
            onChange={(phoneValue) => handlePhoneNumberChange(phone.id, phoneValue)}
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
          <AiOutlineDelete onClick={() => handleDeletePhoneNumber(phone.id)} style={{ cursor: "pointer", color: "red" }} />
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
        onClick={handleAddPhoneNumber}
      >
        <AiOutlinePlusCircle style={{ marginTop: "20px" }} />
        <p>Add phone number</p>
      </Box>
      <Typography variant="h6" gutterBottom sx={{ ml: 1, fontWeight: "bold", mt: 3 }}>
        Address
      </Typography>
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
        <InputLabel sx={{ color: "black" }}>Street Address</InputLabel>
        <TextField fullWidth name="streetAddress" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} margin="normal" placeholder="Street Address" size="small" />
      </Box>
      <Box sx={{ display: "flex", flexDirection: isSmallScreen ? "column" : "row", gap: isSmallScreen ? 2 : 5, padding: "1px 5px 0 5px" }}>
        <Box>
          <InputLabel sx={{ color: "black" }}>City</InputLabel>
          <TextField fullWidth name="city" value={city} onChange={(e) => setCity(e.target.value)} margin="normal" placeholder="City" size="small" />
        </Box>
        <Box>
          <InputLabel sx={{ color: "black" }}>State</InputLabel>
          <TextField fullWidth name="state" value={state} onChange={(e) => setState(e.target.value)} margin="normal" placeholder="State" size="small" />
        </Box>
        <Box>
          <InputLabel sx={{ color: "black" }}>Postal Code</InputLabel>
          <TextField fullWidth name="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} margin="normal" placeholder="Postal Code" size="small" />
        </Box>
      </Box>

      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h7" fontWeight="bold">
            Linked accounts
          </Typography>
          <Button
            startIcon={<AddCircleIcon />}
            color="primary"
            onClick={handleDrawerOpen} // Opens the drawer
          >
            Link accounts
          </Button>
          {/* Drawer Component */}
          <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
            <Box width={700} p={2}>
              {/* Drawer Header */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Link accounts</Typography>
                <IconButton onClick={handleDrawerClose}>
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Search Input */}
              <Box mt={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search"
                  InputProps={{
                    startAdornment: (
                      <Button sx={{ padding: 0 }}>
                        <svg className="icon v2-icon v2-icon-search" />
                      </Button>
                    ),
                  }}
                />
              </Box>
              {/* Accounts List */}
              <Box mt={2}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox />
                        </TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        {/* <TableCell>Type</TableCell>
                                                <TableCell>Tags</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {accountDataAll.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={checkedAccounts.includes(account.id)} onChange={() => handleCheckboxChange(account.id)} />
                          </TableCell>
                          <TableCell>{account.id}</TableCell>
                          <TableCell>{account.Name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              {/* Drawer Footer */}
              <Box mt={4}>
                <Button variant="contained" color="primary" onClick={updatecontactidtoAccounts}>
                  Save
                </Button>
                <Button variant="outlined" onClick={handleDrawerClose}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </Drawer>
        </Box>
        <Box mt={3}>
          <TableContainer component={Paper}>
            <Table>
              {/* Table header */}
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6" fontWeight="bold">
                      Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" fontWeight="bold">
                      Description
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              {/* Table body */}
              <TableBody>
                {accountdata.map((account) => (
                  <TableRow key={account._id}>
                    {/* Account Name */}
                    <TableCell>
                      <Button href={`/app/clients/${account._id}`} target="_blank" rel="noopener" color="primary">
                        {account.accountName}
                      </Button>
                    </TableCell>
                    <TableCell>{account.description}</TableCell>
                    {/* Close button */}
                    <TableCell>
                      <IconButton color="secondary" onClick={() => handleRemoveAccount(account._id)}>
                        <CloseIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Box sx={{ mt: 2, mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleSave} // Attach the save handler
        >
          Save
        </Button>
        <Button variant="outlined" onClick={handleClose} sx={{ ml: 2 }}>
          Cancel
        </Button>
      </Box>
    </form>
  );
};

export default ContactUpdateForm;
