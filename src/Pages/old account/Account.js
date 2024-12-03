import { useMemo, useEffect, useState } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import axios from "axios";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import "./account.css";
import { Paper, useMediaQuery, IconButton } from "@mui/material";
import { MRT_TableHeadCellFilterContainer } from "material-react-table";
import { Stack, Select, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/lab/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
const Example = () => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const renderFilterContainers = () => {
    return selectedFilters.map((selectedFilterIndex) => {
      const header = table.getLeafHeaders()[selectedFilterIndex + 1];
      return (
        <div className="MRT_TableHeadCellFilterContainer">
          <MRT_TableHeadCellFilterContainer key={header.id} header={header} table={table} in />
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => {
              setSelectedFilters((prevFilters) => prevFilters.filter((item) => item !== selectedFilterIndex));
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      );
    });
  };
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(null);

  const TeamMemberFilter = ({ column }) => {
    const columnFilterValue = column.getFilterValue();

    const uniqueTeamMembers = useMemo(() => {
      const teamMembers = new Set();
      column.getFacetedRowModel().rows.forEach((row) => {
        const members = row.getValue(column.id);
        if (Array.isArray(members)) {
          members.forEach((member) => {
            if (typeof member === "string") {
              teamMembers.add(member);
            } else if (member && member.username) {
              teamMembers.add(member.username);
            }
          });
        }
      });
      return Array.from(teamMembers);
    }, [column]);

    return (
      <Box>
        <Autocomplete
          size="small"
          options={uniqueTeamMembers}
          value={columnFilterValue || ""}
          onChange={(event, newValue) => {
            column.setFilterValue(newValue || undefined);
          }}
          renderInput={(params) => <TextField {...params} placeholder="Filter by Team Member" />}
        />
      </Box>
    );
  };

  const teamMemberFilterFn = (row, columnId, filterValue) => {
    const teamMembers = row.original.Team || [];
    return teamMembers.some((teamMember) => teamMember.username.toLowerCase().includes(filterValue.toLowerCase()));
  };

  const TypeFilter = ({ column }) => {
    const handleChange = (event) => {
      column.setFilterValue(event.target.value || undefined); // Set the filter value based on the selection
    };

    return (
      <Box>
        <Select
          size="small"
          value={column.getFilterValue() || ""}
          onChange={handleChange}
          displayEmpty
          renderInput={(params) => <TextField {...params} label="Filter by type" />}
          sx={{
            width: "150px",
          }}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="individual">Individual</MenuItem>
          <MenuItem value="company">Company</MenuItem>
        </Select>
      </Box>
    );
  };

  const typeFilterFn = (row, columnId, filterValue) => {
    const type = row.original.Type;
    return type ? type.toLowerCase() === filterValue.toLowerCase() : false;
  };

  useEffect(() => {
    console.log(selectedFilterIndex);
  }, [selectedFilterIndex]);

  const [selectedFilters, setSelectedFilters] = useState([]);
  const handleFilterChange = (event) => {
    const selectedIndex = event.target.value; // Assuming event.target.value is an index
    setSelectedFilterIndex(event.target.value);
    if (selectedIndex === null) {
      setSelectedFilterIndex(null); // Resetting selected filter index
      setSelectedFilters([]); // Resetting all selected filters
    } else {
      setSelectedFilters((prevFilters) => {
        const index = prevFilters.indexOf(selectedIndex);
        if (index === -1) {
          return [...prevFilters, selectedIndex]; // Append the selected index if not already present
        } else {
          return prevFilters.filter((item) => item !== selectedIndex); // Remove the index if already present
        }
      });
    }
    console.log(selectedFilters);
  };

  const [accountData, setAccountData] = useState([]);
  const isMobile = useMediaQuery("(max-width: 1000px)");

  const UserInitials = ({ username }) => {
    // Check if username is a string and provide a default if not
    const validUsername = typeof username === "string" ? username : "";

    return (
      <span title={validUsername}>
        {validUsername
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase()) // Convert to uppercase
          .join("")}
      </span>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${ACCOUNT_API}/accounts/account/accountdetailslist/`,
          headers: {},
        };

        const response = await axios.request(config);
        setAccountData(response.data.accountlist);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchData();
  }, []);

  //Tag FetchData ================
  const [tags, setTags] = useState([]);
  useEffect(() => {
    fetchTagData();
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

  const TagFilter = ({ column }) => {
    const columnFilterValue = column.getFilterValue() || [];

    return (
      <Box sx={{ marginBottom: 2 }}>
        <Autocomplete
          multiple
          options={tagsOptions}
          value={columnFilterValue}
          onChange={(event, newValue) => {
            column.setFilterValue(newValue);
          }}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => <TextField {...params} label="Filter by Tags" variant="outlined" />}
          renderOption={(props, option) => (
            <li {...props} style={option.customTagStyle}>
              {option.label}
            </li>
          )}
        />
      </Box>
    );
  };

  const tagFilterFn = (row, columnId, filterValue) => {
    const tags = row.original.Tags || [];
    // Check if any of the row tags match any of the filter tags
    return filterValue.length === 0 || filterValue.some((filterTag) => tags.some((tag) => tag._id === filterTag.value));
  };
  const columns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: "Name",
        header: "AccountName",

        Cell: ({ cell }) => (
          <Link to={`/accountsdash/overview/${cell.row.original.id}`} style={{ textDecoration: "none", color: "blue" }}>
            {cell.getValue()}
          </Link>
        ),
      },
      {
        accessorKey: "Follow",
        header: "Follow",
      },
      {
        accessorKey: "Type",
        header: "Type",
        size: 200,
        filterFn: typeFilterFn, // Use the custom filter function
        // Filter: TypeFilter,
        Filter: ({ column, table }) => <TypeFilter column={column} table={table} />,
        Cell: ({ cell }) => (
          <div style={{ display: "flex", marginLeft: "20px", gap: "0px" }}>
            <Badge
              badgeContent={cell.getValue()}
              color="primary"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          </div>
        ),
        // footer: "City",
      },
      {
        accessorKey: "Team",
        header: "Team Members",
        filterFn: teamMemberFilterFn,
        Filter: ({ column, table }) => <TeamMemberFilter column={column} table={table} />,
        Cell: ({ cell }) => {
          const teamMembers = Array.isArray(cell.getValue()) ? cell.getValue() : [];

          if (teamMembers.length === 0) return null;

          return (
            <div style={{ display: "flex", flexWrap: "wrap", maxWidth: "100%", gap: "15px" }}>
              {teamMembers.map((teamMember, index) => (
                <Tooltip key={index} title={teamMember.username}>
                  <Badge
                    badgeContent={<UserInitials username={teamMember.username} />}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#F4D03F",
                        color: "white",
                      },
                      marginRight: "8px",
                      marginBottom: "8px",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "Tags",
        header: "Tags",
        filterFn: tagFilterFn, // Use the custom tag filter function
        Filter: ({ column, table }) => <TagFilter column={column} table={table} />,
        Cell: ({ cell }) => {
          const tags = cell.getValue() || [];
          if (tags.length > 1) {
            const firstTag = tags[0];
            const remainingTagsCount = tags.length - 1;
            return (
              <Tooltip
                placement="top"
                arrow
                title={tags.map((tag) => (
                  <div key={tag._id}>
                    <span
                      style={{
                        backgroundColor: tag.tagColour,
                        color: "#fff",
                        borderRadius: "60px",
                        padding: "0.1rem 0.8rem",
                        fontSize: "10px",
                        display: "inline-block",
                        margin: "2px",
                      }}
                    >
                      {tag.tagName}
                    </span>
                  </div>
                ))}
              >
                <Box>
                  <span
                    style={{
                      backgroundColor: firstTag.tagColour,
                      color: "#fff",
                      borderRadius: "60px",
                      padding: "0.1rem 0.8rem",
                      fontSize: "10px",
                      display: "inline-block",
                      margin: "2px",
                      cursor: "pointer",
                    }}
                  >
                    {firstTag.tagName}
                  </span>
                  {remainingTagsCount > 0 && <Badge badgeContent={`+${remainingTagsCount}`} overlap="rectangular" anchorOrigin={{ vertical: "top", horizontal: "right" }} sx={{ ml: 1 }} />}
                </Box>
              </Tooltip>
            );
          }
          return tags.length ? (
            <span
              style={{
                backgroundColor: tags[0].tagColour,
                color: "#fff",
                borderRadius: "60px",
                padding: "0.1rem 0.8rem",
                fontSize: "10px",
                display: "inline-block",
                margin: "2px",
              }}
            >
              {tags[0].tagName}
            </span>
          ) : null;
        },
      },
      {
        accessorKey: "Invoices",
        header: "Invoices",
        // footer: "City",
      },
      {
        accessorKey: "Credits",
        header: "Credits",
        // footer: "City",
      },
      {
        accessorKey: "Tasks",
        header: "Tasks",
        // footer: "City",
      },

      {
        accessorKey: "Proposals",
        header: "Proposals",
        // footer: "City",
      },
      {
        accessorKey: "Unreadchats",
        header: "Unreadchats",
        // footer: "City",
      },
      {
        accessorKey: "Pendingorganizers",
        header: "PendingOrganizers",
        // footer: "City",
      },
      {
        accessorKey: "Pendingsignatures",
        header: "PendingSignatures",
        // footer: "City",
      },
      {
        accessorKey: "Lastlogin",
        header: "LastLogin",
        // footer: "City",
        filterVariant: "range",
      },
    ],
    [tagsOptions]
    //end
  );
  const [selectedRowIds, setSelectedRowIds] = useState({});
  const table = useMaterialReactTable({
    columns,
    data: accountData,
    enableBottomToolbar: true,
    enableStickyHeader: true,
    columnFilterDisplayMode: "custom", //we will render our own filtering UI
    enableRowSelection: true, // Enable row selection
    enablePagination: true,
    muiTableContainerProps: { sx: { maxHeight: "400px" } },

    initialState: {
      columnPinning: { left: ["mrt-row-select", "Name"] },
    },

    muiTableBodyCellProps: {
      sx: (theme) => ({
        backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[50],
      }),
    },
  });

  return (
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
  );
};
export default Example;

//   Cell: ({ cell }) => {
//     const tags = cell.getValue()[0];
//     if (tags.length > 1) {
//       const firstTag = tags[0];
//       const remainingTagsCount = tags.length - 1;
//       return (
//         <Tooltip
//           placement="top"
//           arrow
//           title={tags.map(tag => (
//             <div key={tag._id}>
//               <span style={{
//                 backgroundColor: tag.tagColour,
//                 color: "#fff",
//                 borderRadius: "60px",
//                 padding: "0.1rem 0.8rem",
//                 fontSize: "10px",
//                 display: 'inline-block',
//                 margin: '2px'
//               }}>
//                 {tag.tagName}
//               </span>
//             </div>
//           ))}
//         >
//           <Box>
//             <span style={{
//               backgroundColor: firstTag.tagColour,
//               color: "#fff",
//               borderRadius: "60px",
//               padding: "0.1rem 0.8rem",
//               fontSize: "10px",
//               display: 'inline-block',
//               margin: '2px',
//               cursor: 'pointer'
//             }}>
//               {firstTag.tagName}
//             </span>
//             {remainingTagsCount > 0 && (
//               <Badge
//                 badgeContent={`+${remainingTagsCount}`}
//                 color="#7D7C7C"
//                 overlap="rectangular"
//                 anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//                 sx={{ ml: 1 }}
//               />
//             )}
//           </Box>
//         </Tooltip>
//       );
//     }
//     return (
//       <span style={{
//         backgroundColor: tags.tagColour,
//         color: "#fff",
//         borderRadius: "60px",
//         padding: "0.1rem 0.8rem",
//         fontSize: "10px",
//         display: 'inline-block',
//         margin: '2px'
//       }}>
//         {tags.tagName}
//       </span>
//     );
//   },

// },
