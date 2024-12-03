import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// import "./setpassword.css"

import { Button, Box, Typography, OutlinedInput, InputAdornment, Paper, Container } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import micropms from "../Images/micropms.png";
function ResetPassword() {
  //  const API_KEY = process.env.REACT_APP_API_IP;

  // const { id, token } = useParams()
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const history = useNavigate();

  const [userEmail, setUserEmail] = useState("");

  const getuser = (id) => {
    console.log(id);
    const myHeaders = new Headers();

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/`;
    fetch(url + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const email = result.email;
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
          email: email,
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        const url = `${LOGIN_API}/passwordupdate/`;
        fetch(url, requestOptions)
          .then((response) => response.json())
          .then((result) => console.log(result))
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  };

  console.log(userEmail); // This will log the current value of userEmail

  ///Update Password
  const updatePassword = (id, token) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("id", id);
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
    const baseUrl = `${LOGIN_API}/common/user/password/updateuserpassword/`;

    const url = new URL(baseUrl);

    url.searchParams.append("id", id);
    url.searchParams.append("token", token);

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);

        getuser(id);
        Cookies.remove("resetpasstoken");
        localStorage.removeItem("resetpasstoken");
        toast("Password Updated successfully.");

        // Handle success, if needed
      })
      .catch((error) => {
        console.error("Error updating password:", error.message);
        // Handle error, if needed
      });
  };

  const UserValidToken = async () => {
    let token = localStorage.getItem("resetpasstoken");
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
      const id = data.user.id;
      console.log(id);
      updatePassword(id, token);

      //ToDo send to login page
    } else if (data.message === "Invalid token") {
      console.log("Time Expired");
      toast.error("Time Expired!");
      //ToDo send to resetpasswordlink
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleConfirmPasswordPaste = (e) => {
    const pastedText = e.clipboardData.getData("text");
    setConfirmPassword(pastedText);
  };

  const handleSubmit = () => {
    history("/login");

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    } else {
      UserValidToken();
      toast.success("Password Updated successfully");
    }
  };

  return (
    <>
      {/* <div className="setpassword-container col-12" style={{ display: 'flex', justifyContent: 'center', marginTop: '5%' }}>
                <div className='password-sub-container col-12 ' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', maxWidth: '600px' }}>
                    <div className='pagetitle' style={{ fontSize: '30px', textAlign: 'center' }}>
                        <h1 style={{ marginBottom: '5%', fontSize: '38px', textAlign: 'center' }}>Set Password</h1>
                    </div>
                    <div className="form-password col-9" style={{ marginBottom: '6%', marginTop: '5%' }}>
                        <div className="password-input" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <label htmlFor="password">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                style={{ padding: "8px 12px", width: "100%", border: "2px solid rgb(100, 149, 237)", borderRadius: "10px", margin: "10px 0" }}
                            />
                            <div style={{ position: 'absolute', top: '60%', transform: 'translateY(-50%)', right: '20px', cursor: 'pointer',border:'1px solid red' }} onClick={handleTogglePasswordVisibility}>
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </div>
                        </div>
                    </div>
                    <div className="formpassword col-9">
                        <div className="password-input" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                onPaste={handleConfirmPasswordPaste} // Allow pasting
                                style={{ padding: "8px 12px", width: "100%", border: "2px solid rgb(100, 149, 237)", borderRadius: "10px", margin: "10px 0" }}
                            />
                            <div style={{ position: 'absolute', top: '80%', transform: 'translateY(-50%)', right: '20px', cursor: 'pointer' }} onClick={handleTogglePasswordVisibility}>
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </div>
                        </div>
                    </div>
                    <div className='password-btn col-9'>
                        <div className='btn1' style={{ justifyContent: 'left', }}>
                            <button style={{ marginLeft: '0', background: "rgb(100, 149, 237)", marginTop: '2%', border: "none", borderRadius: '10px', width: '80px', height: '30px', color: 'white' }}
                                onClick={() => {
                                    handleSubmit()
                                }}>Continue</button>
                        </div>
                    </div>
                </div>
            </div> */}
      <Box sx={{ padding: "10px 15px", display: "flex", alignItems: "center" }}>
        <img src={micropms} style={{ height: "40px" }} />
        <Typography variant="h6" sx={{ fontFamily: "sans-serif", color: "black", fontSize: "20px", fontWeight: "700" }}>
          PMS Solutions
        </Typography>
      </Box>
      <Container>
        <Box className="setpassword-container" sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 20 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {" "}
            {/* Parent Container */}
            <Box className="password-sub-container" sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", maxWidth: "600px", width: "100%" }}>
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
              <Box className="form-password" sx={{ marginBottom: "6%", marginTop: "5%", width: "75%" }}>
                <Typography htmlFor="password">Password</Typography>
                <OutlinedInput
                  type={showPassword ? "text" : "password"}
                  value={password}
                  size="small"
                  placeholder="Password"
                  onChange={handlePasswordChange}
                  sx={{ width: "100%", borderRadius: "10px", margin: "10px 0" }}
                  endAdornment={
                    <InputAdornment position="end" sx={{ cursor: "pointer" }} onClick={handleTogglePasswordVisibility}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </InputAdornment>
                  }
                />
              </Box>
              <Box className="form-password" sx={{ width: "75%" }}>
                <Typography htmlFor="confirmPassword">Confirm Password</Typography>
                <OutlinedInput
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  size="small"
                  placeholder="Confirm Password"
                  onChange={handleConfirmPasswordChange}
                  onPaste={handleConfirmPasswordPaste} // Allow pasting
                  sx={{ width: "100%", borderRadius: "10px", margin: "10px 0" }}
                  endAdornment={
                    <InputAdornment position="end" sx={{ cursor: "pointer" }} onClick={handleTogglePasswordVisibility}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </InputAdornment>
                  }
                />
              </Box>
              <Box className="password-btn" sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2%", width: "100%", margin: 2 }}>
                <Button variant="contained" onClick={handleSubmit}>
                  Continue
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default ResetPassword;
