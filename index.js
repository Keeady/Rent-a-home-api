const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();

var api = require('./src/api');
var routes = require('./src/routes');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Define Routes
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.RENT_A_HOME_APP);
    next();
});
app.use('/', routes);
app.use('/api', api);

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log('Running on localhost: ' + port));
