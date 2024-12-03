import React, { useState } from "react";
import { Box, Grid, Typography, Drawer, Button, Checkbox, Chip, TextField, IconButton } from "@mui/material";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import makeAnimated from "react-select/animated";

const SendInvoice = ({ stages, isConditionsInvoiceFormOpen, handleInvoiceGoBack, handleInvoiceAddConditions, selectedInvoiceTags, selectedInvoiceTagElements, invoiceTemplateOptions, selectedInvoiceTemplate, handleInvoiceTemplateChange, tempSelectedInvoiceTags, handleInvoiceCheckboxChange, filteredInvoiceTags, isAnyCheckboxInvoiceChecked, handleInvoiceAddTags, searchInvoiceTerm, handleInvoiceSearchChange }) => {
  stages[0].automations.map((automation) => {
    console.log(automation.templates);
  });
  const templates = stages[0]?.automations?.[1]?.templates || null;

  return stages[0].automations.slice(0).map((automation, index) => (
    <Grid container direction="column" spacing={2} key={index + 1}>
      <Grid item ml={2}>
        <Typography mb={1}>Select invoice template</Typography>
        <Select
          className="select-dropdown"
          placeholder="Select invoice template"
          options={invoiceTemplateOptions}
          components={makeAnimated()}
          isSearchable
          isClearable
          onChange={(selectedOption) => handleInvoiceTemplateChange(selectedOption, index + 1)} // Adjust index if needed
          value={automation.templates}
        />
      </Grid>
    </Grid>
  ));
};

export default SendInvoice;
