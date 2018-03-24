global.__basedir = __dirname;
const express = require('express');
const server = express();
var bodyParser = require('body-parser');
var gpioUtil = require(`${__basedir}/services/gpio.service`);
var fs = require('fs');
var ip = require(`${__basedir}/services/ip.service`);
var logger = require(`${__basedir}/logger`);

require('winston-logs-display')(server, logger);

var defaultRoute = require(`${__basedir}/route_methods/index`);
var powerStrip = require(`${__basedir}/route_methods/powerStrip`);

server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

server.use(bodyParser.json());

server.use('/', defaultRoute);
server.use('/sockets', powerStrip);

server.listen(5555, () => {
    // set up rpio and gpio pins
    var allOutputPins = [3, 5, 7, 11, 13, 15, 19, 21];
    gpioUtil.initOutPins(allOutputPins);

    logger.info(`Server running at http://${ip.getIP()}:5555/`);
});

module.exports = server;