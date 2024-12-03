import React, { useEffect, useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Button, Typography, Box } from "@mui/material";
import { toast } from "react-toastify";

const ManageTags = ({ selectedAccounts, onClose }) => {
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [tags, setTags] = useState([]);
  const [tagActions, setTagActions] = useState({});
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  useEffect(() => {
    fetchTagData(); // Fetch tags on component mount
  }, []);

  const fetchTagData = async () => {
    try {
      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      setTags(data.tags);

      // Initialize action state for each tag
      const initialActions = data.tags.reduce((acc, tag) => {
        acc[tag._id] = "Do nothing";
        return acc;
      }, {});

      console.log(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleActionChange = (tagId, newValue) => {
    setTagActions((prevActions) => ({
      ...prevActions,
      [tagId]: newValue,
    }));
  };

  const handleCancel = () => {
    if (onClose) {
      onClose(); // Ensures onClose is a valid function before calling it
    }
  };

  // Separate tags by their actions
  // const assignToAllTags = Object.keys(tagActions)
  //     .filter((tagId) => tagActions[tagId] === "Assign to all")
  //     .join(', ');

  // const removeFromAllTags = Object.keys(tagActions)
  //     .filter((tagId) => tagActions[tagId] === "Remove from all")
  //     .join(', ');

  // Separate tags by their actions
  const assignToAllTags = Object.keys(tagActions).filter((tagId) => tagActions[tagId] === "Assign to all");

  const removeFromAllTags = Object.keys(tagActions).filter((tagId) => tagActions[tagId] === "Remove from all");

  // Format the final output with separate tag arrays
  const formattedOutput = {
    accounts: ["671ce885aa9709c39fd3f974", "6718e47e1b7d40bc7d33611e"],
    assignToAllTags, // Tags for "Assign to all" action
    removeFromAllTags, // Tags for "Remove from all" action
  };

  console.log("Assign to All Tags:", assignToAllTags);
  console.log("Remove from All Tags:", removeFromAllTags);

  const sendbulkTags = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accounts: selectedAccounts,
      tags: formattedOutput.assignToAllTags,
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${ACCOUNT_API}/assignbulktags/tomultipleaccount`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        removebulkTags();
        // toast.success("Tags Assign Successfully")
      })
      .catch((error) => console.error(error));
  };

  const removebulkTags = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accounts: selectedAccounts,
      tags: formattedOutput.removeFromAllTags,
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${ACCOUNT_API}/assignbulktags/removetags`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success("Tags Assign Successfully");
        handleCancel();
      })
      .catch((error) => console.error(error));
  };

  console.log(tagActions);

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tag Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag._id}>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: tag.tagColour,
                      color: "#fff", // Adjust text color if needed
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    <Typography variant="body2" noWrap>
                      {tag.tagName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Select
                    value={tagActions[tag._id] || "Do nothing"} // Get the action for the tag
                    onChange={(e) => handleActionChange(tag._id, e.target.value)}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    // disabled // Disable selection
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
        <Button variant="contained" color="primary" onClick={sendbulkTags}>
          Assign Tags
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ManageTags;
