/**
 * Created by peter squicciarini on 2/18/17.
 */
const crypto = require('crypto');
const url = require('url');


module.exports = function(apiDetails) {
    if (!apiDetails || ! (apiDetails.hasOwnProperty('accessKeyID')
                        && apiDetails.hasOwnProperty('secret')
                        && apiDetails.hasOwnProperty('host'))) {
        throw new Error('Invalid apiDetails provided. accessKeyID, secret, and host are required.');
    }

    function buildSendString(method, contentMd5, contentType, date, resource) {
        let sendString = '';
        sendString += method + '\n';
        sendString += contentMd5 ? contentMd5 : '\n';
        sendString += contentType ? contentType : '\n';
        sendString += date + '\n';
        sendString += resource;
        return Buffer.from(sendString).toString('base64');
    }

    return {
        generateOptions: function(req) {
            if (!req || typeof req !== 'object' || ! (req.hasOwnProperty('method') && req.hasOwnProperty('resource'))) {
                throw new Error('Invalid request. method and resource are required.');
            } else if (!['GET', 'DELETE', 'POST', 'PUSH'].includes(req.method)) {
                throw new Error('Invalid method specified. Only GET, DELETE, POST, and PUSH are allowed.')
            }
            let reqObj = {
                method: req.method,
                contentMd5: req.contentMd5 || '',
                contentType: req.contentType || '',
                date: req.date || new Date().toUTCString(),
                resource: req.resource
            };

            let sendString = buildSendString(reqObj.method, reqObj.contentMd5 || null, reqObj.contentType || null, reqObj.date, reqObj.resource);
            let signature = crypto.createHmac('sha1', apiDetails.secret).update(sendString).digest('base64');

            return {
                url: url.resolve(apiDetails.host, reqObj.resource),
                method: reqObj.method,
                headers: {
                    'x-nj-date': reqObj.date,
                    'Authorization': `NJ ${apiDetails.accessKeyID}:${signature}`
                }
            };
        }
    };
};