import React, { useEffect, useState } from 'react';
import { db, fetchDistilleries } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const WhiskyFilter = (updateFunction) => {
    const [distilleries, setDistilleries] = useState([]);
    const [selectedDistillery, setSelectedDistillery] = useState(null);
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState(null);

    useEffect(() => {
        loadDistilleries();
    }, []);

    const loadDistilleries = async (region = undefined) => {
        const loadeddistilleries = await fetchDistilleries(region);
        setDistilleries(loadeddistilleries);
        if (region && !loadeddistilleries.includes(selectedDistillery)) {
            setSelectedDistillery(null);
        }
    };

    const changeRegionFilter = (newRegion) => {
        setSelectedRegion(newRegion);
        const regionId = newRegion ? newRegion.id : undefined;
        loadDistilleries(regionId);
    }

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
            updateFunction.updateWhiskyList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchWhiskies();
    }, [selectedDistillery, selectedRegion]);

    const resetFilters = () => {
        setSelectedDistillery(null);
        setSelectedRegion(null);
        loadDistilleries();
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Autocomplete
                    options={regions}
                    getOptionLabel={(option) => option.name}
                    value={selectedRegion}
                    onChange={(_, newValue) => {
                        changeRegionFilter(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Region" />}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Autocomplete
                    options={distilleries}
                    getOptionLabel={(option) => option.name}
                    value={selectedDistillery}
                    onChange={(_, newValue) => {
                        setSelectedDistillery(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Destillerie" />}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Button variant="contained" color="primary" onClick={resetFilters}>Filter zurücksetzen</Button>
            </Grid>
        </Grid>
    );
};

export default WhiskyFilter;