const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    type: String,
    model: String,
    wheels: Number,
    available: Boolean,
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
