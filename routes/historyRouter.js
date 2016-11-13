var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Readings = require('../models/readings');

var historyRouter = express.Router();

historyRouter.use(bodyParser.json());

historyRouter.route('/')
    .all(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    })
    .get(function(req, res, next) {

        var query = Readings.find()
            .sort({ date: 1 });

        query.exec(function(err, reading) {
            /* istanbul ignore if */
            if (err) throw err;
            res.json(reading);
        });
    });

historyRouter.route('/:daysBack')
    .all(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    })
    .get(function(req, res, next) {
        var dateTo;
        var dateFrom = new Date();
        var daysMod = parseInt(req.params.daysBack);
        dateTo = new Date(Date.now());
        dateFrom.setDate(dateTo.getDate() - daysMod);
        var query = Readings.aggregate([{
            $match: {
                date: { $gte: dateFrom }
            }
        }, {
            $project: {
                sensors: 1,
                date: 1,
                theMod: { $mod: [{ $millisecond: "$date" }, daysMod] }
            }
        }, {
            $match: {
                theMod: { $eq: 0 }
            }
        }, {
            $sort: { date: 1 }
        }]);
        query.exec(function(err, reading) {
            /* istanbul ignore if */
            if (err) throw err;
            res.json(reading);
        });
    });

module.exports = historyRouter;
