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

        await Vehicle.deleteMany({});
        const insertedVehicles = await Vehicle.insertMany(vehicles);
        res.status(200).send('Data seeded successfully');
    } catch (error) {
        res.status(500).send(`Error seeding data: ${error.message}`);
    }
});

// Get vehicle types
router.get('/types/:wheels', async (req, res) => {
    try {
        const { wheels } = req.params;
        const types = await Vehicle.find({ wheels }).distinct('type');
        const vehicles = await Vehicle.find({ wheels }).select('type model');

        if (types.length === 0) {
            return res.status(404).send('No vehicles found with the specified number of wheels');
        }

        const typesWithModels = types.map(type => ({
            type,
            models: vehicles.filter(vehicle => vehicle.type === type).map(vehicle => vehicle.model)
        }));

        res.json(typesWithModels);
    } catch (error) {
        console.error('Error fetching vehicle types:', error);
        res.status(500).send('Error fetching vehicle types');
    }
});

// Get vehicle models
router.get('/models/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const models = await Vehicle.find({ type }).select('model');
        res.json(models);
    } catch (error) {
        res.status(500).send('Error fetching vehicle models');
    }
});

// Book a vehicle
router.post('/book', async (req, res) => {
    try {
        const { vehicleModel, startDate, endDate } = req.body;
        const vehicle = await Vehicle.findOne({ model: vehicleModel });

        if (!vehicle.available) {
            return res.status(400).send('Vehicle is not available');
        }

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        if (parsedStartDate >= parsedEndDate) {
            return res.status(400).send('End date must be after start date');
        }

        vehicle.available = false;
        await vehicle.save();
        res.status(200).send('Vehicle booked successfully');
    } catch (error) {
        res.status(500).send('Error booking vehicle');
    }
});



module.exports = router;
