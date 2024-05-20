import React, { useState, useEffect } from 'react';
import { fetchDistilleries } from '../firebase';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const DistilleryInput = ({ freeInputAllowed, region, handleDistilleryChange }) => {
    const [distilleries, setDistilleries] = useState([]);
    const [selectedDistillery, setDistillery] = useState(null);
    const [newDistillery, setNewDistillery] = useState('');

    useEffect(() => {
        loadDistilleries(region);
    }, [region]);

    const loadDistilleries = async (region = undefined) => {
        const regionId = region ? region.id : undefined;
        const loadedDistilleries = await fetchDistilleries(regionId, setDistilleries);
        setDistilleries(loadedDistilleries);
        if (region && selectedDistillery && !loadedDistilleries.includes(selectedDistillery)) {
            resetDistillery();
        }
    };

    const resetDistillery = () => {
        setDistillery(null);
        setNewDistillery('');
    };

    const handleSelectedDistillery = (distillery) => {
        setDistillery(distillery);
        handleDistilleryChange(distillery);
    }

    const handleNewDistillery = (newDistillery) => {
        setNewDistillery(newDistillery);
        handleDistilleryChange(newDistillery);
    }

    return (
        <Autocomplete
            options={distilleries}
            getOptionLabel={(option) => option.name}
            value={selectedDistillery}
            onChange={(_, newValue) => handleSelectedDistillery(newValue)}
            renderInput={(params) => <TextField {...params} label="Destillerie" />}
            freeSolo={freeInputAllowed}
            inputValue={newDistillery}
            onInputChange={(_, newInputValue) => handleNewDistillery(newInputValue)}
        />
    );
};

export default DistilleryInput;