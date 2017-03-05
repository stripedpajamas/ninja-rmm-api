/**
 * Created by peter squicciarini on 2/18/17.
 */
const crypto = require('crypto');
const url = require('url');


module.exports = function(apiDetails) {

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
        generateOptions: function(reqObj) {

            reqObj.date = new Date().toUTCString();

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