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

module.exports = app