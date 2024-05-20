import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs} from 'firebase/firestore';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SeriesInput = ({ freeInputAllowed, inputSeries, handleSeriesChange }) => {
    const [allSeries, setAllSeries] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [newSeries, setNewSeries] = useState('');

    useEffect(() => {
        const fetchSeries = async () => {
            const snapshot = await getDocs(collection(db, 'series'));
            setAllSeries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
            onInputChange={(_, newInputValue) => handleSeriesChange(newInputValue)}
        />
    );
};

export default SeriesInput;