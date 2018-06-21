/* global it describe */
const expect = require('chai').expect
const NinjaClient = require('../lib')

const apiDetails = {
  accessKeyId: 'TF4STGMDR4H7AEXAMPLE', // the example key & secret provided in the Ninja docs
  secret: 'eh14c4ngchhu6283he03j6o7ar2fcuca0example',
  host: 'http://api.ninjarmm.com',
  ver: 'v1'
}

describe('NinjaRMM API', function () {
  it('should return an object', () => {
    expect(new NinjaClient(apiDetails)).to.be.an('object')
  })

  describe('#generateOptions', () => {
    const exampleReq = {
      method: 'GET',
      resource: '/v1/customers'
    }

    it('should throw an error if no req object is passed or req object is invalid', () => {
      const ninjaClient = new NinjaClient(apiDetails)
      expect(ninjaClient.generateOptions).to.throw(Error) // no input
      expect(ninjaClient.generateOptions.bind(ninjaClient, {})).to.throw(Error) // no method
      expect(ninjaClient.generateOptions.bind(ninjaClient, { // no resource
        method: 'GET'
      })).to.throw(Error)
    })

    it('should only accept RESTful methods', () => {
      const ninjaClient = new NinjaClient(apiDetails)
      ;['GET', 'DELETE', 'POST', 'PUT'].forEach(method =>
        expect(ninjaClient.generateOptions.bind(ninjaClient, {
          method,
          resource: 'dummyResource'
        })).to.not.throw(Error)
      )
      expect(ninjaClient.generateOptions.bind(ninjaClient, {
        method: 'AWAKE',
        resource: 'dummyResource'
      })).to.throw(Error)
    })

    it('should return an options object', () => {
      const ninjaClient = new NinjaClient(apiDetails)
      expect(ninjaClient.generateOptions(exampleReq)).to.be.an('object')
      expect(ninjaClient.generateOptions(exampleReq)).to.haveOwnProperty('url')
      expect(ninjaClient.generateOptions(exampleReq)).to.haveOwnProperty('method')
      expect(ninjaClient.generateOptions(exampleReq)).to.haveOwnProperty('headers')
    })
    it('should return an options object with a valid x-nj-date header', function () {
      const ninjaClient = new NinjaClient(apiDetails)
      expect(ninjaClient.generateOptions(exampleReq).headers['x-nj-date'])
        .to.equal(new Date().toUTCString())
    })
    it('should return an options object with a valid auth header', function () {
      // using Ninja's example from the API docs
      const ninjaClient = new NinjaClient(apiDetails)
      exampleReq.date = 'Sun, 01 May 2016 06:51:10 GMT'
      expect(ninjaClient.generateOptions(exampleReq).headers['Authorization'])
        .to.equal('NJ TF4STGMDR4H7AEXAMPLE:rEZWuXR0X1wX3autLTHIl2zX98I=')
    })
  })
})
