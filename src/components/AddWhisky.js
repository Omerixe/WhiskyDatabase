// src/components/AddWhisky.js
import React, { useState, useEffect } from 'react';
import { db, storage, addWhisky } from '../firebase';
import { collection, getDocs, setDoc, doc} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import DistilleryInput from './DistilleryInput';
import RegionInput from './RegionInput';

const AddWhisky = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [region, setRegion] = useState(null);
    const [distillery, setDistillery] = useState(null);
    const [image, setImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    const handleDistilleryChange = (distillery) => {
        setDistillery(distillery);
        const distilleryId = distillery ? (distillery.id ? distillery.id : null) : null;
        if (distilleryId) {
            setRegion(distillery.region);
        }
    }

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setImagePreviewUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    useEffect(() => {
        console.log("Region changed", region);
    }, [region]);

    const handleSubmit = async () => {
        let distilleryId = distillery.id ? distillery.id : null;
        let regionId = region.id ? region.id : null;

        if (!distilleryId && distillery) {
            // Add the new distillery to Firestore
            await setDoc(doc(db, 'distilleries', distillery), { name: distillery });
            distilleryId = distillery;
        }

        if (!regionId && region) {
            // Add the new region to Firestore
            await setDoc(doc(db, 'regions', region), { name: region });
            regionId = region;
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
            region: regionId,
            imageUrl,
        };

        await addWhisky(newWhisky);

        setName('');
        setAge('');
        setDistillery(null);
        setRegion(null);
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
            <DistilleryInput 
                freeInputAllowed={true} 
                region={region} 
                handleDistilleryChange={handleDistilleryChange} 
            />
            <RegionInput 
                freeInputAllowed={true}
                inputRegion={region} 
                handleRegionChange={setRegion} 
            />
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