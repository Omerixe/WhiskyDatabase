// src/components/WhiskyList.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import WhiskyItem from './WhiskyItem';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const WhiskyList = () => {
  const [whiskies, setWhiskies] = useState([]);
  const [distilleries, setDistilleries] = useState([]);
  const [selectedDistillery, setSelectedDistillery] = useState(null);

  useEffect(() => {
    const fetchDistilleries = async () => {
      const snapshot = await getDocs(collection(db, 'distilleries'));
      setDistilleries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchDistilleries();
  }, []);

  useEffect(() => {
    const fetchWhiskies = async () => {
      let whiskyQuery = collection(db, 'whiskies');
      if (selectedDistillery) {
        whiskyQuery = query(whiskyQuery, where('distillery', '==', selectedDistillery.id));
      }
      const snapshot = await getDocs(whiskyQuery);
      setWhiskies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchWhiskies();
  }, [selectedDistillery]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Übersicht
      </Typography>
      <Autocomplete
        options={distilleries}
        getOptionLabel={(option) => option.name}
        value={selectedDistillery}
        onChange={(event, newValue) => setSelectedDistillery(newValue)}
        renderInput={(params) => <TextField {...params} label="Filter nach Destillerie" />}
      />
      <Grid container spacing={2}>
        {whiskies.map(whisky => (
          <Grid item xs={12} sm={6} md={4} key={whisky.id}>
            <WhiskyItem whisky={whisky} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default WhiskyList;