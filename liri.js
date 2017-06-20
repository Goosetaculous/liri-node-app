/**
 * Created by goosetaculous on 6/19/17.
 */
'use strict';
(function(){
    var fs       =  require('fs')
    var keys     =  require('./keys')
    var Twitter  =  require('twitter')
    var Spotify  =  require('node-spotify-api')
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
                 if( checkSongTitle()) {
                     getSong(checkSongTitle())
                 }
                break;
            case 'movie-this':
                break;
            case 'do-what-it-says':
                break;
        }
    }
    function checkSongTitle() {
        var commandStrings = ['my-tweets','spotify-this-song','movie-this','do-what-it-says']
        if(process.argv.length > 3 && commandStrings.indexOf(process.argv[3]) === -1 ){
            return process.argv[3]
        }else {
            console.log("Need a valid song title")
            writeLogFile("Need a song title")
            return false
        }
    }

    function getSong(song){
        //console.log(song)

        spotify.search({ type: 'track', query: song, limit:1 }, function(err, data) {
            if (err) {
                writeLogFile('Error occurred: ' + err)
                return console.log('Error occurred: ' + err);
            }
            // Artist(s)
            // The song's name
            // A preview link of the song from Spotify
            // The album that the song is from

            console.log(JSON.stringify(data.tracks.items[0].album.artists[0].name,null,2)); // NAME of the artist
            console.log(JSON.stringify(data.tracks.items[0].name,null,2)); // name of the song
            console.log(JSON.stringify(data.tracks.items[0].album.name,null,2)); //Name of the album
            console.log(JSON.stringify(data.tracks.items[0].preview_url,null,2)); //preview URL

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
