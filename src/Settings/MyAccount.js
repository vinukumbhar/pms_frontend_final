import React, { useState, useRef, useEffect, useContext } from "react";
import "./myaccount.css";
import Box from "@mui/material/Box";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { OutlinedInput, InputAdornment, Typography, useMediaQuery, Button, Select, MenuItem, TextField } from "@mui/material";
import { unstable_ClassNameGenerator as ClassNameGenerator } from "@mui/material/className";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import { useTheme } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import user from "../Images/user.jpg";
import { Switch, FormControlLabel, Checkbox } from "@mui/material";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginContext } from "../Sidebar/Context/Context";
import { gapi } from 'gapi-script';
import Cookies from 'js-cookie';
// Configure ClassNameGenerator
ClassNameGenerator.configure((componentName) => `foo-bar-${componentName}`);

const MyAccount = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const [showSaveButtons, setShowSaveButtons] = useState(false);
  const [showUpdatePassButton, setShowUpdatePassButton] = useState(false);
  const [newPasShow, setNewPassShow] = useState(false);
  const [passShow, setPassShow] = useState(false);
  const [cpassShow, setCPassShow] = useState(false);
  const { logindata } = useContext(LoginContext);
  const [userdata, setuserdata] = useState();
  const [admindata, setadmindata] = useState();
  const [isEditable, setIsEditable] = useState(false);
  const [isLoginEditable, setIsLoginEditable] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastname, setLastName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [signedtime, setSignedTime] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const formatTimePeriod = (seconds) => {
    if (seconds < 3600) {
      return `${Math.ceil(seconds / 60)} minutes`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return minutes > 0 ? `${hours} hours ${minutes} minutes` : `${hours} hours`;
    }
  };

  const fetchData = async () => {
    try {
      const url = `${LOGIN_API}/common/user/${logindata.user.id}`;
      const response = await fetch(url);
      const data = await response.json();

      const validTime = logindata.user.exp - logindata.user.iat;
      setSignedTime(formatTimePeriod(validTime));

      setuserdata(data);
      fetchAdminData(data.email);
      fetchNotificationData(logindata.user.id);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAdminData = async (email) => {
    try {
      const url = `${LOGIN_API}/admin/adminsignup/adminbyemail/${email}`;
      const response = await fetch(url);
      const data = await response.json();

      setadmindata(data.admin[0]);
      console.log(data.admin[0]);
      setFirstName(data.admin[0].firstName);
      setMiddleName(data.admin[0].middleName);
      setLastName(data.admin[0].lastName);
      setPhoneNumber(data.admin[0].phoneNumber);
      setEmail(data.admin[0].email);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSaveButtonClick = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      firstName: firstName,
      middleName: middleName,
      lastName: lastname,
      phoneNumber: phonenumber,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${LOGIN_API}/admin/adminsignup/${admindata._id}`;
    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        toast.success("Data updated successful!");
        // window.location.reload();
        fetchAdminData();
        setIsEditable(false);
        setShowSaveButtons(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred!");
      });
  };

  //******************* */

  const handleEditClick = () => {
    setIsEditable(true);
    setShowSaveButtons(true);
  };
  const handleCancelButtonClick = () => {
    setShowSaveButtons(false);
    setIsEditable(false);
  };
  const [showAlert, setShowAlert] = useState(false);

  // Function to toggle the alert box
  const toggleAlert = () => {
    setShowAlert(!showAlert);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  const handleAuthentication = () => {
    setShowAlert(!showAlert);
  };
  const [isChecked, setIsChecked] = useState(false);
  const [isPaymentsChecked, setIsPaymentsChecked] = useState(false);
  const [isOrganizersChecked, setIsOrganizersChecked] = useState(false);
  const [isUploadsChecked, setIsUploadsChecked] = useState(false);
  const [isSignaturesChecked, setIsSignaturesChecked] = useState(false);
  const [isApprovalsChecked, setIsApprovalsChecked] = useState(false);
  const [isUploadingChecked, setIsUploadingChecked] = useState(false);
  const [isTasksChecked, setIsTasksChecked] = useState(false);
  const [isMessagesChecked, setIsMessagesChecked] = useState(false);
  const [isNewEmailChecked, setIsNewEmailChecked] = useState(false);
  const [isProposalsChecked, setIsProposalsChecked] = useState(false);
  const [isJobsChecked, setIsJobsChecked] = useState(false);
  const [isMentionsChecked, setIsMentionsChecked] = useState(false);
  const [isSmsChecked, setIsSmsChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isPaymentsEmailChecked, setIsPaymentsEmailChecked] = useState(false);
  const [isOrganizersEmailChecked, setIsOrganizersEmailChecked] = useState(false);
  const [isUploadsEmailChecked, setIsUploadsEmailChecked] = useState(false);
  const [isSignaturesEmailChecked, setIsSignaturesEmailChecked] = useState(false);
  const [isApprovalsEmailChecked, setIsApprovalsEmailChecked] = useState(false);
  const [isUploadingEmailChecked, setIsUploadingEmailChecked] = useState(false);
  const [isTasksEmailChecked, setIsTasksEmailChecked] = useState(false);
  const [isMessagesEmailChecked, setIsMessagesEmailChecked] = useState(false);
  const [isNewEmailEmailChecked, setIsNewEmailEmailChecked] = useState(false);
  const [isProposalsEmailChecked, setIsProposalsEmailChecked] = useState(false);
  const [isJobsEmailChecked, setIsJobsEmailChecked] = useState(false);
  const [isMentionsEmailChecked, setIsMentionsEmailChecked] = useState(false);
  const [isSmsEmailChecked, setIsSmsEmailChecked] = useState(false);
  const [SystemLang, setSystemLang] = React.useState("");
  const options = [
    { value: "en", label: "English" },
    { value: "fr", label: "French" },
    { value: "es", label: "Spanish" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "ru", label: "Russian" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    // Add more languages as needed
  ];

  const isCheckedRef = useRef(isChecked);
  const isPaymentsCheckedRef = useRef(isPaymentsChecked);
  const isEmailCheckedRef = useRef(isChecked);
  const isPaymentsEmailCheckedRef = useRef(isPaymentsChecked);
  const isOrganizersCheckedref = useRef(isOrganizersChecked);
  const isOrganizersEmailCheckedRef = useRef(isOrganizersEmailChecked);
  const isUploadsCheckedref = useRef(isUploadsChecked);
  const isUploadsEmailCheckedRef = useRef(isUploadsEmailChecked);
  const isSignaturesCheckedref = useRef(isSignaturesChecked);
  const isSignaturesEmailCheckedRef = useRef(isSignaturesEmailChecked);
  const isApprovalsCheckedref = useRef(isApprovalsChecked);
  const isApprovalsEmailCheckedRef = useRef(isApprovalsEmailChecked);
  const isUploadingCheckedref = useRef(isUploadingChecked);
  const isUploadingEmailCheckedRef = useRef(isUploadingEmailChecked);
  const isTasksCheckedref = useRef(isTasksChecked);
  const isTasksEmailCheckedRef = useRef(isTasksEmailChecked);
  const isMessagesCheckedref = useRef(isMessagesChecked);
  const isMessagesEmailCheckedRef = useRef(isMessagesEmailChecked);
  const isNewEmailCheckedref = useRef(isNewEmailChecked);
  const isNewEmailEmailCheckedRef = useRef(isNewEmailEmailChecked);
  const isProposalsCheckedref = useRef(isProposalsChecked);
  const isProposalsEmailCheckedRef = useRef(isProposalsEmailChecked);
  const isJobsCheckedref = useRef(isJobsChecked);
  const isJobsEmailCheckedRef = useRef(isJobsEmailChecked);
  const isMentionsCheckedref = useRef(isMentionsChecked);
  const isMentionsEmailCheckedRef = useRef(isMentionsEmailChecked);
  const isSmsCheckedref = useRef(isSmsChecked);
  const isSmsEmailCheckedRef = useRef(isSmsEmailChecked);

  useEffect(() => {
    isCheckedRef.current = isChecked;
  }, [isChecked]);
  useEffect(() => {
    isPaymentsCheckedRef.current = isPaymentsChecked;
  }, [isPaymentsChecked]);
  useEffect(() => {
    isEmailCheckedRef.current = isEmailChecked;
  }, [isEmailChecked]);
  useEffect(() => {
    isPaymentsEmailCheckedRef.current = isPaymentsEmailChecked;
  }, [isPaymentsEmailChecked]);
  useEffect(() => {
    isOrganizersCheckedref.current = isOrganizersChecked;
  }, [isOrganizersChecked]);
  useEffect(() => {
    isOrganizersEmailCheckedRef.current = isOrganizersEmailChecked;
  }, [isOrganizersEmailChecked]);
  useEffect(() => {
    isUploadsCheckedref.current = isUploadsChecked;
  }, [isUploadsChecked]);
  useEffect(() => {
    isUploadsEmailCheckedRef.current = isUploadsEmailChecked;
  }, [isUploadsEmailChecked]);
  useEffect(() => {
    isSignaturesCheckedref.current = isSignaturesChecked;
  }, [isSignaturesCheckedref]);
  useEffect(() => {
    isSignaturesEmailCheckedRef.current = isSignaturesEmailChecked;
  }, [isSignaturesEmailChecked]);
  useEffect(() => {
    isApprovalsCheckedref.current = isApprovalsChecked;
  }, [isApprovalsChecked]);
  useEffect(() => {
    isApprovalsEmailCheckedRef.current = isApprovalsEmailChecked;
  }, [isApprovalsEmailChecked]);
  useEffect(() => {
    isUploadingCheckedref.current = isUploadingChecked;
  }, [isUploadingChecked]);
  useEffect(() => {
    isUploadingEmailCheckedRef.current = isUploadingEmailChecked;
  }, [isUploadingEmailChecked]);
  useEffect(() => {
    isTasksCheckedref.current = isTasksChecked;
  }, [isTasksChecked]);
  useEffect(() => {
    isTasksEmailCheckedRef.current = isTasksEmailChecked;
  }, [isTasksEmailChecked]);
  useEffect(() => {
    isMessagesCheckedref.current = isMessagesChecked;
  }, [isMessagesChecked]);
  useEffect(() => {
    isMessagesEmailCheckedRef.current = isMessagesEmailChecked;
  }, [isMessagesEmailChecked]);
  useEffect(() => {
    isNewEmailCheckedref.current = isNewEmailChecked;
  }, [isNewEmailChecked]);
  useEffect(() => {
    isNewEmailEmailCheckedRef.current = isNewEmailEmailChecked;
  }, [isNewEmailEmailChecked]);
  useEffect(() => {
    isProposalsCheckedref.current = isProposalsChecked;
  }, [isProposalsChecked]);
  useEffect(() => {
    isProposalsEmailCheckedRef.current = isProposalsEmailChecked;
  }, [isProposalsEmailChecked]);
  useEffect(() => {
    isJobsCheckedref.current = isJobsChecked;
  }, [isJobsChecked]);
  useEffect(() => {
    isJobsEmailCheckedRef.current = isJobsEmailChecked;
  }, [isJobsEmailChecked]);
  useEffect(() => {
    isMentionsCheckedref.current = isMentionsChecked;
  }, [isMentionsChecked]);
  useEffect(() => {
    isMentionsEmailCheckedRef.current = isMentionsEmailChecked;
  }, [isMentionsEmailChecked]);
  useEffect(() => {
    isSmsCheckedref.current = isSmsChecked;
  }, [isSmsChecked]);
  useEffect(() => {
    isSmsEmailCheckedRef.current = isSmsEmailChecked;
  }, [isSmsEmailChecked]);

  const handleCheckboxChange = () => {
    setIsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handlePaymentsCheckboxChange = () => {
    // setIsPaymentsChecked(!isPaymentsChecked);
    setIsPaymentsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isPaymentsCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleOrganizersCheckboxChange = () => {
    // setIsOrganizersChecked(!isOrganizersChecked);
    setIsOrganizersChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isOrganizersCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleUploadsCheckboxChange = () => {
    // setIsUploadsChecked(!isUploadsChecked);
    setIsUploadsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isUploadsCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleSignaturesCheckboxChange = () => {
    // setIsSignaturesChecked(!isSignaturesChecked);
    setIsSignaturesChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isSignaturesCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleApprovalsCheckboxChange = () => {
    // setIsApprovalsChecked(!isApprovalsChecked);
    setIsApprovalsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isApprovalsCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleUploadingCheckboxChange = () => {
    // setIsUploadingChecked(!isUploadingChecked);
    setIsUploadingChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isUploadingCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleTasksCheckboxChange = () => {
    // setIsTasksChecked(!isTasksChecked);
    setIsTasksChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isTasksCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleMessagesCheckboxChange = () => {
    // setIsMessagesChecked(!isMessagesChecked);
    setIsMessagesChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isMessagesCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleNewEmailCheckboxChange = () => {
    // setIsNewEmailChecked(!isNewEmailChecked);
    setIsNewEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isNewEmailCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleProposalsCheckboxChange = () => {
    // setIsProposalsChecked(!isProposalsChecked);
    setIsProposalsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isProposalsCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleJobsCheckboxChange = () => {
    // setIsJobsChecked(!isJobsChecked);
    setIsJobsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isJobsCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleMentionsCheckboxChange = () => {
    // setIsMentionsChecked(!isMentionsChecked);
    setIsMentionsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isMentionsCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleSmsCheckboxChange = () => {
    // setIsSmsChecked(!isSmsChecked);
    setIsSmsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isSmsCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };

  const handleEmailCheckboxChange = () => {
    // setIsEmailChecked(!isEmailChecked);
    setIsEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handlePaymentsEmailCheckboxChange = () => {
    // setIsPaymentsEmailChecked(!isPaymentsEmailChecked);
    setIsPaymentsEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isPaymentsEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleOrganizersEmailCheckboxChange = () => {
    // setIsOrganizersEmailChecked(!isOrganizersEmailChecked);
    setIsOrganizersEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isOrganizersEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleUploadsEmailCheckboxChange = () => {
    // setIsUploadsEmailChecked(!isUploadsEmailChecked);
    setIsUploadsEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isUploadsEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleSignaturesEmailCheckboxChange = () => {
    // setIsSignaturesEmailChecked(!isSignaturesEmailChecked);
    setIsSignaturesEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isSignaturesEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleApprovalsEmailCheckboxChange = () => {
    // setIsApprovalsEmailChecked(!isApprovalsEmailChecked);
    setIsApprovalsEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isApprovalsEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleUploadingEmailCheckboxChange = () => {
    setIsUploadingEmailChecked(!isUploadingEmailChecked);
    setIsUploadingEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isUploadingEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleTasksEmailCheckboxChange = () => {
    // setIsTasksEmailChecked(!isTasksEmailChecked);
    setIsTasksEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isTasksEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleMessagesEmailCheckboxChange = () => {
    // setIsMessagesEmailChecked(!isMessagesEmailChecked);
    setIsMessagesEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isMessagesEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleNewEmailEmailCheckboxChange = () => {
    // setIsNewEmailEmailChecked(!isNewEmailEmailChecked);
    setIsNewEmailEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isNewEmailEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleProposalsEmailCheckboxChange = () => {
    // setIsProposalsEmailChecked(!isProposalsEmailChecked);
    setIsProposalsEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isProposalsEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleJobsEmailCheckboxChange = () => {
    // setIsJobsEmailChecked(!isJobsEmailChecked);
    setIsJobsEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isJobsEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleMentionsEmailCheckboxChange = () => {
    // setIsMentionsEmailChecked(!isMentionsEmailChecked);
    setIsMentionsEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isMentionsEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleSmsEmailCheckboxChange = () => {
    // setIsSmsEmailChecked(!isSmsEmailChecked);
    setIsSmsEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isSmsEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };

  //********Notification changed update */

  const NotificationUpdate = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      userId: logindata.user.id,
      notifications: [
        { notificationDescription: "Invoices", inbox: isCheckedRef.current, email: isEmailCheckedRef.current },
        { notificationDescription: "Payments", inbox: isPaymentsCheckedRef.current, email: isPaymentsEmailCheckedRef.current },
        { notificationDescription: "Organizers", inbox: isOrganizersCheckedref.current, email: isOrganizersEmailCheckedRef.current },
        { notificationDescription: "Uploads", inbox: isUploadsCheckedref.current, email: isUploadsEmailCheckedRef.current },
        { notificationDescription: "E-signatures", inbox: isSignaturesCheckedref.current, email: isSignaturesEmailCheckedRef.current },
        { notificationDescription: "Approvals", inbox: isApprovalsCheckedref.current, email: isApprovalsEmailCheckedRef.current },
        { notificationDescription: "Done uploading", inbox: isUploadingCheckedref.current, email: isUploadingEmailCheckedRef.current },
        { notificationDescription: "Tasks", inbox: isTasksCheckedref.current, email: isTasksEmailCheckedRef.current },
        { notificationDescription: "Messages", inbox: isMessagesCheckedref.current, email: isMessagesEmailCheckedRef.current },
        { notificationDescription: "New mail", inbox: isNewEmailCheckedref.current, email: isNewEmailEmailCheckedRef.current },
        { notificationDescription: "Proposals", inbox: isProposalsCheckedref.current, email: isProposalsEmailCheckedRef.current },
        { notificationDescription: "Jobs", inbox: isJobsCheckedref.current, email: isJobsEmailCheckedRef.current },
        { notificationDescription: "Mentions", inbox: isMentionsCheckedref.current, email: isMentionsEmailCheckedRef.current },
        { notificationDescription: "SMS", inbox: isSmsCheckedref.current, email: isSmsEmailCheckedRef.current },
      ],
      active: true,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    console.log(notificationdata);

    const url = `${LOGIN_API}/admin/notification/${notificationdata._id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result && result.message === "Notification updated successfully") {
          toast.success("Notification settings updated successfully");
          // setTimeout(() => {
          //   window.location.reload();
          // }, 1000);
        } else {
          toast.error(result.message || "Failed to update Notification");
        }
      })
      .catch((error) => console.error(error));
  };

  const [notificationdata, setNotificationData] = useState();

  // const fetchNotificationData = async (id) => {
  //   const requestOptions = {
  //     method: "GET",
  //     redirect: "follow",
  //   };
  //   const url = `${LOGIN_API}/admin/notification/notificationbyuser/${id}`;
  //   try {
  //     const response = await fetch(url, requestOptions);
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch notifications");
  //     }
  //     const result = await response.text();
  //     const notification = JSON.parse(result);
  //     setNotificationData(notification.notification);

  //     if (notification && Array.isArray(notification.notification.notifications)) {
  //       notification.notification.notifications.forEach((notif) => {
  //         switch (notif.notificationDescription) {
  //           case "Invoices":
  //             setIsChecked(notif.inbox);
  //             setIsEmailChecked(notif.email);
  //             break;
  //           case "Payments":
  //             setIsPaymentsChecked(notif.inbox);
  //             setIsPaymentsEmailChecked(notif.email);
  //             break;
  //           case "Organizers":
  //             setIsOrganizersChecked(notif.inbox);
  //             setIsOrganizersEmailChecked(notif.email);
  //             break;
  //           case "Uploads":
  //             setIsUploadsChecked(notif.inbox);
  //             setIsUploadsEmailChecked(notif.email);
  //             break;
  //           case "E-signatures":
  //             setIsSignaturesChecked(notif.inbox);
  //             setIsSignaturesEmailChecked(notif.email);
  //             break;
  //           case "Approvals":
  //             setIsApprovalsChecked(notif.inbox);
  //             setIsApprovalsEmailChecked(notif.email);
  //             break;
  //           case "Done uploading":
  //             setIsUploadingChecked(notif.inbox);
  //             setIsUploadingEmailChecked(notif.email);
  //             break;
  //           case "Tasks":
  //             setIsTasksChecked(notif.inbox);
  //             setIsTasksEmailChecked(notif.email);
  //             break;
  //           case "Messages":
  //             setIsMessagesChecked(notif.inbox);
  //             setIsMessagesEmailChecked(notif.email);
  //             break;
  //           case "New mail":
  //             setIsNewEmailChecked(notif.inbox);
  //             setIsNewEmailEmailChecked(notif.email);
  //             break;
  //           case "Proposals":
  //             setIsProposalsChecked(notif.inbox);
  //             setIsProposalsEmailChecked(notif.email);
  //             break;
  //           case "Jobs":
  //             setIsJobsChecked(notif.inbox);
  //             setIsJobsEmailChecked(notif.email);
  //             break;
  //           case "Mentions":
  //             setIsMentionsChecked(notif.inbox);
  //             setIsMentionsEmailChecked(notif.email);
  //             break;
  //           case "SMS":
  //             setIsSmsChecked(notif.inbox);
  //             setIsSmsEmailChecked(notif.email);
  //             break;
  //           default:
  //             console.error("Unknown notification type:", notif.notificationDescription);
  //         }
  //       });
  //     } else {
  //       console.error("Notifications array is not defined or not an array");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching notification data:", error);
  //   }
  // };
  const fetchNotificationData = async (id) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${LOGIN_API}/admin/notification/notificationbyuser/${id}`;
    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const result = await response.text();
      const notification = JSON.parse(result);
      setNotificationData(notification.notification);

      if (notification && Array.isArray(notification.notification.notifications)) {
        notification.notification.notifications.forEach((notif) => {
          switch (notif.notificationDescription) {
            case "Invoices":
              setIsChecked(notif.inbox);
              setIsEmailChecked(notif.email);
              break;
            case "Payments":
              setIsPaymentsChecked(notif.inbox);
              setIsPaymentsEmailChecked(notif.email);
              break;
            case "Organizers":
              setIsOrganizersChecked(notif.inbox);
              setIsOrganizersEmailChecked(notif.email);
              break;
            case "Uploads":
              setIsUploadsChecked(notif.inbox);
              setIsUploadsEmailChecked(notif.email);
              break;
            case "E-signatures":
              setIsSignaturesChecked(notif.inbox);
              setIsSignaturesEmailChecked(notif.email);
              break;
            case "Approvals":
              setIsApprovalsChecked(notif.inbox);
              setIsApprovalsEmailChecked(notif.email);
              break;
            case "Done uploading":
              setIsUploadingChecked(notif.inbox);
              setIsUploadingEmailChecked(notif.email);
              break;
            case "Tasks":
              setIsTasksChecked(notif.inbox);
              setIsTasksEmailChecked(notif.email);
              break;
            case "Messages":
              setIsMessagesChecked(notif.inbox);
              setIsMessagesEmailChecked(notif.email);
              break;
            case "New mail":
              setIsNewEmailChecked(notif.inbox);
              setIsNewEmailEmailChecked(notif.email);
              break;
            case "Proposals":
              setIsProposalsChecked(notif.inbox);
              setIsProposalsEmailChecked(notif.email);
              break;
            case "Jobs":
              setIsJobsChecked(notif.inbox);
              setIsJobsEmailChecked(notif.email);
              break;
            case "Mentions":
              setIsMentionsChecked(notif.inbox);
              setIsMentionsEmailChecked(notif.email);
              break;
            case "SMS":
              setIsSmsChecked(notif.inbox);
              setIsSmsEmailChecked(notif.email);
              break;
            default:
              console.error("Unknown notification type:", notif.notificationDescription);
          }
        });
      } else {
        console.error("Notifications array is not defined or not an array");
      }
    } catch (error) {
      console.error("Error fetching notification data:", error);
    }
  };
  console.log(notificationdata);

  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);
  };

  const [userUpdate, setUserUpdate] = useState();
  const handleUpdatePasswordClick = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: email,
      password: password,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/verifyuserandpassword/`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.user);
        setUserUpdate(result.user);

        toast("User Verified successfully.");
        setShowAlert(false);
        setIsLoginEditable(true);
        setShowUpdatePassButton(true);
        // setShowAlert(false);
        // updatePassword(result.user._id )
      })
      .catch((error) => {
        console.error(error);
      });
  };
  console.log(userUpdate);
  const updatePassword = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("id", userUpdate._id);

    // myHeaders.append("Authorization", token);

    // console.log(token)
    const raw = JSON.stringify({
      password: password,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const baseUrl = `${LOGIN_API}/common/user/password/updateuserpassword/`;

    const url = new URL(baseUrl);

    // url.searchParams.append("id", id);
    // url.searchParams.append("token", token);

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then((result) => {
        toast("Password Updated successfully.");
        setIsLoginEditable(false);
        setPassword("");
        setCpassword("");
        // Handle success, if needed
      })
      .catch((error) => {
        console.error("Error updating password:", error.message);
        // Handle error, if needed
      });
  };
  // const [password, setPassword] = useState("");
  //for password
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  //for confiem password
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickConfirmShowPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpConfirmPassword = (event) => {
    event.preventDefault();
  };
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState("");
  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState("");
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleToggleCPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleConfirmPasswordPaste = (e) => {
    const pastedText = e.clipboardData.getData("text");
    setConfirmPassword(pastedText);
  };
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword, confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    validatePassword(password, newConfirmPassword);
  };

  const validatePassword = (newPassword) => {
    // Check if newPassword is defined before performing operations
    if (typeof newPassword !== "undefined") {
      // Example validation criteria: password length >= 8 characters, contains at least one number and one letter
      const hasNumber = /\d/.test(newPassword);
      const hasLetter = /[a-zA-Z]/.test(newPassword);
      const isValid = newPassword.length >= 8 && hasNumber && hasLetter;
      setPasswordValid(isValid);
    }
  };



  //for email synk

  const CLIENT_ID = "1070770223600-nkocmga9ensmg3aaip15rhp0vpjlugd1.apps.googleusercontent.com";
  const API_KEY = "AIzaSyDR042NieiN9Lbz13KAxTTl5ShVW4Ln4yM";
  const SCOPES = "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send";

  const [emailId, setEmailId] = useState('');

  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
        scope: SCOPES,
      }).then(() => {
        // No need to handle signed-in state here
      }).catch(error => {
        console.error("Error initializing GAPI:", error);
      });
    }

    gapi.load("client:auth2", start);
  }, []);


  const handleLogin = () => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      const userEmail = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();
      const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token; // Get access token

      // Store email and access token in cookies
      Cookies.set('emailId', userEmail, { expires: 1 }); // 1 day expiration
      Cookies.set('accessToken', accessToken, { expires: 1 }); // 1 day expiration

    }).catch(error => {
      console.error("Error signing in:", error);
    });
  };

  const handleEmailIdSubmit = (event) => {
    event.preventDefault();
    if (emailId) {
      Cookies.set('emailId', emailId); // Store email in cookies
      handleLogin(); // Trigger Gmail API sign-in
    }
  };



  return (
    <>
      <Box>
        <Typography variant="h4">Account Settings</Typography>
      </Box>
      <Box className="account-settings">
        <Box className="accounts-details-user">
          <Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box className="hr">
                <Typography variant="h6">Personal details</Typography>
              </Box>
              <Box className="user-profile-container">
                <img src={user} alt="" className="user-profile-image" style={{ width: "40px", height: "40px", borderRadius: "50%", marginTop: "25px" }} />
              </Box>
              <Box className="hr">
                <BorderColorRoundedIcon sx={{ float: "right", marginBottom: "10px", cursor: "pointer", color: "#1168bf" }} onClick={handleEditClick} />
              </Box>
            </Box>
            <Box className="contact-details">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isSmallScreen ? "column" : "row",
                  gap: 5,
                  padding: "1px 25px 0 5px",
                }}
              >
                <Box>
                  <Box className="base-TextField-root">
                    <label htmlFor="first-name">First name</label>
                    <TextField name="firstName" disabled={!isEditable} size="small" margin="normal" fullWidth sx={{ backgroundColor: "#fff" }} placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </Box>
                </Box>
                <Box>
                  <Box className="base-TextField-root">
                    <label htmlFor="middle-name">Middle Name</label>
                    <TextField name="middleName" disabled={!isEditable} value={middleName} onChange={(e) => setMiddleName(e.target.value)} size="small" margin="normal" fullWidth placeholder="Middle Name" sx={{ backgroundColor: "#fff" }} />
                  </Box>
                </Box>
                <Box>
                  <Box className="base-TextField-root">
                    <label htmlFor="last-name">Last name</label>
                    <TextField disabled={!isEditable} name="lastName" value={lastname} onChange={(e) => setLastName(e.target.value)} size="small" margin="normal" fullWidth sx={{ backgroundColor: "#fff" }} placeholder="Last name" />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ width: "94%", margin: "8px" }}>
                <Box className="base-TextField-root">
                  <label htmlFor="last-name">Phone Number</label>
                  <TextField disabled={!isEditable} value={phonenumber} onChange={(e) => setPhoneNumber(e.target.value)} name="Phone Number" sx={{ backgroundColor: "#fff" }} size="small" margin="normal" fullWidth placeholder="Last name" />
                </Box>
              </Box>
            </Box>
            {showSaveButtons && (
              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  padding: "1px 5px 0 5px",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleSaveButtonClick}
                  sx={{
                    mt: 2,
                    width: isSmallScreen ? "100%" : "auto",
                    borderRadius: "10px",
                  }}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  onClick={handleCancelButtonClick}
                  sx={{
                    mt: 2,
                    width: isSmallScreen ? "100%" : "auto",
                    borderRadius: "10px",
                  }}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
          <Box className="login-details-user">
            <Box className="login-header">
              <Typography variant="h6" ml={1}>
                Login Details
              </Typography>
              <BorderColorRoundedIcon onClick={toggleAlert} sx={{ color: "#1168bf", cursor: "pointer", mr: 2 }} />
              {showAlert && (
                <Box className="overlay">
                  <Box className="overlay-login-container">
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="h6">Authentication</Typography>
                      <CloseRoundedIcon onClick={handleCloseAlert} />
                    </Box>
                    <hr style={{ margin: "15px 0" }} />
                    <Box>
                      <Typography>In order to change your login details you must provide your current password.</Typography>
                    </Box>
                    <Box className="password-TextField" style={{ display: "flex", flexDirection: "column", position: "relative", marginTop: "3%" }}>
                      <Box className="TextFieldfield-container">
                        <Box sx={{ width: "94%", margin: "8px" }}>
                          <Box className="base-TextField-root">
                            <label className="custom-input-label">Password</label>
                            <TextField name="lastName" type={!passShow ? "password" : "text"} placeholder="Enter Your Password" id="password" size="small" margin="normal" fullWidth />
                          </Box>
                        </Box>
                        <Box className="showpass" onClick={() => setPassShow(!passShow)} style={{ position: "absolute", top: "65%", transform: "translateY(-50%)", right: "20px", cursor: "pointer" }}>
                          {!passShow ? <VisibilityRoundedIcon /> : <VisibilityOffRoundedIcon />}
                        </Box>
                      </Box>
                    </Box>
                    <Box>
                      <NavLink to="/forgotpass" style={{ color: "rgb(100, 149, 237)", textDecoration: "none" }}>
                        Forgot Password?
                      </NavLink>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 4,
                        padding: "1px 5px 0 5px",
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                          mt: 2,
                          width: isSmallScreen ? "100%" : "auto",
                          borderRadius: "10px",
                        }}
                        onClick={handleUpdatePasswordClick}
                      >
                        Submit
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        color="primary"
                        onClick={handleCloseAlert}
                        sx={{
                          mt: 2,
                          width: isSmallScreen ? "100%" : "auto",
                          borderRadius: "10px",
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
            <Box className="hr" style={{ marginTop: "10px" }}></Box>
            <Box sx={{ width: "94%", margin: "8px" }}>
              <Box className="base-TextField-root">
                <label htmlFor="last-name">Email</label>
                <TextField name="Email" disabled value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter Your Password" id="password" size="small" margin="normal" fullWidth sx={{ backgroundColor: "#fff" }} />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                gap: 5,
                padding: "1px 25px 0 5px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box mt={2}>
                  <Typography htmlFor="password">Password</Typography>
                  <OutlinedInput
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    size="small"
                    disabled={!isLoginEditable}
                    placeholder="Password"
                    // onChange={handlePasswordChange}
                    sx={{ width: "100%", borderRadius: "10px", mt: 1 }}
                    endAdornment={
                      <InputAdornment position="end" sx={{ cursor: "pointer" }} onClick={handleTogglePasswordVisibility}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </InputAdornment>
                    }
                  />
                            
                </Box>
                <Box>
                  <Typography htmlFor="confirmPassword">Confirm Password</Typography>
                  <OutlinedInput
                    type={showConfirmPassword ? "text" : "password"}
                    value={cpassword}
                    onChange={(e) => setCpassword(e.target.value)}
                    size="small"
                    disabled={!isLoginEditable}
                    placeholder="Confirm Password"
                    // onChange={handleConfirmPasswordChange}
                    // onPaste={handleConfirmPasswordPaste} // Allow pasting
                    sx={{ width: "100%", borderRadius: "10px", mt: 1 }}
                    endAdornment={
                      <InputAdornment position="end" sx={{ cursor: "pointer" }} onClick={handleToggleCPasswordVisibility}>
                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </InputAdornment>
                    }
                  />
                </Box>
              </Box>
            </Box>
            <Box sx={{ width: "94%", margin: "8px" }}>
              <Box className="base-TextField-root">
                <label htmlFor="last-name">Stay signed in for</label>
                <TextField name="Staysigned" size="small" margin="normal" fullWidth sx={{ backgroundColor: "#fff" }} value={signedtime} onChange={(e) => setSignedTime(e.target.value)} placeholder="Stay signed in for" disabled={true} />
              </Box>
            </Box>
            {showUpdatePassButton && (
              <Button variant="contained" onClick={updatePassword}>
                Update Password
              </Button>
            )}
          </Box>
          {/* <Box></Box> */}
          <Box className="authentication">
            <Box className="authentication-header">
              <Typography variant="h6" ml={1}>
                Two-factor authentication
              </Typography>
            </Box>
            <Box className="hr" style={{ marginTop: "10px" }}></Box>
            <Box style={{ display: "flex", gap: "10px", marginTop: "25px", cursor: "pointer", alignItems: "center" }}>
              <Switch onChange={handleAuthentication} />
              <Box style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <p onClick={handleAuthentication}>Turn on two-factor authencation</p>
                <HelpOutlineRoundedIcon style={{ color: "blue" }} />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="notifiaction-details">
          <Box className="preferences">
            <Box className="preferences-header">
              <Typography variant="h6"> Notification preferences</Typography>
              <HelpOutlineRoundedIcon style={{ color: "blue" }} />
            </Box>
            <Box className="hr" style={{ marginTop: "10px" }}></Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr" }}>
              <Box>
                <Box style={{ padding: "20px" }}></Box>
                <hr />
                <div className="lists">
                  <div style={{ margin: "10px 0" }}>
                    <p>Invoices</p>
                  </div>
                  <hr />
                  <div style={{ margin: "10px 0" }}>
                    <p>Payments</p>
                  </div>
                  <hr />
                  <div style={{ margin: "10px 0" }}>
                    <p>Organizers</p>
                  </div>
                  <hr />
                  <div style={{ margin: "10px 0" }}>
                    <p>Documents</p>
                  </div>
                  <hr />
                  <div style={{ margin: "10px 0 10px 15px" }}>
                    <p>Uploads</p>
                  </div>
                  <hr />
                  <div style={{ margin: "10px 0 10px 15px" }}>
                    <p>E-signatures</p>
                  </div>
                  <hr />
                  <div style={{ margin: "10px 0 10px 15px" }}>
                    <p>Approvals</p>
                  </div>
                  <hr />
                  <div style={{ margin: "10px 0 10px 15px" }}>
                    <p>"Done uploading"</p>
                  </div>
                  <hr />
                  <div style={{ margin: "10px 0" }}>
                    <p>Tasks</p>
                  </div>
                  <hr />
                  <div style={{ margin: "10px 0" }}>
                    <p>Messages</p>
                  </div>
                  <hr />
                  <div style={{ margin: "10px 0" }}>
                    <p>New mail</p>
                  </div>
                  <hr />
                  <div style={{ margin: "10px 0" }}>
                    <p>Proposals</p>
                  </div>
                  <hr />
                  <div style={{ margin: "10px 0" }}>
                    <p>Jobs</p>
                  </div>
                  <hr />
                  <div style={{ margin: "10px 0" }}>
                    <p>Mentions</p>
                  </div>
                  <hr />
                  <div style={{ margin: "10px 0" }}>
                    <p>SMS</p>
                  </div>
                  <hr />
                </div>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Box style={{ padding: "9.5px" }}>INBOX+</Box>
                <hr />
                <Box className="lists">
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isPaymentsChecked}
                          onChange={handlePaymentsCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isOrganizersChecked}
                          onChange={handleOrganizersCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "11.5px ", padding: "15px" }}></Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isUploadsChecked}
                          onChange={handleUploadsCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isSignaturesChecked}
                          onChange={handleSignaturesCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isApprovalsChecked}
                          onChange={handleApprovalsCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isUploadingChecked}
                          onChange={handleUploadingCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isTasksChecked}
                          onChange={handleTasksCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isMessagesChecked}
                          onChange={handleMessagesCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isNewEmailChecked}
                          onChange={handleNewEmailCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isProposalsChecked}
                          onChange={handleProposalsCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />

                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isJobsChecked}
                          onChange={handleJobsCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isMentionsChecked}
                          onChange={handleMentionsCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isSmsChecked}
                          onChange={handleSmsCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                </Box>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Box style={{ padding: "9.5px" }}>EMAIL</Box>
                <hr />
                <Box className="lists">
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isEmailChecked}
                          onChange={handleEmailCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isPaymentsEmailChecked}
                          onChange={handlePaymentsEmailCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isOrganizersEmailChecked}
                          onChange={handleOrganizersEmailCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "11.5px ", padding: "15px" }}></Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isUploadsEmailChecked}
                          onChange={handleUploadsEmailCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isSignaturesEmailChecked}
                          onChange={handleSignaturesEmailCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isApprovalsEmailChecked}
                          onChange={handleApprovalsEmailCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isUploadingEmailChecked}
                          onChange={handleUploadingEmailCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isTasksEmailChecked}
                          onChange={handleTasksEmailCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isMessagesEmailChecked}
                          onChange={handleMessagesEmailCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isNewEmailEmailChecked}
                          onChange={handleNewEmailEmailCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isProposalsEmailChecked}
                          onChange={handleProposalsEmailCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />

                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isJobsEmailChecked}
                          onChange={handleJobsEmailCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isMentionsEmailChecked}
                          onChange={handleMentionsEmailCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                  <Box style={{ margin: "15px " }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            width: 10, // Width of the checkbox
                            height: 20, // Height of the checkbox
                            color: "#ADD8E6",
                            "& .MuiSvgIcon-root": {
                              fontSize: 20, // Size of the checkmark inside the checkbox
                            },
                          }}
                          checked={isSmsEmailChecked}
                          onChange={handleSmsEmailCheckboxChange}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                    />
                  </Box>
                  <hr />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="emailsyns">
            <Box>
              <Typography variant="h6"> Email Sync</Typography>
            </Box>
            <Box className="hr" style={{ marginTop: "10px" }}></Box>
            <Box style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "20px" }}>
              <p>Sync your existing email with TaxDome — all your client messages in one place.</p>
              <HelpOutlineRoundedIcon style={{ color: "blue" }} />
            </Box>
            <Box style={{ marginTop: "25px" }}>
              <Box sx={{ width: "94%", margin: "8px" }}>
                <Box className="base-TextField-root">
                  <label htmlFor="last-name">Email for sync</label>
                  <TextField name="Email for sync"

                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    size='small'
                    margin='normal'
                    fullWidth
                    placeholder="Email for sync"
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleEmailIdSubmit}
                  sx={{
                    mt: 2,
                    width: isSmallScreen ? '100%' : 'auto',
                    borderRadius: '10px',
                  }}
                >
                  Sync your email
                </Button>
              </Box>
            </Box>
          </Box>
          <Box className="emailsyns" style={{ marginTop: "20px" }}>
            <Box>
              <Typography variant="h6">Download Windows app</Typography>
            </Box>
            <Box className="hr" style={{ marginTop: "10px" }}></Box>
            <Box style={{ marginTop: "20px" }}>
              <p>TaxDome Windows App help</p>
              <Link to="#">https://help.taxdome.com/article/164-taxdome-windows-application</Link>
            </Box>
          </Box>

          <Box className="emailsyns">
            <Box>
              <Typography variant="h6">International settings</Typography>
            </Box>
            <Box className="hr" style={{ marginTop: "10px" }}></Box>

            <Box>
              <Box className="base-TextField-root">
                <label htmlFor="subject">From</label>
                <Select value={SystemLang} onChange={(e) => setSystemLang(e.target.value)} sx={{ width: "100%", mt: 2, mb: 2 }} size="small">
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default MyAccount;
