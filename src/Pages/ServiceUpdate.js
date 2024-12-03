import { useTheme, useMediaQuery, Box, FormControlLabel, Typography, Button, Autocomplete, InputLabel, TextField, Divider, } from '@mui/material'
import React, { useState, useEffect } from 'react';
import Switch from '@mui/material/Switch';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Unstable_Grid2';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
const ServiceUpdate = () => {
  const CATEGORY_API = process.env.REACT_APP_CATEGORY_URL;
  const { id } = useParams();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isCategoryFormOpen, setCategoryFormOpen] = useState(false);
  const handleCategoryFormClose = () => {
    setCategoryFormOpen(false);
  };
  const options = [
    // { label: "Select Rate Type", value: "" },
    { label: "Item", value: "item" },
    { label: "Hour", value: "hour" },
  ];
  const [service, setService] = useState(false)
  const handleServiceWitch = (checked) => {
    setService(checked);
  };
  const handleRateTypeChange = (event, newValue) => {
    setSelectedOption(newValue);
    console.log('Selected rate type:', newValue);
  };
  // category create
 
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
  const [categorycreate, setcategorycreate] = useState();

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };


  const SERVICE_API = process.env.REACT_APP_SERVICES_URL;
  const [templateData, setTemplateData] = useState(null);


  const [rate, setrate] = useState("$ 0.00")
  const handleRateChange = (e) => {
    // Remove the dollar sign and any non-numeric characters, and keep the input as a number
    const value = e.target.value.replace(/[^0-9.]/g, '');
    
    // Update the rate, ensuring it includes the $ symbol
    setrate(`$ ${value}`);
  };
  const [servicename, setservicename] = useState("");
  const [discription, setdiscription] = useState("");
  const [selectedOption, setSelectedOption] = useState('');
  useEffect(() => {
    fetchidwiseData();
  }, []);

  //get id wise template Record

  const fetchidwiseData = async () => {
    try {
      // const url = `${API_KEY}/workflow/servicetemplate/`;
      const url = `${SERVICE_API}/workflow/services/servicetemplate/servicetemplatebyid/`
      const response = await fetch(url + id);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data)
      setTemplateData(data.serviceTemplate);
      setservicename(data.serviceTemplate.serviceName)

      setdiscription(data.serviceTemplate.description)
      setrate(data.serviceTemplate.rate)
      setSelectedOption({ value: data.serviceTemplate.ratetype, label: data.serviceTemplate.ratetype });
      setService(data.serviceTemplate.tax)
      const categoryName = ({
        value: data.serviceTemplate.category._id,
        label: data.serviceTemplate.category.categoryName,
      });
      setSelectedCategory(categoryName)
      console.log(categoryName)

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const navigate = useNavigate();
  const updateservicetemp = () => {
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
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };
    const url = `${SERVICE_API}/workflow/services/servicetemplate/${templateData._id}`;
    fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result)
            toast.success("ServiceTemplate Updated successfully");
            navigate('/firmtemp/service');
        })
        .catch((error) => {
            console.log(error)
            const errorMessage = error.response && error.response.message ? error.response.message : "Failed to update invoice";
            toast.error(errorMessage);
        });
};

const handleBack = ()=>{
  navigate('/firmtemp/service');
}
  return (
    <Box>

      <form style={{ margin: '15px', }} >
        <Typography variant='h5' fontWeight={'bold'} mb={2}>Edit Service</Typography>
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
              value={servicename}
              onChange={(e) => setservicename(e.target.value)}
            />
          </Box>
          <Box sx={{ mt: 1 }}>
            <InputLabel sx={{ color: 'black' }}>Description</InputLabel>
            <TextField
              value={discription}
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
                    // value={rate}
                    // onChange={(e) => setrate(e.target.value)}
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
              }}
            >

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
            <Button variant="contained" color="primary" onClick={updateservicetemp}>Save</Button>
            <Button variant="outlined" onClick={handleBack}>Cancel</Button>
          </Box>
        </Box>

      </form>
    </Box>
  )
}

export default ServiceUpdate