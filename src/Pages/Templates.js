import { Box, Typography } from "@mui/material";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./temp.css";
const Templates = () => {
  return (
    <Box>
      <Box>
        <Typography variant="h4">Firm Templates</Typography>
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
          <NavLink to="/firmtemp/templates/tasks"> Tasks</NavLink>
          <NavLink to="/firmtemp/templates/tags">Tag</NavLink>
          <NavLink to="/firmtemp/templates/emails">Emails</NavLink>
          <NavLink to="/firmtemp/templates/jobs">Jobs</NavLink>
          {/* Client-facing job statuses */}
          <NavLink to="/firmtemp/templates/clientfacing">Client-facing job statuses</NavLink>
          <NavLink to="/firmtemp/templates/pipelines">Pipelines</NavLink>

          <NavLink to="/firmtemp/templates/folders">Folders</NavLink>
          <NavLink to="/firmtemp/templates/chats">Chats</NavLink>

          <NavLink to="/firmtemp/templates/invoices">Invoices</NavLink>
          {/* <NavLink to='/firmtemp/templates/recurring-invoices'  >Recurring invoices</NavLink>
                    <NavLink to='/firmtemp/templates/signatures'  >Signatures</NavLink> */}
          <NavLink to="/firmtemp/templates/proposals">Proposals & Els</NavLink>
          <NavLink to="/firmtemp/templates/organizers">Organizers</NavLink>
        </Box>
      </Box>
      <Box sx={{ pt: 5 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Templates;
