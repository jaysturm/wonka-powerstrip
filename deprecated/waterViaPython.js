const cmd = require('../cmd.js');

module.exports = function(req, res) {
    const processRef = cmd.get('python -i');
    let data_line = '';

    //listen to the python terminal output
    processRef.stdout.on(
        'data',
        function(data) {
            data_line += data;
            if (data_line[data_line.length-1] == '\n') {
            console.log(data_line);
            }
        }
    );

    const pythonTerminalInput=`./wonka_water.py`;

    //show what we are doing
    console.log(`>>> ${pythonTerminalInput}`);

    //send it to the open python terminal
    processRef.stdin.write(pythonTerminalInput);
}