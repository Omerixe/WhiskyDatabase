import React, { useState, useEffect } from 'react';
import { fetchDistilleries } from '../../firebase';
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
        const regionId = region ? region.id ? region.id : region: undefined;
        const loadedDistilleries = await fetchDistilleries(regionId, setDistilleries);
        setDistilleries(loadedDistilleries);
        if (regionId && selectedDistillery && !loadedDistilleries.some(distillery => distillery.id === selectedDistillery.id)) {
            resetDistillery();
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
            onChange={(_, newValue) => handleDistilleryChange(newValue)}
            renderInput={(params) => <TextField {...params} label="Destillerie" required />}
            freeSolo={freeInputAllowed}
            inputValue={newDistillery}
            onInputChange={(_, newInputValue) => handleDistilleryChange(newInputValue)}
        />
    );
};

export default DistilleryInput;