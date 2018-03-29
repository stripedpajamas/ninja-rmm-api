# ninja-rmm-api
a node wrapper for the NinjaRMM API

* [NinjaRMM](http://ninjarmm.com)

* [Ninja API documentation](https://ninjarmm.com/dev-api/)

ninja-rmm-api exposes a **generateOptions** method that outputs an options Object to be used with [request](https://github.com/request/request).

## Usage

Pass in the API details as an object with at least:
* accessKeyID
* secret 
* host (http://api.ninjarmm.com)

The accessKeyID and secret are provided from the Ninja interface (see documentation).

When generating options for request, pass in an object with at least:
* method (e.g. GET/PUT/POST/DELETE)
* resource (e.g. /v1/alerts)

The generateOptions method also supports passing in:
* contentMd5
* contentType
* date

These are optional. The module will take care of the date property automatically if left blank.


## Example

```js
const NinjaAPI = {
    accessKeyID: 'TF4STGMDR4H7AEXAMPLE',
    secret: 'eh14c4ngchhu6283he03j6o7ar2fcuca0example',
    host: 'http://api.ninjarmm.com',
};

const ninjaConnection = require('ninja-rmm-api')(NinjaAPI);
const request = require('request');

const ninjaReq = {
    method: 'GET',
    resource: '/v1/alerts'
};

request(ninjaConnection.generateOptions(ninjaReq), function(err, response, data) {

  // ...
  
});
```
