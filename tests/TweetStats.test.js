import TweetStats from "../lib/TweetStats";
import chai from "chai";
import sinon from "sinon";
import Twit from "twit";

describe("TweetStats", () => {

    describe("filter", () => {
        
        it('Should add filter correctly', () => {

          //Given
          let wordFilter = 'Hello World';
          let mockTwit = sinon.mock(Twit.prototype);
          let expectTwit = mockTwit
            .expects("stream")
            .once().withArgs(
              'statuses/filter',
              { track: wordFilter }
            );

          
          let twit = new Twit({
            consumer_key:         'aaaaa',
            consumer_secret:      'bbbbb',
            access_token:         'ccccc',
            access_token_secret:  'ddddd'
          });

          //When
          let tweetStats = new TweetStats(twit);
          tweetStats.filter(wordFilter);


          //Then
          expectTwit.verify();

        });


    });

    describe("onStats", () => {
        
        it('Should send json correctly', () => {

          //Given
          let wordFilter = 'Hello World';
          let spyTwit = sinon.spy(Twit.prototype);
          let expectTwit = spyTwit
            .expects("on")
            

          
          let twit = new Twit({
            consumer_key:         'aaaaa',
            consumer_secret:      'bbbbb',
            access_token:         'ccccc',
            access_token_secret:  'ddddd'
          });

          //When
          let tweetStats = new TweetStats(twit);
          tweetStats.onStats(function(json){

          });


          //Then
          expectTwit.verify();

        });


    });

});