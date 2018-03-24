var rpio = require('rpio');
var express = require('express');
var router = express.Router();
var gpioUtil = require(`${__basedir}/services/gpio.service`);
var sms = require(`${__basedir}/services/sms.service`);
var logger = require(`${__basedir}/logger`);
var fs = require('fs');
var os = require('os');
var ip = require(`${__basedir}/services/ip.service`);
var sockets = null;
var sockets_path = `${__basedir}/resources/sockets.json`;

// get persisted sockets
fs.readFile(sockets_path, 'utf8', (err, data) => {
    if (err)
       logger.error('Error getting contents of sockets json', err);
    else
        sockets = JSON.parse(data);
});

// send sms with current ip address
if (ip.isNewIP()) {
    var address = ip.getIP();
    logger.info(`sending IP address via sms.`);
    sms.sendSms('+19706170810', `since it's free...${os.EOL}${os.EOL}New IP address detected! => ${address}${os.EOL}${os.EOL}      - power strip${os.EOL}${os.EOL}`);
}

// middleware
router.use((req, res, next) => {
    // logger.info('PowerStrip API middleware hit');
    next();
});

router.get('/', (req, res) => {
    res.send(sockets);
    res.end();
});

// params >>
// powerOn : boolean
// socket : 1 - 8
router.post('/', (req, res) => {
    try {
        if (req.body == undefined) {
            res.send('no parameters present');
            res.end();
            return;
        }

        var onOff = req.body.powerOn ? 'on' : 'off',
            socket = getSocket(req.body.socket),
            pin = socket.pin;

        logger.info(`**** turning socket ${req.body.socket} ${onOff} ****`)

        // change socket power state
        rpio.write(pin, req.body.powerOn ? gpioUtil.turnOn : gpioUtil.turnOff);

        // set socket state
        socket.state = req.body.powerOn;

        logger.info(`**** finished turning socket ${req.body.socket} power ${onOff} ****`);

        res.send(sockets);
        res.end();
    } catch (err) {
        logger.error('*** error changing socket power state ****', err);
        res.send(`error changing socket power state => ${err}`);
        res.end();
    }
});

// change socket name
router.post('/name', (req, res) => {
    try {
        if (req.body == undefined) {
            res.send('no parameters present');
            res.end();
            return;
        }

        var name = req.body.name,
            socket = getSocket(req.body.socket);

        logger.info(`**** changing socket ${req.body.socket}'s name to ${name} ****`);

        socket.name = name;
        saveSockets();

        logger.info(`**** finished changing socket ${req.body.socket}'s name to ${name} ****`);

        res.send(sockets);
        res.end();
    } catch (err) {
        logger.error('**** error changing socket name ****', err);
        res.send(`error changing socket name => ${err}`);
        res.end();
    }
});

saveSockets = () => {
    fs.writeFile(sockets_path, JSON.stringify(sockets), (err) => {
        if (err)
            logger.error('**** error saving sockets json ****', err);
        else
            logger.info('**** sockets json saved successfully ****');
    });
};

getSocket = (socket) => {
    let socketIndex = -1;

    for (var i = 0; i < sockets.length; i++) {
        if (sockets[i].socket === socket) {
            socketIndex = i;
            break;
        }
    }

    return sockets[socketIndex];
};

module.exports = router;