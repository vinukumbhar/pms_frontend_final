// SidebarData.js
import { FaHome, FaUsers, FaBuilding, FaUser, FaKey } from 'react-icons/fa';
import { FiSettings } from "react-icons/fi";
import { MdAccountBalance } from "react-icons/md";

export const sidebarData = [
  {
    label: 'Home',
    path: '/home',
    icon: <FaHome />,
  },
  {
    label: 'About',
    icon: <MdAccountBalance />,
    submenu: [
      {
        label: 'Team',
        path: '/team',
        icon: <FaUsers />,
      },
      {
        label: 'Company',
        path: '/company',
        icon: <FaBuilding />,
      },
    ],
  },
  {
    label: 'Settings',
    icon: <FiSettings />,
    submenu: [
      {
        label: 'Profile',
        path: '/profile',
        icon: <FaUser />,
      },
      {
        label: 'Account',
        path: '/account',
        icon: <FaKey />,
      },
    ],
  },
];
