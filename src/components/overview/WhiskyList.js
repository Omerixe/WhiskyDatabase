// src/components/WhiskyList.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WhiskyItem from './WhiskyItem';
import WhiskyFilter from './WhiskyFilter';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';


const WhiskyList = () => {
    const [whiskies, setWhiskies] = useState([]);

    const updateWhiskyList = (whiskies) => {
        setWhiskies(whiskies);
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Übersicht
            </Typography>
            <>
                <WhiskyFilter updateWhiskyList={updateWhiskyList} />
            </>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {whiskies.map(whisky => (
                    <Grid item xs={12} sm={6} md={4} key={whisky.id} style={{ display: 'flex' }}>
                        <Link to={`/whisky/${whisky.id}`} style={{ textDecoration: 'none', width: '100%' }}>
                            <WhiskyItem whisky={whisky} />
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default WhiskyList;