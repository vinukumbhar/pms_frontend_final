import { Box, FormControlLabel, Button, Autocomplete, InputLabel, TextField,IconButton, Divider,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import { useTheme, useMediaQuery, Typography } from '@mui/material';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { RxCross2 } from "react-icons/rx";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import {MaterialReactTable,useMaterialReactTable} from 'material-react-table';
import { CiMenuKebab } from "react-icons/ci";




const Service = () => {

    const SERVICE_API = process.env.REACT_APP_SERVICES_URL;
    const CATEGORY_API = process.env.REACT_APP_CATEGORY_URL;
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
    const [servicename, setservicename] = useState("");
    const [discription, setdiscription] = useState("");
    const [rate, setrate] = useState("$ 0.00")

    const [service, setService] = useState(false)
    const [categorycreate, setcategorycreate] = useState();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const handleRateChange = (e) => {
        // Remove the dollar sign and any non-numeric characters, and keep the input as a number
        const value = e.target.value.replace(/[^0-9.]/g, '');
        
        // Update the rate, ensuring it includes the $ symbol
        setrate(`$ ${value}`);
      };
    const handleCategoryChange = (event, newValue) => {
        setSelectedCategory(newValue);
    };
    const handleServiceWitch = (checked) => {
        setService(checked)
    }

    const handleNewDrawerClose = () => {
        setIsNewDrawerOpen(false);
    };


    //category right side form
    const [isCategoryFormOpen, setCategoryFormOpen] = useState(false);
    const handleCategoryFormClose = () => {
        setCategoryFormOpen(false);
    };

    const options = [
        // { label: "Select Rate Type", value: "" },
        { label: "Item", value: "item" },
        { label: "Hour", value: "hour" },
    ];
    const [selectedOption, setSelectedOption] = useState('');

    const handleRateTypeChange = (event, newValue) => {
        setSelectedOption(newValue);
        console.log('Selected rate type:', newValue);
    };
    // category create

    const [categoryData, setCategoryData] = useState([]);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // const url = `${API_KEY}/common/user/`;
            const url = `${CATEGORY_API}/workflow/category/categorys`;
            const response = await fetch(url);
            const data = await response.json();
            console.log(data)
            setCategoryData(data.category);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const categoryoptions = categoryData.map((category) => ({
        value: category._id,
        label: category.categoryName,
    }));
    const createCategory = () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            categoryName: categorycreate
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        const url = `${CATEGORY_API}/workflow/category/newcategory`;
        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result)
                if (result && result.message === "Category created successfully") {
                    toast.success("Category created successfully");
                    handleCategoryFormClose(false);
                    fetchData();
                    setcategorycreate();
                } else {
                    toast.error(result.message || "Failed to create Service Template");
                }
            })
            .catch((error) => console.error(error));

    }


    const createservicetemp = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const raw = JSON.stringify({
          serviceName: servicename,
          description: discription,
          rate: rate,
          ratetype: selectedOption.value,
          tax: service,
          
          category: selectedCategory ? selectedCategory.value : null,
          active: "true"
    
        });
        console.log(raw)
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };
        const url =`${SERVICE_API}/workflow/services/servicetemplate`;
        fetch(url, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result.message)
    
            if (result && result.message === "ServiceTemplate created successfully") {
              toast.success("ServiceTemplate created successfully");
              handleNewDrawerClose();
              fetchServicesData();
              // Clear form fields
              setservicename("");
              setdiscription("");
              setrate("");
              setSelectedOption("");
              setService(false);
              setSelectedCategory(null);
          
    
            } else {
              toast.error(result.message || "Failed to create Service Template");
            }
          })
          .catch((error) => {
            console.log(error)
            const errorMessage = error.response && error.response.message ? error.response.message : "Failed to create invoice";
            toast.error(errorMessage);
          });
      }

    //   service template fetch
    const [ServiceTemplates, setServiceTemplates] = useState([]);
    useEffect(() => {
        fetchServicesData()
      })
    
      const fetchServicesData = async () => {
        try {
          const url = `${SERVICE_API}/workflow/services/servicetemplate` ;
    
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Failed to fetch service templates");
          }
          const data = await response.json();
          setServiceTemplates(data.serviceTemplate);
         
        } catch (error) {
          console.error("Error fetching service templates:", error);
        }
      };
      const [tempIdget, setTempIdGet] = useState("");
      const [openMenuId, setOpenMenuId] = useState(null);
      const toggleMenu = (_id) => {
        setOpenMenuId(openMenuId === _id ? null : _id);
        setTempIdGet(_id);
      };
      const handleEdit = (_id) => {

        navigate("/servicesUpdate/" + _id);
      };
      //delete template
    //   const handleDelete = (_id) => {
    //     const requestOptions = {
    //         method: "DELETE",
    //         redirect: "follow",
    //       };
    //       const url = `${SERVICE_API}/workflow/services/servicetemplate/` ;
    //       fetch(url + _id, requestOptions)
    //         .then((response) => {
    //           if (!response.ok) {
    //             throw new Error("Failed to delete item");
    //           }
    //           return response.json();
    //         })
    //         .then((result) => {
    //           console.log(result);
    //           toast.success("Item deleted successfully");
    //           fetchServicesData()
    //         })
    //         .catch((error) => {
    //           console.error(error);
    //           toast.error("Failed to delete item");
    //         })
    
    //   };
    const handleDelete = (_id) => {
        // Show a confirmation prompt
        const isConfirmed = window.confirm("Are you sure you want to delete this service?");
        
        // Proceed with deletion if confirmed
        if (isConfirmed) {
          const requestOptions = {
            method: "DELETE",
            redirect: "follow",
          };
          const url = `${SERVICE_API}/workflow/services/servicetemplate/`;
          fetch(url + _id, requestOptions)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to delete item");
              }
              return response.json();
            })
            .then((result) => {
              console.log(result);
              toast.success("Item deleted successfully");
              fetchServicesData(); // Refresh data
            })
            .catch((error) => {
              console.error(error);
              toast.error("Failed to delete item");
            });
        }
      };
      
      const columns = [
        {
          accessorKey: 'serviceName', // Access the template name
          header: 'Name',
          Cell: ({ row }) => (
            <Typography
              sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: 'bold' }}
              onClick={() => handleEdit(row.original._id)}
            >
              {row.original.serviceName}
            </Typography>
          ),
        },
        {
            accessorKey: 'description', // Access the template name
            header: 'Description',
        },
        {
            accessorKey: 'rate', // Access the template name
            header: 'Rate',
        },
        {
            accessorKey: 'ratetype', // Access the template name
            header: 'Rate Type',
        },
        // {
        //     accessorKey: 'tax', // Access the tax
        //     header: 'Tax',
        //     Cell: ({ row }) => (
        //       <Checkbox
        //         checked={row.original.tax} // Display as checked if tax is true
        //         // disabled // Make it non-interactive
        //         color="primary"
        //       />
        //     ),
        //   },
        {
            accessorKey: 'category', // Access the template name
            header: 'Category',
            Cell: ({ row }) => {
                // Find the category name based on the category ID
                const category = categoryData.find((cat) => cat._id === row.original.category);
                return <Typography>{category ? category.categoryName : "N/A"}</Typography>;
              },
        },
        {
          accessorKey: 'settings', // Add settings column
          header: 'Settings',
          Cell: ({ row }) => (
            <IconButton onClick={() => toggleMenu(row.original._id)} style={{ color: "#2c59fa" }}>
              <CiMenuKebab style={{ fontSize: "25px" }} />
              {openMenuId === row.original._id && (
                <Box sx={{ position: 'absolute', zIndex: 1, backgroundColor: '#fff', boxShadow: 1, borderRadius: 1, p: 1, left: '30px', m: 2 }}>
                  <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }} onClick={() => {
                    handleEdit(row.original._id);
                   
                  }} >Edit</Typography>
                  <Typography sx={{ fontSize: '12px', color: 'red', fontWeight: 'bold' }} onClick={() => handleDelete(row.original._id)}>Delete</Typography>
                </Box>
              )}
            </IconButton>
    
          ),
        },
      ];
      const table = useMaterialReactTable({
        columns,
        data:ServiceTemplates,
        enableBottomToolbar: true,
        enableStickyHeader: true,
        columnFilterDisplayMode: "custom", // Render own filtering UI
        enableRowSelection: true, // Enable row selection
        enablePagination: true,
        muiTableContainerProps: { sx: { maxHeight: "400px" } },
        initialState: {
            columnPinning: { left: ["mrt-row-select", "Name"], },
          },
        muiTableBodyCellProps: {
          sx: (theme) => ({
            backgroundColor: theme.palette.mode === "dark-theme" ? theme.palette.grey[900] : theme.palette.grey[50],
          }),
        },
      });
    return (
        <Box>
            <Button onClick={setIsNewDrawerOpen} variant="contained" color="primary" sx={{ mb: 3 }}>
                Create Service
            </Button>
            <Box>
           
            <MaterialReactTable
            columns={columns}
            
            table={table}
          />
            </Box>
            <Drawer
                anchor="right"
                open={isNewDrawerOpen}
                onClose={handleNewDrawerClose}
                PaperProps={{
                    sx: {
                        borderRadius: isSmallScreen ? '0' : '10px 0 0 10px',
                        width: isSmallScreen ? '100%' : '650px',

                    },
                }}>
                <Box role="presentation" sx={{ borderRadius: isSmallScreen ? '0' : '15px' }}>
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid grey' }}>
                            <Typography variant='h6'>Create Service</Typography>
                            <RxCross2 onClick={handleNewDrawerClose} style={{ cursor: 'pointer' }} />
                        </Box>



                    </Box>
                    <form style={{ margin: '15px', }} >

                        <Box>
                            <Box >
                                <InputLabel sx={{ color: 'black' }}>Service Name</InputLabel>
                                <TextField
                                    // margin="normal"
                                    fullWidth
                                    name="ServiceName"
                                    placeholder="Service Name"
                                    size="small"
                                    margin='normal'
                                    onChange={(e) => setservicename(e.target.value)}
                                />
                            </Box>
                            <Box sx={{ mt: 1 }}>
                                <InputLabel sx={{ color: 'black' }}>Description</InputLabel>
                                <TextField
                                    onChange={(e) => setdiscription(e.target.value)}
                                    fullWidth
                                    name="Description"
                                    placeholder="Description"
                                    size="small"
                                    margin='normal'
                                />
                            </Box>
                            <Box sx={{ width: '100%', mt: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Box>
                                            <InputLabel sx={{ color: 'black' }}>Rate</InputLabel>
                                            <TextField
                                                fullWidth
                                                name="Rate"
                                                placeholder="Rate"
                                                size="small"
                                                margin='normal'
                                                value={rate}
                                                // onChange={(e) => setrate(e.target.value)}
                                                onChange={handleRateChange}

                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ mr: '15px' }}>
                                            <InputLabel sx={{ color: 'black' }}>Rate Type</InputLabel>
                                            <Autocomplete
                                                size="small"
                                                fullWidth
                                                sx={{ mt: 2 }}
                                                options={options}
                                                getOptionLabel={(option) => option?.label || ""}
                                                value={selectedOption}
                                                onChange={handleRateTypeChange}
                                                renderInput={(params) => (
                                                    <TextField {...params} variant="outlined" placeholder="Select Rate Type" />
                                                )}
                                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                                renderOption={(props, option) => (
                                                    <Box
                                                        component="li"
                                                        {...props}
                                                        sx={{

                                                            margin: '4px',
                                                            cursor: 'pointer',

                                                        }}
                                                    >
                                                        <Typography >
                                                            {option.label}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box mt={2} >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={service}
                                            onChange={(event) => handleServiceWitch(event.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label={"Tax"}
                                />
                            </Box>
                            <Box>
                                <Box>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                                        Category
                                    </Typography>
                                </Box>
                                <Box >
                                    <InputLabel sx={{ color: 'black', mt: 2 }}>Category Name</InputLabel>
                                    <Autocomplete
                                     size="small"
                                     fullWidth
                                     sx={{ mt: 2 }}
                                        options={categoryoptions}
                                        getOptionLabel={(option) => option.label} // Adjust based on your data structure
                                        value={selectedCategory}
                                        onChange={handleCategoryChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Category Name"
                                                variant="outlined"
                                            />
                                        )}
                                        clearOnEscape // Equivalent to isClearable
                                        isOptionEqualToValue={(option, value) => option.value === value.value} // Compare options for equality
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={setCategoryFormOpen}
                                    sx={{ mt: 4, ml: 1 }}
                                >
                                    Create category
                                </Button>

                                {/* category form */}
                                <Drawer
                                    anchor="right"
                                    open={isCategoryFormOpen}
                                    onClose={handleCategoryFormClose}
                                    PaperProps={{
                                        sx: {
                                            borderRadius: isSmallScreen ? '0' : '10px 0 0 10px',
                                            width: isSmallScreen ? '100%' : '650px',
                                            maxWidth: '100%',
                                        },
                                    }} >

                                    <Box>

                                        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', }}>

                                            <ArrowBackRoundedIcon onClick={handleCategoryFormClose} style={{ cursor: 'pointer' }} />
                                        </Box>
                                        <Divider />
                                    </Box>
                                    <Box p={3} >
                                        <InputLabel sx={{ color: 'black', mt: 2 }}>Category Name</InputLabel>

                                        <TextField
                                            fullWidth
                                            name="Rate"
                                            placeholder="Category Name"
                                            size="small"
                                            margin='normal'
                                            value={categorycreate} onChange={(e) => setcategorycreate(e.target.value)}
                                        />
                                    </Box>
                                    <Box sx={{ pt: 2, display: 'flex', alignItems: 'center', gap: 5, margin: "8px", ml: 3 }}>
                                        <Button variant="contained" color="primary" onClick={createCategory} >Create</Button>
                                        <Button variant="outlined" onClick={handleCategoryFormClose}>Cancel</Button>
                                    </Box>
                                </Drawer >
                            </Box>
                            <Box sx={{ pt: 5, display: 'flex', alignItems: 'center', gap: 5, ml: 1 }}>
                                <Button variant="contained" color="primary" onClick={createservicetemp}>Save</Button>
                                <Button variant="outlined" onClick={handleNewDrawerClose}>Cancel</Button>
                            </Box>
                        </Box>

                    </form>



                </Box>


            </Drawer>
        </Box>
    )
}

export default Service