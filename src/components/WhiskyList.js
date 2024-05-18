// src/components/WhiskyList.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import WhiskyItem from './WhiskyItem';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const WhiskyList = () => {
  const [whiskies, setWhiskies] = useState([]);

  useEffect(() => {
    const fetchWhiskies = async () => {
      const whiskyCollection = collection(db, 'whiskies');
      const whiskySnapshot = await getDocs(whiskyCollection);
      setWhiskies(whiskySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchWhiskies();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Übersicht
      </Typography>
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