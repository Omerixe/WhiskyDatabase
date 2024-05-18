// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import WhiskyList from './components/WhiskyList';
import AddWhisky from './components/AddWhisky';
import WhiskyDetail from './components/WhiskyDetail';
import Login from './components/Login';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const AppContent = () => {
  const { currentUser, logout } = useAuth();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Whisky Datenbank
          </Typography>
          {currentUser ? (
            <>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/add">Whisky Hinzufügen</Button>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={currentUser ? <WhiskyList /> : <Login />} />
          <Route path="/add" element={currentUser ? <AddWhisky /> : <Login />} />
          <Route path="/whisky/:id" element={currentUser ? <WhiskyDetail /> : <Login />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;