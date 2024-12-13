import React, { useState, useEffect, useMemo } from "react";
import { Menu, useMediaQuery, Checkbox, Autocomplete, Switch, FormControlLabel, Box, Button, Drawer, Typography, IconButton, Divider, Select, MenuItem, InputLabel, TextField, FormControl, FormLabel, InputAdornment, Popover, ListItem, List, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Unstable_Grid2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { AiOutlinePlusCircle } from "react-icons/ai";
import { CiDiscount1 } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";
import "../../Billing/Invoices";
import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { CiMenuKebab } from "react-icons/ci";
import CreatableSelect from "react-select/creatable";
import { useParams } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { useTheme } from "@mui/material/styles";
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
const CreateInvoice = ({ charLimit = 4000, onClose }) => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const SERVICE_API = process.env.REACT_APP_SERVICES_URL;
  const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;

  const { data } = useParams();
  const theme = useTheme();
  //   const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [invoiceTemplates, setInvoiceTemplates] = useState([]);
  const [selectedaccount, setSelectedaccount] = useState(null);
  const [accountdata, setaccountdata] = useState([]);
  const [description, setDescription] = useState("");
  const [payInvoice, setIsPayInvoice] = useState(false);
  const [emailInvoice, setIsEmailInvoice] = useState(false);
  const [reminders, setReminders] = useState(false);
  const [scheduledInvoice, setScheduledInvoice] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [invoicenumber, setinvoicenumber] = useState();
  const [paymentMode, setPaymentMode] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [shortcuts, setShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");

  useEffect(() => {
    fetchAccountData();
  }, []);

  console.log(selectedaccount);
  const fetchAccountData = async () => {
    try {
      const response = await fetch(`${ACCOUNT_API}/accounts/accountdetails`);
      const result = await response.json();
      setaccountdata(result.accounts);
      console.log(result.accounts);
      console.log(data);

      const selectedAccount = result.accounts.find((account) => account._id === data); // Assume data contains the account ID
      console.log(selectedAccount);

      if (selectedAccount) {
        const account = {
          label: selectedAccount.accountName,
          value: selectedAccount._id,
        };
        console.log(account);
        setSelectedaccount(account);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // console.log(userdata);
  const accountoptions = accountdata.map((account) => ({
    value: account._id,
    label: account.accountName,
  }));

  const handleAccountChange = (event, newValue) => {
    console.log(newValue);
    setSelectedaccount(newValue);
  };

  const fetchInvoiceTemplates = async () => {
    try {
      const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch InvoiceTemplate");
      }
      const data = await response.json();
      setInvoiceTemplates(data.invoiceTemplate);
      console.log(data);
    } catch (error) {
      console.error("Error fetching Invoice Templates:", error);
    }
  };

  useEffect(() => {
    fetchInvoiceTemplates();
  }, []);

  const invoiceoptions = invoiceTemplates.map((invoice) => ({
    value: invoice._id,
    label: invoice.templatename,
  }));

  const [selectInvoiceTemp, setSelectedInvoiceTemp] = useState("");
  const handleInvoiceTempChange = (event, selectedOptions) => {
    setSelectedInvoiceTemp(selectedOptions);
    fetchinvoicetempbyid(selectedOptions.value);
  };

  const paymentsOptions = [
    { value: "Bank Debits", label: "Bank Debits" },
    { value: "Credit Card", label: "Credit Card" },
    { value: "Credit Card or Bank Debits", label: "Credit Card or Bank Debits" },
  ];
  const handlePaymentOptionChange = (event, selectedOption) => {
    setPaymentMode(selectedOption);
  };

  // team member
  const USER_API = process.env.REACT_APP_USER_URL;
  const [selecteduser, setSelectedUser] = useState("");
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchData = async () => {
    try {
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleuserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
  };
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  useEffect(() => {
    fetchServiceData();
  }, []);

  const [rows, setRows] = useState([]);
  const [servicedata, setServiceData] = useState([]);

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
  const handleServiceChange = (index, selectedOptions) => {
    const newRows = [...rows];
    newRows[index].productName = selectedOptions ? selectedOptions.label : "";
    setRows(newRows);
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

  const addRow = (isDiscountRow = false) => {
    const newRow = isDiscountRow ? { productName: "", description: "", rate: "$-10.00", qty: "1", amount: "$-10.00", tax: false, isDiscount: true } : { productName: "", description: "", rate: "$0.00", qty: "1", amount: "$0.00", tax: false, isDiscount: false };
    setRows([...rows, newRow]);
  };

  const deleteRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };

  const fetchinvoicetempbyid = async (id) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.invoiceTemplate);
        setDescription(result.invoiceTemplate.description);
        setIsPayInvoice(result.invoiceTemplate.payInvoicewithcredits);
        setIsEmailInvoice(result.invoiceTemplate.sendEmailWhenInvCreated);
        setReminders(result.invoiceTemplate.sendReminderstoClients);

        const paymentMethod = {
          value: result.invoiceTemplate.paymentMethod,
          label: result.invoiceTemplate.paymentMethod,
        };
        setPaymentMode(paymentMethod);
        // Assuming lineitems is an array of objects and each object matches the structure needed for rows
        console.log(result.invoiceTemplate.lineItems);
        const lineitems = result.invoiceTemplate.lineItems.map((item) => ({
          productName: item.productorService || "",
          description: item.description || "",
          rate: String(item.rate || "$0.00"), // Convert rate to string
          qty: String(item.quantity || "1"), // Convert qty to string
          amount: String(item.amount || "$0.00"), // Convert amount to string
          tax: item.tax || false,
          isDiscount: item.isDiscount || false,
        }));
        setRows(lineitems);
        setSubtotal(result.invoiceTemplate.summary.subtotal);
        setTaxRate(result.invoiceTemplate.summary.taxRate);
        console.log(result.invoiceTemplate.summary.taxRate);
        setTaxTotal(result.invoiceTemplate.summary.taxTotal);
        setTotalAmount(result.invoiceTemplate.summary.total);
      })
      .catch((error) => console.error(error));
  };

  const [startDate, setStartDate] = useState(null);
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (value.length <= charLimit) {
      setDescription(value);
      setCharCount(value.length);
    }
  };

  const handleAddShortcut = (shortcut) => {
    const updatedTextValue = description + `[${shortcut}]`;
    if (updatedTextValue.length <= charLimit) {
      setDescription(updatedTextValue);
      setCharCount(updatedTextValue.length);
    }
    setShowDropdown(false);
  };

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
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

  const handlePayInvoiceChange = (event) => {
    setIsPayInvoice(event.target.checked);
  };
  const handleEmailInvoiceChange = (event) => {
    setIsEmailInvoice(event.target.checked);
  };
  const handleRemindersChange = (event) => {
    setReminders(event.target.checked);
  };
  const handleScheduledInvoiceChange = (event) => {
    setScheduledInvoice(event.target.checked);
  };

  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
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
  //     console.log(subtotal);
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
  const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
  const lineItems = rows.map((item) => ({
    productorService: item.productName, // Assuming productName maps to productorService
    description: item.description,
    rate: item.rate.replace("$", ""), // Removing '$' sign from rate
    quantity: item.qty,
    amount: item.amount.replace("$", ""), // Removing '$' sign from amount
    tax: item.tax.toString(), // Converting boolean to string
  }));
  const createinvoice = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      account: selectedaccount.value,
      invoicenumber: invoicenumber,
      invoicedate: startDate,
      description: description,
      invoicetemplate: selectInvoiceTemp.value,
      paymentMethod: paymentMode.value,
      teammember: selecteduser.value,
      emailinvoicetoclient: emailInvoice,
      scheduleinvoicedate: "Wed May 08 2024 00:00:00 GMT+0530 (India Standard Time)",
      scheduleinvoicetime: "12.00",
      payInvoicewithcredits: payInvoice,
      reminders: reminders,
      scheduleinvoice: scheduledInvoice,
      daysuntilnextreminder: "",
      numberOfreminder: "",
      lineItems: lineItems,
      summary: {
        subtotal: subtotal,
        taxRate: taxRate,
        taxTotal: taxTotal,
        total: totalAmount,
      },
      active: "true",
    });

    // console.log(raw)
    // console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${INVOICE_NEW}/workflow/invoices/invoice`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result && result.message === "Invoice created successfully") {
          toast.success("Invoice created successfully");
          onClose();
          fetchInvoiceData();
        } else {
          toast.error(result.message || "Failed to create InvoiceTemplate");
        }
      })
      .catch((error) => console.error(error));
  };

  const [billingInvoice, setBillingInvoice] = useState([]);

  const fetchInvoiceData = async () => {
    try {
      const url = `${INVOICE_NEW}/workflow/invoices/invoice`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch email templates");
      }
      const data = await response.json();
      setBillingInvoice(data.invoice);
    } catch (error) {
      console.error("Error fetching email templates:", error);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, []);

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
  const Rateoptions = [
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
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
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
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [firstContactEmail, setFirstContactEmail] = useState("");

  const contactMail = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
  
    console.log("Calling API with ID:", selectedaccount?.value); // Debug log
  
    fetch(`${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyid/${selectedaccount?.value}`, requestOptions)
      .then((response) => {
        console.log("Response status:", response.status); // Debug log
        return response.json();
      })
      .then((result) => {
        console.log("API Result:", result); // Debug log
        
        if (result?.accountlist?.Contacts && Array.isArray(result.accountlist.Contacts)) {
          const email = result.accountlist.Contacts[0]?.email;
          if (email) {
            console.log("First Contact Email:", email); // Debug log
            setFirstContactEmail(email); // Update state
          } else {
            console.error("First contact does not have an email.");
            setFirstContactEmail("[CONTACT EMAIL]"); // Handle missing email
          }
        } else {
          console.error("No contacts found in the response.");
          setFirstContactEmail("[CONTACT EMAIL]"); // Handle missing contacts
        }
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
        setFirstContactEmail("Error fetching email"); // Handle fetch error
      });
  };
  
  useEffect(() => {
    if (selectedaccount?.value) {
      contactMail();
    }
  }, [selectedaccount]);
 //preview drawer
 const [previewDrawerOpen, setpreviewDrawerOpen] = useState(false);
 const handleOpenpreviewDrawer = () => setpreviewDrawerOpen(true);
 const handleClosepreviewDrawer = () => setpreviewDrawerOpen(false);


  return (
    <Box>
      <Box sx={{display:'flex', alignItems:'center'}}>
      <Typography p={2} variant="h6">
        Create Invoice
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Box
      onClick={handleOpenpreviewDrawer}
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        color: "primary.main",
      }}
    >
      <PlagiarismIcon sx={{ marginRight: 0.5 }} fontSize="small" />
      <Typography color="primary">Preview</Typography>
    </Box>

   

    <Box onClick={handleClose} sx={{ cursor: "pointer" }}>
      <CloseIcon />
    </Box>
  </Box>
      </Box>
     <Box>
          <Drawer
            anchor="right"
            open={previewDrawerOpen}
            onClose={handleClosepreviewDrawer}
            PaperProps={{
              sx: {
                width: 800,
                p: 2,
                background: '#f8fafc',

              },
            }}
          >
            <Box sx={{ padding: 4 }}>
              {/* Invoice Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>Preview</Typography>
                <CloseIcon sx={{ cursor: "pointer", color: "rgb(24, 118, 211)" }} onClick={handleClosepreviewDrawer} />
              </Box>
              <Divider sx={{ mt: 2 }} />

              {/* Table */}
              <TableContainer component={Paper} sx={{ background: '#fdfdfd', marginBottom: 4, height: { xs: '50vh', md: 'auto' }, mt: 4 }}>
                <Typography
                  variant="h5"
                  sx={{ color: '#ff6700', fontWeight: 'bold', marginBottom: 2, ml: 2, mt: 2 }}
                >
                  Invoice
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ marginBottom: 2, ml: 2, fontSize: 13 }}>
                    {selectedaccount?.label || '[ACCOUNT NAME]'}
                  </Typography>
                  <Typography fontSize={13}>
                    Invoice number: <Typography component="span" sx={{ color: '#cbd5e1', mr: 2, marginBottom: 2, fontSize: 13 }}>[INVOICE_NUMBER]</Typography>
                  </Typography>
                </Box>



                {/* <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ marginBottom: 2, ml: 2, fontSize: 13 }} >{firstContactEmail || "No email available"}</Typography>
                  <Typography fontSize={13}>
                    Date: <Typography component="span" sx={{ mr: 2, marginBottom: 2, fontSize: 13 }}>
                      {startDate ? startDate.format('YYYY-MM-DD') : 'N/A'}
                    </Typography>
                  </Typography>
                </Box> */}


                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ marginBottom: 2, ml: 2, fontSize: 13 }} >{firstContactEmail || "[CONTACT EMAIL]"}</Typography>
                  <Typography fontSize={13}>
                    Date: <Typography component="span" sx={{ mr: 2, marginBottom: 2, fontSize: 13 }}>
                      {startDate ? startDate.format('YYYY-MM-DD') : ''}
                    </Typography>
                  </Typography>
                </Box>

                <Box sx={{ ml: 2, marginBottom: 5, }} >
                  <Typography sx={{ fontSize: 13 }}>Description: {description}</Typography>
                </Box>

                <Table sx={{ marginBottom: 5 }} >
                  <TableHead >
                    <TableRow sx={{ background: "#fff8f5" }}>
                      <TableCell>
                        <strong>Product/Service</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Description</strong>
                      </TableCell>

                      <TableCell align="right">
                        <strong>Rate ($)</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Qty</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Amount</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.productName}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell align="right">{row.rate || '$0.00'}</TableCell>
                        <TableCell align="right">{row.qty || '1'}</TableCell>
                        <TableCell align="right">{row.amount || '$0.00'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Summary Section */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  marginRight: 3,
                  mt: 0
                }}
              >
                <Typography sx={{ textAlign: 'right', width: '100%' }}>
                  <strong>Subtotal:</strong> ${subtotal || '0.00'}
                </Typography>
                <Typography sx={{ textAlign: 'right', width: '100%' }}>
                  <strong>Tax Rate:</strong> {taxRate || '0.00'}%
                </Typography>
                <Typography sx={{ textAlign: 'right', width: '100%' }}>
                  <strong>Tax Total:</strong> ${taxTotal?.toFixed(2) || '0.00'}
                </Typography>
                <Typography
                  sx={{ textAlign: 'right', fontWeight: 'bold', width: '100%', marginTop: 1 }}
                >
                  <strong>Total:</strong> ${totalAmount || '0.00'}
                </Typography>
              </Box>


              {/* Footer Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 3,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={createinvoice}

                >
                  Save & Exit
                </Button>

              </Box>
            </Box>
          </Drawer>
        </Box>

      <Box p={2} sx={{ height: "80vh", overflowY: "auto" }} className="create-invoice">
        <Box>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid xs={6}>
              <Box>
                <InputLabel sx={{ color: "black" }}>Account name, ID or email</InputLabel>

                <Autocomplete
                  options={accountoptions} // Ensure this is an array of objects with { label, value }
                  value={selectedaccount} // Display the selected account
                  onChange={handleAccountChange} // Update the selected account on change
                  getOptionLabel={(option) => option.label || ""} // Safely access label
                  isOptionEqualToValue={(option, value) => option.value === value.value} // Compare values correctly
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      {...props}
                      sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                    >
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => <TextField {...params} placeholder="Select Account" variant="outlined" size="small" sx={{ backgroundColor: "#fff" }} />}
                  sx={{ width: "100%", marginTop: "8px" }}
                />
              </Box>
            </Grid>
            <Grid xs={6}>
              <Box>
                <InputLabel sx={{ color: "black" }}>Invoice Template</InputLabel>
                <Autocomplete options={invoiceoptions} sx={{ mt: 1, mb: 2, backgroundColor: "#fff" }} size="small" value={selectInvoiceTemp} onChange={handleInvoiceTempChange} isOptionEqualToValue={(option, value) => option.value === value.value} getOptionLabel={(option) => option.label || ""} renderInput={(params) => <TextField {...params} placeholder="Invoice Template" />} isClearable={true} />
              </Box>
            </Grid>
          </Grid>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid xs={6}>
              <Box>
                <InputLabel sx={{ color: "black" }}>Invoice Number</InputLabel>
                <TextField fullWidth onChange={(e) => setinvoicenumber(e.target.value)} placeholder="Invoice Number" size="small" sx={{ mt: 1 }} />
              </Box>
            </Grid>
            <Grid xs={6}>
              <Box>
                <InputLabel sx={{ color: "black" }}>Choose payment method</InputLabel>
                <Autocomplete size="small" fullWidth sx={{ mt: 1 }} options={paymentsOptions} getOptionLabel={(option) => option?.label || ""} onChange={handlePaymentOptionChange} value={paymentMode} renderInput={(params) => <TextField {...params} placeholder="Select Payment Mode" variant="outlined" />} isOptionEqualToValue={(option, value) => option.value === value?.value} clearOnEscape />
              </Box>
            </Grid>
          </Grid>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} mt={2}>
            <Grid xs={6}>
              <Box>
                <FormControl fullWidth>
                  <FormLabel sx={{ marginBottom: "8px", color: "black" }}>Date</FormLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker format="DD/MM/YYYY" sx={{ width: "100%", backgroundColor: "#fff" }} selected={startDate} onChange={handleStartDateChange} renderInput={(params) => <TextField {...params} size="small" />} />
                  </LocalizationProvider>
                </FormControl>
              </Box>
            </Grid>
            <Grid xs={6}>
              <Box>
                <label className="email-input-label">Team Member</label>
                <Autocomplete options={options} sx={{ mt: 2, mb: 2, backgroundColor: "#fff" }} size="small" value={selecteduser} onChange={handleuserChange} isOptionEqualToValue={(option, value) => option.value === value.value} getOptionLabel={(option) => option.label || ""} renderInput={(params) => <TextField {...params} placeholder="Team Member" />} isClearable={true} />
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ position: "relative", mt: 2 }}>
            <InputLabel sx={{ color: "black" }}>Description</InputLabel>
            <TextField
              fullWidth
              size="small"
              margin="normal"
              type="text"
              value={description}
              onChange={handleChange}
              placeholder="Description"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography sx={{ color: "gray", fontSize: "12px", position: "absolute", bottom: "15px", right: "15px" }}>
                      {charCount}/{charLimit}
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
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
          <Box mt={2}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Additioal
            </Typography>
            <Box mt={2}>
              <FormControlLabel control={<Switch checked={payInvoice} onChange={handlePayInvoiceChange} color="primary" />} label={"Pay invoice using client credits"} />
            </Box>
            <Box mt={1}>
              <FormControlLabel control={<Switch checked={emailInvoice} onChange={handleEmailInvoiceChange} color="primary" />} label={"Email invoice to client"} />
            </Box>
            <Box mt={1}>
              <FormControlLabel control={<Switch checked={reminders} onChange={handleRemindersChange} color="primary" />} label={"Reminders"} />
            </Box>
            <Box mt={1}>
              <FormControlLabel control={<Switch checked={scheduledInvoice} onChange={handleScheduledInvoiceChange} color="primary" />} label={"Scheduled invoice"} />
            </Box>
          </Box>

          <Box className="invoice-section-three">
            <Box>
              <Typography sx={{ mt: 2, fontWeight: "bold" }} variant="h5">
                Line Items
              </Typography>
              <p style={{ color: "grey" }}>Client-facing itemized list of products and services</p>
            </Box>
            {/* <Box >
                        <MaterialReactTable columns={columns} table={table} />
                    </Box> */}
            <Box sx={{ overflowX: "auto", width: "100%" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>PRODUCT OR SERVICE</TableCell>
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
                        {/* <CreatableSelect
                          placeholder="Product or Service"
                          options={serviceoptions}
                          value={serviceoptions.find((option) => option.label === row.productName) || { label: row.productName, value: row.productName }}
                          onChange={(selectedOption) => handleServiceChange(index, selectedOption)}
                          onInputChange={(inputValue, actionMeta) => handleServiceInputChange(inputValue, actionMeta, index)}
                          isClearable
                          styles={{
                            container: (provided) => ({
                              ...provided,
                              width: "180px",
                            }),
                            control: (provided) => ({
                              ...provided,
                              width: "180px",
                            }),
                          }}
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
                      <TableCell className={row.isDiscount ? "discount-amount" : ""}>{row.amount}</TableCell>
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

            <Box style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "20px" }}>
              <Box onClick={() => addRow()} style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", color: "blue", fontSize: "18px" }}>
                <AiOutlinePlusCircle /> Line item
              </Box>
              <Box onClick={() => addRow(true)} style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", color: "blue", fontSize: "18px" }}>
                <CiDiscount1 /> Discount
              </Box>
            </Box>

            <Box>
              <Box>
                <Typography sx={{ mt: 2, mb: 2 }} variant="h5">
                  Summary
                </Typography>
              </Box>
              <TableContainer component={Paper}>
                <Table sx={{ backgroundColor: "#fff" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>SUBTOTAL</TableCell>
                      <TableCell>TAX RATE</TableCell>
                      <TableCell>TAX TOTAL</TableCell>
                      <TableCell>TOTAL</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                      $
                        <input type="number" value={subtotal} onChange={handleSubtotalChange} style={{ border: "none" }} />
                      </TableCell>
                      <TableCell>
                        <input type="number" value={taxRate} onChange={handleTaxRateChange} style={{ border: "none" }} />%
                      </TableCell>
                      <TableCell>${taxTotal.toFixed(2)}</TableCell>
                      <TableCell>${totalAmount}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
          <Box sx={{ pt: 4, display: "flex", alignItems: "center", gap: 5 }}>
            <Button variant="contained" color="primary" onClick={createinvoice}>
              Save
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
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
                  {/* <Box sx={{ width: "100%", mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <InputLabel sx={{ color: "black" }}>Rate</InputLabel>
                      <TextField
                        fullWidth
                        name="Rate"
                        placeholder="Rate"
                        size="small"
                        margin="normal"
                        value={selectedRowData?.rate || ""} // Use selected row data
                        onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mr: "15px" }}>
                      <InputLabel sx={{ color: "black" }}>Rate Type</InputLabel>
                      <Autocomplete
                        size="small"
                        fullWidth
                        sx={{ mt: 2 }}
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
                  </Grid>
                </Grid>
              </Box> */}
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
                        options={Rateoptions}
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
        </Box>
      </Box>
    </Box>
  );
};

export default CreateInvoice;
