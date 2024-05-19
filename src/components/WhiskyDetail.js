// src/components/WhiskyDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';

const cardStyle = css`
  max-width: 600px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
`;

const mediaStyle = css`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  padding: 16px;
`;

const WhiskyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [whisky, setWhisky] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formValues, setFormValues] = useState({
        name: '',
        description: '',
        age: '',
        distillery: '',
        type: '',
        region: '',
    });

    useEffect(() => {
        const fetchWhisky = async () => {
            const docRef = doc(db, 'whiskies', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setWhisky({ id: docSnap.id, ...docSnap.data() });
                setFormValues({ ...docSnap.data() });
            } else {
                console.error("No such document!");
            }
        };

        fetchWhisky();
    }, [id]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setFormValues({ ...whisky });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSaveClick = async () => {
        const docRef = doc(db, 'whiskies', id);
        await updateDoc(docRef, {
            ...formValues,
            age: parseInt(formValues.age, 10),
        });
        setWhisky({ ...formValues });
        setIsEditing(false);
    };

    const handleDeleteClick = async () => {
        //Todo: Delete image as well
        const docRef = doc(db, 'whiskies', id);
        await docRef.delete();
        navigate('/');
    };

    if (!whisky) {
        return <Typography>Loading...</Typography>;
    }

    //Todo: Add option to choose the distillery from the dropdown
    return (
        <Card css={cardStyle}>
            {whisky.imageUrl && (
                <CardMedia
                    component="img"
                    css={mediaStyle}
                    image={whisky.imageUrl}
                    alt={whisky.name}
                />
            )}
            <ContentBox>
                <CardContent>
                    {isEditing ? (
                        <>
                            <TextField
                                label="Name"
                                name="name"
                                value={formValues.name}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Age"
                                name="age"
                                type="number"
                                value={formValues.age.toString()}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Distillery"
                                name="distillery"
                                value={formValues.distillery}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Type"
                                name="type"
                                value={formValues.type}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Region"
                                name="region"
                                value={formValues.region}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                        </>
                    ) : (
                        <>
                            <Typography variant="h4" component="div">
                                {whisky.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Age: {whisky.age}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Distillery: {whisky.distillery}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Type: {whisky.type}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Region: {whisky.region}
                            </Typography>
                        </>
                    )}
                </CardContent>
                {isEditing ? (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleSaveClick}>
                            Save
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleCancelClick}>
                            Cancel
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleEditClick}>
                            Edit
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleDeleteClick}>
                            Delete
                        </Button>
                    </Box>
                )}
            </ContentBox>
        </Card>
    );
};

export default WhiskyDetail;