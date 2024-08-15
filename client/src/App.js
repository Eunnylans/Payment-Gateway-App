import React from 'react';
import { CssBaseline, Container, Typography, Box } from '@mui/material';
import Checkout from './components/Checkout/Checkout';
import './App.css';

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Container maxWidth="sm">
        <Box textAlign="center" py={5}>
          <Typography variant="h4" component="h1" gutterBottom>
            Payment Gateway
          </Typography>
          <Checkout />
        </Box>
      </Container>
    </div>
  );
}

export default App;
