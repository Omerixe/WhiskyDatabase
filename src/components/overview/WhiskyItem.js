// src/components/WhiskyItem.js
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import placeholderImage from '../../assets/placeholder.png';

const WhiskyItem = ({ whisky }) => (
    <Card sx={{ display: 'flex', flexDirection: 'column', minHeight: '350px', maxHeight: '350px' }}>
        <CardMedia
            component="img"
            image={whisky.imageUrl ? whisky.imageUrl : placeholderImage}
            alt={whisky.imageUrl ? `Image of ${whisky.distillery}` : 'No Image Available'}
            sx={{
                width: '100%',
                height: '180px',
                objectFit: 'cover',
                objectPosition: 'center',
            }}
        />

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" component="div">
                {whisky.distillery} {whisky.series ? " - " + whisky.series : ""} {whisky.bottler ? " - " + whisky.bottler : ""}
            </Typography>

            {/* Spacer that pushes age and region to the bottom */}
            <div style={{ flexGrow: 1 }}></div>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <span>{whisky.age} Jahre</span>
                <span>{whisky.abv}%</span>
                <span>{whisky.region}</span>
            </Typography>
        </CardContent>
    </Card>
);

export default WhiskyItem;