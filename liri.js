/**
 * Created by goosetaculous on 6/19/17.
 */
'use strict';
(function(){
    var fs       =  require('fs')
    var keys     =  require('./keys')
    var Twitter  =  require('twitter')
    var Spotify  =  require('node-spotify-api')
    var request  =  require('request')
    var client   =  new Twitter(keys.twitterKeys)
    var spotify  =  new Spotify(keys.spotifyKeys)
    var command =  process.argv[2]
    fs.access('./log.txt','wx', function(err){
        err ? createLogFile(command) : null;
    })
    function writeLogFile(log){
        fs.appendFile('./log.txt',"\t"+log+"\n",function(err){
            if(err){
                console.log("error writing on log file")
            }
        })
    }
    function createLogFile(command){
        fs.writeFile('log.txt',command,function (err){
            if (err){
                console.log('Something wrong when writing on the file')
            }
        })
    }

    function buildCommandstring(){
        var cmdString="";
        for (var i = 2; i < process.argv.length; i++){
            cmdString = cmdString  +process.argv[i] + " "
        }
        return cmdString
    }
    function getCommand(command){
        fs.appendFile('log.txt',buildCommandstring()+":\n",function(err){
            err ? console.log("Something wrong with writing the file ") : null
        })
        switch (command){
            case 'my-tweets':
                getTweets()
                break;
            case 'spotify-this-song':
                getSong(checkTitle('song'))
                break;
            case 'movie-this':
                getMovie(checkTitle('movie'))
                break;
            case 'do-what-it-says':
                break;
        }
    }

    function getMovie(movie){
        request('http://www.omdbapi.com/?apikey=40e9cece&t='+movie, function(error, response, body){
            if(!error  && response.statusCode ==  200){
                var obj= JSON.parse(body)
                console.log(obj.Title)
                writeLogFile(obj.Title)
                console.log(obj.Year)
                writeLogFile(obj.Year)
                console.log(obj.imdbRating)
                writeLogFile(obj.imdbRating)
                console.log(obj.Country)
                writeLogFile(obj.Country)
                console.log(obj.Language)
                writeLogFile(obj.Language)
                console.log(obj.Plot)
                writeLogFile(obj.Plot)
                console.log(obj.Actors)
                writeLogFile(obj.Actors)
                console.log(obj.Ratings[1].value)
            }

        })
    }

    function checkTitle(command) {
        var commandStrings = ['my-tweets','spotify-this-song','movie-this','do-what-it-says']
        if(process.argv.length > 3 && commandStrings.indexOf(process.argv[3]) === -1 ){
            return process.argv[3]
        }else if(command == 'song') {
            writeLogFile("Need a song title, so we'll provide 'The Sign'")
            return "The Sign Ace of Base"
        } else if(command=='movie'){
            writeLogFile("Need a Movie title, so we'll provide 'Mr.Nobody'")
            return "Mr.Nobody"
        }
    }

    function getSong(song){
        spotify.search({ type: 'track', query: song, limit:1 }, function(err, data) {
            if (err) {
                writeLogFile('Error occurred: ' + err)
                return console.log('Error occurred: ' + err);
            }
            console.log(data.tracks.items[0].album.artists[0].name)
            writeLogFile(data.tracks.items[0].album.artists[0].name)
            console.log(data.tracks.items[0].name)
            writeLogFile(data.tracks.items[0].name)
            console.log(data.tracks.items[0].external_urls.spotify)
            writeLogFile(data.tracks.items[0].external_urls.spotify)
            console.log(data.tracks.items[0].album.name)
            writeLogFile(data.tracks.items[0].album.name)
        });
    }

    function getTweets(){
        client.get('statuses/user_timeline.json', {count: 20}, function(error, tweets, response) {
            if (!error) {
                tweets.forEach(function (tweet) {
                    writeLogFile(tweet.text)
                    console.log(tweet.text+"\n")
                })
            }
        });
    }
    getCommand(command)
})()
