var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.send('You have reached a Wonka powerstrip... please leave a message at the beep.');
});

module.exports = router;
