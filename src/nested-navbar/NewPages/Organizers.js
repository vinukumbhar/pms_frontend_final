import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, Box, Button, IconButton, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Chip } from "@mui/material";
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import OrganizerUpdate from "../NewPages/OrganizerUpdate";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Organizers = () => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const { data } = useParams();
  console.log(data);
  const navigate = useNavigate();

  const [organizerTemplatesData, setOrganizerTemplatesData] = useState([]);
  const [tempIdget, setTempIdGet] = useState("");
  const [showOrganizerTemplateForm, setShowOrganizerTemplateForm] = useState(false);

  // const fetchOrganizerTemplates = async (accountid) => {
  //   try {
  //     const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/organizerbyaccount/${accountid}`;
  //     console.log(url);
  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch email templates");
  //     }
  //     const data = await response.json();
  //     console.log(data);
  //     setOrganizerTemplatesData(data.organizerAccountWise);
  //   } catch (error) {
  //     console.error("Error fetching email templates:", error);
  //   }
  // };
//for active & Archived
const [activeButton, setActiveButton] = useState("active");
  const [isActiveTrue, setIsActiveTrue] = useState(true);
  const [activeorarchive, setActiveorarchive] = React.useState('Active');

  const handleActiveClick = () => {
    setIsActiveTrue(true);
    setActiveButton("active");
    setActiveorarchive("Archive");
    // fetchOrganizerTemplates(data,true)
    fetchOrganizerTemplates()
    console.log("Active action triggered.");
  };

  const handleArchivedClick = () => {
    setIsActiveTrue(false);
    setActiveButton("archived");
    setActiveorarchive("Active");
    // fetchOrganizerTemplates(data,false)
    fetchOrganizerTemplates()
    console.log("Archive action triggered.");
  };

  const handleArchive=(_id)=>{
   console.log(_id)
    // handleSubmit(id);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      active: !isActiveTrue,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${_id}`

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // console.log(result.updatedAccount); // Log the result
        // setAccountId(result.updatedAccount._id);
        toast.success("orgnizer updated successfully"); // Display success toast
        fetchOrganizerTemplates(data);
      })
      .catch((error) => {
        console.error(error); // Log the error
        toast.error("An error occurred while submitting the form"); // Display error toast
      });
    
  }
  const fetchOrganizerTemplates = async (accountid) => {
    try {
      // const url = http://127.0.0.1:7600/workflow/orgaccwise/organizeraccountwise/${isActiveTrue}/${accountid};

      const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/organizerbyaccount/${accountid}/${isActiveTrue}`;

      console.log("|URLLL",url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch email templates");
      }
      const data = await response.json();
      console.log(data);
      setOrganizerTemplatesData(data.organizerAccountWise);
      console.log('orgData:',data.organizerAccountWise )
      // if (isActiveTrue === true) {
      //   setActiveButton("active");
      //   setActiveorarchive("Archive");
      // }
      // else if (isActiveTrue === false) {
      //   setActiveButton("archived");
      //   setActiveorarchive("Active");
      // }

    } catch (error) {
      console.error("Error fetching email templates:", error);
    }
  };
useEffect(() => {
  fetchOrganizerTemplates(data);
}, [isActiveTrue]);

  const handleSealed = (_id, issealed) => {
    // navigate('OrganizerTempUpdate/' + _id)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      issealed: issealed,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${_id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.message === "Organizer AccountWise Updated successfully") {
          toast.success("Organizer Updated successfully.");
          fetchOrganizerTemplates(data);
        }
      })
      .catch((error) => console.error(error));
  };

  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
  };

  const handleCreateInvoiceClick = () => {
    setShowOrganizerTemplateForm(true);
    navigate(`/clients/accounts/accountsdash/organizers/${data}/accountorganizer`);
  };

  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm("Are you sure you want to delete this organizer template?");

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };
      const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/`;
      fetch(url + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.text();
        })
        .then((result) => {
          console.log(result);
          toast.success("Item deleted successfully");
          fetchOrganizerTemplates(data);
          // setshowOrganizerTemplateForm(false);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    }
  };
  useEffect(() => {
    fetchOrganizerTemplates(data);
  }, []);

  const [selectedOrganizer, SetSelectedOrganizer] = useState({});
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const handleEdit = (_id) => {
    SetSelectedOrganizer(_id);
    setPreviewDialogOpen(true);
  };
  const handleClosePreview = () => {
    setPreviewDialogOpen(false); // Close the dialog
  };

  // const printOrganizerData = (id) => {
  //   const organizer = organizerTemplatesData.find((org) => org._id === id);
  //   console.log(organizer);
  //   console.log(organizer.sections);
  //   if (organizer) {
  //     const printWindow = window.open("", "_blank");
  //     printWindow.document.write(`
  //       <html>
  //         <head>
  //           <title>Organizer Data</title>
  //           <style>
  //             body { font-family: Arial, sans-serif; }
  //             h1 { color: #2c59fa; }
  //             table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  //             th, td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; }
  //             th { background-color: #f4f4f4; }
  //           </style>
  //         </head>
  //         <body>
  //           <h1>Organizer Data</h1>
  //           <table>
  //             <tr>
  //               <th>Name</th>
  //               <th>Last Updated</th>
  //               <th>Status</th>
  //               <th>Progress</th>
  //               <th>Seal</th>
  //             </tr>
  //             <tr>
  //               <td>${organizer.organizertemplateid.organizerName}</td>
  //               <td>${organizer.updatedAt}</td>
  //               <td>${organizer.issealed ? "Sealed" : "Unsealed"}</td>
  //               <td>${organizer.organizertemplateid.sections.length}</td>
  //               <td>${organizer.issealed ? "Sealed" : "Not Sealed"}</td>
  //             </tr>
  //           </table>
  //         </body>
  //       </html>
  //     `);
  //     printWindow.document.close();
  //     printWindow.print();
  //   } else {
  //     toast.error("Organizer not found.");
  //   }
  // };
  const printOrganizerData = (id) => {
    const organizer = organizerTemplatesData.find((org) => org._id === id);
    console.log(organizer);

    if (organizer) {
      const printWindow = window.open("", "_blank");

      // Constructing the sections HTML
      const sectionsHtml = organizer.organizertemplateid.sections
        .map((section) => {
          const formElementsHtml = section.formElements
            .map((element) => {
              return `
            <div style="margin-bottom: 20px;">
              <strong >${element.text}</strong>
             
            </div>
          `;
            })
            .join("");

          return `
          <div style="margin-bottom: 20px;">
            <h3>${section.name}</h3>
           
            ${formElementsHtml}
          </div>
        `;
        })
        .join("");

      printWindow.document.write(`
        <html>
          <head>
            <title>Organizer Data</title>
            <style>
              body { font-family: Arial, sans-serif; }
              h1 { color: #2c59fa; }
              h3 { color: #555; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; }
              th { background-color: #f4f4f4; }
            </style>
          </head>
          <body>
            <h1>Organizer Data</h1>
           
            <div>
             
              ${sectionsHtml}
            </div>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.print();
    } else {
      toast.error("Organizer not found.");
    }
  };


  // 

  // ${
  //   element.options && element.options.length > 0
  //     ? `
  //   <div>Options: ${element.options.map((opt) => opt.text).join(", ")}</div>
  // `
  //     : ""
  // }


  return (
    <Box sx={{ mt: 2 }}>
      <Button variant="contained" onClick={handleCreateInvoiceClick} sx={{ mb: 3 }}>
        New Organizer
      </Button>
      {/* <MaterialReactTable columns={columns} table={table} /> */}
      <Box>
  <Button
            style={{
              backgroundColor: activeButton === "active" ? "blue" : "transparent",
              color: activeButton === "active" ? "white" : "black",
              fontWeight: activeButton === "active" ? "bold" : "normal",
            }}
            onClick={handleActiveClick}
          >
            Active
          </Button>

          <Button
            style={{
              backgroundColor: activeButton === "archived" ? "blue" : "transparent",
              color: activeButton === "archived" ? "white" : "black",
              fontWeight: activeButton === "archived" ? "bold" : "normal",
            }}
            onClick={handleArchivedClick}
          >
            Archived
          </Button>
  </Box>
      <Paper>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Last Updated</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Progress</strong>
              </TableCell>
              <TableCell>
                <strong>Seal</strong>
              </TableCell>
              <TableCell>
                <strong></strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizerTemplatesData.map((row) => (
              <TableRow key={row._id}>
                <TableCell>
                  <Typography sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: "bold" }} onClick={() => handleEdit(row._id)}>
                    {row.organizertemplateid.organizerName}
                  </Typography>
                </TableCell>
                <TableCell>{row.updatedAt}</TableCell>
                <TableCell>
                  <Chip
                    label={row.issubmited ? "Completed" : "Pending"}
                    color={row.issubmited ? "success" : "default"}
                    sx={{
                      backgroundColor: row.issubmited ? "green" : "grey",
                      color: "white",
                    }}
                  />
                </TableCell>
                <TableCell>{row.organizertemplateid.sections.length}</TableCell> {/* Show the number of sections */}
                <TableCell>{row.issealed ? <Chip label="Sealed" color="primary" /> : null}</TableCell>
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
                          width: "150px",
                          textAlign: "start",
                        }}
                      >
                        {/* <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Publice to Marketplace</Typography> */}
                        <Typography
                          sx={{ fontSize: "12px", fontWeight: "bold" }}
                          // onClick={() => handleSealed(row._id)}
                          onClick={() => handleSealed(row._id, !row.issealed)}
                        >
                          {row.issealed ? "Unseal" : "Seal"}
                        </Typography>

                        <Typography sx={{ fontSize: "12px", color: "red", fontWeight: "bold" }} onClick={() => handleDelete(row._id)}>
                          Delete
                        </Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: "bold" }} onClick={() => handleEdit(row._id)}>
                          Change Answers    
                        </Typography>
                        <Typography
                          onClick={() => handleArchive(row._id)}
                          
                          sx={{ fontSize: "12px", fontWeight: "bold" }}>
                          Archived
                        </Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: "bold" }} onClick={() => printOrganizerData(row._id)}>
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

      <Dialog open={previewDialogOpen} onClose={handleClosePreview} fullScreen>
        <DialogContent>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "2px solid #3FA2F6",
                  p: 2,
                  mb: 3,
                  borderRadius: "10px",
                  backgroundColor: "#96C9F4",
                }}
              >
                <Box>
                  <Typography fontWeight="bold">Organizer View</Typography>
                  <Typography>The client sees your organizer like this</Typography>
                </Box>
                <Button variant="text" onClick={handleClosePreview}>
                  Back to edit
                </Button>
              </Box>

              {/* Make sure that selectedOrganizer is not undefined or null */}
              <OrganizerUpdate OrganizerData={selectedOrganizer} onClose={handleClosePreview} />
            </LocalizationProvider>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Organizers;
