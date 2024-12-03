import { Box, Grid, Card, CardContent, Typography, Divider, Button, IconButton, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BiArchiveOut } from "react-icons/bi";
import { LuUserCircle2 } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { useParams } from "react-router-dom";
const Info = () => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  const { data } = useParams();

  const [accountData, setaccountData] = useState();


  const [accName, setAccName] = useState();
  const [usertype, setUserType] = useState();
  const [tags, setTags] = useState([]);
  const [teams, setTeams] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyid/`;
    fetch(url + data, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        setaccountData(result.accountlist);
        setAccName(result.accountlist.Name);
        setUserType(result.accountlist.Type);
        setTags(result.accountlist.Tags.flat());
        setTeams(result.accountlist.Team);

      })
      .catch((error) => console.error(error));
  }, [ACCOUNT_API, data]);

  console.log(accountData);


  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${CONTACT_API}/contacts/contactaccount/`;
    fetch(url + data, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setContacts(result);




      })
      .catch((error) => console.error(error));
  }, [CONTACT_API, data]);






  return (
    <Box sx={{ width: '100%', padding: 2, mt: 4 }}>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, mr: 5 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant='h5' fontWeight='bold'>Account Details</Typography>
                <Box>
                  <IconButton><BiArchiveOut /></IconButton>
                  <IconButton><MdEdit /></IconButton>
                </Box>
              </Box>
              <Box sx={{mt:1}}>
              <Divider />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <LuUserCircle2 style={{ width: '80px', height: '80px' }} />
                  <Box>
                    <Typography sx={{fontWeight:'bold', fontSize:'20px'}}>{accName}</Typography>
                    <Typography sx={{fontSize:'15px'}}>{usertype}</Typography>
                  </Box>
                  <Button variant='outlined'>
                    Log in as account (read-only)
                  </Button>

                </Box>
              </Box>
              <Box mt={3}>
                <Typography fontWeight='bold'>Account Info</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px', mt: 2 }}>
                  <Typography>Tags</Typography>
                  <Typography><Box sx={{ display: 'flex', gap: '10px' }}>
                    {tags.map((tag) => (
                      <Typography
                        key={tag._id}
                        sx={{
                          backgroundColor: tag.tagColour,
                          color: 'white',
                          borderRadius: '60px',
                          padding: '0.2rem 0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          fontWeight: 'bold',
                          fontSize: '12px'
                        }}
                      >
                        {tag.tagName}
                      </Typography>
                    ))}
                  </Box></Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px', mt: 2 }}>
                  <Typography>Team Members</Typography>
                  <Typography sx={{ display: 'flex', alignItems: 'center', gap: 2 }}> {teams &&
                    teams.map((team, index) => (
                      <h5
                        key={index}
                        style={{
                          backgroundColor: "lightgrey",
                          color: "black",
                          borderRadius: "60px",
                        
                          display: "flex",
                          padding: '0.2rem 0.5rem',
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: "5px",
                          fontSize: '12px'
                        }}
                      >
                        {team.username}
                      </h5>
                    ))}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
    
        <Grid item xs={12} sm={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant='h5' fontWeight='bold'>Contacts</Typography>
              </Box>
              <Box sx={{mt:1}}>
              <Divider />
              </Box>
              
              <Box mt={2}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                       
                        <TableCell></TableCell>
                       
                        <TableCell>Login</TableCell>
                        <TableCell>Notify</TableCell>
                        <TableCell>Email Sync</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {contacts.map((contact) => {
                        const { _id, contactName, email, login, notify, emailSync } = contact;
                        return (
                          <TableRow key={_id}>
                          <TableCell><Typography sx={{fontWeight:'bold', fontSize:'15px'}}>{contactName}</Typography> <br />{email}</TableCell>
                           
                            <TableCell>
                              <Switch checked={login} disabled />
                            </TableCell>
                            <TableCell>
                              <Switch checked={notify} disabled />
                            </TableCell>
                            <TableCell>
                              <Switch checked={emailSync} disabled />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Info;

