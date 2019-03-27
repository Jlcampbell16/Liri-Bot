require("dotenv").config();
var keys = require("./keys.js");

var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var action = process.argv[2]
var input = process.argv.slice(3).join("+");


function switchFunc(command, arg) {
    switch (command) {
        case "concert-this":
            concertThis(arg);
            break;
        case "spotify-this-song":
            spotifyThis(arg);
            break;
        case "movie-this":
            movieThis(arg);
            break;
        case "do-what-it-says":
            whatSays();
            break;
        default:
            return console.log("Not a valid request. Try concert-this, spotify-this-song, movie-this, or do-what-it-says ")
    }
};
switchFunc(action, input);

//***** `node liri.js concert-this <artist/band name here>
function concertThis(artist) {
    var bandURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    if (!artist) {
       return console.log("Don't forget to include an artist name!")
    };
    axios.get(bandURL).then(
        function (response) {
            var data = response.data[0];
            var date = moment(data.datetime, "YYYY-MM-DDTHH:mm:ss")
            var convertedDate = moment(date).format("MM/DD/YYYY")
            // console.log(JSON.stringify(data, null, 2));
            console.log(`${artist} is playing at ${data.venue.name}.`);
            console.log(`This venue is in ${data.venue.city}, ${data.venue.region}.`)
            console.log(`You can see ${artist} in concert on ${convertedDate}.`)

        }).catch(function (error) {
            console.log(error);
        });
};


//***** `node liri.js spotify-this-song '<song name here>'`
function spotifyThis(song) {

    if (!song) {
        song = "ace+of+base"
    };
    spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var data = data.tracks.items[0];
        console.log(`Artist(s) Name: ${data.artists[0].name}`);
        console.log(`Song Name: ${data.name}`);
        console.log(`Preview Link: ${data.preview_url}`);
        console.log(`Album: ${data.album.name}`);

    });
}

//***** `node liri.js movie-this '<movie name here>'`
function movieThis(movie) {
    console.log(movie)
    if (!movie) {
        movie = "Mr.+Nobody"
    };
    var omdbURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy"
    axios.get(omdbURL).then(
        function (response) {
            var data = response.data
            console.log(`Title: ${data.Title}`);
            console.log(`Movie release year: ${data.Year}`)
            console.log(`IMBD rating: ${data.Ratings[0].Value}`)
            console.log(`Rotten Tomatoes rating: ${data.Ratings[1].Value}`)
            console.log(`Country where ${movie} was produced: ${data.Country}`)
            console.log(`Language: ${data.Language}`)
            console.log(`Plot: ${data.Plot}`)
            console.log(`Actors in ${movie} include: ${data.Actors}`)
            // console.log(artist + " is playing at " + data.venue.name + " in " + data.venue.city + ", " + data.venue.region + " on " + convertedDate)
        }).catch(function (error) {
            console.log(error);
        });

};

//***** `node liri.js do-what-it-says`
function whatSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            console.log(err);
        }
        var dataArr = data.split(",");
        switchFunc(dataArr[0], dataArr[1])
    })

};

