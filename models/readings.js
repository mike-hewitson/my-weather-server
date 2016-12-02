// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sensorSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: false
    },
    sensor: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    summaryNow: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    sunrise: {
        type: Date,
        required: true
    },
    sunset: {
        type: Date,
        required: true
    },
    temp: {
        type: Number,
        min: -10,
        max: 40,
        required: true
    },
    wind: {
        type: Number,
        min: 0,
        max: 150,
        required: true
    },
    pressure: {
        type: Number,
        min: 900,
        max: 1200,
        required: true
    },
    cloud: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    hum: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    precip: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    precipProb: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    }
});

// create a schema
var readingSchema = new Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    sensors: [sensorSchema]
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Readings = mongoose.model('Readings', readingSchema);

// make this available to our Node applications
module.exports = Readings;
