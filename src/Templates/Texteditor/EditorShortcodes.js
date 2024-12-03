


// import React, { useEffect, useState } from 'react';
// import {
//     Box, Button, List,
//     ListItem,
//     ListItemText, Popover
// } from '@mui/material';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Table from '@tiptap/extension-table';
// import TableRow from '@tiptap/extension-table-row';
// import TableCell from '@tiptap/extension-table-cell';
// import TableHeader from '@tiptap/extension-table-header';
// import TextStyle from '@tiptap/extension-text-style';
// import Underline from '@tiptap/extension-underline';
// import Subscript from '@tiptap/extension-subscript';
// import Superscript from '@tiptap/extension-superscript';
// import Color from '@tiptap/extension-color';
// import Highlight from '@tiptap/extension-highlight';
// import TaskList from '@tiptap/extension-task-list';
// import TaskItem from '@tiptap/extension-task-item';
// import Image from '@tiptap/extension-image';
// import FontFamily from './FontFamily';
// import FontSize from './FontSize';

// import './editor.css';
// import {
//     MenuButtonAddTable,
//     MenuButtonBlockquote,
//     MenuButtonBold,
//     MenuButtonBulletedList,
//     MenuButtonCode,
//     MenuButtonCodeBlock,
//     MenuButtonEditLink,
//     MenuButtonHighlightColor,
//     MenuButtonHorizontalRule,
//     MenuButtonImageUpload,
//     MenuButtonIndent,
//     MenuButtonItalic,
//     MenuButtonOrderedList,
//     MenuButtonRedo,
//     MenuButtonRemoveFormatting,
//     MenuButtonStrikethrough,
//     MenuButtonSubscript,
//     MenuButtonSuperscript,
//     MenuButtonTaskList,
//     MenuButtonTextColor,
//     MenuButtonUnderline,
//     MenuButtonUndo,
//     MenuButtonUnindent,
//     MenuControlsContainer,
//     MenuDivider,
//     MenuSelectFontFamily,
//     MenuSelectFontSize,
//     MenuSelectHeading,
//     MenuSelectTextAlign,
//     RichTextEditorProvider,
//     isTouchDevice,
// } from 'mui-tiptap';
// import { useTheme } from '@mui/material';

// export default function Editor({ initialContent, onChange }) {
//     const theme = useTheme();
//     const [shortcuts, setShortcuts] = useState([]);
//     const [selectedOption, setSelectedOption] = useState('contacts');
//     const [filteredShortcuts, setFilteredShortcuts] = useState([]);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

//     const editor = useEditor({
//         extensions: [
//             StarterKit,
//             Table,
//             TableRow,
//             TableCell,
//             TableHeader,
//             TextStyle,
//             Underline,
//             Subscript,
//             Superscript,
//             Color,
//             Highlight.configure({
//                 multicolor: true,  // Enable multicolor support
//               }),
//             TaskList,
//             TaskItem.configure({ nested: true }),
//             Image,
//             FontFamily,
//             FontSize,
//         ],
//         content: initialContent,
//         onUpdate: ({ editor }) => {
//             const html = editor.getHTML();
//             onChange(html); // Call the onChange prop with the current content
//         },
//     });

//     const handleUploadFiles = (files) => {
//         return files.map((file) => ({
//             src: URL.createObjectURL(file),
//             alt: file.name,
//         }));
//     };

//     useEffect(() => {
//         if (editor && initialContent) {
//             editor.commands.setContent(initialContent);
//         }
//     }, [initialContent, editor]);

//     const handleOpenDropdown = (event) => {
//         setPopoverPosition({
//             top: event.currentTarget.getBoundingClientRect().bottom + window.scrollY,
//             left: event.currentTarget.getBoundingClientRect().left + window.scrollX,
//         });
//         setShowDropdown(!showDropdown);
//     };

//     const handleCloseDropdown = () => {
//         setShowDropdown(false);
//     };

//     const handleAddShortcut = (shortcode) => {
//         editor.chain().focus().insertContent(`[${shortcode}]`).run();
//         setShowDropdown(false);
//     };

// useEffect(() => {
//     // Set shortcuts based on selected option
//     if (selectedOption === 'contacts') {
//       const contactShortcuts = [
//         { title: 'Account Shortcodes', isBold: true },
//         { title: 'Account Name', isBold: false, value: 'ACCOUNT_NAME' },
//         { title: 'Custom field:Website', isBold: false, value: 'ACCOUNT_CUSTOM_FIELD:Website' },
//         { title: 'Contact Shortcodes', isBold: true, },
//         { title: 'Contact Name', isBold: false, value: 'CONTACT_NAME' },
//         { title: 'First Name', isBold: false, value: 'FIRST_NAME' },
//         { title: 'Middle Name', isBold: false, value: 'MIDDLE_NAME' },
//         { title: 'Last Name', isBold: false, value: 'LAST_NAME' },
//         { title: 'Phone number', isBold: false, value: 'PHONE_NUMBER' },
//         { title: 'Country', isBold: false, value: 'COUNTRY' },
//         { title: 'Company name', isBold: false, value: 'COMPANY_NAME ' },
//         { title: 'Street address', isBold: false, value: 'STREET_ADDRESS' },
//         { title: 'City', isBold: false, value: 'CITY' },
//         { title: 'State/Province', isBold: false, value: 'STATE / PROVINCE' },
//         { title: 'Zip/Postal code', isBold: false, value: 'ZIP / POSTAL CODE' },
//         { title: 'Custom field:Email', isBold: false, value: 'CONTACT_CUSTOM_FIELD:Email' },
//         { title: 'Date Shortcodes', isBold: true },
//         { title: 'Current day full date', isBold: false, value: 'CURRENT_DAY_FULL_DATE' },
//         { title: 'Current day number', isBold: false, value: 'CURRENT_DAY_NUMBER' },
//         { title: 'Current day name', isBold: false, value: 'CURRENT_DAY_NAME' },
//         { title: 'Current week', isBold: false, value: 'CURRENT_WEEK' },
//         { title: 'Current month number', isBold: false, value: 'CURRENT_MONTH_NUMBER' },
//         { title: 'Current month name', isBold: false, value: 'CURRENT_MONTH_NAME' },
//         { title: 'Current quarter', isBold: false, value: 'CURRENT_QUARTER' },
//         { title: 'Current year', isBold: false, value: 'CURRENT_YEAR' },
//         { title: 'Last day full date', isBold: false, value: 'LAST_DAY_FULL_DATE' },
//         { title: 'Last day number', isBold: false, value: 'LAST_DAY_NUMBER' },
//         { title: 'Last day name', isBold: false, value: 'LAST_DAY_NAME' },
//         { title: 'Last week', isBold: false, value: 'LAST_WEEK' },
//         { title: 'Last month number', isBold: false, value: 'LAST_MONTH_NUMBER' },
//         { title: 'Last month name', isBold: false, value: 'LAST_MONTH_NAME' },
//         { title: 'Last quarter', isBold: false, value: 'LAST_QUARTER' },
//         { title: 'Last_year', isBold: false, value: 'LAST_YEAR' },
//         { title: 'Next day full date', isBold: false, value: 'NEXT_DAY_FULL_DATE' },
//         { title: 'Next day number', isBold: false, value: 'NEXT_DAY_NUMBER' },
//         { title: 'Next day name', isBold: false, value: 'NEXT_DAY_NAME' },
//         { title: 'Next week', isBold: false, value: 'NEXT_WEEK' },
//         { title: 'Next month number', isBold: false, value: 'NEXT_MONTH_NUMBER' },
//         { title: 'Next month name', isBold: false, value: 'NEXT_MONTH_NAME' },
//         { title: 'Next quarter', isBold: false, value: 'NEXT_QUARTER' },
//         { title: 'Next year', isBold: false, value: 'NEXT_YEAR' }
//       ];
//       setShortcuts(contactShortcuts);
//     } else if (selectedOption === 'account') {
//       const accountShortcuts = [
//         { title: 'Account Shortcodes', isBold: true },
//         { title: 'Account Name', isBold: false, value: 'ACCOUNT_NAME' },
//         { title: 'Custom field:Website', isBold: false, value: 'ACCOUNT_CUSTOM_FIELD:Website' },
//         { title: 'Date Shortcodes', isBold: true },
//         { title: 'Current day full date', isBold: false, value: 'CURRENT_DAY_FULL_DATE' },
//         { title: 'Current day number', isBold: false, value: 'CURRENT_DAY_NUMBER' },
//         { title: 'Current day name', isBold: false, value: 'CURRENT_DAY_NAME' },
//         { title: 'Current week', isBold: false, value: 'CURRENT_WEEK' },
//         { title: 'Current month number', isBold: false, value: 'CURRENT_MONTH_NUMBER' },
//         { title: 'Current month name', isBold: false, value: 'CURRENT_MONTH_NAME' },
//         { title: 'Current quarter', isBold: false, value: 'CURRENT_QUARTER' },
//         { title: 'Current year', isBold: false, value: 'CURRENT_YEAR' },
//         { title: 'Last day full date', isBold: false, value: 'LAST_DAY_FULL_DATE' },
//         { title: 'Last day number', isBold: false, value: 'LAST_DAY_NUMBER' },
//         { title: 'Last day name', isBold: false, value: 'LAST_DAY_NAME' },
//         { title: 'Last week', isBold: false, value: 'LAST_WEEK' },
//         { title: 'Last month number', isBold: false, value: 'LAST_MONTH_NUMBER' },
//         { title: 'Last month name', isBold: false, value: 'LAST_MONTH_NAME' },
//         { title: 'Last quarter', isBold: false, value: 'LAST_QUARTER' },
//         { title: 'Last_year', isBold: false, value: 'LAST_YEAR' },
//         { title: 'Next day full date', isBold: false, value: 'NEXT_DAY_FULL_DATE' },
//         { title: 'Next day number', isBold: false, value: 'NEXT_DAY_NUMBER' },
//         { title: 'Next day name', isBold: false, value: 'NEXT_DAY_NAME' },
//         { title: 'Next week', isBold: false, value: 'NEXT_WEEK' },
//         { title: 'Next month number', isBold: false, value: 'NEXT_MONTH_NUMBER' },
//         { title: 'Next month name', isBold: false, value: 'NEXT_MONTH_NAME' },
//         { title: 'Next quarter', isBold: false, value: 'NEXT_QUARTER' },
//         { title: 'Next year', isBold: false, value: 'NEXT_YEAR' }
//       ];
//       setShortcuts(accountShortcuts);
//     }
//   }, [selectedOption]);

// useEffect(() => {
//     setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes('')));
// }, [shortcuts]);

//     return (
//         <Box
//             className='editor-box'
//             sx={{
//                 border: '1px solid grey',
//                 borderRadius: '4px',
//                 overflow: 'hidden',
//             }}
//         >
//             <RichTextEditorProvider editor={editor}>
//                 <Box sx={{ padding: '10px' }}>
//                     <MenuControlsContainer>
//                         <MenuSelectFontFamily
//                             options={[
//                                 { label: 'Comic Sans', value: 'Comic Sans MS, Comic Sans' },
//                                 { label: 'Cursive', value: 'cursive' },
//                                 { label: 'Monospace', value: 'monospace' },
//                                 { label: 'Serif', value: 'serif' },
//                             ]}
//                         />
//                         <MenuDivider />
//                         <MenuSelectHeading />
//                         <MenuDivider />
//                         <MenuSelectFontSize />
//                         <MenuDivider />
//                         <MenuButtonBold />
//                         <MenuButtonItalic />
//                         <MenuButtonUnderline />
//                         <MenuButtonStrikethrough />
//                         <MenuButtonSubscript />
//                         <MenuButtonSuperscript />
//                         <MenuDivider />
//                         <MenuButtonTextColor
//                             defaultTextColor={theme.palette.text.primary}
//                             swatchColors={[
//                                 { value: '#000000', label: 'Black' },
//                                 { value: '#ffffff', label: 'White' },
//                                 { value: '#888888', label: 'Grey' },
//                                 { value: '#ff0000', label: 'Red' },
//                                 { value: '#ff9900', label: 'Orange' },
//                                 { value: '#ffff00', label: 'Yellow' },
//                                 { value: '#00d000', label: 'Green' },
//                                 { value: '#0000ff', label: 'Blue' },
//                             ]}
//                         />
//                         <MenuButtonHighlightColor
//                             swatchColors={[
//                                 { value: '#595959', label: 'Dark grey' },
//                                 { value: '#dddddd', label: 'Light grey' },
//                                 { value: '#ffa6a6', label: 'Light red' },
//                                 { value: '#ffd699', label: 'Light orange' },
//                                 { value: '#ffff00', label: 'Yellow' },
//                                 { value: '#99cc99', label: 'Light green' },
//                                 { value: '#90c6ff', label: 'Light blue' },
//                                 { value: '#8085e9', label: 'Light purple' },
//                             ]}
//                         />
//                         <MenuDivider />
//                         <MenuButtonEditLink />
//                         <MenuDivider />
//                         <MenuSelectTextAlign />
//                         <MenuDivider />
//                         <MenuButtonOrderedList />
//                         <MenuButtonBulletedList />
//                         <MenuButtonTaskList />
//                         {isTouchDevice() && (
//                             <>
//                                 <MenuButtonIndent />
//                                 <MenuButtonUnindent />
//                             </>
//                         )}
//                         <MenuDivider />
//                         <MenuButtonBlockquote />
//                         <MenuDivider />
//                         <MenuButtonCode />
//                         <MenuButtonCodeBlock />
//                         <MenuDivider />
//                         <MenuButtonImageUpload onUploadFiles={handleUploadFiles} />
//                         <MenuDivider />
//                         <MenuButtonHorizontalRule />
//                         <MenuButtonAddTable />
//                         <MenuDivider />
//                         <MenuButtonRemoveFormatting />
//                         <MenuDivider />
//                         <MenuButtonUndo />
//                         <MenuButtonRedo />
//                         <Button onClick={handleOpenDropdown} variant="contained" sx={{ ml: 2 }}>
//                             Shortcode
//                         </Button>
//                         <Popover
//                             open={showDropdown}
//                             onClose={handleCloseDropdown}
//                             anchorReference="anchorPosition"
//                             anchorPosition={{ top: popoverPosition.top, left: popoverPosition.left }}
//                         >
//                             <Box>
//                                 <List className="dropdown-list" sx={{ width: '300px', height: '300px', cursor: 'pointer' }}>
//                                     {filteredShortcuts.map((shortcut, index) => (
//                                         <ListItem
//                                             key={index}
//                                             onClick={() => handleAddShortcut(shortcut.value)}
//                                         >
//                                             <ListItemText
//                                                 primary={shortcut.title}
//                                                 primaryTypographyProps={{
//                                                     style: {
//                                                         fontWeight: shortcut.isBold ? 'bold' : 'normal',
//                                                     },
//                                                 }}
//                                             />
//                                         </ListItem>
//                                     ))}
//                                 </List>
//                             </Box>
//                         </Popover>
//                     </MenuControlsContainer>
//                 </Box>

//                 <div className="editor-container">
//                     <EditorContent
//                         editor={editor}
//                         className="editor-content"
//                         style={{ borderTop: '1px solid grey', padding: '10px', height: '250px' }}
//                     />
//                 </div>
//             </RichTextEditorProvider>
//         </Box>
//     );
// }


import React, { useEffect, useState } from 'react';
import {
    Box, Button, List,
    ListItem,
    ListItemText, Popover
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill Snow theme
import 'quill-emoji/dist/quill-emoji.css'; // Emoji styles
import Quill from 'quill';
import 'quill-emoji';
import { useTheme } from '@mui/material';
Quill.register('modules/emoji', require('quill-emoji'));



export default function Editor({ initialContent, onChange }) {
    const theme = useTheme();
    const [shortcuts, setShortcuts] = useState([]);
    const [selectedOption, setSelectedOption] = useState('contacts');
    const [filteredShortcuts, setFilteredShortcuts] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

    const [editorContent, setEditorContent] = useState(initialContent || '');



    // Define formats for Quill
    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'color', 'background',
        'align', 'code-block', 'script','emoji'
    ];

    // Define modules for Quill
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'size': [] }],
            [{ 'bold': true }, { 'italic': true }, { 'underline': true }, { 'strike': true }, { 'blockquote': true }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image'],
             [{ 'emoji': true }],
            ['clean'] // Remove formatting button
        ],
         'emoji-toolbar': true,
    'emoji-textarea': false,
    'emoji-shortname': true,
    };
    // Handle content change
    const handleEditorChange = (content, delta, source, editor) => {
        setEditorContent(content);
        onChange(content); // Call the onChange prop with the current content
    };

    const handleUploadFiles = (files) => {
        return files.map((file) => ({
            src: URL.createObjectURL(file),
            alt: file.name,
        }));
    };

    useEffect(() => {
        if (initialContent) {
            setEditorContent(initialContent);
        }
    }, [initialContent]);

    const handleOpenDropdown = (event) => {
        setPopoverPosition({
            top: event.currentTarget.getBoundingClientRect().bottom + window.scrollY,
            left: event.currentTarget.getBoundingClientRect().left + window.scrollX,
        });
        setShowDropdown(!showDropdown);
    };

    const handleCloseDropdown = () => {
        setShowDropdown(false);
    };

    const handleAddShortcut = (shortcode) => {
        setEditorContent((prevContent) => (prevContent || '') + ` [${shortcode}]`);
        setShowDropdown(false);
    };

    useEffect(() => {
        // Set shortcuts based on selected option
        if (selectedOption === 'contacts') {
            const contactShortcuts = [
                { title: 'Account Shortcodes', isBold: true },
                { title: 'Account Name', isBold: false, value: 'ACCOUNT_NAME' },
                { title: 'Custom field:Website', isBold: false, value: 'ACCOUNT_CUSTOM_FIELD:Website' },
                { title: 'Contact Shortcodes', isBold: true, },
                { title: 'Contact Name', isBold: false, value: 'CONTACT_NAME' },
                { title: 'First Name', isBold: false, value: 'FIRST_NAME' },
                { title: 'Middle Name', isBold: false, value: 'MIDDLE_NAME' },
                { title: 'Last Name', isBold: false, value: 'LAST_NAME' },
                { title: 'Phone number', isBold: false, value: 'PHONE_NUMBER' },
                { title: 'Country', isBold: false, value: 'COUNTRY' },
                { title: 'Company name', isBold: false, value: 'COMPANY_NAME ' },
                { title: 'Street address', isBold: false, value: 'STREET_ADDRESS' },
                { title: 'City', isBold: false, value: 'CITY' },
                { title: 'State/Province', isBold: false, value: 'STATE / PROVINCE' },
                { title: 'Zip/Postal code', isBold: false, value: 'ZIP / POSTAL CODE' },
                { title: 'Custom field:Email', isBold: false, value: 'CONTACT_CUSTOM_FIELD:Email' },
                { title: 'Date Shortcodes', isBold: true },
                { title: 'Current day full date', isBold: false, value: 'CURRENT_DAY_FULL_DATE' },
                { title: 'Current day number', isBold: false, value: 'CURRENT_DAY_NUMBER' },
                { title: 'Current day name', isBold: false, value: 'CURRENT_DAY_NAME' },
                { title: 'Current week', isBold: false, value: 'CURRENT_WEEK' },
                { title: 'Current month number', isBold: false, value: 'CURRENT_MONTH_NUMBER' },
                { title: 'Current month name', isBold: false, value: 'CURRENT_MONTH_NAME' },
                { title: 'Current quarter', isBold: false, value: 'CURRENT_QUARTER' },
                { title: 'Current year', isBold: false, value: 'CURRENT_YEAR' },
                { title: 'Last day full date', isBold: false, value: 'LAST_DAY_FULL_DATE' },
                { title: 'Last day number', isBold: false, value: 'LAST_DAY_NUMBER' },
                { title: 'Last day name', isBold: false, value: 'LAST_DAY_NAME' },
                { title: 'Last week', isBold: false, value: 'LAST_WEEK' },
                { title: 'Last month number', isBold: false, value: 'LAST_MONTH_NUMBER' },
                { title: 'Last month name', isBold: false, value: 'LAST_MONTH_NAME' },
                { title: 'Last quarter', isBold: false, value: 'LAST_QUARTER' },
                { title: 'Last_year', isBold: false, value: 'LAST_YEAR' },
                { title: 'Next day full date', isBold: false, value: 'NEXT_DAY_FULL_DATE' },
                { title: 'Next day number', isBold: false, value: 'NEXT_DAY_NUMBER' },
                { title: 'Next day name', isBold: false, value: 'NEXT_DAY_NAME' },
                { title: 'Next week', isBold: false, value: 'NEXT_WEEK' },
                { title: 'Next month number', isBold: false, value: 'NEXT_MONTH_NUMBER' },
                { title: 'Next month name', isBold: false, value: 'NEXT_MONTH_NAME' },
                { title: 'Next quarter', isBold: false, value: 'NEXT_QUARTER' },
                { title: 'Next year', isBold: false, value: 'NEXT_YEAR' }
            ];
            setShortcuts(contactShortcuts);
        } else if (selectedOption === 'account') {
            const accountShortcuts = [
                { title: 'Account Shortcodes', isBold: true },
                { title: 'Account Name', isBold: false, value: 'ACCOUNT_NAME' },
                { title: 'Custom field:Website', isBold: false, value: 'ACCOUNT_CUSTOM_FIELD:Website' },
                { title: 'Date Shortcodes', isBold: true },
                { title: 'Current day full date', isBold: false, value: 'CURRENT_DAY_FULL_DATE' },
                { title: 'Current day number', isBold: false, value: 'CURRENT_DAY_NUMBER' },
                { title: 'Current day name', isBold: false, value: 'CURRENT_DAY_NAME' },
                { title: 'Current week', isBold: false, value: 'CURRENT_WEEK' },
                { title: 'Current month number', isBold: false, value: 'CURRENT_MONTH_NUMBER' },
                { title: 'Current month name', isBold: false, value: 'CURRENT_MONTH_NAME' },
                { title: 'Current quarter', isBold: false, value: 'CURRENT_QUARTER' },
                { title: 'Current year', isBold: false, value: 'CURRENT_YEAR' },
                { title: 'Last day full date', isBold: false, value: 'LAST_DAY_FULL_DATE' },
                { title: 'Last day number', isBold: false, value: 'LAST_DAY_NUMBER' },
                { title: 'Last day name', isBold: false, value: 'LAST_DAY_NAME' },
                { title: 'Last week', isBold: false, value: 'LAST_WEEK' },
                { title: 'Last month number', isBold: false, value: 'LAST_MONTH_NUMBER' },
                { title: 'Last month name', isBold: false, value: 'LAST_MONTH_NAME' },
                { title: 'Last quarter', isBold: false, value: 'LAST_QUARTER' },
                { title: 'Last_year', isBold: false, value: 'LAST_YEAR' },
                { title: 'Next day full date', isBold: false, value: 'NEXT_DAY_FULL_DATE' },
                { title: 'Next day number', isBold: false, value: 'NEXT_DAY_NUMBER' },
                { title: 'Next day name', isBold: false, value: 'NEXT_DAY_NAME' },
                { title: 'Next week', isBold: false, value: 'NEXT_WEEK' },
                { title: 'Next month number', isBold: false, value: 'NEXT_MONTH_NUMBER' },
                { title: 'Next month name', isBold: false, value: 'NEXT_MONTH_NAME' },
                { title: 'Next quarter', isBold: false, value: 'NEXT_QUARTER' },
                { title: 'Next year', isBold: false, value: 'NEXT_YEAR' }
            ];
            setShortcuts(accountShortcuts);
        }
    }, [selectedOption]);

    useEffect(() => {
        setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes('')));
    }, [shortcuts]);

    return (
        <Box

        >

            <div className="editor-container">
                <ReactQuill
                    value={editorContent}
                    onChange={handleEditorChange}
                    theme="snow"
                    modules={modules}  // Pass the defined modules
                    formats={formats}  // Pass the defined formats
                    style={{ height: '250px', }}
                />
            </div>
            <Box sx={{mt:3}}>
                <Button onClick={handleOpenDropdown} variant="contained" sx={{ mt: 7 }}>
                    Shortcode
                </Button>
                <Popover
                    open={showDropdown}
                    onClose={handleCloseDropdown}
                    anchorReference="anchorPosition"
                    anchorPosition={{ top: popoverPosition.top, left: popoverPosition.left }}
                >
                    <Box>
                        <List className="dropdown-list" sx={{ width: '300px', height: '300px', cursor: 'pointer' }}>
                            {filteredShortcuts.map((shortcut, index) => (
                                <ListItem
                                    key={index}
                                    onClick={() => handleAddShortcut(shortcut.value)}
                                >
                                    <ListItemText
                                        primary={shortcut.title}
                                        primaryTypographyProps={{
                                            style: {
                                                fontWeight: shortcut.isBold ? 'bold' : 'normal',
                                            },
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Popover>
            </Box>

        </Box>
    );
}
