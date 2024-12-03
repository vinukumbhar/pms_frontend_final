import React, { useState, useEffect } from 'react'
import { Paper, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Typography, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";
import { toast } from "react-toastify";

const ProposalsEls = () => {

    const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_URL;
    const [ProposalsTemplates, setProposalsTemplates] = useState([]);
    const [tempIdget, setTempIdGet] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);

    const navigate = useNavigate();

    const fetchPrprosalsAllData = async () => {
        try {
            const url = `${PROPOSAL_API}/proposalandels/proposalaccountwise/allproposallist/list`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch Proposals templates");
            }
            const result = await response.json();
            console.log(result.proposalesandelsAccountwise)
            setProposalsTemplates(result.proposalesandelsAccountwise);

        } catch (error) {
            console.error("Error fetching Proposals  templates:", error);
        }
    };

    useEffect(() => {
        fetchPrprosalsAllData();
    }, []);

    const handleEdit = (_id, data) => {
        console.log(_id)
        console.log(data)
        navigate(`/accountsdash/proposals/${data}/update/` + _id);
        // console.log(_id);
    };

    const handleAccountDash = (_id, data) => {
        navigate(`/accountsdash/overview/${data}`);
    };

    const toggleMenu = (_id) => {
      setOpenMenuId(openMenuId === _id ? null : _id);
      setTempIdGet(_id);
    };

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
            //   setShowForm(false);
              fetchPrprosalsAllData();
              // fetchServiceData();
            })
            .catch((error) => {
              console.error(error);
              toast.error("Failed to delete item");
            });
        }
      };

    return (
        <Box sx={{ mt: 2 }}>
            <Box>
                <Typography variant="h4" fontWeight="bold">
                    Proposals & Els
                </Typography>
            </Box>
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
                                    <Typography sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: "bold" }} onClick={() => handleAccountDash(row._id, row.accountid._id)}>
                                        {row.accountid.accountName}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: "bold" }} onClick={() => handleEdit(row._id, row.accountid._id)}>
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

export default ProposalsEls