// src/components/WhiskyDetail.js
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';

const cardStyle = css`
  max-width: 600px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  padding: 16px;
`;

const WhiskyEdit = ({ whisky, editingDone }) => {
    const [formValues, setFormValues] = useState({
        ...whisky
    });

    const handleCancelClick = () => {
        editingDone();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSaveClick = async () => {
        const docRef = doc(db, 'whiskies', whisky.id);
        await updateDoc(docRef, {
            ...formValues,
            age: parseInt(formValues.age, 10),
        });
        editingDone();
    };

    //Todo: Add option to choose the distillery from the dropdown
    return (
        <Card css={cardStyle}>
            <ContentBox>
                <CardContent>
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
                        label="Region"
                        name="region"
                        value={formValues.region}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSaveClick}>
                        Save
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleCancelClick}>
                        Cancel
                    </Button>
                </Box>
            </ContentBox>
        </Card>
    );
};

export default WhiskyEdit;