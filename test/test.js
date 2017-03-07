/**
 * Created by petersquicciarini on 3/6/17.
 */

const expect = require('chai').expect;

describe('NinjaRMM API', function() {
    const ninjaConnection = require('../');
    const apiDetails = {
        accessKeyID: 'TF4STGMDR4H7AEXAMPLE', // the example key & secret provided in the Ninja docs
        secret: 'eh14c4ngchhu6283he03j6o7ar2fcuca0example',
        host: 'http://api.ninjarmm.com',
        ver: 'v1',
    };

    it('should throw an error if no apiDetails are provided or apiDetails are invalid', function() {
        expect(ninjaConnection).to.throw(Error);                            // no input
        expect(ninjaConnection.bind(ninjaConnection, {})).to.throw(Error);  // no accessKeyID
        expect(ninjaConnection.bind(ninjaConnection, {                      // no secret
            accessKeyID: 'dummyData'
        })).to.throw(Error);
        expect(ninjaConnection.bind(ninjaConnection, {                      // no host
            accessKeyID: 'dummyID',
            secret: 'dummySecret'
        })).to.throw(Error);
    });

    it('should return an object', function() {
        expect(ninjaConnection(apiDetails)).to.be.an('object');
    });

    it('should expose a generateOptions method', function() {
        expect(ninjaConnection(apiDetails)).to.haveOwnProperty('generateOptions');
    });

    describe('#generateOptions', function() {
        const exampleReq = {
            method: 'GET',
            resource: '/v1/customers',
        };
        it('should throw an error if no req object is passed or req object is invalid', function() {
            expect(ninjaConnection(apiDetails).generateOptions).to.throw(Error);                            // no input
            expect(ninjaConnection(apiDetails).generateOptions.bind(ninjaConnection, {})).to.throw(Error);  // no method
            expect(ninjaConnection(apiDetails).generateOptions.bind(ninjaConnection, {                      // no resource
                method: 'GET'
            })).to.throw(Error);
        });
        it('should only accept RESTful methods', function() {
            ['GET', 'DELETE', 'POST', 'PUT'].forEach(method =>
                expect(ninjaConnection(apiDetails).generateOptions.bind(ninjaConnection, {
                    method: method,
                    resource: 'dummyResource'
                })).to.not.throw(Error)
            );
            expect(ninjaConnection(apiDetails).generateOptions.bind(ninjaConnection, {
                method: 'AWAKE',
                resource: 'dummyResource'
            })).to.throw(Error);
        });

        it('should return an options object', function() {
            expect(ninjaConnection(apiDetails).generateOptions(exampleReq)).to.be.an('object');
            expect(ninjaConnection(apiDetails).generateOptions(exampleReq)).to.haveOwnProperty('url');
            expect(ninjaConnection(apiDetails).generateOptions(exampleReq)).to.haveOwnProperty('method');
            expect(ninjaConnection(apiDetails).generateOptions(exampleReq)).to.haveOwnProperty('headers');
        });
        it('should return an options object with a valid x-nj-date header', function() {
            expect(ninjaConnection(apiDetails).generateOptions(exampleReq).headers['x-nj-date'])
                .to.equal(new Date().toUTCString());
        });
        it('should return an options object with a valid auth header', function() {
            // using Ninja's example from the API docs
            exampleReq.date = 'Sun, 01 May 2016 06:51:10 GMT';
            expect(ninjaConnection(apiDetails).generateOptions(exampleReq).headers['Authorization'])
                .to.equal('NJ TF4STGMDR4H7AEXAMPLE:rEZWuXR0X1wX3autLTHIl2zX98I=');
        });
    });
});