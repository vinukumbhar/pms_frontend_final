import React, { useState, useEffect, useMemo } from "react";
import {
 Button, Typography, Box
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate,useParams } from "react-router-dom";
import { Chip, Paper, Divider, Menu, MenuItem, useMediaQuery, Table, TableHead, TableBody, TableRow, TableCell, Checkbox, IconButton } from "@mui/material";
import { toast } from "react-toastify";
import { CiMenuKebab } from "react-icons/ci";

const Proposals = () => {
  const { data } = useParams();
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_URL;
  const [ProposalsTemplates, setProposalsTemplates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleCreateTemplateClick = () => {
    navigate(`/accountsdash/proposals/${data}/new`)
  };

  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
  };

 

  //delete template
  const handleEdit = (_id) => {
    navigate(`/accountsdash/proposals/${data}/update/` + _id);
    console.log(_id);
  };
  useEffect(() => {
    fetchPrprosalsAllData(data);
  }, []);
  
  // Delete template
  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm("Are you sure you want to delete this Job template?");
  
    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };
      const url = `${PROPOSAL_API}/proposalandels/proposalaccountwise/`;
      fetch(url + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.json();
        })
        .then((result) => {
          console.log(result);
          toast.success("Item deleted successfully");
  
          // Fetch the updated data after deletion
          fetchPrprosalsAllData(data);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    }
  };
  const handlePrint = async (_id) => {
    try {
      const url = `${PROPOSAL_API}/proposalandels/proposalaccountwise/${_id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch proposal for printing");
      }
      const proposalData = await response.json();
      console.log(proposalData)
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
        <head>
          <title>Print Proposal</title>
        </head>
        <body>
          <h1>${proposalData.proposalesandelsAccountwise.proposalname}</h1>
         <h6>${proposalData.proposalesandelsAccountwise.termsandconditions}</h6>
         

        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } catch (error) {
      console.error("Error printing proposal:", error);
      toast.error("Failed to print proposal");
    }
  };
  const fetchPrprosalsAllData = async (data) => {
    try {
      const url = `${PROPOSAL_API}/proposalandels/proposalaccountwise/proposalbyaccount/${data}`;
  
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch Proposals templates");
      }
      const result = await response.json();
      console.log(result.proposalesandelsAccountwise);
      setProposalsTemplates(result.proposalesandelsAccountwise);
    } catch (error) {
      console.error("Error fetching Proposals templates:", error);
    }
  };
  
  //delete template
  // const handleDelete = (_id) => {
  //   // Show a confirmation prompt
  //   const isConfirmed = window.confirm("Are you sure you want to delete this Job template?");

  //   // Proceed with deletion if confirmed
  //   if (isConfirmed) {
  //     const requestOptions = {
  //       method: "DELETE",
  //       redirect: "follow",
  //     };
  //     const url = `${PROPOSAL_API}/proposalandels/proposalaccountwise/`;
  //     fetch(url + _id, requestOptions)
  //       .then((response) => {
  //         if (!response.ok) {
  //           throw new Error("Failed to delete item");
  //         }
  //         return response.json();
  //       })
  //       .then((result) => {
  //         console.log(result);
          
  //         toast.success("Item deleted successfully");
         
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //         toast.error("Failed to delete item");
  //       });
  //   }
  // };

  // const fetchPrprosalsAllData = async (data) => {
  //   try {
  //     const url = `${PROPOSAL_API}/proposalandels/proposalaccountwise/proposalbyaccount/${data}`;

  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch Proposals templates");
  //     }
  //     const result = await response.json();
  //     console.log(result.proposalesandelsAccountwise)
  //     setProposalsTemplates(result.proposalesandelsAccountwise);
    
  //   } catch (error) {
  //     console.error("Error fetching Proposals  templates:", error);
  //   }
  // };

 
  return (

    <Box sx={{ mt: 2 }}>
      <Button variant="contained" onClick={handleCreateTemplateClick}>
        New Proposals 
      </Button>
      <Paper>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
            <TableCell>
                <strong>Client Name</strong>
              </TableCell>
              <TableCell>
                <strong>Proposal Name</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Payment</strong>
              </TableCell>
              <TableCell>
                <strong>Auth</strong>
              </TableCell>
              <TableCell>
                <strong>Invoicing</strong>
              </TableCell>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell>
                <strong>Signed</strong>
              </TableCell>
              <TableCell>
                <strong></strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ProposalsTemplates.map((row) => (
              <TableRow key={row._id}>
                <TableCell>
                  <Typography sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: "bold" }} onClick={() => handleEdit(row._id)}>
                    {row.accountid.accountName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: "bold" }} onClick={() => handleEdit(row._id)}>
                    {row.proposalname}
                  </Typography>
                </TableCell>
                <TableCell>a</TableCell>
                <TableCell>b</TableCell>
                <TableCell>c</TableCell>
                <TableCell>d</TableCell>
                <TableCell>{row.createdAt}</TableCell>
                <TableCell></TableCell>
                <TableCell sx={{ textAlign: "end" }}>
                  <IconButton onClick={() => toggleMenu(row._id)} style={{ color: "#2c59fa" }}>
                    <CiMenuKebab style={{ fontSize: "25px" }} />
                    {openMenuId === row._id && (
                      <Box
                        sx={{
                          position: "absolute",
                          zIndex: 1,
                          backgroundColor: "#fff",
                          boxShadow: 1,
                          borderRadius: 1,
                          p: 1,
                          // left:0,
                          right: "30px",
                          m: 2,
                          top: "10px",
                          width: "80px",
                          textAlign: "start",
                        }}
                      >
                        <Typography sx={{ fontSize: "12px", color: "red", fontWeight: "bold" }} onClick={() => handleDelete(row._id)}>
                          Delete
                        </Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: "bold" }} onClick={() => handleEdit(row._id)}>
                         Edit   
                        </Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: "bold" }} onClick={() => handlePrint(row._id)}>
                         Print
                        </Typography>
                      </Box>
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>


  )
}

export default Proposals