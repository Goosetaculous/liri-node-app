/**
 * Created by goosetaculous on 6/19/17.
 */
'use strict';
(function(){
    var fs       =  require('fs')
    var keys     =  require('./keys')
    var Twitter  =  require('twitter')
    var client   =  new Twitter(keys.twitterKeys)
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



    function getCommand(command){
        fs.appendFile('log.txt',command+":\n")
        switch (command){
            case 'my-tweets':
                getTweets()
                break;
            case 'spotify-this-song':
                break;
            case 'movie-this':
                break;
            case 'do-what-it-says':
                break;
        }

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
