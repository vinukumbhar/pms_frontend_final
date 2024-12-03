import React from "react";
import Select from "react-select";
import { Box } from '@mui/material';

const Priority = ({ onPriorityChange, selectedPriority }) => {


  const options = [
    { value: "Urgent", label: "Urgent", color: "#0E0402" },
    { value: "High", label: "High", color: "#fe676e" },
    { value: "Medium", label: "Medium", color: "#FFC300" },
    { value: "Low", label: "Low", color: "#56c288" },
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
    onPriorityChange(selectedOption);
    console.log("handleChange", selectedOption);
  };

  return (
    <Box>
      <label  className="priority-custom-label" >Priority</label>
      <Box mt={1}>
      <Select options={options}
        onChange={handleChange}
        styles={colorStyles}
        sx={{ width: '100%', marginTop: '20px' }}
       
        size="small"
        
        value={options.find(option => option.value === selectedPriority)}
        isSearchable // Enable search
        isClearable
      />
      </Box>
      
    </Box>


  );
};

export default Priority;


// import React from "react";
// import { Autocomplete, TextField, Box, Chip, } from '@mui/material';

// const Priority = ({ onPriorityChange, selectedPriority  }) => {


//     const calculateWidth = (label) => {
//     const textWidth = label.length *8;
//     return Math.min(textWidth, 200);
//   };
//   const options = [
//     { value: "Urgent", label: "Urgent", color: "#0E0402" },
//     { value: "High", label: "High", color: "#fe676e" },
//     { value: "Medium", label: "Medium", color: "#FFC300" },
//     { value: "Low", label: "Low", color: "#56c288" },
//   ];

//   const handlePriorityChange = (event, newValue) => {
//     // `newValue` will be an array of selected options
//     onPriorityChange(newValue.map((option) => option.value));
//     // console.log("handlePriorityChange", newValue);
//   };

//   return (
//     <Box>
//       <label className="priority-custom-label">Priority</label>
//       <Autocomplete
//         multiple
//         size="small"
//         id="priority-autocomplete"
//         options={options}
//         getOptionLabel={(option) => option.label}
//         value={options.filter(option => selectedPriority.includes(option.value))}
//         onChange={handlePriorityChange}
//         renderTags={(selected, getTagProps) =>
//           selected.map((option, index) => (
//             <Chip
//               key={option.value}
//               label={option.label}
//               style={{
//                 backgroundColor: option.color,
//                 color: "#fff",
//                 fontSize: "12px",
//                 fontWeight: "bold",
//                 margin: "2px",
//                 cursor:'pointer'
//               }}
//               {...getTagProps({ index })}
//             />
//           ))
//         }
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             variant="outlined"
//             placeholder="Select Priority"
//             sx={{ width: '100%', marginTop: '8px', backgroundColor:'#fff' }}
//           />
//         )}
//         renderOption={(props, option) => (
//           <Box component="li" {...props} style={{ width: `${calculateWidth(option.label) + 10}px`, display: 'flex', alignItems: 'center', padding: '2px 8px', borderRadius: '15px', backgroundColor: option.color, color: "#fff" , cursor:'pointer', marginTop:'5px',}}>
//             {option.label}
//           </Box>
//         )}
//         isClearable
//       />
//     </Box>
//   );
// };

// export default Priority;



