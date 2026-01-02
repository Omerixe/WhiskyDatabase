import React, { useState, useEffect } from 'react';
import { fetchCollection, COLLECTIONS } from '../../appwrite';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const RegionInput = ({ freeInputAllowed, inputRegion, handleRegionChange }) => {
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [newRegion, setNewRegion] = useState('');

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const loadedRegions = await fetchCollection(COLLECTIONS.REGIONS);
                setRegions(loadedRegions);
            } catch (error) {
                console.error('Error loading regions:', error);
                setRegions([]);
            }
        }
        fetchRegions();
    }, []);

    useEffect(() => {
        if (inputRegion) {
            if (inputRegion.id) {
                setSelectedRegion(inputRegion);
            } else {
                if (regions.some(region => region.name === inputRegion)) {
                    setSelectedRegion(regions.find(region => region.name === inputRegion));
                    setNewRegion(inputRegion);
                } else {
                    setNewRegion(inputRegion);
                }
            }
        } else {
            setNewRegion('');
            setSelectedRegion(null);
        }
    }, [inputRegion]);

    return (
        <Autocomplete
            options={regions}
            getOptionLabel={(option) => option.name}
            value={selectedRegion}
            onChange={(_, newValue) => {
                handleRegionChange(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Region" required/>}
            freeSolo={freeInputAllowed}
            inputValue={newRegion}
            onInputChange={(_, newInputValue) => {
                setNewRegion(newInputValue);
                // In freeSolo mode, notify parent of text changes
                if (freeInputAllowed && newInputValue) {
                    // If user is typing something different from the selected option, clear selection
                    if (selectedRegion && newInputValue !== selectedRegion.name) {
                        setSelectedRegion(null);
                    }
                    // Always notify parent so new entities can be created or selection updated
                    if (!selectedRegion || newInputValue !== selectedRegion.name) {
                        handleRegionChange(newInputValue);
                    }
                }
            }}
        />
    );
};

export default RegionInput;