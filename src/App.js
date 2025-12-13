// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import WhiskyList from './components/overview/WhiskyList';
import AddWhisky from './components/AddWhisky';
import WhiskyDetail from './components/detail/WhiskyDetail';
import Login from './components/Login';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const deepBrown = '#2C1B18';
const warmGold = '#A67B5B';
const white = '#FFFFFF';

const lightGold = '#D4B484';
const theme = createTheme({
  palette: {
    primary: {
      main: deepBrown, 
    },
    secondary: {
      main: warmGold, 
    },
    background: {
      default: '#E1DAD3', // Soft neutral background
      paper: white, // White card background
    },
    text: {
      primary: deepBrown, 
      secondary: warmGold, 
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: white, 
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: warmGold, 
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: lightGold, 
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: deepBrown, 
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          backgroundColor: white, 
          borderColor: deepBrown, 
          borderRadius: '5px',
        },
        listbox: {
          backgroundColor: white, 
          color: deepBrown, 
        },
        option: {
          backgroundColor: white, 
          color: deepBrown, 
          '&:hover': {
            backgroundColor: warmGold, 
          },
        },
      },
    },
  },
});

const AppContent = () => {
  const { currentUser, logout } = useAuth();

  return (
    <>
      <AppBar position="static" color="primary">
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
      
      <Container style={{ marginTop: '20px', marginBottom: '20px' }}>
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
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* Resets browser's default styles */}
          <div translate="no">
            <AppContent />
          </div>
        </ThemeProvider>
      </Router>
    </AuthProvider>
  );
};

export default App;