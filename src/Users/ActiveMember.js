import React, { useEffect, useState, useMemo, useContext } from "react";
import { Link } from "react-router-dom";
// import { useNavigate, useParams } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { SlQuestion } from "react-icons/sl";
import { styled } from "@mui/material/styles";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import Drawer from "@mui/material/Drawer";
import { Select, Menu, MenuItem, IconButton, Paper, Box, Typography, useTheme, useMediaQuery, Button, InputLabel, TextField, Divider } from "@mui/material";
import { CiMenuKebab } from "react-icons/ci";
import Switch from "react-switch";
import { LoginContext } from "../Sidebar/Context/Context";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { ToastContainer, toast } from "react-toastify";
import Grid from "@mui/material/Unstable_Grid2";
import { useNavigate } from "react-router-dom";

const ActiveMember = () => {
  // http://68.251.138.236:8880

  const { logindata } = useContext(LoginContext);
  // const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const [userData, setUserData] = useState([]);
  const fetchuserData = async () => {
    try {
      const url = `${LOGIN_API}/common/user/${logindata.user.id}`;
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
      console.log(data.user.id);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchuserData();
  }, []);
  console.log(userData);
  const USER_API = process.env.REACT_APP_USER_URL;
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const WINDOWS_PORT = process.env.REACT_APP_SERVER_URI;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  // const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const handleNewDrawerClose = () => {
    setIsUpdateDrawerOpen(false);
  };
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleDelete = () => {
    // Handle the delete action
    console.log("Delete", selectedRow);
    handleMenuClose();
  };

  const fetchData = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const url = `${LOGIN_API}/admin/teammember/teammemberlist/list/true`;

      const response = await fetch(url, requestOptions);
      const result = await response.json();

      const loggedInUser = {
        _id: userData._id,
        FirstName: userData.username, // Assuming you want to display the username in FirstName
        MiddleName: "",
        LastName: "",
        // Name: userData.username,
        Email: userData.email,
        Role: userData.role,
        has2FA: "Disabled",
        Created: userData.updatedAt,
      };

      const updatedTeamMembers = [loggedInUser, ...result.teamMemberslist];

      setTeamMembers(updatedTeamMembers);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userData) {
      fetchData();
    }
  }, [userData]);

  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [getId, setGetId] = useState("");
  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
  };
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const handleUpdateDrawerOpen = () => {
    setIsUpdateDrawerOpen(true);
  };

  const handleDeleteMember = async (_id) => {
    // console.log(_id);

    // const requestOptions = {
    //   method: "DELETE",
    //   redirect: "follow",
    // };

    // try {
    //   const response = await fetch(`${LOGIN_API}/admin/teammember/${_id}`, requestOptions);
    //   if (!response.ok) {
    //     throw new Error(`Error: ${response.status} - ${response.statusText}`);
    //   }
    //   const result = await response.text();
    //   console.log(result);
    //   toast.success("Team Member deleted successfully!");
    //   // fetchData();
    // } catch (error) {
    //   console.error(error);
    //   toast.error("An error occurred while deleting the member");
    // }
    const isConfirmed = window.confirm("Are you sure you want to delete this account ?");
    if (isConfirmed) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        active: false,
      });

      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${LOGIN_API}/admin/teammember/${_id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          console.log(_id);

          getTeamMenberUser(_id);
          fetchData();
        })
        .catch((error) => console.error(error));
    }
  };
  const getTeamMenberUser = async (id) => {
    // /teammember
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,

      redirect: "follow",
    };

    fetch(`${LOGIN_API}/admin/teammember/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        console.log(result.teamMember.userid);
        HandleUserDeactivate(result.teamMember.userid);
      })
      .catch((error) => console.error(error));
  };
  const HandleUserDeactivate = async (userid) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      active: false,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(userid);
    fetch(`${LOGIN_API}/common/user/${userid}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success("Team Member Deactivated Successfully");
      })
      .catch((error) => console.error(error));
  };
  const handleEdit = async (_id) => {
    setGetId(_id);
    console.log("Edit action triggered for template id: ", tempIdget);
    setOpenMenuId(false);
    const response = await fetch(`${LOGIN_API}/admin/teammember/` + tempIdget);
    if (!response.ok) {
      throw new Error("Failed to fetch  data");
    }
    const data = await response.json();
    console.log(data);
    setFirstName(data.teamMember.firstName);
    setMiddleName(data.teamMember.middleName);
    setLastName(data.teamMember.lastName);
    setEMail(data.teamMember.email);
    setSelectedOption(data.teamMember.role);

    setIsCheckedPayments(data.teamMember.managePayments);
    setIsCheckedPipelines(data.teamMember.managePipelines);
    setIsCheckedTimeEntries(data.teamMember.manageTimeEntries);
    setIsCheckedAccounts(data.teamMember.manageAccounts);
    setIsCheckedTags(data.teamMember.manageTags);
    setIsCheckedOrganizers(data.teamMember.manageOrganizers);
    setIsCheckedFirmBalance(data.teamMember.chargeFirmBalance);

    setIsCheckedContacts(data.teamMember.manageContacts);
    setIsCheckedSite(data.teamMember.manageSites);

    setIsCheckedServices(data.teamMember.manageServices);
    setIsCheckedFilterTemplates(data.teamMember.managePublicFilterTemplates);
    setIsCheckedTemplates(data.teamMember.manageTemplates);

    setIsCheckedMarketplace(data.teamMember.manageMarketPlace);
    setIsCheckedInvoices(data.teamMember.manageInvoices);

    setIsCheckedJobRecurrences(data.teamMember.manageJobRecurrence);
    setIsCheckedRatesTimeEntries(data.teamMember.manageRatesinTimeEntries);
    setIsCheckedAllAccounts(data.teamMember.viewallAccounts);
    setIsCheckedCustomFields(data.teamMember.manageCustomFields);
    setIsCheckedAllContacts(data.teamMember.viewAllContacts);

    setIsCheckedTeammates(data.teamMember.assignTeamMates);
    setIsCheckedProposals(data.teamMember.manageProposals);
    setIsCheckedViewReporting(data.teamMember.viewReporting);
    setIsCheckedEmail(data.teamMember.manageEmails);
    setIsCheckedTranscripts(data.teamMember.manageIRSTranscripts);
    setIsCheckedOrgnizerAnswers(data.teamMember.editOrganizersAnswers);
    setIsCheckedDocuments(data.teamMember.manageDocuments);
  };

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
    setIsCheckedViewReporting(checked);
  };
  const handleSwitchTranscripts = (checked) => {
    setIsCheckedTranscripts(checked);
  };
  const handleSwitchDocuments = (checked) => {
    setIsCheckedDocuments(checked);
  };
  const handleSwitchOrgnizerAnswers = (checked) => {
    setIsCheckedOrgnizerAnswers(checked);
  };
  const handleSwitchEmail = (checked) => {
    setIsCheckedEmail(checked);
  };
  const handleSwitchProposals = (checked) => {
    setIsCheckedProposals(checked);
  };
  const handleSwitchAllContacts = (checked) => {
    setIsCheckedAllContacts(checked);
  };
  const handleSwitchTeammates = (checked) => {
    setIsCheckedTeammates(checked);
  };
  const handleSwitchCustomFields = (checked) => {
    setIsCheckedCustomFields(checked);
  };
  const handleSwitchAllAccounts = (checked) => {
    setIsCheckedAllAccounts(checked);
  };
  const handleSwitchRatesTimeEntries = (checked) => {
    setIsCheckedRatesTimeEntries(checked);
  };
  const handleSwitchJobRecurrences = (checked) => {
    setIsCheckedJobRecurrences(checked);
  };
  const handleSwitchInvoices = (checked) => {
    setIsCheckedInvoices(checked);
  };
  const handleSwitchSite = (checked) => {
    setIsCheckedSite(checked);
  };
  const handleSwitchServices = (checked) => {
    setIsCheckedServices(checked);
  };
  const handleSwitchFilterTemplates = (checked) => {
    setIsCheckedFilterTemplates(checked);
  };
  const handleSwitchTemplates = (checked) => {
    setIsCheckedTemplates(checked);
  };
  const handleSwitchMarketplace = (checked) => {
    setIsCheckedMarketplace(checked);
  };
  const handleSwitchContacts = (checked) => {
    setIsCheckedContacts(checked);
  };
  const handleSwitchFirmBalance = (checked) => {
    setIsCheckedFirmBalance(checked);
  };
  const handleSwitchOrganizers = (checked) => {
    setIsCheckedOrganizers(checked);
  };
  const handleSwitchTags = (checked) => {
    setIsCheckedTags(checked);
  };
  const handleSwitchAccounts = (checked) => {
    setIsCheckedAccounts(checked);
  };
  const handleSwitchTime = (checked) => {
    setIsCheckedTimeEntries(checked);
  };
  const handleSwitchPayments = (checked) => {
    setIsCheckedPayments(checked);
  };
  const handleSwitchPipelines = (checked) => {
    setIsCheckedPipelines(checked);
  };

  const [selectedOption, setSelectedOption] = useState("");

  const options = [
    { value: "employee", label: "Employee" },
    { value: "admin", label: "Admin" },
  ];

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEMail] = useState("");
  const handleFirstName = (e) => setFirstName(e.target.value);

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
      redirect: "follow",
    };

    try {
      const response = await fetch(`${LOGIN_API}/common/user/email/getuserbyemail/${enteredEmail}`, requestOptions);
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
    console.log(enteredEmail);
    setEMail(enteredEmail);
    // Check if email exists
    const exists = await checkEmailExists(enteredEmail);
    setEmailValidation(exists ? "Email already exists" : "");
  };

  const [firstNameValidation, setFirstNameValidation] = useState("");
  const [lastNameValidation, setLastNameValidation] = useState("");
  const [emailValidation, setEmailValidation] = useState("");

  const Item = styled("Box")(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

  // Function to check if email exists
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
    const url = `${LOGIN_API}/common/login/signup/`;
    fetch(url, requestOptions)
      .then((response) => response.text())

      .then((result) => {
        console.log(result);
        toast.success("Team Member Updated Successfully");
        handleNewDrawerClose();
        // sendmail();
      })

      .catch((error) => console.error(error));
  };
  //for bydefault showing login data
  //     const { logindata } = useContext(LoginContext);
  //     console.log(logindata)
  //     console.log(logindata.user.id);
  //     const [userData, setUserData] = useState([]);
  //     const fetchuserData = async () => {
  //         try {
  //           const url = `http://127.0.0.1:8880/common/user/userlist/list/${logindata.user.id}`;
  //           const response = await fetch(url);
  //           const data = await response.json();
  //           setUserData(data);
  //         } catch (error) {
  //           console.error("Error fetching data:", error);
  //         }
  //       };

  //       useEffect(() => {
  //         fetchuserData();
  //       }, []);
  // console.log(userData)

  const sendmail = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // const port = window.location.port;
    const raw = JSON.stringify({
      email: email,
      // owneremail: logindata.user.id,
      // url: "http://localhost:3000/activate/",
      url: `${WINDOWS_PORT}/activate/`,
    });

    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${LOGIN_API}/teammembersavedemail/`;

    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        toast.success("Team Member Update successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred while submitting the form", error);
      });
  };

  const handleUpdateTeamMember = () => {
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
        // role: selectedOption.value,
        role: selectedOption,
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
        viewReporting: isCheckedViewReporting,
      });
      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${LOGIN_API}/admin/teammember/${tempIdget}`;

      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            toast.error("Team member with this email already  exist.");
          }
          return response.text();
        })
        .then((result) => {
          console.log(result);
          // toast.success("Team Member Upadted Successfully");
          // handleNewDrawerClose();
          newUser();
        })

        .catch((error) => console.error(error));
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "FirstName",
        header: "Name",
        Cell: ({ row }) => {
          const firstName = row.original?.FirstName;
          const middleName = row.original?.MiddleName;
          const lastName = row.original?.LastName;
          const initials = `${firstName ? firstName[0] : ""}${lastName ? lastName[0] : ""}`;

          const isLoggedInUser = row.index === 0;
          // Route to Account Settings for first row, Team Member Update for others
          const linkPath = isLoggedInUser ? `/settings/myaccount` : `/updateteammember/${row.original?.id}`;
          return (
            <div>
              <div className="circle">{initials}</div>
              <Link to={linkPath}>{`${firstName ? firstName : ""}  ${middleName ? middleName : ""} ${lastName ? lastName : ""}`}</Link>
              {/* <Link to={`/updateteammember/${row.original?.id}`}>{`${firstName ? firstName : ""}  ${middleName ? middleName : ""} ${lastName ? lastName : ""}`}</Link>{" "} */}
            </div>
          );
        },
      },
      { accessorKey: "Email", header: "Email" },
      { accessorKey: "Role", header: "Role" },
      {
        accessorKey: "Created",
        header: "Created",
        Cell: ({ cell }) => {
          const dateValue = cell.getValue();
          const date = new Date(dateValue);

          if (isNaN(date)) {
            return "Invalid Date";
          }

          return date
            .toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })
            .replace(",", "");
        },
      },
      { accessorKey: "has2FA", header: "2FA", Cell: ({ value }) => (value ? "Enabled" : "Disabled") },
      {
        accessorKey: "Actions",
        header: "Actions",
        Cell: ({ row }) => (
          <IconButton
            onClick={() => toggleMenu(row.original.id)}
            style={{ color: "#2c59fa", position: "relative" }} // Added position relative for proper positioning
          >
            <CiMenuKebab style={{ fontSize: "25px" }} />
            {openMenuId === row.original.id && (
              <Box
                sx={{
                  position: "absolute",
                  zIndex: 10, // Ensure it's on top of other elements
                  backgroundColor: "#fff",
                  boxShadow: 1,
                  borderRadius: 1,
                  p: 1,
                  left: "30px",
                  m: 2,
                }}
              >
                <Typography
                  sx={{ fontSize: "12px", fontWeight: "bold" }}
                  onClick={() => {
                    handleEdit(row.original._id);
                    handleUpdateDrawerOpen();
                  }}
                >
                  Edit
                </Typography>
                <Typography sx={{ fontSize: "12px", color: "red", fontWeight: "bold" }} onClick={() => handleDeleteMember(row.original.id)}>
                  Deactivate
                </Typography>
              </Box>
            )}
          </IconButton>
        ),
      },
    ],
    [openMenuId]
  );

  const table = useMaterialReactTable({
    columns,
    data: teamMembers,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MaterialReactTable table={table} />

      <Box>
        <Drawer
          anchor="right"
          open={isUpdateDrawerOpen}
          onClose={handleNewDrawerClose}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : "650px",
            },
          }}
        >
          <Box role="presentation" sx={{ borderRadius: isSmallScreen ? "0" : "15px" }}>
            <Box>
              <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px" }}>
                <Typography sx={{ fontWeight: "bold" }} variant="h4">
                  {" "}
                  update Team Member
                </Typography>
                <CloseRoundedIcon onClick={handleNewDrawerClose} style={{ cursor: "pointer" }} />
              </Box>
              <Divider />
            </Box>
            <form style={{ margin: "15px" }}>
              <Box>
                <Box sx={{ width: "100%", mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid xs={12} sm={4}>
                      <Box>
                        <InputLabel sx={{ color: "black" }}>First name</InputLabel>
                        <TextField fullWidth onChange={handleFirstName} id="firstname" name="firstname" placeholder="First name" size="small" sx={{ mt: 1 }} value={firstName} />
                      </Box>
                      <Box style={{ color: "red", fontSize: "9px" }}>{firstNameValidation}</Box>
                    </Grid>
                    <Grid xs={12} sm={4}>
                      <Box sx={{ mr: "15px" }}>
                        <InputLabel sx={{ color: "black" }}>Middle Name</InputLabel>
                        <TextField
                          fullWidth
                          onChange={handleMiddleName}
                          name="middlename"
                          id="middlename"
                          placeholder="Middle Name"
                          size="small"
                          sx={{ mt: 1 }}
                          value={middleName} // Bind value
                        />
                      </Box>
                    </Grid>

                    <Grid xs={12} sm={4}>
                      <Box sx={{ mr: "15px" }}>
                        <InputLabel sx={{ color: "black" }}>Last Name</InputLabel>
                        <TextField fullWidth name="lastname" id="lastname" value={lastName} onChange={handleLastName} placeholder="Last Name" size="small" sx={{ mt: 1 }} />
                      </Box>
                      <Box style={{ color: "red", fontSize: "9px" }}>{lastNameValidation}</Box>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <InputLabel sx={{ color: "black" }}>Email</InputLabel>
                  <TextField
                    // margin="normal"
                    fullWidth
                    value={email}
                    name="email"
                    id="email"
                    onChange={handleEmail}
                    placeholder="Email"
                    size="small"
                    sx={{ mt: 2 }}
                  />
                </Box>
                <Box style={{ color: "red", fontSize: "9px" }}>{emailValidation}</Box>

                <Box>
                  <Select
                    size="small"
                    sx={{ width: "100%", mt: 2 }}
                    value={selectedOption}
                    // onChange={handleOptionChange}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    displayEmpty
                  >
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                {selectedOption === "employee" && (
                  <Box className="rights" style={{ marginTop: "10px" }}>
                    <Box style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <p>Access Rights</p>
                      <SlQuestion style={{ color: "blue", cursor: "pointer" }} />
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                      <Grid container spacing={2} columns={16}>
                        <Grid xs={8}>
                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchPayments} checked={isCheckedPayments} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage payments</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchPipelines} checked={isCheckedPipelines} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage pipelines</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchTime} checked={isCheckedTimeEntries} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage time entries</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchAccounts} checked={isCheckedAccounts} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage accounts</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchTags} checked={isCheckedTags} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage tags</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchOrganizers} checked={isCheckedOrganizers} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage organizers</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchFirmBalance} checked={isCheckedFirmBalance} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage firm balance</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchContacts} checked={isCheckedContacts} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage contacts</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchSite} checked={isCheckedSite} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage site</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchServices} checked={isCheckedServices} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage services</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchFilterTemplates} checked={isCheckedFilterTemplates} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage public filter templates</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchTemplates} checked={isCheckedTemplates} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage templates</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchMarketplace} checked={isCheckedMarketplace} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage marketplace</p>
                          </Box>
                        </Grid>
                        <Grid xs={8}>
                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchInvoices} checked={isCheckedInvoices} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage invoices</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchJobRecurrences} checked={isCheckedJobRecurrences} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage job recurrences</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchRatesTimeEntries} checked={isCheckedRatesTimeEntries} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage rates in time entries</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchAllAccounts} checked={isCheckedAllAccounts} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>View all accounts</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchCustomFields} checked={isCheckedCustomFields} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage custome fields</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchTeammates} checked={isCheckedTeammates} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage teammates</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchAllContacts} checked={isCheckedAllContacts} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>View all contacts</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchProposals} checked={isCheckedProposals} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage proposals</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchEmail} checked={isCheckedEmail} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Mute emails</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchOrgnizerAnswers} checked={isCheckedOrgnizerAnswers} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Edit orgnizer answers</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchDocuments} checked={isCheckedDocuments} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage documents</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchTranscripts} checked={isCheckedTranscripts} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage IRS Transcripts</p>
                          </Box>
                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchViewReporting} checked={isCheckedViewReporting} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>View reporting</p>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                )}
              </Box>
            </form>
            <Box sx={{ pt: 48, display: "flex", alignItems: "center", gap: 5, margin: "8px", ml: 3 }}>
              <Button
                //  onClick={handleSubmitTeamMember}
                variant="contained"
                onClick={handleUpdateTeamMember}
                color="primary"
              >
                Save
              </Button>
              <Button variant="outlined" onClick={handleNewDrawerClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Drawer>
        <ToastContainer />
      </Box>
    </>
  );
};
export default ActiveMember;
