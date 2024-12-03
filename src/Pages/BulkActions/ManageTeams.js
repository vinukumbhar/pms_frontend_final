import React, { useEffect, useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Button, Typography, Box } from "@mui/material";
import { toast } from "react-toastify";

const ManageTeams = ({ selectedAccounts, onClose }) => {
  const USER_API = process.env.REACT_APP_USER_URL;
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const [userData, setUserData] = useState([]);
  const [tagActions, setTagActions] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const url = `${USER_API}/api/auth/users`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleActionChange = (userId, newValue) => {
    setTagActions((prevActions) => ({
      ...prevActions,
      [userId]: newValue,
    }));
  };

  const handleCancel = () => {
    if (onClose) {
      onClose(); // Ensures onClose is a valid function before calling it
    }
  };

  //Separate tags by their actions
  const assignToAllTeamMember = Object.keys(tagActions).filter((userId) => tagActions[userId] === "Assign to all");

  const removeFromAllTeamMember = Object.keys(tagActions).filter((userId) => tagActions[userId] === "Remove from all");

  // Format the final output with separate tag arrays
  const formattedOutput = {
    assignToAllTeamMember, // Tags for "Assign to all" action
    removeFromAllTeamMember, // Tags for "Remove from all" action
  };

  // console.log("Assign to All Tags:", assignToAllTags);
  // console.log("Remove from All Tags:", removeFromAllTags);

  const sendbulkTeamMember = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accounts: selectedAccounts,
      teamMembers: formattedOutput.assignToAllTeamMember,
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${ACCOUNT_API}/manageteammember/teamMembertomultipleaccount`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        removebulkTeamMember();
      })
      .catch((error) => console.error(error));
  };

  const removebulkTeamMember = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accounts: selectedAccounts,
      teamMembers: formattedOutput.removeFromAllTeamMember,
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${ACCOUNT_API}/manageteammember/removeteammember`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        toast.success("Team Member Assign Successfully");
        handleCancel();
      })
      .catch((error) => console.error(error));
  };

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((user) => (
              <TableRow key={user._id}>
                {/* Ensure that user.username is correctly available */}
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {user.username} {/* Fallback text */}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Select
                    value={tagActions[user._id] || "Do nothing"} // Get the action for the tag, default to "Do nothing"
                    onChange={(e) => handleActionChange(user._id, e.target.value)}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    sx={{ width: "150px" }}
                  >
                    <MenuItem value="Assign to all">Assign to all</MenuItem>
                    <MenuItem value="Remove from all">Remove from all</MenuItem>
                    <MenuItem value="Do nothing">Do nothing</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="buttons-email" sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button variant="contained" color="primary" onClick={sendbulkTeamMember}>
          Assign
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ManageTeams;
