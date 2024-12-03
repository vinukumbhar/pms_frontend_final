import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!file) {
  //     setMessage('Please select a file');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('file', file);

  //   try {
  //     const response = await axios.post('http://127.0.0.1:8002/api/files/upload', formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });
  //     setMessage(response.data.message);
  //   } catch (error) {
  //     setMessage('File upload failed');
  //     console.error(error);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('accountId', '6731a63a9401e115181da177'); // Replace with dynamic accountId
  
    try {
      const response = await axios.post('http://127.0.0.1:8002/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('File upload failed');
      console.error(error);
    }
  };
  
  return (
    <div>
      <h2>File Upload</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
