# Tweet Stats

## Import Module
``javascript
var TweetStats = module('tweet-stats');
``

## Authentication
``javascript
var credentials = {
  consumer_key: '...',
  consumer_secret: '...',
  access_token: '...',
  access_token_secret: '...'
};
var tweetStats = new TweetStats(credentials);
``

## Filter
``javascript
tweetStats.filter("hello world");
``

## Filter
``javascript

/*
statsJson = {
	total : 100,
	start : #{timestamp},
	end : #{timestamp}
};
*/
tweetStats.onStats(function(statsJson){

	...
	
});
``