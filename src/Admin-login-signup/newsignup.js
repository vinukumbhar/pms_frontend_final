import React, { useState, useEffect } from "react";
import { Stepper, Step, StepLabel, Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Autocomplete } from "@mui/material";
import axios from "axios";
import OtpInput from "react-otp-input";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import startsWith from "lodash.startswith";
import firmsetting from "../Images/setting.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import logo from "../Images/logoAdmin.png";
import micropms from "../Images/micropms.png";
import { Link, Divider, IconButton, Typography, TextField, InputLabel, Checkbox, FormHelperText, Button, FormControlLabel, Paper, Grid, FormControl, Slider, Input } from "@mui/material";
const MyForm = () => {
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const navigate = useNavigate();
  const handleAdminLogin = () => {
    navigate("/login");
  };
  const [currentStep, setCurrentStep] = useState(0); // Tracks the main steps (Email, Information, Settings)
  const [subStep, setSubStep] = useState(3); // Tracks sub-steps within Information (Cases 3-7)
  const [settingsStep, setSettingsStep] = useState(8); // Tracks sub-steps within Settings (Cases 8-9)
  const [showEmailContent, setShowEmailContent] = useState(false); // Tracks whether to show Email step content
  const [phoneNumber, setPhoneNumber] = useState("");
  const [valid, setValid] = useState(true);
  const steps = ["Email", "Information", "Settings"];
  const [value, setValue] = useState();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const [firmName, setFirmName] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [error, setError] = useState(null);
  const [selectedCountryD, setSelectedCountryD] = useState("");
  const [sliderValue, setSliderValue] = useState(0);
  const fixedValues = [0, 5, 10, 15, 50, 100, 200];
  const colors = ["Google search", "Capterra/ Get app/ G2", "From a friend", "Offline event", "Social media", "Taxdome consultant/ Partner", "Other"];
  const [buttonStates, setButtonStates] = useState([false, false, false, false, false, false, false]);
  const [selectedButton, setSelectedButton] = useState(null);

  const handleInputChange = (event) => {
    const newValue = event.target.value === "" ? "" : Number(event.target.value);
    setInputValue(newValue); // Only update the input value, not the slider
  };

  const [inputValue, setInputValue] = useState(sliderValue);

  const handleBlur = () => {
    let valueToSet = inputValue;

    // Ensure the input value is within the valid range
    if (inputValue < 0) {
      valueToSet = 0;
    } else if (inputValue > 200) {
      valueToSet = 200;
    }

    setSliderValue(valueToSet); // Update slider value after blur
    setInputValue(valueToSet); // Sync input value with slider
  };
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    setInputValue(newValue); // Sync input with slider value while sliding
  };
  const handleToggle = (index) => {
    const updatedStates = buttonStates.map((state, i) => (i === index ? !state : false));
    setButtonStates(updatedStates);
    setSelectedButton(index);
  };

  const svalue = fixedValues[sliderValue];
  console.log(svalue);

  const selectedOption = colors[selectedButton];
  console.log(selectedOption);

  useEffect(() => {
    console.log(svalue);
  }, [svalue]);
  useEffect(() => {
    // console.log(selectedOption);
    // You can perform additional actions or API calls here based on the selected services
  }, [selectedOption]);

  const countryStates = states.find((country) => country.name === selectedCountry)?.states || [];

  // Transform the states data into options for React Select
  const stateOptions = countryStates.map((state, index) => ({
    value: state.name,
    label: state.name,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        const countryOptions = data.data.map((country) => ({
          //value: country.country,
          label: country.name,
        }));

        setCountries(countryOptions);
      } catch (error) {
        setError(error);
      } finally {
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getStatesData = async () => {
      try {
        const response = await axios.get("https://countriesnow.space/api/v0.1/countries/states");
        setStates(response.data.data);
      } catch (error) {
        console.error("Error fetching state data:", error);
      }
    };

    getStatesData();
  }, [countries]);

  // useEffect to do something when selectedCountry changes
  useEffect(() => {
    // console.log("Selected Country:", selectedCountry);
    // You can perform additional actions or API calls here based on the selected country
  }, [selectedCountry]);

  const [otp, setOtp] = useState("");
  const handleClearOtp = () => {
    console.log(otp);
    setOtp("");
  };
  const sendOtpVerify = async (e) => {
    e.preventDefault();

    //const { email } = inpval;

    if (otp === "") {
      toast.error(" OTP required! ", {
        position: "top-center",
      });
    } else {
      e.preventDefault();

      let data = JSON.stringify({
        email: inpval.email,
        otp: otp,
      });

      const Url = `${LOGIN_API}/verify-otp/`;
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: Url,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          // toast.success("Check your email ID for OTP", { position: "top-right" });

          alert("Email verified sucessfully");
          setOtp("");
          handleNext();
          // nextStep();
        })
        .catch((error) => {
          alert("please check your OTP");
          console.log(error);
        });
    }
  };

  const resensotp = async (e) => {
    e.preventDefault();

    //const { email } = inpval;

    e.preventDefault();

    let data = JSON.stringify({
      email: inpval.email,
    });
    const Url = `${LOGIN_API}/request-otp`;
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: Url,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        //toast.success("Check your email ID for OTP", { position: "top-right" });

        alert("Check your email ID for OTP");
      })
      .catch((error) => {
        alert("please check your OTP");
        // console.log(error);
      });
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // Move from Email to Information step
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Handle Information sub-steps (Cases 3-7)
      if (subStep < 7) {
        setSubStep((prevSubStep) => prevSubStep + 1);
      } else {
        // If all sub-steps are completed, move to Settings
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      // Handle Settings sub-steps (Cases 8-9)
      if (settingsStep < 9) {
        setSettingsStep((prevSettingsStep) => prevSettingsStep + 1);
      } else {
        // You can add finish behavior here
        // console.log('Form Completed!');
      }
    }
  };

  const [isChecked, setIsChecked] = useState(false);

  const setValbox = (event) => {
    setIsChecked(event.target.checked);
    console.log(event.target.checked);
  };
  const setVal = (e) => {
    // console.log(e.target.value);
    const { name, value } = e.target;

    setInpval(() => {
      return {
        ...inpval,
        [name]: value,
      };
    });
  };
  const [inpval, setInpval] = useState({
    email: "",
  });
  const createAccount = async () => {
    // e.preventDefault();
    setShowEmailContent(true);
    const { email } = inpval;

    if (email === "") {
      toast.error("email is required!", {
        position: "top-center",
      });
    } else if (!email.includes("@")) {
      toast.warning("includes @ in your email!", {
        position: "top-center",
      });
    } else if (isChecked === false) {
      toast.error("Accept terms and condtion ", {
        position: "top-center",
      });
    } else {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      console.log(inpval.email);

      const email = inpval.email;

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`${LOGIN_API}/common/user/email/getuserbyemail/` + email, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          console.log(inpval.email);
          // Assuming result is in JSON format and contains user data
          if (result.user.length > 0) {
            toast.error("User with this EMail already exists", { position: "top-right" });
            // You can also do further processing here if needed
          } else {
            // e.preventDefault();

            let data = JSON.stringify({
              email: inpval.email,
            });

            let config = {
              method: "post",
              maxBodyLength: Infinity,
              url: `${LOGIN_API}/request-otp`,
              headers: {
                "Content-Type": "application/json",
              },
              data: data,
            };
            axios
              .request(config)
              .then((response) => {
                console.log(JSON.stringify(response.data));
                //toast.success("Check your email ID for OTP", { position: "top-right" });
                alert("Check your email ID for OTP");
                //   setInpval({ ...inpval, email: "" });
                setIsChecked(false);
                // nextStep();
              })
              .catch((error) => {
                alert("please check your OTP");
                // console.log(error);
              });
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  const [firstname, setFirstname] = useState("");
  const [lastName, setLastName] = useState("");

  const submitUserinfo = async (e) => {
    e.preventDefault();

    if (firstname === "") {
      toast.error(" First Name Required ! ", {
        position: "top-center",
      });
    } else if (lastName === "") {
      toast.error(" Last Name Required ! ", {
        position: "top-center",
      });
    } else if (lastName === "") {
      toast.error(" Last Name Required ! ", {
        position: "top-center",
      });
    } else if (phoneNumber === "") {
      toast.error(" Phone number required ", {
        position: "top-center",
      });
    } else {
      handleNext();
    }
  };

  const submitFerminfo = async (e) => {
    e.preventDefault();

    if (firmName === "") {
      toast.error(" Firm Name Required ! ", {
        position: "top-center",
      });
    } else if (selectedCountry === "") {
      toast.warning(" Select Country ! ", {
        position: "top-center",
      });
    } else if (selectedState === "") {
      toast.warning(" Select state ! ", {
        position: "top-center",
      });
    } else {
      handleNext();
      // toast.success("firm info is filled successfully")
    }
  };

  const submitFirmDetail = async (e) => {
    e.preventDefault();

    if (svalue === 0) {
      toast.error(" Select Firm Size  ! ", {
        position: "top-center",
      });
    } else if (selectedOption === "") {
      toast.warning(" Select How did you hear about us ? ", {
        position: "top-center",
      });
    } else {
      handleNext();
      // toast.success("firm details is filled successfully")
    }
  };

  const [buttonStates2, setButtonStates2] = useState({
    TaxPreparation: false,
    TaxPlanning: false,
    Advisory: false,
    Resolution: false,
    Payroll: false,
    Accounting: false,
    Audit: false,
    LawFirm: false,
    Bookkeeping: false,
    Other: false,
  });

  const [selectAll, setSelectAll] = useState(false);
  const buttonsOn = Object.keys(buttonStates2).filter((button) => buttonStates2[button]);
  const handleButtonClick2 = (buttonName) => {
    setButtonStates2((prevStates) => ({
      ...prevStates,
      [buttonName]: !prevStates[buttonName],
    }));
  };

  const selectedButtons = buttonsOn.join(", ");
  // console.log([selectedButtons]);

  const handleSelectAll = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
    // Set the state of all buttons based on the "Select All" checkbox
    setButtonStates2((prevStates) => {
      const newButtonStates = {};
      Object.keys(prevStates).forEach((button) => {
        newButtonStates[button] = !selectAll;
      });
      return newButtonStates;
    });
  };

  useEffect(() => {}, [selectedButtons]);

  const submitService = async (e) => {
    e.preventDefault();

    if (selectedButtons == []) {
      toast.error(" Select Service  ! ", {
        position: "top-center",
      });
    } else {
      handleNext();
    }
  };

  const colors3 = ["Owner or partner", "Book keeper or Accountant", "Operations / office Manager", "Admin", "Assistant", "Other"];
  const [buttonStates3, setButtonStates3] = useState([false, false, false, false, false, false]);
  const [selectedButton3, setSelectedButton3] = useState(null);

  const handleToggle3 = (index) => {
    const updatedStates = buttonStates3.map((state, i) => (i === index ? !state : false));
    setButtonStates3(updatedStates);
    setSelectedButton3(index);
  };

  const roleOption = colors3[selectedButton3];

  // useEffect to do something when selectedServices changes
  useEffect(() => {
    // console.log(roleOption);
    // You can perform additional actions or API calls here based on the selected services
  }, [roleOption]);
  const submitRole = async (e) => {
    e.preventDefault();

    if (selectedButton3 === "") {
      //   toast.error(" Select Role  ! ", {
      //     position: "top-center",
      //   });
    } else {
      handleNext();
      // toast.success("your role is filled successfully")
    }
  };
  const [currencies, setCurrencies] = useState("");

  const [url, setUrl] = useState("");
  const label = ".pms.com";

  const [selectedCurrency, setSelectedCurrency] = useState("");

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get("https://api.coingecko.com/api/v3/simple/supported_vs_currencies");
        const currencyOptions = Object.keys(response.data).map((currency) => ({
          value: currency,
          label: response.data[currency].toUpperCase(),
        }));

        setCurrencies(currencyOptions);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleCurrencyChange = (selectedOption) => {
    setSelectedCurrency(selectedOption);
  };

  const handleSubmitUrl = () => {
    const combinedValue = url + label;
    // console.log("Combined value:", combinedValue);
    return combinedValue;
  };

  const combinedData = {
    url: handleSubmitUrl(),
  };

  // console.log(combinedData.url);

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

  //?validation
  const submiturl = async (e) => {
    e.preventDefault();
    // console.log("vinayak");

    if (url === "") {
      toast.error(" Choose web URL ! ", {
        position: "top-center",
      });
    } else if (currencies === "") {
      toast.warning(" Select Currency ! ", {
        position: "top-center",
      });
    } else if (language === "") {
      toast.warning(" Select language ! ", {
        position: "top-center",
      });
    } else {
      handleNext();
    }
  };
  const submitPassword = async (e) => {
    e.preventDefault();

    const { password, cpassword } = inppass;

    if (password === "") {
      alert("password is required!", {
        position: "top-center",
      });
    } else if (password.length < 8) {
      alert("password must be 6 char!", {
        position: "top-center",
      });
    } else if (cpassword === "") {
      alert("cpassword is required!", {
        position: "top-center",
      });
    } else if (cpassword.length < 8) {
      alert("confirm password must be 6 char!", {
        position: "top-center",
      });
    } else if (password !== cpassword) {
      alert("pass and Cpass are not matching!", {
        position: "top-center",
      });
    } else {
      toast.success(" Account created successfully  ", {
        position: "top-right",
      });

      //call final
      adminalldata();
      navigate("/login");
      //   history("/login");
    }
  };
  const [adminIdUpdate, setAdminIdUpdate] = useState("");
  const adminalldata = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: inpval.email,
      firstName: firstname,
      lastName: lastName,
      phoneNumber: phoneNumber,
      firmName: firmName,
      country: selectedCountry,
      state: selectedState,
      // firmSize: svalue,
      firmSize: inputValue,
      referenceFrom: selectedOption,
      services: [selectedButtons],
      role: roleOption,
      firmURL: combinedData.url,
      currency: selectedCurrency.label,
      language: language.label,
      password: inppass.password,
      cpassword: inppass.cpassword,
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const Url = `${LOGIN_API}/admin/adminsignup`;
    fetch(Url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        console.log(result.admin._id);
        setAdminIdUpdate(result.admin._id);
        newUser(result.admin._id);

        toast.success("Signup successful!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error signing up. Please try again.", error);
      });
  };
  console.log(adminIdUpdate);
  //************************ */
  const userCreatedmail = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const port = window.location.port;
    const url = `${LOGIN_API}:${port}/login`;
    const raw = JSON.stringify({
      email: inpval.email,
      url: url,
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const Url = `${LOGIN_API}/usersavedemail/`;
    fetch(Url, requestOptions)
      .then((response) => response.json())

      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.error(error));
  };
  //************************ */
  // const [newUserId, setNewUserId] = useState("");
  const newUser = (adminUserId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      username: firmName,
      email: inpval.email,
      password: inppass.password,
      role: "Admin",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(raw);
    const Url = `${LOGIN_API}/common/login/signup/`;
    fetch(Url, requestOptions)
      .then((response) => response.json())

      .then((result) => {
        console.log(result);
        console.log(result._id);
        updateAdminUserId(result._id, adminUserId);
        insertNotificationAccess(result._id);
        sendFirmSettings(result._id);
        userCreatedmail();
      })

      .catch((error) => console.error(error));
  };

  const insertNotificationAccess = (userid) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      userId: userid,
      notifications: [
        {
          notificationDescription: "Invoices",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Payments",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Organizers",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Uploads",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "E-signatures",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Approvals",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Done uploading",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Tasks",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Messages",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "New mail",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Proposals",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Jobs",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Mentions",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "SMS",
          inbox: false,
          email: false,
        },
      ],
      active: true,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/admin/notification`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  const updateAdminUserId = (UserId, adminUserId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      userid: UserId,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(adminUserId);
    // const Url = `${LOGIN_API}/admin/adminsignup`;
    fetch(`${LOGIN_API}/admin/adminsignup/${adminUserId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })

      .catch((error) => console.error(error));
  };

  const sendFirmSettings = (userid) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      firmName: firmName,
      defaultreplytoemails: inpval.email,
      state: selectedState,
      phoneNumber: phoneNumber,
      firmURL: combinedData.url,
      language: language.label,
      adminuserid: userid,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(raw);

    fetch(`${LOGIN_API}/firmsetting/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Response data:", result);
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const [inppass, setInppass] = useState({
    password: "",
    cpassword: "",
  });

  //console.log
  const setValP = (e) => {
    // console.log(e.target.value);
    const { name, value } = e.target;

    setInppass(() => {
      return {
        ...inppass,
        [name]: value,
      };
    });
  };

  const passwordValidation = {
    hasNumber: /\d/.test(inppass.password),
    hasUppercase: /[A-Z]/.test(inppass.password),
    hasLowercase: /[a-z]/.test(inppass.password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(inppass.password),
    hasMinLength: inppass.password.length >= 8,
  };
  const renderFormFields = () => {
    switch (currentStep) {
      // Email (Case 2)
      case 0:
        return showEmailContent ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "5%",
                // maxHeight: '100vh',
                flexDirection: "column",
              }}
            >
              {/* <Typography variant="h4" component="h2" gutterBottom>
                Confirmation Code
              </Typography> */}
              <Typography
                variant="h1"
                sx={{
                  color: "black",
                  fontSize: "35px",
                  fontWeight: "700",
                  mb: "20px",
                  textAlign: "center",
                  fontFamily: "sans-serif",
                }}
              >
                Confirmation Code
              </Typography>

              <Typography sx={{ margin: "3px 0" }}>
                We sent a confirmation code to your email: <b>{inpval.email}</b>
              </Typography>

              {/* <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                                    <BorderColorIcon />
                                </Box> */}

              <Typography sx={{ fontSize: "14px", margin: "3px 0" }}>Please, enter it below:</Typography>

              <Box sx={{ mt: 2, mb: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderInput={(props) => (
                    <input
                      {...props}
                      style={{
                        width: "40px",
                        height: "60px",
                        fontSize: "42px",
                        fontFamily: "Arial, sans-serif",
                        margin: "10px",
                        textAlign: "center",
                      }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4, alignItems: "center" }}>
                <Typography variant="body">
                  <strong>Didn't receive it? </strong>
                </Typography>
                <Button variant="text" onClick={resensotp}>
                  Resend code
                </Button>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "40px" }}>
                <Button variant="contained" className="btn1" onClick={handleClearOtp}>
                  Clear OTP
                </Button>
                <Button variant="contained" className="btn1" onClick={sendOtpVerify}>
                  Verify
                </Button>
              </Box>
            </Box>
          </>
        ) : null;

      // Information (Cases 3-7)
      case 1:
        return <>{renderInformationSteps()}</>;

      // Settings (Cases 8-9)
      case 2:
        return <>{renderSettingsSteps()}</>;

      default:
        return null;
    }
  };

  // Information Step (Cases 3-7)
  const renderInformationSteps = () => {
    switch (subStep) {
      case 3:
        return (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "5%",
                // maxHeight: '100vh',
                flexDirection: "column",
              }}
            >
              <Box sx={{ width: "100%", maxWidth: 400, p: 3 }}>
                {/* <Typography variant="h4" gutterBottom>
                  Your Information
                </Typography> */}
                <Typography
                  variant="h1"
                  sx={{
                    color: "black",
                    fontSize: "35px",
                    fontWeight: "700",
                    mb: "20px",
                    textAlign: "center",
                    fontFamily: "sans-serif",
                  }}
                >
                  Your Information
                </Typography>
                <form>
                  <Box>
                    <InputLabel sx={{ color: "black" }}>First Name</InputLabel>
                    <TextField fullWidth name="First Name" placeholder="First Name" size="small" sx={{ mt: 2 }} value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                  </Box>
                  <Box>
                    <InputLabel sx={{ color: "black", mt: 2 }}>Last Name</InputLabel>
                    <TextField fullWidth name="Last Name" placeholder="Last Name" size="small" sx={{ mt: 2 }} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </Box>
                  <Box sx={{ mb: 2, width: "100%" }}>
                    <InputLabel sx={{ color: "black", mt: 2 }}>Phone Number</InputLabel>

                    <PhoneInput
                      style={{ width: "450px" }}
                      country={"us"}
                      placeholder="enter phone number "
                      onChange={(value) => {
                        setPhoneNumber(value);
                      }}
                      countryCodeEditabel={false}
                      isValid={(inputNumber, country, countries) => {
                        return countries.some((country) => {
                          return startsWith(inputNumber, country.dialCode) || startsWith(country.dialCode, inputNumber);
                        });
                      }}
                    />
                    {!valid && (
                      <Typography color="error" variant="body2">
                        Please enter a valid phone number.
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Button variant="contained" color="primary" style={{ width: "100px", margin: "10px 0" }} onClick={submitUserinfo}>
                      Next
                    </Button>
                  </Box>
                </form>
              </Box>
            </Box>
          </>
        );
      case 4:
        return (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "5%",
                // maxHeight: '100vh',
                flexDirection: "column",
              }}
            >
              {/* <Paper elevation={3} sx={{ padding: 4, width: '550px', }}> */}
              <Box sx={{ width: "100%", maxWidth: 400, p: 3 }}>
                <Box>
                  {/* <Typography variant="h3" sx={{ marginBottom: "20px" }}>
                    Firm Information
                  </Typography> */}
                  <Typography
                    variant="h1"
                    sx={{
                      color: "black",
                      fontSize: "35px",
                      fontWeight: "700",
                      mb: "20px",
                      textAlign: "center",
                      fontFamily: "sans-serif",
                    }}
                  >
                    Firm Information
                  </Typography>
                  <form>
                    <Box>
                      <InputLabel sx={{ color: "black" }}>Firm Name</InputLabel>
                      <TextField fullWidth name="firm name" placeholder="Enter firm name" size="small" sx={{ mt: 2 }} value={value} onChange={(e) => setFirmName(e.target.value)} />
                    </Box>

                    <Box className="col-12">
                      <Box>
                        <InputLabel sx={{ color: "black", mt: 2 }}>Country</InputLabel>
                        <Autocomplete
                          sx={{ mt: 2 }}
                          size="small"
                          value={selectedCountryD}
                          onChange={(event, newValue) => {
                            setSelectedCountry(newValue?.label || "");
                            setSelectedCountryD(newValue || null);
                            setSelectedState(null); // Reset selected state when the country changes
                          }}
                          options={countries}
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => <TextField {...params} placeholder="Country" variant="outlined" />}
                        />
                      </Box>

                      <Box>
                        <InputLabel sx={{ color: "black", mt: 2 }}>State</InputLabel>
                        <Autocomplete
                          sx={{ mt: 2 }}
                          size="small"
                          value={stateOptions.find((option) => option.value === selectedState)}
                          onChange={(event, newValue) => {
                            setSelectedState(newValue?.label || "");
                          }}
                          options={stateOptions}
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => <TextField {...params} placeholder="States" variant="outlined" />}
                        />
                      </Box>
                    </Box>
                  </form>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 3 }}>
                    <Button variant="contained" onClick={submitFerminfo}>
                      Next
                    </Button>
                  </Box>
                </Box>
              </Box>
              {/* </Paper> */}
            </Box>
          </>
        );
      case 5:
        return (
          <>
            {/* <Typography sx={{ mt: 5, ml: 15 }} variant="h3">
              Firm details
            </Typography> */}
            <Typography
              variant="h1"
              sx={{
                color: "black",
                fontSize: "35px",
                fontWeight: "700",
                mt: "30px",
                // mb: "20px",
                textAlign: "center",
                fontFamily: "sans-serif",
              }}
            >
              Firm details
            </Typography>
            <Box sx={{ justifyContent: "center", display: "flex", flexDirection: "column" }}>
              {/* <Box >
                                    <Box style={{ textAlign: "center", marginBottom: "10px", alignItems: "center", justifyContent: "center" }}>Selected Value: {fixedValues[sliderValue]}</Box>
                                    <Box style={{ marginLeft: "20px", display: "flex", justifyContent: "space-between" }}>
                                        {fixedValues.map((value, index) => (
                                            <Box key={index}>{value}</Box>
                                        ))}
                                    </Box>
                                    <Box style={{ marginBottom: "20px" }}>
                                        <input type="range" min="0" max={fixedValues.length - 1} step="1" value={sliderValue} onChange={handleSliderChange} style={{ width: "100%", justifyContent: "center" }} />
                                    </Box>
                                </Box> */}
              {/*  */}
              <Box sx={{ ml: "10%", mr: "10%" }}>
                <InputLabel sx={{ mt: "3%", mb: "1%", fontWeight: "600" }} htmlFor="firimname">
                  Firm Size
                </InputLabel>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Input
                    value={inputValue}
                    size="small"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disableUnderline
                    sx={{
                      width: "100px",
                      p: "10px 10px 10px 40px",
                      textAlign: "center",
                      border: "1px solid dodgerblue",
                      mr: "10px",
                      borderRadius: "4px",
                      marginRight: "10px",
                    }}
                  />
                  <Slider
                    value={inputValue}
                    onChange={handleSliderChange}
                    step={1}
                    min={0}
                    max={200}
                    marks={[
                      { value: 0, label: "0" },
                      { value: 5, label: "5" },
                      { value: 10, label: "10" },
                      { value: 15, label: "15" },
                      { value: 50, label: "50" },
                      { value: 100, label: "100" },
                      { value: 200, label: "200+" },
                    ]}
                    sx={{ width: "90%", ml: "20px" }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", ml: 15 }}>
                <Box>
                  <Box>
                    <h2 style={{ marginLeft: "3%" }}>How did you hear about PMS Solutions? </h2>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                      {colors.map((color, index) => (
                        // <Button variant="contained" key={value} value={colors[selectedButton]} className={`slider-toggle-button ${buttonStates[index] ? "active" : ""}`} onClick={() => handleToggle(index)} style={{ margin: "10px 17px" }}>
                        //     {color}
                        // </Button>
                        <Button
                          variant={buttonStates[index] ? "contained" : "outlined"}
                          key={value}
                          value={colors[selectedButton]}
                          // className={`slider-toggle-button ${buttonStates[index] ? "active" : ""}`}
                          onClick={() => handleToggle(index)}
                          style={{ margin: "10px 17px" }}
                        >
                          {color}
                        </Button>
                      ))}
                      {/* <Box style={{ marginTop: "10px" }}>{selectedButton !== null && <p>Sorce Of Information :<bold>{colors[selectedButton]}</bold>  </p>}</Box> */}
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 7 }}>
                    <Button variant="contained" className="btn1" onClick={submitFirmDetail}>
                      Next
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </>
        );
      case 6:
        return (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "5%",
                maxHeight: "100vh", // Full viewport height
                flexDirection: "column", // Column direction for centering
              }}
            >
              <Box>
                {/* <h2>Services your firm offers</h2> */}
                <Typography
                  variant="h1"
                  sx={{
                    color: "black",
                    fontSize: "35px",
                    fontWeight: "700",
                    // mt: "30px",
                    mb: "10%",
                    textAlign: "center",
                    fontFamily: "sans-serif",
                  }}
                >
                  Services your firm offers
                </Typography>
                {/* <Box style={{ margin: "20px 0" }}>
                  <Grid container spacing={0}>
                    <Grid item xs={4}>
                      <Button
                        variant={buttonStates2.TaxPreparation ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("TaxPreparation")}
                        style={{
                          backgroundColor: buttonStates2.TaxPreparation ? "#043a77" : "",
                          width: "50%",
                          margin: "5px 0 ",
                        }}
                      >
                        Tax Preparation
                      </Button>
                    </Grid>
                    <Grid item xs={4} sx={{ display: "flex" }}>
                      <Button
                        variant={buttonStates2.TaxPlanning ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("TaxPlanning")}
                        style={{
                          backgroundColor: buttonStates2.TaxPlanning ? "#043a77" : "",
                          width: "50%",
                          margin: "5px",
                          padding: "5px",
                        }}
                      >
                        Tax Planning
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        variant={buttonStates2.Advisory ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("Advisory")}
                        style={{
                          backgroundColor: buttonStates2.Advisory ? "#043a77" : "",
                          width: "50%",
                          margin: "5px 0",
                        }}
                      >
                        Advisory
                      </Button>
                    </Grid>

                    <Grid item xs={4}>
                      <Button
                        variant={buttonStates2.Resolution ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("Resolution")}
                        style={{
                          backgroundColor: buttonStates2.Resolution ? "#043a77" : "",
                          width: "50%",
                          margin: "5px 0",
                        }}
                      >
                        Resolution
                      </Button>
                    </Grid>
                    <Grid item xs={4} sx={{ display: "flex", gap: 3 }}>
                      <Button
                        variant={buttonStates2.Payroll ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("Payroll")}
                        style={{
                          backgroundColor: buttonStates2.Payroll ? "#043a77" : "",
                          width: "50%",
                          margin: "5px",
                          padding: "5px",
                        }}
                      >
                        Payroll
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        variant={buttonStates2.Accounting ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("Accounting")}
                        style={{
                          backgroundColor: buttonStates2.Accounting ? "#043a77" : "",
                          width: "50%",
                          margin: "5px 0",
                        }}
                      >
                        Accounting
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        variant={buttonStates2.Audit ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("Audit")}
                        style={{
                          backgroundColor: buttonStates2.Audit ? "#043a77" : "",
                          width: "50%",
                          margin: "5px 0",
                        }}
                      >
                        Audit
                      </Button>
                    </Grid>
                    <Grid item xs={4} sx={{ display: "flex", gap: 3 }}>
                      <Button
                        variant={buttonStates2.LawFirm ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("LawFirm")}
                        style={{
                          backgroundColor: buttonStates2.LawFirm ? "#043a77" : "",
                          width: "50%",
                          margin: "5px",
                          padding: "5px",
                        }}
                      >
                        Law Firm
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        variant={buttonStates2.Bookkeeping ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("Bookkeeping")}
                        style={{
                          backgroundColor: buttonStates2.Bookkeeping ? "#043a77" : "",
                          width: "50%",
                          margin: "5px 0",
                        }}
                      >
                        Bookkeeping
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        variant={buttonStates2.Other ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("Other")}
                        style={{
                          backgroundColor: buttonStates2.Other ? "#043a77" : "",
                          width: "50%",
                          margin: "5px 0",
                        }}
                      >
                        Other
                      </Button>
                    </Grid>
                  </Grid>
                </Box> */}
                <Box style={{ margin: "20px 0" }}>
                  <Grid container spacing={0}>
                    <Grid item xs={3}>
                      <Button
                        variant={buttonStates2.TaxPreparation ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("TaxPreparation")}
                        style={{
                          backgroundColor: buttonStates2.TaxPreparation ? "#043a77" : "",
                          width: "80%",
                          margin: "5px 0 ",
                        }}
                      >
                        Tax Preparation
                      </Button>
                    </Grid>
                    <Grid item xs={3} sx={{ display: "flex" }}>
                      <Button
                        variant={buttonStates2.TaxPlanning ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("TaxPlanning")}
                        style={{
                          backgroundColor: buttonStates2.TaxPlanning ? "#043a77" : "",
                          width: "80%",
                          margin: "5px 0",
                          padding: "5px",
                        }}
                      >
                        Tax Planning
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        variant={buttonStates2.Advisory ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("Advisory")}
                        style={{
                          backgroundColor: buttonStates2.Advisory ? "#043a77" : "",
                          width: "80%",
                          margin: "5px 0",
                        }}
                      >
                        Advisory
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        variant={buttonStates2.Resolution ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("Resolution")}
                        style={{
                          backgroundColor: buttonStates2.Resolution ? "#043a77" : "",
                          width: "80%",
                          margin: "5px 0",
                        }}
                      >
                        Resolution
                      </Button>
                    </Grid>
                    <Grid item xs={3} sx={{ display: "flex", gap: 3 }}>
                      <Button
                        variant={buttonStates2.Payroll ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("Payroll")}
                        style={{
                          backgroundColor: buttonStates2.Payroll ? "#043a77" : "",
                          width: "80%",
                          margin: "5px 0",
                          //   padding: "5px",
                        }}
                      >
                        Payroll
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        variant={buttonStates2.Accounting ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("Accounting")}
                        style={{
                          backgroundColor: buttonStates2.Accounting ? "#043a77" : "",
                          width: "80%",
                          margin: "5px 0",
                        }}
                      >
                        Accounting
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        variant={buttonStates2.Audit ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("Audit")}
                        style={{
                          backgroundColor: buttonStates2.Audit ? "#043a77" : "",
                          width: "80%",
                          margin: "5px 0",
                        }}
                      >
                        Audit
                      </Button>
                    </Grid>
                    <Grid item xs={3} sx={{ display: "flex", gap: 3 }}>
                      <Button
                        variant={buttonStates2.LawFirm ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("LawFirm")}
                        style={{
                          backgroundColor: buttonStates2.LawFirm ? "#043a77" : "",
                          width: "80%",
                          margin: "5px 0",
                          padding: "5px",
                        }}
                      >
                        Law Firm
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        variant={buttonStates2.Bookkeeping ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("Bookkeeping")}
                        style={{
                          backgroundColor: buttonStates2.Bookkeeping ? "#043a77" : "",
                          width: "80%",
                          margin: "5px 0",
                        }}
                      >
                        Bookkeeping
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        variant={buttonStates2.Other ? "contained" : "outlined"}
                        onClick={() => handleButtonClick2("Other")}
                        style={{
                          backgroundColor: buttonStates2.Other ? "#043a77" : "",
                          width: "80%",
                          margin: "5px 0",
                        }}
                      >
                        Other
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                <Box>
                  <label>
                    <input type="checkbox" onChange={handleSelectAll} style={{ marginLeft: "2%" }} />
                    Select All
                  </label>
                  <Button variant="contained" onClick={submitService} className="btn1" style={{ marginLeft: "20px" }}>
                    Next
                  </Button>
                </Box>
              </Box>
            </Box>
          </>
        );
      case 7:
        return (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "5%",
                maxHeight: "100vh", // Full viewport height
                flexDirection: "column", // Column direction for centering
              }}
            >
              <Box>
                {/* <h1>Your role in the firm </h1> */}
                <Typography
                  variant="h1"
                  sx={{
                    color: "black",
                    fontSize: "35px",
                    fontWeight: "700",
                    // mt: "30px",
                    mb: "20px",
                    textAlign: "center",
                    fontFamily: "sans-serif",
                  }}
                >
                  Your role in the firm
                </Typography>
                <Box>
                  <Box>
                    {/* <Grid container spacing={2}>
                                            {colors3.map((color, index) => (
                                                <Grid item xs={4} key={index}>
                                                    <Button
                                                       
                                                        variant={buttonStates3[index] ? "contained" : "outlined"}
                                                        fullWidth 
                                                        onClick={() => handleToggle3(index)}
                                                        sx={{ padding: "10px" , margin:'10px'}}
                                                    >
                                                        {color}
                                                    </Button>
                                                </Grid>
                                            ))}
                                        </Grid> */}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2, // Space between buttons
                        justifyContent: "space-between",
                      }}
                    >
                      {colors3.map((color, index) => (
                        <Button
                          key={index}
                          variant={buttonStates3[index] ? "contained" : "outlined"}
                          fullWidth
                          onClick={() => handleToggle3(index)}
                          sx={{ padding: "10px", margin: "10px 0", width: "30%" }} // Adjust width to match grid behavior
                        >
                          {color}
                        </Button>
                      ))}
                    </Box>

                    {/* <Box style={{ marginTop: "10px" }}>
                                            {selectedButton3 !== null && <p>Source Of Information: {colors3[selectedButton3]}</p>}
                                        </Box> */}
                  </Box>
                </Box>
              </Box>
              <Box mt={5}>
                <Button variant="contained" onClick={submitRole}>
                  Next
                </Button>
              </Box>
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  // Settings Step (Cases 8-9)
  const renderSettingsSteps = () => {
    switch (settingsStep) {
      case 8:
        return (
          <>
            <Box
              sx={{
                display: "flex",
                // justifyContent: 'center',
                alignItems: "center",
                mt: "5%",
                maxHeight: "100vh", // Full viewport height
                // flexDirection: 'column', // Column direction for centering
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", width: "50%" }} ml={5}>
                <Box>
                  <h2>Firm Settings</h2>

                  <Box>
                    <Typography variant="body1">A powerful, integrated platform to manage teams, clients, projects.</Typography>
                    <Typography variant="body1">
                      <b>from $50/mo per user</b>
                      (with a 3-year subscription plan)
                    </Typography>
                  </Box>

                  <h3>Firm Setting</h3>

                  <p>choose web URL</p>
                  <Box style={{ fontSize: "13px" }}>
                    <p>You will be ale to set up a fully custom domain(without.pms.com) later</p>
                  </Box>

                  <Box>
                    {/* <label id="domin_lable">
                                        .pms.com
                                    </label> */}
                    <TextField
                      id="url_input"
                      size="small"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Enter your URL"
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">.pms.com</InputAdornment>,
                      }}
                    />
                  </Box>
                  <label>You cannot Change it later</label>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2 }}>
                    <Box>
                      <Typography>Select Currency: </Typography>

                      <Autocomplete size="small" margin="normal" value={selectedCurrency} onChange={(event, newValue) => handleCurrencyChange(newValue)} options={currencies} getOptionLabel={(option) => option.label || ""} renderInput={(params) => <TextField {...params} placeholder="Select a currency" />} />
                    </Box>
                    <Box>
                      <Typography>Select Language: </Typography>
                      <Autocomplete size="small" margin="normal" value={selectedLanguage} onChange={(event, newValue) => handleLanguageChange(newValue)} options={languages} getOptionLabel={(option) => option.label || ""} renderInput={(params) => <TextField {...params} placeholder="Select a language" />} />
                    </Box>
                  </Box>
                  {/* submiturl */}
                  <Button variant="contained" onClick={submiturl} style={{ margin: "25px 0" }}>
                    Continue
                  </Button>
                </Box>
              </Box>
              <Box>
                <img style={{ height: "500px", width: "100%" }} src={firmsetting} alt="" />
              </Box>
            </Box>
          </>
        );
      case 9:
        return (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "5%",
                maxHeight: "100vh", // Full viewport height
                flexDirection: "column", // Column direction for centering
              }}
            >
              {/* <Paper elevation={3} sx={{ padding: 4, width: '550px', height: '400px', }}> */}
              <Box sx={{ width: "100%", maxWidth: 400, p: 3 }}>
                {/* <Typography textAlign={"center"} variant="h5">
                  Set Password
                </Typography> */}
                <Typography
                  variant="h1"
                  sx={{
                    color: "black",
                    fontSize: "35px",
                    fontWeight: "700",
                    // mt: "30px",
                    mb: "20px",
                    textAlign: "center",
                    fontFamily: "sans-serif",
                  }}
                >
                  Set Password
                </Typography>
                <Box mt={2}>
                  <Typography mb={1}>Password</Typography>
                  <TextField
                    fullWidth
                    //    margin='normal'
                    size="small"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={inppass.password}
                    name="password"
                    placeholder="Password"
                    onChange={setValP}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} onMouseUp={handleMouseUpPassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box mt={3} ml={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <FormHelperText sx={{ display: "flex" }} error={!passwordValidation.hasNumber}>
                          <CheckCircleIcon color={passwordValidation.hasNumber ? "success" : "error"} fontSize="small" />
                          <p style={{ marginTop: "1px", marginLeft: "3px" }}>a number</p>
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={6}>
                        <FormHelperText sx={{ display: "flex" }} error={!passwordValidation.hasUppercase}>
                          <CheckCircleIcon color={passwordValidation.hasUppercase ? "success" : "error"} fontSize="small" />
                          <p style={{ marginTop: "1px", marginLeft: "3px" }}>an uppercase letter</p>
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={6}>
                        <FormHelperText sx={{ display: "flex" }} error={!passwordValidation.hasLowercase}>
                          <CheckCircleIcon color={passwordValidation.hasLowercase ? "success" : "error"} fontSize="small" />
                          <p style={{ marginTop: "1px", marginLeft: "3px" }}>a lowercase letter</p>
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={6}>
                        <FormHelperText sx={{ display: "flex" }} error={!passwordValidation.hasSymbol}>
                          <CheckCircleIcon color={passwordValidation.hasSymbol ? "success" : "error"} fontSize="small" />
                          <p style={{ marginTop: "1px", marginLeft: "3px" }}>a symbol</p>
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={6}>
                        <FormHelperText sx={{ display: "flex" }} error={!passwordValidation.hasMinLength}>
                          <CheckCircleIcon color={passwordValidation.hasMinLength ? "success" : "error"} fontSize="small" />
                          <p style={{ marginTop: "1px", marginLeft: "3px" }}>at least 8 characters</p>
                        </FormHelperText>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>

                <Box mt={2}>
                  <Typography mb={1}>Confirm Password</Typography>

                  <TextField
                    fullWidth
                    size="small"
                    type={showConfirmPassword ? "text" : "password"}
                    value={inppass.cpassword}
                    name="cpassword"
                    placeholder="Confirm Password"
                    onChange={setValP}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle confirm password visibility" onClick={handleClickShowConfirmPassword} onMouseDown={handleMouseDownPassword} onMouseUp={handleMouseUpPassword} edge="end">
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box mt={5} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                  <Button variant="contained" onClick={submitPassword}>
                    {" "}
                    Continue
                  </Button>
                </Box>
              </Box>
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Render the Stepper only when the Email step content is shown */}
      <Box>
        {showEmailContent && (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 15px" }}>
            <Box sx={{ padding: "10px 15px", display: "flex", alignItems: "center" }}>
              <img src={micropms} style={{ height: "40px" }} />
              <Typography variant="h6" sx={{ fontFamily: "sans-serif", color: "black", fontSize: "20px", fontWeight: "700" }}>
                PMS Solutions
              </Typography>
            </Box>
            <Stepper activeStep={currentStep}>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>
                    <Typography fontSize="25px" ml={2} mr={2}>
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <Button variant="outlined" onClick={handleAdminLogin}>
              Log In
            </Button>
          </Box>
        )}
      </Box>

      <Box>
        {/* Render form fields based on current step */}
        {renderFormFields()}
      </Box>

      <Box>
        {/* Show button to go to email step initially */}
        {!showEmailContent && (
          <>
            <Box sx={{ padding: "10px 15px", display: "flex", alignItems: "center" }}>
              <img src={micropms} style={{ height: "40px" }} />
              <Typography variant="h6" sx={{ fontFamily: "sans-serif", color: "black", fontSize: "20px", fontWeight: "700" }}>
                PMS Solutions
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "5%",
                maxHeight: "100vh", // Full viewport height
                flexDirection: "column", // Column direction for centering
              }}
            >
              <Box sx={{ width: "100%", maxWidth: 400, p: 3 }}>
                {/* <Typography variant="h5" textAlign={"center"}>
                  <b>Signup</b>
                </Typography> */}
                <Typography
                  variant="h1"
                  sx={{
                    color: "black",
                    fontSize: "35px",
                    fontWeight: "700",
                    mb: "20px",
                    textAlign: "center",
                    fontFamily: "sans-serif",
                  }}
                >
                  Signup
                </Typography>
                <p className="subtitle" style={{ textAlign: "center" }}>
                  Sign up your firm and start upgrading your workflow
                </p>

                <form>
                  <Box className="form-group">
                    <InputLabel sx={{ color: "black" }}>Email</InputLabel>
                    <TextField fullWidth type="email" name="email" placeholder="Enter Your Email" size="small" sx={{ mt: 2 }} value={inpval.email} onChange={setVal} />
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", width: "100%", mt: 1 }}>
                    <FormControlLabel control={<Checkbox id="terms" onChange={setValbox} checked={isChecked} />} label={<span style={{ color: "#696969", fontSize: "14px", marginBottom: "0" }}>I agree to the terms and conditions</span>} />
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Button sx={{ mt: 2 }} variant="contained" onClick={createAccount}>
                      Create Account
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2 }}>
                    <Typography variant="body2" className="sign-in-link">
                      Already have an account?{" "}
                      <Link component={NavLink} to="/" sx={{ textDecoration: "none", color: "blue" }}>
                        Sign in
                      </Link>
                    </Typography>
                  </Box>
                </form>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default MyForm;
