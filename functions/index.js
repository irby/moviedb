const functions = require('firebase-functions');
const express = require('express');
// const bodyParser = require('body-parser');
// const path = require("path");
const cors = require("cors");

const personRoutes = require('./routes/person');
const movieRoutes = require('./routes/movies');

const e = require('express');
// const { app } = require('firebase-admin');

const app = express();

var allowedOrigins = functions.config().moviedb.cors_allowed_origins.split(",");

var corsOptions = {
    origin: function(origin, callback) {
        if(allowedOrigins[0] === "*" || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    }
}

app.use(cors(corsOptions));

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if(allowedOrigins[0] === "*") {
        res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
    } else if(allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Headers', 'Host, Referer, User-Agent, Origin, Access-Control, Allow-Origin, Content-Type, Accept, Authorization, Origin, Accept-Encoding, Accept-Language, X-Requested-With, Access-Control-Request-Method, Access-Control-Request-Header');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    next();
});

app.use('/person', personRoutes);
app.use('/movies', movieRoutes);

exports.api = functions.https.onRequest(app);
