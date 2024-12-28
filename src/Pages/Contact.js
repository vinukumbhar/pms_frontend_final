import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./account.css";
import {
  Stack,
  Paper,
  useMediaQuery,
  Box,
  Tooltip,
  Typography,
  Divider,
  Checkbox,
  Autocomplete,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,Button,Menu,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  useMaterialReactTable,
  MaterialReactTable,
} from "material-react-table";
import DeleteIcon from "@mui/icons-material/Delete";
import { Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import ContactForm from "./UpdateContact";
import { MRT_TableHeadCellFilterContainer } from "material-react-table";
// const ContactTable = () => {
//   const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
//   const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
//   const [contactData, setContactData] = useState([]);
//   const [uniqueTags, setUniqueTags] = useState([]);
//   const [filterValue, setFilterValue] = useState(null);

//   const fetchContacts = async () => {
//     try {
//       const response = await axios.get(
//         `${CONTACT_API}/contacts/contactlist/list/`
//       );
//       setContactData(response.data.contactlist);
//       console.log(response.data.contactlist);
//     } catch (error) {
//       console.error("API Error:", error);
//       // toast.error('Failed to fetch contacts');
//     }
//   };
//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const handleContactUpdated = () => {
//     fetchContacts(); // Refetch contacts when updated
//   };
//   useEffect(() => {
//     if (contactData.length > 0) {
//       const tagsSet = new Set();
//       contactData.forEach((item) => {
//         if (Array.isArray(item.Tags)) {
//           item.Tags.forEach((tag) => {
//             tagsSet.add(JSON.stringify(tag[0]));
//           });
//         }
//       });
//       setUniqueTags(Array.from(tagsSet).map((tag) => JSON.parse(tag)));
//       // console.log(uniqueTags);
//     }
//   }, [contactData]);

//   const isMobile = useMediaQuery("(max-width: 1000px)");
//   const handleDelete = async (id) => {
//     const isConfirmed = window.confirm(
//       "Are you sure you want to delete this contact?"
//     );
//     if (isConfirmed) {
//       try {
//         await axios.delete(`${CONTACT_API}/contacts/${id}/`);
//         setContactData((prevContacts) =>
//           prevContacts.filter((contact) => contact.id !== id)
//         );
//         toast.success("Contact deleted successfully!");
//       } catch (error) {
//         console.error("Delete API Error:", error);
//         toast.error("Failed to delete contact");
//       }
//     }
//   };
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const handleClick = async (id) => {
//     try {
//       const url = `${CONTACT_API}/contacts/${id}`;
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error("Failed to fetch data");
//       }
//       const data = await response.json();
//       setSelectedContact(data.contact);
//       console.log(data.contact);
//       selectedContacts();
//       console.log(data.contact.tags);
//       setIsDrawerOpen(true);
//       // console.log(data.contact.tags)
//       console.log(isDrawerOpen);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
//   useEffect(() => {
//     if (selectedContact) {
//       selectedContacts();
//     }
//   }, [selectedContact]);
//   const selectedContacts = () => {
//     if (selectedContact) {
//     }
//   };
//   const [tags, setTags] = useState([]);

//   useEffect(() => {
//     fetchTagData(); // Fetch tags on component mount
//   }, []);

//   const fetchTagData = async () => {
//     try {
//       const url = `${TAGS_API}/tags/`;
//       const response = await fetch(url);
//       const data = await response.json();
//       setTags(data.tags);
//       console.log(data.tags);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   // Define the columns for MRT
//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "name",
//         header: "Name",
//         Cell: ({ row }) => (
//           <span
//             style={{ cursor: "pointer", color: "blue" }}
//             onClick={() => handleClick(row.original.id)}
//           >
//             {row.original.name}
//           </span>
//         ),
//       },
//       {
//         accessorKey: "email",
//         header: "Email",
//       },
//       {
//         accessorKey: "phoneNumbers",
//         header: "Phone Number",
//         Cell: ({ cell }) => {
//           const phoneNumbers = cell.row.original.phoneNumbers.flat();
//           return (
//             <div>
//               {phoneNumbers.map((phoneObj, index) => (
//                 <div key={index}>{phoneObj.phone || phoneObj}</div>
//               ))}
//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: "tags",
//         header: "Tags",
//         Cell: ({ cell }) => {
//           const tags = cell.row.original.tags.flat();
//           const firstTag = tags[0];
//           const remainingCount = tags.length - 1;

//           return (
//             <Tooltip
//               title={
//                 <div>
//                   {tags.map((tag) => (
//                     <span
//                       key={tag._id}
//                       style={{
//                         display: "block",
//                         backgroundColor: tag.tagColour,
//                         color: "#fff",
//                         padding: "2px 4px",
//                         margin: "2px 0",
//                         borderRadius: "4px",
//                       }}
//                     >
//                       {tag.tagName}
//                     </span>
//                   ))}
//                 </div>
//               }
//               arrow
//               placement="top"
//             >
//               <span>
//                 <span
//                   style={{
//                     backgroundColor: firstTag.tagColour,
//                     color: "#fff",
//                     padding: "2px 4px",
//                     borderRadius: "60px",
//                     marginRight: "4px",
//                   }}
//                 >
//                   {firstTag.tagName}
//                 </span>
//                 {remainingCount > 0 && (
//                   <span style={{ cursor: "pointer" }}>+{remainingCount}</span>
//                 )}
//               </span>
//             </Tooltip>
//           );
//         },
//       },
//       {
//         accessorKey: "companyName",
//         header: "Company Name",
//       },
//       {
//         id: "actions",
//         // header: 'Actions',
//         Cell: ({ row }) => (
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <DeleteIcon
//               style={{ fontSize: "20px", cursor: "pointer", color: "red" }}
//               onClick={() => handleDelete(row.original.id)}
//             />
//           </div>
//         ),
//       },
//     ],
//     [uniqueTags, handleClick]
//   );
//   const table = useMaterialReactTable({
//     columns,
//     data: contactData,
//     enableBottomToolbar: true,
//     enableStickyHeader: true,
//     columnFilterDisplayMode: "custom", // Custom filtering UI
//     enableRowSelection: true, // Enable row selection
//     enablePagination: true,
//     muiTableContainerProps: { sx: { maxHeight: "400px" } },
//     initialState: {
//       columnPinning: { left: ["mrt-row-select", "name"] },
//     },
//     muiTableBodyCellProps: {
//       sx: (theme) => ({
//         backgroundColor:
//           theme.palette.mode === "dark"
//             ? theme.palette.grey[900]
//             : theme.palette.grey[50],
//       }),
//     },
//   });
//   return (
//     <>
//       <Drawer
//         anchor="right"
//         open={isDrawerOpen}
//         onClose={() => setIsDrawerOpen(false)}
//         sx={{ width: 600 }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             padding: "20px",
//             ml: 1,
//           }}
//         >
//           <Typography sx={{ fontWeight: "bold" }} variant="h6">
//             Edit Contact
//           </Typography>
//           <IconButton onClick={() => setIsDrawerOpen(false)}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
//         <Divider />
//         {selectedContact && (
//           <ContactForm
//             selectedContact={selectedContact}
//             uniqueTags={uniqueTags}
//             // Pass additional props needed by ContactForm
//             handleTagChange={() => {}}
//             handlePhoneNumberChange={() => {}}
//             handleDeletePhoneNumber={() => {}}
//             handleAddPhoneNumber={() => {}}
//             handleCountryChange={() => {}}
//             sendingData={() => {}}
//             handleClose={() => setIsDrawerOpen(false)}
//             isSmallScreen={isMobile}
//             onContactUpdated={handleContactUpdated}
//           />
//         )}
//       </Drawer>
//       {/* // <MaterialReactTable columns={columns} table={table} /> */}
//       <Stack direction={isMobile ? "column-reverse" : "column"} gap="8px">
//         <MaterialReactTable columns={columns} table={table} />
//       </Stack>
//     </>
//   );
// };

// export default ContactTable;

const ContactTable = () => {
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [contactData, setContactData] = useState([]);
  const [uniqueTags, setUniqueTags] = useState([]);
  const [filterValue, setFilterValue] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [tags, setTags] = useState([]);
  const isMobile = useMediaQuery("(max-width: 1000px)");
  const [filterText, setFilterText] = useState("");
   
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Handle sort action
  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const newDirection =
        prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc";
      return { key, direction: newDirection };
    });
  };

  // Sort the data based on the sortConfig
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return contactData;

    const sorted = [...contactData].sort((a, b) => {
      let aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
      let bValue = b[sortConfig.key]?.toString().toLowerCase() || "";

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [contactData, sortConfig]);

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "↕"; // Default icon for unsorted columns
  };
  // Filter the data based on the filterText
  const filteredData = useMemo(() => {
    if (!filterText) return sortedData;

    return sortedData.filter((contact) => {
      const name = contact.name?.toLowerCase() || "";
      const email = contact.email?.toLowerCase() || "";
      const companyName = contact.companyName?.toLowerCase() || "";
      return (
        name.includes(filterText.toLowerCase()) ||
        email.includes(filterText.toLowerCase()) ||
        companyName.includes(filterText.toLowerCase())
      );
    });
  }, [sortedData, filterText]);
   // Pagination states
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);

    // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0); // Reset to first page when changing rows per page
  };

  // Pagination: Slice the contact data based on page and rowsPerPage
  const paginatedData = contactData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        `${CONTACT_API}/contacts/contactlist/list/`
      );
      setContactData(response.data.contactlist);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const fetchTagData = async () => {
    try {
      const response = await fetch(`${TAGS_API}/tags/`);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleContactUpdated = () => {
    fetchContacts(); // Refetch contacts when updated
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this contact?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`${CONTACT_API}/contacts/${id}/`);
        setContactData((prevContacts) =>
          prevContacts.filter((contact) => contact.id !== id)
        );
        alert("Contact deleted successfully!");
      } catch (error) {
        console.error("Delete API Error:", error);
        alert("Failed to delete contact");
      }
    }
  };

  const handleClick = async (id) => {
    try {
      const url = `${CONTACT_API}/contacts/${id}`;
      const response = await fetch(url);
      const data = await response.json();
      setSelectedContact(data.contact);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchTagData();
  }, []);

  useEffect(() => {
    if (contactData.length > 0) {
      const tagsSet = new Set();
      contactData.forEach((item) => {
        if (Array.isArray(item.Tags)) {
          item.Tags.forEach((tag) => {
            tagsSet.add(JSON.stringify(tag[0]));
          });
        }
      });
      setUniqueTags(Array.from(tagsSet).map((tag) => JSON.parse(tag)));
    }
  }, [contactData]);

  const [selectedContacts, setSelectedContacts] = useState([]);
  // Handle checkbox change for individual contact
  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      // Add ID to selectedContacts array
      setSelectedContacts((prevSelected) => {
        const newSelected = [...prevSelected, id];
        console.log("Selected Contacts IDs:", newSelected); // Log selected IDs
        return newSelected;
      });
    } else {
      // Remove ID from selectedContacts array
      setSelectedContacts((prevSelected) => {
        const newSelected = prevSelected.filter(
          (contactId) => contactId !== id
        );
        console.log("Selected Contacts IDs:", newSelected); // Log selected IDs
        return newSelected;
      });
    }
  };

  // Handle "Select All" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = contactData.map((contact) => contact.id);
      setSelectedContacts(allIds);
      console.log("Selected Contacts IDs:", allIds); // Log all selected IDs
    } else {
      setSelectedContacts([]);
      console.log("Selected Contacts IDs: []"); // Log empty array when deselected
    }
  };
  const [filterOption, setFilterOption] = useState("");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false); 
  const handleFilterOptionClick = (option) => {
    setFilterOption(option);
    setIsFilterVisible(true); // Show the TextField
    setMenuAnchor(null); // Close the menu after selection
  };

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  }; 
  const clearFilter = () => {
    setFilterOption(""); // Clear filter option
    setFilterText(""); // Clear filter text
    setIsFilterVisible(false); // Hide the TextField
  };
  return (
    <>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{ width: 600 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            ml: 1,
          }}
        >
          <Typography sx={{ fontWeight: "bold" }} variant="h6">
            Edit Contact
          </Typography>
          <IconButton onClick={() => setIsDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        {selectedContact && (
          <ContactForm
            selectedContact={selectedContact}
            uniqueTags={uniqueTags}
            handleClose={() => setIsDrawerOpen(false)}
            isSmallScreen={isMobile}
            onContactUpdated={handleContactUpdated}
          />
        )}
      </Drawer>


      {/* Filter Button and Dropdown */}
      <Box display="flex" alignItems="center" mb={2}>
        <Button variant="contained" onClick={handleMenuOpen}>
          Filter by
        </Button>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleFilterOptionClick("name")}>Name</MenuItem>
          <MenuItem onClick={() => handleFilterOptionClick("email")}>Email</MenuItem>
          <MenuItem onClick={() => handleFilterOptionClick("companyName")}>Company Name</MenuItem>
        
        </Menu>
        {isFilterVisible && (
           <Box display="flex" alignItems="center" ml={2}>
           <TextField
             label={`Search by ${filterOption}`}
             variant="outlined"
             size="small"
             value={filterText}
             onChange={(e) => setFilterText(e.target.value)}
             style={{ flex: 1 }}
           />
           <IconButton onClick={clearFilter} sx={{ ml: 1 }}>
             <DeleteIcon color="error" />
           </IconButton>
         </Box>
        )}
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="contact table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedContacts.length === contactData.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
              Name {getSortIcon("name")}
            </TableCell>
            <TableCell onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
              Email {getSortIcon("email")}
            </TableCell>
              <TableCell>
                Phone Numbers {/* No sorting for this column */}
              </TableCell>
              <TableCell>Tags</TableCell>
              <TableCell
              onClick={() => handleSort("companyName")}
              style={{ cursor: "pointer" }}
            >
              Company Name {getSortIcon("companyName")}
            </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedContacts.includes(contact.id)}
                    onChange={(e) => handleCheckboxChange(e, contact.id)}
                  />
                </TableCell>
                <TableCell
                  sx={{ cursor: "pointer", color: "blue" }}
                  onClick={() => handleClick(contact.id)}
                >
                  {contact.name}
                </TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>
                  {contact.phoneNumbers.flat().map((phoneObj, index) => (
                    <div key={index}>{phoneObj.phone || phoneObj}</div>
                  ))}
                </TableCell>
                <TableCell>
                    {contact.tags && contact.tags.flat().length > 0 && (
                    <Tooltip
                      title={
                        <div>
                          {contact.tags.flat().map((tag) => (
                            <span
                              key={tag._id}
                              style={{
                                display: "block",
                                backgroundColor: tag.tagColour,
                                color: "#fff",
                                padding: "2px 4px",
                                margin: "2px 0",
                                borderRadius: "4px",
                              }}
                            >
                              {tag.tagName}
                            </span>
                          ))}
                        </div>
                      }
                      arrow
                      placement="top"
                    >
                      <span style={{ display: "inline-block" }}>
                        {contact.tags.flat()[0] && (
                          <span
                            style={{
                              backgroundColor: contact.tags.flat()[0].tagColour,
                              color: "#fff",
                              padding: "3px 8px",
                              borderRadius: "10px",
                              marginRight: "4px",
                            }}
                          >
                            {contact.tags.flat()[0].tagName}
                          </span>
                        )}
                        {contact.tags.flat().length > 1 && (
                          <span style={{ cursor: "pointer", color: "blue" }}>
                            +{contact.tags.flat().length - 1}
                          </span>
                        )}
                      </span>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>{contact.companyName}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleDelete(contact.id)}
                    sx={{ color: "red" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
  component="div"
  count={contactData.length}
  page={page}
  onPageChange={handleChangePage}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={handleChangeRowsPerPage}
  rowsPerPageOptions={[5, 10, 25,30,35,40,45, 50]} // Added row options
  
/>

    </>
  );
};

export default ContactTable;
