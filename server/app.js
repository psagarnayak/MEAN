const express = require('express')();
const http = require('http');

const port = process.env.port || 3000;
express.set('port', port);

//const app = express();
const httpServer = http.createServer(express);
httpServer.listen(port);