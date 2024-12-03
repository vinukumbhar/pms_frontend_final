import React, { useState, useEffect } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { CiDiscount1 } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";
import Select from "react-select";
import { toast } from "react-toastify";
import { useMediaQuery, Box, Drawer, MenuItem, Menu, Button, Autocomplete, Typography, Container, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Grid, TextField, InputLabel, Switch, FormControlLabel, Divider, List, ListItem, ListItemText, Popover, Checkbox } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { useTheme } from "@mui/material/styles";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Editor from "../Texteditor/Editor";

const InvoiceTempUpdate = () => {
  const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
  const SERVICE_API = process.env.REACT_APP_SERVICES_URL;

  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  // const handleCloseInvoiceTemp = () => {
  //   // window.location.reload();
  //   navigate('/firmtemp/templates/invoices')
  // };

  const [clientNote, setClientNote] = useState("");
  const handleEditorChange = (content) => {
    setClientNote(content);
  };

  const paymentsOptions = [
    { value: "Bank Debits", label: "Bank Debits" },
    { value: "Credit Card", label: "Credit Card" },
    { value: "Credit Card or Bank Debits", label: "Credit Card or Bank Debits" },
  ];

  // add row
  const [rows, setRows] = useState([{ productName: "", description: "", rate: "$0.00", qty: "1", amount: "$0.00", tax: false, isDiscount: false }]);
  const addRow = (isDiscountRow = false) => {
    const newRow = isDiscountRow ? { productName: "", description: "", rate: "$-10.00", qty: "1", amount: "$-10.00", tax: false, isDiscount: true } : { productName: "", description: "", rate: "$0.00", qty: "1", amount: "$0.00", tax: false, isDiscount: false };
    setRows([...rows, newRow]);
  };
  const deleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  //  for shortcodes
  const [showDropdown, setShowDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [description, setDescription] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };

  const handleAddShortcut = (shortcut) => {
    setDescription((prevText) => prevText + `[${shortcut}]`);
    setShowDropdown(false);
  };

  useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes("")));
  }, [shortcuts]);

  useEffect(() => {
    // Set shortcuts based on selected option
    if (selectedOption === "contacts") {
      const contactShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
        { title: "Contact Shortcodes", isBold: true },
        { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
        { title: "First Name", isBold: false, value: "FIRST_NAME" },
        { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
        { title: "Last Name", isBold: false, value: "LAST_NAME" },
        { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
        { title: "Country", isBold: false, value: "COUNTRY" },
        { title: "Company name", isBold: false, value: "COMPANY_NAME " },
        { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
        { title: "City", isBold: false, value: "CITY" },
        { title: "State/Province", isBold: false, value: "STATE / PROVINCE" },
        { title: "Zip/Postal code", isBold: false, value: "ZIP / POSTAL CODE" },
        { title: "Custom field:Email", isBold: false, value: "CONTACT_CUSTOM_FIELD:Email" },
        { title: "Date Shortcodes", isBold: true },
        { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
        { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
        { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
        { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
        { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
        { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
        { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
        { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
        { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
        { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
        { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
        { title: "Last week", isBold: false, value: "LAST_WEEK" },
        { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
        { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
        { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      setShortcuts(contactShortcuts);
    } else if (selectedOption === "account") {
      const accountShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
        { title: "Date Shortcodes", isBold: true },
        { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
        { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
        { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
        { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
        { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
        { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
        { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
        { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
        { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
        { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
        { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
        { title: "Last week", isBold: false, value: "LAST_WEEK" },
        { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
        { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
        { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      setShortcuts(accountShortcuts);
    }
  }, [selectedOption]);
  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  ///

  const [invoice, setInvoice] = useState();

  useEffect(() => {
    fetchInvoiceTemp(id);
  }, []);

  const fetchInvoiceTemp = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/`;

    fetch(url + id, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const invoiceResult = JSON.parse(result);
        console.log(invoiceResult);
        // console.log(invoiceResult.invoice)
        setInvoice(invoiceResult.invoiceTemplate);

        setTemplatename(invoiceResult.invoiceTemplate.templatename);
        setDescription(invoiceResult.invoiceTemplate.description);
        setClientmsg(invoiceResult.invoiceTemplate.messageForClient);
        const paymentMethod = {
          value: invoiceResult.invoiceTemplate.paymentMethod,
          label: invoiceResult.invoiceTemplate.paymentMethod,
        };
        setPaymentMode(paymentMethod);
        setDaysNextReminder(invoiceResult.invoiceTemplate.daysuntilnextreminder);
        setnumOfReminder(invoiceResult.invoiceTemplate.numberOfreminder);
        setEmailToClient(invoiceResult.invoiceTemplate.sendEmailWhenInvCreated);
        setPayUsingCredits(invoiceResult.invoiceTemplate.payInvoicewithcredits);
        setInvoiceReminders(invoiceResult.invoiceTemplate.sendReminderstoClients);
        setClientNote(invoiceResult.invoiceTemplate.clientNote);

        // Map lineItems to the format needed for rows
        // const formattedRows = invoiceResult.invoiceTemplate.lineItems.map((item) => ({

        //   productName: item.productorService,
        //   description: item.description,
        //   rate: `$${item.rate.toFixed(2)}`,
        //   qty: item.quantity.toString(),
        //   amount: `$${item.amount.toFixed(2)}`,
        //   tax: item.tax,
        //   isDiscount: false, // Assuming this is default false or you can adjust based on your logic
        // }));
        const formattedRows = invoiceResult.invoiceTemplate.lineItems.map((item) => {
          console.log(typeof item.rate, item.rate); // Check type and value
          return {
            productName: item.productorService,
            description: item.description,
            rate: `$${parseFloat(item.rate).toFixed(2)}`, // Convert to float
            qty: item.quantity.toString(),
            amount: `$${parseFloat(item.amount).toFixed(2)}`, // Convert to float
            tax: item.tax,
            isDiscount: false, // Assuming this is default false or you can adjust based on your logic
          };
        });

        setRows(formattedRows);
        setSubtotal(invoiceResult.invoiceTemplate.summary.subtotal);
        setTaxRate(invoiceResult.invoiceTemplate.summary.taxRate);
        console.log(invoiceResult.invoiceTemplate.summary.taxRate);
        setTaxTotal(invoiceResult.invoiceTemplate.summary.taxTotal);
        setTotalAmount(invoiceResult.invoiceTemplate.summary.total);
      })
      .catch((error) => console.error(error));
  };

  const createInvoiceTemp = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      templatename: templatename,
      description: description,
      paymentMethod: paymentMode.value,
      sendEmailWhenInvCreated: emailToClient,
      messageForClient: clientmsg,
      payInvoicewithcredits: payUsingCredits,
      sendReminderstoClients: invoiceReminders,
      daysuntilnextreminder: daysNextReminder,
      numberOfreminder: numOfReminder,
      lineItems: lineItems,
      summary: {
        subtotal: subtotal,
        taxRate: taxRate,
        taxTotal: taxTotal,
        total: totalAmount,
      },
      clientNote: clientNote,

      active: "true",
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/`;
    fetch(url + id, requestOptions)
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((result) => {
        // console.log(result)
        // toast.success("Invoice created successfully");

        if (result && result.message === "InvoiceTemplate Updated successfully") {
          toast.success("InvoiceTemplate Updated successfully");
          navigate("/firmtemp/templates/invoices");
        } else {
          toast.error(result.message || "Failed to create InvoiceTemplate");
        }
      })

      .catch((error) => {
        console.log(error);
        const errorMessage = error.response && error.response.message ? error.response.message : "Failed to create InvoiceTemplate";
        toast.error(errorMessage);
      });
  };
  const createSaveInvoiceTemp = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      templatename: templatename,
      description: description,
      paymentMethod: paymentMode.value,
      sendEmailWhenInvCreated: emailToClient,
      messageForClient: clientmsg,
      payInvoicewithcredits: payUsingCredits,
      sendReminderstoClients: invoiceReminders,
      daysuntilnextreminder: daysNextReminder,
      numberOfreminder: numOfReminder,
      lineItems: lineItems,
      summary: {
        subtotal: subtotal,
        taxRate: taxRate,
        taxTotal: taxTotal,
        total: totalAmount,
      },
      clientNote: clientNote,

      active: "true",
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/`;
    fetch(url + id, requestOptions)
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((result) => {
        // console.log(result)
        // toast.success("Invoice created successfully");

        if (result && result.message === "InvoiceTemplate Updated successfully") {
          toast.success("InvoiceTemplate Updated successfully");
        } else {
          toast.error(result.message || "Failed to create InvoiceTemplate");
        }
      })

      .catch((error) => {
        console.log(error);
        const errorMessage = error.response && error.response.message ? error.response.message : "Failed to create InvoiceTemplate";
        toast.error(errorMessage);
      });
  };

  const [templatename, setTemplatename] = useState();

  const [paymentMode, setPaymentMode] = useState("");
  const handlePaymentOptionChange = (selectedOption) => {
    setPaymentMode(selectedOption);
  };
  const [emailToClient, setEmailToClient] = useState(false);
  const handleEmailToClient = (event) => {
    setEmailToClient(event.target.checked);
  };
  const [payUsingCredits, setPayUsingCredits] = useState(false);
  const handlePayUsingCredits = (event) => {
    setPayUsingCredits(event.target.checked);
  };
  const [invoiceReminders, setInvoiceReminders] = useState(false);
  const handleInvoiceReminders = (event) => {
    setInvoiceReminders(event.target.checked);
  };

  const lineItems = rows.map((item) => ({
    productorService: item.productName, // Assuming productName maps to productorService
    description: item.description,
    rate: item.rate.replace("$", ""), // Removing '$' sign from rate
    quantity: item.qty,
    amount: item.amount.replace("$", ""), // Removing '$' sign from amount
    tax: item.tax.toString(), // Converting boolean to string
  }));
  const [totalAmount, setTotalAmount] = useState(0);

  const [servicedata, setServiceData] = useState([]);
  const [daysNextReminder, setDaysNextReminder] = useState();
  const [numOfReminder, setnumOfReminder] = useState();

  useEffect(() => {
    const calculateSubtotal = () => {
      let subtotal = 0;
      rows.forEach((row) => {
        subtotal += parseFloat(row.amount.replace("$", "")) || 0;
      });
      setSubtotal(subtotal);
      calculateTotal(subtotal, taxRate);
    };
    calculateSubtotal();
  }, [rows]);

  // services data
  useEffect(() => {
    fetchServiceData();
  }, []);
  const fetchServiceData = async () => {
    try {
      const url = `${SERVICE_API}/workflow/services/servicetemplate`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.serviceTemplate);
      setServiceData(data.serviceTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const serviceoptions = servicedata.map((service) => ({
    value: service._id,
    label: service.serviceName,
  }));
  const [selectedservice, setselectedService] = useState();

  //for service
  const fetchservicebyid = async (id, rowIndex) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${SERVICE_API}/workflow/services/servicetemplate/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.serviceTemplate);

        const service = Array.isArray(result.serviceTemplate) ? result.serviceTemplate[0] : result.serviceTemplate;
        const rate = service.rate ? parseFloat(service.rate.replace("$", "")) : 0;
        const updatedRow = {
          productName: service.serviceName || "", // Assuming serviceName corresponds to productName
          description: service.description || "",
          rate: `$${rate.toFixed(2)}`,
          // rate: service.rate ? `$${service.rate.toFixed(2)} ` : '$0.00',
          qty: "1", // Default quantity is 1
          amount: `$${rate.toFixed(2)}`,
          // amount: service.rate ? `$${service.rate.toFixed(2)}` : '$0.00', // Assuming amount is calculated as rate
          tax: service.tax || false,
          isDiscount: false, // Default value if not present in the service object
        };

        const updatedRows = [...rows];
        updatedRows[rowIndex] = { ...updatedRows[rowIndex], ...updatedRow };

        console.log(updatedRows);
        setRows(updatedRows);
      })
      .catch((error) => console.error(error));
  };

  const handleServiceChange = (index, selectedOptions) => {
    setselectedService(selectedOptions);
    fetchservicebyid(selectedOptions.value, index);
  };
  const handleServiceInputChange = (inputValue, actionMeta, index) => {
    if (actionMeta.action === "input-change") {
      const newRows = [...rows];
      newRows[index].productName = inputValue;
      setRows(newRows);
    }
  };

  const handleInputChange = (index, event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    const newRows = [...rows];

    if (name === "rate" || name === "qty") {
      newRows[index][name] = newValue;

      const rate = parseFloat(newRows[index].rate.replace("$", "")) || 0;
      const qty = parseInt(newRows[index].qty) || 0;
      const amount = (rate * qty).toFixed(2);
      newRows[index].amount = `$${amount}`;
    } else {
      newRows[index][name] = newValue;
    }

    setRows(newRows);
  };

  const [subtotal, setSubtotal] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);

  const handleSubtotalChange = (event) => {
    const value = parseFloat(event.target.value) || 0;
    setSubtotal(value);
    calculateTotal(value, taxRate);
  };

  const handleTaxRateChange = (event) => {
    const value = parseFloat(event.target.value) || 0;
    setTaxRate(value);
    calculateTotal(subtotal, value);
  };

  const calculateTotal = (subtotal, taxRate) => {
    const tax = subtotal * (taxRate / 100);
    setTaxTotal(tax);
    setTotalAmount((subtotal + tax).toFixed(2));
  };
  // useEffect(() => {
  //   const calculateSubtotal = () => {
  //     let subtotal = 0;

  //     rows.forEach((row) => {
  //       subtotal += parseFloat(row.amount.replace("$", "")) || 0;
  //     });
  //     // console.log(subtotal)
  //     setSubtotal(subtotal);
  //     calculateTotal(subtotal, taxRate);
  //   };
  //   calculateSubtotal();
  // }, [rows]);
  useEffect(() => {
    const calculateSubtotal = () => {
      let subtotal = 0;

      rows.forEach((row) => {
        if (row.tax) {
          subtotal += parseFloat(row.amount.replace("$", "")) || 0;
        }
        // subtotal += parseFloat(row.amount.replace("$", "")) || 0;
      });
      console.log(subtotal);
      setSubtotal(subtotal);
      calculateTotal(subtotal, taxRate);
    };
    calculateSubtotal();
  }, [rows,taxRate]);

  //shortcode for  switch btn

  const [showSwitchDropdown, setshowSwitchDropdown] = useState(false);
  const [switchfilteredShortcuts, setSwitchFilteredShortcuts] = useState([]);
  const [clientmsg, setClientmsg] = useState("");
  const [switchanchorEl, setSwitchAnchorEl] = useState(null);

  const toggleSwitchDropdown = (event) => {
    setSwitchAnchorEl(event.currentTarget);
    setshowSwitchDropdown(!showSwitchDropdown);
  };

  const handleSwitchAddShortcut = (shortcut) => {
    setClientmsg((prevText) => prevText + `[${shortcut}]`);
    setshowSwitchDropdown(false);
  };

  useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setSwitchFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes("")));
  }, [shortcuts]);

  const [isFormFilled, setIsFormFilled] = useState(false);
  const handleCloseInvoiceTemp = () => {
    if (isFormFilled) {
      const confirmCancel = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
      if (confirmCancel) {
        navigate("/firmtemp/templates/invoices");
      }
    } else {
      navigate("/firmtemp/templates/invoices");
    }
  };

  useEffect(() => {
    // Check if form is filled
    const checkIfFormFilled = () => {
      if (templatename || description || paymentMode || emailToClient || clientmsg || payUsingCredits || invoiceReminders || lineItems) {
        setIsFormFilled(true);
      } else {
        setIsFormFilled(false);
      }
    };

    checkIfFormFilled();
  }, [templatename, description, paymentMode, emailToClient, clientmsg, payUsingCredits, invoiceReminders, lineItems]);

  const [anchorElNew, setAnchorElNew] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleMenuOpen = (event, index) => {
    setAnchorElNew(event.currentTarget);
    setSelectedRow(index);
  };

  const handleMenuClose = () => {
    setAnchorElNew(null);
    setSelectedRow(null);
  };

  // const handleEditService = (row) => {
  //   console.log("Row data:", row);

  //   setSelectedRowData(row);
  //   handleMenuClose();
  //   setIsEditDrawerOpen(true);
  // };
  const handleEditService = (row, index) => {
    console.log("Row data:", row);

    setSelectedRowData(row);
    setSelectedRowIndex(index); // Save the index of the selected row
    handleMenuClose();
    setIsEditDrawerOpen(true);
  };
  // const handleSaveChanges = () => {
  //   if (selectedRowIndex !== null) {
  //     const updatedRows = [...rows];
  //     updatedRows[selectedRowIndex] = { ...selectedRowData }; // Update the row with new data
  //     setRows(updatedRows); // Update the state with the new rows

  //     console.log("Updated Rows:", updatedRows);
  //   }

  //   handleEditDrawerClose();
  // };
  const handleSaveChanges = () => {
    if (selectedRowIndex !== null) {
      const updatedRows = [...rows];

      // Calculate the amount based on rate and qty
      const rateValue = parseFloat(selectedRowData.rate.replace(/[^0-9.-]+/g, "")); // Removing currency symbol
      const qtyValue = parseInt(selectedRowData.qty) || 0; // Convert to integer

      const amount = (rateValue * qtyValue).toFixed(2); // Calculate amount
      updatedRows[selectedRowIndex] = {
        ...selectedRowData,
        amount: `$${amount}`, // Store amount in the correct format
      }; // Update the row with new data including the calculated amount

      setRows(updatedRows); // Update the state with the new rows

      console.log("Updated Rows:", updatedRows);
    }

    handleEditDrawerClose();
  };
  const handleDeleteService = () => {
    console.log("Delete row:", selectedRow);
    deleteRow(selectedRow);
    handleMenuClose();
  };

  const handleDuplicate = () => {
    if (selectedRow !== null) {
      const duplicatedRow = {
        ...rows[selectedRow],
        productName: rows[selectedRow].productName ? `${rows[selectedRow].productName} Copy` : "Copy",
      };
      const updatedRows = [...rows, duplicatedRow];
      setRows(updatedRows); // Update the state with the duplicated row
      console.log("Duplicated row:", duplicatedRow);
    }
    handleMenuClose();
  };

  const CATEGORY_API = process.env.REACT_APP_CATEGORY_URL;
  const [servicename, setservicename] = useState("");
  const [discription, setdiscription] = useState("");
  const [rate, setrate] = useState("$ 0.00");
  const [service, setService] = useState(false);
  const handleRateChange = (e) => {
    // Remove the dollar sign and any non-numeric characters, and keep the input as a number
    const value = e.target.value.replace(/[^0-9.]/g, "");

    // Update the rate, ensuring it includes the $ symbol
    setrate(`$ ${value}`);
  };
  const options = [
    // { label: "Select Rate Type", value: "" },
    { label: "Item", value: "item" },
    { label: "Hour", value: "hour" },
  ];
  const [selectedRateOption, setSelectedRateOption] = useState("");

  const handleRateTypeChange = (event, newValue) => {
    setSelectedRateOption(newValue);
    console.log("Selected rate type:", newValue);
  };
  const [selectedCategory, setSelectedCategory] = useState(null);
  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };
  const handleServiceSwitch = (checked) => {
    setSelectedRowData((prevState) => ({
      ...prevState,
      tax: checked, // Update the tax value when switch is toggled
    }));
  };

  //category right side form
  const createservicetemp = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      serviceName: selectedRowData?.productName,
      description: selectedRowData?.description,
      rate: selectedRowData?.rate,
      ratetype: selectedRateOption?.value,
      tax: selectedRowData?.tax,

      category: selectedCategory ? selectedCategory.value : null,
      active: "true",
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${SERVICE_API}/workflow/services/servicetemplate`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.message);

        if (result && result.message === "ServiceTemplate created successfully") {
          toast.success("ServiceTemplate created successfully");
          handleNewDrawerClose();
          // fetchServicesData();
          // Clear form fields
          setservicename("");
          setdiscription("");
          setrate("");
          setSelectedRateOption("");
          setService(false);
          setSelectedCategory(null);
        } else {
          toast.error(result.message || "Failed to create Service Template");
        }
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = error.response && error.response.message ? error.response.message : "Failed to create invoice";
        toast.error(errorMessage);
      });
  };
  const [categorycreate, setcategorycreate] = useState();
  const [isCategoryFormOpen, setCategoryFormOpen] = useState(false);
  const handleCategoryFormClose = () => {
    setCategoryFormOpen(false);
  };
  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const handleNewDrawerClose = () => {
    setIsNewDrawerOpen(false);
  };
  // category create

  const [categoryData, setCategoryData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // const url = `${API_KEY}/common/user/`;
      const url = `${CATEGORY_API}/workflow/category/categorys`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setCategoryData(data.category);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const categoryoptions = categoryData.map((category) => ({
    value: category._id,
    label: category.categoryName,
  }));
  const createCategory = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      categoryName: categorycreate,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${CATEGORY_API}/workflow/category/newcategory`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result && result.message === "Category created successfully") {
          toast.success("Category created successfully");
          handleCategoryFormClose(false);
          fetchData();
          setcategorycreate();
        } else {
          toast.error(result.message || "Failed to create Service Template");
        }
      })
      .catch((error) => console.error(error));
  };
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const handleSaveAsNewService = (row) => {
    console.log("Row data:", row);
    setSelectedRowData(row);
    setIsNewDrawerOpen(true); // Open the drawer if required
    handleMenuClose();
  };

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const handleEditDrawerClose = () => {
    setIsEditDrawerOpen(false);
  };
  const [tax, setTax] = useState(false);
  // const handleServiceWitch = (checked) => {
  //   setTax(checked);
  // };
  const handleServiceWitch = (checked) => {
    setSelectedRowData({ ...selectedRowData, tax: checked });
  };
  const [totalamount, setTotalamount] = useState("");

  useEffect(() => {
    const rate = parseFloat(selectedRowData?.rate?.replace("$", "")) || 0;
    const qty = selectedRowData?.qty || 0;
    const calculatedAmount = rate * qty;

    console.log("Rate: ", rate, "Qty: ", qty, "Total Amount: $", calculatedAmount.toFixed(2));
    setTotalamount(`$${calculatedAmount.toFixed(2)}`);
  }, [selectedRowData?.rate, selectedRowData?.qty]);

  console.log(totalamount);

  return (
    <Container>
      <Box sx={{ mt: 2 }}>
        <Box>
          <form>
            <Box>
              <Typography variant="h5" gutterBottom>
                Edit Invoice Template
              </Typography>
              <Box mt={2} mb={2}>
                <hr />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5.8} mt={2}>
                  <Box>
                    <Box>
                      <InputLabel sx={{ color: "black" }}>Template Name</InputLabel>
                      <TextField
                        // margin="normal"
                        fullWidth
                        name="TemplateName"
                        placeholder="Template Name"
                        size="small"
                        sx={{ mt: 2 }}
                        value={templatename}
                        onChange={(e) => setTemplatename(e.target.value)}
                      />
                    </Box>

                    <Box>
                      <InputLabel sx={{ color: "black", mt: 2 }}>Description</InputLabel>
                      <TextField fullWidth name="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" size="small" inputProps={{ maxLength: 50000 }} sx={{ mt: 2 }} />
                    </Box>

                    <Box>
                      <Button variant="contained" color="primary" onClick={toggleDropdown} sx={{ mt: 2 }}>
                        Add Shortcode
                      </Button>

                      <Popover
                        open={showDropdown}
                        anchorEl={anchorEl}
                        onClose={handleCloseDropdown}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <Box>
                          <List className="dropdown-list" sx={{ width: "300px", height: "300px", cursor: "pointer" }}>
                            {filteredShortcuts.map((shortcut, index) => (
                              <ListItem key={index} onClick={() => handleAddShortcut(shortcut.value)}>
                                <ListItemText
                                  primary={shortcut.title}
                                  primaryTypographyProps={{
                                    style: {
                                      fontWeight: shortcut.isBold ? "bold" : "normal",
                                    },
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Popover>
                    </Box>

                    <Box>
                      <InputLabel sx={{ color: "black", mt: 2 }}>Choose payment method</InputLabel>
                      {/* <Select
                          size='small'
                          sx={{ width: '100%', mt: 2 }}
                          value={paymentMode}
                          onChange={handlePaymentOptionChange}
                        >
                          {paymentsOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select> */}
                      <Select options={paymentsOptions} onChange={handlePaymentOptionChange} value={paymentMode} />
                    </Box>

                    <Box mt={2}>
                      <FormControlLabel control={<Switch onChange={handleEmailToClient} checked={emailToClient} color="primary" />} label={"Send email to client when invioce created"} />
                      {emailToClient && (
                        <>
                          <Box mt={2}>
                            <TextField
                              variant="outlined"
                              fullWidth
                              value={clientmsg}
                              onChange={(e) => setClientmsg(e.target.value)}
                              // setClientmsg
                            />
                          </Box>

                          <Box>
                            <Button variant="contained" color="primary" onClick={toggleSwitchDropdown} sx={{ mt: 2 }}>
                              Add Shortcode
                            </Button>

                            <Popover
                              open={showSwitchDropdown}
                              anchorEl={switchanchorEl}
                              onClose={handleCloseDropdown}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                            >
                              <Box>
                                <List className="dropdown-list" sx={{ width: "300px", height: "300px", cursor: "pointer" }}>
                                  {switchfilteredShortcuts.map((shortcut, index) => (
                                    <ListItem key={index} onClick={() => handleSwitchAddShortcut(shortcut.value)}>
                                      <ListItemText
                                        primary={shortcut.title}
                                        primaryTypographyProps={{
                                          style: {
                                            fontWeight: shortcut.isBold ? "bold" : "normal",
                                          },
                                        }}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            </Popover>
                          </Box>
                        </>
                      )}
                    </Box>

                    <Box mt={2}>
                      <FormControlLabel control={<Switch onChange={handlePayUsingCredits} checked={payUsingCredits} color="primary" />} label={"Pay invoice with credits if available"} />
                    </Box>

                    <Box mt={2}>
                      <FormControlLabel control={<Switch onChange={handleInvoiceReminders} checked={invoiceReminders} color="primary" />} label={"Send Reminders to clients"} />
                      {invoiceReminders && (
                        <>
                          <Box sx={{ display: "flex", gap: "20px", flexDirection: "column" }}>
                            <Box>
                              <InputLabel sx={{ color: "black" }}>Days until next reminder</InputLabel>
                              <TextField
                                // margin="normal"
                                fullWidth
                                name="Days until next reminder"
                                placeholder="Days until next reminder"
                                size="small"
                                sx={{ mt: 2 }}
                                value={daysNextReminder}
                                onChange={(e) => setDaysNextReminder(e.target.value)}
                              />
                            </Box>

                            <Box mb={2}>
                              <InputLabel sx={{ color: "black" }}>Number of reminders</InputLabel>
                              <TextField
                                // margin="normal"
                                fullWidth
                                name="Number of reminders"
                                placeholder="Number of reminders"
                                size="small"
                                sx={{ mt: 2 }}
                                value={numOfReminder}
                                onChange={(e) => setnumOfReminder(e.target.value)}
                              />
                            </Box>
                          </Box>
                        </>
                      )}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={0.4} sx={{ display: { xs: "none", sm: "block" } }}>
                  <Box
                    className="vertical-line"
                    sx={{
                      // borderLeft: '1px solid black',
                      height: "100%",
                      ml: 1.5,
                    }}
                  ></Box>
                </Grid>
                <Grid item xs={26} sm={5.8}>
                  <Box className="invoice-section-three">
                    <div className="invoice-section-three">
                      <Box sx={{ margin: "20px 0 10px 0" }}>
                        <Typography variant="h6">Line items</Typography>
                        <Typography variant="body2">Client-facing itemized list of products and services</Typography>
                      </Box>

                      {/* <Box sx={{ overflowX: 'auto', width: '100%' }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell >PRODUCT OR SERVICE</TableCell>
                                <TableCell>DESCRIPTION</TableCell>
                                <TableCell>RATE</TableCell>
                                <TableCell>QTY</TableCell>
                                <TableCell>AMOUNT</TableCell>
                                <TableCell>TAX</TableCell>
                                <TableCell />
                                <TableCell />
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows.map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <CreatableSelect
                                      placeholder="Product or Service"
                                      options={serviceoptions}
                                      value={serviceoptions.find(option => option.label === row.productName) || { label: row.productName, value: row.productName }}
                                      onChange={(selectedOption) => handleServiceChange(index, selectedOption)}
                                      onInputChange={(inputValue, actionMeta) => handleServiceInputChange(inputValue, actionMeta, index)}
                                      isClearable
                                      styles={{
                                        container: (provided) => ({
                                          ...provided,
                                          width: '180px',
                                        }),
                                        control: (provided) => ({
                                          ...provided,
                                          width: '180px',

                                        }),
                                      }}
                                    />

                                  </TableCell>

                                  <TableCell>
                                    <input type='text' name='description' value={row.description} onChange={(e) => handleInputChange(index, e)} style={{ border: 'none' }} placeholder='Description' />
                                  </TableCell>
                                  <TableCell>
                                    <input type='text' name='rate' value={row.rate} onChange={(e) => handleInputChange(index, e)} style={{ border: 'none' }} />
                                  </TableCell>
                                  <TableCell>
                                    <input type='text' name='qty' value={row.qty} onChange={(e) => handleInputChange(index, e)} style={{ border: 'none' }} />
                                  </TableCell>
                                  <TableCell className={row.isDiscount ? 'discount-amount' : ''}>{row.amount}</TableCell>
                                  <TableCell>
                                    <Checkbox name='tax' checked={row.tax} onChange={(e) => handleInputChange(index, e)} />
                                  </TableCell>
                                  <TableCell>
                                    <IconButton>
                                      <BsThreeDotsVertical />
                                    </IconButton>
                                  </TableCell>
                                  <TableCell>
                                    <IconButton onClick={() => deleteRow(index)}>
                                      <RiCloseLine />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box> */}
                      <Box sx={{ overflow: "auto", width: "100%" }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ position: "sticky", left: 0, backgroundColor: "white", zIndex: 1 }}>Product or service</TableCell>
                              <TableCell>Description</TableCell>
                              <TableCell>Rate</TableCell>
                              <TableCell>Qty</TableCell>
                              <TableCell>Amount</TableCell>
                              <TableCell>Tax</TableCell>
                              <TableCell />
                              <TableCell />
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rows.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell sx={{ position: "sticky", left: 0, backgroundColor: "white", zIndex: 1 }}>
                                  {/* <CreatableSelect
                                      placeholder="Product or Service"
                                      options={serviceoptions}
                                      value={row.productName ? serviceoptions.find(option => option.label === row.productName) || { label: row.productName, value: row.productName } : null}
                                      onChange={(selectedOption) => handleServiceChange(index, selectedOption)}
                                      isClearable
                                      styles={{
                                        container: (provided) => ({ ...provided, width: '180px' }),
                                        control: (provided) => ({ ...provided, width: '180px' }),
                                        menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                                      }}
                                      menuPortalTarget={document.body}
                                    /> */}
                                  <CreatableSelect
                                    // placeholder='Product or Service'
                                    placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
                                    options={serviceoptions}
                                    // value={serviceoptions.find(option => option.label === row.productName) || { label: row.productName, value: row.productName }}
                                    value={row.productName ? serviceoptions.find((option) => option.label === row.productName) || { label: row.productName, value: row.productName } : null}
                                    onChange={(selectedOption) => handleServiceChange(index, selectedOption)}
                                    onInputChange={(inputValue, actionMeta) => handleServiceInputChange(inputValue, actionMeta, index)}
                                    isClearable
                                    styles={{
                                      container: (provided) => ({ ...provided, width: "180px" }),
                                      control: (provided) => ({ ...provided, width: "180px" }),
                                      menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                                    }}
                                    menuPortalTarget={document.body}
                                  />
                                </TableCell>

                                <TableCell>
                                  <input type="text" name="description" value={row.description} onChange={(e) => handleInputChange(index, e)} style={{ border: "none" }} placeholder="Description" />
                                </TableCell>

                                <TableCell>
                                  <input type="text" name="rate" value={row.rate} onChange={(e) => handleInputChange(index, e)} style={{ border: "none" }} />
                                </TableCell>

                                <TableCell>
                                  <input type="text" name="qty" value={row.qty} onChange={(e) => handleInputChange(index, e)} style={{ border: "none" }} />
                                </TableCell>

                                <TableCell>{row.amount}</TableCell>

                                <TableCell>
                                  <Checkbox name="tax" checked={row.tax} onChange={(e) => handleInputChange(index, e)} />
                                </TableCell>

                                {/* <TableCell>
                                  <IconButton>
                                    <BsThreeDotsVertical />
                                  </IconButton>
                                </TableCell> */}
                                <TableCell>
                                  <IconButton onClick={(event) => handleMenuOpen(event, index)}>
                                    <BsThreeDotsVertical />
                                  </IconButton>
                                  <Menu anchorEl={anchorElNew} open={Boolean(anchorElNew) && selectedRow === index} onClose={handleMenuClose} anchorOrigin={{ vertical: "top", horizontal: "left" }} transformOrigin={{ vertical: "top", horizontal: "left" }}>
                                    <MenuItem onClick={() => handleEditService(row, index)}>Edit</MenuItem>
                                    <MenuItem onClick={handleDeleteService}>Delete</MenuItem>
                                    <MenuItem onClick={() => handleSaveAsNewService(row)}>Save as new service</MenuItem>
                                    <MenuItem onClick={handleDuplicate}>Duplicate</MenuItem>
                                  </Menu>
                                </TableCell>

                                <TableCell>
                                  <IconButton onClick={() => deleteRow(index)}>
                                    <RiCloseLine />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "10px" }}>
                        <Button onClick={() => addRow()} startIcon={<AiOutlinePlusCircle />} sx={{ color: "blue", fontSize: "15px" }}>
                          Line item
                        </Button>
                        <Button onClick={() => addRow(true)} startIcon={<CiDiscount1 />} sx={{ color: "blue", fontSize: "15px" }}>
                          Discount
                        </Button>
                      </Box>

                      <div className="one-time-summary">
                        <Typography variant="h6">Summary</Typography>
                        <Table sx={{ backgroundColor: "#fff" }}>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ width: "10%" }}>Subtotal</TableCell>
                              <TableCell sx={{ width: "10%" }}>Tax Rate</TableCell>
                              <TableCell sx={{ width: "10%" }}>Tax Total</TableCell>
                              <TableCell sx={{ width: "10%" }}>Total</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  $
                                  <input
                                    // type="number"
                                    value={subtotal}
                                    onChange={handleSubtotalChange}
                                    style={{ border: "none", width: "50%" }}
                                  />
                                </Box>
                                {/* <Box sx={{display:'flex',alignItems:'center'}}>
                                  <input
                                    type="number"
                                    value={subtotal}
                                    onChange={handleSubtotalChange}
                                    style={{ border: 'none',width:'50%' }}
                                  />$
                                  </Box> */}
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <input
                                    // type="number"
                                    value={taxRate}
                                    onChange={handleTaxRateChange}
                                    style={{ border: "none", width: "50%" }}
                                  />
                                  %
                                </Box>
                              </TableCell>
                              <TableCell>${taxTotal.toFixed(2)}</TableCell>
                              <TableCell>${totalAmount}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <Box sx={{ mb: 10, mt: 2 }}>
                      <Typography variant="h6" mb={1}>
                        Note to client
                      </Typography>
                      <Editor onChange={handleEditorChange} initialContent={clientNote} />
                    </Box>

                    {/* <Box style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
                        <Box onClick={() => addRow()} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: 'blue', fontSize: '18px' }}>
                          <AiOutlinePlusCircle /> Line item
                        </Box>
                        <Box onClick={() => addRow(true)} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: 'blue', fontSize: '18px' }}>
                          <CiDiscount1 /> Discount
                        </Box>
                      </Box> */}
                  </Box>
                </Grid>
              </Grid>
              <Divider mt={2} />
              <Box sx={{ pt: 2, display: "flex", alignItems: "center", gap: 5 }}>
                <Button onClick={createInvoiceTemp} variant="contained" color="primary">
                  Save & exit
                </Button>
                <Button onClick={createSaveInvoiceTemp} variant="contained" color="primary">
                  Save
                </Button>
                <Button variant="outlined" onClick={handleCloseInvoiceTemp}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
      {/* save as nwe service */}
      <Drawer
        anchor="right"
        open={isNewDrawerOpen}
        onClose={handleNewDrawerClose}
        PaperProps={{
          sx: {
            borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
            width: isSmallScreen ? "100%" : "650px",
            zIndex: 1000,
          },
        }}
      >
        <Box role="presentation" sx={{ borderRadius: isSmallScreen ? "0" : "15px" }}>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: "1px solid grey" }}>
              <Typography variant="h6">Create Service</Typography>
              <RxCross2 onClick={handleNewDrawerClose} style={{ cursor: "pointer" }} />
            </Box>
          </Box>
          <form style={{ margin: "15px" }}>
            <Box>
              <Box>
                <InputLabel sx={{ color: "black" }}>Service Name</InputLabel>
                <TextField
                  // margin="normal"
                  fullWidth
                  name="ServiceName"
                  placeholder="Service Name"
                  size="small"
                  margin="normal"
                  value={selectedRowData?.productName || ""} // Use selected row data
                  onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })}
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <InputLabel sx={{ color: "black" }}>Description</InputLabel>
                <TextField
                  fullWidth
                  name="Description"
                  placeholder="Description"
                  size="small"
                  margin="normal"
                  value={selectedRowData?.description || ""} // Use selected row data
                  onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box width="50%">
                  <Typography sx={{ color: "black" }}>Rate</Typography>
                  <TextField
                    fullWidth
                    name="Rate"
                    placeholder="Rate"
                    size="small"
                    sx={{ mt: 1 }}
                  
                    value={selectedRowData?.rate || ""} // Use selected row data
                    onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })}
                  />
                </Box>

                <Box width="50%">
                  <Typography sx={{ color: "black" }}>Rate Type</Typography>
                  <Autocomplete
                    size="small"
                    fullWidth
                    sx={{ mt: 1 }}
                    options={options}
                    getOptionLabel={(option) => option?.label || ""}
                    value={selectedOption}
                    onChange={handleRateTypeChange}
                    renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Select Rate Type" />}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{
                          margin: "4px",
                          cursor: "pointer",
                        }}
                      >
                        <Typography>{option.label}</Typography>
                      </Box>
                    )}
                  />
                </Box>
              </Box>

              <Box mt={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedRowData?.tax || false} // Use the tax value from state
                      onChange={(event) => handleServiceSwitch(event.target.checked)}
                      color="primary"
                    />
                  }
                  label={"Tax"}
                />
              </Box>
              <Box>
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mt: 2 }}>
                    Category
                  </Typography>
                </Box>
                <Box>
                  <InputLabel sx={{ color: "black", mt: 2 }}>Category Name</InputLabel>
                  <Autocomplete
                    size="small"
                    fullWidth
                    sx={{ mt: 2 }}
                    options={categoryoptions}
                    getOptionLabel={(option) => option.label} // Adjust based on your data structure
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    renderInput={(params) => <TextField {...params} placeholder="Category Name" variant="outlined" />}
                    clearOnEscape // Equivalent to isClearable
                    isOptionEqualToValue={(option, value) => option.value === value.value} // Compare options for equality
                  />
                </Box>
              </Box>
              <Box>
                <Button variant="contained" color="primary" onClick={setCategoryFormOpen} sx={{ mt: 4, ml: 1 }}>
                  Create category
                </Button>

                {/* category form */}
                <Drawer
                  anchor="right"
                  open={isCategoryFormOpen}
                  onClose={handleCategoryFormClose}
                  PaperProps={{
                    sx: {
                      borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
                      width: isSmallScreen ? "100%" : "650px",
                      maxWidth: "100%",
                    },
                  }}
                >
                  <Box>
                    <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px" }}>
                      <ArrowBackRoundedIcon onClick={handleCategoryFormClose} style={{ cursor: "pointer" }} />
                    </Box>
                    <Divider />
                  </Box>
                  <Box p={3}>
                    <InputLabel sx={{ color: "black", mt: 2 }}>Category Name</InputLabel>

                    <TextField fullWidth name="Rate" placeholder="Category Name" size="small" margin="normal" value={categorycreate} onChange={(e) => setcategorycreate(e.target.value)} />
                  </Box>
                  <Box sx={{ pt: 2, display: "flex", alignItems: "center", gap: 5, margin: "8px", ml: 3 }}>
                    <Button variant="contained" color="primary" onClick={createCategory}>
                      Create
                    </Button>
                    <Button variant="outlined" onClick={handleCategoryFormClose}>
                      Cancel
                    </Button>
                  </Box>
                </Drawer>
              </Box>
              <Box sx={{ pt: 5, display: "flex", alignItems: "center", gap: 5, ml: 1 }}>
                <Button variant="contained" color="primary" onClick={createservicetemp}>
                  Save
                </Button>
                <Button variant="outlined" onClick={handleNewDrawerClose}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Drawer>
      {/* category  */}
      <Drawer
        anchor="right"
        open={isCategoryFormOpen}
        onClose={handleCategoryFormClose}
        PaperProps={{
          sx: {
            borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
            width: isSmallScreen ? "100%" : "650px",
            maxWidth: "100%",
          },
        }}
      >
        <Box>
          <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px" }}>
            <ArrowBackRoundedIcon onClick={handleCategoryFormClose} style={{ cursor: "pointer" }} />
          </Box>
          <Divider />
        </Box>
        <Box p={3}>
          <InputLabel sx={{ color: "black", mt: 2 }}>Category Name</InputLabel>

          <TextField fullWidth name="Rate" placeholder="Category Name" size="small" margin="normal" value={categorycreate} onChange={(e) => setcategorycreate(e.target.value)} />
        </Box>
        <Box sx={{ pt: 2, display: "flex", alignItems: "center", gap: 5, margin: "8px", ml: 3 }}>
          <Button variant="contained" color="primary" onClick={createCategory}>
            Create
          </Button>
          <Button variant="outlined" onClick={handleCategoryFormClose}>
            Cancel
          </Button>
        </Box>
      </Drawer>

      {/* edit service */}
      <Drawer
        anchor="right"
        open={isEditDrawerOpen}
        onClose={handleEditDrawerClose}
        PaperProps={{
          sx: {
            borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
            width: isSmallScreen ? "100%" : "650px",
            zIndex: 1000,
          },
        }}
      >
        <Box role="presentation" sx={{ borderRadius: isSmallScreen ? "0" : "15px" }}>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: "1px solid grey" }}>
              <Typography variant="h6">Edit Item</Typography>
              <RxCross2 onClick={handleEditDrawerClose} style={{ cursor: "pointer" }} />
            </Box>
            <Box p={2}>
              <Typography variant="h6" fontWeight="bold">
                Product or service
              </Typography>
              <TextField size="small" margin="normal" value={selectedRowData?.productName || ""} fullWidth onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })} />
              <Box>
                <Typography>Description</Typography>
                <TextField size="small" margin="normal" value={selectedRowData?.description || ""} fullWidth multiline onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })} />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mt: 1 }}>
                <Box>
                  <Typography>Rate</Typography>
                  <TextField size="small" margin="normal" value={selectedRowData?.rate || ""} fullWidth onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })} />
                </Box>
                <Box>
                  <Typography>QTY</Typography>
                  <TextField size="small" margin="normal" value={selectedRowData?.qty || ""} fullWidth onChange={(e) => setSelectedRowData({ ...selectedRowData, qty: e.target.value })} />
                </Box>
                <Box>
                  <Typography>Amount</Typography>
                  <TextField size="small" margin="normal" fullWidth disabled value={totalamount} />
                </Box>
              </Box>
              <Box mt={2}>
                <FormControlLabel control={<Switch checked={selectedRowData?.tax} onChange={(event) => handleServiceWitch(event.target.checked)} color="primary" />} label={"Tax"} />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
                <Button variant="contained" onClick={handleSaveChanges}>
                  Save
                </Button>
                <Button variant="outlined" onClick={handleEditDrawerClose}>
                  {" "}
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Container>
  );
};

export default InvoiceTempUpdate;
