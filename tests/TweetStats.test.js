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
            .once()
            .withArgs(
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
          mockTwit.restore();
        });


    });

    describe("onStats", () => {
        
        it('Should send json correctly', (done) => {

          //Given
          let wordFilter = 'Hello World';
          let streamOnStub = sinon.stub();
          
          let streamStub = sinon.stub();
          streamStub.returns({on: streamOnStub});

          let twit = {
            filter : function(){},
            stream : streamStub
          };

          //When
          let tweetStats = new TweetStats(twit);
          tweetStats.filter(wordFilter);
          tweetStats.onStats(function(json){ 
            chai.assert.equal(3, json.count);
            done();
          });


          //Then
          let tweetCallback = streamOnStub.args[0][1];
          tweetCallback({});
          tweetCallback({});
          tweetCallback({});

        });


    });

});