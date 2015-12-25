
Node XMLHttpRequest-Cookie
==========================

<p/>
<img src="https://nodei.co/npm/xmlhttprequest-cookie.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/node-xmlhttprequest-cookie.png" alt=""/>

Abstract
--------

This is a [Node.js](http://nodejs.org/) extension module for wrapping
the [Node-XMLHttpRequest](https://github.com/driverdan/node-XMLHttpRequest)
module to allow it to handle HTTP Cookies, similar to what a browser
automatically does.

Installation
------------

Use the Node Package Manager (NPM) to install this module
locally (default) or globally (with option `-g`):

    $ npm install [-g] xmlhttprequest-cookie

API
---

The API is fully compatible to the API provided by the underlying
[Node-XMLHttpRequest Extension Module](https://github.com/driverdan/node-XMLHttpRequest),
module (which in turn is compatible to the API defined by the
[W3C XMLHttpRequest API Specification](http://www.w3.org/TR/XMLHttpRequest/).
In addition, the exposed `XMLHttpRequest` object also has a 
`debug` flag for controlling debug messages and there is a `CookieJar` object exposed by the module which
grants access to the cookie jar:

    var fs = require("fs");
    var xhrc = require("./xmlhttprequest-cookie");
    var XMLHttpRequest = xhrc.XMLHttpRequest;
    var CookieJar = xhrc.CookieJar;

    if (fs.existsSync("./sample.db"))
        CookieJar.load(fs.readFileSync("./sample.db", { encoding: "utf8" }));

    var get = function (url, complete) {
        var xhr = new XMLHttpRequest();
        xhr.debug = true;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log("body length: " + this.responseText.length);
                complete(xhr);
            }
        };
        xhr.open("GET", "https://github.com/rse/");
        xhr.send();
    };

    get("https://github.com/rse/", function (xhr) {
        console.log("body: " + xhr.responseText.substr(0, 100));
        get("https://github.com/rse/", function (xhr) {
            console.log("body: " + xhr.responseText.substr(0, 100));
            fs.writeFileSync("./sample.db", CookieJar.save(), { encoding: "utf8" });
        });
    });

See Also
--------

- [Node-XMLHttpRequest Extension Module](https://github.com/driverdan/node-XMLHttpRequest)
- [XMLHttpRequest Wikipedia Information](http://en.wikipedia.org/wiki/XMLHttpRequest)
- [XMLHttpRequest API Specification](http://www.w3.org/TR/XMLHttpRequest/)

License
-------

Copyright (c) 2013-2015 Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

