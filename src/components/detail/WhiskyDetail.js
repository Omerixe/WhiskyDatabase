// src/components/WhiskyDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import WhiskyEdit from './WhiskyEdit';

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
    const [isEditing, setIsEditing] = useState(false);
    const [whisky, setWhisky] = useState(null);


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
        await docRef.delete();
        navigate('/');
    };

    if (!whisky) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <>
            {
                isEditing ? (
                    <WhiskyEdit whisky={whisky} editingDone={editingDone} />
                ) : (
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
                                        Region: {whisky.region}
                                    </Typography>
                                </>
                            </CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                                <Button variant="contained" color="primary" onClick={handleEditClick}>
                                    Edit
                                </Button>
                                <Button variant="contained" color="secondary" onClick={handleDeleteClick}>
                                    Delete
                                </Button>
                            </Box>
                        </ContentBox>
                    </Card>
                )}
        </>);
};

export default WhiskyDetail;