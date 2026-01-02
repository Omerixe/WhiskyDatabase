import React, { useState, useEffect } from 'react';
import { fetchCollection, COLLECTIONS } from '../../appwrite';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SeriesInput = ({ freeInputAllowed, inputSeries, handleSeriesChange }) => {
    const [allSeries, setAllSeries] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [newSeries, setNewSeries] = useState('');

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const loadedSeries = await fetchCollection(COLLECTIONS.SERIES);
                setAllSeries(loadedSeries);
            } catch (error) {
                console.error('Error loading series:', error);
                setAllSeries([]);
            }
        }
        fetchSeries();
    }, []);

    useEffect(() => {
        if (inputSeries) {
            if (inputSeries.id) {
                setSelectedSeries(inputSeries);
            } else {
                if (allSeries.some(series => series.name === inputSeries)) {
                    setSelectedSeries(allSeries.find(series => series.name === inputSeries));
                    setNewSeries(inputSeries);
                } else {
                    setNewSeries(inputSeries);
                }
            }
        } else {
            setNewSeries('');
            setSelectedSeries(null);
        }
    }, [inputSeries]);

    return (
        <Autocomplete
            options={allSeries}
            getOptionLabel={(option) => option.name}
            value={selectedSeries}
            onChange={(_, newValue) => handleSeriesChange(newValue)}
            renderInput={(params) => <TextField {...params} label="Serie" />}
            freeSolo={freeInputAllowed}
            inputValue={newSeries}
            onInputChange={(_, newInputValue) => setNewSeries(newInputValue)}
        />
    );
};

export default SeriesInput;