// src/components/WhiskyItem.js
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const WhiskyItem = ({ whisky }) => (
  <Card>
    <CardContent>
      <Typography variant="h5" component="div">
        {whisky.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Alter: {whisky.age}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Destillerie: {whisky.distillery}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Typ: {whisky.type}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Region: {whisky.region}
      </Typography>
    </CardContent>
  </Card>
);

export default WhiskyItem;