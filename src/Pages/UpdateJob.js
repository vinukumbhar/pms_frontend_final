import React, { useEffect, useState } from "react";
import { Box, Typography, Autocomplete, TextField } from "@mui/material";
const UpdateJob = ({ selectedJob, handleClose }) => {
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  useEffect(() => {
    if (selectedJob) {
      console.log(selectedJob);
      if (selectedJob.jobList && selectedJob.jobList.Pipeline) {
        const pipelineData = {
          value: selectedJob.jobList.Pipeline._id,
          label: selectedJob.jobList.Pipeline.Name,
        };
        setselectedPipeline(pipelineData);
        console.log(pipelineData);
        // setPipelineId(selectedJob.jobList.Pipeline._id);
        // fetchPipelineDataid(selectedJob.jobList.Pipeline._id);
      }
    }
  }, [selectedJob]);

  // pipeline data
  const [pipelineData, setPipelineData] = useState([]);
  const [selectedPipeline, setselectedPipeline] = useState();

  const handlePipelineChange = (selectedOptions) => {
    setselectedPipeline(selectedOptions);
    console.log(selectedOptions);
  };
  useEffect(() => {
    fetchPipelineData();
  }, []);
  const fetchPipelineData = async () => {
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipelines`;
      const response = await fetch(url);
      const data = await response.json();
      setPipelineData(data.pipeline);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const optionpipeline = pipelineData.map((pipelineData) => ({
    value: pipelineData._id,
    label: pipelineData.pipelineName,
  }));
  return (
    <Box>
      <Box mt={2}>
        <label className="job-input-label">Pipeline</label>

        <Autocomplete
          options={optionpipeline}
          getOptionLabel={(option) => option.label}
          value={selectedPipeline}
          onChange={(event, newValue) => handlePipelineChange(newValue)}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
            >
              {option.label}
            </Box>
          )}
          renderInput={(params) => <TextField {...params} sx={{ backgroundColor: "#fff" }} placeholder="Pipeline" variant="outlined" size="small" />}
          sx={{ width: "100%", marginTop: "8px" }}
          clearOnEscape // Enable clearable functionality
        />
      </Box>
      <Typography> edit job</Typography>
    </Box>
  );
};

export default UpdateJob;
