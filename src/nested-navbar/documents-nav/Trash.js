import React from 'react'
import { IoDocumentTextOutline } from "react-icons/io5";
const Trash = () => {
  return (

      <div>
        <div style={{margin:'10% auto', textAlign:'center'}}><IoDocumentTextOutline className='content-icon'/>
        <p style={{color:'grey'}}>No documents found</p></div>
      </div>
    )
 
}

export default Trash