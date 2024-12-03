


import React, { useState, useEffect } from 'react';
import { Chip, Box, Button, InputLabel, MenuItem, Select, TextField, Typography, Autocomplete } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import { AiOutlinePlusCircle, AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';
const ContactForm = ({ onContactUpdated ,selectedContact, handleClose, isSmallScreen }) => {
    const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
    const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
    // State variables for form fields
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contactName, setContactName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [note, setNote] = useState('');
    const [ssn, setSsn] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumbers, setPhoneNumbers] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [tagsNew, setTagsNew] = useState([]);
    const [tags, setTags] = useState([]);
    const [contactId, setContactId] = useState(null); // Added state for contact ID
    const [combinedTagsValues, setCombinedTagsValues] = useState([]);
    useEffect(() => {
        if (selectedContact) {
            setFirstName(selectedContact.firstName || '');
            setMiddleName(selectedContact.middleName || '');
            setLastName(selectedContact.lastName || '');
            setContactName(selectedContact.contactName || '');
            setCompanyName(selectedContact.companyName || '');
            setNote(selectedContact.note || '');
            setSsn(selectedContact.ssn || '');
            setEmail(selectedContact.email || '');
            setSelectedCountry(selectedContact.country || '');
            setStreetAddress(selectedContact.streetAddress || '');
            setCity(selectedContact.city || '');
            setState(selectedContact.state || '');
            setPostalCode(selectedContact.postalCode || '');
            setContactId(selectedContact._id || null); // Set contact ID

            const flatPhoneNumbers = selectedContact.phoneNumbers?.[0] || [];
            setPhoneNumbers(flatPhoneNumbers.map(phone => ({ id: Date.now(), phone, isPrimary: false })));


       const flatTags = selectedContact.tags?.[0] || [];
        setTagsNew(flatTags.map(tag => ({
            value: tag._id,
            label: tag.tagName,
            colour: tag.tagColour,
            customTagStyle: {
                backgroundColor: tag.tagColour,
                color: "#fff",
                alignItems: "center",
                textAlign: "center",
                padding: "2px,8px",
                fontSize: '15px',
                cursor: 'pointer',
            },
        })));

        // Set combinedTagsValues to match the tags in the contact
        setCombinedTagsValues(flatTags.map(tag => tag._id));     

            
            console.log('Tags:', selectedContact.tags);
           
            
        }
    }, [selectedContact]);
    

    const [countries, setCountries] = useState([]);
    useEffect(() => {
        axios
            .get('https://restcountries.com/v3.1/all')
            .then((response) => {
                const countryData = response.data.map((country) => ({
                    name: country.name.common,
                    code: country.cca2,
                }));
                setCountries(countryData);
            })
            .catch((error) =>
                console.error('Error fetching country data:', error)
            );
    }, []);
    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
        // setCountry(event.target.value);
    };

    const handlePhoneNumberChange = (id, phone) => {
        setPhoneNumbers((prevPhoneNumbers) =>
            prevPhoneNumbers.map((item) =>
                item.id === id ? { ...item, phone } : item
            )
        );
    };

    const handleAddPhoneNumber = () => {
        setPhoneNumbers((prevPhoneNumbers) => [
            ...prevPhoneNumbers,
            { id: Date.now(), phone: '', isPrimary: false },
        ]);
    };

    const handleDeletePhoneNumber = (id) => {
        setPhoneNumbers((prevPhoneNumbers) =>
            prevPhoneNumbers.filter((item) => item.id !== id)
        );
    };

    
    const handleTagChange = (event, newValue) => {
        // setTagsNew(newValue);
        // const selectedTagsValues = newValue.map((option) => option.value);
        // setCombinedValues(selectedTagsValues);
         setTagsNew(newValue);
        // Map selected options to their values and send as an array
        const selectedTagsValues = newValue.map((option) => option.value);
        // console.log(selectedTagsValues);
        setCombinedTagsValues(selectedTagsValues);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
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
        const baseWidth = 10;
        const charWidth = 8;
        const padding = 10;
        return baseWidth + (charWidth * tagName.length) + padding;
    };

    const options = tags.map((tag) => ({
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
            fontSize: '10px',
            width: `${calculateWidth(tag.tagName)}px`,
            margin: '7px',
            cursor: 'pointer',
        },
        customTagStyle: {
            backgroundColor: tag.tagColour,
            color: "#fff",
            alignItems: "center",
            textAlign: "center",
            padding: "2px,8px",
            fontSize: '15px',
            cursor: 'pointer',
        },
    }));

    const handleSave = async () => {
        const updatedContact = {
            firstName,
            middleName,
            lastName,
            contactName,
            companyName,
            note,
            ssn,
            email,
            // phoneNumbers,
            phoneNumbers: phoneNumbers.map((phone) => phone.phone),
            country: selectedCountry,
            streetAddress,
            city,
            state,
            postalCode,
            tags: combinedTagsValues,
        };

        try {
            const response = await fetch(`${CONTACT_API}/contacts/${contactId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedContact),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Contact updated:', result);
                toast.success('Contact updated successfully!');
                if (onContactUpdated) {
                    onContactUpdated(); // Call the callback function
                }
                handleClose(); // Close the form on success
            } else {
                console.error('Failed to update contact:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating contact:', error);
            toast.error('Failed to update contact');
        }
        
    };

    return (
        <form style={{ paddingRight: '3%', paddingLeft: '3%', height: '90vh', overflowY: 'auto' }} className='contact-form'>
            <Typography variant="h6" gutterBottom sx={{ ml: 1, fontWeight: 'bold', mt: 2 }}>
                Contact info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: isSmallScreen ? 2 : 5, padding: '1px 5px 0 5px' }}>
                <Box>
                    <InputLabel sx={{ color: 'black' }}>First name</InputLabel>
                    <TextField
                        margin="normal"
                        fullWidth
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        size="small"
                    />
                </Box>
                <Box>
                    <InputLabel sx={{ color: 'black' }}>Middle Name</InputLabel>
                    <TextField
                        margin="normal"
                        fullWidth
                        name="middleName"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        placeholder="Middle Name"
                        size="small"
                    />
                </Box>
                <Box>
                    <InputLabel sx={{ color: 'black' }}>Last Name</InputLabel>
                    <TextField
                        fullWidth
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        margin="normal"
                        placeholder="Last name"
                        size="small"
                    />
                </Box>
            </Box>
            <Box>
                <InputLabel sx={{ color: 'black' }}>Contact Name</InputLabel>
                <TextField
                    name="contactName"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    fullWidth
                    placeholder="Contact Name"
                    margin="normal"
                    size="small"
                />
            </Box>
            <Box>
                <InputLabel sx={{ color: 'black' }}>Company Name</InputLabel>
                <TextField
                    fullWidth
                    name="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    margin="normal"
                    placeholder="Company Name"
                    size="small"
                />
            </Box>
            <Box>
                <InputLabel sx={{ color: 'black' }}>Note</InputLabel>
                <TextField
                    fullWidth
                    name="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    margin="normal"
                    placeholder="Note"
                    size="small"
                />
            </Box>
            <Box>
                <InputLabel sx={{ color: 'black' }}>SSN</InputLabel>
                <TextField
                    fullWidth
                    name="ssn"
                    value={ssn}
                    onChange={(e) => setSsn(e.target.value)}
                    margin="normal"
                    placeholder="SSN"
                    size="small"
                />
            </Box>
            <Box>
                <InputLabel sx={{ color: 'black' }}>Email</InputLabel>
                <TextField
                    fullWidth
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    placeholder="Email"
                    size="small"
                />
            </Box>
            <Box>
                <InputLabel sx={{ color: 'black' }}>Tags</InputLabel>
                <Autocomplete
                    multiple
                    size='small'
                    id="tags-outlined"
                    options={options}
                    getOptionLabel={(option) => option.label}
                    value={tagsNew}
                    onChange={handleTagChange}
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
                            sx={{ width: '100%', marginTop: '8px' }}
                        />
                    )}
                    renderOption={(props, option) => (
                        <Box component="li" {...props} style={option.customStyle}>
                            {option.label}
                        </Box>
                    )}
                />
            </Box>
            <Typography variant="h6" gutterBottom sx={{ ml: 1, fontWeight: 'bold', mt: 3 }}>
                Phone Numbers
            </Typography>
            {phoneNumbers.map((phone) => (
                <Box
                    key={phone.id}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 2,
                        ml: 1,
                        mb: 2,
                    }}
                >
                    {phone.isPrimary && (
                        <Chip
                            label="Primary phone"
                            color="primary"
                            size="small"
                            sx={{ position: 'absolute', mt: -3 }}
                        />
                    )}
                    <PhoneInput
                        country={'us'}
                        value={phone.phone}
                        onChange={(phoneValue) => handlePhoneNumberChange(phone.id, phoneValue)}
                        inputStyle={{
                            width: '100%',
                        }}
                        buttonStyle={{
                            borderTopLeftRadius: '8px',
                            borderBottomLeftRadius: '8px',
                        }}
                        containerStyle={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    />
                    <AiOutlineDelete
                        onClick={() => handleDeletePhoneNumber(phone.id)}
                        style={{ cursor: 'pointer', color: 'red' }}
                    />
                </Box>
            ))}
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: isSmallScreen ? 'center' : 'flex-start',
                    ml: 1,
                    cursor: 'pointer',
                    color: 'blue',
                    fontWeight: 600,
                }}
                onClick={handleAddPhoneNumber}
            >
                <AiOutlinePlusCircle style={{ marginTop: '20px' }} />
                <p>Add phone number</p>
            </Box>
            <Typography variant="h6" gutterBottom sx={{ ml: 1, fontWeight: 'bold', mt: 3 }}>
                Address
            </Typography>
            <Box>
                <InputLabel sx={{ color: 'black' }}>Country</InputLabel>
                <Select
                    size='small'
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    sx={{
                        width: '100%',
                        marginTop: '8px'
                    }}
                >
                    {countries.map((country) => (
                        <MenuItem key={country.code} value={country.code}>
                            {country.name}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            <Box>
                <InputLabel sx={{ color: 'black' }}>Street Address</InputLabel>
                <TextField
                    fullWidth
                    name="streetAddress"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    margin="normal"
                    placeholder="Street Address"
                    size="small"
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: isSmallScreen ? 2 : 5, padding: '1px 5px 0 5px' }}>
            <Box>
                <InputLabel sx={{ color: 'black' }}>City</InputLabel>
                <TextField
                    fullWidth
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    margin="normal"
                    placeholder="City"
                    size="small"
                />
            </Box>
            <Box>
                <InputLabel sx={{ color: 'black' }}>State</InputLabel>
                <TextField
                    fullWidth
                    name="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    margin="normal"
                    placeholder="State"
                    size="small"
                />
            </Box>
            <Box>
                <InputLabel sx={{ color: 'black' }}>Postal Code</InputLabel>
                <TextField
                    fullWidth
                    name="postalCode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    margin="normal"
                    placeholder="Postal Code"
                    size="small"
                />
            </Box>
            </Box>
            <Box sx={{ mt: 2 ,mb:2}}>
                <Button
                    variant="contained"
                    
                    onClick={handleSave} // Attach the save handler
                >
                    Save
                </Button>
                <Button
                    variant="outlined"
                  
                    onClick={handleClose}
                    sx={{ ml: 2 }}
                >
                    Cancel
                </Button>
            </Box>
        </form>
    );
};

export default ContactForm;