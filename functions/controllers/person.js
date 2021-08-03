const request = require('request-promise');
const functions = require('firebase-functions');

const config = functions.config().moviedb;


exports.searchPerson = async (req, res, next) => {

    var name = req.query.name

    if(!name || name.length < 3) {
        res.status(204).json({});
        return;
    }

    // Remove any special characters
    name = name.replace(/[&\/\\#,+()$~%.'":;*?<>{}]/g,'');

    await request(`${config.moviedb_api_url}3/search/person?api_key=${config.moviedb_api_key}&query=${name}&page=1`, function(error, response, body) {

        const results = JSON.parse(body);

        if(!error && response.statusCode == 200) {
            res.status(200).json(results.results.slice(0,4));
        } else {
            res.status(500).json({})
        }
    });

}

exports.getPerson = async (req, res, next) => {

    // If no ID provided, return HTTP 400 Bad Request
    if(!req.params.id || !req.params.id.matches("[0-9]+")) {
        res.status(400).json({});
        return;
    }

    // Replace non numeric characters
    var id = req.params.id.replace(/\D/g,'');

    if(!id) {
        res.status(204).json({});
        return;
    }

    await request(`${config.moviedb_api_url}3/person/${id}?api_key=${config.moviedb_api_key}`, function (error, response, body) {
        if(!error && response.statusCode == 200) {
            res.status(200).json(JSON.parse(body));
        } else {
            res.status(500).json({})
        }
    });
}