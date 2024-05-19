// src/components/AddWhisky.js
import React, { useState, useEffect } from 'react';
import { db, storage, addWhisky, fetchDistilleries } from '../firebase';
import { collection, getDocs, setDoc, doc, where, query } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

const AddWhisky = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [distillery, setDistillery] = useState(null);
    const [type, setType] = useState('');
    const [regions, setRegions] = useState([]);
    const [region, setRegion] = useState(null);
    const [newRegion, setNewRegion] = useState('');
    const [distilleries, setDistilleries] = useState([]);
    const [newDistillery, setNewDistillery] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    const loadDistilleries = async (region = undefined) => {
        fetchDistilleries(region, setDistilleries);
        if (region && !distilleries.includes(distillery)) {
            resetDistillery();
        }
    };

    const resetDistillery = () => {
        setDistillery(null);
        setNewDistillery('');
    };

    const handleRegionChange = (newRegion) => {
        loadDistilleries(newRegion);
        setNewRegion(newRegion);
    };

    const handleDistilleryChange = (newDistillery) => {
        setNewDistillery(newDistillery);
        setNewRegion(distilleries.find(d => d.id === newDistillery)?.region || '');
    }

    useEffect(() => {
        loadDistilleries();
    }, []);

    useEffect(() => {
        const fetchRegions = async () => {
            const snapshot = await getDocs(collection(db, 'regions'));
            setRegions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
        fetchRegions();
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setImagePreviewUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async () => {
        let distilleryId = distillery ? distillery.id : null;
        let regionId = region ? region.id : null;

        if (!distilleryId && newDistillery) {
            // Add the new distillery to Firestore
            await setDoc(doc(db, 'distilleries', newDistillery), { name: newDistillery });
            distilleryId = newDistillery;
        }

        if (!regionId && newRegion) {
            // Add the new region to Firestore
            await setDoc(doc(db, 'regions', newRegion), { name: newRegion });
            regionId = newRegion;
        }

        let imageUrl = '';
        if (image) {
            const storageRef = ref(storage, `whiskies/${image.name}`);
            await uploadBytes(storageRef, image);
            imageUrl = await getDownloadURL(storageRef);
        }

        const newWhisky = {
            name,
            age: parseInt(age),
            distillery: distilleryId,
            type,
            region: regionId,
            imageUrl,
        };

        await addWhisky(newWhisky);

        setName('');
        setAge('');
        setDistillery(null);
        setNewDistillery('');
        setNewRegion('');
        setType('');
        setRegion('');
        setImage(null);
        setImagePreviewUrl('');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" gutterBottom>
                Whisky hinzufügen
            </Typography>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <TextField label="Alter" type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
            <Autocomplete
                options={distilleries}
                getOptionLabel={(option) => option.name}
                value={distillery}
                onChange={(_, newValue) => setDistillery(newValue)}
                renderInput={(params) => <TextField {...params} label="Destillerie" />}
                freeSolo
                inputValue={newDistillery}
                onInputChange={(_, newInputValue) => handleDistilleryChange(newInputValue)}
            />
            <Autocomplete
                options={regions}
                getOptionLabel={(option) => option.name}
                value={region}
                onChange={(_, newValue) => setRegion(newValue)}
                renderInput={(params) => <TextField {...params} label="Region" />}
                freeSolo
                inputValue={newRegion}
                onInputChange={(_, newInputValue) => handleRegionChange(newInputValue)}
            />
            <TextField label="Typ" value={type} onChange={(e) => setType(e.target.value)} required />
            <Button variant="contained" component="label">
                Bild hochladen
                <input type="file" hidden onChange={handleImageChange} />
            </Button>
            {imagePreviewUrl && (
                <img src={imagePreviewUrl} alt="Image Preview" style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '10px' }} />
            )}
            <Button variant="contained" color="primary" onClick={handleSubmit}>Add Whisky</Button>
        </Box>
    );
};

export default AddWhisky;