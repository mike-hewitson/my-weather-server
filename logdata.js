"use strict";

require('dotenv').config();
var request = require('request');
var ForecastIo = require('forecastio');
var winston = require('winston');
// var Papertrail = require('winston-papertrail').Papertrail;

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

const icons = {
    "day-sunny": "wi-day-sunny",
    "clear-night": "wi-night-clear",
    "rain": "wi-rain",
    "snow": "wi-snow",
    "sleet": "wi-sleet",
    "strong-wind": "wi-wind",
    "fog": "wi-fog",
    "cloudy": "wi-cloudy",
    "day-cloudy": "wi-day-cloudy",
    "partly-cloudy-day": "wi-day-sunny-overcast",
    "night-cloudy": "wi-night-cloudy",
    "partly-cloudy-night": "wi-night-partly-cloudy",
    "hail": "wi-hail",
    "thunderstorm": "wi-thunderstorm",
    "tornado": "wi-tornado",
    "clear-day": "wi-day-sunny"
};

myLogger.transports.console.level = process.env.LOGGING || 'warn';

var url = 'http://' + process.env.REST_SERVER + ':' + process.env.REST_PORT + '/readings';

var options = {
    exclude: 'hourly,flags, alerts',
    units: 'si'
};

var forecastIo = new ForecastIo(process.env.API_KEY);
var reading = { date: new Date(), sensors: [] };
myLogger.debug(reading);

// var date = new Date(UNIX_Timestamp * 1000)

forecastIo.forecast('-26.097', '28.053', options).then(function(data) {
    myLogger.debug(data);
    if (!icons[data.currently.icon]) {
        myLogger.error("Icon not in lookup :" + data.currently.icon);
        data.currently.icon = "day-sunny";
    }
    reading.sensors.push({
        sensor: 'Sandton',
        summary: data.daily.data[0].summary,
        summaryNow: data.currently.summary,
        sunrise: new Date(data.daily.data[0].sunriseTime * 1000),
        sunset: new Date(data.daily.data[0].sunsetTime * 1000),
        icon: icons[data.currently.icon],
        temp: data.currently.temperature.toFixed(1),
        wind: (data.currently.windSpeed * 3.6).toFixed(1),
        pressure: data.currently.pressure.toFixed(1),
        hum: (data.currently.humidity * 100).toFixed(1),
        precipProb: (data.currently.precipProbability * 100).toFixed(1),
        precip: (data.currently.precipIntensity).toFixed(3),
        cloud: (data.currently.cloudCover * 100).toFixed(1)
    });

    myLogger.debug(reading);

    forecastIo.forecast('-34.089', '24.903', options).then(function(data) {
        myLogger.debug(data);
        if (!icons[data.currently.icon]) {
            myLogger.error("Icon not in lookup :" + data.currently.icon);
            data.currently.icon = "day-sunny";
        }
        reading.sensors.push({
            sensor: 'Paradise Beach',
            summary: data.daily.data[0].summary,
            summaryNow: data.currently.summary,
            sunrise: new Date(data.daily.data[0].sunriseTime * 1000),
            sunset: new Date(data.daily.data[0].sunsetTime * 1000),
            icon: icons[data.currently.icon],
            temp: data.currently.temperature.toFixed(1),
            wind: (data.currently.windSpeed * 3.6).toFixed(1),
            pressure: data.currently.pressure.toFixed(1),
            hum: (data.currently.humidity * 100).toFixed(1),
            precipProb: (data.currently.precipProbability * 100).toFixed(1),
            precip: (data.currently.precipIntensity).toFixed(3),
            cloud: (data.currently.cloudCover * 100).toFixed(1)
        });
        myLogger.debug(reading);

        // lat":"51Âº30'54.24\" N","lng":0Âº05'30.38\" W"

        forecastIo.forecast('51.317', '0.057', options).then(function(data) {
            myLogger.debug(data);
            if (!icons[data.currently.icon]) {
                myLogger.error("Icon not in lookup :" + data.currently.icon);
                data.currently.icon = "day-sunny";
            }
            reading.sensors.push({
                sensor: 'London',
                summary: data.daily.data[0].summary,
                summaryNow: data.currently.summary,
                sunrise: new Date(data.daily.data[0].sunriseTime * 1000),
                sunset: new Date(data.daily.data[0].sunsetTime * 1000),
                icon: icons[data.currently.icon],
                temp: data.currently.temperature.toFixed(1),
                wind: (data.currently.windSpeed * 3.6).toFixed(1),
                pressure: data.currently.pressure.toFixed(1),
                hum: (data.currently.humidity * 100).toFixed(1),
                precipProb: (data.currently.precipProbability * 100).toFixed(1),
                precip: (data.currently.precipIntensity).toFixed(3),
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
});

// process.exit(1);
