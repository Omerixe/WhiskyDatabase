import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs} from 'firebase/firestore';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const RegionInput = ({ freeInputAllowed, inputRegion, handleRegionChange }) => {
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [newRegion, setNewRegion] = useState('');

    useEffect(() => {
        const fetchRegions = async () => {
            const snapshot = await getDocs(collection(db, 'regions'));
            setRegions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
            onChange={(_, newValue) => handleRegionChange(newValue)}
            renderInput={(params) => <TextField {...params} label="Region" />}
            freeSolo={freeInputAllowed}
            inputValue={newRegion}
            onInputChange={(_, newInputValue) => handleRegionChange(newInputValue)}
        />
    );
};

export default RegionInput;