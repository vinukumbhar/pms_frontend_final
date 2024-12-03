// import React, { useState } from 'react';
// import {
//     Box,TextField,FormControl,Typography,Button,LinearProgress,Select,MenuItem,Tooltip,
// } from '@mui/material';
// import { useLocation } from 'react-router-dom';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// const OrganizerPreview = () => {
//     const location = useLocation();
//     const { data } = location.state || {};
//     const organizerName = data?.organizerName || 'Organizer';
//     const sections = data?.sections || [];
//     const [startDate, setStartDate] = useState(null);
//     const [activeStep, setActiveStep] = useState(0);
//     const totalSteps = sections.length;

//     const handleStartDateChange = (date) => {
//         setStartDate(date);
//     };

//     const handleNext = () => {
//         if (activeStep < totalSteps - 1) {
//             setActiveStep((prevActiveStep) => prevActiveStep + 1);
//         }
//     };

//     const handleBack = () => {
//         if (activeStep > 0) {
//             setActiveStep((prevActiveStep) => prevActiveStep - 1);
//         }
//     };

//     const handleDropdownChange = (event) => {
//         const selectedIndex = event.target.value;
//         setActiveStep(selectedIndex);
//     };

//     const [radioValues, setRadioValues] = useState({}); // Store the selected values for each radio group
//     const [checkboxValues, setCheckboxValues] = useState({}); // Store the selected values for checkboxes
//     const [answeredElements, setAnsweredElements] = useState({}); // Track which elements have been answered

//     const handleRadioChange = (value, elementText) => {
//         setRadioValues((prevValues) => ({
//             ...prevValues,
//             [elementText]: value, // Update the selected value for the specific radio group
//         }));
//         setAnsweredElements((prevAnswered) => ({
//             ...prevAnswered,
//             [elementText]: true, // Mark the element as answered
//         }));
//     };

//     const handleCheckboxChange = (value, elementText) => {
//         setCheckboxValues((prevValues) => ({
//             ...prevValues,
//             [elementText]: {
//                 ...prevValues[elementText],
//                 [value]: !prevValues[elementText]?.[value], // Toggle the checkbox value
//             },
//         }));
//         setAnsweredElements((prevAnswered) => ({
//             ...prevAnswered,
//             [elementText]: true, // Mark the element as answered
//         }));
//     };

//     const [selectedValue, setSelectedValue] = useState(null);
//     const handleChange = (event, elementText) => {
//         setSelectedValue(event.target.value);
//         setAnsweredElements((prevAnswered) => ({
//             ...prevAnswered,
//             [elementText]: true, // Mark the element as answered
//         }));
//     };
//     const [inputValues, setInputValues] = useState({});
//     const handleInputChange = (event, elementText) => {
//         const { value } = event.target;
//         setInputValues((prevValues) => ({
//             ...prevValues,
//             [elementText]: value, // Store the input value for the specific TextField
//         }));
//         setAnsweredElements((prevAnswered) => ({
//             ...prevAnswered,
//             [elementText]: true, // Mark the element as answered
//         }));
//     };
//     const [selectedDropdownValue, setSelectedDropdownValue] = useState("");
//     const handleDropdownValueChange = (event, elementText) => {
//         setSelectedDropdownValue(event.target.value);
//         setAnsweredElements((prevAnswered) => ({
//             ...prevAnswered,
//             [elementText]: true, // Mark the element as answered
//         }));
//     };

//     const stripHtmlTags = (html) => {
//         const tempDiv = document.createElement('div');
//         tempDiv.innerHTML = html;
//         return tempDiv.innerText || tempDiv.textContent || "";
//     };

//     const shouldShowElement = (element) => {
//         if (!element.questionsectionsettings?.conditional) return true;

//         const condition = element.questionsectionsettings?.conditions?.[0];
//         if (condition && condition.question && condition.answer) {
//             return condition.answer === radioValues[condition.question];
//         }
//         return true; // Show by default if no conditions
//     };

//     // Calculate the number of answered elements for the active step
//     const totalElements = sections[activeStep]?.formElements.length || 0;
//     const answeredCount = sections[activeStep]?.formElements.filter(
//         (element) => answeredElements[element.text]
//     ).length || 0;

//     return (
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <Box>
//                 <h1>Organizer Preview</h1>
//                 <Typography variant='text' gutterBottom>
//                     {organizerName}
//                 </Typography>

//                 <FormControl fullWidth sx={{ marginBottom: '10px', marginTop: '10px' }}>
//                     <Select
//                         value={activeStep}
//                         onChange={handleDropdownChange}
//                         size='small'
//                     >
//                         {sections.map((section, index) => (
//                             <MenuItem key={index} value={index}>
//                                 {section.text} ({answeredCount}/{totalElements})
//                             </MenuItem>
//                         ))}
//                     </Select>
//                 </FormControl>

//                 <Box mt={2} mb={2}>
//                     <LinearProgress variant="determinate" value={(activeStep + 1) / totalSteps * 100} />
//                 </Box>

//                 {sections[activeStep]?.formElements.map((element) => (
//                     shouldShowElement(element) && (
//                         <Box key={element.text} style={{ marginBottom: '10px' }}>
//                             {/* Free Entry, Number, Email */}
//                             {(element.type === "Free Entry" || element.type === "Number" || element.type === "Email") && (
//                                 <Box>
//                                    <Typography fontSize='18px' mb={2}>{element.text}</Typography> 
//                                     <TextField
//                                         variant="outlined"
//                                         size='small'
//                                         multiline
//                                         fullWidth
//                                         margin='normal'
//                                         placeholder={`${element.type} Answer`}
//                                         inputProps={{
//                                             type: element.type === "Free Entry" ? "text" : element.type.toLowerCase(),
//                                         }}
//                                         maxRows={8}
//                                         style={{ display: 'block', marginTop: '15px' }}
//                                         // onChange={() =>
//                                         //     setAnsweredElements((prevAnswered) => ({
//                                         //         ...prevAnswered,
//                                         //         [element.text]: true, // Mark as answered when typing
//                                         //     }))
//                                         // }
//                                         value={inputValues[element.text] || ''} // Set value from state
//                                         onChange={(e) => handleInputChange(e, element.text)} // Handle change

//                                     />
//                                 </Box>
//                             )}

//                             {/* Radio Buttons as Buttons */}
//                             {element.type === "Radio Buttons" && (
//                                 <Box>
//                                     <Typography fontSize='18px'  mb={2}>{element.text}</Typography> 
//                                     <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//                                         {element.options.map((option) => (
//                                             <Button
//                                                 key={option.text}
//                                                 variant={radioValues[element.text] === option.text ? 'contained' : 'outlined'}
//                                                 onClick={() => handleRadioChange(option.text, element.text)}
//                                             >
//                                                 {option.text}
//                                             </Button>
//                                         ))}
//                                     </Box>
//                                 </Box>
//                             )}

//                             {/* Checkboxes as Buttons */}
//                             {element.type === "Checkboxes" && (
//                                 <Box>
//                                    <Typography fontSize='18px' mb={2}>{element.text}</Typography> 
//                                     <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//                                         {element.options.map((option) => (
//                                             <Button
//                                                 key={option.text}
//                                                 variant={checkboxValues[element.text]?.[option.text] ? 'contained' : 'outlined'}
//                                                 onClick={() => handleCheckboxChange(option.text, element.text)}
//                                             >
//                                                 {option.text}
//                                             </Button>
//                                         ))}
//                                     </Box>
//                                 </Box>
//                             )}

//                             {/* Yes/No */}
//                             {element.type === "Yes/No" && (
//                                 <Box>
//                                      <Typography fontSize='18px' mb={2}>{element.text}</Typography> 
//                                     <Box sx={{ display: 'flex', gap: 1 }}>
//                                         {element.options.map((option) => (
//                                             <Button
//                                                 key={option.text}
//                                                 variant={selectedValue === option.text ? 'contained' : 'outlined'}
//                                                 onClick={(event) => handleChange(event, element.text)}
//                                             >
//                                                 {option.text}
//                                             </Button>
//                                         ))}
//                                     </Box>
//                                 </Box>
//                             )}

//                             {/* Dropdown */}
//                             {element.type === "Dropdown" && (
//                                 <Box>
//                                     <Typography fontSize='18px' mb={2}>{element.text}</Typography> 
//                                     <FormControl fullWidth>
//                                         <Select
//                                             value={selectedDropdownValue}
//                                             onChange={(event) => handleDropdownValueChange(event, element.text)}
//                                             size='small'
//                                         >
//                                             {element.options.map((option) => (
//                                                 <MenuItem key={option.text} value={option.text}>
//                                                     {option.text}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </FormControl>
//                                 </Box>
//                             )}

//                             {/* Date */}
//                             {element.type === "Date" && (
//                                 <Box>
//                                     <Typography fontSize='18px' mb={2}>{element.text}</Typography> 
//                                     <DatePicker
//                                         format="DD/MM/YYYY"
//                                         sx={{ width: '100%', backgroundColor: '#fff' }}
//                                         selected={startDate}
//                                         onChange={handleStartDateChange}
//                                         renderInput={(params) => <TextField {...params} size="small" />}
//                                         onOpen={() =>
//                                             setAnsweredElements((prevAnswered) => ({
//                                                 ...prevAnswered,
//                                                 [element.text]: true, // Mark as answered when opened
//                                             }))
//                                         }
//                                     />
//                                 </Box>
//                             )}

// {/* File Upload */}
// {element.type === "File Upload" && (
//     <Box>
//          <Typography fontSize='18px' mb={2}>{element.text}</Typography> 
//         <Tooltip title="Unavailable in preview mode" placement="top">
//             <Box sx={{ position: 'relative', display: 'inline-block' }}>
//                 <Button variant="contained" color="primary" disabled>
//                     Upload
//                 </Button>
//             </Box>
//         </Tooltip>
//     </Box>
// )}
// {element.type === "Text Editor" && (
//         <Box>
//              <Typography>{stripHtmlTags(element.text)}</Typography>
//          </Box>
//     )}
//                         </Box>
//                     )
//                 ))}

//                 <Box display='flex' alignItems='center' gap={3} mt={2}>
//                     <Button onClick={handleBack} disabled={activeStep === 0}  variant="outlined">
//                         Back
//                     </Button>
//                     <Button onClick={handleNext} disabled={activeStep === totalSteps - 1}  variant="contained">
//                         Next
//                     </Button>
//                 </Box>
//             </Box>
//         </LocalizationProvider>
//     );
// };

// export default OrganizerPreview;


import React, { useState } from 'react';
import {
    Box, TextField, FormControl, Typography, Button, LinearProgress, Select, MenuItem, Tooltip,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const OrganizerPreview = () => {
    const location = useLocation();
    const { data } = location.state || {};
    const organizerName = data?.organizerName || 'Organizer';
    const sections = data?.sections || [];
    const [startDate, setStartDate] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    // const totalSteps = sections.length;

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleNext = () => {
        if (activeStep < totalSteps - 1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    };

    const handleDropdownChange = (event) => {
        const selectedIndex = event.target.value;
        setActiveStep(selectedIndex);
    };

    const [radioValues, setRadioValues] = useState({});
    const [checkboxValues, setCheckboxValues] = useState({});
    const [answeredElements, setAnsweredElements] = useState({});

    const handleRadioChange = (value, elementText) => {
        setRadioValues((prevValues) => ({
            ...prevValues,
            [elementText]: value,
        }));
        setAnsweredElements((prevAnswered) => ({
            ...prevAnswered,
            [elementText]: true,
        }));
    };

    const handleCheckboxChange = (value, elementText) => {
        setCheckboxValues((prevValues) => ({
            ...prevValues,
            [elementText]: {
                ...prevValues[elementText],
                [value]: !prevValues[elementText]?.[value],
            },
        }));
        setAnsweredElements((prevAnswered) => ({
            ...prevAnswered,
            [elementText]: true,
        }));
    };

    const [selectedValue, setSelectedValue] = useState(null);
    const handleChange = (event, elementText) => {
        setSelectedValue(event.target.value);
        setAnsweredElements((prevAnswered) => ({
            ...prevAnswered,
            [elementText]: true,
        }));
    };

    const [inputValues, setInputValues] = useState({});
    const handleInputChange = (event, elementText) => {
        const { value } = event.target;
        setInputValues((prevValues) => ({
            ...prevValues,
            [elementText]: value,
        }));
        setAnsweredElements((prevAnswered) => ({
            ...prevAnswered,
            [elementText]: true,
        }));
    };

    const [selectedDropdownValue, setSelectedDropdownValue] = useState('');
    const handleDropdownValueChange = (event, elementText) => {
        setSelectedDropdownValue(event.target.value);
        setAnsweredElements((prevAnswered) => ({
            ...prevAnswered,
            [elementText]: true,
        }));
    };

    const stripHtmlTags = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.innerText || tempDiv.textContent || '';
    };

    const shouldShowElement = (element) => {
        if (!element.questionsectionsettings?.conditional) return true;

        const condition = element.questionsectionsettings?.conditions?.[0];
        if (condition && condition.question && condition.answer) {
            return condition.answer === radioValues[condition.question];
        }
        return true;
    };

    const totalElements = sections[activeStep]?.formElements.length || 0;
    const answeredCount = sections[activeStep]?.formElements.filter(
        (element) => answeredElements[element.text]
    ).length || 0;

    // Check whether to display the section
    const shouldShowSection = (section) => {
        if (!section.sectionsettings?.conditional) return true;

        const condition = section.sectionsettings?.conditions?.[0];
        if (condition && condition.question && condition.answer) {
            return condition.answer === radioValues[condition.question];
        }
        return true;
    };
    // const getVisibleSections = () => {
    //     return sections.filter(shouldShowSection);
    // };
    const getVisibleSections = () => sections.filter(shouldShowSection);
   
    const visibleSections = getVisibleSections();
    const totalSteps = visibleSections.length;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
              <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', border:'2px solid #3FA2F6', p:2, mb:3, borderRadius:'10px', backgroundColor:'#96C9F4'}}>
                <Box >
                    <Typography fontWeight='bold'>Preview mode</Typography>
                    <Typography>The client sees your organizer like this</Typography>
                </Box>
                <Button variant='text' >Back to edit</Button>
              </Box>
                <Typography variant='text' gutterBottom>
                    {organizerName}
                </Typography>

                <FormControl fullWidth sx={{ marginBottom: '10px', marginTop: '10px' }}>
                    <Select
                        value={activeStep}
                        onChange={handleDropdownChange}
                        size='small'
                    >
                        {/* {sections.map((section, index) => (
                            <MenuItem key={index} value={index}>
                                {section.text} ({answeredCount}/{totalElements})
                            </MenuItem>
                        ))} */}
                        {visibleSections.map((section, index) => (
                            <MenuItem key={index} value={index}>
                                {section.text} ({answeredCount}/{totalElements})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box mt={2} mb={2}>
                    <LinearProgress variant="determinate" value={(activeStep + 1) / totalSteps * 100} />
                </Box>

                {/* {sections
                    .filter(shouldShowSection) // Filter sections based on conditions
                    .map((section, sectionIndex) => (
                        sectionIndex === activeStep && ( */}
                        {visibleSections.map((section, sectionIndex) => (
                    sectionIndex === activeStep && (
                            <Box key={section.text}>
                                {section.formElements.map((element) => (
                                    shouldShowElement(element) && (
                                        <Box key={element.text} style={{ marginBottom: '10px' }}>
                                            {(element.type === 'Free Entry' || element.type === 'Number' || element.type === 'Email') && (
                                                <Box>
                                                    <Typography fontSize='18px' mb={2}>{element.text}</Typography>
                                                    <TextField
                                                        variant="outlined"
                                                        size='small'
                                                        multiline
                                                        fullWidth
                                                        margin='normal'
                                                        placeholder={`${element.type} Answer`}
                                                        inputProps={{
                                                            type: element.type === 'Free Entry' ? 'text' : element.type.toLowerCase(),
                                                        }}
                                                        maxRows={8}
                                                        style={{ display: 'block', marginTop: '15px' }}
                                                        value={inputValues[element.text] || ''}
                                                        onChange={(e) => handleInputChange(e, element.text)}
                                                    />
                                                </Box>
                                            )}

                                            {element.type === 'Radio Buttons' && (
                                                <Box>
                                                    <Typography fontSize='18px' mb={2}>{element.text}</Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        {element.options.map((option) => (
                                                            <Button
                                                                key={option.text}
                                                                variant={radioValues[element.text] === option.text ? 'contained' : 'outlined'}
                                                                onClick={() => handleRadioChange(option.text, element.text)}
                                                            >
                                                                {option.text}
                                                            </Button>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}

                                            {element.type === 'Checkboxes' && (
                                                <Box>
                                                    <Typography fontSize='18px' mb={2}>{element.text}</Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        {element.options.map((option) => (
                                                            <Button
                                                                key={option.text}
                                                                variant={checkboxValues[element.text]?.[option.text] ? 'contained' : 'outlined'}
                                                                onClick={() => handleCheckboxChange(option.text, element.text)}
                                                            >
                                                                {option.text}
                                                            </Button>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}

                                            {element.type === 'Yes/No' && (
                                                <Box>
                                                    <Typography fontSize='18px' mb={2}>{element.text}</Typography>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        {element.options.map((option) => (
                                                            <Button
                                                                key={option.text}
                                                                variant={selectedValue === option.text ? 'contained' : 'outlined'}
                                                                onClick={(event) => handleChange(event, element.text)}
                                                            >
                                                                {option.text}
                                                            </Button>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}

                                            {element.type === 'Dropdown' && (
                                                <Box>
                                                    <Typography fontSize='18px' mb={2}>{element.text}</Typography>
                                                    <FormControl fullWidth>
                                                        <Select
                                                            value={selectedDropdownValue}
                                                            onChange={(event) => handleDropdownValueChange(event, element.text)}
                                                            size='small'
                                                        >
                                                            {element.options.map((option) => (
                                                                <MenuItem key={option.text} value={option.text}>
                                                                    {option.text}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            )}

                                            {element.type === 'Date' && (
                                                <Box>
                                                    <Typography fontSize='18px' mb={2}>{element.text}</Typography>
                                                    <DatePicker
                                                        format="DD/MM/YYYY"
                                                        sx={{ width: '100%', backgroundColor: '#fff' }}
                                                        selected={startDate}
                                                        onChange={handleStartDateChange}
                                                        renderInput={(params) => <TextField {...params} size="small" />}
                                                        onOpen={() => setAnsweredElements((prevAnswered) => ({
                                                            ...prevAnswered,
                                                            [element.text]: true,
                                                        }))}
                                                    />
                                                </Box>
                                            )}
                                            {/* File Upload */}
                                            {element.type === "File Upload" && (
                                                <Box>
                                                    <Typography fontSize='18px' mb={2}>{element.text}</Typography>
                                                    <Tooltip title="Unavailable in preview mode" placement="top">
                                                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                                            <Button variant="contained" color="primary" disabled>
                                                                Upload
                                                            </Button>
                                                        </Box>
                                                    </Tooltip>
                                                </Box>
                                            )}
                                            {element.type === "Text Editor" && (
                                                <Box>
                                                    <Typography>{stripHtmlTags(element.text)}</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    )
                                ))}
                            </Box>
                        )
                    ))}

                <Box mt={2}>
                    <Button disabled={activeStep === 0} onClick={handleBack} variant='contained'>
                        Back
                    </Button>
                    <Button onClick={handleNext} disabled={activeStep === totalSteps - 1} variant='contained'>
                        Next
                    </Button>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default OrganizerPreview;
