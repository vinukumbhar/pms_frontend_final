import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Box, } from '@mui/material'
import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";

const DashInvoices = () => {
  const { data } =  useParams();
  console.log(data)
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
             <NavLink to={`/accountsdash/invoices/${data}/invoice`} >Invoice</NavLink >
             <NavLink to={`/accountsdash/invoices/${data}/payments`} >Payments</NavLink>
        </Box>

      </Box>
      <Box> <hr /></Box>
      <Box mt={2} ><Outlet /></Box>
    </Box>
  )
}

export default DashInvoices