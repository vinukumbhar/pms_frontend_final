// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// // import Select from "react-select";
// import { toast } from "react-toastify";
// import { FormGroup, Autocomplete, Container, Box, Typography, FormControl, Select, InputLabel, MenuItem, TextField, FormControlLabel, Checkbox, Radio, RadioGroup, Button, FormLabel, Grid, Paper, LinearProgress, Tooltip } from "@mui/material"; // Make sure you have MUI installed
// import { Link } from "react-router-dom";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import dayjs from 'dayjs';
// const CreateOrganizerUpdate = ({ OrganizerData, onClose }) => {

//   const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
//   const { data } = useParams();
//   const [selectedAccounts, setSelectedAccounts] = useState([]);
//   const [selectedOrganizerTemplate, setSelectedOrganizerTemplate] = useState(null);

//   const [organizerName, setOrganizerName] = useState("");

//   const [organizerTemp, setOrganizerTemp] = useState(null);

//   const [sections, setSections] = useState([]);
//   const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
//   useEffect(() => {
//     fetchOrganizerOfAccount(data);
//   }, []);

//   const fetchOrganizerOfAccount = () => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };
//     const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/organizerbyaccount/${data}`;
//     console.log(url);
//     fetch(url, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         const selectedOrganizer = result.organizerAccountWise.find((org) => org._id === OrganizerData);
//         console.log(selectedOrganizer);
//         setOrganizerTemp(selectedOrganizer);

//         setSelectedAccounts(selectedOrganizer.accountid.accountName)

//         setSelectedOrganizerTemplate(selectedOrganizer.organizertemplateid.organizerName)
//         setOrganizerName(selectedOrganizer.organizertemplateid.organizerName);
//         setSections(selectedOrganizer.sections);



//         selectedOrganizer.sections.forEach(section => {
//           section.formElements.forEach(formElement => {
//             console.log(formElement.options.selected);
//           });
//         });
//       })
//       .catch((error) => console.error(error));
//   };


//   const handleNext = () => {
//     if (currentSectionIndex < sections.length - 1) {
//       setCurrentSectionIndex(currentSectionIndex + 1); // Move to the next section
//     }
//   };

//   const handleBack = () => {
//     if (currentSectionIndex > 0) {
//       setCurrentSectionIndex(currentSectionIndex - 1); // Move to the previous section
//     }
//   };
//   console.log(organizerTemp);
//   const handleOrganizerFormClose = () => {
//     onClose();

//   };
//   const createOrganizerOfAccount = () => {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//       accountid: selectedAccounts?.value,
//       organizertemplateid: selectedOrganizerTemplate?.value,

//       jobid: ["661e495d11a097f731ccd6e8"],
//       sections:
//         sections?.map((section) => ({
//           name: section?.text || "",
//           id: section?.id?.toString() || "",
//           text: section?.text || "",
//           formElements:
//             section?.formElements?.map((question) => ({
//               type: question?.type || "",
//               id: question?.id || "",
//               sectionid: question?.sectionid || "",
//               options:
//                 question?.options?.map((option) => ({
//                   id: option?.id || "",
//                   text: option?.text || "",
//                   selected: option?.selected || false,
//                 })) || [],
//               text: question?.text || "",
//               textvalue: question?.textvalue || "",
//               questionsectionsettings: {
//                 required: question?.questionsectionsettings?.required || false,
//                 prefilled: question?.questionsectionsettings?.prefilled || false,
//                 conditional: question?.questionsectionsettings?.conditional || false,
//                 conditions: question?.questionsectionsettings?.conditions || [],
//                 descriptionEnabled: question?.questionsectionsettings?.descriptionEnabled || false,
//                 description: question?.questionsectionsettings?.description || "",
//                 mode: question?.questionsectionsettings?.mode || "Any"  
//               }
//             })) || [],
//         })) || [],
//       active: true,
//     });

//     const requestOptions = {
//       method: "PATCH",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow",
//     };
//     console.log(raw);
//     const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizerTemp._id}`;
//     fetch(url, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         console.log(result);
//         toast.success("Organizer AccountWise Updated successfully");
//         // onClose();
//         handleOrganizerFormClose();
//       })
//       .catch((error) => console.error(error));
//   };

//   //Sections

//   console.log(sections);

//   const stripHtmlTags = (html) => {
//     const tempDiv = document.createElement("div");
//     tempDiv.innerHTML = html;
//     return tempDiv.innerText || tempDiv.textContent || "";
//   };

//   const handleInputChange = (questionId, newValue) => {
//     console.log(questionId, newValue);
//     setSections((prevSections) =>
//       prevSections.map((section) => ({
//         ...section,
//         formElements: section.formElements.map((question) => {
//           if (question.id === questionId) {
//             console.log(`Updating question ${questionId} with value: ${newValue}`); // Debug log
//             return {
//               ...question,
//               textvalue: newValue, // Update with the entire input value
//             };
//           }
//           return question;
//         }),
//       }))
//     );
//   };

//   // const handleRadioToggle = (questionId, selectedOptionId) => {
//   //   setSections((prevSections) =>
//   //     prevSections.map((section) => ({
//   //       ...section,
//   //       formElements: section.formElements.map((question) => {
//   //         if (question.id === questionId) {
//   //           return {
//   //             ...question,
//   //             options: question.options.map((option) => ({
//   //               ...option,
//   //               selected: option.id === selectedOptionId, // Compare based on ID
//   //             })),
//   //           };
//   //         }
//   //         return question;
//   //       }),
//   //     }))
//   //   );

//   // };
//   const [radioValues, setRadioValues] = useState('');
//   console.log(radioValues)
//   const [selectedCheckboxValues, setSelectedCheckboxValues] = useState([]);
//   console.log(selectedCheckboxValues)
//   const [selectedDropdownValue, setSelectedDropdownValue] = useState("");
//   const handleRadioToggle = (questionId, selectedOptionId) => {
//     setSections((prevSections) =>
//       prevSections.map((section) => ({
//         ...section,
//         formElements: section.formElements.map((question) => {
//           if (question.id === questionId) {
//             // Log the selected option
//             const selectedOption = question.options.find(option => option.id === selectedOptionId);
//             console.log('Selected option:', selectedOption);
//             setRadioValues(selectedOption.text)
//             console.log(selectedOption.text)
//             return {
//               ...question,
//               options: question.options.map((option) => ({
//                 ...option,
//                 selected: option.id === selectedOptionId, // Compare based on ID
//               })),
//             };
//           }
//           return question;
//         }),
//       }))
//     );
//   };


//   // const handleCheckboxToggle = (questionId, optionId) => {

//   //   setSections((prevSections) =>
//   //     prevSections.map((section) => ({
//   //       ...section,
//   //       formElements: section.formElements.map((question) => {
//   //         if (question.id === questionId) {
//   //           return {
//   //             ...question,
//   //             options: question.options.map((option) => ({
//   //               ...option,
//   //               selected: option.id === optionId ? !option.selected : option.selected,

//   //             })),

//   //           };
//   //         }
//   //         return question;

//   //       }),

//   //     }))
//   //   );

//   // };




//   // setCheckboxValues(selectedOptionTexts)

//   const handleCheckboxToggle = (questionId, optionId) => {
//     setSections((prevSections) =>
//       prevSections.map((section) => ({
//         ...section,
//         formElements: section.formElements.map((question) => {
//           if (question.id === questionId) {
//             return {
//               ...question,
//               options: question.options.map((option) => ({
//                 ...option,
//                 selected: option.id === optionId ? !option.selected : option.selected,
//               })),
//             };
//           }
//           return question;
//         }),
//       }))
//     );

//      // Update selectedCheckboxValues after toggling
//   setSections((prevSections) => {
//     // Collect IDs of selected checkboxes
//     const checkedValues = prevSections.flatMap((section) =>
//       section.formElements.flatMap((question) =>
//         question.options.filter((option) => option.selected).map((option) => option.text)
//       )
//     );

//     // Store the checked values in selectedCheckboxValues
//     setSelectedCheckboxValues(checkedValues);
//     return prevSections;
//   });
// };


//   const handleDropdownChange = (questionId, selectedOption) => {
//     console.log("Question ID:", questionId);
//     console.log("Selected Option:", selectedOption.text);
//     setSelectedDropdownValue(selectedOption.text)

//     setSections((prevSections) => {
//       const updatedSections = prevSections.map((section) => ({
//         ...section,
//         formElements: section.formElements.map((question) =>
//           question.id === questionId
//             ? { ...question, textvalue: selectedOption ? selectedOption.text : "" }
//             : question
//         ),
//       }));

//       console.log("Updated Sections:", updatedSections); // Check if textvalue is correctly set
//       return updatedSections;
//     });
//   };
//   const handleDateChange = (questionId, newValue) => {
//     // Ensure newValue is a valid dayjs object or null
//     const validDate = newValue ? dayjs(newValue) : null;

//     // Update sections with valid date
//     setSections((prevSections) =>
//       prevSections.map((section) => ({
//         ...section,
//         formElements: section.formElements.map((question) =>
//           question.id === questionId
//             ? { ...question, textvalue: validDate }
//             : question
//         ),
//       }))
//     );
//   };

//   // const shouldShowElement = (section) => {
//   //   if (!section.questionsectionsettings?.conditional) return true;

//   //   const condition = section.questionsectionsettings?.conditions?.[0];
//   //   console.log(condition)
//   //   if (condition && condition.question && condition.answer) {
//   //     const radioAnswer = radioValues;

//   //     // const checkboxAnswer = checkboxValues;
//   //     const dropdownAnswer = selectedDropdownValue;

//   //     // For radio buttons
//   //     if (condition.answer === radioAnswer) {
//   //       return true;
//   //     } else {
//   //       // Handle the case where condition.answer is not equal to radioAnswer
//   //       return false; // or any other behavior you want
//   //     }


//   //     if (condition.answer === dropdownAnswer) {
//   //       return true;
//   //     } else {
//   //       // Handle the case where condition.answer is not equal to radioAnswer
//   //       return false; // or any other behavior you want
//   //     }

//   //   }
//   //   return true;
//   // };

//   const shouldShowElement = (section) => {

//     if (!section.questionsectionsettings?.conditional) return true;

//     const condition = section.questionsectionsettings?.conditions?.[0];
//     console.log(condition);

//     if (condition && condition.question && condition.answer) {
//       const radioAnswer = radioValues; // Ensure this variable is defined

//       const dropdownAnswer = selectedDropdownValue; // Ensure this variable is defined
//       const checkboxAnswers = selectedCheckboxValues; 
//       // Check for radio buttons
//       if (condition.answer === radioAnswer) {
//         return true;
//       }

//       // Check for dropdown
//       if (condition.answer === dropdownAnswer) {
//         return true;
//       }


//     // Check for checkbox (if the answer is in the selected checkboxes)
//    // Check for checkbox
//    console.log("Checkbox Answers:", checkboxAnswers); // Log selected checkbox values
//    if (Array.isArray(checkboxAnswers) && checkboxAnswers.includes(condition.answer)) {
//     //  console.log("Checkbox condition met");
//      return true;
//    } else {
//     //  console.log("Checkbox condition not met");
//    }
//       // If neither condition is met, return false
//       return false;
//     }

//     return true; // If no condition is set, show the element
//   };

//   return (
//     <Container>
//       <Paper elevation={3} style={{ padding: "20px" }}>
//         <Typography variant="h6" gutterBottom>
//           Update Organizer
//         </Typography>

//         <TextField
//           value={selectedAccounts}
//           size="small"
//           fullWidth
//           margin="normal"
//           variant="outlined"
//         />
//         <TextField
//           value={selectedOrganizerTemplate}
//           size="small"
//           fullWidth
//           margin="normal"
//           variant="outlined"
//         />

//         <TextField
//           fullWidth
//           variant="outlined"
//           size="small"
//           placeholder="Organizer Name"
//           value={organizerName}
//           onChange={(e) => setOrganizerName(e.target.value)}
//           style={{ marginBottom: "10px" }}
//           margin="normal"
//         />

//         {/* Render Sections */}
//         <Typography variant="h6" style={{ marginTop: "20px" }}>
//           Sections
//         </Typography>


// {sections.length > 0 && sections[currentSectionIndex] && (
//           <div key={sections[currentSectionIndex].id} style={{ marginBottom: "20px" }}>
//             <Typography variant="subtitle1">{sections[currentSectionIndex].text}</Typography>

//             {sections[currentSectionIndex].formElements && 
//               sections[currentSectionIndex].formElements.map((question, qIndex) => (
//                 shouldShowElement(question) && (
//                 <div key={question.id || qIndex} style={{ marginLeft: "20px", marginTop: "10px" }}>
//                   {["free entry", "Number", "Email"].includes(question.type) && (
//                   <>
//                     <Typography variant="body1">{question.text}</Typography>
//                     <TextField
//                       fullWidth
//                       variant="outlined"
//                       size="small"
//                       margin="normal"
//                       placeholder={`${question.type} Answer`}
//                       value={question.textvalue || ""}
//                       onChange={(e) => handleInputChange(question.id, e.target.value)}
//                     />
//                   </>
//                 )}

//                 {["Radio Buttons", "Yes/No"].includes(question.type) && (
//                   <>
//                     <Typography variant="body1">{question.text}</Typography>

//                     <RadioGroup
//                       value={question.textvalue || ""}

//                     >
//                       {question.options.map((option, oIndex) => (
//                         <FormControlLabel
//                           key={option.id || oIndex}
//                           value={option.text}
//                           control={<Radio checked={option.selected || false} onChange={() => handleRadioToggle(question.id, option.id)} />}
//                           label={option.text}
//                         />
//                       ))}
//                     </RadioGroup>
//                   </>
//                 )}

//                 {question.type === "Checkboxes" && (
//                   <div>
//                     <Typography variant="body1">{question.text}</Typography>
//                     {question.options.map((option, oIndex) => (
//                       <FormControlLabel
//                         key={option.id || oIndex}
//                         control={<Checkbox checked={option.selected || false} onChange={() => handleCheckboxToggle(question.id, option.id)} />}
//                         label={option.text}
//                       />
//                     ))}
//                   </div>
//                 )}

//                 {question.type === "Dropdown" && (
//                   <>
//                     <Typography variant="body1">{question.text}</Typography>

//                     <Autocomplete
//                       value={question.options.find(option => option.text === question.textvalue) || null}
//                       options={question.options}
//                       getOptionLabel={(option) => option.text}
//                       renderInput={(params) => (
//                         <TextField {...params} variant="outlined" size="small" />
//                       )}
//                       onChange={(event, value) => {
//                         handleDropdownChange(question.id, value);
//                       }}
//                     />
//                   </>
//                 )}

//                 {question.type === "Date" && (
//                   <>
//                     <Typography variant="body1">{question.text}</Typography>
//                     <DatePicker
//                       value={question.textvalue ? dayjs(question.textvalue) : null}
//                       onChange={(newValue) => handleDateChange(question.id, newValue)}
//                       renderInput={(params) => (
//                         <TextField {...params} fullWidth variant="outlined" size="small" />
//                       )}
//                       inputFormat="DD/MM/YYYY"
//                     />
//                   </>
//                 )}

//                 {question.type === "Text Editor" && (
//                   <Box mt={2} mb={2}>
//                     <Typography>{stripHtmlTags(question.text)}</Typography>
//                   </Box>
//                 )}
//                 </div>
//                 )
//               ))
//             }
//           </div>
//         )}



// <Grid
//           container
//           spacing={2}
//           style={{ marginTop: "20px", marginLeft: "3px" }}
//           display="flex"
//           gap={3}
//           alignItems="center"
//         >

// <Grid>
//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={handleBack}
//               disabled={currentSectionIndex === 0} // Disable Back button if on first section
//             >
//               Back
//             </Button>
//           </Grid>
//           <Grid>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleNext}
//               disabled={currentSectionIndex === sections.length - 1} // Disable Next button if on last section
//             >
//               Next
//             </Button>
//           </Grid>

//         </Grid>
//         <Grid
//           container
//           spacing={2}
//           style={{ marginTop: "20px", marginLeft: "3px" }}
//           display="flex"
//           gap={3}
//           alignItems="center"
//         >
//           <Grid>
//             <Button variant="contained" color="primary" onClick={createOrganizerOfAccount}>
//               Save
//             </Button>
//           </Grid>
//           <Grid>
//             <Button variant="outlined" color="secondary" onClick={handleOrganizerFormClose}>
//               Cancel
//             </Button>
//           </Grid>
//         </Grid>
//       </Paper>
//     </Container>
//   );



// };

// export default CreateOrganizerUpdate;


//         {/* {sections.map((section, index) => (
//           <div key={section.id || index} style={{ marginBottom: "20px" }}>
//             <Typography variant="subtitle1">{section.text}</Typography>

//             {section.formElements && section.formElements.map((question, qIndex) => (
//               <div key={question.id || qIndex} style={{ marginLeft: "20px", marginTop: "10px" }}>



//                 {["free entry", "Number", "Email"].includes(question.type) && (
//                   <>
//                     <Typography variant="body1">{question.text}</Typography>
//                     <TextField
//                       fullWidth
//                       variant="outlined"
//                       size="small"
//                       margin="normal"
//                       placeholder={`${question.type} Answer`}
//                       value={question.textvalue || ""}
//                       onChange={(e) => handleInputChange(question.id, e.target.value)}
//                     />
//                   </>
//                 )}

//                 {["Radio Buttons", "Yes/No"].includes(question.type) && (
//                   <>
//                     <Typography variant="body1">{question.text}</Typography>

//                     <RadioGroup
//                       value={question.textvalue || ""}

//                     >
//                       {question.options.map((option, oIndex) => (
//                         <FormControlLabel
//                           key={option.id || oIndex}
//                           value={option.text}
//                           control={<Radio checked={option.selected || false} onChange={() => handleRadioToggle(question.id, option.id)} />}
//                           label={option.text}
//                         />
//                       ))}
//                     </RadioGroup>
//                   </>
//                 )}

// {question.type === "Checkboxes" && (
//   <div>
//     <Typography variant="body1">{question.text}</Typography>
//     {question.options.map((option, oIndex) => (
//       <FormControlLabel
//         key={option.id || oIndex}
//         control={<Checkbox checked={option.selected || false} onChange={() => handleCheckboxToggle(question.id, option.id)} />}
//         label={option.text}
//       />
//     ))}
//   </div>
// )}

//                 {question.type === "Dropdown" && (
//                   <>
//                     <Typography variant="body1">{question.text}</Typography>

//                     <Autocomplete
//                       value={question.options.find(option => option.text === question.textvalue) || null}
//                       options={question.options}
//                       getOptionLabel={(option) => option.text}
//                       renderInput={(params) => (
//                         <TextField {...params} variant="outlined" size="small" />
//                       )}
//                       onChange={(event, value) => {
//                         handleDropdownChange(question.id, value);
//                       }}
//                     />
//                   </>
//                 )}

//                 {question.type === "Date" && (
//                   <>
//                     <Typography variant="body1">{question.text}</Typography>
//                     <DatePicker
//                       value={question.textvalue ? dayjs(question.textvalue) : null}
//                       onChange={(newValue) => handleDateChange(question.id, newValue)}
//                       renderInput={(params) => (
//                         <TextField {...params} fullWidth variant="outlined" size="small" />
//                       )}
//                     />
//                   </>
//                 )}

//                 {question.type === "Text Editor" && (
//                   <Box mt={2} mb={2}>
//                     <Typography>{stripHtmlTags(question.text)}</Typography>
//                   </Box>
//                 )}
//               </div>
//             ))}
//           </div>
//         ))} */}
// // {sections.map(
// //   (section, sectionIndex) =>
// //     sectionIndex === activeStep && (
// //       <Box key={section.text}>
// //         {section.formElements.map(
// //           (element) =>
// //             shouldShowElement(element) && (
// //               <Box key={element.text}>
// //                 {(element.type === "Free Entry" || element.type === "Number" || element.type === "Email") && (
// //                   <Box>
// //                     <Typography fontSize="18px" mb={1} mt={1}>
// //                       {element.text}
// //                     </Typography>
// //                     <TextField
// //                       variant="outlined"
// //                       size="small"
// //                       multiline
// //                       fullWidth

// //                       placeholder={`${element.type} Answer`}
// //                       inputProps={{
// //                         type: element.type === "Free Entry" ? "text" : element.type.toLowerCase(),
// //                       }}
// //                       maxRows={8}
// //                       style={{ display: "block", marginTop: "15px" }}

// //                       onChange={(e) => handleInputChange(e, element.text)}
// //                     />
// //                   </Box>
// //                 )}

// //                 {element.type === "Radio Buttons" && (
// //                   <Box>
// //                     <Typography fontSize="18px" mb={1} mt={1}>
// //                       {element.text}
// //                     </Typography>
// //                     <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
// //                       {element.options.map((option) => (
// //                         <Button key={option.text} variant={radioValues[element.text] === option.text ? "contained" : "outlined"} onClick={() => handleRadioChange(option.text, element.text)}>
// //                           {option.text}
// //                         </Button>
// //                       ))}
// //                     </Box>
// //                   </Box>
// //                 )}

// //                 {element.type === "Checkboxes" && (
// //                   <Box>
// //                     <Typography fontSize="18px">{element.text}</Typography>
// //                     <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
// //                       {element.options.map((option) => (
// //                         <Button key={option.text} variant={checkboxValues[element.text]?.[option.text] ? "contained" : "outlined"} onClick={() => handleCheckboxChange(option.text, element.text)}>
// //                           {option.text}
// //                         </Button>
// //                       ))}
// //                     </Box>
// //                   </Box>
// //                 )}

// //                 {element.type === "Yes/No" && (
// //                   <Box>
// //                     <Typography fontSize="18px">{element.text}</Typography>
// //                     <Box sx={{ display: "flex", gap: 1 }}>
// //                       {element.options.map((option) => (
// //                         <Button key={option.text} variant={selectedValue === option.text ? "contained" : "outlined"} onClick={(event) => handleChange(event, element.text)}>
// //                           {option.text}
// //                         </Button>
// //                       ))}
// //                     </Box>
// //                   </Box>
// //                 )}

// //                 {element.type === "Dropdown" && (
// //                   <Box>
// //                     <Typography fontSize="18px">{element.text}</Typography>
// //                     <FormControl fullWidth>
// //                       <Select value={selectedDropdownValue} onChange={(event) => handleDropdownValueChange(event, element.text)} size="small">
// //                         {element.options.map((option) => (
// //                           <MenuItem key={option.text} value={option.text}>
// //                             {option.text}
// //                           </MenuItem>
// //                         ))}
// //                       </Select>
// //                     </FormControl>
// //                   </Box>
// //                 )}

// //                 {element.type === "Date" && (
// //                   <Box>
// //                     <Typography fontSize="18px">{element.text}</Typography>
// //                     <DatePicker
// //                       format="DD/MM/YYYY"
// //                       sx={{ width: "100%", backgroundColor: "#fff" }}
// //                       selected={startDate}
// //                       onChange={handleStartDateChange}
// //                       renderInput={(params) => <TextField {...params} size="small" />}

// //                     />
// //                   </Box>
// //                 )}
// //                 {/* File Upload */}
// //                 {element.type === "File Upload" && (
// //                   <Box>
// //                     <Typography fontSize="18px" mb={1} mt={2}>
// //                       {element.text}
// //                     </Typography>

// //                     <Tooltip title="Unavailable in preview mode" placement="top">
// //                       <Box sx={{ position: "relative", width: "100%" }}>
// //                         <TextField
// //                           variant="outlined"
// //                           size="small"
// //                           fullWidth
// //                           // margin="normal"
// //                           disabled
// //                           placeholder="Add Document"
// //                           sx={{
// //                             cursor: "not-allowed",
// //                             "& .MuiInputBase-input": {
// //                               pointerEvents: "none",
// //                               cursor: "not-allowed",
// //                             },
// //                           }}
// //                         />
// //                       </Box>
// //                     </Tooltip>
// //                   </Box>
// //                 )}
// //                 {element.type === "Text Editor" && (
// //                   <Box mt={2} mb={2}>
// //                     <Typography>{stripHtmlTags(element.text)}</Typography>
// //                   </Box>
// //                 )}
// //               </Box>
// //             )
// //         )}
// //       </Box>
// //     )
// // )}





import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// import Select from "react-select";
import { toast } from "react-toastify";
import { FormGroup, Autocomplete, Container, Box, Typography, FormControl, Select, InputLabel, MenuItem, TextField, FormControlLabel, Checkbox, Radio, RadioGroup, Button, FormLabel, Grid, Paper, LinearProgress, Tooltip } from "@mui/material"; // Make sure you have MUI installed
import { Link } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
const CreateOrganizerUpdate = ({ OrganizerData, onClose }) => {

  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const { data } = useParams();
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedOrganizerTemplate, setSelectedOrganizerTemplate] = useState(null);

  const [organizerName, setOrganizerName] = useState("");

  const [organizerTemp, setOrganizerTemp] = useState(null);

  const [sections, setSections] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  useEffect(() => {
    fetchOrganizerOfAccount(data);
  }, []);

  const fetchOrganizerOfAccount = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/organizerbyaccount/${data}`;
    console.log(url);
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const selectedOrganizer = result.organizerAccountWise.find((org) => org._id === OrganizerData);
        console.log(selectedOrganizer);
        setOrganizerTemp(selectedOrganizer);

        setSelectedAccounts(selectedOrganizer.accountid.accountName)

        setSelectedOrganizerTemplate(selectedOrganizer.organizertemplateid.organizerName)
        setOrganizerName(selectedOrganizer.organizertemplateid.organizerName);
        setSections(selectedOrganizer.sections);



        selectedOrganizer.sections.forEach(section => {
          section.formElements.forEach(formElement => {
            console.log(formElement.options.selected);
          });
        });
      })
      .catch((error) => console.error(error));
  };


  // const handleNext = () => {
  //   if (currentSectionIndex < sections.length - 1) {
  //     setCurrentSectionIndex(currentSectionIndex + 1); // Move to the next section
  //   }
  // };

  // const handleBack = () => {
  //   if (currentSectionIndex > 0) {
  //     setCurrentSectionIndex(currentSectionIndex - 1); // Move to the previous section
  //   }
  // };
  console.log(organizerTemp);
  const handleOrganizerFormClose = () => {
    onClose();

  };
  const createOrganizerOfAccount = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountid: selectedAccounts?.value,
      organizertemplateid: selectedOrganizerTemplate?.value,
      jobid: ["661e495d11a097f731ccd6e8"],
      sections: visibleSections.map(section => ({
        id: section.id,
        name: section.name,
        text: section.text,
        sectionsettings: {
          conditional: section?.sectionsettings?.conditional || false,
          conditions: section?.sectionsettings?.conditions || [],
        },
        formElements: section.formElements.map(element => ({
          type: element.type,
          id: element.id,
          sectionid: section.id,
          options: element.options.map(option => ({
            id: option.id,
            text: option.text,
            selected:
              (element.type === "Radio" && radioValues[element.text] === option.text) ||
              (element.type === "Checkbox" && checkboxValues[element.text]?.[option.text]) ||
              (element.type === "Dropdown" && option.text === selectedDropdownValue) || // For Dropdown
              option.selected,

          })),
          text: element.text,
          textvalue: inputValues[element.text] || element.textvalue || "", // For "Free Entry", "Number", "Email", etc.
          questionsectionsettings: {
            required: element?.questionsectionsettings?.required || false,
            prefilled: element?.questionsectionsettings?.prefilled || false,
            conditional: element?.questionsectionsettings?.conditional || false,
            conditions: element?.questionsectionsettings?.conditions || [],
            descriptionEnabled: element?.questionsectionsettings?.descriptionEnabled || false,
            description: element?.questionsectionsettings?.description || "",
            mode: element?.questionsectionsettings?.mode || "Any"
          }
        })),
      })),
      active: true, // or based on some condition
      issealed: false, // Set based on your logic
    });
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(raw);
    const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizerTemp._id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success("Organizer AccountWise Updated successfully");
        // onClose();

        handleOrganizerFormClose();
      })
      .catch((error) => console.error(error));
  };
  //Preview
  const [startDate, setStartDate] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [answeredElements, setAnsweredElements] = useState({});
  const [radioValues, setRadioValues] = useState({});
  const [checkboxValues, setCheckboxValues] = useState({});
  const [selectedDropdownValue, setSelectedDropdownValue] = useState("");
  const [inputValues, setInputValues] = useState({});
  const [selectedValue, setSelectedValue] = useState(null);
  // const shouldShowSection = (section) => {
  //   if (!section.sectionsettings?.conditional) return true;

  //   const condition = section.sectionsettings?.conditions?.[0];
  //   if (condition && condition.question && condition.answer) {
  //     const radioAnswer = radioValues[condition.question];
  //     const checkboxAnswer = checkboxValues[condition.question];
  //     const dropdownAnswer = selectedDropdownValue;
  //     // For radio buttons
  //     if (radioAnswer !== undefined && condition.answer === radioAnswer) {
  //       return true;
  //     }
  //     // For checkboxes: check if the condition answer is in the selected checkbox values
  //     if (checkboxAnswer && checkboxAnswer[condition.answer]) {
  //       return true;
  //     }
  //     // For dropdowns: check if the condition answer matches the selected dropdown value
  //     if (dropdownAnswer !== undefined && condition.answer === dropdownAnswer) {
  //       return true;
  //     }
  //     return false;
  //   }
  //   return true;
  // };


  // const shouldShowSection = (section) => {
  //   if (!section.sectionsettings?.conditional) return true;

  //   const condition = section.sectionsettings?.conditions?.[0];

  //   if (condition && condition.question && condition.answer) {
  //     console.log(condition)
  //     // console.log(condition.question)
  //     // console.log(condition.answer)
  //     const radioAnswer = condition.question;
  //     const checkboxAnswer = condition.question;
  //     const dropdownAnswer = condition.question; 

  //     console.log(checkboxAnswer)
  //     // Handle checkboxes condition
  //     if (checkboxAnswer !== undefined) {
  //       const checkboxElement = visibleSections.flatMap(section => section.formElements)
  //         .find(elem => elem.type === "Checkboxes" && elem.text === condition.question);

  //       const isCheckboxOptionSelected = checkboxElement?.options.some(option =>
  //         option.text === condition.answer && option.selected);

  //       // Check if checkbox answer matches or if the specific checkbox option is selected
  //       if (checkboxAnswer === condition.answer || isCheckboxOptionSelected) {
  //         return true; // Show the element if the checkbox condition matches
  //       }
  //     }
  //     console.log(radioAnswer)
  //     // Handle radio buttons condition
  //     if (radioAnswer !== undefined) {
  //       const radioElement = visibleSections.flatMap(section => section.formElements)
  //         .find(elem => elem.type === "Radio Buttons" && elem.text === condition.question);

  //       const isRadioOptionSelected = radioElement?.options.some(option =>
  //         option.text === condition.answer && option.selected);

  //       // Check if radio answer matches or if the specific radio option is selected
  //       if (radioAnswer === condition.answer || isRadioOptionSelected) {
  //         return true; // Show the element if the radio button condition matches
  //       }
  //     }

  //     // Handle dropdown condition
  //     if (dropdownAnswer !== undefined) {
  //       const dropdownElement = visibleSections.flatMap(section => section.formElements)
  //           .find(elem => elem.type === "Dropdown" && elem.text === condition.question);

  //       // Check if the dropdown's selected value matches the condition's answer
  //       if (dropdownElement?.textvalue === condition.answer) {
  //           return true;
  //       }
  //   }

  //     // If neither condition matches, hide the element
  //     return false;
  //   }

  //   return true; // Show the element if no conditional logic is applied
  // };

  // const getVisibleSections = () => sections.filter(shouldShowSection);
  // const visibleSections = getVisibleSections();

  // const shouldShowSection = (section, allSections) => {
  //   if (!section.sectionsettings?.conditional) return true;

  //   const condition = section.sectionsettings?.conditions?.[0];

  //   if (condition && condition.question && condition.answer) {
  //     const questionText = condition.question;

  //     // Handle checkboxes condition
  //     const checkboxElement = allSections.flatMap(sec => sec.formElements)
  //       .find(elem => elem.type === "Checkboxes" && elem.text === questionText);

  //     if (checkboxElement) {
  //       const isCheckboxOptionSelected = checkboxElement.options.some(option =>
  //         option.text === condition.answer && option.selected);

  //       if (isCheckboxOptionSelected) return true;
  //     }

  //     // Handle radio buttons condition
  //     const radioElement = allSections.flatMap(sec => sec.formElements)
  //       .find(elem => elem.type === "Radio Buttons" && elem.text === questionText);

  //     if (radioElement) {
  //       const isRadioOptionSelected = radioElement.options.some(option =>
  //         option.text === condition.answer && option.selected);

  //       if (isRadioOptionSelected) return true;
  //     }

  //     // Handle dropdown condition
  //     const dropdownElement = allSections.flatMap(sec => sec.formElements)
  //       .find(elem => elem.type === "Dropdown" && elem.text === questionText);

  //     if (dropdownElement?.textvalue === condition.answer) return true;

  //     return false; // None of the conditions match
  //   }

  //   return true; // Show the section if no conditions are defined
  // };


  const shouldShowSection = (section, allSections) => {
    if (!section.sectionsettings?.conditional) return true;

    const conditions = section.sectionsettings?.conditions || [];

    // Check if all conditions are true
    return conditions.every(condition => {
      if (!condition.question || !condition.answer) return false;

      const questionText = condition.question;

      // Handle checkboxes condition
      const checkboxElement = allSections.flatMap(sec => sec.formElements)
        .find(elem => elem.type === "Checkboxes" && elem.text === questionText);

      if (checkboxElement) {
        const isCheckboxOptionSelected = checkboxElement.options.some(option =>
          option.text === condition.answer && option.selected);

        if (isCheckboxOptionSelected) return true;
      }

      // Handle radio buttons condition
      const radioElement = allSections.flatMap(sec => sec.formElements)
        .find(elem => elem.type === "Radio Buttons" && elem.text === questionText);

      if (radioElement) {
        const isRadioOptionSelected = radioElement.options.some(option =>
          option.text === condition.answer && option.selected);

        if (isRadioOptionSelected) return true;
      }

      // Handle dropdown condition
      const dropdownElement = allSections.flatMap(sec => sec.formElements)
        .find(elem => elem.type === "Dropdown" && elem.text === questionText);

      if (dropdownElement?.textvalue === condition.answer) return true;

      // If none of the conditions are met for this condition, return false
      return false;
    });
  };

  const getVisibleSections = () => sections.filter(section => shouldShowSection(section, sections));
  const visibleSections = getVisibleSections();
  // console.log(visibleSections);

  console.log(visibleSections)

  const handleInputChange = (event, elementText) => {
    console.log(event, elementText);
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

  const totalSteps = visibleSections.length;
  const totalElements = sections[activeStep]?.formElements.length || 0;
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




  //  const shouldShowElement = (element) => {
  //     if (!element.questionsectionsettings?.conditional) return true;

  //     const condition = element.questionsectionsettings?.conditions?.[0];

  //     if (condition && condition.question && condition.answer) {
  //       // console.log(condition)
  //       // console.log(condition.question)
  //       // console.log(condition.answer)
  //       const radioAnswer = condition.question;
  //       const checkboxAnswer = condition.question;
  //       const dropdownAnswer = condition.question; 

  //       console.log(checkboxAnswer)
  //       // Handle checkboxes condition
  //       if (checkboxAnswer !== undefined) {
  //         const checkboxElement = visibleSections.flatMap(section => section.formElements)
  //           .find(elem => elem.type === "Checkboxes" && elem.text === condition.question);

  //         const isCheckboxOptionSelected = checkboxElement?.options.some(option =>
  //           option.text === condition.answer && option.selected);

  //         // Check if checkbox answer matches or if the specific checkbox option is selected
  //         if (checkboxAnswer === condition.answer || isCheckboxOptionSelected) {
  //           return true; // Show the element if the checkbox condition matches
  //         }
  //       }
  //       console.log(radioAnswer)
  //       // Handle radio buttons condition
  //       if (radioAnswer !== undefined) {
  //         const radioElement = visibleSections.flatMap(section => section.formElements)
  //           .find(elem => elem.type === "Radio Buttons" && elem.text === condition.question);

  //         const isRadioOptionSelected = radioElement?.options.some(option =>
  //           option.text === condition.answer && option.selected);

  //         // Check if radio answer matches or if the specific radio option is selected
  //         if (radioAnswer === condition.answer || isRadioOptionSelected) {
  //           return true; // Show the element if the radio button condition matches
  //         }
  //       }

  //       // Handle dropdown condition
  //       if (dropdownAnswer !== undefined) {
  //         const dropdownElement = visibleSections.flatMap(section => section.formElements)
  //             .find(elem => elem.type === "Dropdown" && elem.text === condition.question);

  //         // Check if the dropdown's selected value matches the condition's answer
  //         if (dropdownElement?.textvalue === condition.answer) {
  //             return true;
  //         }
  //     }

  //       // If neither condition matches, hide the element
  //       return false;
  //     }

  //     return true; // Show the element if no conditional logic is applied
  //   }; 

  const shouldShowElement = (element) => {
    if (!element.questionsectionsettings?.conditional) return true;

    const conditions = element.questionsectionsettings?.conditions || [];

    // Ensure all conditions are true
    return conditions.every((condition) => {
      if (!condition.question || !condition.answer) return false;

      // Handle checkboxes condition
      const checkboxElement = visibleSections
        .flatMap(section => section.formElements)
        .find(elem => elem.type === "Checkboxes" && elem.text === condition.question);

      const isCheckboxOptionSelected = checkboxElement?.options.some(option =>
        option.text === condition.answer && option.selected);

      if (checkboxElement && (checkboxElement.text === condition.answer || isCheckboxOptionSelected)) {
        return true;
      }

      // Handle radio buttons condition
      const radioElement = visibleSections
        .flatMap(section => section.formElements)
        .find(elem => elem.type === "Radio Buttons" && elem.text === condition.question);

      const isRadioOptionSelected = radioElement?.options.some(option =>
        option.text === condition.answer && option.selected);

      if (radioElement && (radioElement.text === condition.answer || isRadioOptionSelected)) {
        return true;
      }

      // Handle dropdown condition
      const dropdownElement = visibleSections
        .flatMap(section => section.formElements)
        .find(elem => elem.type === "Dropdown" && elem.text === condition.question);

      if (dropdownElement?.textvalue === condition.answer) {
        return true;
      }

      // If none of the conditions match, return false
      return false;
    });
  };


  const handleRadioChange = (optionText, elementText) => {
    setRadioValues(prev => ({
      ...prev,
      [elementText]: optionText,
    }));

    visibleSections.forEach(section => {
      section.formElements.forEach(elem => {
        if (elem.type === "Radio Buttons" && elem.text === elementText) {
          elem.options.forEach(option => {
            option.selected = option.text === optionText;
          });
        }
      });
    });
  };

  const handleCheckboxChange = (optionText, elementText, isChecked) => {
    setCheckboxValues(prev => {
      const currentValues = prev[elementText] || [];
      const updatedValues = isChecked
        ? [...currentValues, optionText] // Add the option if checked
        : currentValues.filter(value => value !== optionText); // Remove the option if unchecked

      return {
        ...prev,
        [elementText]: updatedValues,
      };
    });


    visibleSections.forEach(section => {
      section.formElements.forEach(elem => {
        if (elem.type === "Checkboxes" && elem.text === elementText) {
          elem.options.forEach(option => {
            if (option.text === optionText) {
              option.selected = isChecked; // Update the selected state
            }
          });
        }
      });
    });
  };




  const handleChange = (event, elementText) => {
    setSelectedValue(event.target.value);
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [elementText]: true,
    }));
  };


  const handleDropdownValueChange = (event, element, newValue) => {
    // Update the selected value in your options array
    element.options.forEach((option) => {
      option.selected = option.text === newValue; // Ensure only one option is selected
    });

    // Update the dropdown's text value if necessary
    element.textvalue = newValue;

    console.log(`Updated dropdown "${element.text}" with selected value: ${newValue}`);

    setSelectedDropdownValue(newValue)
    // Iterate through the sections and form elements to update the options
    visibleSections.forEach((section) => {
      section.formElements.forEach((elem) => {
        if (elem.type === "Dropdown" && elem.text === element) {
          elem.options.forEach((option) => {
            option.selected = option.text === newValue; // Ensure only one option is selected
          });
          elem.textvalue = newValue; // Update the dropdown's text value
        }
      });
    });

  };



  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.innerText || tempDiv.textContent || "";
  };

  const fileInputRef = useRef(null); // Reference to the hidden file input
  const [message, setMessage] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("accountId", data); // Replace with dynamic account ID

    try {
      const response = await axios.post("http://127.0.0.1:8002/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("File upload failed.");
      console.error(error);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically click the file input
    }
  };
  return (
    <Container>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Typography variant="h6" gutterBottom>
          Update Organizer
        </Typography>

        <TextField
          value={selectedAccounts}
          size="small"
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          value={selectedOrganizerTemplate}
          size="small"
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Organizer Name"
          value={organizerName}
          onChange={(e) => setOrganizerName(e.target.value)}
          style={{ marginBottom: "10px" }}
          margin="normal"
        />

        {/* Render Sections */}
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Sections
        </Typography>

        {visibleSections.map(
          (section, sectionIndex) =>
            sectionIndex === activeStep && (
              <Box key={section.text}>
                {section.formElements.map(
                  (element) =>
                    shouldShowElement(element) && (

                      <Box key={element.text}>
                        {(element.type === "Free Entry" || element.type === "Number" || element.type === "Email") && (
                          <Box>
                            <Typography fontSize="18px" mb={1} mt={1}>
                              {element.text}
                            </Typography>
                            <TextField
                              variant="outlined"
                              size="small"
                              multiline
                              fullWidth
                              // margin='normal'
                              placeholder={`${element.type} Answer`}
                              inputProps={{
                                type: element.type === "Free Entry" ? "text" : element.type.toLowerCase(),
                              }}
                              maxRows={8}
                              style={{ display: "block", marginTop: "15px" }}
                              value={inputValues[element.text] || element.textvalue || ""}
                              onChange={(e) => handleInputChange(e, element.text)}
                            />
                          </Box>
                        )}

                        {/* {element.type === "Radio Buttons" && (
                          <Box>
                            <Typography fontSize="18px" mb={1} mt={1}>
                              {element.text}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                              {element.options.map((option) => (
                                <Button key={option.text}
                                  variant={radioValues[element.text] === option.text || option.selected ? "contained" : "outlined"}

                                  onClick={() => handleRadioChange(option.text, element.text)}>
                                  {option.text}
                                </Button>
                              ))}
                            </Box>
                          </Box>
                        )} */}
                        {element.type === "Radio Buttons" && (
                          <Box>
                            <Typography fontSize="18px" mb={1} mt={1}>
                              {element.text}
                            </Typography>
                            <FormControl>
                              <RadioGroup
                                value={radioValues[element.text] || ""}
                                onChange={(event) => handleRadioChange(event.target.value, element.text)}
                              >
                                {element.options.map((option) => (
                                  <FormControlLabel
                                    key={option.text}
                                    value={option.text}
                                    control={<Radio checked={radioValues[element.text] === option.text || option.selected || false} />}
                                    label={option.text}
                                  />
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </Box>
                        )}

                        {element.type === "Checkboxes" && (
                          <div>
                            <Typography variant="body1">{element.text}</Typography>
                            {element.options.map((option, oIndex) => (

                              <FormControlLabel

                                key={option.text || oIndex}
                                control={

                                  <Checkbox

                                    // checked={checkboxValues[option.selected]}
                                    checked={checkboxValues[element.text || element.selected]?.includes(option.text) || option.selected}
                                    onChange={(e) => handleCheckboxChange(option.text, element.text, e.target.checked)}
                                  />
                                }
                                label={option.text}
                              />
                            ))}
                          </div>
                        )}
                        {element.type === "Yes/No" && (
                          <Box>
                            <Typography fontSize="18px">{element.text}</Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              {element.options.map((option) => (
                                <Button key={option.text} variant={selectedValue === option.text ? "contained" : "outlined"} onClick={(event) => handleChange(event, element.text)}>
                                  {option.text}
                                </Button>
                              ))}
                            </Box>
                          </Box>
                        )}

                        {/* {element.type === "Dropdown" && (
                          <Box>
                            <Typography fontSize="18px">{element.text}</Typography>
                            <FormControl fullWidth>
                              <Select value={selectedDropdownValue || (element.options.find(option => option.selected)?.text || '')} onChange={(event) => handleDropdownValueChange(event, element.text)} size="small">
                                {element.options.map((option) => (
                                  <MenuItem key={option.text} value={option.text}>
                                    {option.text}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        )} */}

                        {element.type === "Dropdown" && (
                          <Box>
                            <Typography fontSize="18px">{element.text}</Typography>
                            <FormControl fullWidth>
                              <Autocomplete
                                value={selectedDropdownValue || (element.options.find(option => option.selected)?.text || '')}
                                onChange={(event, newValue) => handleDropdownValueChange(event, element, newValue)}
                                options={element.options.map(option => option.text)}
                                renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                                disableClearable
                                isOptionEqualToValue={(option, value) => option === value}
                                getOptionLabel={(option) => option}
                              />
                            </FormControl>
                          </Box>
                        )}

                        {element.type === "Date" && (
                          <Box>
                            <Typography fontSize="18px">{element.text}</Typography>
                            <DatePicker
                              format="DD/MM/YYYY"
                              sx={{ width: "100%", backgroundColor: "#fff" }}
                              selected={startDate}
                              onChange={handleStartDateChange}
                              renderInput={(params) => <TextField {...params} size="small" />}
                              onOpen={() =>
                                setAnsweredElements((prevAnswered) => ({
                                  ...prevAnswered,
                                  [element.text]: true,
                                }))
                              }
                            />
                          </Box>
                        )}
                        {/* File Upload */}
                        {element.type === "File Upload" && (
                          <Box>
                            <Typography fontSize="18px" mb={1} mt={2}>
                              {element.text}
                            </Typography>

                            {/* <Tooltip title="Unavailable in preview mode" placement="top">
                              <Box sx={{ position: "relative", width: "100%" }}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  // margin="normal"
                                  disabled
                                  placeholder="Add Document"
                                  sx={{
                                    cursor: "not-allowed",
                                    "& .MuiInputBase-input": {
                                      pointerEvents: "none",
                                      cursor: "not-allowed",
                                    },
                                  }}
                                />
                              </Box>
                            </Tooltip> */}
                            <Button component="label" variant="outlined" tabIndex={-1} startIcon={<CloudUploadIcon />} onClick={triggerFileInput}>
                              Upload files
                            </Button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              style={{ display: "none" }} // Hide the input element
                              onChange={handleFileUpload} // Handle file selection
                            />
                            {message && <p>{message}</p>}
                          </Box>
                        )}
                        {element.type === "Text Editor" && (
                          <Box mt={2} mb={2}>
                            <Typography>{stripHtmlTags(element.text)}</Typography>
                          </Box>
                        )}
                      </Box>
                    )
                )}
              </Box>
            )
        )}

        <Grid
          container
          spacing={2}
          style={{ marginTop: "20px", marginLeft: "3px" }}
          display="flex"
          gap={3}
          alignItems="center"
        >
          <Box mt={3} display="flex" gap={3} alignItems="center">
            <Button disabled={activeStep === 0} onClick={handleBack} variant="contained">
              Back
            </Button>
            <Button onClick={handleNext} disabled={activeStep === totalSteps - 1} variant="contained">
              Next
            </Button>
          </Box>
        </Grid>
        <Grid
          container
          spacing={2}
          style={{ marginTop: "20px", marginLeft: "3px" }}
          display="flex"
          gap={3}
          alignItems="center"
        >
          <Grid>
            <Button variant="contained" color="primary" onClick={createOrganizerOfAccount}>
              Save
            </Button>
          </Grid>
          <Grid>
            <Button variant="outlined" color="secondary" onClick={handleOrganizerFormClose}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );



};

export default CreateOrganizerUpdate;

