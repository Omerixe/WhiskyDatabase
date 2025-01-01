// src/components/WhiskyList.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WhiskyItem from './WhiskyItem';
import WhiskyFilter from './WhiskyFilter';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import Box from '@mui/material/Box';


const WhiskyList = () => {
    const [whiskies, setWhiskies] = useState([]);
    const [totalWhiskies, setTotalWhiskies] = useState(0);

    const updateWhiskyList = (whiskies, totalWhiskies) => {
        setWhiskies(whiskies);
        setTotalWhiskies(totalWhiskies);
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Übersicht
            </Typography>
            <>
                <WhiskyFilter updateWhiskyList={updateWhiskyList} />
            </>
            <Box
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    margin: '20px auto',
                }}
            >
                <LocalBarIcon style={{ marginRight: '8px', color: '#6a4f4b' }} />
                <Typography variant="subtitle1">
                    Zeige <b>{whiskies.length}</b> von <b>{totalWhiskies ? totalWhiskies : "?"}</b> Whiskys
                </Typography>
            </Box>
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