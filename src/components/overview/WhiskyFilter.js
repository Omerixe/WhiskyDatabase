import React, { useEffect, useState } from 'react';
import { db, fetchDistilleries } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { statusConstants } from '../../constants';
import MenuItem from     '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';

const WhiskyFilter = (updateFunction) => {
    const [totalAmount, setTotalAmount] = useState(null);
    const [distilleries, setDistilleries] = useState([]);
    const [selectedDistillery, setSelectedDistillery] = useState(() => {
        return JSON.parse(sessionStorage.getItem('selectedDistillery')) || null;
    });
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState(() => {
        return JSON.parse(sessionStorage.getItem('selectedRegion')) || null;
    });
    const [series, setSeries] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState(() => {
        return JSON.parse(sessionStorage.getItem('selectedSeries')) || null;
    });
    const [bottlers, setBottlers] = useState([]);
    const [selectedBottler, setSelectedBottler] = useState(() => {
        return JSON.parse(sessionStorage.getItem('selectedBottler')) || null;
    });
    const [status, setStatus] = useState(() => {
        return sessionStorage.getItem('status') || '';
    });

    const [accordionOpen, setAccordionOpen] = useState(() => {
        return sessionStorage.getItem('accordionOpen') === 'true';
    });

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
            if (!selectedBottler && !selectedDistillery && !selectedRegion && !selectedSeries && !status) {
                // If no filters are set, we can use the total amount of whiskies and store it for later use
                setTotalAmount(snapshot.size);
                updateFunction.updateWhiskyList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })), snapshot.size);
            } else {
                updateFunction.updateWhiskyList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })), totalAmount);
            }
            
        };
        fetchWhiskies();
    }, [selectedDistillery, selectedRegion, selectedSeries, selectedBottler, status]);

    const resetFilters = () => {
        setSelectedDistillery(null);
        setSelectedRegion(null);
        setSelectedSeries(null);
        setSelectedBottler(null);
        setStatus('');
        sessionStorage.removeItem('selectedDistillery');
        sessionStorage.removeItem('selectedRegion');
        sessionStorage.removeItem('selectedSeries');
        sessionStorage.removeItem('selectedBottler');
        sessionStorage.removeItem('status');
        loadDistilleries();
    }

    // Save filters to sessionStorage when they change
    useEffect(() => {
        sessionStorage.setItem('selectedDistillery', JSON.stringify(selectedDistillery));
        sessionStorage.setItem('selectedRegion', JSON.stringify(selectedRegion));
        sessionStorage.setItem('selectedSeries', JSON.stringify(selectedSeries));
        sessionStorage.setItem('selectedBottler', JSON.stringify(selectedBottler));
        sessionStorage.setItem('status', status);
    }, [selectedDistillery, selectedRegion, selectedSeries, selectedBottler, status]);

    const handleAccordionChange = () => {
        const newAccordionState = !accordionOpen;
        setAccordionOpen(newAccordionState);
        sessionStorage.setItem('accordionOpen', newAccordionState);
    };

    const generateFilterSummary = () => {
        const filterStrings = [];

        if (selectedRegion) filterStrings.push(`Region: ${selectedRegion.name}`);
        if (selectedDistillery) filterStrings.push(`Destillerie: ${selectedDistillery.name}`);
        if (selectedSeries) filterStrings.push(`Serie: ${selectedSeries.name}`);
        if (selectedBottler) filterStrings.push(`Abfüller: ${selectedBottler.name}`);
        if (status) filterStrings.push(`Status: ${status}`);

        return filterStrings.length > 0 ? filterStrings.join(', ') : '';
    };

    return (
        <div>
            <Accordion expanded={accordionOpen} onChange={handleAccordionChange}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="filter-content"
                    id="filter-header"
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6">Filter</Typography>
                        {!accordionOpen && (
                            <Typography variant="body2" color="textSecondary">
                            {generateFilterSummary()}
                            </Typography>
                        )}
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
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
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default WhiskyFilter;