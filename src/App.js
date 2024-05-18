import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WhiskyList from './components/WhiskyList';
import AddWhisky from './components/AddWhisky';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Whisky Database
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/add">Add Whisky</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" exact element={<WhiskyList />} />
          <Route path="/add" element={<AddWhisky />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
