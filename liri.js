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

    function getCommand(command){
        if(Array.isArray(command)){
            var song = command[1]
            var command = command[0]
            process.argv[3] =  song
        }
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
                getMovie(adjustMovieTitle(checkTitle('movie')))
                break;
            case 'do-what-it-says':
                readRandomfile("./random.txt")
                break;
        }
    }

    function readRandomfile(file){
        fs.readFile(file,function(err,data){
            if(err){
                console.log("something went wrong on reading the file")
            }else {
                var txt = data.toString().split(",")
                getCommand(txt)
            }
        })
    }

    function writeLogFile(log){
        fs.appendFile('./log.txt',"\t"+log+"\n",function(err){
            err ? console.log("error writing on log file") : null
        })
    }

    function createLogFile(command){
        fs.writeFile('log.txt',command,function (err){
            if (err){
                console.log('Something wrong when writing on the file')
            }
        })
    }

    function adjustMovieTitle(title){
        title =  title.trim()
        while (title.indexOf(" ") > -1 || title.indexOf(".")> -1){
            title = title.replace(" ", "_")
            title = title.replace(".", "_")
        }
        return title
    }

    function buildCommandstring(){
        var cmdString="";
        for (var i = 2; i < process.argv.length; i++){
            cmdString = cmdString  +process.argv[i] + " "
        }
        return cmdString
    }

    function getMovie(movie){
        request('http://www.omdbapi.com/?apikey=40e9cece&t='+movie, function(error, response, body){
            if(!error  && response.statusCode ==  200){
                var obj= JSON.parse(body)
                console.log("* TITLE: " + obj.Title)
                writeLogFile("* TITLE: " + obj.Title)
                console.log("* YEAR: " + obj.Year)
                writeLogFile("* YEAR: " + obj.Year)
                console.log("* IMDB RATING: " + obj.imdbRating)
                writeLogFile("* IMDB RATING: " + obj.imdbRating)
                console.log("* COUNTRY: " + obj.Country)
                writeLogFile("* COUNTRY: " + obj.Country)
                console.log("* LANGUAGE: " + obj.Language)
                writeLogFile("* LANGUAGE: " + obj.Language)
                console.log("* PLOT: " + obj.Plot)
                writeLogFile("* PLOT: " + obj.Plot)
                console.log("* Actors: " + obj.Actors)
                writeLogFile("* Actors: " + obj.Actors)
                rottentomatoesCheck('https://www.rottentomatoes.com/m/'+ adjustMovieTitle(movie), obj.Year,function(link){
                    var rotTomatolink = link
                    writeLogFile("* Rottentomatoes Link: "+ rotTomatolink)
                    console.log("* Rottentomatoes Link: "+rotTomatolink)
                })
            }
        })
    }
    function rottentomatoesCheck(link, year,callback){
        request(link, function(error, response, body){
            response.toString().indexOf("404 - Not Found")> -1 ? callback (link+"_"+year):  callback (link)
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
            console.log("* Artist: " +data.tracks.items[0].album.artists[0].name)
            writeLogFile("* Artist: " +data.tracks.items[0].album.artists[0].name)
            console.log("* Song: "+data.tracks.items[0].name)
            writeLogFile("* Song: "+data.tracks.items[0].name)
            console.log("* Link: "+data.tracks.items[0].external_urls.spotify)
            writeLogFile("* Link: "+data.tracks.items[0].external_urls.spotify)
            console.log("* Album: "+data.tracks.items[0].album.name)
            writeLogFile("* Album: "+data.tracks.items[0].album.name)
        });
    }

    function getTweets(){
        client.get('statuses/user_timeline.json', {count: 20}, function(error, tweets, response) {
            if (!error) {
                tweets.forEach(function (tweet) {
                    writeLogFile(tweet.text)
                    console.log(tweet.text+"\n")
                })
            }else{
                console.log(err)
            }
        });
    }
    fs.access('./log.txt','wx', function(err){
        err ? createLogFile(command) : null;
    })
    getCommand(command)
})()
