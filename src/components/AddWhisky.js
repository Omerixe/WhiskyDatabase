// src/components/AddWhisky.js
import React, { useState, useEffect } from 'react';
import { db, storage, addWhisky } from '../firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
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
  const [region, setRegion] = useState('');
  const [distilleries, setDistilleries] = useState([]);
  const [newDistillery, setNewDistillery] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  useEffect(() => {
    const fetchDistilleries = async () => {
      const snapshot = await getDocs(collection(db, 'distilleries'));
      setDistilleries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchDistilleries();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async () => {
    let distilleryId = distillery ? distillery.id : null;

    if (!distilleryId && newDistillery) {
      // Add the new distillery to Firestore
      await setDoc(doc(db, 'distilleries', newDistillery), {name: newDistillery});
      distilleryId = newDistillery;
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
      region,
      imageUrl,
    };

    await addWhisky(newWhisky);

    setName('');
    setAge('');
    setDistillery(null);
    setNewDistillery('');
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
        onInputChange={(_, newInputValue) => setNewDistillery(newInputValue)}
      />
      <TextField label="Typ" value={type} onChange={(e) => setType(e.target.value)} required />
      <TextField label="Region" value={region} onChange={(e) => setRegion(e.target.value)} required />
      <Button variant="contained" component="label">
        Bild hochladen
        <input type="file" hidden onChange={handleImageChange} />
      </Button>
      { imagePreviewUrl && (
        <img src={imagePreviewUrl} alt="Image Preview" style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '10px' }} />
      )}
      <Button variant="contained" color="primary" onClick={handleSubmit}>Add Whisky</Button>
    </Box>
  );
};

export default AddWhisky;