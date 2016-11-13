var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Readings = require('../models/readings');

var latestRouter = express.Router();

latestRouter.use(bodyParser.json());


latestRouter.route('/')
    .all(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    })
    .get(function(req, res, next) {
        var query = Readings.find().limit(1).sort({ $natural: -1 });
        query.exec(function(err, reading) {
            /* istanbul ignore if */
            if (err) throw err;
            res.json(reading);
        });
    });

module.exports = latestRouter;
