const Client = require('./client');
const _ = require('underscore');

let apiClient = new Client();

function Service () {

};

Service.prototype.getListingByAddress = function(address, citystatezip, callback) {
    let pathName = 'GetDeepSearchResults.htm'; //'GetSearchResults.htm';
    let params = {address: address, citystatezip: citystatezip, rentzestimate: true};
    apiClient.makeRequest(pathName, params, callback);
};

/**
 *
 * @param zillowId
 * @param count between 1 - 25
 */
Service.prototype.getComparableListings = function (zillowId, count, callback) {
    let pathName = 'GetDeepComps.htm';
    let params = {zpid: zillowId, count: count, rentzestimate: true};
    apiClient.makeRequest1(pathName, params, callback);
};

Service.prototype.getPropertyEstimate = function (propertyId) {
    let pathName = 'GetZestimate.htm';
    let params = {zpid: propertyId, rentzestimate: true};

    apiClient.makeRequest(pathName, params, (response) => {
        Parsestring(response, (err, data) => {
        if (err) return console.log(err);

        console.log(JSON.stringify(data));

        return;
    });
})
}

module.exports = Service;
