import React, { useState, useEffect } from 'react';
import { fetchCollection, COLLECTIONS } from '../../appwrite';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const BottlerInput = ({ freeInputAllowed, inputBottler, handleBottlerChange }) => {
    const [allBottlers, setAllBottlers] = useState([]);
    const [selectedBottler, setSelectedBottler] = useState(null);
    const [newBottler, setNewBottler] = useState('');

    useEffect(() => {
        const fetchBottlers = async () => {
            try {
                const loadedBottlers = await fetchCollection(COLLECTIONS.BOTTLERS);
                setAllBottlers(loadedBottlers);
            } catch (error) {
                console.error('Error loading bottlers:', error);
                setAllBottlers([]);
            }
        }
        fetchBottlers();
    }, []);

    useEffect(() => {
        if (inputBottler) {
            if (inputBottler.id) {
                setSelectedBottler(inputBottler);
            } else {
                if (allBottlers.some(bottler => bottler.name === inputBottler)) {
                    setSelectedBottler(allBottlers.find(bottler => bottler.name === inputBottler));
                    setNewBottler(inputBottler);
                } else {
                    setNewBottler(inputBottler);
                }
            }
        } else {
            setNewBottler('');
            setSelectedBottler(null);
        }
    }, [inputBottler]);

    return (
        <Autocomplete
            options={allBottlers}
            getOptionLabel={(option) => option.name}
            value={selectedBottler}
            onChange={(_, newValue) => handleBottlerChange(newValue)}
            renderInput={(params) => <TextField {...params} label="Abfüller" />}
            freeSolo={freeInputAllowed}
            inputValue={newBottler}
            onInputChange={(_, newInputValue) => setNewBottler(newInputValue)}
        />
    );
};

export default BottlerInput;