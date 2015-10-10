/// <reference path="../typings/tsd.d.ts" />

import * as express from "express";
import * as http from "http";

let app:express.Express = express();
app.use(express.static("app"));

let server:http.Server = http.createServer(app);
let server_config:{port:number} = { port: 4000 };

server.listen(server_config.port, () => {
    console.info("Express server listening", {port: server_config.port});
});
