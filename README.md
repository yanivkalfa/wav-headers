wav-headers
========
Generates wav header buffer to concatenated with the wav body buffer

This is mostly a wrapper around: https://github.com/TooTallNate/node-wav
just without streams and designed for full file cases.

Installation
------------

Install through npm:

``` bash
$ npm install wav-headers
```


Example
-------

``` javascript
var fs = require('fs');
var getFileHeaders = require('wav-headers');

// those are defaults
var options = {
	channels: 2,
	sampleRate: 44100,
	bitDepth: 16,
	dataLength: 4294967295
};

var headersBuffer = getFileHeaders(options);
var fullBuffer = Buffer.concat([ headersBuffer, fileBodyBuffer ]);

var stream = fs.createWriteStream('./aFile.wav');
stream.write(fullBuffer, function() {
	stream.end();
});

```

