// src/components/WhiskyItem.js
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';


const WhiskyItem = ({ whisky }) => (
    <Card>
        <Grid container>
            {whisky.imageUrl && (
                <Grid item xs={4}>
                    <CardMedia
                        component="img"
                        image={whisky.imageUrl}
                        alt={"Image of " + whisky.distillery}
                        style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                    />
                </Grid>
            )}
            <Grid item xs={whisky.imageUrl ? 8 : 12}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {whisky.distillery} {whisky.series ? " - " + whisky.series: ""} {whisky.bottler ? " - " + whisky.bottler: ""}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Alter: {whisky.age}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Region: {whisky.region}
                    </Typography>
                </CardContent>
            </Grid>
        </Grid>
    </Card>
);

export default WhiskyItem;