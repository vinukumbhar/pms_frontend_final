import React, { useState, useEffect } from "react";
import { Container, Button, Box, Typography, Divider, Paper, TextField, IconButton, FilledInput, OutlinedInput, Input, InputLabel, InputAdornment, FormHelperText, FormControl } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import "./ActiveAccount.css";

const ActiveAccounts = () => {
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
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

  /// Integration
  const { _id, token } = useParams();
  console.log(_id);
  console.log(token);
  const navigate = useNavigate();

  const [values, setValues] = useState();
  const [passShow, setPassShow] = useState(false);
  const [cpassShow, setCPassShow] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchidwiseData();
  }, []);

  //get id wise template Record

  const fetchidwiseData = async () => {
    try {
      const url = `${LOGIN_API}/admin/teammember/${_id}`;
      console.log(url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();

      setValues(data.teamMember);
      setFirstName(data.teamMember.firstName);
      setMiddleName(data.teamMember.middleName);
      setLastName(data.teamMember.lastName);
      setEmail(data.teamMember.email);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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

  const [firstNameValidation, setFirstNameValidation] = useState("");
  const [lastNameValidation, setLastNameValidation] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("");
  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState("");

  const submitvalidation = async (e) => {
    e.preventDefault();
    // Validation for First Name
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
    if (password === "") {
      setPasswordValidation("Password is compalsary");
    } else {
      setPasswordValidation("");
    }

    // Validation for Phone Number
    if (confirmPassword === "") {
      setConfirmPasswordValidation("Confirm Password is compalsary");
    } else {
      setConfirmPasswordValidation("");
    }

    // If all validations pass, proceed to next step
    if (firstName && lastName && password && confirmPassword) {
      UserValidToken();
    }
  };

  const UserValidToken = async () => {
    validatePassword();
    const url = `${LOGIN_API}/common/resetpassword/verifytoken/`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await res.json();
    console.log(data);
    if (data.message === "Access granted") {
      console.log("userVerify");
      const id = data.user.id;
      console.log(id);
      getuser();
      handleSubmit();
    } else if (data.message === "Invalid token") {
      toast.error("Time Expired!");
      //ToDo send to resetpasswordlink
    }
  };

  const handleSubmit = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      // password: password,
      // cpassword: confirmPassword
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    console.log(raw);

    fetch(`${LOGIN_API}/admin/teammember/${_id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        // Show success toast
        toast.success("Team Member activated successfully!");
        console.log(result);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      })
      .catch((error) => {
        // Show error toast
        toast.error("Failed to activate Team Member. Please try again.");
        console.error(error);
      });
  };
  const getuser = async () => {
    try {
      const myHeaders = new Headers();
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(`${LOGIN_API}/common/user/email/getuserbyemail/${email}`, requestOptions);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      console.log(data);

      if (data.message === "User retrieved successfully" && data.user.length > 0) {
        const userId = data.user[0]._id; // Access the _id field of the first user
        console.log(userId);
        updatePassword(userId);
      } else {
        console.error("No user found in the response");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  //************************ */
  ///Update Password
  const updatePassword = (_id, token) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("id", _id);
    myHeaders.append("Authorization", token);

    console.log(token);
    const raw = JSON.stringify({
      password: confirmPassword,
    });
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const urlupdateuserpassword = `${LOGIN_API}/common/user/password/updateuserpassword/`;
    const baseUrl = urlupdateuserpassword;
    const url = new URL(baseUrl);
    console.log(url);
    // url.searchParams.append("id", _id);
    // url.searchParams.append("token", token);

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then((result) => {
        console.log(result);
        toast("Password Updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating password:", error.message);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Paper elevation={3} sx={{ width: "100%", p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Set Up Your Account
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ mb: 2 }}>
            To activate your account, please fill in the requested information.
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <TextField value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" fullWidth margin="normal" size="small" variant="outlined" sx={{ backgroundColor: "#fff" }} />
            <Box style={{ color: "red", fontSize: "9px" }}>{firstNameValidation}</Box>

            <TextField placeholder="Middle Name" value={middleName} onChange={(e) => setMiddleName(e.target.value)} fullWidth margin="normal" size="small" variant="outlined" sx={{ backgroundColor: "#fff" }} />

            <TextField value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" fullWidth margin="normal" size="small" variant="outlined" sx={{ backgroundColor: "#fff" }} />
            <Box style={{ color: "red", fontSize: "9px" }}>{lastNameValidation}</Box>
          </Box>

          <Box display={"flex"} alignItems={"center"} gap={1} mt={3}>
            <Box>
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  size="small"
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange} // onChange should be on the input, not IconButton
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} onMouseUp={handleMouseUpPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <div style={{ color: "red", fontSize: "9px" }}>{passwordValidation}</div>
            </Box>

            <Box>
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password"> Confirm Password</InputLabel>
                <OutlinedInput
                  size="small"
                  id="outlined-adornment-password"
                  type={showConfirmPassword ? "text" : "password"}
                  // onChange = {handleConfirmPasswordChange}
                  onChange={handleConfirmPasswordChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={handleClickConfirmShowPassword} onMouseDown={handleMouseDownConfirmPassword} onMouseUp={handleMouseUpConfirmPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <div style={{ color: "red", fontSize: "9px" }}>{confirmPasswordValidation}</div>
            </Box>
          </Box>
          <div className="password-validation-checklist">
            <p>Your password must contain:</p>
            <ul>
              <li className={password.length >= 8 ? "valid" : ""}>
                <IoIosCheckmarkCircleOutline className="check-icon" /> Minimum 8 characters
              </li>
              <li className={/\d/.test(password) ? "valid" : ""}>
                <IoIosCheckmarkCircleOutline className="check-icon" /> At least one number
              </li>
              <li className={/[a-zA-Z]/.test(password) ? "valid" : ""}>
                <IoIosCheckmarkCircleOutline className="check-icon" /> At least one letter
              </li>
            </ul>
          </div>

          <Box mt={3} float={"right"}>
            <Button onClick={submitvalidation} variant="contained">
              Submit
            </Button>
          </Box>
        </Paper>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default ActiveAccounts;
