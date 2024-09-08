import React, { useEffect, useState } from 'react';
import { db, fetchDistilleries } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { statusConstants } from '../../constants';
import MenuItem from '@mui/material/MenuItem';

const WhiskyFilter = (updateFunction) => {
    const [distilleries, setDistilleries] = useState([]);
    const [selectedDistillery, setSelectedDistillery] = useState(null);
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [series, setSeries] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [bottlers, setBottlers] = useState([]);
    const [selectedBottler, setSelectedBottler] = useState(null);
    const [status, setStatus] = useState('');

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
        const fetchSeries = async () => {
            const snapshot = await getDocs(collection(db, 'series'));
            setSeries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchSeries();
        const fetchBottlers = async () => {
            const snapshot = await getDocs(collection(db, 'bottlers'));
            setBottlers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchBottlers();
    }, []);

    useEffect(() => {
        const fetchWhiskies = async () => {
            let whiskyQuery = collection(db, 'whiskies');
            if (selectedDistillery) {
                whiskyQuery = query(whiskyQuery, where('distillery', '==', selectedDistillery.id));
            }
            if (selectedRegion) {
                whiskyQuery = query(whiskyQuery, where('region', '==', selectedRegion.id));
            }
            if (selectedSeries) {
                whiskyQuery = query(whiskyQuery, where('series', '==', selectedSeries.id));
            }
            if (selectedBottler) {
                whiskyQuery = query(whiskyQuery, where('bottler', '==', selectedBottler.id));
            }
            if (status) {
                whiskyQuery = query(whiskyQuery, where('status', '==', status));
            }
            const snapshot = await getDocs(whiskyQuery);
            updateFunction.updateWhiskyList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchWhiskies();
    }, [selectedDistillery, selectedRegion, selectedSeries, selectedBottler, status]);

    const resetFilters = () => {
        setSelectedDistillery(null);
        setSelectedRegion(null);
        setSelectedSeries(null);
        setSelectedBottler(null);
        setStatus('');
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
                <Autocomplete
                    options={series}
                    getOptionLabel={(option) => option.name}
                    value={selectedSeries}
                    onChange={(_, newValue) => {
                        setSelectedSeries(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Serie" />}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Autocomplete
                    options={bottlers}
                    getOptionLabel={(option) => option.name}
                    value={selectedBottler}
                    onChange={(_, newValue) => {
                        setSelectedBottler(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Abfüller" />}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField label="Status" value={status} onChange={(e) => setStatus(e.target.value)} fullWidth select>
                    {statusConstants.map((option) => (  
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
                <Button variant="contained" color="primary" onClick={resetFilters}>Filter zurücksetzen</Button>
            </Grid>
        </Grid>
    );
};

export default WhiskyFilter;