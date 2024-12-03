import React, { useState, useEffect } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";

import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const AccountsDash = () => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const { data } = useParams();
  console.log(data);

  const [accName, setAccName] = useState();

  // eslint-disable-next-line
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    // Fetch URL with environment variable

    const url = `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyid/`;
    fetch(url + data, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        setAccName(result.accountlist.Name);
      })
      .catch((error) => console.error(error));
  }, [data]);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Link to="/clients/accounts">
          <IoArrowBackSharp style={{ fontSize: "25px" }} />
        </Link>
        <FaRegEye style={{ cursor: "pointer", color: "#007bff" }} />
        <Typography sx={{ fontWeight: "bold" }}>{accName}</Typography>
      </Box>
      <Box className="firmtemp">
        <Box
          className="firmtemp-nav"
          sx={{
            display: "flex",

            mt: 5,
            flexWrap: "wrap", // Allow items to wrap to the next line if they overflow
            justifyContent: "space-around", // Space out items evenly
            "& a": {
              // Styling for the NavLink components
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              // color: 'primary.main',
              "&:hover": {
                backgroundColor: "primary.light",
                color: "white",
              },
              "&.active": {
                backgroundColor: "primary.main",
                color: "white",
              },
            },
          }}
        >
          <NavLink to={`/accountsdash/overview/${data}`}> Overview </NavLink>
          <NavLink to={`/accountsdash/info/${data}`}> Info</NavLink>
          <NavLink to={`/accountsdash/docs/${data}/documents`}> Docs</NavLink>
          <NavLink to={`/accountsdash/communication/${data}`}> Communication</NavLink>
          <NavLink to={`/accountsdash/organizers/${data}`}> Organizers</NavLink>
          <NavLink to={`/accountsdash/invoices/${data}/invoice`}> Invoices</NavLink>
          <NavLink to={`/accountsdash/email/${data}`}>Email</NavLink>
          <NavLink to={`/accountsdash/proposals/${data}`}> Proposals & ELs</NavLink>
          <NavLink to={`/accountsdash/notes/${data}`}> Notes</NavLink>
          <NavLink to={`/accountsdash/workflow/${data}/pipelines`}> Workflow</NavLink>
        </Box>
      </Box>
      <Box pl={3} pr={3}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AccountsDash;
