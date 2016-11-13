/* test/test_dish.js*/

var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;

// var assert = require('assert');
var mongoose = require('mongoose');

require('dotenv').config();
var app = require('../app');
var Readings = require('../models/readings');

var STRICT_REST = true; // change that to false depending on https://www.coursera.org/learn/server-side-development/lecture/bKtMl/exercise-video-rest-api-with-express-mongodb-and-mongoose/discussions/x1AZIu9SEeWB0QpuSDkq-Q
var HTTP_OK = 200;
var HTTP_CREATED = (STRICT_REST) ? 201 : HTTP_OK;
var HTTP_NOT_FOUND = 404;

/*
 * Data
 */
var readings_fixture = require('./fixtures/readings_fixture');

/*
 * Tests
 */
describe('Latest', function() {
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

    describe('GET /latest', function() {
        it('respond with code HTTP_OK + list of readings', function(done) {
            request(app)
                .get('/latest')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(HTTP_OK)
                .expect(function(res) {
                    assert.deepEqual(res.body[0], adjusted_readings[9]);
                })
                .end(done);
        });
    });


});
