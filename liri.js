require("dotenv").config();
var fs = require("fs");
var keys = require("./keys");
var request = require("request");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
// var bandsintown = require("bandsintown")("codingbootcamp");
var userInput = process.argv;
var command = process.argv[2];
var searchTerm = "";
var searchTermForPrint = "";
// -------------------------------------


// CREATING SEARCH TERM FOR "PRINTING" TO THE CONSOLE
for (var i = 3; i < userInput.length; i++) {
    if (i > 3 && i < userInput.length) {
        searchTermForPrint = searchTermForPrint + " " + userInput[i];
    } else {
        searchTermForPrint += userInput[i];
    }
}

// CREATING SEARCH TERM 
for (var i = 3; i < userInput.length; i++) {
    if (i > 3 && i < userInput.length) {
        searchTerm = searchTerm + "+" + userInput[i];
    }
    else {
        searchTerm += userInput[i];
    }
}
// -------------------------------------


// USING COMMANDS TO CALL FUNCTIONS
// Spotify 
if (command == "spotify-this-song" && searchTerm) {
    spotifySearch();
}
else if (command == "spotify-this-song" && !searchTerm) {
    searchTermForPrint = "Nothing Else Matters";
    searchTerm = "nothing+else+matters";
    spotifySearch();
}

// Bandsintown
else if (command == "concert-this" && searchTerm) {
    concertSearch();
}
else if (command == "concert-this" && !searchTerm) {
    searchTerm = "Jack+White";
    searchTermForPrint = "Jack White";

    concertSearch();
}

// OMDB
else if (command == "movie-this" && searchTerm) {
    movieSearch();
}
else if (command == "movie-this" && !searchTerm) {
    searchTerm = "die+hard";
    movieSearch();
    console.log("\nDie Hard rules. I have a film degree. Please see Die Hard.");
}

// Do What It Says
else if (command == "do-what-it-says") {
    doWhatItSays();
}
// -------------------------------------


// FUNCTIONS  
// CALLING SPOTIFY
function spotifySearch() {
    spotify.search({ type: 'track', query: searchTerm }, function (err, data) {
        if (err) {
            return console.log('ERROR: ' + err);
        }

        console.log("\nSPOTIFY INFO FOR: " + searchTermForPrint + "\n--------------------");
        for (i = 0; i < 3; i++) {
            console.log(
                "\nArtist: " + JSON.stringify(data.tracks.items[i].artists[0].name)
                + "\nSong: " + JSON.stringify(data.tracks.items[i].name)
                + "\nAlbum: " + JSON.stringify(data.tracks.items[i].album.name)
                + "\nPreview URL: " + JSON.stringify(data.tracks.items[i].preview_url)
            );
        }
    });
}


// CALLING BANDSINTOWN
function concertSearch() {

    var queryUrl = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp";
    request(queryUrl, function (error, response, body) {
        if (error) {
            console.log("ERROR: " + error);
        }

        console.log("CONCERT INFO FOR: " + searchTermForPrint + "\n--------------------");
        var concert = JSON.parse(body);

        for (i = 0; i < 3; i++) {
            console.log(
                "VENUE: " + concert[i].venue.name
                + "\nLOCATION: " + concert[i].venue.city + ", " + concert[i].venue.region
                + "\nDATE: " + moment(concert[i].datetime).format('MM/DD/YYYY')
                + "\n\n"
            );
        }
    });
}


// CALLING OMDB
function movieSearch() {
    var queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            console.log("OMBD INFO FOR: " + searchTermForPrint + "\n--------------------");

            console.log(
                "\nTitle: " + JSON.parse(body).Title
                + "\nRelease Year: " + JSON.parse(body).Year
                + "\nIMDB Rating: " + JSON.parse(body).imdbRating
                + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value
                + "\nLocation: " + JSON.parse(body).Country
                + "\nLanguage: " + JSON.parse(body).Language
                + "\nPlot: " + JSON.parse(body).Plot
                + "\nCast: " + JSON.parse(body).Actors
            );
        }
    });
}

// DO WHAT IT SAYS
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log("Error: " + error);
        }

        var randomThing = data.split(",");
        searchTerm = randomThing[1];
        spotifySearch();
    });
};
// -------------------------------------