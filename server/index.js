const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicles');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use('/', vehicleRoutes);

mongoose.connect('mongodb://localhost:27017/vehicleRental').then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.log('Failed to connect to MongoDB', err);
});