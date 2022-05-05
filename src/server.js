const express = require('express')
const app = express();
const path = require('path')
const { Curl } = require('node-libcurl');
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

const config = {
    ip: null,
    local: false,
}

const getUrl = (command) => {
    return config.local
        ? `http://${config.ip}/smarthome.IMCPlatform/device/v1.0/sendCommand.action?deviceCode=8f9f6ac1068e78058cfeac45&command${command}`
        : `http://${config.ip}/?command=${command}`
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'));
})

app.get('/*.js', function (req, res) {
    res.sendFile(path.join(__dirname+"/build/"+req.originalUrl));
});

app.get('/*.css', function (req, res) {
    res.sendFile(path.join(__dirname+"/build/"+req.originalUrl));
});

app.get('/config', function (req, res) {
    res.sendFile(path.join(__dirname+"/config.json"))
})

app.get('*.png', function (req, res) {
    res.sendFile(path.join(__dirname+"/build/icons/"+req.originalUrl));
})

app.get('*.jpg', function (req, res) {
    res.sendFile(path.join(__dirname+"/build/icons/"+req.originalUrl));
})

app.get('/exec', function (req, res) {
    const curl = new Curl();

    curl.setOpt(Curl.option.URL, getUrl(req.params['command']));
    curl.on('end', function (statusCode, data, headers) {
        console.info(statusCode);
        console.info('---');
        console.info(data);
        console.info('---');
        console.info(this.getInfo( 'TOTAL_TIME'));

        this.close();
        res.send(data)
    });
    curl.perform();
})

app.get('/setIp', function (req, res) {
    config.ip = req.query['ip']
    config.local = req.query['local']

    res.send(true)
})

module.exports = app