const express = require('express');
const router = express.Router();
const Service = require('./service');
const _ = require('underscore');

let rentService = new Service();

router.get('/', (req, res) => {
    res.json({message: "nothing to see here."});
});

router.get('/homes', (req, res) => {
    res.headers = {
        'Access-Control-Allow-Origin': 'http://localhost:4200'
    };
    let address = req.query.address;
    let citystatezip = req.query.citystatezip;

    if (!address || !citystatezip) {
        throw 'address is required';
    }
    var listings = [];
    var zpidIndex = [];
    var latIndex = [];
    var lngIndex = [];
    rentService.getListingByAddress(address, citystatezip, function (data) {
        if (typeof data["SearchResults:searchresults"]["response"] === 'undefined') {
            res.json({response: listings});
        }

        if (!data["SearchResults:searchresults"]["response"][0]) {
            throw 'no response';
        }

        if (!data["SearchResults:searchresults"]["response"][0]["results"][0]) {
            throw 'no results';
        }
        let results = data["SearchResults:searchresults"]["response"][0]["results"][0]["result"];

        _.each(results, function (listing, index) {
            let zpid = listing['zpid'][0];
            let id = null;
            let address = listing['address'] ? listing['address'][0] : null;
            if (!address) {
                return;
            }
            var fullAddress = address['street'][0] + '  ' + address['city'][0] + '  ' + address['state'][0] + '  ' + address['zipcode'][0];

            if (zpidIndex.indexOf(fullAddress) === -1) {
                zpidIndex.push(fullAddress);
                id = zpidIndex.length - 1;
            }

            if (listings[id]) {
                return;
            }

            listings[id] = {
                'zpid': zpid,
                'address':  {
                    street: address.street[0],
                    zip: address.zipcode[0],
                    city: address.city[0],
                    state: address.state[0],
                    latitude: address.latitude[0],
                    longitude: address.longitude[0]
                },
                'useCode': listing['useCode'] ? listing['useCode'][0] : null,
                'taxAssessmentYear': listing['taxAssessmentYear'] ? listing['taxAssessmentYear'][0] : null,
                'taxAssessment': listing['taxAssessment'] ? listing['taxAssessment'][0] : null,
                'yearBuilt': listing['yearBuilt'] ? listing['yearBuilt'][0] : null,
                'finishedSqFt': listing['finishedSqFt'] ? listing['finishedSqFt'][0] : null,
                'bathrooms': listing['bathrooms'] ? listing['bathrooms'][0] : null,
                'bedrooms': listing['bedrooms'] ? listing['bedrooms'][0] : null,
                'zestimate': listing['zestimate'] ? listing['zestimate'][0]['amount'][0] : null,
                'rentzestimate': listing['rentzestimate'] ? listing['rentzestimate'][0]['amount'][0] : null
            };
        });

        if (listings.length === 1) {
            let zpid = listings[0]['zpid'];

            //todo use promise not callback
            rentService.getComparableListings(zpid, 25, function (compResponse) {
                if (typeof compResponse["Comps:comps"]["response"] === 'undefined') {
                    //console.log(compResponse);
                    comps = [];
                } else {
                    //console.log(compResponse["Comps:comps"]["response"][0]["properties"][0]);
                    var comps  = compResponse["Comps:comps"]["response"][0]["properties"][0]['comparables'][0]["comp"];
                }

                var compsData =  _.map(comps, function (comp) {
                    var address = comp.address[0];
                    return {
                        zpid: comp.zpid[0],
                        address: {
                            street: address.street[0],
                            zip: address.zipcode[0],
                            city: address.city[0],
                            state: address.state[0],
                            latitude: address.latitude[0],
                            longitude: address.longitude[0]
                        },
                        taxAssessmentYear: comp.taxAssessmentYear[0],
                        taxAssessment: comp.taxAssessment[0],
                        yearBuilt: comp.yearBuilt[0],
                        finishedSqFt: comp.finishedSqFt[0],
                        bathrooms: comp.bathrooms[0],
                        bedrooms: comp.bedrooms[0],
                        zestimate: comp.zestimate[0]['amount'][0],
                        rentzestimate: comp.rentzestimate[0]['amount'][0]
                    }
                });

                listings[0]['comparables'] = compsData;
                res.json({response: listings});
            });
        } else {
            res.json({response: listings});
        }

        //res.json({response: listings});
    });
});

router.get('/homes/:id', (req, res)  => {
    let propertyID = req.params.id;
    rentService.getComparableListings(propertyID, 25, function (data) {
        if (!data) {
            throw 'no data';
        }

        var comps  = data["Comps:comps"]["response"][0]["properties"][0]['comparables'][0]["comp"];
        var compsData =  _.map(comps, function (comp) {
            var address = comp.address[0];
            return {
                zpid: comp.zpid[0],
                address: {
                    street: address.street[0],
                    zip: address.zipcode[0],
                    city: address.city[0],
                    state: address.state[0],
                    latitude: address.latitude[0],
                    longitude: address.longitude[0]
                },
                taxAssessmentYear: comp.taxAssessmentYear[0],
                taxAssessment: comp.taxAssessment[0],
                yearBuilt: comp.yearBuilt[0],
                finishedSqFt: comp.finishedSqFt[0],
                bathrooms: comp.bathrooms[0],
                bedrooms: comp.bedrooms[0],
                zestimate: comp.zestimate ? comp.zestimate[0]['amount'][0] : null,
                rentzestimate: comp.rentzestimate ? comp.rentzestimate[0]['amount'][0] : null
            }
        });
        res.send({response: compsData});
    });
});

module.exports = router;
