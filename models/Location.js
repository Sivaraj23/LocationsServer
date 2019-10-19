const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var locationSchema = new Schema({
    location: {
        type: String,
        required: true,
        unique: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
});

var Location = mongoose.model('Location', locationSchema);

module.exports = Location;