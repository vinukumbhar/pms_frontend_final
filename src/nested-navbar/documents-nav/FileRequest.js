import React from 'react'
import { IoDocumentTextOutline } from "react-icons/io5";
const FileRequest = () => {
  return (
    <div>
      <div style={{margin:'10% auto', textAlign:'center'}}><IoDocumentTextOutline className='content-icon'/>
      <p style={{color:'grey'}}>No files requested</p></div>
    </div>
  )
}

export default FileRequest