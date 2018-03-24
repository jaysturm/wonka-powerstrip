var ip = require('ip');
var fs = require('fs');
var logger = require(`${__basedir}/logger`);
var ip_path = `${__basedir}/resources/current_ip.txt`;
var saved_ip;

saveIP = (ip) => {
    fs.writeFile(ip_path, ip, (err) => {
        if (err)
            logger.error('**** error saving ip address to filesystem ****', err);
        else
            logger.info('**** IP address saved successfully ****');
    });
}

module.exports = {
    getIP: () => {
        return ip.address();
    },
    isNewIP: () => {
        var saved_ip = fs.readFileSync(ip_path).toString();

        var currentIP = ip.address();
        var isNew = currentIP !== saved_ip;

        if (isNew) {
            logger.info(`new IP address detected`);
            saveIP(currentIP);
        } else logger.info(`consistent ip address detected`);

        return isNew;
    }
};