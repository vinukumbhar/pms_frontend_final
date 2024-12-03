
// SendEmail.js
import React from 'react';
import {
  Box,
  Grid,
  Typography,
  
  Drawer,
  Button,
  Checkbox,
  Chip,
  TextField,
  IconButton,
} from '@mui/material';
import Select from 'react-select';
import { AiOutlineSearch } from 'react-icons/ai';
import { IoMdArrowRoundBack } from 'react-icons/io';
import makeAnimated from 'react-select/animated';

const SendEmail = ({
  isConditionsFormOpen,
  handleGoBack,
  handleAddConditions,
  selectedTags,
  selectedTagElements,
  emailTemplateOptions,
  selectedEmailTemplate,
  handleEmailTemplateChange,
  tempSelectedTags,
  handleCheckboxChange,
  filteredTags,
  isAnyCheckboxChecked,
  handleAddTags,
  searchTerm,
  handleSearchChange,
}) => {
  return (
    <>
      <Box sx={{ paddingTop: '20px' }}>
        <Grid container direction="column" spacing={2}>
          <Grid item ml={2}>
            <Typography mb={1}>Select template</Typography>
            <Select
              className='select-dropdown'
              placeholder="Select template"
              options={emailTemplateOptions}
              components={makeAnimated()}
              isSearchable
              isClearable
              onChange={handleEmailTemplateChange}
              value={selectedEmailTemplate}
            />
          </Grid>

          <Grid item mt={2} ml={2}>
            {selectedTags.length > 0 && (
              <Grid container alignItems="center" gap={1}>
                <Typography>Only for:</Typography>
                <Grid item>{selectedTagElements}</Grid>
              </Grid>
            )}
          </Grid>

          <Grid item ml={2}>
            <Typography
              onClick={handleAddConditions}
              sx={{ cursor: 'pointer', color: 'blue', fontWeight: 'bold',  }}
            >
              Add conditions
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Drawer
        anchor="right"
        open={isConditionsFormOpen}
        onClose={handleGoBack}
        PaperProps={{ sx: { width: '550px', padding: 2 } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handleGoBack}>
            <IoMdArrowRoundBack fontSize="large" color="blue" />
          </IconButton>
          <Typography variant="h6">Add conditions</Typography>
        </Box>

        <Box sx={{ padding: 2 }}>
          <Typography variant="body1">Apply automation only for accounts with these tags</Typography>
          <TextField
            fullWidth
            size='small'
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <AiOutlineSearch style={{ marginRight: 8 }} />,
            }}
            sx={{ marginTop: 2 }}
          />

          <Box sx={{ marginTop: 2 }}>
            {filteredTags.map(tag => (
              <Box key={tag._id} sx={{ display: 'flex', alignItems: 'center', gap: 3, borderBottom: '1px solid grey', paddingBottom: 1 }}>
                <Checkbox
                  checked={tempSelectedTags.includes(tag)}
                  onChange={() => handleCheckboxChange(tag)}
                />
                <Chip
                  label={tag.tagName}
                  sx={{ backgroundColor: tag.tagColour, color: '#fff', fontWeight: '500', borderRadius: '20px', marginRight: 1 }}
                />
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={!isAnyCheckboxChecked}
              onClick={handleAddTags}
            >
              Add
            </Button>
            <Button variant="outlined" color="primary" onClick={handleGoBack}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default SendEmail;