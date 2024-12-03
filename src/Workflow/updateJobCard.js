import React, { useState } from "react";

import { Box, Autocomplete, TextField, Typography, Switch, FormControlLabel, Button } from "@mui/material";
const EditJobCard = ({ stages }) => {
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
 
  const [selectedStage, setSelectedStage] = useState(null);
  const stagesoptions = stages.map((stage) => ({ value: stage._id, label: stage.name }));
  const handleStageChange = (event, newValue) => {
    setSelectedStage(newValue);
  };

  return (
    <Box>
      <Box>
        <label className="job-input-label">Stage</label>
        <Autocomplete size="small" options={stagesoptions} getOptionLabel={(option) => option.label} value={selectedStage} onChange={handleStageChange} renderInput={(params) => <TextField {...params} placeholder="Stages" variant="outlined" className="add-jobs-select-dropdown" />} sx={{ width: "100%", marginTop: "8px" }} />
      </Box>
    </Box>
  );
};

export default EditJobCard;
