// src/components/AddWhisky.js
import React, { useState, useEffect } from 'react';
import { db, storage, addWhisky } from '../firebase';
import { setDoc, doc, Timestamp} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DistilleryInput from './DistilleryInput';
import RegionInput from './RegionInput';
import MenuItem from '@mui/material/MenuItem';
import { statusConstants } from '../constants';
import { InputAdornment } from '@mui/material';
import SeriesInput from './SeriesInput';
import BottlerInput from './BottlerInput';

const AddWhisky = () => {
    const [age, setAge] = useState(''); 
    const [abv, setAbv] = useState('');
    const [distilledDate, setDistilledDate] = useState('');
    const [bottledDate, setBottledDate] = useState('');
    const [barrelNo, setBarrelNo] = useState('');
    const [bottleNo, setBottleNo] = useState('');
    const [status, setStatus] = useState('');
    const [comment, setComment] = useState('');
    const [bottler, setBottler] = useState('');
    const [series, setSeries] = useState('');
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
        let seriesId = series.id ? series.id : null;
        let bottlerId = bottler.id ? bottler.id : null;

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

        if (!seriesId && series) {
            // Add the new series to Firestore
            await setDoc(doc(db, 'series', series), { name: series });
            seriesId = series;
        }

        if (!bottlerId && bottler) {
            // Add the new bottler to Firestore
            await setDoc(doc(db, 'bottlers', bottler), { name: bottler });
            bottlerId = bottler;
        }

        let imageUrl = '';
        if (image) {
            const storageRef = ref(storage, `whiskies/${image.name}`);
            await uploadBytes(storageRef, image);
            imageUrl = await getDownloadURL(storageRef);
        }

        const newWhisky = {
            age: parseInt(age),
            distillery: distilleryId,
            region: regionId,
            imageUrl,
            abv: parseFloat(abv),
            distilledDate: distilledDate ? Timestamp.fromDate(new Date(distilledDate)) : null,
            bottledDate: bottledDate ? Timestamp.fromDate(new Date(bottledDate)) : null,
            barrelNo,
            bottleNo,
            status,
            comment,
            bottler,
            series,
            createdAt: Timestamp.now(),
        };

        await addWhisky(newWhisky);

        setAge('');
        setDistillery(null);
        setRegion(null);
        setImage(null);
        setImagePreviewUrl('');
        setAbv(''); 
        setDistilledDate(''); 
        setBottledDate(''); 
        setBarrelNo(''); 
        setBottleNo(''); 
        setStatus(''); 
        setComment(''); 
        setBottler(''); 
        setSeries('');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" gutterBottom>
                Whisky hinzufügen
            </Typography>
            <DistilleryInput 
                inputDistillery={distillery}
                freeInputAllowed={true} 
                region={region} 
                handleDistilleryChange={handleDistilleryChange} 
            />
            <RegionInput 
                freeInputAllowed={true}
                inputRegion={region} 
                handleRegionChange={setRegion} 
            />
            <BottlerInput
                freeInputAllowed={true}
                inputBottler={bottler}
                handleBottlerChange={setBottler}
            />
            <SeriesInput
                freeInputAllowed={true}
                inputSeries={series}
                handleSeriesChange={setSeries}
            />
            <TextField label="Alter" type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
            <TextField label="Alc. Vol" value={abv} onChange={(e) => setAbv(e.target.value)} required InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }} />
            <TextField label="Status" value={status} onChange={(e) => setStatus(e.target.value)} required select>
                {statusConstants.map((option) => (  
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>
            <TextField label="Destilliert am" type="date" value={distilledDate} onChange={(e) => setDistilledDate(e.target.value)} InputLabelProps={{ shrink: true }}/>
            <TextField label="Abgefüllt am" type="date" value={bottledDate} onChange={(e) => setBottledDate(e.target.value)} InputLabelProps={{ shrink: true }}/>
            <TextField label="Fass Nr" value={barrelNo} onChange={(e) => setBarrelNo(e.target.value)} />
            <TextField label="Flasche Nr" type="number" value={bottleNo} onChange={(e) => setBottleNo(e.target.value)} />
            <TextField label="Comment" value={comment} onChange={(e) => setComment(e.target.value)} multiline/>
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