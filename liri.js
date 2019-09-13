require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const moment = require("moment");
const axios = require("axios");


const command = process.argv[2];
let target = process.argv[3];
for (let i = 4; i < process.argv.length; i++) {
    target += " " + process.argv[i];
}


const doIt = () => {
    switch (command) {
        case "concert-this":
            concert();
            break;

        case "spotify-this-song":
            song();
            break;

        case "movie-this":
            movie();
            break;

        case "do-what-it-says":
            doIt();
            break;
    }

}

const song = () => {
    spotify.search({ type: 'track', query: target, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("Song: " + data.tracks.items[0].preview_url);
    });
}

const concert = () => {
    axios.get("https://rest.bandsintown.com/artists/" + target + "/events?app_id=codingbootcamp")
        .then(function (response) {
            // handle success
            const drillDown = response.data[0];
            let venueDate = moment(drillDown.datetime).format("MM " + "DD" + " YYYY");
            console.log("Venue: " + drillDown.venue.name);
            console.log("Date: " + venueDate);
            console.log("Location: " + drillDown.venue.city);
        })
        .catch(function (error) {
            // handle error
            console.log("Error occurred: " + error);
        })
}

const movie = () => {
    axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + target)
        .then(function (response) {
            // handle success
            const drillDown = response.data;
            console.log("Title: " + drillDown.Title);
            console.log("Year: " + drillDown.Year);
            console.log("imbdRating: " + drillDown.imdbRating);
            console.log("Rated: " + drillDown.Rated);
            console.log("Country: " + drillDown.Country);
            console.log("Language: " + drillDown.Language);
            console.log("Plot: " + drillDown.Plot);
            console.log("Actors: " + drillDown.Actors);
            // if movie-this returns a false response run Mr. Nobody block
            //not sure how to get this section to work
        })
        .catch(function (error) {
            // handle error
            console.log("Error occurred: " + error);
        })
}

doIt();