import React from 'react';
import AppRouter from './router';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Typography from '@mui/material/Typography';

// import bg from "./bg.png";

function App() {
  return (
    <div
      style={{
        // backgroundColor: 'rgba(255, 255, 255, 0.85)',
        width: '100%',
        height: '100vh',
      }}
    >
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <Typography>
        <Toaster position="top-center" reverseOrder={false}/>
      </Typography>
    </div>
  );
}

export default App;
