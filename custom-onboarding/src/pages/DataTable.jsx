import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { fetchUserData } from '../services/api';
import './DataTable.css';

const DataTable = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserData();
      setUserData(data);
    };

    getUserData();
  }, []);

  return (
    <Container className="container">
      <Typography variant="h4" gutterBottom>
        User Data Table
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell><h3>Email</h3></TableCell>
            <TableCell><h3>About Me</h3></TableCell>
            <TableCell><h3>Street Address</h3></TableCell>
            <TableCell><h3>City</h3></TableCell>
            <TableCell><h3>State</h3></TableCell>
            <TableCell><h3>Zip Code</h3></TableCell>
            <TableCell><h3>Birthdate</h3></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userData.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.aboutMe}</TableCell>
              <TableCell>{user.streetAddress}</TableCell>
              <TableCell>{user.city}</TableCell>
              <TableCell>{user.state}</TableCell>
              <TableCell>{user.zipCode}</TableCell>
              <TableCell>{user.birthdate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default DataTable;
