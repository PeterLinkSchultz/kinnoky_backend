const express = require('express')
const app = express();
const path = require('path')
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

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

module.exports = app