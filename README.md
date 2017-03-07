# ninja-rmm-api
a node wrapper for the NinjaRMM API

* [NinjaRMM](http://ninjarmm.com)

* [Ninja API documentation](https://ninjaresources.s3.amazonaws.com/PublicApi/0.1.2/NinjaRMM%20Public%20API%20v0.1.2.pdf)

ninja-rmm-api exposes a **generateOptions** method that outputs an options Object to be used with [request](https://github.com/request/request).

## Usage

Pass in the API details as an object with at least:
* accessKeyID
* secret 
* host (http://api.ninjarmm.com)

The accessKeyID and secret are provided from the Ninja interface (see documentation).

When generating options for request, pass in an object with at least:
* method (RESTful API compatible HTTP methods)
* resource (e.g. /v1/alerts)

The generateOptions method also supports passing in:
* contentMd5
* contentType
* date

These are optional. The module will take care of the date property automatically if left blank.


## Example

```js
var NinjaAPI = {
    accessKeyID: 'TF4STGMDR4H7AEXAMPLE',
    secret: 'eh14c4ngchhu6283he03j6o7ar2fcuca0example',
    host: 'http://api.ninjarmm.com',
};

var ninjaConnection = require('ninja-rmm-api')(NinjaAPI);
var request = require('request');

var ninjaReq = {
    method: 'GET',
    resource: '/v1/alerts'
};

request(ninjaConnection.generateOptions(ninjaReq), function(err, response, data) {

  // ...
  
});
```
