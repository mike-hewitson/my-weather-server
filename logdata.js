"use strict";

require('dotenv').config();
var request = require('request');
var ForecastIo = require('forecastio');
var winston = require('winston');
var Papertrail = require('winston-papertrail').Papertrail;

var myLogger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            // json: false,
            expressFormat: true,
            colorize: true
                // }),
                // new winston.transports.Papertrail({
                //     host: 'logs4.papertrailapp.com',
                //     port: 32583,
                //     program: 'logdata',
                //     colorize: true
        })
    ]
});

myLogger.transports.console.level = process.env.LOGGING || 'warn';

var url = 'http://' + process.env.REST_SERVER + ':' + process.env.REST_PORT + '/readings';

var options = {
    exclude: 'hourly,daily,flags',
    units: 'si'
};

var forecastIo = new ForecastIo(process.env.API_KEY);
var reading = { date: new Date(), sensors: [] };
myLogger.debug(reading);


forecastIo.forecast('-26.097', '28.053', options).then(function(data) {
    reading.sensors.push({
        sensor: 'Sandton',
        temp: data.currently.temperature.toFixed(1),
        wind: data.currently.windSpeed.toFixed(1),
        pressure: data.currently.pressure.toFixed(1),
        hum: (data.currently.humidity * 100).toFixed(1),
        precip: (data.currently.precipIntensity).toFixed(2),
        cloud: (data.currently.cloudCover * 100).toFixed(1)
    });

    myLogger.debug(reading);

    forecastIo.forecast('-34.089', '24.903', options).then(function(data) {
        reading.sensors.push({
            sensor: 'Paradise Beach',
            temp: data.currently.temperature.toFixed(1),
            wind: data.currently.windSpeed.toFixed(1),
            pressure: data.currently.pressure.toFixed(1),
            hum: (data.currently.humidity * 100).toFixed(1),
            precip: (data.currently.precipIntensity).toFixed(2),
            cloud: (data.currently.cloudCover * 100).toFixed(1)
        });
        myLogger.debug(reading);

        var req = {
            url: url,
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            json: reading
        };

        myLogger.info(req);

        request(req, function(error, response, body) {
            if (response.statusCode === 201) {
                myLogger.info('document saved');
                process.exit();
            } else {
                myLogger.error(response.statusCode);
                myLogger.error(body);
                process.exit(1);
            }
        });
    });
});

// process.exit(1);
