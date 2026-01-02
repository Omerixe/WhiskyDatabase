import React, { useState, useEffect } from 'react';
import { fetchDistilleries } from '../../appwrite';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const DistilleryInput = ({ freeInputAllowed, inputDistillery, region, handleDistilleryChange }) => {
    const [distilleries, setDistilleries] = useState([]);
    const [selectedDistillery, setDistillery] = useState(null);
    const [newDistillery, setNewDistillery] = useState('');

    useEffect(() => {
        loadDistilleries(region);
    }, [region]);

    useEffect(() => {
        console.log('Input distillery changed:', inputDistillery);
        if (inputDistillery) {
            if (inputDistillery.id) {
                setDistillery(inputDistillery);
            } else {
                setNewDistillery(inputDistillery);
            }
        } else {
            setDistillery(null)
            setNewDistillery('')
        }
    }, [inputDistillery])

    const loadDistilleries = async (region = undefined) => {
        try {
            const regionId = region ? (region.id ? region.id : region) : undefined;
            const loadedDistilleries = await fetchDistilleries(regionId);
            setDistilleries(loadedDistilleries);
            if (regionId && selectedDistillery && !loadedDistilleries.some(distillery => distillery.id === selectedDistillery.id)) {
                resetDistillery();
            }
        } catch (error) {
            console.error('Error loading distilleries:', error);
            setDistilleries([]);
        }
    };

    const resetDistillery = () => {
        setNewDistillery('');
    };

    return (
        <Autocomplete
            options={distilleries}
            getOptionLabel={(option) => option.name}
            value={selectedDistillery}
            onChange={(_, newValue) => {
                handleDistilleryChange(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Destillerie" required />}
            freeSolo={freeInputAllowed}
            inputValue={newDistillery}
            onInputChange={(_, newInputValue) => {
                setNewDistillery(newInputValue);
                // In freeSolo mode, notify parent of text changes
                if (freeInputAllowed && newInputValue) {
                    // If user is typing something different from the selected option, clear selection
                    if (selectedDistillery && newInputValue !== selectedDistillery.name) {
                        setDistillery(null);
                    }
                    // Always notify parent so new entities can be created or selection updated
                    if (!selectedDistillery || newInputValue !== selectedDistillery.name) {
                        handleDistilleryChange(newInputValue);
                    }
                }
            }}
        />
    );
};

export default DistilleryInput;