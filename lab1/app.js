// I Pledge My Honor That I Have Abided By The Stevens Honor System - Kamil Zambrowski

const express = require('express');
const app = express();
const configRoutes = require('./routes');

app.use(express.json());

let urls = {};
let requests = 0;

app.use(function (req, res, next) {
    requests++;
    console.log("Number of requests to server: " + requests);
    method = req.method;
    route = req.originalUrl;
    if (urls[route] != undefined) {
        urls[route]++;
    } else {
        urls[route] = 1;
    }
    console.log("Request Body: " + JSON.stringify(req.body));
    console.log(method + " http://localhost:3000" + route);
    console.log("Number of requests for this URL: " + urls[route]);
    next();
})

configRoutes(app);

app.listen(3000, ()=> {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});