import React, { useEffect, useState, useCallback, useRef } from 'react';
import { fetchDistilleries, fetchCollection, tablesDB, DATABASE_ID, COLLECTIONS, Query } from '../../appwrite';
import Grid from '@mui/material/GridLegacy';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { statusConstants } from '../../constants';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';

const WhiskyFilter = ({ updateWhiskyList, loadMoreRef, setIsLoading }) => {
    const PAGE_SIZE = 20;
    const totalAmountRef = useRef(null);
    const [currentOffset, setCurrentOffset] = useState(0);
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

    const loadDistilleries = useCallback(async (region = undefined) => {
        const loadeddistilleries = await fetchDistilleries(region);
        setDistilleries(loadeddistilleries);
    }, []);

    useEffect(() => {
        loadDistilleries();
        // Fetch total count on mount so it's always available
        fetchTotalCount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTotalCount = async () => {
        try {
            const response = await tablesDB.listRows({
                databaseId: DATABASE_ID,
                tableId: COLLECTIONS.WHISKIES,
                queries: [Query.limit(1)],
                total: true
            });
            totalAmountRef.current = response.total;
        } catch (error) {
            console.error('Error fetching total count:', error);
        }
    };

    const changeRegionFilter = (newRegion) => {
        setSelectedRegion(newRegion);
        const regionId = newRegion ? newRegion.id : undefined;
        loadDistilleries(regionId);
    }

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const loadedRegions = await fetchCollection(COLLECTIONS.REGIONS);
                setRegions(loadedRegions);
            } catch (error) {
                console.error('Error loading regions:', error);
                setRegions([]);
            }
        };
        fetchRegions();
        
        const fetchSeries = async () => {
            try {
                const loadedSeries = await fetchCollection(COLLECTIONS.SERIES);
                setSeries(loadedSeries);
            } catch (error) {
                console.error('Error loading series:', error);
                setSeries([]);
            }
        };
        fetchSeries();
        
        const fetchBottlers = async () => {
            try {
                const loadedBottlers = await fetchCollection(COLLECTIONS.BOTTLERS);
                setBottlers(loadedBottlers);
            } catch (error) {
                console.error('Error loading bottlers:', error);
                setBottlers([]);
            }
        };
        fetchBottlers();
    }, []);

    const fetchWhiskies = useCallback(async (offset = 0, isInitial = true) => {
        try {
            let queries = [];
            
            if (selectedDistillery) {
                queries.push(Query.equal('distillery', selectedDistillery.id));
            }
            if (selectedRegion) {
                queries.push(Query.equal('region', selectedRegion.id));
            }
            if (selectedSeries) {
                queries.push(Query.equal('series', selectedSeries.id));
            }
            if (selectedBottler) {
                queries.push(Query.equal('bottler', selectedBottler.id));
            }
            if (status) {
                queries.push(Query.equal('status', status));
            }
            
            // Add pagination queries
            queries.push(Query.limit(PAGE_SIZE));
            queries.push(Query.offset(offset));
            
            const response = await tablesDB.listRows({
                databaseId: DATABASE_ID,
                tableId: COLLECTIONS.WHISKIES,
                queries: queries,
                total: true
            });

            console.info('Whiskies', response);
            const whiskies = response.rows.map(doc => ({ id: doc.$id, ...doc }));
            const hasMore = offset + whiskies.length < response.total;
            
            if (!selectedBottler && !selectedDistillery && !selectedRegion && !selectedSeries && !status) {
                // If no filters are set, store total amount
                totalAmountRef.current = response.total;
                updateWhiskyList(whiskies, response.total, response.total, hasMore, isInitial);
                console.info('Total whiskies without filters:', response.total);
                console.info('Whiskies loaded:', whiskies.length);
            } else {
                // Filters are active: pass filtered total and database total separately
                updateWhiskyList(whiskies, response.total, totalAmountRef.current, hasMore, isInitial);
                console.info('Filtered whiskies count:', response.total);
            }
        } catch (error) {
            console.error('Error fetching whiskies:', error);
            console.error('Error details:', error.message);
            updateWhiskyList([], 0, totalAmountRef.current || 0, false, isInitial);
        }
    }, [selectedDistillery, selectedRegion, selectedSeries, selectedBottler, status, updateWhiskyList]);

    // Expose loadMore function to parent via ref
    useEffect(() => {
        if (loadMoreRef) {
            loadMoreRef.current = () => {
                const newOffset = currentOffset + PAGE_SIZE;
                setCurrentOffset(newOffset);
                fetchWhiskies(newOffset, false);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentOffset]);

    // Reset to page 1 and fetch initial data when filters change
    useEffect(() => {
        setCurrentOffset(0);
        setIsLoading(true);
        fetchWhiskies(0, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDistillery, selectedRegion, selectedSeries, selectedBottler, status]);

    const resetFilters = () => {
        setSelectedDistillery(null);
        setSelectedRegion(null);
        setSelectedSeries(null);
        setSelectedBottler(null);
        setStatus('');
        setCurrentOffset(0);
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
                            <Autocomplete
                                options={statusConstants}
                                getOptionLabel={(option) => option}
                                value={status || null}
                                onChange={(_, newValue) => {
                                    setStatus(newValue || '');
                                }}
                                renderInput={(params) => <TextField {...params} label="Status" />}
                            />
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