require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var moment = require("moment");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var divider =
  "\n-----------------------------------------------------------------------\n";

function pick(command, query) {
  switch (command) {
    case "concert-this":
      getBands(query);
      break;
    case "spotify-this-song":
      getSongs(query);
      break;
    case "movie-this":
      getMovies(query);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("Hmmm, I'm not familiar with that. Please try again!");
      break;
  }
}
function getBands(artist) {
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        artist +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
      console.log("Name of the venue:", response.data[0].venue.name);
      console.log("Venue location:", response.data[0].venue.city);
      var eventDate = moment(response.data[0].datetime).format("MM/DD/YYYY");
      console.log("Date of the Event:", eventDate);
      console.log("Love it! Get me a ticket!");
      console.log(divider);
    })
    .catch(function(error) {
      console.log(error);
    });
}
var spotify = new Spotify(keys.spotify);
function getSongs(songName) {
  if (songName === "") {
    songName = "Payphone";
  }
  spotify.search(
    {
      type: "track",
      query: songName
    },
    function(err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }
      var songs = data.tracks.items;
      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("Artist(s): " + songs[i].album.artists[0].name);
        console.log("Song name: " + songs[i].name);
        console.log("Preview song: " + songs[i].preview_url);
        console.log("Album: " + songs[i].album.name);
        console.log("GREAT SONG! Search for another!")
        console.log(divider);
      }
    }
  );
}

function getMovies(movieName) {
  axios
    .get("http://www.omdbapi.com/?apikey=trilogy&t=" + movieName)
    .then(function(data) {
      var results = `
        Title of the movie: ${data.data.Title}
        Year the movie came out: ${data.data.Year}
        IMDB Rating of the movie: ${data.data.Rated}
        Rotten Tomatoes Rating of the movie: ${data.data.Ratings[1].Value}
        Country where the movie was produced: ${data.data.Country}
        Language of the movie: ${data.data.Language}
        Plot of the movie: ${data.data.Plot}
        Actors in the movie: ${data.data.Actors}`;
      console.log(results);
      console.log("One of my favorite films!");
      console.log(divider);
    });
}
function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    data = data.split(",");
    var action = data[0];
    var value = data[1];

    switch (action) {
      case "concert-this":
        getBands(value);
        break;
      case "spotify-this-song":
        getSongs(value);
        break;
      case "movie-this":
        getMovies(value);
        break;
      default:
        break;
    }
  });

  var runThis = function(argOne, argTwo) {
    PublicKeyCredential(argOne, argTwo);
  };
}

var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv.slice(3).join(" "));
