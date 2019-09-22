#!/usr/bin/env node

const program = require('commander');
const express = require('express');
const multer  = require('multer');
const fs  = require('fs');

const app = require('./package.json');

// Commander
program.version(app.version);

program
    .option('-d, --directory <dir>', 'directory to serve', 'uploads')
    .option('-p, --port <port>', 'port to serve', 3000)
    .option('-h, --host <host>', 'hostname', '127.0.0.1')
    .parse(process.argv);

const dir = program.directory;
const port = program.port;
const host = program.host;

// Express
const server = express();
server.use(express.static(dir))

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        //var dir = './uploads';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

let upload = multer({storage: storage}).array('files', 12);

server.post('/upload', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong.");
        }
        res.end("Upload completed.");
    });
});


server.listen(port, host);
console.log(`File Service running at http://${host}:${port} serving ${dir}`);