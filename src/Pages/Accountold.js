// import { useMemo, useEffect, useState } from "react";
// import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

// import axios from "axios";
// import Badge from "@mui/material/Badge";
// import Tooltip from "@mui/material/Tooltip";
// import "./account.css";

// import { Paper, useMediaQuery, IconButton } from "@mui/material";
// import { MRT_TableHeadCellFilterContainer } from "material-react-table";
// import { Chip, Stack, Select, MenuItem } from "@mui/material";

// import DeleteIcon from "@mui/icons-material/Delete";

// import Autocomplete from "@mui/lab/Autocomplete";
// import TextField from "@mui/material/TextField";
// import Box from "@mui/material/Box";

// import { Link } from "react-router-dom";
// const Example = () => {
//   const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
//   const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
//   const renderFilterContainers = () => {
//     return selectedFilters.map((selectedFilterIndex) => {
//       const header = table.getLeafHeaders()[selectedFilterIndex + 1];
//       return (
//         <div className="MRT_TableHeadCellFilterContainer">
//           <MRT_TableHeadCellFilterContainer key={header.id} header={header} table={table} in />
//           <IconButton
//             aria-label="delete"
//             size="small"
//             onClick={() => {
//               setSelectedFilters((prevFilters) => prevFilters.filter((item) => item !== selectedFilterIndex));
//             }}
//           >
//             <DeleteIcon fontSize="small" />
//           </IconButton>
//         </div>
//       );
//     });
//   };
//   const [selectedFilterIndex, setSelectedFilterIndex] = useState(null);

//   const TeamMemberFilter = ({ column }) => {
//     const columnFilterValue = column.getFilterValue();

//     const uniqueTeamMembers = useMemo(() => {
//       const teamMembers = new Set();
//       column.getFacetedRowModel().rows.forEach((row) => {
//         const members = row.getValue(column.id);
//         if (Array.isArray(members)) {
//           members.forEach((member) => {
//             if (typeof member === "string") {
//               teamMembers.add(member);
//             } else if (member && member.username) {
//               teamMembers.add(member.username);
//             }
//           });
//         }
//       });
//       return Array.from(teamMembers);
//     }, [column]);

//     return (
//       <Box>
//         <Autocomplete
//           size="small"
//           options={uniqueTeamMembers}
//           value={columnFilterValue || ""}
//           onChange={(event, newValue) => {
//             column.setFilterValue(newValue || undefined);
//           }}
//           renderInput={(params) => <TextField {...params} placeholder="Filter by Team Member" />}
//         />
//       </Box>
//     );
//   };

//   const teamMemberFilterFn = (row, columnId, filterValue) => {
//     const teamMembers = row.original.Team || [];
//     return teamMembers.some((teamMember) => teamMember.username.toLowerCase().includes(filterValue.toLowerCase()));
//   };

//   const TypeFilter = ({ column }) => {
//     const handleChange = (event) => {
//       column.setFilterValue(event.target.value || undefined); // Set the filter value based on the selection
//     };

//     return (
//       <Box>
//         <Select
//           size="small"
//           value={column.getFilterValue() || ""}
//           onChange={handleChange}
//           displayEmpty
//           renderInput={(params) => <TextField {...params} label="Filter by type" />}
//           sx={{
//             width: "150px",
//           }}
//         >
//           <MenuItem value="">None</MenuItem>
//           <MenuItem value="individual">Individual</MenuItem>
//           <MenuItem value="company">Company</MenuItem>
//         </Select>
//       </Box>
//     );
//   };

//   const typeFilterFn = (row, columnId, filterValue) => {
//     const type = row.original.Type;
//     return type ? type.toLowerCase() === filterValue.toLowerCase() : false;
//   };

//   useEffect(() => {
//     console.log(selectedFilterIndex);
//   }, [selectedFilterIndex]);

//   const [selectedFilters, setSelectedFilters] = useState([]);
//   const handleFilterChange = (event) => {
//     const selectedIndex = event.target.value; // Assuming event.target.value is an index
//     setSelectedFilterIndex(event.target.value);
//     if (selectedIndex === null) {
//       setSelectedFilterIndex(null); // Resetting selected filter index
//       setSelectedFilters([]); // Resetting all selected filters
//     } else {
//       setSelectedFilters((prevFilters) => {
//         const index = prevFilters.indexOf(selectedIndex);
//         if (index === -1) {
//           return [...prevFilters, selectedIndex]; // Append the selected index if not already present
//         } else {
//           return prevFilters.filter((item) => item !== selectedIndex); // Remove the index if already present
//         }
//       });
//     }
//     console.log(selectedFilters);
//   };

//   const [accountData, setAccountData] = useState([]);
//   const isMobile = useMediaQuery("(max-width: 1000px)");

//   const UserInitials = ({ username }) => {
//     // Check if username is a string and provide a default if not
//     const validUsername = typeof username === "string" ? username : "";

//     return (
//       <span title={validUsername}>
//         {validUsername
//           .split(" ")
//           .map((word) => word.charAt(0).toUpperCase()) // Convert to uppercase
//           .join("")}
//       </span>
//     );
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const config = {
//           method: "get",
//           maxBodyLength: Infinity,
//           url: `${ACCOUNT_API}/accounts/account/accountdetailslist/`,
//           headers: {},
//         };
//         const response = await axios.request(config);
//         setAccountData(response.data.accountlist);
//       } catch (error) {
//         console.log("Error:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   //Tag FetchData ================
// const [tags, setTags] = useState([]);
// useEffect(() => {
//   fetchTagData();
// }, []);

// const fetchTagData = async () => {
//   try {
//     const url = `${TAGS_API}/tags/`;

//     const response = await fetch(url);
//     const data = await response.json();
//     setTags(data.tags);
//     console.log(data.tags);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };
// //  for tags
// const calculateWidth = (tagName) => {
//   const baseWidth = 10; // base width for each tag
//   const charWidth = 8; // approximate width of each character
//   const padding = 10; // padding on either side
//   return baseWidth + charWidth * tagName.length + padding;
// };

// const tagsOptions = tags.map((tag) => ({
//   value: tag._id,
//   label: tag.tagName,
//   colour: tag.tagColour,

//   customStyle: {
//     backgroundColor: tag.tagColour,
//     color: "#fff",
//     borderRadius: "8px",
//     alignItems: "center",
//     textAlign: "center",
//     marginBottom: "5px",
//     padding: "2px,8px",
//     fontSize: "10px",
//     width: `${calculateWidth(tag.tagName)}px`,
//     margin: "7px",
//   },
//   customTagStyle: {
//     backgroundColor: tag.tagColour,
//     color: "#fff",
//     alignItems: "center",
//     textAlign: "center",
//     padding: "2px,8px",
//     fontSize: "10px",
//     borderRadius: "8px",
//     width: `${calculateWidth(tag.tagName)}px`,
//     cursor: "pointer",
//     margin: "7px",
//   },
//   customInputTagStyle: {
//     backgroundColor: tag.tagColour,
//     color: "#fff",
//     alignItems: "center",
//     textAlign: "center",
//     padding: "2px,8px",
//     fontSize: "10px",
//     cursor: "pointer",
//     margin: "7px",
//   },
// }));

//   const TagFilter = ({ column }) => {
//     const columnFilterValue = column.getFilterValue() || [];

//     return (
//       <Box sx={{ marginBottom: 2 }}>
//         <Autocomplete
//           multiple
//           options={tagsOptions}
//           value={columnFilterValue}
//           onChange={(event, newValue) => {
//             column.setFilterValue(newValue);
//           }}
//           getOptionLabel={(option) => option.label}
//           isOptionEqualToValue={(option, value) => option.value === value.value}
//           renderInput={(params) => <TextField {...params} label="Filter by Tags" variant="outlined" />}
//           renderTags={(selected, getTagProps) => selected.map((option, index) => <Chip key={option.value} label={option.label} style={option.customInputTagStyle} {...getTagProps({ index })} />)}
//           renderOption={(props, option) => (
//             <li {...props} style={option.customTagStyle}>
//               {option.label}
//             </li>
//           )}
//         />
//       </Box>
//     );
//   };

//   const tagFilterFn = (row, columnId, filterValue) => {
//     const tags = row.original.Tags || [];
//     // Check if any of the row tags match any of the filter tags
//     return filterValue.length === 0 || filterValue.some((filterTag) => tags.some((tag) => tag._id === filterTag.value));
//   };

//   const columns = useMemo(
//     //column definitions...
//     () => [
//       {
//         accessorKey: "Name",
//         header: "AccountName",

//         Cell: ({ cell }) => (
//           <Link to={`/accountsdash/overview/${cell.row.original.id}`} style={{ textDecoration: "none", color: "blue" }}>
//             {cell.getValue()}
//           </Link>
//         ),
//       },
//       {
//         accessorKey: "Follow",
//         header: "Follow",
//       },
//       {
//         accessorKey: "Type",
//         header: "Type",
//         size: 200,
//         filterFn: typeFilterFn, // Use the custom filter function
//         // Filter: TypeFilter,
//         Filter: ({ column, table }) => <TypeFilter column={column} table={table} />,
//         Cell: ({ cell }) => (
//           <div style={{ display: "flex", marginLeft: "20px", gap: "0px" }}>
//             <Badge
//               badgeContent={cell.getValue()}
//               color="primary"
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             />
//           </div>
//         ),
//         // footer: "City",
//       },
//       {
//         accessorKey: "Team",
//         header: "Team Members",
//         filterFn: teamMemberFilterFn,
//         Filter: ({ column, table }) => <TeamMemberFilter column={column} table={table} />,
//         Cell: ({ cell }) => {
//           const teamMembers = Array.isArray(cell.getValue()) ? cell.getValue() : [];

//           if (teamMembers.length === 0) return null;

//           return (
//             <div style={{ display: "flex", flexWrap: "wrap", maxWidth: "100%", gap: "15px" }}>
//               {teamMembers.map((teamMember, index) => (
//                 <Tooltip key={index} title={teamMember.username}>
//                   <Badge
//                     badgeContent={<UserInitials username={teamMember.username} />}
//                     color="primary"
//                     sx={{
//                       "& .MuiBadge-badge": {
//                         backgroundColor: "#F4D03F",
//                         color: "white",
//                       },
//                       marginRight: "8px",
//                       marginBottom: "8px",
//                       cursor: "pointer",
//                     }}
//                   />
//                 </Tooltip>
//               ))}
//             </div>
//           );
//         },
//       },

//       {
//         accessorKey: "Tags",
//         header: "Tags",
// filterFn: tagFilterFn, // Use the custom tag filter function
// Filter: ({ column, table }) => <TagFilter column={column} table={table} />,

//         // Cell: ({ cell }) => {
//         //   const tags = cell.getValue()[0];
//         //   if (tags.length > 1) {
//         //     const firstTag = tags[0];
//         //     const remainingTagsCount = tags.length - 1;
//         //     return (
//         //       <Tooltip
//         //         placement="top"
//         //         arrow
//         //         title={tags.map(tag => (
//         //           <div key={tag._id}>
//         //             <span style={{
//         //               backgroundColor: tag.tagColour,
//         //               color: "#fff",
//         //               borderRadius: "60px",
//         //               padding: "0.1rem 0.8rem",
//         //               fontSize: "10px",
//         //               display: 'inline-block',
//         //               margin: '2px'
//         //             }}>
//         //               {tag.tagName}
//         //             </span>
//         //           </div>
//         //         ))}
//         //       >
//         //         <Box>
//         //           <span style={{
//         //             backgroundColor: firstTag.tagColour,
//         //             color: "#fff",
//         //             borderRadius: "60px",
//         //             padding: "0.1rem 0.8rem",
//         //             fontSize: "10px",
//         //             display: 'inline-block',
//         //             margin: '2px',
//         //             cursor: 'pointer'
//         //           }}>
//         //             {firstTag.tagName}
//         //           </span>
//         //           {remainingTagsCount > 0 && (
//         //             <Badge
//         //               badgeContent={`+${remainingTagsCount}`}
//         //               color="#7D7C7C"
//         //               overlap="rectangular"
//         //               anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//         //               sx={{ ml: 1 }}
//         //             />
//         //           )}
//         //         </Box>
//         //       </Tooltip>
//         //     );
//         //   }
//         //   return (
//         //     <span style={{
//         //       backgroundColor: tags.tagColour,
//         //       color: "#fff",
//         //       borderRadius: "60px",
//         //       padding: "0.1rem 0.8rem",
//         //       fontSize: "10px",
//         //       display: 'inline-block',
//         //       margin: '2px'
//         //     }}>
//         //       {tags.tagName}
//         //     </span>
//         //   );
//         // },

//         Cell: ({ cell }) => {
//           const tags = cell.getValue();

//           // Check if tags is an array and has at least one item
//           if (Array.isArray(tags) && tags.length > 0) {
//             if (tags.length > 1) {
//               const firstTag = tags[0];
//               const remainingTagsCount = tags.length - 1;
//               return (
//                 <Tooltip
//                   placement="top"
//                   arrow
//                   title={tags.map((tag) => (
//                     <div key={tag._id}>
//                       <span
//                         style={{
//                           backgroundColor: tag.tagColour,
//                           color: "#fff",
//                           borderRadius: "60px",
//                           padding: "0.1rem 0.8rem",
//                           fontSize: "10px",
//                           display: "inline-block",
//                           margin: "2px",
//                         }}
//                       >
//                         {tag.tagName}
//                       </span>
//                     </div>
//                   ))}
//                 >
//                   <Box>
//                     <span
//                       style={{
//                         backgroundColor: firstTag.tagColour,
//                         color: "#fff",
//                         borderRadius: "60px",
//                         padding: "0.1rem 0.8rem",
//                         fontSize: "10px",
//                         display: "inline-block",
//                         margin: "2px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       {firstTag.tagName}
//                     </span>
//                     {remainingTagsCount > 0 && <Badge badgeContent={`+${remainingTagsCount}`} color="#7D7C7C" overlap="rectangular" anchorOrigin={{ vertical: "top", horizontal: "right" }} sx={{ ml: 1 }} />}
//                   </Box>
//                 </Tooltip>
//               );
//             }
//             // If there's only one tag, render it directly
//             return (
//               <span
//                 style={{
//                   backgroundColor: tags[0].tagColour,
//                   color: "#fff",
//                   borderRadius: "60px",
//                   padding: "0.1rem 0.8rem",
//                   fontSize: "10px",
//                   display: "inline-block",
//                   margin: "2px",
//                 }}
//               >
//                 {tags[0].tagName}
//               </span>
//             );
//           }

//           // If tags is not an array or is empty, you may want to return something else
//           return <span>No Tags</span>; // Or handle it however you'd like
//         },
//       },
//       {
//         accessorKey: "Invoices",
//         header: "Invoices",
//         // footer: "City",
//       },
//       {
//         accessorKey: "Credits",
//         header: "Credits",
//         // footer: "City",
//       },
//       {
//         accessorKey: "Tasks",
//         header: "Tasks",
//         // footer: "City",
//       },

//       {
//         accessorKey: "Proposals",
//         header: "Proposals",
//         // footer: "City",
//       },
//       {
//         accessorKey: "Unreadchats",
//         header: "Unreadchats",
//         // footer: "City",
//       },
//       {
//         accessorKey: "Pendingorganizers",
//         header: "PendingOrganizers",
//         // footer: "City",
//       },
//       {
//         accessorKey: "Pendingsignatures",
//         header: "PendingSignatures",
//         // footer: "City",
//       },
//       {
//         accessorKey: "Lastlogin",
//         header: "LastLogin",
//         // footer: "City",
//         filterVariant: "range",
//       },
//     ],
//     [tagsOptions]
//     //end
//   );

//   const table = useMaterialReactTable({
//     columns,
//     data: accountData,
//     enableBottomToolbar: true,
//     enableStickyHeader: true,
//     columnFilterDisplayMode: "custom", //we will render our own filtering UI
//     enableRowSelection: true, // Enable row selection
//     enablePagination: true,
//     muiTableContainerProps: { sx: { maxHeight: "400px" } },
//     initialState: {
//       columnPinning: { left: ["mrt-row-select", "Name"] },
//     },

//     muiTableBodyCellProps: {
//       sx: (theme) => ({
//         backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[50],
//       }),
//     },
//   });

//   return (
//     <Stack direction={isMobile ? "column-reverse" : "column"} gap="8px">
//       <Paper style={{ display: "flex", overflowX: "auto" }}>
//         <Stack p="8px" gap="8px" display="flex" direction="row">
//           <>
//             {/* <Select
//               value={selectedFilterIndex}
//               onChange={handleFilterChange}
//               size='small'
//               sx={{
//                 backgroundColor: 'white',
//                 minWidth: 200, // Minimum width for the select box

//               }}
//             >
//               <MenuItem value={null}>None</MenuItem>
//               {columns.map((column, index) => (
//                 <MenuItem key={index} value={index}>
//                   {column.header}
//                 </MenuItem>
//               ))}
//             </Select> */}

//             <Autocomplete
//               options={columns.map((column, index) => ({
//                 label: column.header, // Display header text
//                 value: index, // Store the index as the value
//               }))}
//               value={columns[selectedFilterIndex] ? { label: columns[selectedFilterIndex].header, value: selectedFilterIndex } : null}
//               onChange={(event, newValue) => {
//                 if (newValue) {
//                   setSelectedFilterIndex(newValue.value);
//                   handleFilterChange({ target: { value: newValue.value } });
//                 } else {
//                   setSelectedFilterIndex(null);
//                   handleFilterChange({ target: { value: null } });
//                 }
//               }}
//               getOptionLabel={(option) => option.label || ""}
//               isOptionEqualToValue={(option, value) => option.value === value?.value}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   placeholder="Select Filter"
//                   variant="outlined"
//                   size="small"
//                   sx={{
//                     backgroundColor: "white",
//                     minWidth: 200, // Match the minimum width of the original Select
//                   }}
//                 />
//               )}
//               renderOption={(props, option) => (
//                 <li
//                   {...props}
//                   style={{
//                     fontSize: "14px",
//                     padding: "5px", // Padding for each option
//                     // Spacing between options
//                     cursor: "pointer",
//                   }}
//                 >
//                   {option.label}
//                 </li>
//               )}
//             />

//             <Stack direction="row" gap="8px">
//               {renderFilterContainers()}
//             </Stack>
//           </>
//         </Stack>
//       </Paper>
//       <MaterialReactTable columns={columns} table={table} />
//     </Stack>
//   );
// };

// export default Example;

import React, { useEffect, useState } from "react";
import { TablePagination, Chip, Tooltip, Autocomplete, OutlinedInput, MenuItem as MuiMenuItem, FormControl, InputLabel, Menu, Button, IconButton, Select, MenuItem, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper } from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
const FixedColumnTable = () => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [accountData, setAccountData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "Name", direction: "asc" });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // 5 rows per page
  const [filters, setFilters] = useState({
    accountName: "",
    type: "",
    teamMember: "",
    tags: [],
  });
  const [showFilters, setShowFilters] = useState({
    accountName: false,
    type: false,
    teamMember: false,
    tags: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${ACCOUNT_API}/accounts/account/accountdetailslist/`);
        setAccountData(response.data.accountlist);
        console.log(response.data.accountlist);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchData();
  }, [ACCOUNT_API]);

  const handleSelect = (id) => {
    const currentIndex = selected.indexOf(id);
    const newSelected = currentIndex === -1 ? [...selected, id] : selected.filter((item) => item !== id);
    setSelected(newSelected);
    // Log all selected row IDs
    console.log("Selected IDs:", newSelected); // Log all selected IDs
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value })); // Update filter without clearing others
    setPage(0);
  };

  const filteredData = accountData.filter((row) => {
    const accountNameMatch = row.Name.toLowerCase().includes(filters.accountName.toLowerCase());
    const typeMatch = filters.type ? row.Type.toLowerCase() === filters.type.toLowerCase() : true;
    const teamMemberMatch = filters.teamMember ? row.Team.some((member) => member.username === filters.teamMember) : true;
    // const tagMatch = filters.tags.length ? filters.tags.every((tag) => row.Tags.some((rowTag) => rowTag.tagName === tag)) : true;
    // const tagMatch = filters.tags.length ? filters.tags.some((tag) => row.Tags.some((rowTag) => rowTag.tagName === tag.tagName && rowTag.tagColour === tag.tagColour)) : true;
    const tagMatch = filters.tags.length ? row.Tags && Array.isArray(row.Tags) && filters.tags.some((tag) => row.Tags.some((rowTag) => rowTag.tagName === tag.tagName && rowTag.tagColour === tag.tagColour)) : true;
    return accountNameMatch && typeMatch && teamMemberMatch && tagMatch;
  });
  const handleFilterButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const clearFilter = (filterField) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterField]: "" })); // Clear the specific filter
    setShowFilters((prev) => ({
      ...prev,
      [filterField]: false, // Hide the filter input
    }));
  };

  const toggleFilter = (filterType) => {
    setShowFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };
  const handleMultiSelectChange = (name, values) => {
    setFilters((prevFilters) => ({ ...prevFilters, [name]: values }));
  };
  const teamMemberOptions = Array.from(new Set(accountData.flatMap((row) => row.Team.map((member) => member.username))));
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchTagData();
  }, []);

  const fetchTagData = async () => {
    try {
      const response = await fetch(`${TAGS_API}/tags/`);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const uniqueTags =
    tags.length > 0
      ? Array.from(new Set(tags.map((tag) => `${tag.tagName}-${tag.tagColour}`))).map((tagKey) => {
          const [tagName, tagColour] = tagKey.split("-");
          return { tagName, tagColour };
        })
      : [];
  const calculateWidth = (tagName) => {
    const baseWidth = 10; // base width for each tag
    const charWidth = 8; // approximate width of each character
    const padding = 10; // padding on either side
    return baseWidth + charWidth * tagName.length + padding;
  };
  const handleSort = (key) => {
    setSortConfig((prevSortConfig) => {
      if (prevSortConfig.key === key) {
        return { key, direction: prevSortConfig.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedData = React.useMemo(() => {
    const dataToSort = filteredData; // Use filteredData for sorting
    const sorted = [...dataToSort]; // Create a copy of filteredData

    if (sortConfig.key) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sortConfig]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <>
      <div style={{ display: "flex", padding: "10px", marginBottom: "20px" }}>
        <Button variant="text" onClick={handleFilterButtonClick} style={{ marginRight: "10px" }}>
          Filter Options
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem
            onClick={() => {
              toggleFilter("accountName");
              handleClose();
            }}
          >
            Account Name
          </MenuItem>
          <MenuItem
            onClick={() => {
              toggleFilter("type");
              handleClose();
            }}
          >
            Type
          </MenuItem>
          <MenuItem
            onClick={() => {
              toggleFilter("teamMember");
              handleClose();
            }}
          >
            Team Member
          </MenuItem>
          <MenuItem
            onClick={() => {
              toggleFilter("tags");
              handleClose();
            }}
          >
            Tags
          </MenuItem>
        </Menu>

        {/* Account Name Filter */}
        {showFilters.accountName && (
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <TextField name="accountName" value={filters.accountName} onChange={handleFilterChange} placeholder="Filter by Account Name" variant="outlined" size="small" style={{ marginRight: "10px" }} />
            <DeleteIcon onClick={() => clearFilter("accountName")} style={{ cursor: "pointer", color: "red" }} />
          </div>
        )}

        {/* Type Filter */}
        {showFilters.type && (
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <FormControl variant="outlined" size="small" style={{ marginRight: "10px", width: "150px" }}>
              <InputLabel>Type</InputLabel>
              <Select name="type" value={filters.type} onChange={handleFilterChange} label="Type">
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Individual">Individual</MenuItem>
                <MenuItem value="Company">Company</MenuItem>
              </Select>
            </FormControl>
            <DeleteIcon onClick={() => clearFilter("type")} style={{ cursor: "pointer", color: "red" }} />
          </div>
        )}
        {/* Team Member Filter */}
        {showFilters.teamMember && (
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <FormControl variant="outlined" size="small" style={{ marginRight: "10px", width: "150px" }}>
              <InputLabel>Team Member</InputLabel>
              <Select name="teamMember" value={filters.teamMember} onChange={handleFilterChange} label="Team Member">
                <MenuItem value="">All</MenuItem>
                {teamMemberOptions.map((member) => (
                  <MenuItem key={member} value={member}>
                    {member}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DeleteIcon onClick={() => clearFilter("teamMember")} style={{ cursor: "pointer", color: "red" }} />
          </div>
        )}
        {/* Tags Filter */}
        {showFilters.tags && (
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <Autocomplete
              multiple
              options={uniqueTags}
              value={filters.tags || []}
              onChange={(e, newValue) => handleMultiSelectChange("tags", newValue)}
              getOptionLabel={(option) => option.tagName}
              filterSelectedOptions
              renderOption={(props, option) => (
                <li
                  {...props}
                  style={{
                    backgroundColor: option.tagColour,
                    color: "#fff",
                    padding: "2px 8px",
                    borderRadius: "8px",
                    textAlign: "center",
                    marginBottom: "5px",
                    fontSize: "10px",
                    width: `${calculateWidth(option.tagName)}px`,
                    marginLeft: "5px",
                    cursor: "pointer",
                  }}
                >
                  {option.tagName}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    key={option.value}
                    label={option.tagName}
                    style={{
                      backgroundColor: option.tagColour,
                      color: "#fff",
                      cursor: "pointer",
                      // borderRadius: "8px",
                      fontSize: "12px",
                      margin: "2px",
                    }}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Filter by Tags" size="small" style={{ width: "250px" }} />}
              style={{ marginRight: "10px", width: "250px" }}
            />
            <DeleteIcon onClick={() => clearFilter("tags")} style={{ cursor: "pointer", color: "red" }} />
          </div>
        )}
      </div>
      <TableContainer component={Paper} style={{ width: "100%", overflowX: "auto" }}>
        <Table style={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" style={{ position: "sticky", left: 0, zIndex: 1, background: "#fff" }}>
                <Checkbox
                  checked={selected.length === accountData.length}
                  onChange={() => {
                    if (selected.length === accountData.length) {
                      setSelected([]);
                    } else {
                      const allSelected = accountData.map((item) => item.id);
                      setSelected(allSelected);
                    }
                  }}
                />
              </TableCell>
              <TableCell onClick={() => handleSort("Name")} style={{ cursor: "pointer", position: "sticky", left: 50, zIndex: 1, background: "#fff" }} width="200">
                AccountName {sortConfig.key === "Name" ? (sortConfig.direction === "asc" ? "↑" : "↓") : null}
              </TableCell>
              <TableCell width="200">Type</TableCell>
              <TableCell width="200">Follow</TableCell>
              <TableCell width="200" height="60">
                Team Members
              </TableCell>
              <TableCell width="200">Tags</TableCell>
              <TableCell width="200">Invoices</TableCell>
              <TableCell width="200">Credits</TableCell>
              <TableCell width="200">Tasks</TableCell>
              <TableCell width="200">Proposals</TableCell>
              <TableCell width="200">Unreadchchats</TableCell>
              <TableCell width="200">Pending Organizers</TableCell>
              <TableCell width="200">Pending Signatures</TableCell>
              <TableCell width="200">Last Login</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => {
              const isSelected = selected.indexOf(row.id) !== -1;
              return (
                <TableRow key={row.id} hover onClick={() => handleSelect(row.id)} role="checkbox" tabIndex={-1} selected={isSelected}>
                  <TableCell padding="checkbox" style={{ position: "sticky", left: 0, zIndex: 1, background: "#fff" }}>
                    <Checkbox checked={isSelected} />
                  </TableCell>
                  <TableCell style={{ position: "sticky", left: 50, zIndex: 1, background: "#fff" }}>
                    <Link to={`/accountsdash/overview/${row.id}`}> {row.Name}</Link>
                  </TableCell>
                  <TableCell>{row.Type}</TableCell>
                  <TableCell>{row.Follow}</TableCell>
                  <TableCell style={{ display: "flex", alignItems: "center" }} height="40">
                    {row.Team.map((member) => {
                      // Generate initials from the username
                      const initials = member.username
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase();

                      return (
                        <Tooltip key={member._id} title={member.username} placement="top">
                          <span
                            style={{
                              display: "inline-block",
                              backgroundColor: "#3f51b5", // Customize badge color as needed
                              color: "#fff",
                              borderRadius: "50%",
                              width: "20px",
                              height: "20px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: "bold",
                              marginRight: "5px",
                              cursor: "pointer",
                            }}
                          >
                            {initials}
                          </span>
                        </Tooltip>
                      );
                    })}
                  </TableCell>
                  {/* <TableCell>
                    {row.Tags &&
                      row.Tags.map((tag) => (
                        <span
                          key={tag.tagName}
                          style={{
                            backgroundColor: tag.tagColour,
                            color: "#fff",
                            padding: "2px 8px",
                            borderRadius: "8px",
                            marginRight: "5px",
                            fontSize: "12px",
                          }}
                        >
                          {tag.tagName}
                        </span>
                      ))}
                  </TableCell> */}
                  {/* <TableCell>
                    {row.Tags.length > 1 ? (
                      <Tooltip
                        title={
                          <div>
                            {row.Tags.map((tag) => (
                              <div
                                key={tag._id}
                                style={{
                                  background: tag.tagColour,
                                  color: "#fff",
                                  borderRadius: "8px",
                                  padding: "2px 8px",
                                  marginBottom: "2px",
                                  fontSize: "10px",
                                }}
                              >
                                {tag.tagName}
                              </div>
                            ))}
                          </div>
                        }
                        placement="top"
                      >
                        <span
                          style={{
                            background: row.Tags[0].tagColour, // Show color of the first tag
                            color: "#fff",
                            borderRadius: "8px",
                            padding: "2px 8px",
                            fontSize: "10px",
                            cursor: "pointer",
                          }}
                        >
                          {row.Tags[0].tagName}
                        </span>
                      </Tooltip>
                    ) : (
                      row.Tags.map((tag) => (
                        <span
                          key={tag._id}
                          style={{
                            background: tag.tagColour,
                            color: "#fff",
                            borderRadius: "8px",
                            padding: "2px 8px",
                            fontSize: "10px",
                            marginLeft: "3px",
                          }}
                        >
                          {tag.tagName}
                        </span>
                      ))
                    )}
                    {row.Tags.length > 1 && <span style={{ marginLeft: "5px", fontSize: "10px", color: "#555" }}>+{row.Tags.length - 1}</span>}
                  </TableCell> */}
                  <TableCell>
                    {Array.isArray(row.Tags) && row.Tags.length > 0 ? (
                      row.Tags.length > 1 ? (
                        <Tooltip
                          title={
                            <div>
                              {row.Tags.map((tag) => (
                                <div
                                  key={tag._id}
                                  style={{
                                    background: tag.tagColour,
                                    color: "#fff",
                                    borderRadius: "8px",
                                    padding: "2px 8px",
                                    marginBottom: "2px",
                                    fontSize: "10px",
                                  }}
                                >
                                  {tag.tagName}
                                </div>
                              ))}
                            </div>
                          }
                          placement="top"
                        >
                          <span
                            style={{
                              background: row.Tags[0].tagColour, // Show color of the first tag
                              color: "#fff",
                              borderRadius: "8px",
                              padding: "2px 8px",
                              fontSize: "10px",
                              cursor: "pointer",
                            }}
                          >
                            {row.Tags[0].tagName}
                          </span>
                        </Tooltip>
                      ) : (
                        row.Tags.map((tag) => (
                          <span
                            key={tag._id}
                            style={{
                              background: tag.tagColour,
                              color: "#fff",
                              borderRadius: "8px",
                              padding: "2px 8px",
                              fontSize: "10px",
                              marginLeft: "3px",
                            }}
                          >
                            {tag.tagName}
                          </span>
                        ))
                      )
                    ) : null}
                    {Array.isArray(row.Tags) && row.Tags.length > 1 && <span style={{ marginLeft: "5px", fontSize: "10px", color: "#555" }}>+{row.Tags.length - 1}</span>}
                  </TableCell>

                  <TableCell>{row.Invoices}</TableCell>
                  <TableCell>{row.Credits}</TableCell>
                  <TableCell>{row.Tasks}</TableCell>
                  <TableCell>{row.Proposals}</TableCell>
                  <TableCell>{row.Unreadchats}</TableCell>
                  <TableCell>{row.Pendingorganizers}</TableCell>
                  <TableCell>{row.Pendingsignatures}</TableCell>
                  <TableCell>{row.Lastlogin}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination rowsPerPageOptions={[5, 10, 15]} component="div" count={sortedData.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
    </>
  );
};

export default FixedColumnTable;

{
  /* <TableCell>
{row.tags.length > 1 ? (
  <Tooltip
    title={
      <div>
        {row.tags.map((tag) => (
          <div
            key={tag._id}
            style={{
              background: tag.tagColour,
              color: "#fff",
              borderRadius: "8px",
              padding: "2px 8px",
              marginBottom: "2px",
              fontSize: "10px",
            }}
          >
            {tag.tagName}
          </div>
        ))}
      </div>
    }
    placement="top"
  >
    <span
      style={{
        background: row.tags[0].tagColour, // Show color of the first tag
        color: "#fff",
        borderRadius: "8px",
        padding: "2px 8px",
        fontSize: "10px",
        cursor: "pointer",
      }}
    >
      {row.tags[0].tagName}
    </span>
  </Tooltip>
) : (
  row.tags.map((tag) => (
    <span
      key={tag._id}
      style={{
        background: tag.tagColour,
        color: "#fff",
        borderRadius: "8px",
        padding: "2px 8px",
        fontSize: "10px",
        marginLeft: "3px",
      }}
    >
      {tag.tagName}
    </span>
  ))
)}
{row.tags.length > 1 && <span style={{ marginLeft: "5px", fontSize: "10px", color: "#555" }}>+{row.tags.length - 1}</span>}
</TableCell> */
}
