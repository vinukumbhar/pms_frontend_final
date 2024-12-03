import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Box, } from '@mui/material'
import { useParams } from "react-router-dom";
const Docs = () => {
  const { data } =  useParams();
  console.log(data)
  return (

    <Box className="Docs">
      
      <Box className="firmtemp" >
        <Box className="firmtemp-nav" sx={{
          display: 'flex',

          mt: 5,
          flexWrap: 'wrap', // Allow items to wrap to the next line if they overflow
          gap:2,// Space out items evenly
          '& a': { // Styling for the NavLink components
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            // color: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'white'
            },
            '&.active': {
              backgroundColor: 'primary.main',
              color: 'white'
            }
          }
        }}>
          <NavLink to={`/accountsdash/docs/${data}/documents`} activeClassName="active">Documents</NavLink>
          <NavLink to={`/accountsdash/docs/${data}/approvals`} activeClassName="active">Approvals</NavLink>
          <NavLink to={`/accountsdash/docs/${data}/signatures`} activeClassName="active">Signatures</NavLink>
          <NavLink to={`/accountsdash/docs/${data}/filerequests`} activeClassName="active">File Requests</NavLink>
          <NavLink to={`/accountsdash/docs/${data}/trash`} activeClassName="active">Trash</NavLink>
          <NavLink to={`/accountsdash/docs/${data}/irs`} activeClassName="active">IRS</NavLink>
        </Box>

      </Box>
      <Box> <hr /></Box>
      <Box mt={2}><Outlet /></Box>
    </Box>
  )
}

export default Docs