import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./account.css";
import { Stack, Paper, useMediaQuery, Box, Tooltip, Typography, Divider, Autocomplete, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { useMaterialReactTable, MaterialReactTable } from "material-react-table";
import DeleteIcon from "@mui/icons-material/Delete";
import { Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import ContactForm from "./UpdateContact";
import { MRT_TableHeadCellFilterContainer } from "material-react-table";
const ContactTable = () => {
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [contactData, setContactData] = useState([]);
  const [uniqueTags, setUniqueTags] = useState([]);
  const [filterValue, setFilterValue] = useState(null);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${CONTACT_API}/contacts/contactlist/list/`);
      setContactData(response.data.contactlist);
      console.log(response.data.contactlist);
    } catch (error) {
      console.error("API Error:", error);
      // toast.error('Failed to fetch contacts');
    }
  };
  useEffect(() => {
    fetchContacts();
  }, []);

  const handleContactUpdated = () => {
    fetchContacts(); // Refetch contacts when updated
  };
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
      // console.log(uniqueTags);
    }
  }, [contactData]);
  const renderFilterContainers = () => {
    return selectedFilters.map((selectedFilterIndex) => {
      const header = table.getLeafHeaders()[selectedFilterIndex + 1];
      return (
        <div className="MRT_TableHeadCellFilterContainer" key={header.id}>
          <MRT_TableHeadCellFilterContainer header={header} table={table} in />
          <IconButton
            aria-label="delete"
            size="small"
            // onClick={() => {
            //   setSelectedFilters((prevFilters) => prevFilters.filter((item) => item !== selectedFilterIndex));
            // }}
            onClick={() => {
              setSelectedFilters((prevFilters) => {
                const updatedFilters = prevFilters.filter((item) => item !== selectedFilterIndex);

                // Clear the filter value when the filter is removed
                if (updatedFilters.length === 0) {
                  setFilterValue(null);
                }

                return updatedFilters;
              });
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      );
    });
  };
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const handleFilterChange = (event) => {
    const selectedIndex = event.target.value;
    setSelectedFilterIndex(selectedIndex);
    if (selectedIndex === null) {
      setSelectedFilterIndex(null);
      setSelectedFilters([]);
    } else {
      setSelectedFilters((prevFilters) => {
        const index = prevFilters.indexOf(selectedIndex);
        if (index === -1) {
          return [...prevFilters, selectedIndex];
        } else {
          return prevFilters.filter((item) => item !== selectedIndex);
        }
      });
    }
  };
  const isMobile = useMediaQuery("(max-width: 1000px)");
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this contact?");
    if (isConfirmed) {
      try {
        await axios.delete(`${CONTACT_API}/contacts/${id}/`);
        setContactData((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
        toast.success("Contact deleted successfully!");
      } catch (error) {
        console.error("Delete API Error:", error);
        toast.error("Failed to delete contact");
      }
    }
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const handleClick = async (id) => {
    try {
      const url = `${CONTACT_API}/contacts/${id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setSelectedContact(data.contact);
      console.log(data.contact);
      selectedContacts();
      console.log(data.contact.tags);
      setIsDrawerOpen(true);
      // console.log(data.contact.tags)
      console.log(isDrawerOpen);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (selectedContact) {
      selectedContacts();
    }
  }, [selectedContact]);
  const selectedContacts = () => {
    if (selectedContact) {
    }
  };
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchTagData(); // Fetch tags on component mount
  }, []);

  const fetchTagData = async () => {
    try {
      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      setTags(data.tags);
      console.log(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Update the filteredData to filter by selected tag
  const filteredData = useMemo(() => {
    if (!filterValue) return contactData;

    return contactData.filter((item) => {
      if (Array.isArray(item.tags)) {
        return item.tags.some((tagArray) =>
          tagArray.some((tag) => {
            return tag.tagName.toLowerCase().includes(filterValue.label.toLowerCase());
          })
        );
      }
      return false;
    });
  }, [contactData, filterValue]);

  const tagsOptions = tags.map((tag) => ({
    value: tag._id,
    label: tag.tagName,
    colour: tag.tagColour,
  }));

  // Define the columns for MRT
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        Cell: ({ row }) => (
          <span style={{ cursor: "pointer", color: "blue" }} onClick={() => handleClick(row.original.id)}>
            {row.original.name}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phoneNumbers",
        header: "Phone Number",
        Cell: ({ cell }) => {
          const phoneNumbers = cell.row.original.phoneNumbers.flat();
          return (
            <div>
              {phoneNumbers.map((phoneObj, index) => (
                <div key={index}>{phoneObj.phone || phoneObj}</div>
              ))}
            </div>
          );
        },
        // Custom filter function for phoneNumbers
        filterFn: (row, columnId, filterValue) => {
          const phoneNumbers = row.original.phoneNumbers.flat();
          // Check if any phone number contains the filter value
          return phoneNumbers.some((phoneObj) => {
            const phone = phoneObj.phone || phoneObj;
            return phone.toString().toLowerCase().includes(filterValue.toLowerCase());
          });
        },
        // Custom filter UI for phoneNumbers
        Filter: ({ column }) => (
          <TextField
            value={column.getFilterValue() || ""}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Filter Phone Numbers"
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: "white",
              minWidth: 200,
            }}
          />
        ),
      },

      {
        accessorKey: "tags",
        header: "Tags",
        Cell: ({ cell }) => {
          const tags = cell.row.original.tags.flat();
          return (
            <div>
              {tags.map((tag) => (
                <span
                  key={tag._id}
                  style={{
                    backgroundColor: tag.tagColour,
                    color: "#fff",
                    padding: "2px 4px",
                    margin: "0 2px",
                    borderRadius: "60px",
                  }}
                >
                  {tag.tagName}
                </span>
              ))}
            </div>
          );
        },

        filterFn: (row, columnId, filterValue) => {
          const tags = row.original.tags.flat();
          return tags.some((tag) => filterValue.some((value) => tag.tagName.toLowerCase().includes(value.label.toLowerCase())));
        },

        Filter: ({ column }) => (
          <Autocomplete
            multiple
            options={tagsOptions}
            onChange={(event, newValue) => {
              column.setFilterValue(newValue); // Set the filter value to the selected tags
            }}
            renderInput={(params) => <TextField {...params} placeholder="Select Tags" variant="outlined" size="small" />}
            renderOption={(props, option) => (
              <li {...props} style={{ cursor: "pointer" }}>
                <span
                  style={{
                    backgroundColor: option.colour,
                    color: "#fff",
                    padding: "2px 4px",
                    borderRadius: "4px",
                  }}
                >
                  {option.label}
                </span>
              </li>
            )}
          />
        ),
      },
      {
        accessorKey: "companyName",
        header: "Company Name",
      },
      {
        id: "actions",
        // header: 'Actions',
        Cell: ({ row }) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <DeleteIcon style={{ fontSize: "20px", cursor: "pointer", color: "red" }} onClick={() => handleDelete(row.original.id)} />
          </div>
        ),
      },
    ],
    [uniqueTags, filterValue, handleClick, tags]
  );
  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    enableBottomToolbar: true,
    enableStickyHeader: true,
    columnFilterDisplayMode: "custom", // Custom filtering UI
    enableRowSelection: true, // Enable row selection
    enablePagination: true,
    muiTableContainerProps: { sx: { maxHeight: "400px" } },
    initialState: {
      columnPinning: { left: ["mrt-row-select", "name"] },
    },
    muiTableBodyCellProps: {
      sx: (theme) => ({
        backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[50],
      }),
    },
  });
  return (
    <>
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
          <ContactForm
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
      {/* // <MaterialReactTable columns={columns} table={table} /> */}
      <Stack direction={isMobile ? "column-reverse" : "column"} gap="8px">
        <Paper style={{ display: "flex", overflowX: "auto" }}>
          <Stack p="8px" gap="8px" display="flex" direction="row">
            <>
              <Autocomplete
                options={columns.map((column, index) => ({
                  label: column.header, // Display header text
                  value: index, // Store the index as the value
                }))}
                value={columns[selectedFilterIndex] ? { label: columns[selectedFilterIndex].header, value: selectedFilterIndex } : null}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setSelectedFilterIndex(newValue.value);
                    handleFilterChange({ target: { value: newValue.value } });
                  } else {
                    setSelectedFilterIndex(null);
                    handleFilterChange({ target: { value: null } });
                  }
                }}
                getOptionLabel={(option) => option.label || ""}
                isOptionEqualToValue={(option, value) => option.value === value?.value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Filter"
                    variant="outlined"
                    size="small"
                    sx={{
                      backgroundColor: "white",
                      minWidth: 200, // Match the minimum width of the original Select
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li
                    {...props}
                    style={{
                      fontSize: "14px",
                      padding: "5px", // Padding for each option
                      // Spacing between options
                      cursor: "pointer",
                    }}
                  >
                    {option.label}
                  </li>
                )}
              />
              <Stack direction="row" gap="8px">
                {renderFilterContainers()}
              </Stack>
            </>
          </Stack>
        </Paper>
        <MaterialReactTable columns={columns} table={table} />
      </Stack>
    </>
  );
};

export default ContactTable;

// import React, { useEffect, useState } from "react";
// import { Chip, Tooltip, Autocomplete, OutlinedInput, MenuItem as MuiMenuItem, FormControl, InputLabel, Menu, Button, IconButton, Select, MenuItem, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper } from "@mui/material";
// import axios from "axios";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { RxCross2 } from "react-icons/rx";
// import { Link } from "react-router-dom";
// const FixedColumnTable = () => {
//   const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
//   const [contactData, setContactData] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${CONTACT_API}/contacts/contactlist/list/`);
//         setContactData(response.data.contactlist);
//         console.log(response.data.contactlist);
//       } catch (error) {
//         console.log("Error:", error);
//       }
//     };

//     fetchData();
//   }, [CONTACT_API]);

//   const handleFilterButtonClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };
//   return (
//     <>
//       <div style={{ display: "flex", padding: "10px", marginBottom: "20px" }}>
//         <Button variant="text" onClick={handleFilterButtonClick} style={{ marginRight: "10px" }}>
//           Filter Options
//         </Button>
//         <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
//           <MenuItem>Account Name</MenuItem>
//           <MenuItem>Type</MenuItem>
//           <MenuItem>Team Member</MenuItem>
//           <MenuItem>Tags</MenuItem>
//         </Menu>
//       </div>
//       <TableContainer component={Paper} style={{ width: "100%", overflowX: "auto" }}>
//         <Table style={{ tableLayout: "fixed", width: "100%" }}>
//           <TableHead>
//             <TableRow>
//               <TableCell width="200">Name</TableCell>
//               <TableCell width="200">Email</TableCell>
//               <TableCell width="200">Phone Number</TableCell>
//               <TableCell width="200">Company Name</TableCell>
//               <TableCell width="200">Tags</TableCell>

//               <TableCell width="200"></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {contactData.map((contact) => (
//               <TableRow key={contact.id}>
//                 <TableCell>{contact.name}</TableCell>
//                 <TableCell>{contact.email}</TableCell>
//                 <TableCell></TableCell>
//                 <TableCell>{contact.companyName}</TableCell>
//                 <TableCell></TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </>
//   );
// };

// export default FixedColumnTable;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { Checkbox, FormControl, InputLabel, Autocomplete, TextField, Select, Chip, TableSortLabel, Tooltip, Button, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";

// const FixedColumnTable = () => {
//   const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
//   const [contactData, setContactData] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [order, setOrder] = useState("asc");
//   const [orderBy, setOrderBy] = useState("name");
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${CONTACT_API}/contacts/contactlist/list/`);
//         setContactData(response.data.contactlist);
//         console.log(response.data.contactlist);
//       } catch (error) {
//         console.log("Error:", error);
//       }
//     };

//     fetchData();
//   }, [CONTACT_API]);

//   const handleFilterButtonClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleRequestSort = (property) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };

//   const sortedData = contactData.slice().sort((a, b) => {
//     if (orderBy === "name") {
//       return (a.name < b.name ? -1 : 1) * (order === "asc" ? 1 : -1);
//     } else if (orderBy === "phoneNumber") {
//       return (a.phoneNumbers[0]?.[0]?.phone < b.phoneNumbers[0]?.[0]?.phone ? -1 : 1) * (order === "asc" ? 1 : -1);
//     } else if (orderBy === "companyName") {
//       return (a.companyName < b.companyName ? -1 : 1) * (order === "asc" ? 1 : -1);
//     }
//     return 0;
//   });
//   const formatDate = (dateString) => {
//     const options = { year: "numeric", month: "long", day: "numeric" }; // Format to show only date
//     return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
//   };

//   return (
//     <>
//       <div style={{ display: "flex", padding: "10px", marginBottom: "20px" }}>
//         <Button variant="text" onClick={handleFilterButtonClick} style={{ marginRight: "10px" }}>
//           Filter Options
//         </Button>
//         <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
//           <MenuItem>Tags</MenuItem>
//           <MenuItem>Date Created</MenuItem>
//           <MenuItem>Date Updated</MenuItem>
//         </Menu>
//       </div>
//       <div className="table-wrapper">
//         <TableContainer component={Paper} style={{ width: "100%", overflowX: "auto" }}>
//           <Table style={{ tableLayout: "fixed", width: "100%" }}>
//             <TableHead>
//               <TableRow>
//                 <TableCell width="200" className="fixed-column">
//                   <TableSortLabel active={orderBy === "name"} direction={orderBy === "name" ? order : "asc"} onClick={() => handleRequestSort("name")}>
//                     Name
//                   </TableSortLabel>
//                 </TableCell>
//                 <TableCell width="200">Email</TableCell>
//                 <TableCell width="200">
//                   <TableSortLabel active={orderBy === "phoneNumber"} direction={orderBy === "phoneNumber" ? order : "asc"} onClick={() => handleRequestSort("phoneNumber")}>
//                     Phone Number
//                   </TableSortLabel>
//                 </TableCell>
//                 <TableCell width="200">
//                   <TableSortLabel active={orderBy === "companyName"} direction={orderBy === "companyName" ? order : "asc"} onClick={() => handleRequestSort("companyName")}>
//                     Company Name
//                   </TableSortLabel>
//                 </TableCell>
//                 <TableCell width="200">Tags</TableCell>
//                 <TableCell width="200">Created At</TableCell>
//                 <TableCell width="200">Updated At</TableCell>
//                 <TableCell width="200"></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((contact) => (
//                 <TableRow key={contact.id}>
//                   <TableCell className="fixed-column">{contact.name}</TableCell>
//                   <TableCell>{contact.email}</TableCell>
//                   <TableCell>{contact.phoneNumbers && contact.phoneNumbers[0] && contact.phoneNumbers[0].map((phoneObj, index) => <div key={index}>{phoneObj.phone}</div>)}</TableCell>
//                   <TableCell>{contact.companyName}</TableCell>

//                   <TableCell>
//                     {contact.tags && contact.tags[0] ? (
//                       contact.tags[0].length > 1 ? (
//                         <Tooltip
//                           title={
//                             <div>
//                               {contact.tags[0].map((tag) => (
//                                 <span
//                                   key={tag._id}
//                                   style={{
//                                     backgroundColor: tag.tagColour,
//                                     color: "#fff",
//                                     padding: "2px 6px",
//                                     borderRadius: "8px",
//                                     display: "inline-block",
//                                     margin: "2px",
//                                   }}
//                                 >
//                                   {tag.tagName}
//                                 </span>
//                               ))}
//                             </div>
//                           }
//                           placement="top"
//                           sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
//                         >
//                           <span>
//                             <span
//                               style={{
//                                 backgroundColor: contact.tags[0][0].tagColour,
//                                 color: "#fff",
//                                 padding: "2px 6px",
//                                 borderRadius: "8px",
//                               }}
//                             >
//                               {contact.tags[0][0].tagName}
//                             </span>
//                             {` +${contact.tags[0].length - 1}`}
//                           </span>
//                         </Tooltip>
//                       ) : (
//                         <span
//                           style={{
//                             backgroundColor: contact.tags[0][0].tagColour,
//                             color: "#fff",
//                             padding: "2px 6px",
//                             borderRadius: "8px",
//                           }}
//                         >
//                           {contact.tags[0][0].tagName}
//                         </span>
//                       )
//                     ) : (
//                       ""
//                     )}
//                   </TableCell>
//                   <TableCell>{formatDate(contact.createdAt)}</TableCell>
//                   <TableCell>{formatDate(contact.updatedAt)}</TableCell>
//                   <TableCell></TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//           <TablePagination rowsPerPageOptions={[5, 10, 15, 20, 25]} component="div" count={contactData.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
//         </TableContainer>
//       </div>
//     </>
//   );
// };
// export default FixedColumnTable;
