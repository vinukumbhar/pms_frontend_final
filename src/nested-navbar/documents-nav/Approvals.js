import React from 'react'
import { GrNotes } from "react-icons/gr";
const Approvals = () => {
  return (
    <div style={{margin:'10% auto', textAlign:'center'}}>
      <GrNotes  className='content-icon' />
      <p style={{color:'grey'}}>No pending approval documents</p>
      </div>
  )
}

export default Approvals