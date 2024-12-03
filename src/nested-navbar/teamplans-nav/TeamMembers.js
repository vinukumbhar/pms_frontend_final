import React, { useState, useEffect, useContext } from "react";
import Switch from 'react-switch';
import { NavLink, Outlet } from 'react-router-dom';
import { AiOutlinePlusCircle } from "react-icons/ai";
import { SlQuestion } from "react-icons/sl";
import './teammember.css'
import { RxCross2 } from "react-icons/rx";
import Select from 'react-select'
import { ToastContainer, toast } from "react-toastify";
import { LoginContext } from '../../../Components/ContextProvider/Context';

const TeamMembers = () => {

    // Setting up environment variables
    const API_KEY = process.env.REACT_APP_API_IP;
    const FAPI_KEY = process.env.REACT_APP_FAPI_IP;

    const [isCheckedPayments, setIsCheckedPayments] = useState(false);
    const [isCheckedPipelines, setIsCheckedPipelines] = useState(false);
    const [isCheckedTimeEntries, setIsCheckedTimeEntries] = useState(false);
    const [isCheckedAccounts, setIsCheckedAccounts] = useState(false);
    const [isCheckedTags, setIsCheckedTags] = useState(false);
    const [isCheckedOrganizers, setIsCheckedOrganizers] = useState(false);
    const [isCheckedFirmBalance, setIsCheckedFirmBalance] = useState(false);
    const [isCheckedContacts, setIsCheckedContacts] = useState(false);
    const [isCheckedSite, setIsCheckedSite] = useState(false);
    const [isCheckedServices, setIsCheckedServices] = useState(false);
    const [isCheckedFilterTemplates, setIsCheckedFilterTemplates] = useState(false);
    const [isCheckedTemplates, setIsCheckedTemplates] = useState(false);
    const [isCheckedMarketplace, setIsCheckedMarketplace] = useState(false);
    const [isCheckedInvoices, setIsCheckedInvoices] = useState(false);
    const [isCheckedJobRecurrences, setIsCheckedJobRecurrences] = useState(false);
    const [isCheckedRatesTimeEntries, setIsCheckedRatesTimeEntries] = useState(false);
    const [isCheckedAllAccounts, setIsCheckedAllAccounts] = useState(false);
    const [isCheckedCustomFields, setIsCheckedCustomFields] = useState(false);
    const [isCheckedAllContacts, setIsCheckedAllContacts] = useState(false);
    const [isCheckedTeammates, setIsCheckedTeammates] = useState(false);
    const [isCheckedProposals, setIsCheckedProposals] = useState(false);
    const [isCheckedViewReporting, setIsCheckedViewReporting] = useState(false);
    const [isCheckedEmail, setIsCheckedEmail] = useState(false);
    const [isCheckedTranscripts, setIsCheckedTranscripts] = useState(false);
    const [isCheckedOrgnizerAnswers, setIsCheckedOrgnizerAnswers] = useState(false);
    const [isCheckedDocuments, setIsCheckedDocuments] = useState(false);

    const handleSwitchViewReporting = (checked) => {
        setIsCheckedViewReporting(checked)
    }
    const handleSwitchTranscripts = (checked) => {
        setIsCheckedTranscripts(checked)
    }
    const handleSwitchDocuments = (checked) => {
        setIsCheckedDocuments(checked)
    }
    const handleSwitchOrgnizerAnswers = (checked) => {
        setIsCheckedOrgnizerAnswers(checked)
    }
    const handleSwitchEmail = (checked) => {
        setIsCheckedEmail(checked)
    }
    const handleSwitchProposals = (checked) => {
        setIsCheckedProposals(checked)
    }
    const handleSwitchAllContacts = (checked) => {
        setIsCheckedAllContacts(checked)
    }
    const handleSwitchTeammates = (checked) => {
        setIsCheckedTeammates(checked)
    }
    const handleSwitchCustomFields = (checked) => {
        setIsCheckedCustomFields(checked)
    }
    const handleSwitchAllAccounts = (checked) => {
        setIsCheckedAllAccounts(checked)
    }
    const handleSwitchRatesTimeEntries = (checked) => {
        setIsCheckedRatesTimeEntries(checked)
    }
    const handleSwitchJobRecurrences = (checked) => {
        setIsCheckedJobRecurrences(checked)
    }
    const handleSwitchInvoices = (checked) => {
        setIsCheckedInvoices(checked)
    }
    const handleSwitchSite = (checked) => {
        setIsCheckedSite(checked)
    }
    const handleSwitchServices = (checked) => {
        setIsCheckedServices(checked)
    }
    const handleSwitchFilterTemplates = (checked) => {
        setIsCheckedFilterTemplates(checked)
    }
    const handleSwitchTemplates = (checked) => {
        setIsCheckedTemplates(checked)
    }
    const handleSwitchMarketplace = (checked) => {
        setIsCheckedMarketplace(checked)
    }
    const handleSwitchContacts = (checked) => {
        setIsCheckedContacts(checked)
    }
    const handleSwitchFirmBalance = (checked) => {
        setIsCheckedFirmBalance(checked)
    }
    const handleSwitchOrganizers = (checked) => {
        setIsCheckedOrganizers(checked)
    }
    const handleSwitchTags = (checked) => {
        setIsCheckedTags(checked)
    }
    const handleSwitchAccounts = (checked) => {
        setIsCheckedAccounts(checked)
    }
    const handleSwitchTime = (checked) => {
        setIsCheckedTimeEntries(checked)
    }
    const handleSwitchPayments = (checked) => {
        setIsCheckedPayments(checked);
    };
    const handleSwitchPipelines = (checked) => {
        setIsCheckedPipelines(checked);
    };
    const [isFormOpen, setIsFormOpen] = useState(false);
    const handleAddTeamMember = () => {
        setIsFormOpen(!isFormOpen);
    };
    const [selectedOption, setSelectedOption] = useState(null);
    // const [selectedRole, setSelectedRole]
    const options = [
        { value: 'employee', label: 'Employee' },
        { value: 'admin', label: 'Admin' },
    ]
    const handleOptionChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };
    const handleFormClose = () => {
        setIsFormOpen(false);
    };

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEMail] = useState("");
    const handleFirstName = (event) => {
        setFirstName(event.target.value);
    };

    const handleMiddleName = (event) => {
        setMiddleName(event.target.value);
    };
    const handleLastName = (event) => {
        setLastName(event.target.value);
    };


    // Function to check if email exists
    const checkEmailExists = async (enteredEmail) => {
        const myHeaders = new Headers();
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${API_KEY}/common/user/email/getuserbyemail/${enteredEmail}`, requestOptions);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const result = await response.text();
            // Check if user array is empty
            if (result.error) {
                // No such user, email does not exist
                return false;
            } else {
                // Email exists
                return true;
            }
        } catch (error) {
            console.error(error);
            return false; // Return false if an error occurs
        }
    };
    const handleEmail = async (event) => {
        const enteredEmail = event.target.value;
        console.log(enteredEmail)
        setEMail(enteredEmail);
        // Check if email exists
        const exists = await checkEmailExists(enteredEmail);
        setEmailValidation(exists ? "Email already exists" : "");
    };

    console.log(firstName)
    console.log(middleName)
    console.log(lastName)
    console.log(email)
    console.log(selectedOption)


    const [firstNameValidation, setFirstNameValidation] = useState('');
    const [lastNameValidation, setLastNameValidation] = useState('');
    const [emailValidation, setEmailValidation] = useState('');
    //todo handle submit indivisual
    const handleSubmitTeamMember = () => {


        if (firstName === "") {
            setFirstNameValidation("First Name can't be blank");
        } else {
            setFirstNameValidation("");
        }

        // Validation for Last Name
        if (lastName === "") {
            setLastNameValidation("Last Name can't be blank");
        } else {
            setLastNameValidation("");
        }

        // Validation for Phone Number
        if (email === "") {
            setEmailValidation("Email is compalsary");
        } else {
            setEmailValidation("");
        }

        // If all validations pass, proceed to next step
        if (firstName && lastName && email) {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                firstName: firstName,
                middleName: middleName,
                lastName: lastName,
                email: email,
                role: selectedOption.value,
                managePayments: isCheckedPayments,
                manageInvoices: isCheckedInvoices,
                managePipelines: isCheckedPipelines,
                manageJobRecurrence: isCheckedJobRecurrences,
                manageTimeEntries: isCheckedTimeEntries,
                manageRatesinTimeEntries: isCheckedRatesTimeEntries,
                manageAccounts: isCheckedAccounts,
                viewallAccounts: isCheckedAllAccounts,
                manageTags: isCheckedTags,
                manageCustomFields: isCheckedCustomFields,
                manageOrganizers: isCheckedOrganizers,
                assignTeamMates: isCheckedTeammates,
                chargeFirmBalance: isCheckedFirmBalance,
                viewAllContacts: isCheckedAllContacts,
                manageContacts: isCheckedContacts,
                manageProposals: isCheckedProposals,
                manageSites: isCheckedSite,
                manageEmails: isCheckedEmail,
                manageServices: isCheckedServices,
                editOrganizersAnswers: isCheckedOrgnizerAnswers,
                managePublicFilterTemplates: isCheckedFilterTemplates,
                manageDocuments: isCheckedDocuments,
                manageTemplates: isCheckedTemplates,
                manageIRSTranscripts: isCheckedTranscripts,
                manageMarketPlace: isCheckedMarketplace,
                viewReporting: isCheckedViewReporting
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };
            const url = `${API_KEY}/admin/teammember`;

            fetch(url, requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        toast.error("Team member with this email already  exist.");
                    }
                    return response.text();
                })
                .then((result) => {
                    console.log(result);
                    newUser();
                })

                .catch((error) => console.error(error));
        }
    }
    //************************ */
    const newUser = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            username: firstName,
            email: email,
            role: "TeamMember",
            password: firstName,
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
        const url = `${API_KEY}/common/login/signup/`;
        fetch(url, requestOptions)
            .then((response) => response.text())

            .then((result) => {
                console.log(result);
                sendmail();
            })

            .catch((error) => console.error(error));
    };

    const { logindata } = useContext(LoginContext);
    const sendmail = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        console.log(logindata.user.id);

        const port = window.location.port;
        const raw = JSON.stringify({
            email: email,
            owneremail: logindata.user.id,
            url: `${FAPI_KEY}:${port}/activate/`

        });

        console.log(raw);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        const url = `${API_KEY}/teammembersavedemail/`;
        fetch(url, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result)
                toast.success("Team Member saved successfully!")
                window.location.reload();
            })
            .catch((error) => {
                console.error(error)
                toast.error("An error occurred while submitting the form", error);
            });
    }






    return (
        <div className="email">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="email-nav" style={{ display: 'flex', gap: '50px', }}>
                    <NavLink to='/teams/teammembers/active'>Active members</NavLink>
                    <NavLink to='/teams/teammembers/deactivated' >Deactivated members</NavLink>

                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--links-background)', fontWeight: '600', cursor: 'pointer' }} onClick={handleAddTeamMember}>
                    <div>
                        <AiOutlinePlusCircle />
                    </div>
                    <div>
                        Add team member
                    </div>

                </div>
            </div>
            <div> <hr /></div>
            <div style={{ paddingTop: '20px' }}><Outlet /></div>

            <div className={`team-form-container ${isFormOpen ? "team-form-open" : ""}`}>
                <div className="team-header">
                    <h3>Add team member</h3>
                    <RxCross2 onClick={handleFormClose} className="close-form-icon" />

                </div>
                <div className="team-content-form" style={{ height: '80vh', overflowY: 'auto' }}>

                    <div className="name-container" style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                        <div className="form-group ">
                            <label htmlFor="text" className="name" >First name</label>

                            <div className="inputfield-container">
                                <input
                                    onChange={handleFirstName}
                                    type="text"
                                    name="firstname"
                                    id="firstname"
                                    placeholder="First name"
                                    style={{
                                        padding: "8px 12px",
                                        width: "100%",
                                        border: "2px solid rgb(100, 149, 237)",
                                        borderRadius: "10px",
                                        margin: "10px 0"
                                    }}
                                />
                            </div>
                            <div style={{ color: 'red', fontSize: "9px" }}>{firstNameValidation}</div>
                        </div>
                        <div className="form-group ">
                            <label htmlFor="text">Middle name</label>

                            <div className="inputfield-container">
                                <input name="middlename" id="middlename" onChange={handleMiddleName} placeholder="Middle name" style={{ padding: "8px 12px", width: "100%", border: "2px solid rgb(100, 149, 237)", borderRadius: "10px", margin: "10px 0" }} />
                                {/*  */}
                            </div>
                        </div>
                        <div className="form-group ">
                            <label htmlFor="text">Last name</label>

                            <div className="inputfield-container">
                                <input name="lastname" id="lastname" placeholder="Last name" onChange={handleLastName} style={{ padding: "8px 12px", width: "100%", border: "2px solid rgb(100, 149, 237)", borderRadius: "10px", margin: "10px 0" }} />
                                {/*  */}
                            </div>
                            <div style={{ color: 'red', fontSize: "9px" }}>{lastNameValidation}</div>
                        </div>
                    </div>
                    <div className="form-group " style={{ marginBottom: '5px' }}>
                        <label htmlFor="email">Email</label>

                        <div className="inputfield-container">
                            <input name="email" id="email" placeholder="Email" onChange={handleEmail} style={{ padding: "8px 12px", width: "100%", border: "2px solid rgb(100, 149, 237)", borderRadius: "10px", margin: "10px 0" }} />
                            {/*  */}
                        </div>
                        <div style={{ color: 'red', fontSize: "9px" }}>{emailValidation}</div>
                    </div>
                    <div>
                        <Select options={options} onChange={handleOptionChange} value={selectedOption} />
                    </div>

                    {selectedOption && selectedOption.value === 'employee' && (
                        <div className="rights" style={{ marginTop: '10px' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <p>Access Rights</p>
                                <SlQuestion style={{ color: 'blue', cursor: 'pointer' }} />
                            </div>
                            <div className="rights-switches">
                                <div className="grid-one">
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchPayments}

                                            checked={isCheckedPayments}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage payments</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchPipelines}
                                            checked={isCheckedPipelines}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage pipelines</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchTime}
                                            checked={isCheckedTimeEntries}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage time entries</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchAccounts}
                                            checked={isCheckedAccounts}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage accounts</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchTags}
                                            checked={isCheckedTags}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage tags</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchOrganizers}
                                            checked={isCheckedOrganizers}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage organizers</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchFirmBalance}
                                            checked={isCheckedFirmBalance}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage firm balance</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchContacts}
                                            checked={isCheckedContacts}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage contacts</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchSite}
                                            checked={isCheckedSite}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage site</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchServices}
                                            checked={isCheckedServices}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage services</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchFilterTemplates}
                                            checked={isCheckedFilterTemplates}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage public filter templates</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchTemplates}
                                            checked={isCheckedTemplates}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage templates</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchMarketplace}
                                            checked={isCheckedMarketplace}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage marketplace</p>
                                    </div>
                                </div>
                                <div className="grid-one">
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchInvoices}
                                            checked={isCheckedInvoices}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage invoices</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchJobRecurrences}
                                            checked={isCheckedJobRecurrences}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage job recurrences</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchRatesTimeEntries}
                                            checked={isCheckedRatesTimeEntries}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage rates in time entries</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchAllAccounts}
                                            checked={isCheckedAllAccounts}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>View all accounts</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchCustomFields}
                                            checked={isCheckedCustomFields}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage custome fields</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchTeammates}
                                            checked={isCheckedTeammates}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage teammates</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchAllContacts}
                                            checked={isCheckedAllContacts}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>View all contacts</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchProposals}
                                            checked={isCheckedProposals}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage proposals</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchEmail}
                                            checked={isCheckedEmail}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Mute emails</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchOrgnizerAnswers}
                                            checked={isCheckedOrgnizerAnswers}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Edit orgnizer answers</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchDocuments}
                                            checked={isCheckedDocuments}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage documents</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchTranscripts}
                                            checked={isCheckedTranscripts}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>Manage IRS Transcripts</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <Switch
                                            onChange={handleSwitchViewReporting}
                                            checked={isCheckedViewReporting}
                                            onColor="#3A91F5"
                                            onHandleColor="#FFF"
                                            handleDiameter={10}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={32}
                                            className="react-switch"
                                        />
                                        <p>View reporting</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
                <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button className="btn1" onClick={handleSubmitTeamMember} >Send Invite</button>
                        <button className="btn2" onClick={handleFormClose}>Cancle</button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default TeamMembers