// src/components/AddWhisky.js
import React, { useState } from 'react';
import { addWhisky } from '../firebase';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const AddWhisky = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [distillery, setDistillery] = useState('');
  const [type, setType] = useState('');
  const [region, setRegion] = useState('');


  const handleSubmit = () => {
    const newWhisky = { name, age: parseInt(age), distillery, type, region };
    addWhisky(newWhisky);
    setName('');
    setAge('');
    setDistillery('');
    setType('');
    setRegion('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" gutterBottom>
        Add New Whisky
      </Typography>
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Alter" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
      <TextField label="Destillerie" value={distillery} onChange={(e) => setDistillery(e.target.value)} />
      <TextField label="Typ" value={type} onChange={(e) => setType(e.target.value)} />
      <TextField label="Region" value={region} onChange={(e) => setRegion(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handleSubmit}>Add Whisky</Button>
    </Box>
  );
};

export default AddWhisky;