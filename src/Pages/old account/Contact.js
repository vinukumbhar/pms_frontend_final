

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

import './account.css';
import {
  Stack, Paper,
  useMediaQuery, Box,
 Tooltip,
  Typography,
  Divider, Autocomplete, TextField
} from "@mui/material";
import { toast } from 'react-toastify';
import { useMaterialReactTable, MaterialReactTable } from 'material-react-table';
import DeleteIcon from '@mui/icons-material/Delete';
import { Drawer, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import IconButton from '@mui/material/IconButton';
import ContactForm from './UpdateContact'
import { MRT_TableHeadCellFilterContainer } from "material-react-table";
const ContactTable = () => {

  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;

  const [contactData, setContactData] = useState([]);
  const [uniqueTags, setUniqueTags] = useState([]);
  const [filterValue, setFilterValue] = useState(null);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${CONTACT_API}/contacts/contactlist/list/`);
      setContactData(response.data.contactlist);
      console.log(response.data.contactlist);
    } catch (error) {
      console.error('API Error:', error);
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
      setUniqueTags(Array.from(tagsSet).map(tag => JSON.parse(tag)));
      // console.log(uniqueTags);
    }
  }, [contactData]);

  const filteredData = useMemo(() => {
    if (!filterValue) return contactData;

    return contactData.filter(item => {
      if (Array.isArray(item.tags)) {
        return item.tags.some(tagArray =>
          tagArray.some(tag => tag.tagName.toLowerCase().includes(filterValue.tagName.toLowerCase()))
        );
      }
      return false;
    });
  }, [contactData, filterValue]);

  const renderFilterContainers = () => {
    return selectedFilters.map((selectedFilterIndex) => {
      const header = table.getLeafHeaders()[selectedFilterIndex + 1];
      return (
        <div className="MRT_TableHeadCellFilterContainer" key={header.id}>
          <MRT_TableHeadCellFilterContainer header={header} table={table} in />
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => {
              setSelectedFilters(prevFilters => prevFilters.filter(item => item !== selectedFilterIndex));
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
      setContactData(prevContacts => prevContacts.filter(contact => contact.id !== id));
      toast.success('Contact deleted successfully!');
    } catch (error) {
      console.error('Delete API Error:', error);
      toast.error('Failed to delete contact');
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
      setSelectedContact(data.contact)
      console.log(data.contact)
      selectedContacts()
      console.log(data.contact.tags)
      setIsDrawerOpen(true);
            // console.log(data.contact.tags)
            console.log(isDrawerOpen)



    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (selectedContact) {
      selectedContacts()
    }
  }, [selectedContact]);

  const selectedContacts = () => {
    if (selectedContact) {



    }
  }



  // Define the columns for MRT
  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      Cell: ({ row }) => (
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          onClick={() => handleClick(row.original.id)}
        >
          {row.original.name}
        </span>
      ),

    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phoneNumbers',
      header: 'Phone Number',
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
      return phoneNumbers.some(phoneObj => {
        const phone = phoneObj.phone || phoneObj;
        return phone.toString().toLowerCase().includes(filterValue.toLowerCase());
      });
    },
    // Custom filter UI for phoneNumbers
    Filter: ({ column }) => (
      <TextField
        value={column.getFilterValue() || ''}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder="Filter Phone Numbers"
        variant="outlined"
        size="small"
        sx={{
          backgroundColor: 'white',
          minWidth: 200,
        }}
      />
    ),

    },

    {
      accessorKey: 'tags',
      header: 'Tags',
      Cell: ({ cell }) => {
        const tags = cell.row.original.tags.flat();

        // Calculate the count for each tag


        if (tags.length > 1) {
          return (
            <Tooltip
              title={
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: tag.tagColour,
                        color: '#fff',
                        padding: '2px 4px',
                        margin: '2px 0',
                        borderRadius: '60px',
                      }}
                    >
                      {tag.tagName}
                    </div>
                  ))}
                </div>
              }
              arrow
              placement="top"  // Position the tooltip on top
              PopperProps={{
                style: {
                  pointerEvents: 'none',  // Disable pointer events for the tooltip to avoid blocking interactions
                },
              }}
            >
              <div>
                {tags.length > 0 && (
                  <span
                    style={{
                      backgroundColor: tags[0].tagColour,
                      color: '#fff',
                      padding: '2px 4px',
                      margin: '0 2px',
                      borderRadius: '60px',
                      cursor: 'pointer',
                    }}
                  >
                    {tags[0].tagName}
                  </span>
                )}
                {tags.length > 1 && (
                  <span style={{ marginLeft: '8px', color: 'gray' }}>
                    +{tags.length - 1} more
                  </span>
                )}
              </div>
            </Tooltip>
          );

          
        }

        return (
          <div>
            {tags.map((tag) => (
              <span
                key={tag._id}
                style={{
                  backgroundColor: tag.tagColour,
                  color: '#fff',
                  padding: '2px 4px',
                  margin: '0 2px',
                  borderRadius: '60px',
                }}
              >
                {tag.tagName}
              </span>
            ))}
            {tags.length > 1 && (
              <span style={{ marginLeft: '8px', color: 'gray' }}>
                +{tags.length - 1} more
              </span>
            )}
          </div>
        );
      },
    },

    {
      accessorKey: 'companyName',
      header: 'Company Name',
    },

    {
      id: 'actions',
      // header: 'Actions',
      Cell: ({ row }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DeleteIcon
            style={{ fontSize: "20px", cursor: 'pointer', color: 'red' }}
            onClick={() => handleDelete(row.original.id)}
          />
        </div>
      ),
    },
  ], [uniqueTags, filterValue, handleClick]);

  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    enableBottomToolbar: true,
    enableStickyHeader: true,
    columnFilterDisplayMode: 'custom', // Custom filtering UI
    enableRowSelection: true, // Enable row selection
    enablePagination: true,
    muiTableContainerProps: { sx: { maxHeight: '400px' } },
    initialState: {
      columnPinning: { left: ['mrt-row-select', 'name'] },
    },
    muiTableBodyCellProps: {
      sx: (theme) => ({
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
      }),
    },
  });
  //  edit contact


  return (
    <>


      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{ width: 600 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', ml: 1 }}>
          <Typography sx={{ fontWeight: 'bold', }} variant="h6">
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
            handleTagChange={() => { }}
            handlePhoneNumberChange={() => { }}
            handleDeletePhoneNumber={() => { }}
            handleAddPhoneNumber={() => { }}
            handleCountryChange={() => { }}
            sendingData={() => { }}
            handleClose={() => setIsDrawerOpen(false)}
            isSmallScreen={isMobile}
            onContactUpdated={handleContactUpdated}
          />
        )}


      </Drawer>

      {/* // <MaterialReactTable columns={columns} table={table} /> */}
      <Stack direction={isMobile ? "column-reverse" : "column"} gap="8px">
        <Paper style={{ display: 'flex', overflowX: 'auto' }}>
          <Stack p="8px" gap="8px" display="flex" direction="row">
            <>
             
             <Autocomplete
              options={columns.map((column, index) => ({
                label: column.header,  // Display header text
                value: index           // Store the index as the value
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
              getOptionLabel={(option) => option.label || ''}
              isOptionEqualToValue={(option, value) => option.value === value?.value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select Filter"
                  variant="outlined"
                  size="small"
                  sx={{
                    backgroundColor: 'white',
                    minWidth: 200,  // Match the minimum width of the original Select
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li
                  {...props}
                  style={{
                    fontSize: '14px',
                    padding: '5px',             // Padding for each option
                           // Spacing between options
                    cursor:'pointer'
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





 {/* <Select
                value={selectedFilterIndex}
                onChange={handleFilterChange}
                size='small'
                sx={{
                  backgroundColor: 'white',
                  minWidth: 200,
                 
                }}
              >
                <MenuItem value={null}>None</MenuItem>
                {columns.map((column, index) => (
                  <MenuItem key={index} value={index}>
                    {column.header}
                  </MenuItem>
                ))}
              </Select> */}