const request = require('request-promise');
const functions = require('firebase-functions');

const config = functions.config().moviedb;

exports.searchMovieMatches = async (req, res, next) => {

    if(!req.body.ids) {
        res.status(400).json({});
        return;
    }

    // Filter down unique IDs in the body
    var ids = req.body.ids.filter((item, i, ar) => ar.indexOf(item) === i);

    // If IDs are empty or there isn't at least two IDs on the request, exit
    if(!ids || ids.length < 2) {
        res.status(204).json({});
        return;
    }

    let movies = [];

    // Loop through each actor ID and get their filmography
    for(var i = 0; i < ids.length; i++) {
        id = ids[i]
        
        if(!id || !Number.isInteger(id)){
            continue;
        }
        
        await request(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${config.moviedb_api_key}`).then(res => {
            let result = JSON.parse(res);

            // Store the movie ID, the movie information and the actor ID into an array
            const movieIds = result.cast.map(p => p.id);
            const movieInfos = result.cast;
            const actorId = result.id;

            movies.push({actorId: actorId, movieIds: movieIds, movieInfos: movieInfos});
        });
    }

    // If at least two distinct actor IDs were not provided on the request, don't proceed
    if(movies.length < 2) {
        res.status(204).json({});
        return;
    }

    const result = [];

    // Loop through each movie of the first actor and see if other actors are in the movie
    for(var i = 0; i < movies[0].movieIds.length; i++) {
        var match = true;
        var movieId = movies[0].movieIds[i];

        // Check if all the other actors belong to the current film observed
        for(j = 1; j < movies.length; j++) {
            match = movies[j].movieIds.includes(movieId);
            
            // If the actor isn't in the current film observed, exit the loop and skip to the next movie
            if(!match)
                break;
        }

        if(!match)
            continue;
        
        // Push the filmography of the first actor to the result on the matching movie ID that is similar between multiple actors
        result.push(movies[0].movieInfos.find(p => p.id === movieId));
    }

    // Display the results in reverse order of popularity

    res.status(200).json(result.sort(function(a,b) {return parseFloat(b.popularity) - parseFloat(a.popularity)}));

}


exports.searchMovieById = async (req, res, next) => {

    // If no ID provided, return HTTP 400 Bad Request
    if(!req.params.id || !req.params.id.matches("[0-9]+")){
        res.status(400).json({});
        return;
    }

    // Replace non numeric characters
    var id = req.params.id.replace(/\D/g,'');

    if(!id) {
        res.status(204).json({});
        return;
    }

    await request(`https://api.themoviedb.org/3/movie/${id}?api_key=${config.moviedb_api_key}`).then(resp => {
        res.status(200).json(JSON.parse(resp));
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
}