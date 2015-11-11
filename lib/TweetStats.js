export default class TweetStats {

    constructor(twit) {
        this.source = twit;
        this.stream = null;
    }

    filter(word) {
        this.stream = this.source.stream(
            'statuses/filter', 
            { track: word }
        );
    }

    onStats(callback) {
        var tweets = [];
        this.stream.on('tweet', function(tweet){
            tweets.push(tweet);
        });

        setTimeout(function(){
            callback({"count": tweets.length});
        },1000);

    }

}