// import React, { useState, useEffect } from "react";
// import { Drawer, Box, TextField, CircularProgress, Typography, Button, Autocomplete } from "@mui/material";
// import axios from "axios";
// import ContactForm from "../Pages/UpdateContact"
// import { useNavigate } from "react-router-dom";
// const SearchComponent = () => {
//     const [searchQuery, setSearchQuery] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [accounts, setAccounts] = useState([]);
//     const [contacts, setContacts] = useState([]);
//     const [error, setError] = useState(null);
//     const [options, setOptions] = useState([]);
//     const [selectedType, setSelectedType] = useState("Account"); // "All", "Account", "Contact"
//     const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
//     const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
//     const [contactData, setContactData] = useState([]);
   
   
//     const fetchContacts = async () => {
//         try {
//             const response = await axios.get(`${CONTACT_API}/contacts/contactlist/list/`);
//             setContactData(response.data.contactlist);
//             // console.log(response.data.contactlist);
//         } catch (error) {
//             console.error("API Error:", error);
//             // toast.error('Failed to fetch contacts');
//         }
//     };
//     useEffect(() => {
//         fetchContacts();
//     }, []);
//     const handleContactUpdated = () => {
//         fetchContacts(); // Refetch contacts when updated
//     };
//     const handleSearch = async (query) => {
//         setSearchQuery(query);
    
//         // Retrieve role and stored data from localStorage
//         const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
//         const userRole = localStorage.getItem("userRole");
    
//         // Default permissions for TeamMember
//         const { viewallAccounts= false, viewAllContacts = false  } = storedData?.teammember || {}; 
    
//         // Admins can always search
//         const canSearchAccounts = userRole === "Admin" || viewallAccounts;
//         const canSearchContacts = userRole === "Admin" || viewAllContacts;
    
//         if (query.trim() === "" || (!canSearchAccounts && !canSearchContacts)) {
//             setAccounts([]);
//             setContacts([]);
//             setOptions([]);
//             return;
//         }
    
//         setLoading(true);
//         setError(null);
    
//         try {
//             const [accountsResponse, contactsResponse] = await Promise.all([
//                 canSearchAccounts
//                     ? axios.get(`${ACCOUNT_API}/accounts/nameandid/accountdetails`, { params: { search: query } })
//                     : Promise.resolve({ data: { accounts: [] } }),
//                 canSearchContacts
//                     ? axios.get(`${CONTACT_API}/contacts/nameandid`, { params: { search: query } })
//                     : Promise.resolve({ data: { contacts: [] } }),
//             ]);
    
//             const accountsData = accountsResponse.data.accounts || [];
//             const contactsData = contactsResponse.data.contacts || [];
    
//             setAccounts(accountsData);
//             setContacts(contactsData);
//      console.log(accountsData)
//             const combinedOptions = [
//                 ...accountsData.map((account) => ({ label: account.accountName, type: "Account", id: account._id })),
//                 ...contactsData.map((contact) => ({
//                     label: `${contact.contactName} (${contact.email || "No Email"})`,
//                     type: "Contact",
//                     id: contact._id,
//                 })),
//             ];
//             setOptions(combinedOptions);
//         } catch (err) {
//             setError("Failed to fetch results. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };
    
    
//     useEffect(() => {
//         if (searchQuery.trim() !== "") {
//             handleSearch(searchQuery);
//         }
//     }, [selectedType]);
//     const filteredOptions = selectedType === "All" ? options : options.filter((opt) => opt.type === selectedType);
//     const navigate = useNavigate();
//     // Handle option selection
//     const handleOptionSelect = (event, value) => {
//         if (value) {
//             console.log("Selected option:", value);
//             if (value.type === "Account") {
//                 // Clear the autocomplete input and options
//   setSearchQuery(""); // Clear search query
//   setOptions([]); // Clear options list
//                 // Navigate to the account overview page with the account ID
//                 navigate(`/clients/accounts/accountsdash/overview/${value.id}`);
  
//             } else if (value.type === "Contact") {
//                 // // Open the drawer and set the selected contact
//                 // setSelectedContact(value);
//                 // setIsDrawerOpen(true);
//                 handleClick(value.id);
//                 // Clear the autocomplete input and options
//   setSearchQuery(""); // Clear search query
//   setOptions([]); // Clear options list
//             }
//         }
//     };
//     const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for drawer visibility
//     const [selectedContact, setSelectedContact] = useState(null);
//     // Handle fetching contact data when a contact option is clicked
//     const handleClick = async (id) => {
//         try {
//             const url = `${CONTACT_API}/contacts/${id}`;
//             const response = await fetch(url);
//             if (!response.ok) {
//                 throw new Error("Failed to fetch data");
//             }
//             const data = await response.json();
//             setSelectedContact(data.contact);
//             // console.log(data.contact); // Debug: Log the contact data
//             selectedContacts();
//             setIsDrawerOpen(true); // Open the drawer after setting the contact data
//               // Clear the autocomplete input and options
//       setSearchQuery(""); // Clear search query
//       setOptions([]); // Clear options list
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };
//     // Effect for selected contact
//     useEffect(() => {
//         if (selectedContact) {
//             selectedContacts();
//         }
//     }, [selectedContact]);

//     const selectedContacts = () => {
//         if (selectedContact) {
//             console.log("Selected contact:", selectedContact);
//             // You can add more functionality for when the contact is selected, like updating the UI
//         }
//     };

//     // Close the drawer
//     const handleCloseDrawer = () => {
//         setIsDrawerOpen(false);
//         setSelectedContact(null); // Optionally clear selected contact when closing the drawer
//     };
//     return (
//         <Box sx={{ maxWidth: 600, borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: 'center',gap:2 }}>


//             <Box>
//                 <Autocomplete
//                     size="small"
//                     freeSolo
//                     options={filteredOptions}
//                     loading={loading}
//                     onInputChange={(event, newInputValue) => {
//                         setSearchQuery(newInputValue); // Update search query
//                         handleSearch(newInputValue); // Trigger search
//                     }}
//                     // onInputChange={(event, newInputValue) => handleSearch(newInputValue)}
//                     groupBy={(option) => option.type}
//                     getOptionLabel={(option) => option.label}
//                     renderInput={(params) => (
//                         <TextField
//                             {...params}
//                             placeholder="Search Accounts and Contacts"
//                             // variant="outlined"
//                             fullWidth
//                             // sx={{ marginBottom: 2 }}
//                             InputProps={{
//                                 ...params.InputProps,
//                                 endAdornment: (
//                                     <>
//                                         {loading ? <CircularProgress size={20} /> : null}
//                                         {params.InputProps.endAdornment}
//                                     </>
//                                 ),
//                             }}
//                         />
//                     )}
//                     renderOption={(props, option) => (
//                         <Box component="li" {...props} sx={{ display: "flex", justifyContent: "space-between", padding: "4px 8px",cursor:'pointer' , fontSize:'12px'}}>
//                             <span>{option.label}</span>

//                         </Box>
//                     )}
//                     onChange={handleOptionSelect}
//                 />
//             </Box>
//             <Box sx={{ display: "flex", justifyContent: "space-between",  alignItems: 'center',gap:2 }}>

//                 <Button
//                     variant={selectedType === "Account" ? "contained" : "outlined"}
//                     onClick={() => setSelectedType("Account")}
//                     size="small"
//                 >
//                     Accounts
//                 </Button>
//                 <Button
//                     variant={selectedType === "Contact" ? "contained" : "outlined"}
//                     onClick={() => setSelectedType("Contact")}
//                     size="small"
//                 >
//                     Contacts
//                 </Button>
//             </Box>
//             {error && <Typography color="error">{error}</Typography>}

//             {/* Drawer for displaying Contact details */}
//             <Drawer
//                 anchor="right"
//                 open={isDrawerOpen}
//                 onClose={handleCloseDrawer}
//                 sx={{
//                     width: 300,
//                     flexShrink: 0,
//                     "& .MuiDrawer-paper": {
//                         width: 300,
//                         padding: 2,
//                         display: "flex",
//                         flexDirection: "column",
//                     },
//                 }}
//             >
//                 {selectedContact && (
//                     <ContactForm
//                         selectedContact={selectedContact}
//                         // uniqueTags={uniqueTags}
//                         // Pass additional props needed by ContactForm
//                         handleTagChange={() => { }}
//                         handlePhoneNumberChange={() => { }}
//                         handleDeletePhoneNumber={() => { }}
//                         handleAddPhoneNumber={() => { }}
//                         handleCountryChange={() => { }}
//                         sendingData={() => { }}
//                         handleClose={() => setIsDrawerOpen(false)}
//                         // isSmallScreen={isMobile}
//                         onContactUpdated={handleContactUpdated}
//                     />
//                 )}
//             </Drawer>
//         </Box>
//     );
// };

// export default SearchComponent;



import React, { useState } from "react";
import {
  Box,
  TextField,
  CircularProgress,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([
    { label: "John Doe", subLabel: "john@example.com", type: "Accounts", id: 1 },
    { label: "Jane Smith", subLabel: "jane@example.com", type: "Contacts", id: 2 },
    { label: "Tax Document", subLabel: "2023 Tax Report", type: "Documents", id: 3 },
    { label: "Acme Corp", subLabel: "info@acme.com", type: "Accounts", id: 4 },
    { label: "Customer Support", subLabel: "support@example.com", type: "Contacts", id: 5 },
    { label: "Report", subLabel: "Annual Report 2023", type: "Documents", id: 6 },
  ]); // Replace with fetched data
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("All"); // "All", "Accounts", "Contacts", "Documents"

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    // Simulate data fetching and update the options state based on query
  };

  const filteredOptions =
    filterType === "All"
      ? options
      : options.filter((option) => option.type === filterType);

  return (
    <Box sx={{ position: "relative", width: 400, margin: "0 auto" }}>
      {/* Search Input */}
      <TextField
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search..."
        variant="outlined"
        size="small"
        fullWidth
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
          endAdornment: loading ? <CircularProgress size={20} /> : null,
        }}
      />

      {/* Search Dropdown */}
      {searchQuery && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            bgcolor: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: 2,
            mt: 1,
            zIndex: 10,
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          {/* Filter Buttons */}
          <Stack direction="row" spacing={1} sx={{ p: 2, justifyContent: "center" }}>
            {["All", "Accounts", "Contacts", ].map((type) => (
              <Typography
                key={type}
                // variant={filterType === type ? "contained" : "outlined"}
                size="small"
                onClick={() => setFilterType(type)}
              
                sx={{
                    fontWeight: filterType === type ? "bold" : "light"
                }}
              >
                {type} 
              </Typography>
            ))}
          </Stack>
          <Divider />

          {filteredOptions.length > 0 ? (
            <>
              <List>
                {filteredOptions.map((option) => (
                  <ListItem
                    key={option.id}
                    button
                    onClick={() => console.log(`Selected ${option.label}`)}
                  >
                    <ListItemAvatar>
                      <Avatar>{option.label.charAt(0).toUpperCase()}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={option.label}
                      secondary={option.subLabel}
                      primaryTypographyProps={{ fontWeight: "bold" }}
                    />
                  </ListItem>
                ))}
              </List>

              {/* Global Search Link */}
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => console.log("Global search clicked")}
                >
                  Global search
                </Button>
              </Box>
            </>
          ) : (
            <Typography sx={{ p: 2, color: "gray", textAlign: "center" }}>
              No results found
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SearchComponent;
