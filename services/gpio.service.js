var rpio = require('rpio');

module.exports = {
  initOutPins: (pins) => {
    rpio.init({
        gpiomem: false,
        mapping: 'physical'
    });

    // set up pins
    for (var i = 0; i < pins.length; i++) {
        rpio.open(pins[i], rpio.OUTPUT, rpio.PULL_DOWN);
    }
  },
  turnOn: rpio.LOW,
  turnOff: rpio.HIGH
};