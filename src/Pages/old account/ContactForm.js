
import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { AiOutlinePlusCircle, AiOutlineDelete } from 'react-icons/ai';
import {
    Button,
    Box,
    Typography,
    useMediaQuery,
    Chip,
    MenuItem,
    Select,ListItem,
    TextField,
    InputLabel,
    Autocomplete
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './contact.css';

import { toast } from 'react-toastify';
import { RxCross2 } from "react-icons/rx";
const ContactForm = ({ handleNewDrawerClose, handleDrawerClose }) => {

    const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
    const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;

    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [phoneNumbers, setPhoneNumbers] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);

    // Individual state hooks for form fields
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contactName, setContactName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [note, setNote] = useState('');
    const [ssn, setSsn] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [combinedValues, setCombinedValues] = useState([]);
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

    const handlePhoneNumberChange = (id, phone) => {
        setPhoneNumbers((prevPhoneNumbers) =>
            prevPhoneNumbers.map((item) =>
                item.id === id ? { ...item, phone } : item
            )
        );
    };

    // Update contactName when firstName, middleName, or lastName changes
    useEffect(() => {
        setContactName(`${firstName} ${middleName} ${lastName}`.trim());
    }, [firstName, middleName, lastName]);

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

    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
        setCountry(event.target.value);
    };

    const sendingData = async (e) => {
        e.preventDefault();
        handleNewDrawerClose()
        handleDrawerClose()

        const raw = JSON.stringify([{

            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            contactName: contactName,
            companyName: companyName,
            note: note,
            ssn: ssn,
            email: email,
            login: false,
            notify: false,
            emailSync: false,
            tags: combinedValues,
            country: country,
            streetAddress: streetAddress,
            city: city,
            state: state,
            postalCode: postalCode,
            phoneNumbers: phoneNumbers.map((phone) => phone.phone),






        }])

        const requestOptions = {
            method: "POST",

            headers: {
                'Content-Type': 'application/json',
            },
            body: raw,
            redirect: "follow",
        };
        const url = `${CONTACT_API}/contacts/`;
        fetch(url, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((result) => {
                // Handle success
                toast.success('Contact created successfully!');
                //console.log('Contact ID:', result);  // Log the contactId

                navigate('/clients/contacts');

                // Additional logic after successful creation if needed
            })
            .catch((error) => {
                // Handle errors
                console.error(error);
                toast.error('Failed to create contact');

            })
    };

    const handleClose = () => {
        handleNewDrawerClose();
        handleDrawerClose();
    }





    const [selectedTags, setSelectedTags] = useState([]);


    // const handleTagChange = (event) => {
    //     const selectedValues = event.target.value;
    //     setSelectedTags(selectedValues);

    //     // Send selectedValues array to your backend
    //     console.log("Selected Values:", selectedValues);
    //     // Assuming setCombinedValues is a function to send the values to your backend
    //     setCombinedValues(selectedValues);
    // };
    const handleTagChange = (event, newValue) => {
        setSelectedTags(newValue.map((option) => option.value));

        // Send selectedValues array to your backend
        console.log("Selected Values:", newValue.map((option) => option.value));
        // Assuming setCombinedValues is a function to send the values to your backend
        setCombinedValues(newValue.map((option) => option.value));
    };

    //Tag FetchData ================
    const [tags, setTags] = useState([]);
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
    //  for tags
    const calculateWidth = (tagName) => {

        const baseWidth = 10; // base width for each tag
        const charWidth = 8; // approximate width of each character
        const padding = 10; // padding on either side
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

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid grey' }}>
                <Typography variant='h6'>New Contact</Typography>
                <RxCross2 onClick={handleNewDrawerClose} style={{ cursor: 'pointer' }} />
            </Box>
            <form style={{ paddingRight: '3%', paddingLeft: '3%', height: '90vh', overflowY: 'auto' }} className='contact-form'>
                <Typography variant="h6" gutterBottom sx={{ ml: 1, fontWeight: 'bold', mt: 2 }}>
                    Contact info
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: isSmallScreen ? 'column' : 'row',
                        gap: isSmallScreen ? 2 : 5,
                        padding: '1px 5px 0 5px',

                    }}
                >
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
                <Box >


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
                <Box >

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
                <Box >

                    <InputLabel sx={{ color: 'black' }}>Note</InputLabel>

                    <TextField
                        fullWidth
                        name="note"
                        value={note}
                        multiline
                        onChange={(e) => setNote(e.target.value)}
                        margin="normal"
                        placeholder="Note"
                        size="small"
                    />
                </Box>
                <Box >

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
                <Box >

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
                <Box >

                    <InputLabel sx={{ color: 'black' }}>Tags</InputLabel>

                    <Autocomplete
                        multiple
                        size='small'
                        id="tags-outlined"
                        options={options}
                        getOptionLabel={(option) => option.label}
                        value={options.filter(option => selectedTags.includes(option.value))}
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
                            onChange={(phoneValue) =>
                                handlePhoneNumberChange(phone.id, phoneValue)
                            }
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
                    {/* <Select
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
                    </Select> */}
                     <Autocomplete
                          size="small"
                          options={countries}
                          getOptionLabel={(option) => option.name}
                          value={selectedCountry}
                          onChange={(event, newValue) => setSelectedCountry(newValue)}
                          renderOption={(props, option) => (
                            <ListItem
                              {...props}
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '8px',
                                borderBottom: '1px solid #ddd',
                                cursor: 'pointer'
                              }}
                            >
                              <Typography sx={{ fontWeight: 500 }}>{option.name}</Typography>
                              <Typography sx={{ fontSize: '0.9rem', color: 'gray' }}>{option.code}</Typography>
                            </ListItem>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Country"
                              variant="outlined"
                              sx={{ marginTop: '8px', width: '100%' }}
                            />
                          )}
                        />
                </Box>
                <Box>

                    <InputLabel sx={{ color: 'black', mt: 2 }}>Street address</InputLabel>

                    <TextField
                        fullWidth
                        name="streetAddress"
                        value={streetAddress}
                        onChange={(e) =>
                            setStreetAddress(e.target.value)
                        }
                        margin="normal"
                        placeholder="Street address"
                        size="small"
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: isSmallScreen
                            ? 'column'
                            : 'row',
                        gap: isSmallScreen ? 2 : 5,
                        mt: 2
                    }}
                >
                    <Box>

                        <InputLabel sx={{ color: 'black' }}>City</InputLabel>

                        <TextField
                            fullWidth
                            margin="normal"
                            name="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                            size="small"
                        />
                    </Box>
                    <Box>

                        <InputLabel sx={{ color: 'black' }}>State/Province</InputLabel>

                        <TextField
                            margin="normal"
                            name="state"
                            fullWidth
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="State/Province"
                            size="small"
                        />
                    </Box>
                    <Box>

                        <InputLabel sx={{ color: 'black' }}>ZIP/Postal Code</InputLabel>

                        <TextField
                            margin="normal"
                            fullWidth
                            name="postalCode"
                            value={postalCode}
                            onChange={(e) =>
                                setPostalCode(e.target.value)
                            }
                            placeholder="ZIP/Postal Code"
                            size="small"
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 4,
                        padding: '1px 5px 15px 5px',
                    }}
                >
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={sendingData}
                        sx={{
                            mt: 2,
                            width: isSmallScreen ? '100%' : 'auto',
                            borderRadius: '10px',
                        }}
                    >
                        Create
                    </Button>
                    <Button
                        type="button"
                        variant="outlined"
                        color="primary"
                        onClick={handleClose}
                        sx={{
                            mt: 2,
                            width: isSmallScreen ? '100%' : 'auto',
                            borderRadius: '10px',
                        }}

                    >
                        Cancel
                    </Button>
                </Box>
            </form>

        </Box>
    );
};

export default ContactForm;
