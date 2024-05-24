import React from 'react';
import { Container, Typography } from '@mui/material';
import Form from './Components/Form';

function App() {
  return (
    <Container style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Vehicle Rental Form
      </Typography>
      <Form />
    </Container>
  );
}

export default App;