# ninja-rmm-api
a node wrapper for the NinjaRMM API

* [NinjaRMM](http://ninjarmm.com)

* [Ninja API documentation](https://ninjaresources.s3.amazonaws.com/PublicApi/0.1.2/NinjaRMM%20Public%20API%20v0.1.2.pdf)

ninja-rmm-api exposes a **generateOptions** method that outputs an options Object to be used with [request](https://github.com/request/request).

## Usage

```js
var NinjaAPI = {
    accessKeyID: 'V4130TSG3KNLJEXAMPLE',
    secret: 'tk4361ej9vt74qei4ecmt22div3sq7ubvEXAMPLE',
    host: 'http://api.ninjarmm.com',
    ver: '/v1/',
};

var ninjaConnection = require('./lib/ninjaAPI')(NinjaAPI);
var request = require('request');

var ninjaReq = {
    method: 'GET',
    contentMd5: null,
    contentType: null,
    date: null,
    resource: 'alerts'
};

request(ninjaConnection.generateOptions(ninjaReq), function(err, response, data) {

  // ...
  
});
```
