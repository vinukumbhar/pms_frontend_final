
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton, TextField, InputLabel, FormControl, MenuItem, Select, Checkbox, Link, Button, } from '@mui/material';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import logo from '../Images/logoAdmin.png';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import { NavLink } from "react-router-dom";
import './AdminLogin.css'
import android from '../Images/android.png';
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import apple from '../Images/apple.png';
import Cookies from "js-cookie";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));
const LeftItem = styled(Item)({
    backgroundColor: 'rgb(58,145,245)',
    color: '#fff',
    height: '100vh',

});

const RightItem = styled(Item)({
    backgroundColor: '#f0f0f0',
    color: 'black',
    height: '100vh',
    overflowY: 'auto',
});


export default function AdminLogin() {

    const history = useNavigate();
    const [inpval, setInpval] = useState({
        email: "",
        password: "",
        expiryTime: "",
    });


    const setVal = (e) => {

        const { name, value } = e.target;

        setInpval(() => {
            return {
                ...inpval,
                [name]: value,
            };
        });
    };



    const loginuser = async (e) => {
        console.log(inpval)
        e.preventDefault();
        const { email, password, expiryTime } = inpval;

        if (!email) {
            toast.error("Email is required!");
            return;
        } else if (!email.includes("@")) {
            toast.error("Invalid email format!");
            return;
        }

        if (!password) {
            toast.error("Password is required!");
            return;
        } else if (password.length < 6) {
            toast.error("Password must be at least 6 characters long!");
            return;
        }

        if (!expiryTime) {
            toast.error("Please select the expiration time!");
            return;
        }

        try {


            const url = "http://127.0.0.1:8880/common/login/generatetoken/";
            const data = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    expiryTime,
                }),
            });

            const res = await data.json();
            console.log(res);

            if (res.status === 200) {
                localStorage.setItem("usersdatatoken", res.result.token);
                Cookies.set("userToken", res.result.token);
                history("/");
                setInpval({ ...inpval, email: "", password: "" });

                Cookies.set("userToken", res.result.token);
            } else if (res.status === 400) {
                toast.error("Invalid email or password!");
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } catch (error) {
            // console.error("Error:", error);
            // toast.error("An error occurred. Please try again.");
        }
    };


    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} columns={16}>
                <Grid item xs={8} sx={{ display: { xs: 'none', sm: 'block' } }} >
                    <LeftItem  >
                        <Box mt={2} className="login-logo" >
                            <img src={logo} alt="" style={{ height: "95px", }} />
                        </Box>

                        <Box textAlign="center" mb={5}>
                            <Typography variant="h2" fontSize="35px">Welcome Back Admin</Typography>

                            <Box mt={3} mb={5} px={6}>
                                <Typography variant="body1" fontSize="20px">
                                    Our tax consultancy services offer expert guidance on navigating complex tax landscapes. From personalized tax planning to compliance assistance, we ensure your financial strategies align with current regulations. Trust us to maximize your deductions, minimize liabilities, and provide clarity in the ever-evolving tax environment. Your financial success is our priority.
                                </Typography>
                            </Box>

                            <Typography variant="body1" fontSize="22px" fontWeight={300} mb={5}>
                                "Please log in to access your account."
                            </Typography>

                            <Grid container justifyContent="center" spacing={2}>
                                {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon,].map((Icon, index) => (
                                    <Grid item key={index}>
                                        <IconButton color="primary" >
                                            <Icon sx={{ fontSize: 40, color: '#fff', mt: 2 }} />
                                        </IconButton>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </LeftItem>
                </Grid>
                <Grid item xs={16} sm={8}>
                    <RightItem className='right-container' >
                        <Box className="login-right col-6" sx={{textAlign:'left',padding:'10px',mt:2}}>
                            <Box className="login-logo" sx={{ margin: 0 }}>
                                <img src={logo} alt="" style={{ height: "95px" }} />
                            </Box>

                            <Box  >
                                <Typography textAlign={"center"} variant='h4'>Account Login</Typography>
                            </Box>

                            <Box>
                                <Box>
                                    <InputLabel sx={{ color: 'black' }}>Email</InputLabel>
                                    <TextField

                                        fullWidth
                                        name="email"
                                        placeholder="Enter Your Email"
                                        size="small"
                                        sx={{ mt: 2 }}
                                        value={inpval.email}
                                        onChange={setVal}

                                        id="email"

                                    />
                                </Box>

                                <Box mt={2}>
                                    {/* <InputLabel sx={{ color: 'black' }}>Password</InputLabel> */}
                                    <FormControl sx={{ mt: 2, width: '100%' }} variant="outlined">
                                        <Typography htmlFor="outlined-adornment-password" mb={2}>Password</Typography>
                                        <OutlinedInput
                                            // id="outlined-adornment-password"
                                            name="password"
                                            placeholder="password"
                                            size="small"
                                            value={inpval.password}
                                            onChange={setVal}
                                            type={showPassword ? 'text' : 'password'}
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
                                        />
                                    </FormControl>

                                    <Box sx={{ textAlign: 'left', mb: '3%', fontSize: '12px', mt: 1 }}>
                                        <Link component={NavLink} to="/forgotpass" sx={{ color: 'cornflowerblue', textDecoration: 'none' }}> 
                                        Forgot Password?
                                        </Link>
                                    </Box>
                                </Box>


                                <Box mt={2}>
                                    <FormControl fullWidth sx={{ mt: 2 }}>
                                        <Typography sx={{ color: 'black' }}>Stay signed in for</Typography>
                                        <Select
                                            size='small'
                                           margin='normal'
                                            value={inpval.expiryTime}
                                            onChange={setVal}
                                            name="expiryTime"
                                            sx={{
                                                // padding: "8px 12px",
                                                border: "2px solid rgb(100, 149, 237)",
                                                borderRadius: "10px"
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>Select</em>
                                            </MenuItem>
                                            <MenuItem value="1min">1 minute</MenuItem>
                                            <MenuItem value="30min">30 minutes</MenuItem>
                                            <MenuItem value="4hours">4 hours</MenuItem>
                                            <MenuItem value="8hours">8 hours</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>




                                <Box display="flex" mt={2} alignItems={'center'}>
                                    <Checkbox id="terms" />

                                    <Typography fontSize="14px" color="#696969" component="label" htmlFor="terms">
                                        Agree to{' '}
                                        <Link href="https://policies.google.com/terms?hl=en-US" color="rgb(58, 145, 245)" underline="none">
                                            Conditions
                                        </Link>
                                    </Typography>
                                </Box>

                                <Box mt={2}>
                                    <Button onClick={loginuser} variant='contained'>
                                        Login
                                    </Button>
                                </Box>

                                <Box mt={2} className="col-12">
                                    <Typography variant="body">
                                        {"Don't have a PMS solutions admin portal Account? "}
                                        <Link
                                            component={NavLink}
                                            to="/signup"
                                            sx={{ color: "rgb(100, 149, 237)", textDecoration: "none" }}
                                        >
                                          Admin Sign Up
                                        </Link>
                                    </Typography>
                                    <br />
                                    <Typography variant="body" sx={{ mt: 1 }}>
                                        {"Don't have a PMS solutions client portal Account? "}
                                        <Link
                                            component={NavLink}
                                            to="/signup"
                                            sx={{ color: "rgb(100, 149, 237)", textDecoration: "none" }}
                                        >
                                            Sign Up
                                        </Link>
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", }}>
                                    <Box className="storeBtn" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Box className="playstore col-12">
                                            <NavLink to="https://play.google.com/store/apps/details?id=com.linkedin.android&hl=en_IN&gl=US">
                                                <img style={{ width: "120px" }} src={android} alt="Logo" />
                                            </NavLink>
                                        </Box>
                                        <br />
                                        <Box className="appstore col-12">
                                            <NavLink to="https://apps.apple.com/us/app/linkedin-network-job-finder/id288429040">
                                                <img style={{ width: "120px" }} src={apple} alt="Logo" />
                                            </NavLink>
                                        </Box>
                                    </Box>
                                </Box>

                            </Box>

                        </Box>

                    </RightItem>
                </Grid>
            </Grid>
        </Box>
    );
}
