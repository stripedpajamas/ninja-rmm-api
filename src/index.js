const crypto = require('crypto')
const url = require('url')

class NinjaClient {
  constructor (apiDetails) {
    const haveNeededDetails = typeof apiDetails === 'object' &&
    ['accessKeyId', 'secret', 'host'].every(prop => (
      Object.prototype.hasOwnProperty.call(apiDetails, prop)
    ))
    this.apiDetails = apiDetails
    if (!haveNeededDetails) {
      throw new Error('Invalid apiDetails provided. accessKeyId, secret, and host are required.')
    }
  }

  buildSendString (method, contentMd5, contentType, date, resource) {
    const sendString = [method, contentMd5, contentType, date, resource].join('\n')
    return Buffer.from(sendString).toString('base64')
  }

  generateOptions (req) {
    const validReq = typeof req === 'object' &&
      ['method', 'resource'].every(prop => Object.prototype.hasOwnProperty.call(req, prop))
    if (!validReq) {
      throw new Error('Invalid request. method and resource are required.')
    }

    const validMethod = ['GET', 'DELETE', 'POST', 'PUT'].includes(req.method.toUpperCase())
    if (!validMethod) {
      throw new Error('Invalid method specified. Only GET, DELETE, POST, and PUT are allowed.')
    }

    const reqObj = {
      method: req.method.toUpperCase(),
      contentMd5: req.contentMd5 || null,
      contentType: req.contentType || null,
      date: req.date || new Date().toUTCString(),
      resource: req.resource
    }

    const sendString = this.buildSendString(
      reqObj.method,
      reqObj.contentMd5,
      reqObj.contentType,
      reqObj.date,
      reqObj.resource
    )

    const signature = crypto
      .createHmac('sha1', this.apiDetails.secret)
      .update(sendString)
      .digest('base64')

    return {
      url: url.resolve(this.apiDetails.host, reqObj.resource),
      method: reqObj.method,
      headers: {
        'x-nj-date': reqObj.date,
        'Authorization': `NJ ${this.apiDetails.accessKeyId}:${signature}`
      }
    }
  }
}

module.exports = NinjaClient
