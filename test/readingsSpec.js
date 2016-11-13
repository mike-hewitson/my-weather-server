/* test/test_dish.js*/

var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;

var mongoose = require('mongoose');

require('dotenv').config();
var app = require('../app');
var Readings = require('../models/readings');

var STRICT_REST = true;
// change that to false depending on https://www.coursera.org/learn/server-side-development/lecture/bKtMl/exercise-video-rest-api-with-express-mongodb-and-mongoose/discussions/x1AZIu9SEeWB0QpuSDkq-Q
var HTTP_OK = 200;
var HTTP_CREATED = (STRICT_REST) ? 201 : HTTP_OK;
var HTTP_NOT_FOUND = 404;

/*
 * Data
 */
var readings_fixture = require('./fixtures/readings_fixture');
var new_reading = {
    // "_id": "12345",
    "date": Date("2016-03-22T08:26:13.158Z"),
    "sensors": [{
        // "_id" : 1,
        "hum": 56,
        "sensor": "Ambient",
        "temp": 22
    }, {
        // "_id" : 2,
        "hum": 8,
        "sensor": "Fridge",
        "temp": 7
    }, {
        // "_id" : 3,
        "hum": 56,
        "sensor": "Curing",
        "temp": 3
    }]
};

var new_sensor = {
    // "_id": 3,
    sensor: "Bob",
    hum: 33,
    temp: 22
};

/*
 * Tests
 */
describe('Readings', function() {
    beforeEach(function(done) {
        Readings.remove({}, function(err, res) { // don't use drop() as this will occasionnnaly raise a background operation error
            var difference = new Date() - new Date(readings_fixture[9].date);
            adjusted_readings = readings_fixture.map( function(element) {
                var new_date = new Date(new Date(element.date).getTime() + difference);
                var new_element = element;
                new_element.date = new_date.toJSON();
                return new_element;
            });
            Readings.insertMany(adjusted_readings, done);
        });
    });

    describe('GET /reading', function() {
        it('respond with code 404 (wrong spelling)', function(done) {
            request(app)
                .get('/reading')
                .expect(HTTP_NOT_FOUND, done);
        });
    });

    describe('GET /readings', function() {
        it('respond with code HTTP_OK + list of readings', function(done) {
            request(app)
                .get('/readings')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(HTTP_OK)
                .expect(function(res) {
                    expect(res.body).to.deep.equal(adjusted_readings);
                })
                .end(done);
        });
    });

    describe('DELETE /readings', function() {
        it('responds with code HTTP_OK', function(done) {
            request(app)
                .delete('/readings')
                .expect(HTTP_OK)
                .expect(function(res) {
                    assert.deepEqual(res.body, { ok: 1, n: 10 });
                })
                .end(done);
        });
    });

    describe('POST /readings', function() {
        it('HTTP_CREATED + data content', function(done) {
            request(app)
                .post('/readings')
                .set('Accept', 'application/json')
                .send(new_reading)
                .expect(HTTP_CREATED)
                .end(done);
        });
    });

    describe('GET /readings/56f102d1c369bf0525c055f9', function() {
        it('respond with code HTTP_OK + data content', function(done) {
            request(app)
                .get('/readings/56f102d1c369bf0525c055f9')
                .set('Accept', 'application/json')
                .expect(HTTP_OK)
                .expect(function(res) {
                    assert.deepEqual(res.body, readings_fixture[0]);
                })
                .end(done);
        });
    });

    describe('PUT /readings/56f102d1c369bf0525c055f9', function() {
        it('respond with code HTTP_OK + data content', function(done) {
            request(app)
                .put('/readings/56f102d1c369bf0525c055f9')
                .set('Accept', 'application/json')
                .send(new_reading)
                .expect(HTTP_OK)
                .expect(function(res) {
                    assert.equal(res.body._id, "56f102d1c369bf0525c055f9");
                    assert.isAtLeast(Date(res.body.date), new_reading.date);
                    assert.deepEqual(res.body.sensors, new_reading.sensors);
                })
                .end(done);
        });
    });

    describe('DELETE /readings/56f102d1c369bf0525c055f9', function() {
        it('respond with code HTTP_OK + data content', function(done) {
            request(app)
                .delete('/readings/56f102d1c369bf0525c055f9')
                .expect(HTTP_OK)
                .expect(function(res) {
                    assert.deepEqual(res.body, readings_fixture[0]);
                })
                .end(done);
        });
    });

    describe('GET /readings/56f104e5c369bf05c26e7a2f/sensors', function() {
        it('respond with code HTTP_OK + data content', function(done) {
            request(app)
                .get('/readings/56f104e5c369bf05c26e7a2f/sensors')
                .set('Accept', 'application/json')
                .expect(HTTP_OK)
                .expect(function(res) {
                    assert.deepEqual(res.body, readings_fixture[2].sensors);
                })
                .end(done);
        });
    });

    describe('POST /readings/56f104e5c369bf05c26e7a2f/sensors', function() {
        it('HTTP_CREATED', function(done) {
            request(app)
                .post('/readings/56f104e5c369bf05c26e7a2f/sensors')
                .set('Accept', 'application/json')
                .send(new_sensor)
                .expect(HTTP_OK)
                .end(done);
        });
    });

});
