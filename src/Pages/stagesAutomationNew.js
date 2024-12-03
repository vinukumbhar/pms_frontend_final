import React, { useState, useEffect, useMemo } from "react";
import { Menu, MenuItem, useMediaQuery, useTheme, Checkbox, Chip, Box, Button, Container, Paper, TextField, Typography, Switch, Divider, IconButton, Drawer, Autocomplete } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuPlusCircle, LuPenLine } from "react-icons/lu";
import { toast } from "react-toastify";
import { RxDragHandleDots2 } from "react-icons/rx";
import axios from "axios";
const PipelineTemp = () => {
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const [pipelineName, setPipelineName] = useState("");
  const [stages, setStages] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleAddStage = () => {
    const newStage = {
      name: "",
      conditions: [],
      automations: [],
      autoMove: false,
      showDropdown: false,
    };
    setStages([...stages, newStage]);
  };

  const handleStageNameChange = (e, index) => {
    const newStages = [...stages];
    newStages[index].name = e.target.value;
    setStages(newStages);
  };

  const handleDeleteStage = (index) => {
    const updatedStages = [...stages];
    updatedStages.splice(index, 1);
    setStages(updatedStages);
  };

  const createPipe = () => {
    const data = {
      pipelineName: pipelineName,
      stages: stages,
    };
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${PIPELINE_API}/workflow/pipeline/createpipeline`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        fetchPipelineData();
        toast.success("Pipeline created successfully");
        clearForm();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to create pipeline");
      });
  };

  const clearForm = () => {
    setPipelineName("");
    setStages([]);
  };

  const [pipelineData, setPipelineData] = useState([]);
  useEffect(() => {
    fetchPipelineData();
  }, []);

  const fetchPipelineData = async () => {
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipelines`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch pipeline data");
      }
      const data = await response.json();
      setPipelineData(data.pipeline);
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
    }
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const renderMenuItems = (index) => {
    const menuItems = [
      { label: "Send Email", action: "sendEmail" },
      { label: "Send Invoice", action: "sendInvoice" },
      { label: "Send Organizer", action: "sendOrganizer" },
    ];

    return menuItems.map((item, itemIndex) => (
      <MenuItem key={itemIndex} onClick={() => handleMenuItemClick(index, item.action)}>
        {item.label}
      </MenuItem>
    ));
  };
  const handleMenuItemClick = (index, action) => {
    setSelectedStage(stages[index]); // Set the selected stage
    setSelectedAction(action); // Set the selected action
    setOpenDrawer(true); // Open the drawer
    handleClose(); // Close the menu
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
    setSelectedStage(null); // Clear the selected stage
    setSelectedAction(""); // Clear the selected action
  };
  const renderDrawerContent = () => {
    switch (selectedAction) {
      case "sendEmail":
        return (
          <Box>
            <Typography>Send Email</Typography>
          </Box>
        ); // Render SendEmail component
      case "sendInvoice":
        return <Typography>Invoice sending functionality goes here.</Typography>;
      case "sendOrganizer":
        return <Typography>Organizer sending functionality goes here.</Typography>;
      default:
        return null;
    }
  };
  return (
    <Container>
      <Box sx={{ mt: 2 }}>
        <Box>
          <form>
            <Box>
              <Typography variant="h5" gutterBottom>
                {" "}
                Create Pipelines
              </Typography>
              <Box mt={2} mb={2}>
                <hr />
              </Box>
              <Grid container spacing={2}>
                <Grid xs={12} sm={5.8}>
                  <Box>
                    {/* <InputLabel className="pipeline-lable">Pipeline Name</InputLabel> */}
                    <label className="pipeline-lable">Pipeline Name</label>
                    <TextField fullWidth value={pipelineName} onChange={(e) => setPipelineName(e.target.value)} sx={{ mt: 1.5, backgroundColor: "#fff" }} size="small" placeholder="Pipeline Name" />
                  </Box>
                </Grid>
              </Grid>
              <Box mt={5} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography variant="h6">Stages</Typography>
                <Button variant="contained" startIcon={<LuPlusCircle />} onClick={handleAddStage}>
                  Add stage
                </Button>
              </Box>
              <Box mt={2}>
                <hr />
              </Box>
              <Box sx={{ margin: "20px 0 10px 10px" }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    overflowX: "auto",
                    marginBottom: "10%",
                    flexDirection: isSmallScreen ? "column" : "row",
                  }}
                >
                  {stages.map((stage, index) => (
                    <Paper
                      key={index}
                      sx={{
                        height: "auto",
                        marginTop: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                        width: isSmallScreen ? "90%" : "20%",
                        marginBottom: "20px",
                        marginLeft: isSmallScreen ? "0" : "5px",
                        alignSelf: isSmallScreen ? "center" : "flex-start",
                      }}
                    >
                      <Box sx={{ margin: "10px" }}>
                        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <RxDragHandleDots2 />
                          <Box sx={{ display: "flex", alignItems: "center", gap: "10px", flexGrow: 1 }}>
                            <LuPenLine />
                            <TextField variant="outlined" placeholder="Stage Name" sx={{ flexGrow: 1 }} size="small" margin="normal" value={stage.name} onChange={(e) => handleStageNameChange(e, index)} />
                          </Box>
                          <IconButton onClick={() => handleDeleteStage(index)}>
                            <RiDeleteBin6Line sx={{ color: "red", cursor: "pointer" }} />
                          </IconButton>
                        </Box>
                        <Divider />
                        <Box m={2}>
                          <Typography variant="body2" sx={{ cursor: "pointer", color: "blue", fontWeight: "bold", mt: 2 }} onClick={handleClick}>
                            Added automation
                          </Typography>
                          <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                              "aria-labelledby": "basic-button",
                            }}
                          >
                            {renderMenuItems(index)}
                          </Menu>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                  <Drawer anchor="right" open={openDrawer} onClose={handleDrawerClose}>
                    <Box sx={{ width: 500, padding: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="h6">Automations</Typography>
                        <Button onClick={handleDrawerClose}>Close</Button>
                      </Box>

                      <Typography variant="body1">Stage: {selectedStage?.name}</Typography>
                      <Typography variant="body1">Action: {selectedAction}</Typography>

                      {renderDrawerContent()}
                    </Box>
                  </Drawer>
                  <Box mt={3}>
                    <Button variant="contained" startIcon={<LuPlusCircle />} onClick={handleAddStage}>
                      Add stage
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ pt: 2, display: "flex", alignItems: "center", gap: 5 }}>
                <Button variant="contained" color="primary" onClick={createPipe}>
                  Save & exit
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default PipelineTemp;
