const functions = require('firebase-functions');
// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require("path");
// const cors = require("cors");

// const personRoutes = require('./routes/person');
// const movieRoutes = require('./routes/movies');

// const e = require('express');

// const app = express();

// app.options('*', cors());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Host, Referer, User-Agent, Origin, Access-Control, Allow-Origin, Content-Type, Accept, Authorization, Origin, Accept-Encoding, Accept-Language, X-Requested-With, Access-Control-Request-Method, Access-Control-Request-Header');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

//     next();
// });

// app.use('/person', personRoutes);
// app.use('/movies', movieRoutes);

exports.api = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
});
