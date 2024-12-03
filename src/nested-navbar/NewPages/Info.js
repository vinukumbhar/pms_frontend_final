import { Box, ListItem, Chip, Autocomplete, Dialog, DialogActions, DialogContent, RadioGroup, Radio, DialogContentText, DialogTitle, FormControlLabel, FormControl, InputLabel, Grid, Card, CardContent, Typography, Divider, Button, IconButton, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BiArchiveOut } from "react-icons/bi";
import { LuUserCircle2 } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { useParams } from "react-router-dom";
import { Drawer, useMediaQuery, Menu, MenuItem, TextField, Select, Checkbox, ListItemText } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContactUpdateForm from "./contactupdate";
import axios from "axios";
import { useTheme } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Accountupdate from "./accountupdate";
import ChevronDownIcon from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";
const Info = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 1000px)");
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  const { data } = useParams();
  const [accountData, setaccountData] = useState();
  const [accName, setAccName] = useState();
  const [usertype, setUserType] = useState();
  const [tags, setTags] = useState([]);
  const [teams, setTeams] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [accountDatabyid, setAccountDatabyid] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const handleMenuOpen = () => {
    setOpen(true);
  };
  useEffect(() => {
    // fetchAccountData();
    fetchContacts();
    fetchAccount();
  }, []);

  const fetchAccount = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyid/`;
    fetch(url + data, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setaccountData(result.accountlist);
        setAccName(result.accountlist.Name);
        setUserType(result.accountlist.Type);
        setTags(result.accountlist.Tags.flat());
        setTeams(result.accountlist.Team);

        // setDescription()
        if (result && result.accountlist) {
          setContacts(result.accountlist.Contacts);
          setDescription(result.accountlist.Contacts.description);
        }
        fetchaccountdatabyid(result.accountlist.id);
      })
      .catch((error) => console.error(error));
  };

  console.log(contacts);
  console.log(accountDatabyid);

  const fetchaccountdatabyid = (accountid) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${ACCOUNT_API}/accounts/accountdetails/getAccountbyIdAll/${accountid}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setAccountDatabyid(result.account);
      })
      .catch((error) => console.error(error));
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const handleClick = async (_id) => {
    try {
      const url = `${CONTACT_API}/contacts/${_id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data);
      setSelectedContact(data.contact);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [contactData, setContactData] = useState([]);
  const [uniqueTags, setUniqueTags] = useState([]);

  const handleContactUpdated = () => {
    fetchContacts(); // Refetch contacts when updated
  };
  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${CONTACT_API}/contacts/contactlist/list/`);
      setContactData(response.data.contactlist);
      console.log(response.data.contactlist);
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  console.log(contactData);

  const contactOptions = contactData.map((contact) => ({
    value: contact._id,
    label: contact.name,
  }));

  const [anchorEl, setAnchorEl] = useState(null);
  const [contactName, setContactName] = useState(null);
  const [contactdescription, setContactDescription] = useState(null);
  // Derived state for menu open/close
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event, id, contactName) => {
    setAnchorEl(event.currentTarget);
    setSelectedContact(id); // Set the selected contact ID here
    setContactName(contactName);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContact(null); // Reset selected contact when menu closes
  };

  const handleEditDescription = () => {
    console.log("Editing description for contact ID:", selectedContact);
    setDescriptionModalOpen(true); // Open the description modal
    fetchAccount();
  };

  const handleDescriptionSave = () => {
    console.log("Description saved for contact ID:", selectedContact, "Description:", description);
    setContactDescription(description);
    updateDescriptiontoAccount(description);
    updateDescriptiontoContact(selectedContact, description);
    // Add logic to save the description for the selected contact
    setDescriptionModalOpen(false);
    fetchAccount();
    // setDescription(""); // Clear the description
  };

  const updateDescriptiontoAccount = (description) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      description: description,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${ACCOUNT_API}/accounts/accountdetails/${data}`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  const updateDescriptiontoContact = (selectedContact, description) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      description: description,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${CONTACT_API}/contacts/${selectedContact}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success("Contact decription Updated successfully!");
        fetchAccount();
        handleMenuClose();
      })
      .catch((error) => console.error(error));
  };

  const handleDescriptionCancel = () => {
    setDescriptionModalOpen(false);
    handleMenuClose();
    setDescription(""); // Clear the description if cancelled
  };

  const removecontactidfromaccount = (contactId) => {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };
    fetch(`${ACCOUNT_API}/accounts/accountdetails/removecontactfromaccount/${data}/${contactId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        handleContactUpdated();
        toast.success("contact is unlinked");
        fetchAccount();
      })
      .catch((error) => console.error(error));
  };
  const handleUnlink = () => {
    removecontactidfromaccount(selectedContact);
    handleMenuClose();
  };

  //edit right side form
  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  //********************Add Contacts */
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isDrawerOpenForAddContact, setIsDrawerOpenForAddContact] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState(contacts);

  // Effect to filter contacts based on search term
  const getSelectedIds = () => {
    return selectedContacts.join(", "); // Just join the IDs array into a string
  };

  useEffect(() => {
    setFilteredContacts(contactData.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [searchQuery, contactData]);

  const handleAddContactDrawer = () => {
    setIsDrawerOpenForAddContact(true);
  };

  const handleCloseDrawerofAddContact = () => {
    setIsDrawerOpenForAddContact(false);
  };

  const handleLinkAccounts = () => {
    updateContactstoAccount(selectedContacts);
  };
  console.log(selectedContacts);

  const updateContactstoAccount = (selectedContacts) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const existingContactIds = accountDatabyid.contacts.map((contact) => contact._id);
    // Combine existing contact IDs with the new ones
    const combinedContacts = [...existingContactIds, ...selectedContacts];
    console.log(combinedContacts);
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
    fetch(`${ACCOUNT_API}/accounts/accountdetails/${accountDatabyid._id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        handleCloseDrawerofAddContact();
        toast.success("contact added successfully");
        fetchAccount();
      })
      .catch((error) => console.error(error));
  };

  return (
    <Box sx={{ width: "100%", padding: 2, mt: 4 }}>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, mr: 5 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="h5" fontWeight="bold">
                  Account Details
                </Typography>
                <Box>
                  <IconButton>
                    <BiArchiveOut />
                  </IconButton>
                  <IconButton onClick={() => setIsNewDrawerOpen(true)}>
                    <MdEdit />_ Edit
                  </IconButton>
                </Box>
                <Drawer
                  anchor="right"
                  open={isNewDrawerOpen}
                  onClose={() => setIsNewDrawerOpen(false)}
                  PaperProps={{
                    sx: {
                      borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
                      width: isSmallScreen ? "100%" : "650px",
                    },
                  }}
                >
                  <Accountupdate selectedAccount={accountDatabyid} onClose={() => setIsNewDrawerOpen(false)} />
                </Drawer>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Divider />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <LuUserCircle2 style={{ width: "80px", height: "80px" }} />
                  <Box>
                    <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>{accName}</Typography>
                    <Typography sx={{ fontSize: "15px" }}>{usertype}</Typography>
                  </Box>
                  <Button variant="outlined">Log in as account (read-only)</Button>
                </Box>
              </Box>
              <Box mt={3}>
                <Typography fontWeight="bold">Account Info</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: "20px", mt: 2 }}>
                  <Typography>Tags</Typography>
                  <Typography>
                    <Box sx={{ display: "flex", gap: "10px" }}>
                      {tags.map((tag) => (
                        <Typography
                          key={tag._id}
                          sx={{
                            backgroundColor: tag.tagColour,
                            color: "white",
                            borderRadius: "60px",
                            padding: "0.2rem 0.5rem",
                            display: "flex",
                            alignItems: "center",
                            fontWeight: "bold",
                            fontSize: "12px",
                          }}
                        >
                          {tag.tagName}
                        </Typography>
                      ))}
                    </Box>
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "20px", mt: 2 }}>
                  <Typography>Team Members</Typography>
                  <Typography sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {" "}
                    {teams &&
                      teams.map((team, index) => (
                        <h5
                          key={index}
                          style={{
                            backgroundColor: "lightgrey",
                            color: "black",
                            borderRadius: "60px",
                            display: "flex",
                            padding: "0.2rem 0.5rem",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: "5px",
                            fontSize: "12px",
                          }}
                        >
                          {team.username}
                        </h5>
                      ))}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="h5" fontWeight="bold">
                  Contacts
                </Typography>

                {/* Button aligned to the right side */}
                <Button
                  color="primary"
                  sx={{ ml: "auto" }}
                  onClick={handleAddContactDrawer} // Handle add contact logic
                >
                  Add Contact
                </Button>
              </Box>

              <Drawer
                anchor="right"
                open={isDrawerOpenForAddContact}
                onClose={handleCloseDrawerofAddContact}
                PaperProps={{
                  sx: { width: 700 },
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Link Contacts
                  </Typography>
                  <IconButton onClick={handleCloseDrawerofAddContact} sx={{ color: "#1876d3" }}>
                    <CloseIcon />
                  </IconButton>
                </Box>

                {/* Content Section */}
                <Box
                  sx={{
                    p: 2,
                    flex: "1 1 auto",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Autocomplete
                    multiple // Enable multiple selections
                    options={filteredContacts}
                    getOptionLabel={(option) => option.name} // Specify how to display the option
                    // onInputChange={(event, newValue) => {
                    //   setSearchQuery(newValue);
                    // }}
                    onChange={(event, newValue) => {
                      // Update selected contacts with only IDs
                      const ids = newValue.map((contact) => contact.id); // Extract IDs from selected contacts
                      setSelectedContacts(ids); // Update selectedContacts with IDs
                      console.log(getSelectedIds()); // Log the comma-separated IDs
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Search contacts..."
                        onFocus={(e) => e.stopPropagation()} // Prevent dropdown from closing
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.name}
                      </li>
                    )}
                    fullWidth
                    disableClearable // Prevents clearing the input by clicking the clear button
                    value={filteredContacts.filter((contact) => selectedContacts.includes(contact.id))} // Control the selected value
                  />
                  {/* <Autocomplete
                    multiple
                    sx={{ background: "#fff", mt: 1 }}
                    options={contactOptions}
                    size="small"
                    getOptionLabel={(option) => option.label}
                    value={selectedContacts}
                    // onChange={handleUserChange}
                    onChange={(event, newValue) => {
                      // Update selected contacts with only IDs
                      const ids = contactOptions.map((contact) => contact.id); // Extract IDs from selected contacts
                      setSelectedContacts(ids); // Update selectedContacts with IDs
                      console.log(getSelectedIds()); // Log the comma-separated IDs
                    }}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                      >
                        {option.label}
                      </Box>
                    )}
                    renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Assignees" />}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                  /> */}
                </Box>

                {/* Footer */}
                <Box
                  sx={{
                    borderTop: "1px solid #e0e0e0",
                    p: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                  }}
                >
                  <Button variant="contained" color="primary" onClick={handleLinkAccounts}>
                    Link
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={handleCloseDrawerofAddContact}>
                    Cancel
                  </Button>
                </Box>
              </Drawer>

              <Box sx={{ mt: 1 }}>
                <Divider />
              </Box>

              <Box mt={2}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Login</TableCell>
                        <TableCell>Notify</TableCell>
                        <TableCell>Email Sync</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {contacts.map((contact) => {
                        const { _id, contactName, email, login, notify, emailSync, description } = contact;
                        return (
                          <React.Fragment key={_id}>
                            <TableRow>
                              <TableCell colSpan={5}>
                                <Box>
                                  {/* Contact Name and More Options Button */}
                                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography sx={{ fontWeight: "bold", fontSize: "15px", display: "inline-block", color: "#1976d2" }} onClick={() => handleClick(_id)}>
                                      {contactName}
                                    </Typography>
                                    <IconButton aria-label="more options" size="small" onClick={(e) => handleMenuClick(e, _id, contactName)}>
                                      <MoreVertIcon />
                                    </IconButton>
                                  </Box>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#757575", marginTop: "4px" }} // Description styling
                                  >
                                    {/* Display contactdescription if available, else fall back to description */}
                                    {description}
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>

                            {/* Row for email and switches */}
                            <TableRow>
                              <TableCell>{email}</TableCell>
                              <TableCell>
                                <Switch checked={login} disabled />
                              </TableCell>
                              <TableCell>
                                <Switch checked={notify} disabled />
                              </TableCell>
                              <TableCell>
                                <Switch checked={emailSync} disabled />
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        );
                      })}
                    </TableBody>

                    {/* Dropdown Menu */}
                    <Menu
                      anchorEl={anchorEl}
                      open={menuOpen} // Use derived state here
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleEditDescription}>Edit Description</MenuItem>
                      <MenuItem onClick={handleUnlink}>Unlink</MenuItem>
                    </Menu>

                    {/* Description Modal */}
                    <Dialog
                      open={descriptionModalOpen}
                      onClose={handleDescriptionCancel}
                      aria-labelledby="form-dialog-title"
                      PaperProps={{
                        style: { width: "800px" }, // Adjust the width as needed
                      }}
                    >
                      <DialogTitle id="form-dialog-title">
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="h6">{`Description for: ${contactName}`}</Typography>
                          <Button onClick={handleDescriptionCancel} color="secondary">
                            X
                          </Button>
                        </Box>
                      </DialogTitle>
                      <DialogContent>
                        <Typography variant="h5" fontWeight="bold">
                          Description
                        </Typography>
                        <TextField autoFocus margin="dense" type="text" fullWidth variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" data-test="contact-notes-input" />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleDescriptionSave} color="primary">
                          Save
                        </Button>
                        <Button onClick={handleDescriptionCancel} color="primary">
                          Cancel
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Table>
                </TableContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
    </Box>
  );
};

export default Info;
