'use strict'
let functions = require('firebase-functions');

let api = require('./api');

exports.getCountries = functions.https.onCall(api.getCountries);
exports.postMessage = functions.https.onCall(api.postMessage);
