
import React, { useState, useEffect } from "react";
import logo from '../Images/Logo.svg';
import { Box, Link, Divider, IconButton, Typography, TextField, InputLabel, Checkbox, Button, FormControlLabel, Paper, Grid, FormControl } from '@mui/material';
import { NavLink } from "react-router-dom"; // Correct import for NavLink
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import OtpInput from "react-otp-input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import startsWith from "lodash.startswith";
import axios from "axios";
import { Autocomplete } from '@mui/material';
import firmsetting from '../Images/setting.png';
import OutlinedInput from '@mui/material/OutlinedInput';
import './Adminsignup.css';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const AdminSignup = () => {
    
    const navigate = useNavigate();
    // TODO ======== #page control logic No1 =======
    //! Change state for testing
    const [currentStep, setCurrentStep] = useState(3);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [valid, setValid] = useState(true);
    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    //Country State API

    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [states, setStates] = useState([]);
    const [firmName, setFirmName] = useState("");
    const [selectedState, setSelectedState] = useState("");

    const [error, setError] = useState(null);
    const [selectedCountryD, setSelectedCountryD] = useState("");

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
        console.log("Selected Country:", selectedCountry);
        // You can perform additional actions or API calls here based on the selected country
    }, [selectedCountry]);

    //todo ========    #send mail to backend for varification code  case 5: =======
    //slider
    const [value, setValue] = useState();
    const [sliderValue, setSliderValue] = useState(0);
    const fixedValues = [0, 5, 10, 15, 50, 100, 200];
    const colors = ["Google search", "Capterra/ Get app/ G2", "From a friend", "Offline event", "Social media", "Taxdome consultant/ Partner", "Other"];
    const [buttonStates, setButtonStates] = useState([false, false, false, false, false, false, false]);
    const [selectedButton, setSelectedButton] = useState(null);

    const handleToggle = (index) => {
        const updatedStates = buttonStates.map((state, i) => (i === index ? !state : false));
        setButtonStates(updatedStates);
        setSelectedButton(index);
    };

    const handleSliderChange = (event) => {
        setSliderValue(parseInt(event.target.value, 10));
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

    //=============================================================
    //todo  Services offers case 6:

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
    console.log([selectedButtons]);

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

    useEffect(() => {
        // console.log(selectedButtons);
        // You can perform additional actions or API calls here based on the selected services
    }, [selectedButtons]);

    const submitService = async (e) => {
        e.preventDefault();

        if (selectedButtons == []) {
              toast.error(" Select Service  ! ", {
                position: "top-center",
              });
        } else {
            nextStep();
            toast.success("Services your firm offers filled successfully")
        }
    };

    //======================================
    //======================================

    //todo role selection case 7
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
            nextStep();
            toast.success("your role is filled successfully")
        }
    };
    //============================
    ////todo role selection case 8 ============================
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

    // const handleUrlChange = (e) => {

    //   setUrl(e.target.value);

    // };

    const handleSubmitUrl = () => {
        const combinedValue = url + label;
        console.log("Combined value:", combinedValue);
        return combinedValue;
    };

    const combinedData = {
        url: handleSubmitUrl(),
    };

    console.log(combinedData.url);

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
        console.log("vinayak");

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
               } 
               else {
                
            nextStep();
            toast.success("firm settings filled succesfully")
        }
    };

    //todo role selection case 9
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show)

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const [passShow, setPassShow] = useState(false);
    const [cpassShow, setCPassShow] = useState(false);

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

    //  const submitPassword = async (e) => {
    //    e.preventDefault();

    //    const { password, cpassword } = inppass;

    //    if (password === "") {
    //      alert("password is required!", {
    //        position: "top-center",
    //      });
    //    } else if (password.length < 8) {
    //      alert("password must be 6 char!", {
    //        position: "top-center",
    //      });
    //    } else if (cpassword === "") {
    //      alert("cpassword is required!", {
    //        position: "top-center",
    //      });
    //    } else if (cpassword.length < 8) {
    //      alert("confirm password must be 6 char!", {
    //        position: "top-center",
    //      });
    //    } else if (password !== cpassword) {
    //      alert("pass and Cpass are not matching!", {
    //        position: "top-center",
    //      });
    //    } else {
    //      toast.success(" Account created successfully  ", {
    //        position: "top-right",
    //      });
    //      // nextStep();

    //      //call final
    //      adminalldata();
    //      // useNavigate("/login")
    //      history("/login");
    //    }
    //  };

    //*checkbox
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

            fetch("http://127.0.0.1:8880/common/user/email/getuserbyemail/" + email, requestOptions)
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
                            url: "http://127.0.0.1:8880/request-otp",
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
                                nextStep();
                            })
                            .catch((error) => {
                                alert("please check your OTP");
                                console.log(error);
                            });
                    }
                })
                .catch((error) => console.error("Error:", error));
            console.log(error);
        }
    };


    const resensotp = async (e) => {
        e.preventDefault();

        //const { email } = inpval;

        e.preventDefault();

        let data = JSON.stringify({
            email: inpval.email,
        });
        const Url = "http://127.0.0.1:8880/request-otp";
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
                console.log(error);
            });
    };

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
            const Url = 'http://127.0.0.1:8880/verify-otp/';
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

                    nextStep();
                })
                .catch((error) => {
                    alert("please check your OTP");
                    console.log(error);
                });
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
            nextStep();
            toast.success("your info is filled successfully")
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
          nextStep();
          toast.success("firm info is filled successfully")
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
          nextStep();
          toast.success("firm details is filled successfully")
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
          // nextStep();
    
          //call final
          adminalldata();
          navigate("/login")
        //   history("/login");
        }
      };
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
          firmSize: svalue,
          referenceFrom: selectedOption,
          services: [
             selectedButtons,
           
          ],
          role: roleOption,
          firmURL: combinedData.url,
          currency: selectedCurrency.label,
          language: language.label,
          password: inppass.password,
          cpassword: inppass.cpassword,
        });
    console.log(raw)
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        const Url = 'http://127.0.0.1:8880/admin/adminsignup';
        fetch(Url, requestOptions)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.text();
          })
          .then((result) => {
            console.log(result);
    
            newUser();
    
            toast.success("Signup successful!");
          })
          .catch((error) => {
            console.error(error);
            toast.error("Error signing up. Please try again.", error);
          });
      };

      //************************ */
  const userCreatedmail = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const port = window.location.port;
    const url = `http://127.0.0.1:8880:${port}/login`;
    const raw = JSON.stringify({
      email: inpval.email,
      url: url,
    });
console.log(raw)
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const Url = 'http://127.0.0.1:8880/usersavedemail/';
    fetch(Url, requestOptions)
      .then((response) => response.text())

      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.error(error));
  };
    //************************ */
  const newUser = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      username: firmName,
      email: inpval.email,
      password: inppass.password,
      role: roleOption,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const Url = 'http://127.0.0.1:8880/common/login/signup/';
    fetch(Url, requestOptions)
      .then((response) => response.text())

      .then((result) => {
        console.log(result);
        userCreatedmail();
      })

      .catch((error) => console.error(error));
  };
    const renderFormFields = () => {
        switch (currentStep) {
            // Sign up
            case 1:
                return (
                    <Box>
                        <Box>
                            <Box style={{ margin: "20px" }}>
                                <img style={{ width: "30px" }} src={logo} alt="" />
                                <b>PMS Solutions</b>
                            </Box>

                            <Box className="col-12 case1">
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                                    <Box>
                                        <Typography variant="h5" textAlign={'center'}><b>Signup</b></Typography>
                                        <p className="subtitle">Sign up your firm and start upgrading your workflow</p>

                                        <form onSubmit={handleSubmit}>
                                            <Box className="form-group">
                                                <InputLabel sx={{ color: 'black' }}>Email</InputLabel>

                                                <TextField
                                                    fullWidth
                                                    type="email"
                                                    name="email"
                                                    placeholder="Enter Your Email"
                                                    size="small"
                                                    sx={{ mt: 2 }}
                                                    value={inpval.email} onChange={setVal}
                                                />
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                    mt: 1, // Margin Top
                                                }}
                                            >
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            id="terms"
                                                            onChange={setValbox} checked={isChecked}
                                                        />
                                                    }
                                                    label={
                                                        <span style={{ color: '#696969', fontSize: '14px', marginBottom: '0' }}>
                                                            I agree to the terms and conditions
                                                        </span>
                                                    }
                                                />
                                            </Box>

                                            <Box sx={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                                                <Button sx={{ mt: 2 }} variant="contained" onClick={createAccount}>
                                                    Create Account
                                                </Button>
                                            </Box>

                                            <Box sx={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
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
                                <br />
                            </Box>
                        </Box>
                    </Box>
                );

            // code confirmation 
            case 2:
                return (
                    <>
                        <Box className=" col-12 ">
                            <Box className="top-header col-12" style={{ display: "flex" }}>
                                <Box className="col-4" style={{ margin: "20px" }}>
                                    <img style={{ width: "30px" }} src={logo} alt="" />
                                    <b>PMS Solutions</b>
                                </Box>

                            </Box>
                            <Box sx={{backgroundColor: '#f0f0f0',height: '89vh',display:'flex',alignItems:'center',justifyContent:'center'}}> 

                            <Paper elevation={3} sx={{ padding: 4, width: '500px', textAlign: 'center', borderRadius: '10px' }}>
                                    <Typography variant="h4" component="h2" gutterBottom>
                                        Confirmation Code
                                    </Typography>

                                    <Typography sx={{ margin: '3px 0' }}>
                                        We sent a confirmation code to your email: <b>{inpval.email}</b>
                                    </Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                                        <BorderColorIcon />
                                    </Box>

                                    <Typography sx={{ fontSize: '14px', margin: '3px 0' }}>
                                        Please, enter it below:
                                    </Typography>

                                    <Box sx={{ mt: 2, mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <OtpInput
                                            value={otp}
                                            onChange={setOtp}
                                            numInputs={6}
                                            renderInput={(props) => (
                                                <input
                                                    {...props}
                                                    style={{
                                                        width: '40px',
                                                        height: '60px',
                                                        fontSize: '42px',
                                                        fontFamily: 'Arial, sans-serif',
                                                        margin: '10px',
                                                        textAlign: 'center',

                                                    }}
                                                />
                                            )}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                                        <Typography variant="body"> <strong>Didn't receive it? </strong></Typography>
                                        <Button variant="contained" className="btn1" onClick={resensotp}>
                                            Resend code
                                        </Button>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
                                        <Button variant="contained" className="btn1" onClick={handleClearOtp}>
                                            Clear OTP
                                        </Button>
                                        <Button variant="contained" className="btn1" onClick={sendOtpVerify}>
                                            Verify
                                        </Button>
                                    </Box>
                                </Paper>

                            </Box>
                            {/* <Box
                                sx={{
                                    height: '100vh',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#f0f0f0',

                                }}
                            >
                                <Paper elevation={3} sx={{ padding: 4, width: '500px', textAlign: 'center', borderRadius: '10px' }}>
                                    <Typography variant="h4" component="h2" gutterBottom>
                                        Confirmation Code
                                    </Typography>

                                    <Typography sx={{ margin: '3px 0' }}>
                                        We sent a confirmation code to your email: <b>{inpval.email}</b>
                                    </Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                                        <BorderColorIcon />
                                    </Box>

                                    <Typography sx={{ fontSize: '14px', margin: '3px 0' }}>
                                        Please, enter it below:
                                    </Typography>

                                    <Box sx={{ mt: 2, mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <OtpInput
                                            value={otp}
                                            onChange={setOtp}
                                            numInputs={6}
                                            renderInput={(props) => (
                                                <input
                                                    {...props}
                                                    style={{
                                                        width: '40px',
                                                        height: '60px',
                                                        fontSize: '42px',
                                                        fontFamily: 'Arial, sans-serif',
                                                        margin: '10px',
                                                        textAlign: 'center',

                                                    }}
                                                />
                                            )}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                                        <Typography variant="body"> <strong>Didn't receive it? </strong></Typography>
                                        <Button variant="contained" className="btn1" onClick={resensotp}>
                                            Resend code
                                        </Button>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
                                        <Button variant="contained" className="btn1" onClick={handleClearOtp}>
                                            Clear OTP
                                        </Button>
                                        <Button variant="contained" className="btn1" onClick={sendOtpVerify}>
                                            Verify
                                        </Button>
                                    </Box>
                                </Paper>
                            </Box> */}

                        </Box>
                    </>
                );
            //!================================================================================================================================================================
            case 3:
                return (
                    <>
                        <Box className=" col-12  ">
                            <Box className="top-header col-12" style={{ display: "flex" }}>
                                <Box className="col-4" style={{ margin: "20px" }}>
                                    <img style={{ width: "30px" }} src={logo} alt="" />
                                    <b>PMS Solutions</b>
                                </Box>

                                {/* <Box sx={{ width: '85%' }}>
                                    <Stepper activeStep={currentStep} alternativeLabel>
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </Box>  */}
                            </Box>
                        </Box>
                         


                        <Box
                            backgroundColor={'#f0f0f0'}
                            height={'89vh'}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"

                        >
                            <Paper
                                elevation={3}
                                sx={{
                                    padding: 4,
                                    width: '500px',
                                    margin: 'auto',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography variant="h4" gutterBottom>
                                        Your Information
                                    </Typography>
                                    <form>
                                        <Box>
                                            <InputLabel sx={{ color: 'black' }}>First Name</InputLabel>
                                            <TextField
                                                fullWidth
                                                name="First Name"
                                                placeholder="First Name"
                                                size="small"
                                                sx={{ mt: 2 }}
                                                value={firstname} onChange={(e) => setFirstname(e.target.value)}
                                            />
                                        </Box>
                                        <Box>
                                            <InputLabel sx={{ color: 'black', mt: 2 }}>Last Name</InputLabel>
                                            <TextField
                                                fullWidth
                                                name="Last Name"
                                                placeholder="Last Name"
                                                size="small"
                                                sx={{ mt: 2 }}
                                                value={lastName} onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </Box>
                                        <Box sx={{ mb: 2, width: '100%' }}>
                                            <InputLabel sx={{ color: 'black', mt: 2 }}>Phone Number</InputLabel>
                                            {/* <PhoneInput
                                                country={'us'}
                                                value={phoneNumber}
                                                placeholder="Enter phone number"
                                                inputStyle={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '4px',
                                                    border: '1px solid rgba(0, 0, 0, 0.23)',
                                                }}
                                            /> */}
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
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                style={{ width: '100px', margin: '10px 0' }}
                                                onClick={submitUserinfo}
                                            >
                                                Next
                                            </Button>
                                        </Box>
                                    </form>
                                </Box>
                            </Paper>

                        </Box>


                        <br />


                    </>
                );
            //!===============================================================================================================================
            case 4:
                return (
                    <>
                        <Box className="top-header col-12" style={{ display: "flex" }}>
                            <Box className="col-4" style={{ padding: "20px" }}>
                                <img style={{ width: "30px" }} src={logo} alt="" />
                                <b>PMS Solutions</b>
                            </Box>

                            {/* <Box sx={{ width: '85%' }}>
                                            <Stepper activeStep={currentStep} alternativeLabel>
                                                {steps.map((label) => (
                                                    <Step key={label}>
                                                        <StepLabel>{label}</StepLabel>
                                                    </Step>
                                                ))}
                                            </Stepper>
                                        </Box>   */}
                        </Box>
                        {/* <Box
                            backgroundColor={'#f0f0f0'}
                            height={'100vh'}
                            display="flex"
                            alignItems="center"
                           
                            
                            justifyContent="center"
                        >
                            <Paper elevation={3} sx={{ padding: 4, width: '550px',height:'430px', border:'2px solid red',mt:5}}>
                                <Box className="col-12 case4">
                                    <Box className="container">
                                        <Typography variant="h3" sx={{ marginBottom: '20px' }}>
                                            Firm Information
                                        </Typography>
                                        <form>
                                            <Box>
                                                <InputLabel sx={{ color: 'black' }}>Firm Name</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    name="firm name"
                                                    placeholder="Enter firm name"
                                                    size="small"
                                                    sx={{ mt: 2 }}
                                                />
                                            </Box>

                                            <Box className="col-12">
                                                <Box>
                                                    <InputLabel sx={{ color: 'black', mt: 2 }}>Country</InputLabel>
                                                    <Autocomplete
                                                        sx={{ mt: 2 }}
                                                        size="small"
                                                        value={selectedCountryD}
                                                        onChange={(event, newValue) => {
                                                            setSelectedCountry(newValue?.label || "");
                                                            setSelectedCountryD(newValue);
                                                            setSelectedState(null); // Reset selected state when the country changes
                                                        }}
                                                        options={countries}
                                                        getOptionLabel={(option) => option.label}
                                                        renderInput={(params) => (
                                                            <TextField {...params} placeholder="Country" variant="outlined" />
                                                        )}
                                                    />
                                                </Box>

                                                <Box>
                                                    <InputLabel sx={{ color: 'black', mt: 2 }}>State</InputLabel>
                                                    <Autocomplete
                                                        sx={{ mt: 2 }}
                                                        size="small"
                                                        value={stateOptions.find((option) => option.value === selectedState)}
                                                        onChange={(event, newValue) => {
                                                            setSelectedState(newValue?.label || "");
                                                        }}
                                                        options={stateOptions}
                                                        getOptionLabel={(option) => option.label}
                                                        renderInput={(params) => (
                                                            <TextField {...params} placeholder="States" variant="outlined" />
                                                        )}
                                                    />
                                                </Box>
                                            </Box>
                                        </form>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
                                            <Button variant="contained">Next</Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box> */}

                        <Box height={'90vh'} display="flex"
                            alignItems="center"

                            backgroundColor={'#f0f0f0'}
                            justifyContent="center">


                            <Paper elevation={3} sx={{ padding: 4, width: '550px', height: '430px', }}>
                                <Box className="col-12 case4">
                                    <Box className="container">
                                        <Typography variant="h3" sx={{ marginBottom: '20px' }}>
                                            Firm Information
                                        </Typography>
                                        <form>
                                            <Box>
                                                <InputLabel sx={{ color: 'black' }}>Firm Name</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    name="firm name"
                                                    placeholder="Enter firm name"
                                                    size="small"
                                                    sx={{ mt: 2 }}
                                                    value={value} onChange={(e) => setFirmName(e.target.value)}
                                                />
                                            </Box>

                                            <Box className="col-12">
                                                <Box>
                                                    <InputLabel sx={{ color: 'black', mt: 2 }}>Country</InputLabel>
                                                    <Autocomplete
                                                        sx={{ mt: 2 }}
                                                        size="small"
                                                        value={selectedCountryD}
                                                        onChange={(event, newValue) => {
                                                            setSelectedCountry(newValue?.label || "");
                                                            setSelectedCountryD(newValue);
                                                            setSelectedState(null); // Reset selected state when the country changes
                                                        }}
                                                        options={countries}
                                                        getOptionLabel={(option) => option.label}
                                                        renderInput={(params) => (
                                                            <TextField {...params} placeholder="Country" variant="outlined" />
                                                        )}
                                                    />
                                                </Box>

                                                <Box>
                                                    <InputLabel sx={{ color: 'black', mt: 2 }}>State</InputLabel>
                                                    <Autocomplete
                                                        sx={{ mt: 2 }}
                                                        size="small"
                                                        value={stateOptions.find((option) => option.value === selectedState)}
                                                        onChange={(event, newValue) => {
                                                            setSelectedState(newValue?.label || "");
                                                        }}
                                                        options={stateOptions}
                                                        getOptionLabel={(option) => option.label}
                                                        renderInput={(params) => (
                                                            <TextField {...params} placeholder="States" variant="outlined" />
                                                        )}
                                                    />
                                                </Box>
                                            </Box>
                                        </form>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
                                            <Button variant="contained" onClick={submitFerminfo}>Next</Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>
                    </>
                );
            //!===============================================================================================================================

            case 5:
                return (
                    <>
                        <Box className="top-header col-12" style={{ display: "flex" }}>
                            <Box className="col-4" style={{ margin: "20px" }}>
                                <img style={{ width: "30px" }} src={logo} alt="" />
                                <b>PMS Solutions</b>
                            </Box>

                            {/* <Box sx={{ width: '85%' }}>
                                    <Stepper activeStep={currentStep} alternativeLabel>
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </Box>  */}
                        </Box>

                        <Box
                            backgroundColor={'#f0f0f0'}
                            height={'100vh'}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"

                        >
                            <Box className="case5">
                                <Box className=" col-12 case5"></Box>

                                <Box className=" col-12 selectbar  " style={{ margin: " 5% 20%" }}>
                                    <Box style={{ textAlign: "center", marginBottom: "10px", alignItems: "center", justifyContent: "center" }}>Selected Value: {fixedValues[sliderValue]}</Box>
                                    <Box style={{ marginLeft: "20px", display: "flex", justifyContent: "space-between" }}>
                                        {fixedValues.map((value, index) => (
                                            <Box key={index}>{value}</Box>
                                        ))}
                                    </Box>
                                    <Box style={{ marginBottom: "20px" }}>
                                        <input type="range" min="0" max={fixedValues.length - 1} step="1" value={sliderValue} onChange={handleSliderChange} style={{ width: "100%", justifyContent: "center" }} />
                                    </Box>
                                </Box>
                                <Box className=" col-12">
                                    <hr className="hr" />
                                    {sliderValue === 0 && (
                                        <p className="p" style={{ color: "black", marginLeft: "19%" }}>
                                            Please select company size
                                        </p>
                                    )}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 15 }}>


                                    <Box >
                                        <Box className="container selection">
                                            <h2 style={{ marginLeft: "3%" }}>How did you hear about PMS Solutions? </h2>


                                            <Box>
                                                {colors.map((color, index) => (
                                                    <Button variant="contained" key={value} value={colors[selectedButton]} className={`slider-toggle-button ${buttonStates[index] ? "active" : ""}`} onClick={() => handleToggle(index)} style={{ margin: "10px 17px" }}>
                                                        {color}
                                                    </Button>
                                                ))}
                                                <Box style={{ marginTop: "10px" }}>{selectedButton !== null && <p>Sorce Of Information :<bold>{colors[selectedButton]}</bold>  </p>}</Box>
                                            </Box>



                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 7 }}>
                                            <Button variant="contained" className="btn1" onClick={submitFirmDetail}>
                                                Next
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                    </>
                );
            //!===============================================================================================================        
            case 6:
                return (
                    <>
                        <Box className="top-header col-12" style={{ display: "flex" }}>
                            <Box className="col-4" style={{ margin: "20px" }}>
                                <img style={{ width: "30px" }} src={logo} alt="" />
                                <b>PMS Solutions</b>
                            </Box>

                            {/* <Box sx={{ width: '85%' }}>
                                    <Stepper activeStep={currentStep} alternativeLabel>
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </Box>  */}
                        </Box>
                        <Box className="col-12"></Box>

                        <Box className=" col-12 case6">
                            <Box className="container" style={{ padding: "6%", margin: "5% 20%" }}>
                                <h2>Services your firm offers</h2>
                                <Box style={{ margin: "20px 0" }}>
                                    <Grid container spacing={2} >
                                        <Grid item xs={4}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleButtonClick2("TaxPreparation")}
                                                style={{
                                                    backgroundColor: buttonStates2.TaxPreparation ? "#043a77" : "",
                                                    width: '100%',
                                                    margin: "5px 0 "
                                                }}
                                            >
                                                Tax Preparation
                                            </Button>
                                        </Grid>
                                        <Grid item xs={4} sx={{ display: 'flex', gap: 3 }}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleButtonClick2("TaxPlanning")}
                                                style={{
                                                    backgroundColor: buttonStates2.TaxPlanning ? "#043a77" : "",
                                                    width: '100%',
                                                    margin: "5px",
                                                    padding: '5px'
                                                }}
                                            >
                                                Tax Planning
                                            </Button>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Button
                                                variant="contained"
                                                className="btn1"
                                                onClick={() => handleButtonClick2("Advisory")}
                                                style={{
                                                    backgroundColor: buttonStates2.Advisory ? "#043a77" : "",
                                                    width: '100%',
                                                    margin: "5px 0"
                                                }}
                                            >
                                                Advisory
                                            </Button>
                                        </Grid>
                                        {/* Repeat for the rest of the buttons */}
                                        <Grid item xs={4}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleButtonClick2("Resolution")}
                                                style={{
                                                    backgroundColor: buttonStates2.Resolution ? "#043a77" : "",
                                                    width: '100%',
                                                    margin: "5px 0"
                                                }}
                                            >
                                                Resolution
                                            </Button>
                                        </Grid>
                                        <Grid item xs={4} sx={{ display: 'flex', gap: 3 }}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleButtonClick2("Payroll")}
                                                style={{
                                                    backgroundColor: buttonStates2.Payroll ? "#043a77" : "",
                                                    width: '100%',
                                                    margin: "5px",
                                                    padding: '5px'
                                                }}
                                            >
                                                Payroll
                                            </Button>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleButtonClick2("Accounting")}
                                                style={{
                                                    backgroundColor: buttonStates2.Accounting ? "#043a77" : "",
                                                    width: '100%',
                                                    margin: "5px 0"
                                                }}
                                            >
                                                Accounting
                                            </Button>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleButtonClick2("Audit")}
                                                style={{
                                                    backgroundColor: buttonStates2.Audit ? "#043a77" : "",
                                                    width: '100%',
                                                    margin: "5px 0"
                                                }}
                                            >
                                                Audit
                                            </Button>
                                        </Grid>
                                        <Grid item xs={4} sx={{ display: 'flex', gap: 3 }}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleButtonClick2("LawFirm")}
                                                style={{
                                                    backgroundColor: buttonStates2.LawFirm ? "#043a77" : "",
                                                    width: '100%',
                                                    margin: "5px",
                                                    padding: '5px'
                                                }}
                                            >
                                                Law Firm
                                            </Button>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleButtonClick2("Bookkeeping")}
                                                style={{
                                                    backgroundColor: buttonStates2.Bookkeeping ? "#043a77" : "",
                                                    width: '100%',
                                                    margin: "5px 0"
                                                }}
                                            >
                                                Bookkeeping
                                            </Button>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleButtonClick2("Other")}
                                                style={{
                                                    backgroundColor: buttonStates2.Other ? "#043a77" : "",
                                                    width: '100%',
                                                    margin: "5px 0"
                                                }}
                                            >
                                                Other
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box>
                                    <p>{buttonsOn.length > 0 && <p>Services that are Selected: {buttonsOn.join(", ")}</p>}</p>
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
            // !=======================================================================================+================

            case 7:
                return (
                    <Box>
                        <Box className="top-header col-12" style={{ display: "flex" }}>
                            <Box className="col-4" style={{ margin: "20px" }}>
                                <img style={{ width: "30px" }} src={logo} alt="" />
                                <b>PMS Solutions</b>
                            </Box>

                            {/* <Box sx={{ width: '85%' }}>
                                    <Stepper activeStep={currentStep} alternativeLabel>
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </Box>  */}
                        </Box>


                        <Box
                            backgroundColor={'#f0f0f0'}
                            height={'100vh'}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"

                        >
                            <Box className="containerf">

                                <Box className="container selection">
                                    <h1>Your role in the firm </h1>

                                    <Box>
                                        <Box>
                                            <Grid container spacing={1}>
                                                {colors3.map((color, index) => (
                                                    <Grid item xs={4} key={index}>
                                                        <Button
                                                            variant="contained"
                                                            className={`case7toggle-button ${buttonStates3[index] ? "active" : ""}`}
                                                            onClick={() => handleToggle3(index)}
                                                            style={{ margin: "5px 0 0 0", }}
                                                        >
                                                            {color}
                                                        </Button>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                            <Box style={{ marginTop: "10px" }}>
                                                {selectedButton3 !== null && <p>Source Of Information: {colors3[selectedButton3]}</p>}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>{" "}
                                <Button variant="contained" style={{ marginLeft: "10%" }} onClick={submitRole}>
                                    Next
                                </Button>
                            </Box>

                        



                        </Box>
                    </Box>

                );

            // !===============================================================
            case 8:
                return (
                    <>
                        <Box className="col-12" style={{ display: "flex" }}>
                            <Box className="col-4" style={{ margin: "20px" }}>
                                <img style={{ width: "30px" }} src={logo} alt="" />
                                <b>PMS Solutions</b>
                            </Box>
                            {/* <div className="path col-12" style={{ marginRight: "200px" }}>
                <MultiStage steps={totalSteps} currentStepForm={2} stageNames={stageNames} />
              </div> */}
                        </Box>

                        <Box className=" col-12 case8">
                            <Box className="container" style={{ marginRight: "10%" }}>
                                <Box className="firm">
                                    <h2>Firm Settings</h2>

                                    <Box className="firm-info">
                                        <Typography variant="body1">
                                            A powerful, integrated platform <br /> to manage teams, clients, projects.
                                        </Typography>
                                        <Typography variant="body1">
                                            <b>from $50/mo per user</b> <br />
                                            (with a 3-year subscription plan)
                                        </Typography>
                                    </Box>


                                    <h3 style={{ marginTop: "20px" }}>Firm Setting</h3>

                                    <p>choose web URL</p>
                                    <Box style={{ fontSize: "13px" }}>
                                        <p>You will be ale to set up a fully custom domain(without.pms.com) later</p>
                                    </Box>

                                    <Box className="url_container">
                                        <label className="label" id="domin_lable">
                                            .pms.com
                                        </label>
                                        <TextField
                                            id="url_input"
                                            size="small"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="Enter your URL"
                                            fullWidth
                                            variant="outlined"


                                        />

                                    </Box>

                                    <Box className="currency-container">
                                        <Box className="currency">
                                            <label>You cannot Change it later</label>
                                            <br />

                                            <Box>
                                                <InputLabel>Select Currency: </InputLabel>

                                                <Autocomplete
                                                    size="small"
                                                    value={selectedCurrency}
                                                    onChange={(event, newValue) => handleCurrencyChange(newValue)}
                                                    options={currencies}
                                                    getOptionLabel={(option) => option.label || ""}
                                                    renderInput={(params) => <TextField {...params} placeholder="Select a currency" />}
                                                />

                                            </Box>
                                        </Box>
                                        <br />
                                        <Box>
                                            <InputLabel>Select Language: </InputLabel>
                                            <Autocomplete
                                                size="small"
                                                value={selectedLanguage}
                                                onChange={(event, newValue) => handleLanguageChange(newValue)}
                                                options={languages}
                                                getOptionLabel={(option) => option.label || ""}
                                                renderInput={(params) => <TextField {...params} placeholder="Select a language" />}
                                            />
                                            {selectedLanguage && <p>You selected: {selectedLanguage.label}</p>}
                                        </Box>
                                    </Box>
                                    {/* submiturl */}
                                    <Button variant="contained" onClick={submiturl} style={{ margin: "25px 0" }}>
                                        Continue
                                    </Button>

                                </Box>
                            </Box>
                            <Box className="image">
                                <img style={{ height: "400px" }} src={firmsetting} alt="" />
                            </Box>
                        </Box>
                        <br />


                    </>
                );

            //!===========================================================================================================

            case 9:
                return (
                    <>
                        <div className="col-12" style={{ display: "flex" }}>
                            <div className="col-4" style={{ margin: "20px" }}>
                                <img style={{ width: "30px" }} src={logo} alt="" />
                                <b>PMS Solutions</b>
                            </div>

                        </div>
                        <Box
                            height={'90vh'} display="flex"
                            alignItems="center"

                            backgroundColor={'#f0f0f0'}
                            justifyContent="center">
                            <Paper elevation={3} sx={{ padding: 4, width: '550px', height: '400px', }}>
                                <Box>
                                    <Typography textAlign={'center'} variant="h5">Set Password</Typography>

                                    <Box>
                                        <InputLabel sx={{ color: 'black' }}>Password</InputLabel>
                                        <FormControl sx={{ mt: 2, width: '100%' }} variant="outlined">
                                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={inppass.password}
                                                name="password"
                                                onChange={setValP}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            onMouseUp={handleMouseUpPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Password"
                                            />
                                        </FormControl>
                                    </Box>


                                    <Box>
                                        <InputLabel sx={{ color: 'black', mt: 2 }}>Confirm Password</InputLabel>
                                        <FormControl sx={{ mt: 2, width: '100%' }} variant="outlined">
                                            <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-confirm-password"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={inppass.cpassword}
                                                name="cpassword"
                                                onChange={setValP}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle confirm password visibility"
                                                            onClick={handleClickShowConfirmPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            onMouseUp={handleMouseUpPassword}
                                                            edge="end"
                                                        >
                                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Confirm Password"
                                            />
                                        </FormControl>
                                    </Box>


                                    <Box mt={5} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                        <Button variant="contained" onClick={submitPassword}> Continue</Button>
                                    </Box>


                                </Box>

                            </Paper>
                        </Box>



                    </>
                );
            default:
                return null;
        }
    };

    // Handle form submission (placeholder for now)
    const handleSubmit = (event) => {
        event.preventDefault();
        // Add logic for form submission here
    };

    return (
        <Box>
            {renderFormFields()}
        </Box>
    );
}

export default AdminSignup;


