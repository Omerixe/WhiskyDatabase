// src/components/AddWhisky.js
import React, { useState, useEffect } from 'react';
import { addWhisky, createDocument, updateDocument, uploadFile, getFileUrl, COLLECTIONS } from '../appwrite';
import { slugify } from '../utils/slugify';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DistilleryInput from './inputs/DistilleryInput';
import RegionInput from './inputs/RegionInput';
import MenuItem from '@mui/material/MenuItem';
import { statusConstants } from '../constants';
import { InputAdornment } from '@mui/material';
import SeriesInput from './inputs/SeriesInput';
import BottlerInput from './inputs/BottlerInput';
import Grid from '@mui/material/GridLegacy';
import Divider from '@mui/material/Divider';

const AddWhisky = ({ whisky, editingDone }) => {
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

    useEffect(() => {
        if (whisky) {
            setAge(whisky.age ? whisky.age.toString() : '');
            setAbv(whisky.abv ? whisky.abv.toString() : '');
            setDistilledDate(whisky.distilledDate ? whisky.distilledDate : '');
            setBottledDate(whisky.bottledDate ? whisky.bottledDate : '');
            setBarrelNo(whisky.barrelNo ? whisky.barrelNo : '');
            setBottleNo(whisky.bottleNo ? whisky.bottleNo : '');
            setStatus(whisky.status ? whisky.status : '');
            setComment(whisky.comment ? whisky.comment : '');
            
            // Handle both old and new foreign key patterns
            const bottlerData = whisky.bottler ? 
                (whisky.bottler_name ? { id: whisky.bottler, name: whisky.bottler_name } : whisky.bottler) : '';
            const seriesData = whisky.series ? 
                (whisky.series_name ? { id: whisky.series, name: whisky.series_name } : whisky.series) : '';
            const regionData = whisky.region ? 
                (whisky.region_name ? { id: whisky.region, name: whisky.region_name } : whisky.region) : null;
            const distilleryData = whisky.distillery ? 
                (whisky.distillery_name ? { id: whisky.distillery, name: whisky.distillery_name } : whisky.distillery) : null;
            


            setBottler(bottlerData);
            setSeries(seriesData);
            setRegion(regionData);
            setDistillery(distilleryData);
            setImagePreviewUrl(whisky.imageUrl ? whisky.imageUrl : '');
        }
    }, [whisky]);

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

    const handleSubmit = async () => {
        try {
            // Handle both object {id, name} and string inputs
            let distilleryId = distillery?.id || null;
            let distilleryName = distillery?.name || (typeof distillery === 'string' ? distillery : null);
            let regionId = region?.id || null;
            let regionName = region?.name || (typeof region === 'string' ? region : null);
            let seriesId = series?.id || null;
            let seriesName = series?.name || (typeof series === 'string' ? series : null);
            let bottlerId = bottler?.id || null;
            let bottlerName = bottler?.name || (typeof bottler === 'string' ? bottler : null);

            // Create new entities if they don't exist, using slugified IDs
            if (!regionId && region) {
                const newRegion = await createDocument(
                    COLLECTIONS.REGIONS,
                    slugify(regionName),
                    { name: regionName }
                );
                console.info('Created new region:', newRegion);
                regionId = newRegion.$id;
            }

            if (!distilleryId && distillery) {
                const newDistillery = await createDocument(
                    COLLECTIONS.DISTILLERIES,
                    slugify(distilleryName),
                    { 
                        name: distilleryName,
                        region: regionId,
                        region_name: regionName
                    }
                );
                distilleryId = newDistillery.$id;
            }

            if (!seriesId && series) {
                const newSeries = await createDocument(
                    COLLECTIONS.SERIES,
                    slugify(seriesName),
                    { name: seriesName }
                );
                seriesId = newSeries.$id;
            }

            if (!bottlerId && bottler) {
                const newBottler = await createDocument(
                    COLLECTIONS.BOTTLERS,
                    slugify(bottlerName),
                    { name: bottlerName }
                );
                bottlerId = newBottler.$id;
            }

            let imageUrl = '';
            if (image) {
                const uploadedFile = await uploadFile(image);
                imageUrl = getFileUrl(uploadedFile.$id);
            } else if (whisky?.imageUrl) {
                imageUrl = whisky.imageUrl;
            }

            const newWhisky = {
                age: parseInt(age) || null,
                distillery: distilleryId,
                distillery_name: distilleryName,
                region: regionId,
                region_name: regionName,
                bottler: bottlerId,
                bottler_name: bottlerName,
                series: seriesId,
                series_name: seriesName,
                imageUrl,
                abv: parseFloat(abv),
                distilledDate: distilledDate ? formatDateToYYYYMMDD(distilledDate) : null,
                bottledDate: bottledDate ? formatDateToYYYYMMDD(bottledDate) : null,
                barrelNo,
                bottleNo: bottleNo ? parseInt(bottleNo) : null,
                status,
                comment,
                creationDate: formatDateToYYYYMMDD(whisky ? whisky.creationDate : Date.now()),
                lastUpdateDate: formatDateToYYYYMMDD(Date.now()),
            };

            if (editingDone) {
                await updateDocument(COLLECTIONS.WHISKIES, whisky.id, newWhisky);
                editingDone();
            } else {
                await addWhisky(newWhisky);

                // Reset form
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
            }
        } catch (error) {
            console.error('Error submitting whisky:', error);
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom>
                {whisky ? "Whisky bearbeiten" : "Whisky hinzufügen"}
            </Typography>

            <Typography variant="h6" gutterBottom>Basisinformationen</Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <DistilleryInput
                        inputDistillery={distillery}
                        freeInputAllowed={true}
                        region={region}
                        handleDistilleryChange={handleDistilleryChange}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <RegionInput
                        freeInputAllowed={true}
                        inputRegion={region}
                        handleRegionChange={setRegion}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Alter"
                        type="number"
                        value={age}
                        autoComplete='off'
                        onChange={(e) => setAge(e.target.value)}
                        required
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Alc. Vol"
                        value={abv}
                        onChange={(e) => setAbv(e.target.value)}
                        required
                        fullWidth
                        autoComplete='off'
                        InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                    />
                </Grid>
            </Grid>
            <Box mt={4}>

                <Typography variant="h6" gutterBottom>Zusatzinformationen zur Abfüllung</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <BottlerInput
                            freeInputAllowed={true}
                            inputBottler={bottler}
                            handleBottlerChange={setBottler}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <SeriesInput
                            freeInputAllowed={true}
                            inputSeries={series}
                            handleSeriesChange={setSeries}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Destilliert am"
                            type="date"
                            value={distilledDate}
                            onChange={(e) => setDistilledDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Abgefüllt am"
                            type="date"
                            value={bottledDate}
                            onChange={(e) => setBottledDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Fass Nr"
                            value={barrelNo}
                            autoComplete='off'
                            onChange={(e) => setBarrelNo(e.target.value)}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Flasche Nr"
                            type="number"
                            autoComplete='off'
                            value={bottleNo}
                            onChange={(e) => setBottleNo(e.target.value)}
                            fullWidth
                        />
                    </Grid>

                </Grid>
            </Box>

            <Box mt={4}>
                <Typography variant="h6" gutterBottom>Status und Kommentar</Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                            select
                            fullWidth
                        >
                            {statusConstants.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Kommentar"
                            value={comment}
                            autoComplete='off'
                            onChange={(e) => setComment(e.target.value)}
                            fullWidth
                            multiline
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box mt={4}>
                <Typography variant="h6" gutterBottom>Bild</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {imagePreviewUrl && (
                            <img
                                src={imagePreviewUrl}
                                alt="Image Preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '300px',
                                    marginTop: '10px',
                                }}
                            />
                        )}
                        <Button variant="contained" component="label" fullWidth>
                            Bild hochladen
                            <input 
                                type="file" 
                                hidden 
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Box mt={4} sx={{ display: 'flex', justifyContent: 'space-between' }}>

                <Grid item xs={12} sm={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        fullWidth
                    >
                        {editingDone ? "Update speichern" : "Whisky hinzufügen"}
                    </Button>
                </Grid>

                {editingDone && (
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={editingDone}
                            fullWidth
                        >
                            Abbrechen
                        </Button>
                    </Grid>
                )}
            </Box >
        </Box >
    );
};

function formatDateToYYYYMMDD(date) {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

export default AddWhisky;