'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mine = require('./mine');

var _mine2 = _interopRequireDefault(_mine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mine = _mine2.default.types;

function xHttpServer(port) {

    var _server = _http2.default.createServer((request, response) => {
        let pathname = _url2.default.parse(request.url).pathname;
        if (pathname.charAt(pathname.length - 1) == "/") {
            pathname += "index.html";
        }
        // const realPath = path.join("test", pathname);
        const realPath = _path2.default.join("./", pathname);
        console.log(realPath);
        let ext = _path2.default.extname(realPath);
        ext = ext ? ext.slice(1) : 'unknown';
        _fs2.default.exists(realPath, exists => {
            if (!exists) {
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });

                response.write("This request URL " + pathname + " was not found on this server.");
                response.end();
            } else {
                _fs2.default.readFile(realPath, "binary", (err, file) => {
                    if (err) {
                        response.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        response.end(err);
                    } else {
                        const contentType = mine[ext] || "text/plain";
                        response.writeHead(200, {
                            'Content-Type': contentType
                        });
                        response.write(file, "binary");
                        response.end();
                    }
                });
            }
        });
    });
    _server.listen(port);
    console.log("Server runing at port: " + port + ".");
    console.log("Hit CTRL-C to stop the server");
}

module.exports = xHttpServer;