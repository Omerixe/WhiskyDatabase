// src/components/WhiskyList.js
import React, { useEffect, useState } from 'react';
import { db, fetchDistilleries } from '../firebase';
import { Link } from 'react-router-dom';
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
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState(null);

    useEffect(() => {
        loadDistilleries();
    }, []);

    const changeRegionFilter = (region) => {
        setSelectedRegion(region);
        const regionId = region ? region.id : undefined;
        loadDistilleries(regionId);
    };

    const loadDistilleries = async (region = undefined) => {
        const loadeddistilleries = await fetchDistilleries(region);
        setDistilleries(loadeddistilleries);
        if (region && !loadeddistilleries.includes(selectedDistillery)) {
            setSelectedDistillery(null);
        }
    };

    useEffect(() => {
        const fetchRegions = async () => {
            const snapshot = await getDocs(collection(db, 'regions'));
            setRegions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchRegions();
    }, []);

    useEffect(() => {
        const fetchWhiskies = async () => {
            let whiskyQuery = collection(db, 'whiskies');
            if (selectedRegion && selectedDistillery) {
                whiskyQuery = query(whiskyQuery, where('region', '==', selectedRegion.id), where('distillery', '==', selectedDistillery.id));
            } else if (selectedDistillery) {
                whiskyQuery = query(whiskyQuery, where('distillery', '==', selectedDistillery.id));
            } else if (selectedRegion) {
                whiskyQuery = query(whiskyQuery, where('region', '==', selectedRegion.id));
            }
            const snapshot = await getDocs(whiskyQuery);
            setWhiskies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchWhiskies();
    }, [selectedDistillery, selectedRegion]);

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Übersicht
            </Typography>
            <Autocomplete
                options={distilleries}
                getOptionLabel={(option) => option.name}
                value={selectedDistillery}
                onChange={(_, newValue) => setSelectedDistillery(newValue)}
                renderInput={(params) => <TextField {...params} label="Filter nach Destillerie" />}
            />
            <Autocomplete
                options={regions}
                getOptionLabel={(option) => option.name}
                value={selectedRegion}
                onChange={(_, newValue) => changeRegionFilter(newValue)}
                renderInput={(params) => <TextField {...params} label="Filter nach Region" />}
            />
            <Grid container spacing={2}>
                {whiskies.map(whisky => (
                    <Grid item xs={12} sm={6} md={4} key={whisky.id}>
                        <Link to={`/whisky/${whisky.id}`} style={{ textDecoration: 'none' }}>
                            <WhiskyItem whisky={whisky} />
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default WhiskyList;