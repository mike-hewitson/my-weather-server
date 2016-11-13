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
        var query = Readings.aggregate([{
            $unwind: {
                path: "$sensors"
            }
        }, {
            "$match": {
                "sensors.sensor": { "$eq": "Environment" }
            }
        }, {
            $project: {
                sensors: 1,
                yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
            }
        }, {
            "$group": {
                "_id": {
                    "date": "$yearMonthDay"
                },
                "count": {
                    "$sum": 1
                },
                "avgHum": {
                    "$avg": "$sensors.hum"
                },
                "avgTemp": {
                    "$avg": "$sensors.temp"
                },
                "maxTemp": {
                    "$max": "$sensors.temp"
                },
                "minTemp": {
                    "$min": "$sensors.temp"
                },
                "maxHum": {
                    "$max": "$sensors.hum"
                },
                "minHum": {
                    "$min": "$sensors.hum"
                }
            }
        }, {
            $sort: { "_id.date": 1}
        }]);

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
        dateTo = new Date(Date.now());
        dateFrom.setDate(dateTo.getDate() - req.params.daysBack);
        var query = Readings.aggregate([{
            $match: {
                date: { $gte: dateFrom }
            }
        }, {
            $unwind: {
                path: "$sensors"
            }
        }, {
            "$match": {
                "sensors.sensor": { "$eq": "Environment" }
            }
        }, {
            $project: {
                sensors: 1,
                yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
            }
        }, {
            "$group": {
                "_id": {
                    "date": "$yearMonthDay"
                },
                "count": {
                    "$sum": 1
                },
                "avgHum": {
                    "$avg": "$sensors.hum"
                },
                "avgTemp": {
                    "$avg": "$sensors.temp"
                },
                "maxTemp": {
                    "$max": "$sensors.temp"
                },
                "minTemp": {
                    "$min": "$sensors.temp"
                },
                "maxHum": {
                    "$max": "$sensors.hum"
                },
                "minHum": {
                    "$min": "$sensors.hum"
                }
            }
        }, {
            $sort: { "_id.date": 1}
        }]);

        query.exec(function(err, reading) {
            /* istanbul ignore if */
            if (err) throw err;
            res.json(reading);
        });
    });

module.exports = historyRouter;
