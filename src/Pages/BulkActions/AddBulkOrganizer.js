import { Box, Typography, Divider, Dialog, Tooltip, FormControlLabel, Switch, InputLabel, DialogContent, Select, LinearProgress, Autocomplete, TextField, MenuItem, Chip, Container, Button, Checkbox, FormControl } from "@mui/material";
import { useState, useEffect } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";

const AddBulkOrganizer = ({ selectedAccounts, onClose }) => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const { data } = useParams();

  const [organizerTemplate, setOrganizerTemplate] = useState([]);
  const [selectedOrganizerTemplate, setSelectedOrganizerTemplate] = useState("");
  const [selectedAccount, setSelectedAccount] = useState([]);
  const [showOrganizerForm, setShowOrganizerForm] = useState(false);
  const [organizeraccountwise, setorganizeraccountwise] = useState();
  const [selectedOrganizerTempData, setSelectedOrganizerTempData] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    fetchOrganizerTemplateData();
    fetchAccountsData();
  }, []);

  const fetchOrganizerTemplateData = async () => {
    try {
      const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/`;
      const response = await fetch(url);
      const result = await response.json();
      setOrganizerTemplate(result.OrganizerTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [accountData, setAccountData] = useState([]);
  const [accountoptions, setAccountOptions] = useState([]);
  const [combinedaccountValues, setCombinedaccountValues] = useState([]);

  const fetchAccountsData = async () => {
    try {
      const url = `${ACCOUNT_API}/accounts/account/accountdetailslist/`;
      const response = await fetch(url);
      const result = await response.json();

      if (Array.isArray(result.accountlist)) {
        setAccountData(result.accountlist);
        console.log(result.accountlist);

        // Map accounts to options
        const options = result.accountlist.map((account) => ({
          value: account.id,
          label: account.Name,
        }));
        setAccountOptions(options);

        // Filter options based on selectedAccounts
        const selectedOptions = options.filter((option) => selectedAccounts.includes(option.value));
        console.log("Selected Options:", selectedOptions);
        setSelectedAccount(selectedOptions);
        setCombinedaccountValues(selectedOptions.map((option) => option.value));
      } else {
        console.error("Account list is not an array", result.accountlist);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleOrganizerTemplateChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOrganizerTemplate(selectedValue);
    // Fetch data based on selected value
    fetchOrganizerTemplateDataByTempId(selectedValue);
  };
  // const [sections, setSections] = useState([]);
  const [sections, setSections] = useState([]);
  const [organizerName, setOrganizerName] = useState("");

  const fetchOrganizerTemplateDataByTempId = async (selectedOrganizerTempid) => {
    try {
      const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${selectedOrganizerTempid}`;
      const response = await fetch(url);
      const result = await response.json();
      console.log(result);
      console.log(result.organizerTemplate.sections);
      setSelectedOrganizerTempData(result.organizerTemplate);
      setSections(result.organizerTemplate.sections);
      setOrganizerName(result.organizerTemplate.organizerName);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log(selectedOrganizerTempData);

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  const handlePreview = () => {
    setPreviewDialogOpen(true); // Open the dialog
    // console.log(selectedOrganizerTempData.sections);
    const sections = selectedOrganizerTempData.sections;
    const data = {
      sections, // sections // This contains all your sections and their elements
    };
    console.log("Data for preview:", data);
  };

  console.log(sections);
  console.log(accountData);
  console.log(selectedOrganizerTempData);
  console.log(selectedAccount);
  console.log(selectedOrganizerTemplate);

  const handleAccountChange = (event, newValue) => {
    setSelectedAccount(newValue);
    console.log("Selected Options:", newValue); // Log full option objects
    console.log(
      "Selected Values:",
      newValue.map((option) => option.value)
    ); // Log just the values

    // If you need to set combined account values separately
    setCombinedaccountValues(newValue.map((option) => option.value));
  };

  //   const AccountsOptions = (accountData || []).map((account) => ({
  //     value: account.id,
  //     label: account.Name,
  //   }));

  const OrganizerTemplateOptions = organizerTemplate.map((organizertemp) => ({
    value: organizertemp._id,
    label: organizertemp.templatename,
  }));

  const handleOrganizerFormClose = () => {
    if (onClose) {
      onClose(); // Ensures onClose is a valid function before calling it
    }
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
  const shouldShowSection = (section) => {
    if (!section.sectionsettings?.conditional) return true;

    const condition = section.sectionsettings?.conditions?.[0];
    if (condition && condition.question && condition.answer) {
      const radioAnswer = radioValues[condition.question];
      const checkboxAnswer = checkboxValues[condition.question];
      const dropdownAnswer = selectedDropdownValue;
      // For radio buttons
      if (radioAnswer !== undefined && condition.answer === radioAnswer) {
        return true;
      }
      // For checkboxes: check if the condition answer is in the selected checkbox values
      if (checkboxAnswer && checkboxAnswer[condition.answer]) {
        return true;
      }
      // For dropdowns: check if the condition answer matches the selected dropdown value
      if (dropdownAnswer !== undefined && condition.answer === dropdownAnswer) {
        return true;
      }
      return false;
    }
    return true;
  };

  const getVisibleSections = () => sections.filter(shouldShowSection);
  const visibleSections = getVisibleSections();

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

  const totalSteps = visibleSections.length;
  const totalElements = sections[activeStep]?.formElements.length || 0;

  const answeredCount = sections[activeStep]?.formElements.filter((element) => answeredElements[element.text]).length || 0;

  const handleClosePreview = () => {
    setPreviewDialogOpen(false); // Close the dialog
  };
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
  const shouldShowElement = (element) => {
    if (!element.questionsectionsettings?.conditional) return true;

    const condition = element.questionsectionsettings?.conditions?.[0];

    if (condition && condition.question && condition.answer) {
      const radioAnswer = radioValues[condition.question];
      const checkboxAnswer = checkboxValues[condition.question];
      const dropdownAnswer = selectedDropdownValue;

      // For radio buttons
      if (radioAnswer !== undefined && condition.answer === radioAnswer) {
        return true;
      }

      // For checkboxes: check if the condition answer is in the selected checkbox values
      if (checkboxAnswer && checkboxAnswer[condition.answer]) {
        return true;
      }

      // For dropdowns: check if the condition answer matches the selected dropdown value
      if (dropdownAnswer !== undefined && condition.answer === dropdownAnswer) {
        return true;
      }

      return false;
    }
    return true;
  };

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

  const handleChange = (event, elementText) => {
    setSelectedValue(event.target.value);
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [elementText]: true,
    }));
  };

  const handleDropdownValueChange = (event, elementText) => {
    setSelectedDropdownValue(event.target.value);
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [elementText]: true,
    }));
  };
  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.innerText || tempDiv.textContent || "";
  };

  const [daysuntilNextReminder, setDaysuntilNextReminder] = useState("3");
  const [noOfReminder, setNoOfReminder] = useState(1);
  const [reminder, setReminder] = useState(false);

  const handleAbsolutesDates = (checked) => {
    setReminder(checked);
  };

  console.log(combinedaccountValues);
  const createOrganizerOfAccount = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      accountids: combinedaccountValues,
      organizertemplateid: selectedOrganizerTemplate,
      reminders: reminder,
      noofreminders: noOfReminder,
      daysuntilnextreminder: daysuntilNextReminder,
      jobid: ["661e495d11a097f731ccd6e8"],
      sections:
        selectedOrganizerTempData?.sections?.map((section) => ({
          name: section?.text || "",
          id: section?.id?.toString() || "",
          text: section?.text || "",
          formElements:
            section?.formElements?.map((question) => ({
              type: question?.type || "",
              id: question?.id || "",
              sectionid: question?.sectionid || "",
              options:
                question?.options?.map((option) => ({
                  id: option?.id || "",
                  text: option?.text || "",
                  selected: option?.selected || false,
                })) || [],
              text: question?.text || "",
              textvalue: question?.textvalue || "",
            })) || [],
        })) || [],
      active: true,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    console.log(raw);
    const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountswise/org`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // console.log(result.newOrganizerAccountWise);
        // const { _id } = result.newOrganizerAccountWise;

        // console.log(_id); // "66f7e5d97114d8ad832c2d3e"
        // setorganizeraccountwise(result.newOrganizerAccountWise);
        // setShowOrganizerForm(true);
        // setSelectedOrganizerTemplate(selectedOrganizerTemplate);
        // console.log(selectedOrganizerTemplate);
        toast.success("New organizer created successfully");
        handleOrganizerFormClose();
        // navigate(`/clients/accounts`);
      })
      .catch((error) => console.error(error));
  };

  const handleDelete = (valueToDelete) => {
    setSelectedAccount((prevSelected) => prevSelected.filter((value) => value !== valueToDelete));
  };

  return (
    <Container>
      {/* <Divider />
      <Box mt={3} borderBottom={"2px solid #e2e8f0"} p={2}>
        <Typography fontSize={20}>
          <strong>Create organizer</strong>
        </Typography>
      </Box> */}

      <Box mt={3}>
        <Typography>Accounts</Typography>
        <Autocomplete
          multiple
          options={accountoptions}
          value={selectedAccount}
          onChange={handleAccountChange}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderOption={(props, option) => (
            <Box component="li" {...props} sx={{ cursor: "pointer", margin: "5px 10px" }}>
              {option.label}
            </Box>
          )}
          renderInput={(params) => <TextField {...params} placeholder="Select Accounts" variant="outlined" size="small" sx={{ backgroundColor: "#fff" }} />}
          sx={{ width: "100%", marginTop: "8px" }}
        />
      </Box>

      <Box mt={3}>
        <FormControl fullWidth sx={{ marginBottom: "10px" }}>
          <Typography>Organizer Template</Typography>
          {/* <InputLabel>Organizer Template</InputLabel> */}
          <Select
            value={selectedOrganizerTemplate}
            size="small"
            // label="Age"
            onChange={handleOrganizerTemplateChange}
            renderValue={(selected) => {
              const option = OrganizerTemplateOptions.find((opt) => opt.value === selected);
              return option ? option.label : ""; // Show the label of the selected option
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {OrganizerTemplateOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box mt={2}>
        <TextField
          variant="outlined"
          fullWidth
          value={organizerName || ""} // Replace 'someField' with the field you want to display/edit
          placeholder="Organizer Name"
          size="small"
        />
      </Box>

      <Box mt={2}>
        <Button variant="contained" onClick={handlePreview}>
          Preview Mode
        </Button>
      </Box>
      <Box mt={2} display={"flex"} alignItems={"center"}>
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={reminder}
                onChange={(event) => handleAbsolutesDates(event.target.checked)}
                // checked={reminders}
                // onChange={(event)=>handleDateSwitchChange(event.target.checked)}
                color="primary"
              />
            }
          />
        </Box>
        <Typography variant="h6">Reminders</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2 }}>
        {reminder && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2 }}>
            <Box>
              <InputLabel sx={{ color: "black" }}>Days until next reminder</InputLabel>
              <TextField
                // margin="normal"
                fullWidth
                name="Daysuntilnextreminder"
                value={daysuntilNextReminder}
                onChange={(e) => setDaysuntilNextReminder(e.target.value)}
                placeholder="Days until next reminder"
                size="small"
                sx={{ mt: 2 }}
              />
            </Box>

            <Box>
              <InputLabel sx={{ color: "black" }}>No Of reminders</InputLabel>
              <TextField fullWidth name="No Of reminders" value={noOfReminder} onChange={(e) => setNoOfReminder(e.target.value)} placeholder="NoOfreminders" size="small" sx={{ mt: 2 }} />
            </Box>
          </Box>
        )}
      </Box>

      <Box display={"flex"} gap={2} alignItems={"center"} mt={2}>
        <Box>
          <Button onClick={createOrganizerOfAccount} variant="contained">
            Create
          </Button>
        </Box>

        <Box>
          <Button onClick={handleOrganizerFormClose} variant="outlined">
            Cancel
          </Button>
        </Box>
      </Box>

      <Dialog open={previewDialogOpen} onClose={handleClosePreview} fullScreen>
        <DialogContent>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "2px solid #3FA2F6", p: 2, mb: 3, borderRadius: "10px", backgroundColor: "#96C9F4" }}>
                  <Box>
                    <Typography fontWeight="bold">Preview mode</Typography>
                    <Typography>The client sees your organizer like this</Typography>
                  </Box>
                  <Button variant="text" onClick={handleClosePreview}>
                    Back to edit
                  </Button>
                </Box>
                <Typography variant="text" gutterBottom>
                  {organizerName}
                </Typography>

                <FormControl fullWidth sx={{ marginBottom: "10px", marginTop: "10px" }}>
                  <Select value={activeStep} onChange={handleDropdownChange} size="small">
                    {visibleSections.map((section, index) => (
                      <MenuItem key={index} value={index}>
                        {section.text} ({answeredCount}/{totalElements})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box mt={2} mb={2}>
                  <LinearProgress variant="determinate" value={((activeStep + 1) / totalSteps) * 100} />
                </Box>

                <Box sx={{ pl: 20, pr: 20 }}>
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
                                        value={inputValues[element.text] || ""}
                                        onChange={(e) => handleInputChange(e, element.text)}
                                      />
                                    </Box>
                                  )}

                                  {element.type === "Radio Buttons" && (
                                    <Box>
                                      <Typography fontSize="18px" mb={1} mt={1}>
                                        {element.text}
                                      </Typography>
                                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                        {element.options.map((option) => (
                                          <Button key={option.text} variant={radioValues[element.text] === option.text ? "contained" : "outlined"} onClick={() => handleRadioChange(option.text, element.text)}>
                                            {option.text}
                                          </Button>
                                        ))}
                                      </Box>
                                    </Box>
                                  )}

                                  {element.type === "Checkboxes" && (
                                    <Box>
                                      <Typography fontSize="18px">{element.text}</Typography>
                                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                        {element.options.map((option) => (
                                          <Button key={option.text} variant={checkboxValues[element.text]?.[option.text] ? "contained" : "outlined"} onClick={() => handleCheckboxChange(option.text, element.text)}>
                                            {option.text}
                                          </Button>
                                        ))}
                                      </Box>
                                    </Box>
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

                                  {element.type === "Dropdown" && (
                                    <Box>
                                      <Typography fontSize="18px">{element.text}</Typography>
                                      <FormControl fullWidth>
                                        <Select value={selectedDropdownValue} onChange={(event) => handleDropdownValueChange(event, element.text)} size="small">
                                          {element.options.map((option) => (
                                            <MenuItem key={option.text} value={option.text}>
                                              {option.text}
                                            </MenuItem>
                                          ))}
                                        </Select>
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

                                      <Tooltip title="Unavailable in preview mode" placement="top">
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
                                      </Tooltip>
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

                  <Box mt={3} display="flex" gap={3} alignItems="center">
                    <Button disabled={activeStep === 0} onClick={handleBack} variant="contained">
                      Back
                    </Button>
                    <Button onClick={handleNext} disabled={activeStep === totalSteps - 1} variant="contained">
                      Next
                    </Button>
                  </Box>
                </Box>
              </Box>
            </LocalizationProvider>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default AddBulkOrganizer;
