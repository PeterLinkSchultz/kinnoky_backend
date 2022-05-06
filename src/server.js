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
        ? `${config.ip}/?command=${command}`
        : `${config.ip}/smarthome.IMCPlatform/device/v1.0/sendCommand.action?deviceCode=8f9f6ac1068e78058cfeac45&command${command}`

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
    const status = {
        finished: false
    }
    curl.setOpt(Curl.option.URL, getUrl(req.query['command']));
    curl.setOpt(Curl.option.HTTP09_ALLOWED, true);
    // curl.setOpt(Curl.option.HTTPGET, true);
    curl.setOpt(Curl.option.HTTP_VERSION, 0.9);
    // curl.setOpt(Curl.option.CONNECTTIMEOUT, 0);

    curl.on('data', function(data, curl) {
        if (status.finished) {
            // return;
        }
        const stringData = data.toString('utf8');
        const code = stringData.split(',').pop()
        const response = {}
        const reg = new RegExp('ok')

        if (reg.test(code.trim().toLowerCase())) {
            response.status = '0'
            response.result = stringData
        } else {
            response.status = '1'
            response.result = req.query['command']
        }
        status.finished = true
        res.send(response)
    })

    curl.on('error', function(error, code) {
        console.debug('error code', code)
        console.debug('error url', getUrl(req.query['command']))
        console.debug('error', error)
        console.debug('---')
    })


    curl.perform();
})

app.get('/setIp', function (req, res) {
    config.ip = req.query['ip']
    config.local = req.query['local']

    res.send(true)
})

module.exports = app