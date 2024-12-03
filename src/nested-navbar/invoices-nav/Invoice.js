import React, { useEffect, useState } from "react";
import { Checkbox, Autocomplete, Switch, FormControlLabel, Box, Button, Drawer, Typography, Chip, IconButton, Divider, Select, MenuItem, InputLabel, TextField, FormControl, FormLabel, InputAdornment, Popover, ListItem, List, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { CiMenuKebab } from "react-icons/ci";
import { toast } from "react-toastify";
import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";
import CreateInvoice from "../invoices-nav/CreateInvoice";
import UpdateInvoice from "../invoices-nav/UpdateInvoice";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Invoice = () => {
  const navigate = useNavigate();
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const INVOICES_API = process.env.REACT_APP_INVOICES_URL;
  const [showInvoiceTemplateForm, setShowInvoiceTemplateForm] = useState(false);
  const [showInvoiceUpdateForm, setShowInvoiceUpdateForm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [tempIdget, setTempIdGet] = useState("");
  const [accountInvoicesData, setAccountInvoicesData] = useState([]);
  const { data } = useParams();
  console.log(data);

  useEffect(() => {
    fetchInvoices(data);
  }, []);

  const fetchInvoices = async (data) => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(`${INVOICES_API}/workflow/invoices/invoice/invoicelistby/accountid/${data}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          setAccountInvoicesData(result.invoice);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error("Error fetching email templates:", error);
    }
  };

  console.log(accountInvoicesData);

  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
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
      const url = `${INVOICES_API}/workflow/invoices/invoice/`;
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
          fetchInvoices(data);
          // setshowOrganizerTemplateForm(false);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    }
  };

  //***********Invoice Create */

  const handleCreateInvoiceClick = () => {
    setShowInvoiceTemplateForm(true);
  };

  const handleClose = () => {
    setShowInvoiceTemplateForm(false);
    fetchInvoices(data);
  };

  const handleInvoiceUpdateClose = () => {
    setShowInvoiceUpdateForm(false);
    fetchInvoices(data);
  };

  const [invoiceId, SetInvoiceId] = useState();
  const handleEdit = (_id) => {
    setShowInvoiceUpdateForm(true);
    SetInvoiceId(_id);
    // navigate("/" + _id);
  };
  console.log(invoiceId);

  const handleDuplicate = async (_id) => {
    // Find the template by its ID
    const InvoiceToDuplicate = accountInvoicesData.find((template) => template._id === _id);
    if (!InvoiceToDuplicate) {
      toast.error("Invocie not found");
      return;
    }
    // Create a new template object (with new ID and modified template name)
    const duplicatedInvoice = {
      ...InvoiceToDuplicate,
      invoicenumber: `${InvoiceToDuplicate.invoicenumber} (Copy)`, // Indicate it's a duplicate
    };
    console.log(duplicatedInvoice);
    try {
      // Prepare request options
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify(duplicatedInvoice);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      // Send the duplicated template to the server
      const response = await fetch(`${INVOICES_API}/workflow/invoices/invoice`, requestOptions);
      const result = await response.json();
      console.log(result);
      if (result.message === "Invoice created successfully") {
        toast.success("Invoice duplicated successfully");
        fetchInvoices(data); // Refresh the list after duplication
      } else {
        toast.error(result.error || "Failed to duplicate Invoice");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error duplicating template");
    }
  };

  const handlePrint = async (_id) => {
    try {
      const response = await fetch(`${INVOICES_API}/workflow/invoices/invoice/${_id}`);
      const invoiceData = await response.json();
      console.log(invoiceData);
      const accountId = invoiceData.invoice.account;
      const accountResponse = await fetch(`${ACCOUNT_API}/accounts/accountdetails/${accountId}`);
      const accountData = await accountResponse.json();
      console.log(accountData);
      console.log(accountData.account.accountName);

      const accountName = accountData.account.accountName || "Unknown Account";
      // Construct the HTML for printing
      const printContent = `

            <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;

          }
          .invoice-container {
            max-width: 800px;
            margin: auto;
            padding: 20px;

          }
          h1 {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
          }
          p {
            font-size: 16px;
            color: #555;
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #dddddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .summary-table {
            width: 50%;
            margin-left: auto;
            margin-top: 20px;
            border: none;
          }
          .summary-table td {
            border: none;
            padding: 10px 0;
          }
          .total-row td {
            font-weight: bold;
          }
        </style>
        <div style="font-family: Arial, sans-serif; padding: 35px;">
          <h1>Invoice Number #${invoiceData.invoice.invoicenumber}</h1>
          <p><strong>Date:</strong> ${new Date(invoiceData.invoice.invoicedate).toLocaleDateString()}</p>
          <p><strong>${accountName}</strong></p>
          <p><strong>Description:</strong> ${invoiceData.invoice.description}</p>
          

         <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th>Product/Service</th>
                <th>Rate</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.invoice.lineItems
                .map(
                  (item) => `
                <tr>
                  <td>${item.productorService}</td>
                  <td>$${item.rate}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.amount}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

                <table class="summary-table">
            <tbody>
              <tr>
                <td><strong>Subtotal</strong></td>
                <td>$${invoiceData.invoice.summary.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Tax</strong></td>
                <td>$${invoiceData.invoice.summary.taxTotal.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td><strong>Total</strong></td>
                <td>$${invoiceData.invoice.summary.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

        </div>
      `;

      // Open a new window and print the content
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Invoice</title>
          </head>
          <body onload="window.print(); window.close();">
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error("Error printing invoice:", error);
      toast.error("Failed to print invoice");
    }
  };

  // Function to download invoice as PDF
  // const handleDownload = async (_id) => {
  //   try {
  //     const response = await fetch(`${INVOICES_API}/workflow/invoices/invoice/${_id}`);
  //     const invoiceData = await response.json();

  //     const doc = new jsPDF();

  //     // Add invoice details to PDF
  //     doc.setFontSize(12);
  //     doc.text(`Invoice Number: ${invoiceData.invoice.invoicenumber}`, 10, 10);
  //     doc.text(`Date: ${new Date(invoiceData.invoice.invoicedate).toLocaleDateString()}`, 10, 20);
  //     doc.text(`Description: ${invoiceData.invoice.description}`, 10, 30);
  //     doc.text("Line Items:", 10, 40);

  //     const lineItems = invoiceData.invoice.lineItems;
  //     let yPosition = 50;

  //     lineItems.forEach((item) => {
  //       doc.text(`${item.productorService} - Rate: $${item.rate} - Quantity: ${item.quantity} - Amount: $${item.amount}`, 10, yPosition);
  //       yPosition += 10;
  //     });

  //     doc.text(`Subtotal: $${invoiceData.invoice.summary.subtotal.toFixed(2)}`, 10, yPosition);
  //     yPosition += 10;
  //     doc.text(`Tax: $${invoiceData.invoice.summary.taxTotal.toFixed(2)}`, 10, yPosition);
  //     yPosition += 10;
  //     doc.text(`Total: $${invoiceData.invoice.summary.total.toFixed(2)}`, 10, yPosition);

  //     // Save the PDF to local storage
  //     const pdfBlob = doc.output("blob");
  //     const pdfUrl = URL.createObjectURL(pdfBlob);
  //     const a = document.createElement("a");
  //     a.href = pdfUrl;
  //     a.download = `Invoice_${invoiceData.invoice.invoicenumber}.pdf`;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);

  //     toast.success("Invoice downloaded successfully");
  //   } catch (error) {
  //     console.error("Error downloading invoice:", error);
  //     toast.error("Failed to download invoice");
  //   }
  // };
  const handleDownload = async (_id) => {
    try {
      const response = await fetch(`${INVOICES_API}/workflow/invoices/invoice/${_id}`);
      const invoiceData = await response.json();

      const doc = new jsPDF();

      // Set up styles for the PDF
      doc.setFont("Arial", "normal");
      doc.setFontSize(14);
      doc.text(`Invoice Number: ${invoiceData.invoice.invoicenumber}`, 10, 10);
      doc.text(`Date: ${new Date(invoiceData.invoice.invoicedate).toLocaleDateString()}`, 10, 20);
      doc.text(`Description: ${invoiceData.invoice.description}`, 10, 30);

      // Add Account Name
      // const accountName = invoiceData.invoice.accountName || "Unknown Account";
      const accountId = invoiceData.invoice.account;
      const accountResponse = await fetch(`${ACCOUNT_API}/accounts/accountdetails/${accountId}`);
      const accountData = await accountResponse.json();
      console.log(accountData);
      console.log(accountData.account.accountName);

      const accountName = accountData.account.accountName || "Unknown Account";
      doc.text(`Account Name: ${accountName}`, 10, 40);

      // Create line items table
      doc.autoTable({
        startY: 50,
        head: [["Product/Service", "Rate", "Quantity", "Amount"]],
        body: invoiceData.invoice.lineItems.map((item) => [item.productorService, `$${item.rate}`, item.quantity, `$${item.amount}`]),
        theme: "grid", // Choose a theme, 'grid', 'striped', etc.
        headStyles: {
          fillColor: [242, 242, 242], // Light gray background for header
          textColor: [51, 51, 51], // Dark text color
        },
        styles: {
          textColor: [85, 85, 85], // Text color
          fontSize: 12,
          halign: "left", // Align text to left
        },
      });

      // Summary section
      const summaryY = doc.autoTable.previous.finalY + 10;
      doc.setFontSize(12);
      doc.text(`Subtotal: $${invoiceData.invoice.summary.subtotal.toFixed(2)}`, 10, summaryY);
      doc.text(`Tax: $${invoiceData.invoice.summary.taxTotal.toFixed(2)}`, 10, summaryY + 10);
      doc.setFontSize(14);
      doc.text(`Total: $${invoiceData.invoice.summary.total.toFixed(2)}`, 10, summaryY + 20);

      // Save the PDF to local storage
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = `Invoice_${invoiceData.invoice.invoicenumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Button variant="contained" onClick={handleCreateInvoiceClick} sx={{ mb: 3 }}>
        New Invoice
      </Button>
      <Paper>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Invoice #</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Posted</strong>
              </TableCell>
              <TableCell>
                <strong>Total</strong>
              </TableCell>
              <TableCell>
                <strong>Amount P...</strong>
              </TableCell>
              <TableCell>
                <strong>Balance D...</strong>
              </TableCell>
              <TableCell>
                <strong>Last PAI..</strong>
              </TableCell>
              <TableCell>
                <strong>Description</strong>
              </TableCell>
              <TableCell>
                <strong>Locked D...</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {
            accountInvoicesData.map((row) => (
              <TableRow key={row._id}>
                <TableCell>
                  <Typography sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: "bold" }} onClick={() => handleEdit(row._id)}>
                    {row.invoicenumber}
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
                <TableCell>{row.createdAt}</TableCell>
                <TableCell>${row.summary.total}</TableCell>
                <TableCell>${}</TableCell> 
                <TableCell>${row.summary.total} </TableCell>
                <TableCell> </TableCell>
                <TableCell>{row.description}</TableCell>
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
                          
                          right: "30px",
                          m: 2,
                          top: "10px",
                          width: "150px",
                          textAlign: "start",
                        }}
                      >
                        <Typography sx={{ fontSize: "12px", fontWeight: "bold" }} onClick={() => handleEdit(row._id)}>
                          Edit
                        </Typography>

                        <Typography sx={{ fontSize: "12px", fontWeight: "bold" }} onClick={() => handleDuplicate(row._id)}>
                          Duplicate
                        </Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: "bold" }} onClick={() => handlePrint(row._id)}>
                          Print
                        </Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: "bold" }} onClick={() => handleDownload(row._id)}>
                          Download
                        </Typography>

                        <Typography sx={{ fontSize: "12px", color: "red", fontWeight: "bold" }} onClick={() => handleDelete(row._id)}>
                          Delete
                        </Typography>
                      </Box>
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))} */}
            {Array.isArray(accountInvoicesData) ? (
              accountInvoicesData.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>
                    <Typography sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: "bold" }} onClick={() => handleEdit(row._id)}>
                      {row.invoicenumber}
                    </Typography>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>{row.createdAt}</TableCell>
                  <TableCell>${row.summary.total}</TableCell>
                  <TableCell>${}</TableCell>
                  <TableCell>${row.summary.total} </TableCell>
                  <TableCell> </TableCell>
                  <TableCell>{row.description}</TableCell>
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

                            right: "30px",
                            m: 2,
                            top: "10px",
                            width: "150px",
                            textAlign: "start",
                          }}
                        >
                          <Typography sx={{ fontSize: "12px", fontWeight: "bold" }} onClick={() => handleEdit(row._id)}>
                            Edit
                          </Typography>

                          <Typography sx={{ fontSize: "12px", fontWeight: "bold" }} onClick={() => handleDuplicate(row._id)}>
                            Duplicate
                          </Typography>
                          <Typography sx={{ fontSize: "12px", fontWeight: "bold" }} onClick={() => handlePrint(row._id)}>
                            Print
                          </Typography>
                          <Typography sx={{ fontSize: "12px", fontWeight: "bold" }} onClick={() => handleDownload(row._id)}>
                            Download
                          </Typography>

                          <Typography sx={{ fontSize: "12px", color: "red", fontWeight: "bold" }} onClick={() => handleDelete(row._id)}>
                            Delete
                          </Typography>
                        </Box>
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <div></div>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Drawer
        anchor="right"
        open={showInvoiceTemplateForm}
        onClose={handleClose}
        classes={{ paper: "custom-right-drawer" }}
        PaperProps={{
          sx: {
            width: "60%",
            // padding: 2,
          },
        }}
      >
        <CreateInvoice onClose={handleClose} />
      </Drawer>

      <Drawer
        anchor="right"
        open={showInvoiceUpdateForm}
        onClose={handleInvoiceUpdateClose}
        selectedInvoice={handleEdit}
        classes={{ paper: "custom-right-drawer" }}
        PaperProps={{
          sx: {
            width: "60%",
            // padding: 2,
          },
        }}
      >
        <UpdateInvoice onClose={handleInvoiceUpdateClose} invoiceData={invoiceId} />
      </Drawer>
    </Box>
  );
};

export default Invoice;
