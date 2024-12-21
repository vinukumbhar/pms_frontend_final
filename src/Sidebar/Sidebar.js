
import React, { useState, useEffect, useContext } from "react";
import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, Collapse, Typography, Drawer, Button } from "@mui/material";
import { ChevronLeft, ChevronRight, Brightness4, Brightness7 } from "@mui/icons-material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Outlet, Link } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";
import iconMapping from './icons/index';
import Logo from '../Images/Logo.svg';
import { FaBars } from "react-icons/fa6";
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
import SearchComponent from "./Search";
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

  //   useEffect(() => {
  //     const fetchSidebarData = async () => {
  //       try {
  //         const response = await axios.get(`${SIDEBAR_API}/api/`);
  //         const sidebarData = response.data;
  //         setSidebarItems(sidebarData);
  // console.log("sidebar data",sidebarData)
  //       } catch (error) {
  //         console.error("Error fetching sidebar data:", error);
  //       }
  //     };
  //     fetchSidebarData();
  //   }, []);


  // useEffect(() => {
  const fetchSidebarData = async () => {
    try {
      const response = await axios.get(`${SIDEBAR_API}/api/`);
      let sidebarData = response.data;

      // Retrieve team member data from localStorage
      const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
      const userRole = localStorage.getItem("userRole");

      console.log(storedData)
      if (storedData && storedData.teammember) {
        // const { manageTags } = teamMemberData.teammember;
        const { manageTags, manageServices, managePipelines, manageTemplates, viewAllContacts ,manageProposals,viewallAccounts} = storedData.teammember;

        // Filter or modify sidebar items based on manageTags
        const updatedSidebarData = sidebarData.map((item) => {
          // Remove the `Teams & plans` submenu if the user role is TeamMember
          if (userRole === "TeamMember" && item.label === "Templates" && item.submenu) {
            item.submenu = item.submenu.filter((subItem) => subItem.label !== "Teams & plans");
          }
          if (userRole === "TeamMember" && item.label === "Settings" && item.submenu) {
            item.submenu = item.submenu.filter((subItem) => subItem.label !== "Firm Settings");
          }
          // Remove the `NewTags` submenu if manageTags is false
          if (item.submenu && item.submenu.length > 0) {
            item.submenu = item.submenu.filter(
              (subItem) =>
                !((subItem.label === "Tags" && !manageTags) ||
                  (subItem.label === "Service" && !manageServices) ||
                  (subItem.label === "Pipeline Templates" && !managePipelines) ||
                  (subItem.label === "Firm Templates" && !manageTemplates) ||
                  (subItem.label === "Contacts" && !viewAllContacts) ||
                  (subItem.label === "Proposal&Els" && !manageProposals) ||
                  (subItem.label === "Invoices" && !viewallAccounts)
                )
            );
          }

          // If the parent item is NewTags and manageTags is false, exclude it
          if ((item.label === "NewTags" && !manageTags) ||
            (item.label === "Service" && !manageServices) ||
            (item.label === "Pipeline Templates" && !managePipelines) ||
            (item.label === "Firm Templates" && !manageTemplates)
            (item.label === "Contacts" && !viewAllContacts) ||
            (item.label === "Proposal&Els" && !manageProposals) ||
            (item.label === "Invoices" && !viewallAccounts)
          ) {
            return null;
          }

          return item;
        }).filter(Boolean); // Remove null entries
        setSidebarItems(updatedSidebarData);
        console.log("sidebar", updatedSidebarData)
      }
      else {
        setSidebarItems(sidebarData);
        console.log("side", sidebarData)
      }
    } catch (error) {
      console.error("Error fetching sidebar data:", error);
    }
  };


  // }, []);

  useEffect(() => {
    if (isDrawerOpen) {
      const fetchNewSidebarData = async () => {
        try {
          const response = await axios.get(`${NEW_SIDEBAR_API}/newsidebar/`);
          let NewSidebarData = response.data;
  
          // Retrieve team member data if the user is a team member
          const teamMemberData = JSON.parse(localStorage.getItem("teamMemberData"));
          if (teamMemberData) {
             // Add a flag to indicate restricted access
          // NewSidebarData = NewSidebarData.map(item =>
          //   item.label === "Account" && !teamMemberData.manageAccounts
          //     ? { ...item, restricted: true }
          //     : item
          // );

          NewSidebarData = NewSidebarData.map(item => {
            if (item.label === "Account" && !teamMemberData.manageAccounts) {
              return { ...item, restricted: true };
            }
            if (item.label === "Contact" && !teamMemberData.manageContacts) {
              return { ...item, restricted: true };
            }
            if (item.label === "Jobs" && !teamMemberData.managePipelines) {
              return { ...item, restricted: true };
            }
            return item;
          });
        }
          
  
          setNewSidebarItems(NewSidebarData);
        } catch (error) {
          console.error("Error fetching new sidebar data:", error);
        }
      };
  
      fetchNewSidebarData();
    }
  }, [isDrawerOpen]);


//   useEffect(() => {
//     if (isDrawerOpen) {
//       const fetchNewSidebarData = async () => {
//         try {
//           const response = await axios.get(`${NEW_SIDEBAR_API}/newsidebar/`);
//           let NewSidebarData = response.data;


//  // Retrieve team member data if the user is a team member
//  const teamMemberData = JSON.parse(localStorage.getItem("teamMemberData"));
//  if (teamMemberData) {
//    // Add a flag to disable "Accounts" based on manageAccounts
//    NewSidebarData = NewSidebarData.map(item =>
//      item.label === "Account" && !teamMemberData.manageAccounts
//        ? { ...item, disabled: true }
//        : item
//    );
//  }
//           setNewSidebarItems(NewSidebarData);
//         } catch (error) {
//           console.error("Error fetching new sidebar data:", error);
//         }
//       };

//       fetchNewSidebarData();
//     }
//   }, [isDrawerOpen]);

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
      localStorage.removeItem("teamMemberData");
      localStorage.removeItem("userRole");
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

      console.log("User role:", data.user.role);


      if (data.user.role === "Admin") {
        fetchUserData(data.user.id);
        fetchSidebarData()
        navigate("/");
      } else if (data.user.role === "Client") {
        navigate("/clientDash/home");
      } else if (data.user.role === "TeamMember") {
        localStorage.setItem("userRole", data.user.role);
        fetchUserData(data.user.id);
        fectUsersDatabyUserid(data.user.id)
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
  const [userid, setUserid] = useState("");
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
        console.log("id", result);

        if (result.email) {
          setUserData(truncateString(result.email, maxLength)); // Set a maximum length for userData if email exists
        }
        // console.log(userData)
        setUserid(result._id)


        setUsername(result.username);
      });
  };

  const fectUsersDatabyUserid = (userid) => {
    console.log("janavi", userid)
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(`${LOGIN_API}/admin/teammemberbyuserid/${userid}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {



        // Store result in local storage
        localStorage.setItem("teamMemberData", JSON.stringify(result));


        // Immediately retrieve the stored data
        //  const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
        //  console.log("Stored Team Member Data:", storedData);
        fetchSidebarData();
      })
      .catch((error) => console.error(error));
  }



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
        <Box component="header" sx={{ p: 2, display: 'flex', gap: 3, }} >
          <Box className='bar-icon'>
            <FaBars onClick={handleToggleSidebar} style={{ fontSize: '1.8rem' }} />
          </Box>

          {/* <Button variant="contained" color="success"  > */}
          <FaPlusCircle className="add-icon" onClick={handleDrawerOpen} />
          {/* </Button> */}
          <Box>
            {/* onClick={() => setIsDarkMode(!isDarkMode)} */}
            <IconButton >
              {isDarkMode ? <Brightness7 onClick={toggleTheme} /> : <Brightness4 onClick={toggleTheme} />}
            </IconButton>
          </Box>
          <Box>
            <SearchComponent />
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
          <Box className='sidebar-contents' sx={{ mt: 2, height: '78vh', overflowY: 'auto' }}>
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
                      '.menu-text': {
                        color: '#fff',
                      }
                    },
                  }}>
                    <ListItemIcon sx={{ fontSize: '1.5rem', }} className="menu-icon">
                      {iconMapping[item.icon] ? React.createElement(iconMapping[item.icon]) : null}
                    </ListItemIcon>
                    {!isCollapsed && <ListItemText primary={item.label} sx={{ ml: -2 }} className="menu-text" />}
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
                              '.menu-text': {
                                color: '#fff',
                              }

                            },
                          }}>
                            <ListItemIcon sx={{ fontSize: '1.2rem', }} className="menu-icon" >
                              {iconMapping[subItem.icon] ? React.createElement(iconMapping[subItem.icon]) : null}
                            </ListItemIcon>
                            {!isCollapsed && <ListItemText primary={subItem.label} sx={{ ml: -2 }} className="menu-text" />}
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
        <Box sx={{ width: 300, p: 2, height: '100%' }} className="newSidebar" >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight='bold'>New Sidebar Content</Typography>
            <RxCross2 onClick={handleDrawerClose} style={{ cursor: 'pointer' }} />
          </Box>
          {/* <List>
            {newSidebarItems.map(item => (
              <ListItem key={item._id} component={ Link} to={item.path } className="menu-item" onClick={() => {
               
                  handleNewItemClick(item.label);
                
              }} sx={{
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
                  '.menu-text': {
                    color: '#fff',
                  }
                },
              }}>
                <ListItemIcon sx={{ fontSize: '1.5rem', color: '#2c85de' }} className="menu-icon">
                  {iconMapping[item.icon] ? React.createElement(iconMapping[item.icon]) : null}
                </ListItemIcon>
                <ListItemText primary={item.label} className="menu-text" />
              </ListItem>
            ))}
          </List> */}
       <List>
  {newSidebarItems.map(item => (
    <ListItem
      key={item._id}
      component={Link}
      to={item.path}
      className="menu-item"
      onClick={e => {
        if (item.restricted) {
          e.preventDefault(); // Prevent navigation
          toast.error("Access to this feature is restricted.");
        } else {
          handleNewItemClick(item.label);
        }
      }}
      sx={{
        mt: 1, // margin-top: 8px
        borderRadius: '10px',
        color: 'black',
        transition: 'background-color 0.3s, color 0.3s',
        '&:hover': {
          color: item.restricted ? 'grey' : '#fff',
          backgroundColor: item.restricted ? '' : '#0000ff',
          '.menu-icon': {
            color: item.restricted ? 'grey' : '#fff',
          },
          '.menu-text': {
            color: item.restricted ? 'grey' : '#fff',
          },
        },
      }}
    >
      <ListItemIcon
        sx={{ fontSize: '1.5rem', color: item.restricted ? 'grey' : '#2c85de' }}
        className="menu-icon"
      >
        {iconMapping[item.icon] ? React.createElement(iconMapping[item.icon]) : null}
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        className="menu-text"
        sx={{ color: item.restricted ? 'grey' : 'inherit' }}
      />
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


