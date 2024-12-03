import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Box, } from '@mui/material'
const Email = () => {
  const accountid = '661b6d50187951c779906e29'
  return (
   
    <Box >

      <Box className="firmtemp" >
        <Box className="firmtemp-nav" sx={{
          display: 'flex',

          mt: 5,
          flexWrap: 'wrap', // Allow items to wrap to the next line if they overflow
         gap:2 ,// Space out items evenly
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
          <NavLink to={`/accountsdash/email/${accountid}/inbox`}>Inbox</NavLink>
          <NavLink to={`/accountsdash/email/${accountid}/sent`} >Sent</NavLink>
        </Box>

      </Box>
      <Box> <hr /></Box>
      <Box mt={2} ><Outlet /></Box>
    </Box>
  )
}

export default Email