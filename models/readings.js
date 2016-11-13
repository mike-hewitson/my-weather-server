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
    temp: {
        type: Number,
        min: 0,
        max: 40,
        required: true
    },
    hum: {
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
