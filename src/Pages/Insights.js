// import React from 'react';
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Avatar,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Divider,
// } from '@mui/material';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import EventIcon from '@mui/icons-material/Event';
// import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

// const InsightsPage = () => {
//   return (
//     <Box sx={{ padding: 4 }}>
//       <Typography variant="h4" gutterBottom >
//         Insights Dashboard
//       </Typography>

//       <Grid container spacing={4} mt={3}>
//         {/* Top Insights */}
//         <Grid item xs={12} md={6} lg={4}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Top Insights
//               </Typography>
//               <List>
//                 <ListItem>
//                   <ListItemAvatar>
//                     <Avatar>
//                       <AccountBalanceIcon />
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary="Tax Savings This Month"
//                     secondary="Saved $12,000 for clients"
//                   />
//                 </ListItem>
//                 <Divider variant="inset" component="li" />
//                 <ListItem>
//                   <ListItemAvatar>
//                     <Avatar>
//                       <TrendingUpIcon />
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary="Trending Deductions"
//                     secondary="Home Office, EV Tax Credit"
//                   />
//                 </ListItem>
//               </List>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Recent Activities */}
//         <Grid item xs={12} md={6} lg={4}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Recent Activities
//               </Typography>
//               <List>
//                 <ListItem>
//                   <ListItemAvatar>
//                     <Avatar>
//                       <EventIcon />
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary="Filed Returns"
//                     secondary="25 clients processed this week"
//                   />
//                 </ListItem>
//                 <Divider variant="inset" component="li" />
//                 <ListItem>
//                   <ListItemAvatar>
//                     <Avatar>
//                       <EventIcon />
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary="Scheduled Meetings"
//                     secondary="3 meetings scheduled for today"
//                   />
//                 </ListItem>
//               </List>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Trending Topics */}
//         <Grid item xs={12} lg={4}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Trending Topics
//               </Typography>
//               <List>
//                 <ListItem>
//                   <ListItemText
//                     primary="Understanding the 2024 Tax Reforms"
//                     secondary="Popular among small business owners"
//                   />
//                 </ListItem>
//                 <Divider component="li" />
//                 <ListItem>
//                   <ListItemText
//                     primary="Maximizing Tax Deductions for Freelancers"
//                     secondary="A hot topic this quarter"
//                   />
//                 </ListItem>
//               </List>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default InsightsPage;

// import { Box, Autocomplete, Chip, TextField } from "@mui/material";
// import React, { useState, useEffect } from "react";

// const Insights = () => {
//   const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
//   //Tag FetchData ================
//   const [tags, setTags] = useState([]);
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [combinedTagsValues, setCombinedTagsValues] = useState([]);
//   useEffect(() => {
//     fetchTagData();
//   }, []);

//   const fetchTagData = async () => {
//     try {
//       const url = `${TAGS_API}/tags/`;
//       const response = await fetch(url);
//       const data = await response.json();
//       setTags(data.tags);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
//   //  for tags
//   const calculateWidth = (tagName) => {
//     const baseWidth = 10; // base width for each tag
//     const charWidth = 8; // approximate width of each character
//     const padding = 10; // padding on either side
//     return baseWidth + charWidth * tagName.length + padding;
//   };
//   const tagsoptions = tags.map((tag) => ({
//     value: tag._id,
//     label: tag.tagName,
//     colour: tag.tagColour,
//     customStyle: {
//       backgroundColor: tag.tagColour,
//       color: "#fff",
//       borderRadius: "8px",
//       alignItems: "center",
//       textAlign: "center",
//       marginBottom: "5px",
//       padding: "2px,8px",
//       fontSize: "10px",
//       width: `${calculateWidth(tag.tagName)}px`,
//       margin: "7px",
//       cursor: "pointer",
//     },
//     customTagStyle: {
//       backgroundColor: tag.tagColour,
//       color: "#fff",
//       alignItems: "center",
//       textAlign: "center",
//       padding: "2px,8px",
//       fontSize: "10px",
//       cursor: "pointer",
//     },
//   }));
//   const handleTagChange = (event, newValue) => {
//     setSelectedTags(newValue.map((option) => option.value));
//     // Send selectedValues array to your backend
//     console.log(
//       "Selected Values:",
//       newValue.map((option) => option.value)
//     );
//     // Assuming setCombinedValues is a function to send the values to your backend
//     setCombinedTagsValues(newValue.map((option) => option.value));
//   };
 

//   return (
//     <Box>
//       <Box mt={2}>
//         <label className="task-input-label">Add Tags</label>
//         <Autocomplete
//           multiple
//           size="small"
//           id="tags-outlined"
//           options={tagsoptions}
//           getOptionLabel={(option) => option.label}
//           value={tagsoptions.filter((option) =>
//             selectedTags.includes(option.value)
//           )}
//           onChange={handleTagChange}
//           renderTags={(selected, getTagProps) =>
//             selected.map((option, index) => (
//               <Chip
//                 key={option.value}
//                 label={option.label}
//                 style={option.customTagStyle}
//                 {...getTagProps({ index })}
//               />
//             ))
//           }
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               variant="outlined"
//               placeholder="Tags"
//               sx={{ width: "100%", marginTop: "8px", backgroundColor: "#fff" }}
//             />
//           )}
//           renderOption={(props, option) => (
//             <Box component="li" {...props} style={option.customStyle}>
//               {option.label}
//             </Box>
//           )}
//         />
//       </Box>
//       <Box mt={2}>
//         <label className="task-input-label"> Remove Tags</label>
//         <Autocomplete
//           multiple
//           size="small"
//           id="tags-outlined"
//           options={tagsoptions}
//           getOptionLabel={(option) => option.label}
//           value={tagsoptions.filter((option) =>
//             selectedTags.includes(option.value)
//           )}
//           onChange={handleTagChange}
//           renderTags={(selected, getTagProps) =>
//             selected.map((option, index) => (
//               <Chip
//                 key={option.value}
//                 label={option.label}
//                 style={option.customTagStyle}
//                 {...getTagProps({ index })}
//               />
//             ))
//           }
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               variant="outlined"
//               placeholder="Tags"
//               sx={{ width: "100%", marginTop: "8px", backgroundColor: "#fff" }}
//             />
//           )}
//           renderOption={(props, option) => (
//             <Box component="li" {...props} style={option.customStyle}>
//               {option.label}
//             </Box>
//           )}
//         />
//       </Box>
//     </Box>
//   );
// };

// export default Insights;


// import { Box, Autocomplete, Chip, TextField } from "@mui/material";
// import React, { useState, useEffect } from "react";

// const Insights = () => {
//   const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
//   // Tag FetchData ================
//   const [tags, setTags] = useState([]);
//   const [addTags, setAddTags] = useState([]); // Separate state for Add Tags
//   const [removeTags, setRemoveTags] = useState([]); // Separate state for Remove Tags
//   const [combinedTagsValues, setCombinedTagsValues] = useState([]);
  
//   useEffect(() => {
//     fetchTagData();
//   }, []);

//   const fetchTagData = async () => {
//     try {
//       const url = `${TAGS_API}/tags/`;
//       const response = await fetch(url);
//       const data = await response.json();
//       setTags(data.tags);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   // for tags
//   const calculateWidth = (tagName) => {
//     const baseWidth = 10; // base width for each tag
//     const charWidth = 8; // approximate width of each character
//     const padding = 10; // padding on either side
//     return baseWidth + charWidth * tagName.length + padding;
//   };

//   const tagsoptions = tags.map((tag) => ({
//     value: tag._id,
//     label: tag.tagName,
//     colour: tag.tagColour,
//     customStyle: {
//       backgroundColor: tag.tagColour,
//       color: "#fff",
//       borderRadius: "8px",
//       alignItems: "center",
//       textAlign: "center",
//       marginBottom: "5px",
//       padding: "2px,8px",
//       fontSize: "10px",
//       width: `${calculateWidth(tag.tagName)}px`,
//       margin: "7px",
//       cursor: "pointer",
//     },
//     customTagStyle: {
//       backgroundColor: tag.tagColour,
//       color: "#fff",
//       alignItems: "center",
//       textAlign: "center",
//       padding: "2px,8px",
//       fontSize: "10px",
//       cursor: "pointer",
//     },
//   }));

//   const handleAddTagChange = (event, newValue) => {
//     setAddTags(newValue.map((option) => option.value));
//     console.log("Selected Add Tags:", newValue.map((option) => option.value));
//     setCombinedTagsValues(newValue.map((option) => option.value));
//   };

//   const handleRemoveTagChange = (event, newValue) => {
//     setRemoveTags(newValue.map((option) => option.value));
//     console.log("Selected Remove Tags:", newValue.map((option) => option.value));
//   };
//   // Filtered options for Add Tags (excluding tags selected in Remove Tags)
// const filteredAddTagsOptions = tagsoptions.filter(
//   (option) => !removeTags.includes(option.value)
// );

// // Filtered options for Remove Tags (excluding tags selected in Add Tags)
// const filteredRemoveTagsOptions = tagsoptions.filter(
//   (option) => !addTags.includes(option.value)
// );
//   return (
//     <Box sx={{display:'flex', alignItems:'center', gap:5}}>
//       <Box mt={2}>
//         <label className="task-input-label">Add Tags</label>
//         <Autocomplete
//           multiple
//           size="small"
//           id="tags-add-outlined"
//           options={filteredAddTagsOptions}
//           getOptionLabel={(option) => option.label}
//           value={tagsoptions.filter((option) =>
//             addTags.includes(option.value)
//           )}
//           onChange={handleAddTagChange}
//           renderTags={(selected, getTagProps) =>
//             selected.map((option, index) => (
//               <Chip
//                 key={option.value}
//                 label={option.label}
//                 style={option.customTagStyle}
//                 {...getTagProps({ index })}
//               />
//             ))
//           }
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               variant="outlined"
//               placeholder="Tags"
//               sx={{ width: "100%", marginTop: "8px", backgroundColor: "#fff" }}
//             />
//           )}
//           renderOption={(props, option) => (
//             <Box component="li" {...props} style={option.customStyle}>
//               {option.label}
//             </Box>
//           )}
//         />
//       </Box>

//       <Box mt={2}>
//         <label className="task-input-label">Remove Tags</label>
//         <Autocomplete
//           multiple
//           size="small"
//           id="tags-remove-outlined"
//           options={filteredRemoveTagsOptions}
//           getOptionLabel={(option) => option.label}
//           value={tagsoptions.filter((option) =>
//             removeTags.includes(option.value)
//           )}
//           onChange={handleRemoveTagChange}
//           renderTags={(selected, getTagProps) =>
//             selected.map((option, index) => (
//               <Chip
//                 key={option.value}
//                 label={option.label}
//                 style={option.customTagStyle}
//                 {...getTagProps({ index })}
//               />
//             ))
//           }
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               variant="outlined"
//               placeholder="Tags"
//               sx={{ width: "100%", marginTop: "8px", backgroundColor: "#fff" }}
//             />
//           )}
//           renderOption={(props, option) => (
//             <Box component="li" {...props} style={option.customStyle}>
//               {option.label}
//             </Box>
//           )}
//         />
//       </Box>
//     </Box>
//   );
// };

// export default Insights;


import { Box, Autocomplete, Chip, TextField, Button } from "@mui/material";
import React, { useState, useEffect } from "react";

const Insights = () => {
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [tags, setTags] = useState([]);
  const [addTags, setAddTags] = useState([]); // Separate state for Add Tags
  const [removeTags, setRemoveTags] = useState([]); // Separate state for Remove Tags

  useEffect(() => {
    fetchTagData();
  }, []);

  const fetchTagData = async () => {
    try {
      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateWidth = (tagName) => {
    const baseWidth = 10; // base width for each tag
    const charWidth = 8; // approximate width of each character
    const padding = 10; // padding on either side
    return baseWidth + charWidth * tagName.length + padding;
  };

  const tagsoptions = tags.map((tag) => ({
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
      cursor: "pointer",
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

  const handleAddTagChange = (event, newValue) => {
    setAddTags(newValue.map((option) => option.value));
    console.log("Selected Add Tags:", newValue.map((option) => option.value));
  };

  const handleRemoveTagChange = (event, newValue) => {
    setRemoveTags(newValue.map((option) => option.value));
    console.log("Selected Remove Tags:", newValue.map((option) => option.value));
  };

  const handleSave = () => {
    console.log("Saved Data:");
    console.log("Add Tags:", addTags);
    console.log("Remove Tags:", removeTags);
  };

  const filteredAddTagsOptions = tagsoptions.filter(
    (option) => !removeTags.includes(option.value)
  );

  const filteredRemoveTagsOptions = tagsoptions.filter(
    (option) => !addTags.includes(option.value)
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
        <Box mt={2}>
          <label className="task-input-label">Add Tags</label>
          <Autocomplete
            multiple
            size="small"
            id="tags-add-outlined"
            options={filteredAddTagsOptions}
            getOptionLabel={(option) => option.label}
            value={tagsoptions.filter((option) =>
              addTags.includes(option.value)
            )}
            onChange={handleAddTagChange}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  style={option.customTagStyle}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Tags"
                sx={{ width: "100%", marginTop: "8px", backgroundColor: "#fff" }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} style={option.customStyle}>
                {option.label}
              </Box>
            )}
          />
        </Box>

        <Box mt={2}>
          <label className="task-input-label">Remove Tags</label>
          <Autocomplete
            multiple
            size="small"
            id="tags-remove-outlined"
            options={filteredRemoveTagsOptions}
            getOptionLabel={(option) => option.label}
            value={tagsoptions.filter((option) =>
              removeTags.includes(option.value)
            )}
            onChange={handleRemoveTagChange}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  style={option.customTagStyle}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Tags"
                sx={{ width: "100%", marginTop: "8px", backgroundColor: "#fff" }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} style={option.customStyle}>
                {option.label}
              </Box>
            )}
          />
        </Box>
      </Box>

      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ marginTop: "16px" }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default Insights;
