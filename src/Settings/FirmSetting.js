import React, { useEffect, useState, useMemo, useContext } from "react";
import { LoginContext } from "../Sidebar/Context/Context";
import { styled } from "@mui/material/styles";
import { Box, Button, InputLabel, TextField, Divider, FormControlLabel, FormControl, Select, Chip, OutlinedInput, MenuItem, Container, Typography, Checkbox, InputAdornment, Autocomplete } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Unstable_Grid2";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import Texteditor from "../Templates/Texteditor/Editor";
import { useTheme, useMediaQuery } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import dayjs from "dayjs";
const FirmSetting = () => {
  // const {id} = useParams();
  // console.log(id)
  const theme = useTheme();
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    setSelectedFile(files[0]);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };
  const Item = styled("div")(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const handleSwitchChange = (event) => {
    setShowDatePicker(event.target.checked);
  };
  const [supportlogin, setSupportLogin] = useState(false);
  const [selectedLogInDate, setSelectedLogInDate] = useState(null);
  const handleSwitchLogInChange = (event) => {
    setSupportLogin(event.target.checked);
  };
  //right side form
  const [isNewChatOpen, setNewChat] = useState(false);
  const handleNewDrawerClose = () => {
    setNewChat(false);
  };
  const [content, setContent] = useState("");
  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  //integration
  const [defaultreplytoemails, setDefaultreplytoemails] = useState();
  const [firmName, setFirmName] = useState();
  const [state, setState] = useState();
  // const [firmURL, setFirmURL] = useState();
  const [firmwebsite, setFirmWebsite] = useState();
  const [firmPhoneNumber, setFirmPhoneNumber] = useState();
  const [defaultlanguage, setDefaultlanguage] = useState();

  const languages = [
    { value: "English(British)", label: "English(British)" },
    { value: "Deutsch", label: "Deutsch" },
    { value: "Ztaliano", label: "Ztaliano" },
    { value: "Nederlands", label: "Nederlands" },
    { value: "suomi", label: "suomi" },
    { value: "Dansk", label: "Dansk" },
  ];
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const language = selectedLanguage;
  console.log(language);
  const handleLanguageChange = (selectedLanguage) => {
    setSelectedLanguage(selectedLanguage);
  };

  const { logindata } = useContext(LoginContext);
  const [adminUserData, setAdminUserData] = useState();
  console.log(logindata);
  useEffect(() => {
    getFirmSettingsByAdminUserId();
    setAdminUserData(logindata.user.id);
  }, []);
  console.log(adminUserData);
  const [firmSettingId, setFirmSettingsId] = useState();
  console.log(firmSettingId);
  const [AssigneesNew, setAssigneesNew] = useState([]);
  const getFirmSettingsByAdminUserId = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/firmsetting/Firmsettingbyuserid/${logindata.user.id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.length > 0) {
          setFirmSettingsId(result[0]._id);
          setDefaultreplytoemails(result[0].defaultreplytoemails);
          setFirmName(result[0].firmName);
          setFirmEmail(result[0].firmEmail);
          setAddress(result[0].streetAddress);
          setFirmWebsite(result[0].firmwebsite);
          setFirmPhoneNumber(result[0].firmPhoneNumber);
          setDefaultlanguage(result[0].defaultlanguage);
          setCity(result[0].city);
          setZipCode(result[0].postalCode);
          const stateMatch = states.find((state) => state.name === result[0].state);
          setSelectedState(stateMatch ? { label: stateMatch.name } : null);
          setDescription(result[0].aboutusDescription);
          setShowfirmownerphototologin(result[0].showfirmownerphototologin);
          setDomainName(result[0].domainname);
          setRequire2FAforallteam(result[0].require2FAforallteam);
          setAllowclienttocreatenewchat(result[0].allowclienttocreatenewchat);
          setFacebooklink(result[0].facebooklink);
          setLinkedinlink(result[0].linkedinlink);
          setXlink(result[0].xlink);
          setInstagramlink(result[0].instagramlink);
          setSelectedFormat(result[0].contactnameformat);
          setApplytoallcontacts(result[0].applytoallcontacts);
          setSelectedSignatures(result[0].defaultdateformatforesign);
          setShowKBAverification(result[0].showKBAverification);
          setShowQESAdESverification(result[0].showQESAdESverification);
          setAllowsupportteamsetuplanding(result[0].allowsupportteamsetuplanding);
          setAllowsupportteamsetuplandingdate(result[0].allowsupportteamsetuplandingdate ? dayjs(result[0].allowsupportteamsetuplandingdate) : null);
          setAllowsupportteamownerlikepermission(result[0].allowsupportteamownerlikepermission);
          setAllowsupportteamownerlikepermissiondate(result[0].allowsupportteamownerlikepermissiondate ? dayjs(result[0].allowsupportteamownerlikepermissiondate) : null);
          setShowfirmcontactdetails(result[0].showfirmcontactdetails);
          setShowsocialnetworklinks(result[0].showsocialnetworklinks);
          setshowfirmlogo(result[0].showfirmlogo);
          setshowmesscontextinternalnotification(result[0].showmesscontextinternalnotification);
          setshowmesscontextclientfacingnotification(result[0].showmesscontextclientfacingnotification);
          setEmailfirmmembercansend(result[0].emailfirmmembercansend);

          setshowdoneuploadingbutton(result[0].showdoneuploadingbutton);
          setshowdoneuploadingcheckbox(result[0].showdoneuploadingcheckbox);

          // Format and set giveaccountaccessteammembers
          const accountAccessMembers = result[0].giveaccountaccessteammembers.map((user) => ({
            value: user.id,
            label: `${user.username}`,
          }));
          setSelectedUser(accountAccessMembers);

          const selectedValues = accountAccessMembers.map((option) => option.value);
          setCombinedValues(selectedValues);
          console.log(selectedValues);
        }
      })
      .catch((error) => console.error("Error fetching firm settings:", error));
  };
  // const [firmemail, setFirmemail] = useState()
  const [firmEmail, setFirmEmail] = useState();
  const [address, setAddress] = useState();
  const [City, setCity] = useState();
  const [zipCode, setZipCode] = useState();

  //patch for  contact details
  const Contactdetails = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      firmName: firmName,
      state: selectedState.label,
      firmPhoneNumber: firmPhoneNumber,
      defaultreplytoemails: defaultreplytoemails,
      // firmURL: firmURL,
      firmwebsite: firmwebsite,
      firmEmail: firmEmail,
      streetAddress: address,
      city: City,
      postalCode: zipCode,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);

        // Show success toast
        toast.success("Firm settings updated successfully!");
        getFirmSettingsByAdminUserId();
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  //PATCH for About Us
  const [discription, setDescription] = useState();
  const [showfirmownerphototologin, setShowfirmownerphototologin] = useState(false);
  const handleAboutusCheckbox = (checked) => {
    setShowfirmownerphototologin(checked);
  };
  const AboutUs = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      aboutusDescription: discription,
      showfirmownerphototologin: showfirmownerphototologin,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  //PATCH for Custom domain URL
  const [domainname, setDomainName] = useState();
  const CustomDomain = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      domainname: domainname,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  //PATCH for Two-factor authentication (2FA)
  const [require2FAforallteam, setRequire2FAforallteam] = useState(false);
  const handlefor2FA = (checked) => {
    setRequire2FAforallteam(checked);
  };

  const TwoFactorAuthentication = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      require2FAforallteam: require2FAforallteam,
      emailaddressfor2FA: defaultreplytoemails,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  //PATCH for Chats
  const [allowclienttocreatenewchat, setAllowclienttocreatenewchat] = useState(false);
  const handlechat = (checked) => {
    setAllowclienttocreatenewchat(checked);
  };

  const chat = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      allowclienttocreatenewchat: allowclienttocreatenewchat,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  ///PATCH for Social media links
  const [facebooklink, setFacebooklink] = useState();
  const [linkedinlink, setLinkedinlink] = useState();
  const [xlink, setXlink] = useState();
  const [instagramlink, setInstagramlink] = useState();

  const SocialMediaLinks = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      facebooklink: facebooklink,
      linkedinlink: linkedinlink,
      xlink: xlink,
      instagramlink: instagramlink,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  ///PATCH for International settings
  const InternationalSettings = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      defaultlanguage: defaultlanguage,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  ///PATCH for Contact name formatting
  const contactNameOptions = ["[Last name], [First name]", "[First name] [Last name]", "[Last name] [First name]", "[First name] [Middle name] [Last name]"];

  const [selectedFormat, setSelectedFormat] = useState("[First name] [Middle name] [Last name]");
  const [applytoallcontacts, setApplytoallcontacts] = useState(false);

  const handleapplytoallcontacts = (checked) => {
    setApplytoallcontacts(checked);
  };

  const ContactNameFormatting = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      contactnameformat: selectedFormat,
      applytoallcontacts: applytoallcontacts,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  ///PATCH for Signatures

  const SignaturesOptions = ["MM.DD.YYYY", "DD-MM-YYYY", "DD/MM/YYYY", "DD.MM.YYYY", "YYYY/MM/DD", "YYYY/DD/MM"];

  const [selectedSignatures, setSelectedSignatures] = useState("MM.DD.YYYY");
  const [showKBAverification, setShowKBAverification] = useState(false);
  const [showQESAdESverification, setShowQESAdESverification] = useState(false);

  const handleshowQESAdESverification = (checked) => {
    setShowQESAdESverification(checked);
  };

  const handleshowKBAverification = (checked) => {
    setShowKBAverification(checked);
  };

  const Signatures = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      defaultdateformatforesign: selectedSignatures,
      showKBAverification: showKBAverification,
      showQESAdESverification: showQESAdESverification,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  ///PATCH for Editor access
  const [allowsupportteamsetuplanding, setAllowsupportteamsetuplanding] = useState(false);
  const [allowsupportteamsetuplandingdate, setAllowsupportteamsetuplandingdate] = useState(null);
  const [allowsupportteamownerlikepermission, setAllowsupportteamownerlikepermission] = useState(false);
  const [allowsupportteamownerlikepermissiondate, setAllowsupportteamownerlikepermissiondate] = useState(null);

  const handleallowsupportteamsetuplanding = (checked) => {
    setAllowsupportteamsetuplanding(checked);
  };

  const handleallowsupportteamownerlikepermission = (checked) => {
    setAllowsupportteamownerlikepermission(checked);
  };

  const EditorAccess = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      allowsupportteamsetuplanding: allowsupportteamsetuplanding,
      allowsupportteamsetuplandingdate: allowsupportteamsetuplandingdate,
      allowsupportteamownerlikepermission: allowsupportteamownerlikepermission,
      allowsupportteamownerlikepermissiondate: allowsupportteamownerlikepermissiondate,
    });

    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  ///PATCH for System-generated emails
  const [showfirmcontactdetails, setShowfirmcontactdetails] = useState(false);

  const [showsocialnetworklinks, setShowsocialnetworklinks] = useState(false);

  const [showfirmlogo, setshowfirmlogo] = useState(false);

  const [showmesscontextinternalnotification, setshowmesscontextinternalnotification] = useState(false);

  const [showmesscontextclientfacingnotification, setshowmesscontextclientfacingnotification] = useState(false);

  const handleshowfirmcontactdetails = (checked) => {
    setShowfirmcontactdetails(checked);
  };

  const handleshowsocialnetworklinks = (checked) => {
    setShowsocialnetworklinks(checked);
  };

  const handleshowfirmlogo = (checked) => {
    setshowfirmlogo(checked);
  };

  const handleshowmesscontextclientfacingnotification = (checked) => {
    setshowmesscontextclientfacingnotification(checked);
  };

  const handleshowmesscontextinternalnotification = (checked) => {
    setshowmesscontextinternalnotification(checked);
  };

  const SystemGeneratedEmails = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      showfirmcontactdetails: showfirmcontactdetails,
      showsocialnetworklinks: showsocialnetworklinks,
      showfirmlogo: showfirmlogo,
      showmesscontextinternalnotification: showmesscontextinternalnotification,
      showmesscontextclientfacingnotification: showmesscontextclientfacingnotification,
    });

    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  ///PATCH for Sending limit

  const [emailfirmmembercansend, setEmailfirmmembercansend] = useState(400);

  const SendingLimit = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      emailfirmmembercansend: emailfirmmembercansend,
    });

    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  ///PATCH for Client portal settings
  const [showdoneuploadingbutton, setshowdoneuploadingbutton] = useState(false);

  const [showdoneuploadingcheckbox, setshowdoneuploadingcheckbox] = useState(false);

  const handleshowdoneuploadingbutton = (checked) => {
    setshowdoneuploadingbutton(checked);
  };

  const handleshowdoneuploadingcheckbox = (checked) => {
    setshowdoneuploadingcheckbox(checked);
  };

  const ClientPortalSettingst = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      showdoneuploadingbutton: showdoneuploadingbutton,
      showdoneuploadingcheckbox: showdoneuploadingcheckbox,
    });

    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  ///for team member
  const Fetchteammember = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/common/users/roles?roles=TeamMember`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setUserData(result);
        console.log("Fetched Team Member Data:", result);
      })
      .catch((error) => {
        console.error("Error fetching team member data:", error);
      });
  };

  // console.log(combinedValues)
  useEffect(() => {
    Fetchteammember();
  }, []);
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);

  const options = userData.map((user) => ({
    value: user._id,
    label: `${user.username} `,
    // label:user.FirstName
  }));

  const handleUserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setCombinedValues(selectedValues);
    console.log(selectedValues);
  };
  console.log(combinedValues);

  //PATCH for teammember
  const teammember = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      giveaccountaccessteammembers: combinedValues,
    });

    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  //states
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);

  // useEffect(() => {
  //     const fetchAllStates = async () => {
  //         try {
  //             const response = await axios.get("https://countriesnow.space/api/v0.1/countries/states");
  //             console.log(response.data);  // Log the response to see its structure
  //             const allStates = response.data.data.flatMap(country => country.states);
  //             setStates(allStates);
  //         } catch (error) {
  //             console.error("Error fetching state data:", error);
  //         }
  //     };

  //     fetchAllStates();
  // }, []);

  useEffect(() => {
    const fetchAllStates = async () => {
      try {
        const response = await axios.get("https://countriesnow.space/api/v0.1/countries/states");
        console.log(response.data); // Log the response to see its structure
        const allStates = response.data.data.flatMap((country) => country.states);
        setStates(allStates);

        // if (state) { // Make sure the firm state is available
        //     const matchingState = allStates.find((s) => s.name === state); // match with firm state
        //     if (matchingState) {
        //         setSelectedState({ label: matchingState.name }); // set default state
        //     }
        // }
      } catch (error) {
        console.error("Error fetching state data:", error);
      }
    };

    fetchAllStates();
  }, [state]);

  return (
    <Container>
      <Box>
        <Typography variant="h3">Firm settings</Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2} columns={16}>
            <Grid item xs={8}>
              <Box border={"1px solid #c7c7c7"} borderRadius={"10px"}>
                <Box borderBottom={"1px solid #c7c7c7"}>
                  <Typography p={2} textAlign={"left"}>
                    {" "}
                    <b>Contact details </b>{" "}
                  </Typography>
                </Box>

                <Box display={"flex"} alignItems={"center"} m={2} gap={2}>
                  <Box flex={1}>
                    <InputLabel sx={{ color: "black", textAlign: "left", mb: 1, width: "100%" }}>Firm Name</InputLabel>
                    <TextField fullWidth value={firmName} onChange={(e) => setFirmName(e.target.value)} name="Firm Name" placeholder="Enter Your Firm Name" size="small" id="Firm Name" />
                  </Box>

                  <Box flex={1}>
                    <InputLabel sx={{ color: "black", textAlign: "left", mb: 1, width: "100%" }}>Firm Email</InputLabel>
                    <TextField fullWidth value={firmEmail} onChange={(e) => setFirmEmail(e.target.value)} placeholder="Enter Your Firm Email" size="small" />
                  </Box>
                </Box>

                <Box m={2}>
                  <InputLabel sx={{ color: "black", textAlign: "left", mb: 1 }}>Street address</InputLabel>
                  <TextField fullWidth value={address} onChange={(e) => setAddress(e.target.value)} name="Firm Name" placeholder="Street address" size="small" id="Firm Name" />
                </Box>

                <Box display={"flex"} alignItems={"center"} m={2} gap={1} sx={{ flexWrap: "wrap" }}>
                  <Box flex={1} m={1}>
                    <InputLabel sx={{ color: "black", textAlign: "left", mb: 1 }}>City</InputLabel>
                    <TextField fullWidth value={City} onChange={(e) => setCity(e.target.value)} name="City" placeholder="City" size="small" id="City" />
                  </Box>

                  <Box flex={1} m={1}>
                    {/* State Autocomplete */}
                    <InputLabel sx={{ color: "black", textAlign: "left", mb: 1 }}>State</InputLabel>
                    <Autocomplete
                      size="small"
                      value={selectedState}
                      onChange={(event, newValue) => {
                        setSelectedState(newValue);
                      }}
                      options={states.map((state) => ({ label: state.name }))}
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => <TextField {...params} placeholder="State" variant="outlined" fullWidth />}
                    />
                  </Box>

                  <Box flex={1} m={1}>
                    <InputLabel sx={{ color: "black", textAlign: "left", mb: 1 }}>Zip/Postal code</InputLabel>
                    <TextField fullWidth name="Zip/Postal code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="Zip/Postal code" size="small" id="ZipPostalCode" />
                  </Box>
                </Box>

                <Box display={"flex"} alignItems={"center"} m={2} gap={2}>
                  <Box flex={1}>
                    <InputLabel sx={{ color: "black", textAlign: "left", mb: 1, width: "100%" }}>Firm phone number</InputLabel>
                    <TextField fullWidth value={firmPhoneNumber} onChange={(e) => setFirmPhoneNumber(e.target.value)} name="Firm phone number" placeholder="Enter Your Firm phone number" size="small" id="Firm phone number" />
                  </Box>

                  <Box flex={1}>
                    <InputLabel sx={{ color: "black", textAlign: "left", mb: 1, width: "100%" }}>Firm Website</InputLabel>
                    <TextField
                      fullWidth
                      name="Firm Website"
                      // value={firmURL}
                      // onChange={(e) => setFirmURL(e.target.value)}
                      value={firmwebsite}
                      onChange={(e) => setFirmWebsite(e.target.value)}
                      placeholder="Firm Website"
                      size="small"
                      id="Firm Website"
                    />
                  </Box>
                </Box>

                <Box m={2}>
                  <InputLabel sx={{ color: "black", textAlign: "left", mb: 1 }}>Default reply-to address for system emails</InputLabel>
                  <TextField fullWidth value={defaultreplytoemails} onChange={(e) => setDefaultreplytoemails(e.target.value)} name="Default reply-to address for system emails" placeholder="Default reply-to address for system emails" size="small" id="Default reply-to address for system emails" />
                </Box>

                <Box display={"flex"} alignItems={"center"} textAlign={"left"} m={2}>
                  <Box varient="body">Receive copies (BCC) of system emails sent to clients These emails include requests and reminders to fill out forms, upload documents, and complete other pending actions.</Box>
                  {<Switch />}
                </Box>

                <Box display="flex" justifyContent="flex-start" padding={2}>
                  <Button onClick={Contactdetails} variant="contained">
                    Save
                  </Button>
                </Box>

                <ToastContainer />
              </Box>

              <Box border={"1px solid #c7c7c7"} borderRadius={"10px"} mt={2}>
                <Box borderBottom={"1px solid #c7c7c7"}>
                  <Typography p={2} textAlign={"left"}>
                    <b>About us</b>
                  </Typography>
                </Box>

                <Box m={2}>
                  <InputLabel sx={{ color: "black", textAlign: "left", mb: 1 }}>Description</InputLabel>
                  <Box component="form" sx={{ "& .MuiTextField-root": { width: "25ch" } }} noValidate autoComplete="off">
                    <TextField fullWidth id="outlined-multiline-static" multiline value={discription} onChange={(e) => setDescription(e.target.value)} rows={2} borderRadius={5} />
                  </Box>
                </Box>

                <Box textAlign={"left"}>
                  <Checkbox
                    checked={showfirmownerphototologin} // `checked` prop controls the checkbox state
                    onChange={(e) => handleAboutusCheckbox(e.target.checked)} // `e.target.checked` gives true/false
                  />
                  Show firm owner photo on the login page
                </Box>

                <Box display="flex" justifyContent="flex-start" padding={2}>
                  <Button onClick={AboutUs} variant="contained">
                    Save
                  </Button>
                </Box>
              </Box>

              <Box border={"1px solid #c7c7c7"} borderRadius={"10px"} mt={2}>
                <Box borderBottom={"1px solid #c7c7c7"}>
                  <Typography p={2} textAlign={"left"}>
                    <b>Firm portal URL</b>
                  </Typography>
                </Box>

                <Box p={3}>
                  <Typography textAlign={"left"} fontSize={15} mb={2}>
                    Your firm's TaxDome portal URL:
                  </Typography>
                  <Box textAlign={"left"} color={"#1976d3"}>
                    {" "}
                    https://anuja.taxdome.com/
                  </Box>
                  <Box textAlign={"left"}>To modify this address, please contact support.</Box>
                </Box>
              </Box>

              <Box border={"1px solid #c7c7c7"} borderRadius={"10px"} mt={2}>
                <Box borderBottom={"1px solid #c7c7c7"}>
                  <Typography p={2} textAlign={"left"}>
                    <b>Custom domain</b>
                  </Typography>
                </Box>
                <Box p={3}>
                  <Box textAlign={"left"}>
                    You can white-label your TaxDome portal with your own domain name (for example, anuja.com instead of anuja.taxdome.com). Before adding your domain name, please see <span style={{ color: "#1976d3" }}>how to configure DNS</span>.
                  </Box>
                  <Box mt={2}>
                    <Box>
                      <InputLabel sx={{ color: "black", textAlign: "left" }}>Domain name</InputLabel>
                      <TextField fullWidth name="Domain name" value={domainname} onChange={(e) => setDomainName(e.target.value)} placeholder="Domain name" size="small" sx={{ mt: 1 }} id="Domain name" />
                    </Box>

                    <Box mt={2}>
                      <Button onClick={CustomDomain} variant="outlined" size="small">
                        Link Custom Domain
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box border={"1px solid #c7c7c7"} borderRadius={"10px"} mt={2}>
                <Box borderBottom={"1px solid #c7c7c7"}>
                  <Typography p={2} textAlign={"left"}>
                    <b>Two-factor authentication (2FA)</b>
                  </Typography>
                </Box>

                <Box>
                  <Box m={3}>
                    <InputLabel sx={{ color: "black", textAlign: "left" }}>Email address to receive manual 2FA disable requests</InputLabel>
                    <TextField fullWidth name="Email address to receive manual 2FA disable requests" placeholder="Email address to receive manual 2FA disable requests" size="small" sx={{ mt: 1 }} id="Domain name" value={defaultreplytoemails} onChange={(e) => setDefaultreplytoemails(e.target.value)} />
                  </Box>

                  <Box textAlign={"left"} ml={2} alignItems={"center"}>
                    <Checkbox checked={require2FAforallteam} onChange={(e) => handlefor2FA(e.target.checked)} />
                    Require 2FA for all team members
                  </Box>
                  <Box textAlign={"left"} ml={3}>
                    2FA will be turned on for team members at next login.
                  </Box>

                  <Box display="flex" justifyContent="flex-start" padding={2}>
                    <Button onClick={TwoFactorAuthentication} variant="contained">
                      Save
                    </Button>
                  </Box>
                </Box>
              </Box>
              <Box border={"1px solid #c7c7c7"} borderRadius={"10px"} mt={2}>
                <Box borderBottom={"1px solid #c7c7c7"}>
                  <Typography p={2} textAlign={"left"}>
                    <b>Chats</b>
                  </Typography>
                </Box>

                <Box>
                  <Box m={2} textAlign={"left"}>
                    Chats are a secure way to communicate and exchange documents with your clients. You can allow clients to start new chats, or have them only respond to messages sent by your firm.
                  </Box>

                  <Box textAlign={"left"}>
                    <Switch checked={allowclienttocreatenewchat} onChange={(e) => handlechat(e.target.checked)} />
                    Allow clients to create new chat threads
                  </Box>

                  <Box display="flex" justifyContent="flex-start" padding={2}>
                    <Button onClick={chat} variant="contained">
                      Save
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid xs={8}>
              <Box border={"1px solid #c7c7c7"} borderRadius={"10px"}>
                <Box borderBottom={"1px solid #c7c7c7"}>
                  <Typography p={2} textAlign={"left"}>
                    <b>Social media links</b>
                  </Typography>
                </Box>

                <Box m={2}>
                  <Box flex={1}>
                    <InputLabel sx={{ color: "black", textAlign: "left", mb: 1, width: "100%" }}>Facebook</InputLabel>
                    <TextField
                      fullWidth
                      name="Facebook"
                      value={facebooklink}
                      onChange={(e) => setFacebooklink(e.target.value)}
                      placeholder="Facebook"
                      size="small"
                      id="Facebook"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FacebookIcon sx={{ color: "blue" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box flex={1}>
                    <InputLabel sx={{ color: "black", textAlign: "left", mb: 1, mt: 1, width: "100%" }}>LinkedIn</InputLabel>
                    <TextField
                      fullWidth
                      name="LinkedIn"
                      placeholder="LinkedIn"
                      value={linkedinlink}
                      onChange={(e) => setLinkedinlink(e.target.value)}
                      size="small"
                      id="LinkedIn"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkedInIcon sx={{ color: "#0077b5" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box flex={1}>
                    <InputLabel sx={{ color: "black", textAlign: "left", mb: 1, mt: 1, width: "100%" }}>X</InputLabel>
                    <TextField
                      fullWidth
                      name="X"
                      value={xlink}
                      onChange={(e) => setXlink(e.target.value)}
                      placeholder="X"
                      size="small"
                      id="X"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <XIcon sx={{ color: "black" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box flex={1}>
                    <InputLabel sx={{ color: "black", textAlign: "left", mb: 1, mt: 1, width: "100%" }}>Instagram</InputLabel>
                    <TextField
                      fullWidth
                      name="Instagram"
                      placeholder="Instagram"
                      value={instagramlink}
                      onChange={(e) => setInstagramlink(e.target.value)}
                      size="small"
                      id="Instagram"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <InstagramIcon sx={{ color: "#da2b79" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Box display="flex" justifyContent="flex-start" padding={2}>
                    <Button onClick={SocialMediaLinks} variant="contained">
                      Save
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Box border={"1px solid #c7c7c7"} borderRadius={"10px"} mt={2}>
                <Box borderBottom={"1px solid #c7c7c7"}>
                  <Typography p={2} textAlign={"left"}>
                    <b>Logo upload</b>
                  </Typography>
                </Box>

                <Box sx={{ m: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dotted black", p: 3, gap: 2 }} onDrop={handleDrop} onDragOver={handleDragOver}>
                  <Typography>Drag & Drop file here</Typography>

                  <Button variant="contained" onClick={handleButtonClick}>
                    Browse Files
                  </Button>

                  {/* Hidden input for file selection */}
                  <input id="fileInput" type="file" style={{ display: "none" }} onChange={handleFileChange} />

                  {/* Display the selected file name */}
                  {selectedFile && <Typography sx={{ mt: 2, wordBreak: "break-all" }}>Selected file: {selectedFile.name}</Typography>}
                </Box>
                <Box></Box>
              </Box>
              <Box border={"1px solid #c7c7c7"} borderRadius={"10px"} mt={2}>
                <Box borderBottom={"1px solid #c7c7c7"}>
                  <Typography p={2} textAlign={"left"}>
                    <b>International settings</b>
                  </Typography>
                </Box>

                <Box>
                  <Box m={2}>
                    <InputLabel sx={{ color: "black", textAlign: "left", mb: 1 }}>Default language</InputLabel>
                    {/* <Autocomplete
                                                fullWidth
                                                value={defaultlanguage}
                                                onChange={(e) => setDefaultlanguage(e.target.value)}
                                                options={languages}
                                                getOptionLabel={(option) => option.label}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder="Default language"
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                )}
                                                id="default-language"
                                            /> */}
                    <Autocomplete size="small" margin="normal" value={selectedLanguage} onChange={(event, newValue) => handleLanguageChange(newValue)} options={languages} getOptionLabel={(option) => option.label || ""} renderInput={(params) => <TextField {...params} placeholder="Select a language" />} />
                  </Box>

                  <Box m={2}>
                    <InputLabel sx={{ color: "black", textAlign: "left", mb: 1 }}>Time Zone </InputLabel>
                    <TextField fullWidth name="Time Zone" placeholder="Time Zone" size="small" id="Time Zone" />
                  </Box>
                  <Box display="flex" justifyContent="flex-start" padding={2}>
                    <Button onClick={InternationalSettings} variant="contained">
                      Save
                    </Button>
                  </Box>
                </Box>
              </Box>
              <Box border={"1px solid #c7c7c7"} borderRadius={"10px"} mt={2}>
                <Box borderBottom={"1px solid #c7c7c7"}>
                  <Typography p={2} textAlign={"left"}>
                    <b>Contact name formatting</b>
                  </Typography>
                </Box>

                <Box>
                  <Box m={2}>
                    <InputLabel sx={{ color: "black", textAlign: "left", mb: 1 }}>The next generated contact name will have the following format </InputLabel>
                    <Autocomplete
                      fullWidth
                      options={contactNameOptions}
                      value={selectedFormat} // Set the default selected value
                      onChange={(event, newValue) => {
                        setSelectedFormat(newValue); // Update the selected value when user selects an option
                      }}
                      renderInput={(params) => <TextField {...params} placeholder="Select format" size="small" />}
                    />
                  </Box>
                  <Box textAlign={"left"} ml={3}>
                    <FormControlLabel control={<Checkbox checked={applytoallcontacts} onChange={(e) => handleapplytoallcontacts(e.target.checked)} />} label="Apply to all Contacts" />
                  </Box>
                </Box>

                <Box>
                  <Box display="flex" justifyContent="flex-start" padding={2}>
                    <Button onClick={ContactNameFormatting} variant="contained">
                      Save
                    </Button>
                  </Box>
                </Box>
              </Box>
              <Box border={"1px solid #c7c7c7"} borderRadius={"10px"} mt={2}>
                <Box borderBottom={"1px solid #c7c7c7"}>
                  <Typography p={2} textAlign={"left"}>
                    <b>Signatures</b>
                  </Typography>
                </Box>

                <Box>
                  <Box m={2}>
                    <InputLabel sx={{ color: "black", textAlign: "left", mb: 1 }}>Default date format for e-signature </InputLabel>
                    <Autocomplete
                      fullWidth
                      options={SignaturesOptions}
                      value={selectedSignatures}
                      onChange={(event, newValue) => {
                        setSelectedSignatures(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} placeholder="Select Signature" size="small" />}
                    />
                  </Box>

                  <Box textAlign={"left"} ml={2}>
                    <FormControlLabel control={<Switch checked={showKBAverification} onChange={(event) => handleshowKBAverification(event.target.checked)} />} label="Show KBA verification as option" />
                  </Box>

                  <Box textAlign={"left"} ml={2}>
                    <FormControlLabel control={<Switch checked={showQESAdESverification} onChange={(event) => handleshowQESAdESverification(event.target.checked)} />} label="Show QES/AdES verification as option" />
                  </Box>
                </Box>

                <Box>
                  <Box display="flex" justifyContent="flex-start" padding={2}>
                    <Button onClick={Signatures} variant="contained">
                      Save
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Box border={"1px solid #c7c7c7"} borderRadius={"10px"} mt={2}>
                <Box borderBottom={"1px solid #c7c7c7"}>
                  <Typography p={2} textAlign={"left"}>
                    <b>Default account access</b>
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ m: 2 }}>
                    <label className="task-input-label">Team Members</label>
                    <Autocomplete
                      multiple
                      sx={{ background: "#fff", mt: 1 }}
                      options={options}
                      size="small"
                      getOptionLabel={(option) => option.label}
                      value={selectedUser}
                      onChange={handleUserChange}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          {...props}
                          sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                        >
                          {option.label}
                        </Box>
                      )}
                      renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Assignees" />}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                    />
                  </Box>
                </Box>
                <Box>
                  <Box display="flex" justifyContent="flex-start" padding={2}>
                    <Button onClick={teammember} variant="contained">
                      Save
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Box border={"1px solid #c7c7c7"} borderRadius={"10px"} mt={2}>
                <Box borderBottom={"1px solid #c7c7c7"}>
                  <Typography p={2} textAlign={"left"}>
                    <b>Editor access</b>
                  </Typography>
                </Box>

                <Box>
                  <Box textAlign="left" ml={2}>
                    <FormControlLabel control={<Switch checked={allowsupportteamsetuplanding} onChange={(e) => handleallowsupportteamsetuplanding(e.target.checked)} />} label="Allow the support team to set up landing" />

                    {/* Conditionally render DatePicker when switch is toggled */}
                    {allowsupportteamsetuplanding && (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box display={"flex"} flexDirection={"column"}>
                          <label>Until</label>
                          <DatePicker
                            // label="Select Date"
                            value={allowsupportteamsetuplandingdate}
                            onChange={(newValue) => setAllowsupportteamsetuplandingdate(newValue)}
                            renderInput={(params) => <TextField {...params} size="small" margin="normal" />}
                          />
                        </Box>
                      </LocalizationProvider>
                    )}
                  </Box>

                  <Box textAlign="left" ml={2}>
                    <FormControlLabel control={<Switch checked={allowsupportteamownerlikepermission} onChange={(e) => handleallowsupportteamownerlikepermission(e.target.checked)} />} label="Allow the support team to log in with owner-like permissions" />

                    {/* Conditionally render DatePicker when switch is toggled */}
                    {allowsupportteamownerlikepermission && (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box display="flex" flexDirection="column">
                          <Typography variant="body1" gutterBottom>
                            Until
                          </Typography>
                          <DatePicker value={allowsupportteamownerlikepermissiondate} onChange={(newValue) => setAllowsupportteamownerlikepermissiondate(newValue)} renderInput={(params) => <TextField {...params} margin="normal" />} />
                        </Box>
                      </LocalizationProvider>
                    )}
                  </Box>
                </Box>

                <Box>
                  <Box display="flex" justifyContent="flex-start" padding={2}>
                    <Button onClick={EditorAccess} variant="contained">
                      Save
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Box border={"1px solid #c7c7c7"} borderRadius={"10px"} mt={2}>
                <Box borderBottom={"1px solid #c7c7c7"}>
                  <Typography p={2} textAlign={"left"}>
                    <b>Default folder template</b>
                  </Typography>
                </Box>

                <Box>
                  <Box m={2}>
                    <InputLabel sx={{ color: "black", textAlign: "left", mb: 1 }}>Folder Templates </InputLabel>
                    <FormControl fullWidth>
                      <Select
                        size="small"
                        multiple
                        input={<OutlinedInput id="select-multiple" />}
                        renderValue={(selected) => selected.join(", ")} // Display as a comma-separated string
                      >
                        {/* Uncomment and use your team members here */}
                        {/* {teamMembers.map((member) => (
      <MenuItem key={member} value={member}>
        {member}
      </MenuItem>
    ))} */}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                <Box>
                  <Box display="flex" justifyContent="flex-start" padding={2}>
                    <Button variant="contained">Save</Button>
                  </Box>
                </Box>
              </Box>

              <Box border={"1px solid #c7c7c7"} borderRadius={"10px"} mt={2}>
                <Box borderBottom={"1px solid #c7c7c7"}>
                  <Typography p={2} textAlign={"left"}>
                    <b>System-generated emails</b>
                  </Typography>
                </Box>

                <Box>
                  <Box textAlign={"left"} ml={2}>
                    <FormControlLabel control={<Switch checked={showfirmcontactdetails} onChange={(event) => handleshowfirmcontactdetails(event.target.checked)} />} label="Show firm contact details" />
                  </Box>

                  <Box textAlign={"left"} ml={2}>
                    <FormControlLabel control={<Switch checked={showsocialnetworklinks} onChange={(event) => handleshowsocialnetworklinks(event.target.checked)} />} label="Show social network links" />
                  </Box>

                  <Box textAlign={"left"} ml={2}>
                    <FormControlLabel control={<Switch checked={showfirmlogo} onChange={(event) => handleshowfirmlogo(event.target.checked)} />} label="Show firm logo" />
                  </Box>

                  <Box textAlign={"left"} ml={2}>
                    <FormControlLabel control={<Switch checked={showmesscontextinternalnotification} onChange={(event) => handleshowmesscontextinternalnotification(event.target.checked)} />} label="Show firm message context in internal notifications" />
                  </Box>

                  <Box textAlign={"left"} ml={2}>
                    <FormControlLabel control={<Switch checked={showmesscontextclientfacingnotification} onChange={(event) => handleshowmesscontextclientfacingnotification(event.target.checked)} />} label="Show firm message context in client facing notifications" />
                  </Box>
                </Box>

                <Box>
                  <Box display="flex" justifyContent="flex-start" padding={2}>
                    <Button onClick={SystemGeneratedEmails} variant="contained">
                      Save
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Box border={"1px solid #c7c7c7"} borderRadius={"10px"} mt={2}>
                <Box borderBottom={"1px solid #c7c7c7"}>
                  <Typography p={2} textAlign={"left"}>
                    <b>Sending limit</b>
                  </Typography>
                </Box>

                <Box>
                  <Box m={2}>
                    <InputLabel sx={{ color: "black", textAlign: "left", mb: 1, width: "100%" }}>Emails each firm member can send (max 10,000)</InputLabel>
                    <TextField
                      fullWidth
                      name="Emails each firm member can send (max 10,000)"
                      value={emailfirmmembercansend}
                      onChange={(e) => setEmailfirmmembercansend(e.target.value)}
                      size="small"
                      id="Emails each firm member can send (max 10,000)"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography>per</Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Box display="flex" justifyContent="flex-start" padding={2}>
                    <Button onClick={SendingLimit} variant="contained">
                      Save
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Box border={"1px solid #c7c7c7"} borderRadius={"10px"} mt={2}>
                <Box borderBottom={"1px solid #c7c7c7"}>
                  <Typography p={2} textAlign={"left"}>
                    <b>Client portal settings</b>
                  </Typography>
                </Box>

                <Box>
                  <Box textAlign={"left"} ml={2}>
                    <FormControlLabel control={<Switch checked={showdoneuploadingbutton} onChange={(event) => handleshowdoneuploadingbutton(event.target.checked)} />} label="Show 'Done uploading' button in interface" />
                  </Box>

                  <Box textAlign={"left"} ml={2}>
                    <FormControlLabel control={<Switch checked={showdoneuploadingcheckbox} onChange={(event) => handleshowdoneuploadingcheckbox(event.target.checked)} />} label="Show 'Done uploading' checkbox in document upload menu " />
                  </Box>
                </Box>

                <Box>
                  <Box display="flex" justifyContent="flex-start" padding={2}>
                    <Button onClick={ClientPortalSettingst} variant="contained">
                      Save
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Box border={"1px solid #c7c7c7"} borderRadius={"10px"} mt={2}>
                <Box borderBottom={"1px solid #c7c7c7"}>
                  <Typography p={2} textAlign={"left"}>
                    <b>Client portal announcement</b>
                  </Typography>
                </Box>
                <Box mt={2} mr={8}>
                  Announcement is visible in the client portal and mobile app upon login.
                </Box>

                {/* right form */}
                {/* <Drawer
                                    anchor="right"
                                    open={isNewChatOpen}
                                    onClose={handleNewDrawerClose}
                                    PaperProps={{
                                        sx: {
                                            borderRadius: isSmallScreen ? '0' : '10px 0 0 10px',
                                            width: isSmallScreen ? '100%' : '600px',
                                            maxWidth: '95%',
                                        },
                                    }}
                                >
                                    <Box m={2}>
                                        <Box>
                                            <Box
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '20px',
                                                }}
                                            >
                                                <Typography><b>Create Announcement</b></Typography>
                                                <CloseIcon onClick={handleNewDrawerClose} style={{ cursor: 'pointer' }} />
                                            </Box>
                                            <Divider />
                                        </Box>

                                        <Box flex={1} m={2}>
                                            <InputLabel sx={{ color: 'black', textAlign: 'left', mb: 1, }}>
                                                Tittle
                                            </InputLabel>
                                            <TextField
                                                fullWidth
                                                name="Tittle"
                                                placeholder="Tittle"
                                                size="small"
                                                id="firmName"
                                            />
                                        </Box>

                                        <Box display="flex" alignItems="center" m={2} gap={2}>


                                            <Box sx={{ mt: 3, width: '100%' }}>
                                                <Texteditor initialContent={content} onChange={handleContentChange} />
                                            </Box>


                                        </Box>

                                        <Box sx={{ pt: 2, display: 'flex', alignItems: 'center', gap: 5, margin: "8px", ml: 3 }}>
                                            <Button variant="contained" color="primary">Create</Button>
                                            <Button variant="outlined" onClick={handleNewDrawerClose}>Cancel</Button>
                                        </Box>
                                    </Box>
                                </Drawer> */}

                <Box onClick={() => setNewChat(true)} mt={2} display="flex" alignItems="center" color="#135ea9" marginLeft={2}>
                  <AddCircleOutlineIcon />
                  <Typography sx={{ cursor: "pointer" }}>create announcement</Typography>
                </Box>

                <Box>
                  <Box display="flex" justifyContent="flex-start" padding={2}>
                    <Button variant="contained">Save</Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default FirmSetting;
