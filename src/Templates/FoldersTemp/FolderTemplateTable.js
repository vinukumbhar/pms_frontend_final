


import React from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Box ,Paper} from "@mui/material";

function FolderTemplateTbel({ handleCreateTemplate, folderTemplates, handleEdit }) {
  return (
    <Box>
      <Box sx={{ mb: 2,mt:2 }}>
        <Button variant="contained" color="primary" onClick={handleCreateTemplate}>
          Create Template
        </Button>
      </Box>
      <Box >
        <Paper>
        <Table sx={{ width: '100%' }} >
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Used in pipeline</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {folderTemplates.map((template) => (
              <TableRow key={template._id}>
                <TableCell
                  onClick={() => handleEdit(template._id)}
                  sx={{ cursor: "pointer", color: "blue" }}
                >
                  {template.templatename}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Paper>
      </Box>
    </Box>
  );
}

export default FolderTemplateTbel;

