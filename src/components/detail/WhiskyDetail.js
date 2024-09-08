// src/components/WhiskyDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddWhisky from '../AddWhisky';
import { Divider } from '@mui/material';
import placeholderImage from '../../assets/placeholder.png';
import Dialog from '@mui/material/Dialog';

const WhiskyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [whisky, setWhisky] = useState(null);
    const [open, setOpen] = useState(false);


    const fetchWhisky = async () => {
        const docRef = doc(db, 'whiskies', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setWhisky({ id: docSnap.id, ...docSnap.data() });
        } else {
            console.error("No such document!");
        }
    };

    useEffect(() => {
        fetchWhisky();
    }, [id]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const editingDone = () => {
        setIsEditing(false);
        fetchWhisky();
    };

    const handleDeleteClick = async () => {
        //Todo: Delete image as well
        const docRef = doc(db, 'whiskies', id);
        await deleteDoc(docRef);
        navigate('/');
    };

    const handleImageClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (!whisky) {
        return <Typography>Loading...</Typography>;
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''; 
        const date = new Date(dateString);
        return date.toLocaleDateString('de-CH', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      };

    return (
        <>
            {
                isEditing ? (
                    <AddWhisky whisky={whisky} editingDone={editingDone} />
                ) : (
                    <Card sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
                        <>
                            <Box onClick={handleImageClick} sx={{ cursor: 'pointer' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ height: 300, objectFit: 'cover' }}
                                    image={whisky.imageUrl ? whisky.imageUrl : placeholderImage}
                                    alt={`Image of ${whisky.distillery}`}
                                />
                            </Box>

                            <Dialog open={open} onClose={handleClose} maxWidth="sm">
                                <img
                                    src={whisky.imageUrl ? whisky.imageUrl : placeholderImage}
                                    alt={`Full view of ${whisky.distillery}`}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </Dialog>
                        </>

                        <CardContent>
                            <Typography variant="h4" component="div" gutterBottom>
                                {whisky.distillery} {whisky.series && `- ${whisky.series}`} {whisky.bottler && `- ${whisky.bottler}`}
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            <Typography variant="h5" color="text.secondary" gutterBottom>Basisinformationen</Typography>
                            <Typography variant="body" color="text.primary" component="p">Destillerie: {whisky.distillery}</Typography>
                            <Typography variant="body" color="text.primary" component="p">Region: {whisky.region}</Typography>
                            <Typography variant="body" color="text.primary" component="p">Alter: {whisky.age || "N/A"}</Typography>
                            <Typography variant="body" color="text.primary" component="p">Alc. Vol: {whisky.abv}%</Typography>

                            <Typography variant="h5" color="text.secondary" gutterBottom sx={{ mt: 3 }}>Zusätzliche Informationen zur Abfüllung</Typography>
                            {whisky.bottler && <Typography variant="body" color="text.primary" component="p">Abfüller: {whisky.bottler}</Typography>}
                            {whisky.series && <Typography variant="body" color="text.primary" component="p">Serie: {whisky.series}</Typography>}
                            {whisky.distilledDate && <Typography variant="body" color="text.primary" component="p">Destilliert am: {formatDate(whisky.distilledDate)}</Typography>}
                            {whisky.bottledDate && <Typography variant="body" color="text.primary" component="p">Abgefüllt am: {formatDate(whisky.bottledDate)}</Typography>}
                            {whisky.barrelNo && (
                                <Typography variant="body" color="text.primary" component="p">Fassnummer: {whisky.barrelNo}</Typography>
                            )}
                            {whisky.bottleNo && (
                                <Typography variant="body" color="text.primary" component="p">Flaschennummer: {whisky.bottleNo}</Typography>
                            )}

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h5" color="text.secondary" gutterBottom>Status und Kommentar</Typography>
                            <Typography variant="body" color="text.primary" component="p">Status: {whisky.status}</Typography>
                            {whisky.comment && (
                                <>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>Kommentar</Typography>
                                    <Typography variant="body" color="text.primary" component="p">{whisky.comment}</Typography>
                                </>
                            )}

                        </CardContent>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                            <Button variant="contained" color="primary" onClick={handleEditClick}>
                                Bearbeiten
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleDeleteClick}>
                                Löschen
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                                <Typography variant="body2" color="text.secondary">Erstellt am: {formatDate(whisky.creationDate)}</Typography>
                                <Typography variant="body2" color="text.secondary">Zuletzt aktualisiert am: {formatDate(whisky.lastUpdateDate)}</Typography>
                            </Box>
                    </Card>
                )
            }
        </>
    );
};

export default WhiskyDetail;