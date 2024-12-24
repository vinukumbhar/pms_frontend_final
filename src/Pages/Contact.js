// import React, { useEffect, useState, useContext } from "react";
// import {
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Drawer,
//   TablePagination,
//   Chip,
//   Tooltip,
//   Autocomplete,
//   Box,
//   Divider,
//   Typography,
//   OutlinedInput,
//   MenuItem as MuiMenuItem,
//   FormControl,
//   InputLabel,
//   Menu,
//   Button,
//   IconButton,
//   Select,
//   MenuItem,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Checkbox,
//   Paper,
// } from "@mui/material";
// import axios from "axios";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { RxCross2 } from "react-icons/rx";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { Outlet } from "react-router-dom";
// import ListIcon from "@mui/icons-material/List";
// import EmailIcon from "@mui/icons-material/Email";
// import TagIcon from "@mui/icons-material/Tag";
// import PersonIcon from "@mui/icons-material/Person";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import SendAccountEmail from "./BulkActions/SendAccountEmail";
// import AddJobs from "./BulkActions/AddJobs";
// import AddBulkOrganizer from "./BulkActions/AddBulkOrganizer";
// import ManageTags from "./BulkActions/ManageTags";
// import ManageTeams from "./BulkActions/ManageTeams";
// import { useTheme } from "@mui/material/styles";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import CloseIcon from "@mui/icons-material/Close";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import { CircularProgress } from "@mui/material";
// import { LoginContext } from "../Sidebar/Context/Context.js";
// const FixedColumnTable = () => {
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
//   const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
//   const [accountData, setAccountData] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [sortConfig, setSortConfig] = useState({
//     key: "Name",
//     direction: "asc",
//   });

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5); // 5 rows per page
//   const [filters, setFilters] = useState({
//     accountName: "",
//     type: "",
//     teamMember: "",
//     tags: [],
//   });
//   const [showFilters, setShowFilters] = useState({
//     accountName: false,
//     type: false,
//     teamMember: false,
//     tags: false,
//   });

//   const [loading, setLoading] = useState(true);
//   const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${CONTACT_API}/contacts/contactlist/list/`
//       );
//       let accountsListData = response.data.contactlist;

//       setAccountData(accountsListData); // Clear account data if not permitted
//       console.log(accountsListData);
//     } catch (error) {
//       console.log("Error:", error);
//     } finally {
//       setLoading(false); // Stop loader
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [ACCOUNT_API]);

//   const handleSelect = (id) => {
//     const currentIndex = selected.indexOf(id);
//     const newSelected =
//       currentIndex === -1
//         ? [...selected, id]
//         : selected.filter((item) => item !== id);
//     setSelected(newSelected);
//     // Log all selected row IDs
//     // console.log("Selected IDs:", newSelected); // Log all selected IDs
//   };

//   // console.log(selected);
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prevFilters) => ({ ...prevFilters, [name]: value })); // Update filter without clearing others
//     setPage(0);
//   };

//   const filteredData = accountData.filter((row) => {
//     const accountNameMatch = row.name
//       .toLowerCase()
//       .includes(filters.accountName.toLowerCase());

//     const tagMatch = filters.tags.length
//       ? row.tags &&
//         Array.isArray(row.Tags) &&
//         filters.tags.some((tag) =>
//           row.tags.some(
//             (rowTag) =>
//               rowTag.tagName === tag.tagName &&
//               rowTag.tagColour === tag.tagColour
//           )
//         )
//       : true;
//     return accountNameMatch && tagMatch;
//   });
//   const handleFilterButtonClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const clearFilter = (filterField) => {
//     setFilters((prevFilters) => ({ ...prevFilters, [filterField]: "" })); // Clear the specific filter
//     setShowFilters((prev) => ({
//       ...prev,
//       [filterField]: false, // Hide the filter input
//     }));
//   };

//   const toggleFilter = (filterType) => {
//     setShowFilters((prev) => ({
//       ...prev,
//       [filterType]: !prev[filterType],
//     }));
//   };
//   const handleMultiSelectChange = (name, values) => {
//     setFilters((prevFilters) => ({ ...prevFilters, [name]: values }));
//   };

//   const [tags, setTags] = useState([]);

//   useEffect(() => {
//     fetchTagData();
//   }, []);

//   const fetchTagData = async () => {
//     try {
//       const response = await fetch(`${TAGS_API}/tags/`);
//       const data = await response.json();
//       setTags(data.tags);
//     } catch (error) {
//       console.error("Error fetching tags:", error);
//     }
//   };

//   const uniqueTags =
//     tags.length > 0
//       ? Array.from(
//           new Set(tags.map((tag) => `${tag.tagName}-${tag.tagColour}`))
//         ).map((tagKey) => {
//           const [tagName, tagColour] = tagKey.split("-");
//           return { tagName, tagColour };
//         })
//       : [];
//   const calculateWidth = (tagName) => {
//     const baseWidth = 10; // base width for each tag
//     const charWidth = 8; // approximate width of each character
//     const padding = 10; // padding on either side
//     return baseWidth + charWidth * tagName.length + padding;
//   };
//   const handleSort = (key) => {
//     setSortConfig((prevSortConfig) => {
//       if (prevSortConfig.key === key) {
//         return {
//           key,
//           direction: prevSortConfig.direction === "asc" ? "desc" : "asc",
//         };
//       }
//       return { key, direction: "asc" };
//     });
//   };

//   const sortedData = React.useMemo(() => {
//     const dataToSort = filteredData; // Use filteredData for sorting
//     const sorted = [...dataToSort]; // Create a copy of filteredData

//     if (sortConfig.key) {
//       sorted.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key])
//           return sortConfig.direction === "asc" ? -1 : 1;
//         if (a[sortConfig.key] > b[sortConfig.key])
//           return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       });
//     }
//     return sorted;
//   }, [filteredData, sortConfig]);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };
//   const paginatedData = sortedData.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   return (
//     <>
//       <div style={{ display: "flex", padding: "10px", marginBottom: "20px" }}>
//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleClose}
//         >
//           <MenuItem
//             onClick={() => {
//               toggleFilter("accountName");
//               handleClose();
//             }}
//           >
//             Account Name
//           </MenuItem>
//           <MenuItem
//             onClick={() => {
//               toggleFilter("tags");
//               handleClose();
//             }}
//           >
//             Tags
//           </MenuItem>
//         </Menu>

//         {/* Account Name Filter */}
//         {showFilters.accountName && (
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               marginBottom: "10px",
//             }}
//           >
//             <TextField
//               name="accountName"
//               value={filters.accountName}
//               onChange={handleFilterChange}
//               placeholder="Filter by Account Name"
//               variant="outlined"
//               size="small"
//               style={{ marginRight: "10px" }}
//             />
//             <DeleteIcon
//               onClick={() => clearFilter("accountName")}
//               style={{ cursor: "pointer", color: "red" }}
//             />
//           </div>
//         )}
//         {/* Tags Filter */}
//         {showFilters.tags && (
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               marginBottom: "10px",
//             }}
//           >
//             <Autocomplete
//               multiple
//               options={uniqueTags}
//               value={filters.tags || []}
//               onChange={(e, newValue) =>
//                 handleMultiSelectChange("tags", newValue)
//               }
//               getOptionLabel={(option) => option.tagName}
//               filterSelectedOptions
//               renderOption={(props, option) => (
//                 <li
//                   {...props}
//                   style={{
//                     backgroundColor: option.tagColour,
//                     color: "#fff",
//                     padding: "2px 8px",
//                     borderRadius: "8px",
//                     textAlign: "center",
//                     marginBottom: "5px",
//                     fontSize: "10px",
//                     width: `${calculateWidth(option.tagName)}px`,
//                     marginLeft: "5px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {option.tagName}
//                 </li>
//               )}
//               renderTags={(selected, getTagProps) =>
//                 selected.map((option, index) => (
//                   <Chip
//                     key={option.value}
//                     label={option.tagName}
//                     style={{
//                       backgroundColor: option.tagColour,
//                       color: "#fff",
//                       cursor: "pointer",
//                       // borderRadius: "8px",
//                       fontSize: "12px",
//                       margin: "2px",
//                     }}
//                     {...getTagProps({ index })}
//                   />
//                 ))
//               }
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   variant="outlined"
//                   placeholder="Filter by Tags"
//                   size="small"
//                   style={{ width: "250px" }}
//                 />
//               )}
//               style={{ marginRight: "10px", width: "250px" }}
//             />
//             <DeleteIcon
//               onClick={() => clearFilter("tags")}
//               style={{ cursor: "pointer", color: "red" }}
//             />
//           </div>
//         )}
//       </div>
//       {loading ? (
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           {" "}
//           <CircularProgress style={{ fontSize: "300px", color: "blue" }} />
//         </Box>
//       ) : (
//         <Box>
//           <Box sx={{ my: 2, margin: "20px" }}>
//             <Button variant="text" onClick={handleFilterButtonClick}>
//               Filter Options
//             </Button>
//           </Box>
//           <TableContainer
//             component={Paper}
//             style={{ width: "100%", overflowX: "auto" }}
//           >
//             <Table style={{ tableLayout: "fixed", width: "100%" }}>
//               <TableHead>
//                 <TableRow>
//                   <TableCell
//                     padding="checkbox"
//                     style={{
//                       position: "sticky",
//                       left: 0,
//                       zIndex: 1,
//                       background: "#fff",
//                     }}
//                   >
//                     <Checkbox
//                       checked={selected.length === accountData.length}
//                       onChange={() => {
//                         if (selected.length === accountData.length) {
//                           setSelected([]);
//                         } else {
//                           const allSelected = accountData.map(
//                             (item) => item.id
//                           );
//                           setSelected(allSelected);
//                         }
//                       }}
//                     />
//                   </TableCell>
//                   <TableCell
//                     onClick={() => handleSort("Name")}
//                     style={{
//                       cursor: "pointer",
//                       position: "sticky",
//                       left: 50,
//                       zIndex: 1,
//                       background: "#fff",
//                     }}
//                     width="200"
//                   >
//                     Name{" "}
//                     {sortConfig.key === "Name"
//                       ? sortConfig.direction === "asc"
//                         ? "↑"
//                         : "↓"
//                       : null}
//                   </TableCell>
//                   <TableCell width="200">Email</TableCell>
//                   <TableCell width="200">Phone Number</TableCell>

//                   <TableCell width="200">Tags</TableCell>
//                   <TableCell width="200">Company Name</TableCell>

//                   <TableCell width="200"></TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {paginatedData.map((row) => {
//                   const isSelected = selected.indexOf(row.id) !== -1;
//                   return (
//                     <TableRow
//                       key={row.id}
//                       hover
//                       onClick={() => handleSelect(row.id)}
//                       role="checkbox"
//                       tabIndex={-1}
//                       selected={isSelected}
//                     >
//                       <TableCell
//                         padding="checkbox"
//                         style={{
//                           position: "sticky",
//                           left: 0,
//                           zIndex: 1,
//                           background: "#fff",
//                         }}
//                       >
//                         <Checkbox checked={isSelected} />
//                       </TableCell>
//                       <TableCell
//                         style={{
//                           position: "sticky",
//                           left: 50,
//                           zIndex: 1,
//                           background: "#fff",
//                         }}
//                       >
//                         {row.name}
//                       </TableCell>
//                       <TableCell>{row.email}</TableCell>
//                       <TableCell>{row.phoneNumbers}</TableCell>
//                       <TableCell>
//                         {Array.isArray(row.tags) && row.tags.length > 0  && (
//                           row.tags.flat().map((tag, index) => (
//                             <span
//                               key={tag._id}
//                               style={{
//                                 background: tag.tagColour,
//                                 color: "#fff",
//                                 borderRadius: "8px",
//                                 padding: "2px 8px",
//                                 fontSize: "10px",
//                                 marginLeft: index > 0 ? "5px" : "0",
//                               }}
//                             >
//                               {tag.tagName}
//                             </span>
//                           ))
//                         ) }
//                       </TableCell>

//                       <TableCell
//                         style={{ display: "flex", alignItems: "center" }}
//                         height="40"
//                       >
//                         {row.companyName}
//                       </TableCell>
//                       <TableCell></TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           <TablePagination
//             rowsPerPageOptions={[5, 10, 15]}
//             component="div"
//             count={sortedData.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         </Box>
//       )}
//     </>
//   );
// };

// export default FixedColumnTable;


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
          const firstTag = tags[0];
          const remainingCount = tags.length - 1;
      
          return (
            <Tooltip
            title={
              <div>
                {tags.map((tag) => (
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
              <span>
                <span
                  style={{
                    backgroundColor: firstTag.tagColour,
                    color: "#fff",
                    padding: "2px 4px",
                    borderRadius: "60px",
                    marginRight: "4px",
                  }}
                >
                  {firstTag.tagName}
                </span>
                {remainingCount > 0 && (
                  <span style={{ cursor: "pointer",  }}>
                    +{remainingCount}
                  </span>
                )}
              </span>
            </Tooltip>
          );
        },
     
      
        filterFn: (row, columnId, filterValue) => {
          const tags = row.original.tags.flat();
          return tags.some((tag) =>
            filterValue.some((value) =>
              tag.tagName.toLowerCase().includes(value.label.toLowerCase())
            )
          );
        },
      
        Filter: ({ column }) => (
          <Autocomplete
            multiple
            options={tagsOptions}
            onChange={(event, newValue) => {
              column.setFilterValue(newValue); // Set the filter value to the selected tags
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select Tags" variant="outlined" size="small" />
            )}
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
      }
      ,

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