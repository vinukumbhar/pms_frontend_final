import { Switch, Divider, FormControlLabel, Drawer, useMediaQuery, Menu, MenuItem, Checkbox, Box, Button, Typography, Autocomplete, InputAdornment, TextField, InputLabel, ListItem, List, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { CiDiscount1 } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";
import CreatableSelect from "react-select/creatable";
import Editor from "../../Templates/Texteditor/Editor";
import { RxCross2 } from "react-icons/rx";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
const Invoice = ({ charLimit = 4000, serviceandinvoiceSettings, serviceandinvoiceSettingonupdate }) => {
  //get all templateName Record

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const SERVICE_API = process.env.REACT_APP_SERVICES_URL;
  const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
  const [invoiceTemplates, setInvoiceTemplates] = useState([]);
  const [description, setDescription] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [clientNote, setClientNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditorChange = (content) => {
    setClientNote(content);
  };

  const [servicedata, setServiceData] = useState([]);
  // add row
  const [rows, setRows] = useState([{ productName: "", description: "", rate: "$0.00", qty: "1", amount: "$0.00", tax: false, isDiscount: false }]);
  const addRow = (isDiscountRow = false) => {
    const newRow = isDiscountRow ? { productName: "", description: "", rate: "$-10.00", qty: "1", amount: "$-10.00", tax: false, isDiscount: true } : { productName: "", description: "", rate: "$0.00", qty: "1", amount: "$0.00", tax: false, isDiscount: false };
    setRows([...rows, newRow]);
    console.log("After adding row, rows:", [...rows, newRow]);
  };
  const deleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (value.length <= charLimit) {
      setDescription(value);
      setCharCount(value.length);
    }
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
      console.log(data.invoiceTemplate);
    } catch (error) {
      console.error("Error fetching Invoice Templates:", error);
    }
  };

  useEffect(() => {
    fetchInvoiceTemplates();
  }, []);

  // console.log(invoiceTemplates)
  const invoiceoptions = invoiceTemplates.map((invoice) => ({
    value: invoice._id,
    label: invoice.templatename,
  }));

  const [selectInvoiceTemp, setSelectedInvoiceTemp] = useState("");

  const handleInvoiceTempChange = (event, selectedOptions) => {
    setSelectedInvoiceTemp(selectedOptions);
    fetchinvoicetempbyid(selectedOptions.value);
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
        console.log(result.invoiceTemplate.lineItems);
        setDescription(result.invoiceTemplate.description);
        setClientNote(result.invoiceTemplate.notetoclient);
        const lineitems = result.invoiceTemplate.lineItems.map((item) => ({
          // console.log(item);
          productName: item.productorService || "",
          description: item.description || "",
          rate: String(item.rate || "$0.00"), // Convert rate to string
          qty: String(item.quantity || "1"), // Convert qty to string
          amount: String(item.amount || "$0.00"), // Convert amount to string
          tax: item.tax || false,
          isDiscount: item.isDiscount || false,
        }));
        setRows(lineitems);

        if (result.invoiceTemplate.summary && result.invoiceTemplate.summary.taxRate) {
          setTaxRate(result.invoiceTemplate.summary.taxRate);
          console.log(result.invoiceTemplate.summary.taxRate);
        }
      })
      .catch((error) => console.error(error));
  };
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
        // const rate = typeof service.rate === 'number' ? service.rate : 0;
        const rate = service.rate ? parseFloat(service.rate.replace("$", "")) : 0;
        const updatedRow = {
          productName: service.serviceName || "", // Assuming serviceName corresponds to productName
          description: service.description || "",
          // rate: service.rate ? `$${rate.toFixed(2)} ` : '$0.00',
          rate: `$${rate.toFixed(2)}`,
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

  useEffect(() => {
    const calculateSubtotal = () => {
      let subtotal = 0;

      rows.forEach((row) => {
        subtotal += parseFloat(row.amount.replace("$", "")) || 0;
      });
      console.log(subtotal);
      setSubtotal(subtotal);
      calculateTotal(subtotal, taxRate);
    };
    calculateSubtotal();
  }, [rows]);

  // const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  const invoiceissueoptions = ["on acceptance", "specific date"];
  const [issueInvoice, setIssueInvoice] = useState("on acceptance");
  const [dateTimeValue, setDateTimeValue] = useState(null);

  const handleIssueChange = (event, newValue) => {
    setIssueInvoice(newValue);
    // Reset dateTimeValue when switching back to "on acceptance"
    if (newValue === "on acceptance") {
      setDateTimeValue(null);
    }
  };

  const [startDate, setStartDate] = useState(null);
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const timeOptions = Array.from({ length: 13 }, (_, i) => {
    const hour = i === 0 ? 12 : i; // 12 AM for 0, otherwise use i
    const ampm = i < 12 ? "AM" : "PM";
    return `${hour}:00 ${ampm}`;
  });
  const [selectedTime, setSelectedTime] = useState(null);

  const [selecteduser, setSelectedUser] = useState("");
  const [userData, setUserData] = useState([]);
  const USER_API = process.env.REACT_APP_USER_URL;

  useEffect(() => {
    fetchUserData();
  }, []);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchUserData = async () => {
    try {
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleuserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
  };
  const teammemberoption = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const lineItems = rows.map((item) => ({
    productorService: item.productName, // Assuming productName maps to productorService
    description: item.description,
    rate: item.rate.replace("$", ""), // Removing '$' sign from rate
    quantity: item.qty,
    amount: item.amount.replace("$", ""), // Removing '$' sign from amount
    tax: item.tax.toString(), // Converting boolean to string
  }));

  const handleSaveInvoice = () => {
    const serviceAndInvoice = {
      invoiceTempId: selectInvoiceTemp.value,
      invoiceTempName: selectInvoiceTemp.label,
      invoiceTeamMember: selecteduser.value,
      issueInvoiceSelect: issueInvoice,
      specificDate: startDate,
      specificTime: selectedTime,
      descriptionData: description,
      lineItems: lineItems,
      summary: {
        subtotal: subtotal,
        taxRate: taxRate,
        taxTotal: taxTotal,
        total: totalAmount,
      },
      noteToClient: clientNote,
    };

    console.log("Service and Invoice Settings:", serviceAndInvoice);

    if (typeof serviceandinvoiceSettings === "function") {
      serviceandinvoiceSettings(serviceAndInvoice);
    }
  };

  // const handleSaveInvoice = () => {
  //   // Create an array to hold multiple invoices
  //   const invoicesArray = [];

  //   // Construct the serviceAndInvoice object
  //   const serviceAndInvoice = {
  //     invoiceTempId: selectInvoiceTemp.value,
  //     invoiceTempName: selectInvoiceTemp.label,
  //     invoiceTeamMember: selecteduser.value,
  //     issueInvoiceSelect: issueInvoice,
  //     specificDate: startDate,
  //     specificTime: selectedTime,
  //     descriptionData: description,
  //     lineItems: lineItems,
  //     summary: {
  //       subtotal: subtotal,
  //       taxRate: taxRate,
  //       taxTotal: taxTotal,
  //       total: totalAmount,
  //     },
  //     noteToClient: clientNote,
  //   };

  //   // Push the serviceAndInvoice object into the invoicesArray
  //   invoicesArray.push(serviceAndInvoice);

  //   console.log("Invoices Array:", invoicesArray);

  //   // If there's a function to handle the invoices array, pass the array to it
  //   if (typeof serviceandinvoiceSettings === "function") {
  //     serviceandinvoiceSettings(invoicesArray); // Send the array to the callback
  //   }
  // };

  const handleSaveInvoiceonUpdate = () => {
    const serviceAndInvoice = {
      invoiceTempId: selectInvoiceTemp.value,
      invoiceTempName: selectInvoiceTemp.label,
      invoiceTeamMember: selecteduser.value,
      issueInvoiceSelect: issueInvoice,
      specificDate: startDate,
      specificTime: selectedTime,
      descriptionData: description,
      lineItems: rows,
      summary: {
        subtotal: subtotal,
        taxRate: taxRate,
        taxTotal: taxTotal,
        total: totalAmount,
      },
      noteToClient: clientNote,
    };
    console.log("Service and Invoice Settings:", serviceAndInvoice);
    if (typeof serviceandinvoiceSettingonupdate === "function") {
      serviceandinvoiceSettingonupdate(serviceAndInvoice);
    }
    setRows(rows);
  };

  console.log(isUpdating);

  useEffect(() => {
    fetchInvoiceTemplates();
    console.log(serviceandinvoiceSettings);

    if (!isUpdating && serviceandinvoiceSettings) {
      console.log("Received invoice settings:", serviceandinvoiceSettings);

      setIsUpdating(serviceandinvoiceSettings.isUpdating);
      setIssueInvoice(serviceandinvoiceSettings.issueinvoice);
      setDescription(serviceandinvoiceSettings.description);
      // setTaxRate(serviceandinvoiceSettings.summary.taxRate);
      setTaxRate(serviceandinvoiceSettings?.summary?.taxRate ?? 0);

      if (serviceandinvoiceSettings && Array.isArray(serviceandinvoiceSettings.lineItems)) {
        const formattedLineItems = serviceandinvoiceSettings.lineItems.map((item) => {
          console.log(item);
          // Declare variables outside the object literal
          const rate = !isNaN(parseFloat(item.rate)) ? parseFloat(item.rate).toFixed(2) : "0.00";
          const amount = !isNaN(parseFloat(item.amount)) ? parseFloat(item.amount).toFixed(2) : "0.00";

          console.log(rate);
          // Return the object literal
          return {
            productName: item.productorService || "", // Map productorService to productName
            description: item.description || "",
            rate: `$${rate}`, // Use formatted rate or fallback to '0.00'
            qty: String(item.quantity || "1"), // Convert quantity to string
            amount: `$${amount}`, // Use formatted amount or fallback to '0.00'
            tax: item.tax || false, // Tax is already a boolean
            isDiscount: false, // Add isDiscount field if needed
          };
        });
        setRows(formattedLineItems);
        
      } else {
        console.error("lineItems is either undefined or not an array");
      }
      setClientNote(serviceandinvoiceSettings.notetoclient);

      // Handle specific date and time if present
      if (serviceandinvoiceSettings.specificdate) {
        setStartDate(new Date(serviceandinvoiceSettings.specificdate));
      }
      if (serviceandinvoiceSettings.specifictime) {
        setSelectedTime(serviceandinvoiceSettings.specifictime);
      }

      // Set the invoice template name to dropdown
      if (serviceandinvoiceSettings.servicesandinvoicetempid) {
        const templateOption = {
          label: serviceandinvoiceSettings.servicesandinvoicetempid.templatename, // Display the template name
          value: serviceandinvoiceSettings.servicesandinvoicetempid._id, // Use _id as the value
        };
        setSelectedInvoiceTemp(templateOption); // Set this as the selected option
      } else {
        console.error("servicesandinvoicetempid is undefined");
      }

      // console.log(serviceandinvoiceSettings.invoiceteammember);

      // Handle invoiceteammember (single object)
      if (serviceandinvoiceSettings.invoiceteammember) {
        const userOption = {
          label: serviceandinvoiceSettings.invoiceteammember.username, // Display the username
          value: serviceandinvoiceSettings.invoiceteammember._id, // Use _id as the value
        };
        setSelectedUser(userOption); // Set this as the selected user option
      } else {
        console.error("invoiceteammember is undefined");
      }
    }

    // setIsUpdating(true);  // Mark as initialized
  }, [serviceandinvoiceSettings]);

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
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box>
          <Typography variant="h5">Invoice</Typography>
          <Box padding={2}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid xs={6}>
                <Box>
                  <InputLabel sx={{ color: "black" }}>Invoice Template</InputLabel>
                  <Autocomplete options={invoiceoptions}
                    sx={{ mt: 1, mb: 2, backgroundColor: "#fff" }} size="small"
                    value={selectInvoiceTemp} onChange={handleInvoiceTempChange}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    getOptionLabel={(option) => option.label || ""}
                    renderInput={(params) => <TextField {...params} placeholder="Invoice Template" />}
                    isClearable={true} />
                </Box>
              </Grid>
              <Grid xs={6}>
                <InputLabel sx={{ color: "black" }}>Team Member</InputLabel>
                <Autocomplete sx={{ mt: 1, mb: 2, backgroundColor: "#fff" }} size="small" options={teammemberoption}
                  value={selecteduser} onChange={handleuserChange}
                  isOptionEqualToValue={(option, value) => option.value === value.value} getOptionLabel={(option) => option.label || ""}
                  renderInput={(params) => <TextField {...params} placeholder="Team Member" />} />
              </Grid>
            </Grid>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <InputLabel sx={{ color: "black" }}>Issue invoice</InputLabel>
                  <Autocomplete
                    sx={{ mt: 1, mb: 2, backgroundColor: "#fff" }}
                    size="small"
                    options={invoiceissueoptions}
                    value={issueInvoice} // Set the default value
                    onChange={handleIssueChange}
                    renderInput={(params) => <TextField {...params} placeholder="Issue invoice" />}
                  />
                </Grid>
                {issueInvoice === "specific date" && (
                  <>
                    <Grid item xs={12} md={4}>
                      <InputLabel>Date</InputLabel>
                      <DatePicker format="DD/MM/YYYY" sx={{ width: "100%", backgroundColor: "#fff" }} selected={startDate} onChange={handleStartDateChange} renderInput={(params) => <TextField {...params} size="small" />} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <InputLabel>Time</InputLabel>
                      <Autocomplete sx={{ mt: 1, mb: 2, backgroundColor: "#fff" }} options={timeOptions} size="small" value={selectedTime} onChange={(event, newValue) => setSelectedTime(newValue)} renderInput={(params) => <TextField {...params} placeholder="Select Time" variant="outlined" />} fullWidth />
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
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
              <Box sx={{ margin: "20px 0 10px 0" }}>
                <Typography variant="h6">Line items</Typography>
                <Typography variant="body2">Client-facing itemized list of products and services</Typography>
              </Box>
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
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ position: "sticky", left: 0, backgroundColor: "white", zIndex: 1 }}>
                          <CreatableSelect
                            placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
                            options={serviceoptions}
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
              <Typography variant="h6">Summary</Typography>
              <Table sx={{ backgroundColor: "#fff" }}>
                <TableHead sx={{ height: "5px" }}>
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
            </Box>
            <Box sx={{ width: "50%", mt: 3, mb: 6 }}>
              <Editor onChange={handleEditorChange} initialContent={clientNote} />
            </Box>
            <Button onClick={isUpdating ? handleSaveInvoiceonUpdate : handleSaveInvoice}>{isUpdating ? "Update Invoice" : "Save Invoice"}</Button>
          </Box>
          {/* <Box>
                        <Button>Add one more invoice</Button>
                    </Box> */}
        </Box>
      </LocalizationProvider>

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
                        value={selectedRateOption}
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
                    options={options}
                    getOptionLabel={(option) => option?.label || ""}
                    value={selectedRateOption}
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
                <Button variant="contained" color="primary" onClick={setCategoryFormOpen}  sx={{
                                      backgroundColor: 'var(--color-save-btn)',  // Normal background
                                     
                                      '&:hover': {
                                        backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                                      },
                                   mt:4,ml:1
                                    }}>
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
                    <Button variant="contained" color="primary" onClick={createCategory} sx={{
                backgroundColor: 'var(--color-save-btn)',  // Normal background
               
                '&:hover': {
                  backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                },
               width:'80px',borderRadius:'15px'
              }}>
                      Create
                    </Button>
                    <Button variant="outlined" onClick={handleCategoryFormClose} sx={{
                    borderColor: 'var(--color-border-cancel-btn)',  // Normal background
                   color:'var(--color-save-btn)',
                    '&:hover': {
                      backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                      color:'#fff',
                      border:"none"
                    },
                    width:'80px',borderRadius:'15px'
                  }}>
                      Cancel
                    </Button>
                  </Box>
                </Drawer>
              </Box>
              <Box sx={{ pt: 5, display: "flex", alignItems: "center", gap: 5, ml: 1 }}>
                <Button variant="contained" color="primary" onClick={createservicetemp} sx={{
                backgroundColor: 'var(--color-save-btn)',  // Normal background
               
                '&:hover': {
                  backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                },
               width:'80px',borderRadius:'15px'
              }}>
                  Save
                </Button>
                <Button variant="outlined" onClick={handleNewDrawerClose} sx={{
                    borderColor: 'var(--color-border-cancel-btn)',  // Normal background
                   color:'var(--color-save-btn)',
                    '&:hover': {
                      backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                      color:'#fff',
                      border:"none"
                    },
                    width:'80px',borderRadius:'15px'
                  }}>
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
          <Button variant="contained" color="primary" onClick={createCategory} sx={{
                backgroundColor: 'var(--color-save-btn)',  // Normal background
               
                '&:hover': {
                  backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                },
               width:'80px',borderRadius:'15px'
              }}>
            Create
          </Button>
          <Button variant="outlined" onClick={handleCategoryFormClose} sx={{
                    borderColor: 'var(--color-border-cancel-btn)',  // Normal background
                   color:'var(--color-save-btn)',
                    '&:hover': {
                      backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                      color:'#fff',
                      border:"none"
                    },
                    width:'80px',borderRadius:'15px'
                  }}>
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
                <Button variant="contained" onClick={handleSaveChanges} sx={{
                backgroundColor: 'var(--color-save-btn)',  // Normal background
               
                '&:hover': {
                  backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                },
               width:'80px',borderRadius:'15px'
              }}>
                  Save
                </Button>
                <Button variant="outlined" onClick={handleEditDrawerClose} sx={{
                    borderColor: 'var(--color-border-cancel-btn)',  // Normal background
                   color:'var(--color-save-btn)',
                    '&:hover': {
                      backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                      color:'#fff',
                      border:"none"
                    },
                    width:'80px',borderRadius:'15px'
                  }}>
                  {" "}
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Invoice;
