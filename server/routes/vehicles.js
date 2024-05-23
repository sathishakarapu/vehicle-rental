const express = require('express');
const router = express.Router();
const Vehicle = require('../models/vehicles');

router.get('/seed', async (req, res) => {
    try {
        const vehicles = [
            { type: 'hatchback', model: 'Hatchback Model 1', wheels: 4, available: true },
            { type: 'suv', model: 'SUV Model 1', wheels: 4, available: true },
            { type: 'sedan', model: 'Sedan Model 1', wheels: 4, available: true },
            { type: 'cruiser', model: 'Cruiser Model 1', wheels: 2, available: true },
            { type: 'sports', model: 'Sports Model 1', wheels: 2, available: true },
        ];

        await Vehicle.insertMany(vehicles);
        res.status(200).send('Data seeded successfully');
    } catch (error) {
        res.status(500).send('Error seeding data');
    }
});

router.get('/types/:wheels', async (req, res) => {
    try {
        const { wheels } = req.params;
        const types = await Vehicle.find({ wheels, available: true }).distinct('type');
        res.json(types);
    } catch (error) {
        res.status(500).send('Error fetching vehicle types');
    }
});

router.get('/models/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const models = await Vehicle.find({ type, available: true }).select('model');
        res.json(models);
    } catch (error) {
        res.status(500).send('Error fetching vehicle models');
    }
});

router.post('/book', async (req, res) => {
    try {
        const { model, startDate, endDate } = req.body;
        const vehicle = await Vehicle.findOne({ model });

        if (!vehicle.available) {
            return res.status(400).send('Vehicle is not available');
        }

        vehicle.available = false;
        await vehicle.save();
        res.status(200).send('Vehicle booked successfully');
    } catch (error) {
        res.status(500).send('Error booking vehicle');
    }
});

module.exports = router;
