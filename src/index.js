'use strict';

import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';

import minetypes from './mine';

const mine = minetypes.types;


function xHttpServer(port){
        

        var _server = http.createServer((request, response) => {
            let pathname = url.parse(request.url).pathname;
            if (pathname.charAt(pathname.length - 1) == "/") {
                pathname += "index.html"; 
            }
            // const realPath = path.join("test", pathname);
            const realPath = path.join("./", pathname);
            console.log(realPath);
            let ext = path.extname(realPath);
            ext = ext ? ext.slice(1) : 'unknown';
            fs.exists(realPath, (exists) => {
                if (!exists) {
                    response.writeHead(404, {
                        'Content-Type': 'text/plain'
                    });

                    response.write("This request URL " + pathname + " was not found on this server.");
                    response.end();
                } else {
                    fs.readFile(realPath, "binary", (err, file) => {
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
