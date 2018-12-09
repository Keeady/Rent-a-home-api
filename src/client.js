const _ = require('underscore');
var data = require('../server/deep-search.json');
var data2 = require('../server/comparables_25.json');

function Client () {
    this.API_KEY = 'X1-ZWz19ky5hwa3nv_305s0';
    this.BASE_URL = 'http://www.zillow.com/webservice';

};

Client.prototype.makeRequest = function(pathName, parameters, callback) {
    let i = 0;
    let query = _.map(parameters, function (value, key) {
        return key + '=' + encodeURIComponent(value)
    });

    let url = this.BASE_URL + '/' + pathName + '?zws-id=' + this.API_KEY + '&' + query.join('&');

    /*Request.get(url, (err, res, body) => {
        if (err) {
            throw err;
        }
        Parsestring(body, (err, data) => {
            if (err) {
                throw err;
            }
            callback.call(this, data);
        });
    });*/

    //let results = data["SearchResults:searchresults"]["response"][0]["results"][0]["result"];

    callback.call(this, data);
};

Client.prototype.makeRequest1 = function(pathName, parameters, callback) {
    let i = 0;
    let query = _.map(parameters, function (value, key) {
        return key + '=' + encodeURIComponent(value)
    });

    let url = this.BASE_URL + '/' + pathName + '?zws-id=' + this.API_KEY + '&' + query.join('&');

    /*Request.get(url, (err, res, body) => {
        if (err) {
            throw err;
        }
        //Parsestring(body, (err, data) => {
        //    if (err) return console.log(err);
            callback.call(this, body);
        //});
    });*/

    //let results = data["SearchResults:searchresults"]["response"][0]["results"][0]["result"];

    callback.call(this, data2);
};

Client.prototype.makeRequest2 = function(pathName, parameters, callback) {
    let i = 0;
    let query = _.map(parameters, function (value, key) {
        return key + '=' + encodeURIComponent(value)
    });

    let url = this.BASE_URL + '/' + pathName + '?zws-id=' + this.API_KEY + '&' + query.join('&');

    /*Request.get(url, (err, res, body) => {
        Parsestring(body, (err, data) => {
            if (err) return console.log(err);
            callback.call(this, data);
        });
    });*/

    //let results = data["SearchResults:searchresults"]["response"][0]["results"][0]["result"];

    callback.call(this, data2);
};

module.exports = Client;

//zws-id=X1-ZWz19ky5hwa3nv_305s0%26address%3D12%20clarmore%20dr%2C%26citystatezip%3D06850
