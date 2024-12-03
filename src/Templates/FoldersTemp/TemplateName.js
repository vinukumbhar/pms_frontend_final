// import React from 'react'

// function TemplateName({ handleSaveTemplate, handleCancel,tempName,setTempName }) {
//     return (
//         <div>

//             <div className="folder-label">
//                 <label>Template Name</label>
//                 <input type="text" placeholder="Template Name" value={tempName} onChange={(e) => setTempName(e.target.value)} />
//             </div>
//             <div className="temp_buttons">
//                 <button className="btn1" onClick={handleSaveTemplate}>
//                     Save
//                 </button>
//                 <button className="btn2" onClick={handleCancel}>
//                     Cancel
//                 </button>
//             </div>
//         </div>
//     )
// }

// export default TemplateName

import React from 'react';
import { TextField, Button, Box } from '@mui/material';

function TemplateName({ handleSaveTemplate, handleCancel, tempName, setTempName }) {
    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <TextField
               
                variant="outlined"
                placeholder="Template Name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                fullWidth
                size="small"
                margin="normal"
            />
            <Box display="flex" gap={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveTemplate}
                >
                    Save
                </Button>
                <Button
                    variant="outlined"
                   
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
            </Box>
        </Box>
    );
}

export default TemplateName;
