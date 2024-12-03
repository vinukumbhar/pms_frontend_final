// import React from "react";
// import { Autocomplete, TextField, Box, Chip } from '@mui/material';
// import '../../App.css'
// const Status = ({ onStatusChange, selectedStatus }) => {

//   const options = [
//     { value: "No status", label: "No status", color: "#C4AEAD" },
//     { value: "Planned", label: "Planned", color: "#4169E1" },
//     { value: "In review", label: "In review", color: "#F6BE00" },
//     { value: "In progress", label: "In progress", color: "#F6BE00" },
//     { value: "On hold", label: "On hold", color: "#BCC6CC" },
//     { value: "Extended", label: "Extended", color: "#82CAFF" },
//     { value: "Waiting for Client", label: "Waiting for Client", color: "#566D7E" },
//     { value: "Waiting for Signatures", label: "Waiting for Signatures", color: "#566D7E" },
//     { value: "Waiting for agency", label: "Waiting for agency", color: "#566D7E" },
//     { value: "Completed", label: "Completed", color: "#00FF00" },
//     { value: "Canceled", label: "Canceled", color: "#EB5406" },
//   ];

//   const handleChange = (event, newValues) => {
//     onStatusChange(newValues.map((option) => option.value));
//     // console.log("handleChange", newValues);
//   };

//   const calculateWidth = (label) => {
//     const textWidth = label.length *8;
//     return Math.min(textWidth, 200);
//   };

//   return (
//     <Box>
//        <label  className="priority-custom-label">Status</label>
    
//     <Autocomplete
    
//     className='autocomplete'
//       multiple
//       size="small"
//       id="status-autocomplete"
//       options={options}
//       getOptionLabel={(option) => option.label}
//       value={options.filter(option => selectedStatus.includes(option.value))}
//       onChange={handleChange}
//       renderTags={(selected, getTagProps) =>
//         selected.map((option, index) => (
//           <Chip
//             key={option.value}
//             label={option.label}
//             style={{ backgroundColor: option.color,  color: "#fff",
//               fontSize: "12px",
//               fontWeight: "bold",
//               margin: "2px",
//               cursor:'pointer' }}
//             {...getTagProps({ index })}
//           />
//         ))
//       }
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           variant="outlined"
//           placeholder="Select Status"
//           sx={{ width: '100%', marginTop: '8px',background:'#fff', }}
//         />
//       )}
//       renderOption={(props, option) => (
//         <Box component="li" {...props} style={{ width: `${calculateWidth(option.label) + 10}px`, display: 'flex', alignItems: 'center', padding: '2px 8px', borderRadius: '15px', backgroundColor: option.color, color: "#fff" , cursor:'pointer', marginTop:'5px',}}>
//           {option.label}
//         </Box>
//       )}
//       isOptionEqualToValue={(option, value) => option.value === value.value}
//       clearOnBlur
//       disableCloseOnSelect
//     />
//     </Box>
//   );
// };

// export default Status;


import React from "react";
import Select from "react-select";

const Status = ({onStatusChange, selectedStatus}) => {


  const options = [
    { value: "No status", label: "No status", color: "#C4AEAD" },
    { value: "Planned", label: "Planned", color: "#4169E1" },
    { value: "In review", label: "In review", color: "#F6BE00" },
    { value: "In progress", label: "In progress", color: "#F6BE00" },
    { value: "On hold", label: "On hold", color: "#BCC6CC" },
    { value: "Extended", label: "Extended", color: "#82CAFF" },
    { value: "Waiting for Client", label: "Waiting for Client", color: "#566D7E" },
    { value: "Waiting for Signatures", label: "Waiting for Signatures", color: "#566D7E" },
    { value: "Waiting for agency", label: "Waiting for agency", color: "#566D7E" },
    { value: "Completed", label: "Completed", color: "#00FF00" },
    { value: "Canceled", label: "Canceled", color: "#EB5406" },

  ];

  const calculateWidth = (label) => {
    const textWidth = label.length * 9;
    return Math.min(textWidth, 220);
  };

  const colorStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
  
    option: (styles, { data }) => ({
      ...styles,
      backgroundColor: data.color,
      color: "#fff",
      borderRadius: "15px",
      textAlign: "center",
      padding: "2px,8px",
      margin: "7px",
      fontSize: "10px",
      fontWeight: "bold",
      width: `${calculateWidth(data.label)}px`, // Fix here
    }),
  
    singleValue: (styles, { data }) => ({
      ...styles,
      backgroundColor: data.color,
      color: "#fff",
      borderRadius: "15px",
      width: `${calculateWidth(data.label) + 20}px`, // Fix here
      overflow: "hidden",
      textOverflow: "ellipsis",
      textAlign: "center",
    }),
  
    singleValueLabel: (styles, { data }) => ({
      ...styles,
      backgroundColor: data.color,
      color: "#fff",
      borderRadius: "15px",
      textAlign: "center",
      fontSize: "12px",
    }),
  };
  
  const handleChange = (selectedOption) => {
    onStatusChange(selectedOption);
    console.log("handleChange", selectedOption);
  };

  return (
    <div>
   <label  className="priority-custom-label">Status</label>
   <div style={{marginTop:'10px'}}>
   <Select options={options} 
    onChange={handleChange} 
    styles={colorStyles} 
    value = {options.find(option => option.value === selectedStatus)}
    isSearchable // Enable search
    isClearable
    />
   </div>
    
    </div>
 
    
  );
};

export default Status;