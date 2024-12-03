import React, { useState, useEffect } from "react";
import { HiOutlineDuplicate } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, TextField, IconButton, Button, Menu, MenuItem, Input, Typography, Drawer, Divider, Switch, FormControlLabel, Autocomplete, Paper } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill Snow theme
import "quill-emoji/dist/quill-emoji.css"; // Emoji styles
import Quill from "quill";
import "quill-emoji";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
Quill.register("modules/emoji", require("quill-emoji"));

const Section = ({ sections, section, onDelete, onUpdate, onDuplicate, onSaveFormData, onSaveSectionData }) => {
  const [text, setText] = useState(section.text);
  const [formElements, setFormElements] = useState(section.formElements || []);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [queDrawerOpen, setQueDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [repeateButton, setRepeateButton] = useState(false);
  const [conditionButton, setConditionButton] = useState(false);
  const [prefilledButton, setPrefilledButton] = useState(false);
  const [descriptionButton, setDescriptionButton] = useState(false);
  const [descriptionText, setDescriptionText] = useState("");
  const [mode, setMode] = useState("Any");
  const [sectionMode, setSectionMode] = useState("Any");
  const [repeatButtonName, setRepeatButtonName] = useState("Repeat Section");

  const [queConditionButton, setQueConditionButton] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState([{ question: "", answer: "" }]);
  const [requiredButton, setRequiredButton] = useState(false);
  const [sectionQuestionAnswers, setSectionQuestionAnswers] = useState([{ question: "", answer: "" }]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [sectionSettingsData, setSectionSettings] = useState(null);

  const handleSectionSave = () => {
    // Construct the sectionSettings object
    const sectionSettings = {
      sectionRepeatingMode: repeateButton,
      buttonName: repeateButton ? repeatButtonName : "", // You can store the text input value instead of hardcoding it
      conditional: conditionButton,
      sectionMode: sectionMode,
      conditions: conditionButton
        ? sectionQuestionAnswers.map((qa, index) => ({
            question: selectedSectionQuestions[index],
            answer: selectedSectionAnswers[index],
          }))
        : [],
      // conditions: conditionButton ? questionAnswers : [], // assuming questionAnswers is an array of {question, answer} objects
    };

    console.log("Section Settings:", sectionSettings);
    if (onSaveSectionData) {
      onSaveSectionData(sectionSettings);
    }

    setDrawerOpen(false);
  };
  // const [previousSectionSettings, setPreviousSectionSettings] = useState({});
  // const handleSectionSave = () => {
  //   const defaultSectionSettings = {
  //     sectionRepeatingMode: false,
  //     buttonName: '',
  //     conditional: false,
  //     sectionMode: '',
  //     conditions: []
  //   };

  //   // Check for existing or unchanged section settings and merge them with new ones
  //   const sectionSettings = {
  //     ...defaultSectionSettings,  // Default settings
  //     ...previousSectionSettings, // Merge with previous settings if any exist
  //     sectionRepeatingMode: repeateButton !== undefined ? repeateButton : previousSectionSettings.sectionRepeatingMode,
  //     buttonName: repeateButton ? repeatButtonName : previousSectionSettings.buttonName,
  //     conditional: conditionButton !== undefined ? conditionButton : previousSectionSettings.conditional,
  //     sectionMode: sectionMode !== '' ? sectionMode : previousSectionSettings.sectionMode,
  //     conditions: conditionButton
  //       ? sectionQuestionAnswers.map((qa, index) => ({
  //           question: selectedSectionQuestions[index],
  //           answer: selectedSectionAnswers[index],
  //         }))
  //       : previousSectionSettings.conditions || [],
  //   };

  //   console.log('Updated Section Settings:', sectionSettings);

  //   // Call the function to save the section settings
  //   if (onSaveSectionData) {
  //     onSaveSectionData(sectionSettings);
  //   }

  //   setDrawerOpen(false);
  // };

  // Clear the form fields
  // setRepeateButton(false); // Reset to initial state
  // setRepeatButtonName(''); // Reset to initial state
  // setConditionButton(false); // Reset to initial state
  // setSectionMode(''); // Reset to initial state
  // setSelectedSectionQuestions([]); // Reset to initial state
  // setSelectedSectionAnswers([]); // Reset to initial state
  // setSectionQuestionAnswers([]); // Reset to initial state
  console.log(sections);

  const sectionSettings = sections[0].sectionsettings;
  console.log(sectionSettings);
  const clearForm = () => {
    setRequiredButton(false);
    setPrefilledButton(false);
    setQueConditionButton(false);
    setDescriptionButton(false);
    setDescriptionText("");
    setSelectedQuestions([]); // Clear selected questions
    setSelectedAnswers([]); // Clear selected answers
    setMode("Any"); // Reset mode to default value
    setQuestionAnswers([]);
  };
  const [questionsAnswersMap, setQuestionsAnswersMap] = useState({});
  const handleElementSelect = (element) => {
    setSelectedElement(element);

    // Check if we have existing questions and answers for this element
    const existingData = questionsAnswersMap[element.id] || { questionAnswers: [], description: "" };

    setQuestionAnswers(existingData.questionAnswers);
    setDescriptionText(existingData.description);
  };

  const handleSave = () => {
    if (selectedElement) {
      const formData = {
        required: requiredButton,
        prefilled: prefilledButton,
        conditional: queConditionButton,
        mode: mode,
        conditions: queConditionButton
          ? questionAnswers.map((qa, index) => ({
              question: selectedQuestions[index], // Ensure selectedQuestions are saved
              answer: selectedAnswers[index], 
              optionvalue:false// Ensure selectedAnswers are saved
            }))
          : [],
        descriptionEnabled: descriptionButton,
        description: descriptionButton ? descriptionText : "", // Save descriptionText only if descriptionButton is enabled
      };

      // Update questionsAnswersMap with current state values
      setQuestionsAnswersMap((prev) => ({
        ...prev,
        [selectedElement.id]: {
          questionAnswers: questionAnswers, // Ensure questionAnswers are stored correctly
          description: descriptionText, // Save the description
        },
      }));

      // Optionally log or save formData
      onSaveFormData(selectedElement.id, formData);

      const updatedFormElements = formElements.map((element) => (element.id === selectedElement.id ? { ...element, questionsectionsettings: formData } : element));
      console.log("Updated formElements:", updatedFormElements);

      // Clear form and close drawer
      clearForm();
      setQueDrawerOpen(false);
    } else {
      console.error("No element selected");
    }
  };

  useEffect(() => {
    if (selectedElement) {
      const { questionsectionsettings } = selectedElement;

      setRequiredButton(questionsectionsettings?.required || false);
      setPrefilledButton(questionsectionsettings?.prefilled || false);
      setQueConditionButton(questionsectionsettings?.conditional || false);
      setDescriptionButton(questionsectionsettings?.descriptionEnabled || false);
      setDescriptionText(questionsectionsettings?.description || "");
      setMode(questionsectionsettings?.mode || "Any");
      // setSelectedQuestions(questionsectionsettings?.conditions?.question || []);
      // setSelectedAnswers(questionsectionsettings?.conditions?.answer || []);
      // Set selectedQuestions and selectedAnswers by mapping through conditions
      const conditions = questionsectionsettings?.conditions || [];
      const questions = conditions.map((cond) => cond.question || null); // Extract questions
      const answers = conditions.map((cond) => cond.answer || null); // Extract answers

      setSelectedQuestions(questions);
      setSelectedAnswers(answers);
    }
  }, [selectedElement]);

  const handleRequiredButton = (checked) => {
    setRequiredButton(checked);
  };
  const handleDescriptionButton = (checked) => {
    setDescriptionButton(checked);
  };
  const handlePrefilledButton = (checked) => {
    setPrefilledButton(checked);
  };
  const handleAddQuestionAnswer = () => {
    setQuestionAnswers([...questionAnswers, { question: "", answer: "" }]);
  };
  const handleAddSectionQuestionAnswer = () => {
    setSectionQuestionAnswers([...sectionQuestionAnswers, { question: "", answer: "" }]);
  };

  const handleRemoveQuestionAnswer = (index) => {
    const updatedList = questionAnswers.filter((_, i) => i !== index);
    setQuestionAnswers(updatedList);

    const updatedSectionList = sectionQuestionAnswers.filter((_, i) => i !== index);
    setSectionQuestionAnswers(updatedSectionList);
  };
  const handleRepeateButton = (checked) => {
    setRepeateButton(checked);
  };
  const handleConditionButton = (checked) => {
    setConditionButton(checked);
  };
  const handleQueConditionButton = (checked) => {
    setQueConditionButton(checked);
  };
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const handleSectionSettingsClick = () => {
    setSelectedSectionId(section.id); // Store the ID of the section to open
    toggleDrawer(true); // Open the drawer
  };
  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  useEffect(() => {
    if (isDrawerOpen) {
      if (section && section.sectionsettings) {
        const sectionSettingsData = section.sectionsettings;

        // Update state with section settings
        setSectionSettings(sectionSettingsData);
        setRepeateButton(sectionSettingsData.sectionRepeatingMode || false);
        setRepeatButtonName(sectionSettingsData.buttonName || "Repeat Section");
        setConditionButton(sectionSettingsData.conditional || false);
        setSectionMode(sectionSettingsData.mode || "Any");
        setSectionQuestionAnswers(sectionSettingsData.conditions || []);
      } else {
        console.error("No section settings available for this section"); // Log error or handle it accordingly
      }
    }
  }, [isDrawerOpen, section]);
  const handleSettingsClick = (elementId) => {
    const updatedElement = formElements.find((element) => element.id === elementId);
    if (updatedElement) {
      setSelectedElement(updatedElement);
      setQueDrawerOpen(true);

      // Get the questionsectionsettings
      const questionSectionSettings = updatedElement.questionsectionsettings;

      // Log or use the questionsectionsettings
      console.log("Question Section Settings:", questionSectionSettings);

      // You can now use the questionsectionsettings as needed
    }
  };

  useEffect(() => {
    setText(section.text);
    setFormElements(section.formElements);
  }, [section]);

  const handleDelete = () => {
    onDelete(section.id);
  };
  const handleDuplicate = () => {
    onDuplicate(section.id);
  };
  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    onUpdate(section.id, newText, formElements);
  };

  const handleAddFormElement = (type) => {
    const newElement = {
      type,
      id: Date.now(),
      sectionid: section.id,
      options: [],
      text: "",
      questionsectionsettings: {
        required: false,
        prefilled: false,
        conditional: false, // Set conditional to true
        mode: "",
        conditions: [
          {
            question: "", // Default question
            answer: "", // Default answer
          },
        ],
        descriptionEnabled: false,
        description: "",
      },
    };
    const updatedFormElements = [...formElements, newElement];
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
    // setDropdownVisible(false);
    setAnchorEl(null);
  };

  const handleDeleteFormElement = (id) => {
    const updatedFormElements = formElements.filter((element) => element.id !== id);
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleAddOption = (elementId) => {
    const newOption = { id: Date.now(), text: "" };
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId) {
        return { ...element, options: [...(element.options || []), newOption] };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleOptionChange = (elementId, optionId, newText) => {
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId) {
        const updatedOptions = element.options.map((option) => {
          if (option.id === optionId) {
            return { ...option, text: newText };
          }
          return option;
        });
        return { ...element, options: updatedOptions };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleDeleteOption = (elementId, optionId) => {
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId) {
        const updatedOptions = element.options.filter((option) => option.id !== optionId);
        return { ...element, options: updatedOptions };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleCheckboxTextChange = (elementId, newText) => {
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId) {
        return { ...element, text: newText };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleElementTextChange = (elementId, newText) => {
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId) {
        return { ...element, text: newText };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };

  const handleQuillChange = (elementId, newText) => {
    const updatedFormElements = formElements.map((element) => {
      if (element.id === elementId) {
        return { ...element, text: newText };
      }
      return element;
    });
    setFormElements(updatedFormElements);
    onUpdate(section.id, text, updatedFormElements);
  };
  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }], // Font family and size
      [{ header: "1" }, { header: "2" }, { align: [] }],
      ["bold", "italic", "underline", "strike"], // Formatting options
      [{ script: "sub" }, { script: "super" }], // Subscript/Superscript
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      [{ color: [] }, { background: [] }], // Text color and highlight
      ["blockquote", "code-block"], // Blockquote and code
      ["link", "image"], // Links and images
      [{ emoji: true }],
      [{ indent: "-1" }, { indent: "+1" }], // Indent/unindent
      ["clean"], // Remove formatting
      ["undo", "redo"], // Undo/Redo
    ],
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true,
    },
    "emoji-toolbar": true,
    "emoji-textarea": false,
    "emoji-shortname": true,
  };

  const formats = ["header", "font", "size", "bold", "italic", "underline", "strike", "script", "list", "bullet", "indent", "color", "background", "align", "blockquote", "code-block", "link", "image", "undo", "redo", "emoji"];

  // const renderOptions = (element) => {
  //   return (
  //     <Box>
  //       {element.options && element.options.map(option => (
  //         <Box key={option.id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
  //           <TextField
  //             variant="outlined"
  //             placeholder="Option"
  //             value={option.text}
  //             size='small'
  //             margin='normal'
  //             fullWidth
  //             className='organizer-input-label'
  //             onChange={(e) => handleOptionChange(element.id, option.id, e.target.value)}

  //           />
  //           <IconButton onClick={() => handleDeleteOption(element.id, option.id)}>
  //             <RiDeleteBinLine />
  //           </IconButton>
  //         </Box>
  //       ))}
  //       <Button variant="contained" onClick={() => handleAddOption(element.id)}>
  //         Add Option
  //       </Button>
  //     </Box>
  //   );
  // };

  const renderOptions = (element, type = "text") => {
    return (
      <Box>
        {element.options &&
          element.options.map((option) => (
            <Box key={option.id} sx={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              {type === "radio" ? <Input type="radio" name={`radio-${element.id}`} sx={{ marginRight: "8px" }} /> : type === "checkbox" ? <Input type="checkbox" name={`checkbox-${element.id}`} sx={{ marginRight: "8px" }} /> : type === "Yes/No" ? <Input type="radio" name={`radio-${element.id}`} sx={{ marginRight: "8px" }} /> : null}

              <TextField variant="outlined" placeholder="Option" value={option.text} size="small" margin="normal" fullWidth className="organizer-input-label" onChange={(e) => handleOptionChange(element.id, option.id, e.target.value)} />
              <IconButton onClick={() => handleDeleteOption(element.id, option.id)}>
                <RiDeleteBinLine />
              </IconButton>
            </Box>
          ))}
        <Button variant="contained" onClick={() => handleAddOption(element.id)}>
          Add Option
        </Button>
      </Box>
    );
  };

  const renderFormElement = (element) => {
    switch (element.type) {
      case "Free Entry":
        return (
          <>
            <Typography>Free Entry</Typography>
            <Box key={element.id} sx={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <TextField variant="outlined" placeholder="Free Entry" value={element.text} size="small" margin="normal" fullWidth sx={{ backgroundColor: "#fff" }} onChange={(e) => handleElementTextChange(element.id, e.target.value)} />
              <IconButton onClick={() => handleSettingsClick(element.id)}>
                <IoSettingsOutline />
              </IconButton>

              <IconButton onClick={() => handleDeleteFormElement(element.id)}>
                <RiDeleteBinLine />
              </IconButton>
            </Box>
          </>
        );
      case "Email":
        return (
          <>
            <Typography>Email</Typography>
            <Box key={element.id} sx={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <TextField variant="outlined" placeholder="Email" value={element.text} size="small" margin="normal" fullWidth onChange={(e) => handleElementTextChange(element.id, e.target.value)} sx={{ backgroundColor: "#fff" }} />
              <IconButton onClick={() => handleSettingsClick(element.id)}>
                <IoSettingsOutline />
              </IconButton>

              <IconButton onClick={() => handleDeleteFormElement(element.id)}>
                <RiDeleteBinLine />
              </IconButton>
            </Box>
          </>
        );
      case "Number":
        return (
          <>
            <Typography>Number</Typography>
            <Box key={element.id} sx={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <TextField variant="outlined" placeholder="Number" value={element.text} size="small" margin="normal" fullWidth onChange={(e) => handleElementTextChange(element.id, e.target.value)} sx={{ backgroundColor: "#fff" }} />
              <IconButton onClick={() => handleSettingsClick(element.id)}>
                <IoSettingsOutline />
              </IconButton>

              <IconButton onClick={() => handleDeleteFormElement(element.id)}>
                <RiDeleteBinLine />
              </IconButton>
            </Box>
          </>
        );
      case "Date":
        return (
          <>
            <Typography>Date</Typography>
            <Box key={element.id} sx={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <TextField variant="outlined" placeholder="Date" value={element.text} size="small" margin="normal" fullWidth onChange={(e) => handleElementTextChange(element.id, e.target.value)} sx={{ backgroundColor: "#fff" }} />
              <IconButton onClick={() => handleSettingsClick(element.id)}>
                <IoSettingsOutline />
              </IconButton>

              <IconButton onClick={() => handleDeleteFormElement(element.id)}>
                <RiDeleteBinLine />
              </IconButton>
            </Box>
          </>
        );
      case "Radio Buttons":
        return (
          <Box key={element.id} sx={{ marginBottom: "8px" }}>
            <Typography>Radio Button:</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* <Input type="radio" name={`radio-${element.id}`} sx={{ marginRight: "4px" }} /> */}
              <TextField variant="outlined" placeholder="Radio Buttons" value={element.text} size="small" margin="normal" fullWidth onChange={(e) => handleElementTextChange(element.id, e.target.value)} sx={{ backgroundColor: "#fff" }} />
              <IconButton onClick={() => handleSettingsClick(element.id)}>
                <IoSettingsOutline />
              </IconButton>

              <IconButton onClick={() => handleDeleteFormElement(element.id)}>
                <RiDeleteBinLine />
              </IconButton>
            </Box>
            {renderOptions(element, "radio")}
          </Box>
        );
      case "Checkboxes":
        return (
          <Box key={element.id} sx={{ marginBottom: "8px" }}>
            <Typography>Checkbox:</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* <Input type="checkbox" name={`checkbox-${element.id}`} sx={{ marginRight: "4px" }} /> */}
              <TextField variant="outlined" placeholder="Checkboxes" value={element.text} size="small" margin="normal" fullWidth onChange={(e) => handleCheckboxTextChange(element.id, e.target.value)} sx={{ backgroundColor: "#fff" }} />
              <IconButton onClick={() => handleSettingsClick(element.id)}>
                <IoSettingsOutline />
              </IconButton>

              <IconButton onClick={() => handleDeleteFormElement(element.id)}>
                <RiDeleteBinLine />
              </IconButton>
            </Box>
            {renderOptions(element, "checkbox")}
          </Box>
        );
      case "Dropdown":
        return (
          <Box key={element.id} sx={{ marginBottom: "8px" }}>
            <Typography>Dropdown:</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField variant="outlined" placeholder="Dropdown" value={element.text} size="small" margin="normal" fullWidth onChange={(e) => handleCheckboxTextChange(element.id, e.target.value)} sx={{ backgroundColor: "#fff" }} />
              <IconButton onClick={() => handleSettingsClick(element.id)}>
                <IoSettingsOutline />
              </IconButton>

              <IconButton onClick={() => handleDeleteFormElement(element.id)}>
                <RiDeleteBinLine />
              </IconButton>
            </Box>
            {renderOptions(element)}
          </Box>
        );

      case "Yes/No":
        return (
          <Box key={element.id} sx={{ marginBottom: "8px" }}>
            <Typography>Yes/No:</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField variant="outlined" placeholder="Yes/No" value={element.text} size="small" margin="normal" fullWidth onChange={(e) => handleElementTextChange(element.id, e.target.value)} sx={{ backgroundColor: "#fff" }} />
              <IconButton onClick={() => handleSettingsClick(element.id)}>
                <IoSettingsOutline />
              </IconButton>

              <IconButton onClick={() => handleDeleteFormElement(element.id)}>
                <RiDeleteBinLine />
              </IconButton>
            </Box>
            {renderOptions(element, "Yes/No")}
          </Box>
        );

      case "File Upload":
        return (
          <Box key={element.id}>
            <Typography>File Upload:</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField variant="outlined" placeholder="File Upload" value={element.text} size="small" margin="normal" fullWidth onChange={(e) => handleElementTextChange(element.id, e.target.value)} sx={{ backgroundColor: "#fff" }} />
              <IconButton onClick={() => handleSettingsClick(element.id)}>
                <IoSettingsOutline />
              </IconButton>

              <IconButton onClick={() => handleDeleteFormElement(element.id)}>
                <RiDeleteBinLine />
              </IconButton>
            </Box>
            <Button component="label" role={undefined} variant="outlined" disabled tabIndex={-1} startIcon={<CloudUploadIcon />}>
              Upload files
            </Button>
          </Box>
        );
      case "Text Editor":
        return (
          <Box key={element.id} sx={{ marginTop: "16px", display: "flex", alignItems: "center" }}>
            <ReactQuill
              theme="snow"
              value={element.text}
              modules={modules} // Set the custom modules
              formats={formats} // Set the allowed formats
              onChange={(newText) => handleQuillChange(element.id, newText)}
            />

            <IconButton onClick={() => handleDeleteFormElement(element.id)}>
              <RiDeleteBinLine />
            </IconButton>
          </Box>
        );
      default:
        return null;
    }
  };

  const getRadioButtonOptions = () => {
    return sections.flatMap(
      (section) =>
        section.formElements
          // .filter(element => element.type === 'Radio Buttons')
          .filter((element) => element.type === "Radio Buttons" || element.type === "Checkboxes" || element.type === "Dropdown")
          .map((element) => element.text)
      //  .map(element => ({ text: element.text, sectionName: section.text }))
    );
  };

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questionAnswers.length).fill(null));

  const [selectedSectionQuestions, setSelectedSectionQuestions] = useState(Array(sectionQuestionAnswers.length).fill(null));
  const [selectedSectionAnswers, setSelectedSectionAnswers] = useState(Array(sectionQuestionAnswers.length).fill(null));

  // Get answer options for the selected question
  const getAnswerOptions = (question) => {
    const section = sections.find((s) => s.formElements.some((el) => el.text === question));
    if (!section) return []; // Guard clause for undefined section

    const element = section.formElements.find((el) => el.text === question);
    return element ? element.options.map((option) => option.text) : [];
  };

  // Handle question selection
  const handleQuestionSelect = (value, index) => {
    const updatedQuestions = [...selectedQuestions];
    updatedQuestions[index] = value; // Update selected question
    setSelectedQuestions(updatedQuestions);

    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[index] = null; // Reset answer for the new selected question
    setSelectedAnswers(updatedAnswers);
  };
  const handleSectionQuestionSelect = (newValue, index) => {
    const updatedQuestions = [...selectedSectionQuestions];
    updatedQuestions[index] = newValue; // Update selected question
    setSelectedSectionQuestions(updatedQuestions);

    const updatedAnswers = [...selectedSectionAnswers];
    updatedAnswers[index] = null; // Reset answer for the new selected question
    setSelectedSectionAnswers(updatedAnswers);
  };
  useEffect(() => {
    // Initialize the selectedQuestions and selectedAnswers state based on existing sectionQuestionAnswers
    setSelectedSectionQuestions(sectionQuestionAnswers.map((q) => q.question || null));
    setSelectedSectionAnswers(sectionQuestionAnswers.map((a) => a.answer || null));
  }, [sectionQuestionAnswers]);

  return (
    <Box
      sx={{
        border: "1px solid black",
        padding: "16px",
        marginBottom: "16px",
        borderRadius: "8px",
        position: "relative",
        backgroundColor: "#fff",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <TextField variant="outlined" fullWidth value={text} size="small" margin="normal" onChange={handleTextChange} placeholder="Section text" />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <IconButton onClick={handleDuplicate}>
            <HiOutlineDuplicate />
          </IconButton>

          {/* <IconButton
            onClick={() => {
              // Ensure sections is defined and has at least one element
              if (sections && sections.length > 0 && sections[0].sectionsettings) {
                const sectionSettingsData = sections[0].sectionsettings;

                // Update state with section settings
                setSectionSettings(sectionSettingsData);
                setRepeateButton(sectionSettingsData.sectionRepeatingMode || false);
                setRepeatButtonName(sectionSettingsData.buttonName || '');
                setConditionButton(sectionSettingsData.conditional || false);
                setSectionMode(sectionSettingsData.mode || 'Any');
                setSectionQuestionAnswers(sectionSettingsData.conditions || []);
              } else {
                console.error('No section settings available'); // Log error or handle it accordingly
              }

              toggleDrawer(true);
            }}
          >
            <IoSettingsOutline />
          </IconButton> */}
          {/* <IconButton
      onClick={() => {
        // Ensure the current section is defined and has settings
        if (section && section.sectionsettings) {
          const sectionSettingsData = section.sectionsettings;

          // Update state with section settings
          setSectionSettings(sectionSettingsData);
          setRepeateButton(sectionSettingsData.sectionRepeatingMode || false);
          setRepeatButtonName(sectionSettingsData.buttonName || 'Repeat Section');
          setConditionButton(sectionSettingsData.conditional || false);
          setSectionMode(sectionSettingsData.mode || 'Any');
          setSectionQuestionAnswers(sectionSettingsData.conditions || []);
        } else {
          console.error('No section settings available for this section'); // Log error or handle it accordingly
        }

        toggleDrawer(true);
      }}
    >
      <IoSettingsOutline />
    </IconButton> */}
          <IconButton onClick={handleSectionSettingsClick}>
            <IoSettingsOutline />
          </IconButton>
          <IconButton onClick={handleDelete}>
            <RiDeleteBinLine />
          </IconButton>
        </Box>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          {["Free Entry", "Email", "Number", "Date", "Radio Buttons", "Checkboxes", "Dropdown", "Yes/No", "File Upload"].map((type) => (
            <MenuItem key={type} onClick={() => handleAddFormElement(type)}>
              {type}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {formElements.map((element) => (
        <Box key={element.id} sx={{ marginTop: "16px" }}>
          {renderFormElement(element)}
        </Box>
      ))}
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 3 }}>
        <Button variant="contained" onClick={(event) => setAnchorEl(event.currentTarget)}>
          Questions
        </Button>
        <Button variant="outlined" onClick={() => handleAddFormElement("Text Editor")}>
          Text Block
        </Button>
      </Box>
      <Drawer anchor="right" open={isDrawerOpen} onClose={() => toggleDrawer(false)}>
        <Box sx={{ width: 500 }} role="presentation">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Section Settings
              </Typography>
              <h2>Settings for Section ID: {selectedSectionId}</h2>
              <Typography gutterBottom>{text}</Typography>
            </Box>

            <IconButton onClick={() => toggleDrawer(false)}>
              <IoMdClose />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ p: 3 }}>
            <Box display={"flex"} alignItems={"center"}>
              <Box>
                <FormControlLabel control={<Switch checked={repeateButton} onChange={(event) => handleRepeateButton(event.target.checked)} color="primary" />} />
              </Box>
              <Typography variant="h6">Allow client to repeat</Typography>
            </Box>
            {repeateButton && (
              <Box mb={3} mt={2}>
                <Typography variant="body">Button name (maximum 25 characters)</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  margin="normal"
                  // defaultValue="Repeat Section"
                  value={repeatButtonName}
                  onChange={(e) => setRepeatButtonName(e.target.value)}
                />
              </Box>
            )}

            <Box display={"flex"} alignItems={"center"}>
              <Box>
                <FormControlLabel control={<Switch checked={conditionButton} onChange={(event) => handleConditionButton(event.target.checked)} color="primary" />} />
              </Box>
              <Typography variant="h6">Conditional</Typography>
            </Box>
            {conditionButton && (
              <Box mb={3} mt={2}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Conditions
                  </Typography>
                  <Button variant="text" onClick={handleAddSectionQuestionAnswer}>
                    Add
                  </Button>
                </Box>
                <Divider />
                <Box mt={2}>
                  <Typography>Mode</Typography>
                  <Autocomplete
                    options={["Any", "All"]}
                    defaultValue="Any"
                    value={sectionMode} // Bind value to state
                    onChange={(event, newValue) => setSectionMode(newValue)}
                    renderInput={(params) => <TextField {...params} variant="outlined" size="small" margin="normal" />}
                    renderOption={(props, option) => (
                      <li {...props} style={{ margin: "5px", cursor: "pointer" }}>
                        {option}
                      </li>
                    )}
                  />
                </Box>

                {sectionQuestionAnswers.map((qa, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2 }}>
                    <Box sx={{ width: "380px" }}>
                      <Typography>Question</Typography>
                      <Autocomplete
                        options={getRadioButtonOptions()}
                        value={selectedSectionQuestions[index] || null}
                        onChange={(event, newValue) => handleSectionQuestionSelect(newValue, index)}
                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" margin="normal" placeholder="Question" />}
                        renderOption={(props, option) => (
                          <li {...props} style={{ margin: "5px", cursor: "pointer" }}>
                            {option}
                          </li>
                        )}
                      />
                    </Box>
                    <Box>
                      <Typography>Answer</Typography>
                      <Autocomplete
                        options={getAnswerOptions(selectedSectionQuestions[index])} // Get options based on selected question
                        value={selectedSectionAnswers[index] || null}
                        onChange={(event, newValue) => {
                          const updatedAnswers = [...selectedSectionAnswers];
                          updatedAnswers[index] = newValue;
                          setSelectedSectionAnswers(updatedAnswers);
                        }}
                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" margin="normal" placeholder="Answer" />}
                        renderOption={(props, option) => (
                          <li {...props} style={{ margin: "5px", cursor: "pointer" }}>
                            {option}
                          </li>
                        )}
                      />
                    </Box>
                    <Box mt={5}>
                      <IconButton onClick={() => handleRemoveQuestionAnswer(index)}>
                        <RiDeleteBinLine />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            <Box sx={{ display: "flex", alighItems: "center", gap: 3, mt: 2 }}>
              <Button variant="contained" onClick={handleSectionSave}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => toggleDrawer(false)}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>

      <Drawer anchor="right" open={queDrawerOpen} onClose={() => setQueDrawerOpen(false)}>
        <Box sx={{ width: 600, height: "100vh", overflowY: "auto" }} role="presentation">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
            {selectedElement && <Typography variant="h6">{selectedElement.text}</Typography>}

            <IconButton onClick={() => setQueDrawerOpen(false)}>
              <IoMdClose />
            </IconButton>
          </Box>

          <Divider />
          <Box sx={{ p: 3 }}>
            <Paper style={{ padding: "15px" }}>
              <Box display={"flex"} alignItems={"center"} m={1}>
                <FormControlLabel control={<Switch checked={requiredButton} onChange={(event) => handleRequiredButton(event.target.checked)} color="primary" />} />

                <Typography variant="h6">Required</Typography>
              </Box>
              <Divider />
              <p>It is mandatory to respond to this question to submit the organizer</p>
            </Paper>

            <Paper style={{ padding: "15px", marginTop: "20px" }}>
              <Box display={"flex"} alignItems={"center"} m={1}>
                <FormControlLabel control={<Switch checked={prefilledButton} onChange={(event) => handlePrefilledButton(event.target.checked)} color="primary" />} />

                <Typography variant="h6">Pre-Filled</Typography>
              </Box>
              <Divider />
              <p>If asked before, answer pre-populates from previous organizer</p>
            </Paper>

            <Paper style={{ padding: "15px", marginTop: "20px" }}>
              <Box display={"flex"} alignItems={"center"} m={1}>
                <Box>
                  <FormControlLabel control={<Switch checked={queConditionButton} onChange={(event) => handleQueConditionButton(event.target.checked)} color="primary" />} />
                </Box>
                <Typography variant="h6">Conditional</Typography>
              </Box>
              <Divider />
              <p>Ask question only in certain scenarios</p>
              {queConditionButton && (
                <Box mb={3} mt={2}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Conditions
                    </Typography>
                    <Button variant="text" onClick={handleAddQuestionAnswer}>
                      Add
                    </Button>
                  </Box>
                  <Divider />
                  <Box mt={2}>
                    <Typography>Mode</Typography>
                    <Autocomplete
                      options={["Any", "All"]}
                      defaultValue="Any"
                      value={mode} // Bind value to state
                      onChange={(event, newValue) => setMode(newValue)}
                      renderInput={(params) => <TextField {...params} variant="outlined" size="small" margin="normal" />}
                      renderOption={(props, option) => (
                        <li {...props} style={{ margin: "5px", cursor: "pointer" }}>
                          {option}
                        </li>
                      )}
                    />
                  </Box>

                  {questionAnswers.map((qa, index) => (
                    <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2 }}>
                      <Box sx={{ width: "380px" }}>
                        <Typography>Question</Typography>
                        <Autocomplete
                          options={getRadioButtonOptions()}
                          value={selectedQuestions[index] || null}
                          onChange={(event, newValue) => handleQuestionSelect(newValue, index)}
                          renderInput={(params) => <TextField {...params} variant="outlined" size="small" margin="normal" placeholder="Question" />}
                          renderOption={(props, option) => (
                            <li {...props} style={{ margin: "5px", cursor: "pointer" }}>
                              {option}
                            </li>
                          )}
                        />
                      </Box>
                      <Box>
                        <Typography>Answer</Typography>
                        <Autocomplete
                          options={getAnswerOptions(selectedQuestions[index])} // Get options based on selected question
                          value={selectedAnswers[index] || null}
                          onChange={(event, newValue) => {
                            const updatedAnswers = [...selectedAnswers];
                            updatedAnswers[index] = newValue;
                            setSelectedAnswers(updatedAnswers);
                          }}
                          renderInput={(params) => <TextField {...params} variant="outlined" size="small" margin="normal" placeholder="Answer" />}
                          renderOption={(props, option) => (
                            <li {...props} style={{ margin: "5px", cursor: "pointer" }}>
                              {option}
                            </li>
                          )}
                        />
                      </Box>
                      <Box mt={5}>
                        <IconButton onClick={() => handleRemoveQuestionAnswer(index)}>
                          <RiDeleteBinLine />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
            <Paper style={{ padding: "15px", marginTop: "20px" }}>
              <Box display={"flex"} alignItems={"center"} m={1}>
                <Box>
                  <FormControlLabel control={<Switch checked={descriptionButton} onChange={(event) => handleDescriptionButton(event.target.checked)} color="primary" />} />
                </Box>
                <Typography variant="h6">Description</Typography>
              </Box>
              <Divider />
              <p>Add instructional text to help clients answer your question</p>
              {descriptionButton && (
                <Box mb={3} mt={2}>
                  <Typography>Description</Typography>
                  <TextField fullWidth multiline rows={4} placeholder="Description" variant="outlined" margin="normal" value={descriptionText} onChange={(event) => setDescriptionText(event.target.value)} />
                </Box>
              )}
            </Paper>
            <Box sx={{ display: "flex", alighItems: "center", gap: 3, mt: 2 }}>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => setQueDrawerOpen(false)}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Section;
