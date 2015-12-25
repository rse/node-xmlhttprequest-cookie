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
**  xmlhttprequest-cookie-jar.js: cookie jar class
*/

/*  internal requirements  */
var Cookie = require("./xmlhttprequest-cookie-obj");

/*  construct a cookie jar object  */
var CookieJar = function () {
   this.cookieList = [];
   this.cookieMap  = {};
};

/*  the cookie jar methods  */
CookieJar.prototype = {
    /*  remove all cookies  */
    clear: function () {
        this.cookieList = [];
        this.cookieMap  = {};
    },

    /*  save/export all cookies  */
    save: function () {
        var text = "";
        for (var i = 0; i < this.cookieList.length; i++)
            text += this.cookieList[i].toString() + "\r\n";
        return text;
    },

    /*  load/import all cookies  */
    load: function (text) {
        this.clear();
        var lines = text.split(/\r?\n/);
        for (var i = 0; i < lines.length; i++) {
            if (lines[i] === "")
                continue;
            var cookie = Cookie.build(lines[i]);
            this.insert(cookie);
        }
    },

    /*  add a cookie object  */
    insert: function (cookie) {
        if (!cookie.expired()) {
            var key = cookie.toKey();
            var idx = this.cookieMap[key];
            if (typeof idx !== "undefined")
                this.cookieList[idx] = cookie;
            else {
                idx = this.cookieList.length;
                this.cookieMap[key] = idx;
                this.cookieList.push(cookie);
            }
        }
    },

    /*  remove a cookie object  */
    remove: function (cookie) {
        var key = cookie.toKey();
        var idx = this.cookieMap[key];
        if (typeof idx === "undefined")
            throw new Error("remove: cookie not in cookie jar");
        delete this.cookieMap[key];
        this.cookieList.splice(idx, 1);
    },

    /*  find all cookies for exact domain and path  */
    find: function (domain, path) {
        if (typeof domain === "undefined")
            domain = "";
        if (typeof path === "undefined")
            path = "/";
        var cookies = [];
        for (var i = 0; i < this.cookieList.length; i++) {
            var cookie = this.cookieList[i];
            if (cookie.domain === domain && cookie.path === path && !cookie.expired())
                cookies.push(cookie);
        }
        return cookies;
    },

    /*  find all cookies for domain and path the fuzzy way  */
    findFuzzy: function (domain, _path) {
        var cookies = [];
        var found = {};
        while (domain !== "") {
            var path = _path;
            while (path !== "") {
                var cookies_here = this.find(domain, path);
                for (var i = 0; i < cookies_here.length; i++) {
                    if (!found[cookies_here[i].name]) {
                        cookies.push(cookies_here[i]);
                        found[cookies_here[i].name] = true;
                    }
                }
                path = path.replace(/(?:[^\/]+|\/)$/, "");
            }
            domain = domain.replace(/^(?:[^.]+|\.)/, "");
        }
        return cookies;
    }
};

/*  export the cookie jar class  */
module.exports = CookieJar;

