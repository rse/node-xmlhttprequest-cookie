/*
**  xmlhttprequest-cookie -- Cookie-aware XMLHttpRequest Wrapper
**  Copyright (c) 2013-2015 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**
**  xmlhttprequest-cookie-obj.js: cookie object class
*/

/*
 *  For details about HTTP cookies see:
 *  - http://tools.ietf.org/html/rfc6265
 *  - http://en.wikipedia.org/wiki/HTTP_cookie
 *
 *  Two example HTTP headers:
 *  - Set-Cookie: LSID=DQAAAK…Eaem_vYg; Domain=docs.foo.com; Path=/accounts; Expires=Wed, 13 Jan 2021 22:23:01 GMT; Secure; HttpOnly
 *  - Cookie: LSID=DQAAAK…Eaem_vYg; FOO=bArBaz
 */

/*  external requirements  */
var Url = require("url");

/*  construct a cookie object  */
var Cookie = function (name, value, domain, path, expires, secure, httponly) {
    this.name     = name     || "";
    this.value    = value    || "";
    this.domain   = domain   || "";
    this.path     = path     || "/";
    this.expires  = expires  || new Date(Date.now() + 31536000000);
    this.secure   = secure   || false;
    this.httponly = httponly || false;
};

/*  determine whether cookie is expired now  */
Cookie.prototype.expired = function () {
    return (+(this.expires) < Date.now());
};

/*  generate lookup key  */
Cookie.prototype.toKey = function () {
    return (this.name + ":" + this.domain + ":" + this.path);
};

/*  generate "Set-Cookie"-style header value  */
Cookie.prototype.toString = function () {
    var value = this.name + "=" + this.value;
    value += "; Domain=" + this.domain;
    value += "; Path=" + this.path;
    value += "; Expires=" + this.expires;
    if (this.secure)
        value += "; Secure";
    if (this.httponly)
        value += "; HttpOnly";
    return value;
};

/*  parse a "Set-Cookie"-style header value  */
Cookie.build = function (cookieString, url) {
    /*  generate new cookie and initialize it according to the URL  */
    var cookie = new Cookie();

    /*  optionally initialize for a particular URL  */
    if (typeof url !== "undefined") {
        if (typeof url === "string")
            url = Url.parse(url, true, true);
        cookie.domain = url.hostname;
        cookie.path   = url.pathname;
    }

    /*  parse value/name  */
    var equalsSplit = /([^=]+)(?:=(.*))?/;
    var cookieParams = ("" + cookieString).split("; ");
    var cookieParam;
    if ((cookieParam = cookieParams.shift().match(equalsSplit)) === null)
        throw new Error("failed to parse cookie string");
    cookie.name  = cookieParam[1];
    cookie.value = cookieParam[2];

    /*  parse remaining attributes  */
    for (var i = 0, len = cookieParams.length; i < len; i++) {
        cookieParam = cookieParams[i].match(equalsSplit);
        if (cookieParam !== null && cookieParam.length) {
            var attr = cookieParam[1].toLowerCase();
            if (typeof cookie[attr] !== "undefined")
                cookie[attr] = typeof cookieParam[2] === "string" ? cookieParam[2] : true;
        }
    }

    /*  special post-processing for expire date  */
    if (typeof cookie.expires === "string")
        cookie.expires = new Date(cookie.expires);

    return cookie;
};

/*  export the cookie class  */
module.exports = Cookie;

