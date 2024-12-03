
import React, { useState, useEffect,useContext  } from "react";
import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, Collapse, Typography, Drawer, Button } from "@mui/material";
import { ChevronLeft, ChevronRight, Brightness4, Brightness7 } from "@mui/icons-material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Outlet, Link } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";
import iconMapping from './icons/index';
import Logo from '../Images/Logo.svg';
import { FaBars  } from "react-icons/fa6";
// import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import ContactForm from '../Contact/ContactForm';
import AccountForm from '../Contact/AccountForm';
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { AiOutlineLogout } from "react-icons/ai";
import { LoginContext } from '../Sidebar/Context/Context'
import user from "../Images/user.jpg";
function Sidebar() {
  const navigate = useNavigate();
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const SIDEBAR_API = process.env.REACT_APP_SIDEBAR_URL;
  const NEW_SIDEBAR_API = process.env.REACT_APP_SIDEBAR_URL;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarItems, setSidebarItems] = useState([]);
  const [newSidebarItems, setNewSidebarItems] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [rightDrawerContent, setRightDrawerContent] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Apply dark mode based on the state
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsSidebarVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const response = await axios.get(`${SIDEBAR_API}/api/`);
        setSidebarItems(response.data);
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
      }
    };

    fetchSidebarData();
  }, []);

  useEffect(() => {
    if (isDrawerOpen) {
      const fetchNewSidebarData = async () => {
        try {
          const response = await axios.get(`${NEW_SIDEBAR_API}/newsidebar/`);
          setNewSidebarItems(response.data);
        } catch (error) {
          console.error("Error fetching new sidebar data:", error);
        }
      };

      fetchNewSidebarData();
    }
  }, [isDrawerOpen]);

  const handleToggleSidebar = () => {
    if (isSmallScreen) {
      setIsSidebarVisible(!isSidebarVisible);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleToggleSubmenu = (path, label) => {
    setOpenMenu(openMenu === path ? null : path);
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleNewDrawerClose = () => {
    setIsRightDrawerOpen(false);
  };
  const handleNewItemClick = (label) => {
    if (label === 'Account' || label === 'Contact') {
      setRightDrawerContent(label);
      setIsRightDrawerOpen(true);
    }
  };
  const [theme, setTheme] = useState("light-theme");
  const toggleTheme = () => {
    if (theme === "dark-theme") {
      setTheme("light-theme");
    } else {
      setTheme("dark-theme");
    }
  };
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);


   //Logout
   const { logindata, setLoginData } = useContext(LoginContext);

   const history = useNavigate();
 
   const logoutuser = async () => {
     let token = localStorage.getItem("usersdatatoken");
     const url = `${LOGIN_API}/common/login/logout/`;
 
     const requestOptions = {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         Authorization: token,
       },
     };
 
     const res = await fetch(url, requestOptions);
 
     const data = await res.json();
 
     if (data.status === 200) {
       console.log("user logout");
       localStorage.removeItem("usersdatatoken");
       Cookies.remove("userToken");
       setLoginData(false);
 
       history("/login");
     } else {
       console.log("error");
     }
   };
   const [data, setData] = useState(false);
  const [loginsData, setloginsData] = useState("");



  const DashboardValid = async () => {
    let token = localStorage.getItem("usersdatatoken");
    // Cookies.set("userToken", res.result.token); // Set cookie with duration provided
    // console.log(token);
    const url = `${LOGIN_API}/common/login/verifytoken/`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    //console.log(token);

    const data = await res.json();
    //console.log(data);
    if (data.message === "Invalid token") {
      // console.log("error page");
      navigate("/login");
    } else {
      // console.log("user verify");
      setLoginData(data);
      setloginsData(data.user.id);
      if (data.user.role === "Admin") {
        fetchUserData(data.user.id);
        navigate("/");
      } else if (data.user.role === "Client") {
        navigate("/clientDash/home");
      } else if (data.user.role === "TeamMember") {
        fetchUserData(data.user.id);
        navigate("/");
      } else {
        toast.error("You are not valid user.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    }
  };
  useEffect(() => {
    DashboardValid();
    setData(true);
  }, []);

  const [userData, setUserData] = useState("");
  const [username, setUsername] = useState("");

  const fetchUserData = async (id) => {
    const maxLength = 15;
    const myHeaders = new Headers();

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url + loginsData, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log("id", result);
        if (result.email) {
          setUserData(truncateString(result.email, maxLength)); // Set a maximum length for userData if email exists
        }
        // console.log(userData)
        setUsername(result.username);
      });
  };
  const truncateString = (str, maxLength) => {
    if (str && str.length > maxLength) {
      return str.substring(0, maxLength) + "..."; // Truncate string if it exceeds maxLength
    } else {
      return str;
    }
  };
  return (
    <div className="grid-container">
      <header className="header" >
        <Box component="header" sx={{ p: 2, display: 'flex', gap: 3,  }} >
          <Box className='bar-icon'>
            <FaBars onClick={handleToggleSidebar} style={{ fontSize: '1.8rem' }} />
          </Box>
         
          {/* <Button variant="contained" color="success"  > */}
          <FaPlusCircle   className="add-icon"  onClick={handleDrawerOpen}/>
          {/* </Button> */}
          <Box>
            {/* onClick={() => setIsDarkMode(!isDarkMode)} */}
            <IconButton >
              {isDarkMode ? <Brightness7 onClick={toggleTheme}/> : <Brightness4 onClick={toggleTheme}/>}
            </IconButton>
          </Box>
        </Box>
      </header>
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isSidebarVisible ? 'show' : ''}`}>
        <IconButton
          onClick={handleToggleSidebar}
          className="toggle-button"
        >
          {isCollapsed ? <ChevronRight className="toggle-icon" /> : <ChevronLeft className="toggle-icon" />}
        </IconButton>
        <Box
          component="aside"
          style={{
            width: isCollapsed ? '50px' : '225px',
            padding: 5,
            transition: 'width 0.3s',
          }}
        >
          <Box sx={{ pt: 3, display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 1 }}>
            <img src={Logo} alt="logo" style={{ height: "40px", display: 'block' }} />
            {!isCollapsed && (
              <Typography variant="h5" className="company-name-text">SNP</Typography>
            )}
          </Box>
          <Box className='sidebar-contents' sx={{ mt: 2 }}>
            <List sx={{ cursor: 'pointer' }}>
              {sidebarItems.map(item => (
                <Box key={item._id}>
                  <ListItem onClick={() => handleToggleSubmenu(item._id, item.label)} component={Link} to={item.path} className="menu-item" sx={{
                    mt: 1, // margin-top: 8px
                    borderRadius: '10px',
                    // color: 'black',

                    transition: 'background-color 0.3s, color 0.3s',
                    '&:hover': {
                      color: '#fff',
                      backgroundColor: '#0000ff',

                      '.menu-icon': {
                        color: '#fff',
                      },
                      '.menu-text':{
                        color: '#fff',
                      }
                    },
                  }}>
                    <ListItemIcon sx={{ fontSize: '1.5rem', }} className="menu-icon">
                      {iconMapping[item.icon] ? React.createElement(iconMapping[item.icon]) : null}
                    </ListItemIcon>
                    {!isCollapsed && <ListItemText primary={item.label} sx={{ ml: -2 }} className="menu-text"/>}
                    {!isCollapsed && item.submenu.length > 0 && (
                      <ListItemIcon sx={{ justifyContent: 'end' }}>
                        {openMenu === item._id ? <ExpandLess className="menu-icon" /> : <ExpandMore className="menu-icon" />}
                      </ListItemIcon>
                    )}
                  </ListItem>
                  {item.submenu.length > 0 && (
                    <Collapse in={openMenu === item._id}>
                      <List component="div" disablePadding>
                        {item.submenu.map(subItem => (
                          <ListItem key={subItem.path} component={Link} to={subItem.path} className="menu-item" sx={{
                            mt: 1, // margin-top: 8px
                            borderRadius: '10px',
                            color: 'black',
                            pl: 4,
                            transition: 'background-color 0.3s, color 0.3s',
                            '&:hover': {
                              color: '#fff',
                              backgroundColor: '#0000ff',
                              '.menu-icon': {
                                color: '#fff',
                              },
                              '.menu-text':{
                                color: '#fff',
                              }

                            },
                          }}>
                            <ListItemIcon sx={{ fontSize: '1.2rem', }} className="menu-icon" >
                              {iconMapping[subItem.icon] ? React.createElement(iconMapping[subItem.icon]) : null}
                            </ListItemIcon>
                            {!isCollapsed && <ListItemText primary={subItem.label} sx={{ ml: -2 }} className="menu-text"/>}
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </Box>
              ))}
            </List>
            <div className="bottom-content">
              <ul>
                <li>
                  <Link to="#" className="logout-link">
                    <div className="info" >
                      <div>
                        <img src={user} alt="user" className="user-icon" style={{ height: "50px", width: "50px" }} />
                      </div>
                      <span className="hidden-text" >
                        <b>{username}</b>
                        <h6>{userData}</h6>
                      </span>

                      <div>
                      <AiOutlineLogout  
                        className="logout-icon"
                        onClick={() => {
                          logoutuser();
                        }}
                      />
                    </div>
                    </div>

                 
                  </Link>
                </li>
               
              </ul>
            </div>
          </Box>
        </Box>
      </aside>
      <main className="main">
        <Box
          component="main"
          sx={{
            // padding: 1,
            // border: '2px solid red',

          }}
        >
          <Outlet />
        </Box>
      </main>
      <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose} >
        <Box sx={{ width: 300, p: 2,height:'100%' }} className="newSidebar" >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight='bold'>New Sidebar Content</Typography>
            <RxCross2 onClick={handleDrawerClose} style={{ cursor: 'pointer' }} />
          </Box>
          <List>
            {newSidebarItems.map(item => (
              <ListItem key={item._id} component={Link} to={item.path} className="menu-item" onClick={() => handleNewItemClick(item.label)} sx={{
                mt: 1, // margin-top: 8px
                borderRadius: '10px',
                color: 'black',

                transition: 'background-color 0.3s, color 0.3s',
                '&:hover': {
                  color: '#fff',
                  backgroundColor: '#0000ff',

                  '.menu-icon': {
                    color: '#fff',
                  },
                  '.menu-text':{
                    color: '#fff',
                  }
                },
              }}>
                <ListItemIcon sx={{ fontSize: '1.5rem', color: '#2c85de' }} className="menu-icon">
                  {iconMapping[item.icon] ? React.createElement(iconMapping[item.icon]) : null}
                </ListItemIcon>
                <ListItemText primary={item.label} className="menu-text"/>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Drawer anchor="right" open={isRightDrawerOpen} onClose={handleNewDrawerClose}
        classes={{ paper: 'custom-right-drawer' }}>
        <Box sx={{ width: isSmallScreen ? '100vw' : 650 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          </Box>
          {rightDrawerContent === 'Account' && <AccountForm handleNewDrawerClose={handleNewDrawerClose} handleDrawerClose={handleDrawerClose} />}
          {rightDrawerContent === 'Contact' && <ContactForm handleNewDrawerClose={handleNewDrawerClose} handleDrawerClose={handleDrawerClose} />}
        </Box>
      </Drawer>
    </div>
  );
}

export default Sidebar;


