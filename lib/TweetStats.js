export default class TweetStats {

  constructor(twit, interval) {
    this.source = twit;
    this.stream = null;
    this.interval = null;
    var defaultInterval = 1000 * 60 * 60; // 1 hour
    this.timeInterval = interval||defaultInterval;
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

    var date = new Date().getTime();
    var currentInterval = this.timeInterval;

    this.interval = setInterval(function() {
      callback({
        start: date,
        end: date += currentInterval,
        count: tweets.length
      });
    }, currentInterval);
  }

  stop() {
    clearInterval(this.interval);
  }
}