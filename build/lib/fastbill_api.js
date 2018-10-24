/*
 * fastbill automatic api wrapper for nodejs
 *
 * Copyright(c) 2015 maximilian greschke <maximilian.greschke@gmail.com>
 * MIT Licensed
 *
 */

/**
 * @author Maximilian Greschke <maximilian.greschke@gmail.com>
 *
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FastbillAPI = undefined;

var _http = require('./utils/http');

var _errors = require('./utils/errors');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FastbillAPI {
    constructor(credentials) {
        let auth = new Buffer(`${credentials.email}:${credentials.apikey}`).toString('base64');
        this.$uri = 'https://my.fastbill.com/api/1.0/api.php';
        this.$headers = {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Performs a HTTP request against the FastBill API.
     *
     * @param {object} payload The request pattern (e.g. filter, data, service, etc.)
     * @param {function} callback Error-first callback (err, parsedResultSet)
     *
     */

    $request(payload, callback) {
        let options = {
            uri: this.$uri,
            headers: this.$headers,
            data: payload && JSON.stringify(payload)
        };

        (0, _http.post)(options).then(function (data) {
            try {
                data = JSON.parse(data).RESPONSE;
            } catch (e) {
                return callback(new _errors2.default.FastbillInvalidRequestError({
                    message: 'Unable to parse response',
                    detail: e
                }));
            }

            // Check if the FastBill API responds with errors
            // If so, create an error object with the first available error message.
            if (data.ERRORS) {
                return callback(new _errors2.default(data.ERRORS[0]));
            }
            callback(null, data);
        }).catch(function (err) {
            return callback(err, null);
        });
    }
}
exports.FastbillAPI = FastbillAPI;