// determines apps base director
// https://www.abeautifulsite.net/determining-your-apps-base-directory-in-nodejs
global.__basedir = __dirname;

// TLS variables
var fs = require('fs');
var https = require('https');
var options = {
    key: fs.readFileSync('sslcert/server.key', 'utf8'),
    cert: fs.readFileSync('sslcert/server.crt', 'utf8')
};

const express = require('express');
const server = express();
var httpsServer = https.createServer(options, server);

// Node.js body parsing middleware
var bodyParser = require('body-parser');

var gpioUtil = require(`${__basedir}/services/gpio.service`);
var ip = require(`${__basedir}/services/ip.service`);
var logger = require(`${__basedir}/logger`);

// initialize logger
require('winston-logs-display')(server, logger);

// route handler variables
var defaultRoute = require(`${__basedir}/route_methods/index`);
var powerStrip = require(`${__basedir}/route_methods/powerStrip`);

httpsServer.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

httpsServer.use(bodyParser.json());

httpsServer.use('/', defaultRoute);
httpsServer.use('/sockets', powerStrip);

httpsServer.listen(5555, () => {
    // set up rpio and gpio pins
    var allOutputPins = [3, 5, 7, 11, 13, 15, 19, 21];
    gpioUtil.initOutPins(allOutputPins);

    logger.info(`Server running at http://${ip.getIP()}:5555/`);
});

module.exports = httpsServer;