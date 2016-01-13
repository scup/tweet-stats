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

    function addTweet(number, streamOnStub) {
      let tweetCallback = streamOnStub.args[0][1];
      for (var i = 0; i < number; i++) {
        tweetCallback({});
      };
    }
    
    it('Should send json correctly with 1 cycle', () => {

      //Given
      let wordFilter = 'Hello World';
      let streamOnStub = sinon.stub();
      let onStatsSpy = sinon.spy();
      let streamStub = sinon.stub();
      let clock = sinon.useFakeTimers();
      let twit = {
        filter : function(){},
        stream : streamStub
      };
      streamStub.returns({on: streamOnStub});

      //When
      let tweetStats = new TweetStats(twit, 500);
      tweetStats.filter(wordFilter);
      tweetStats.onStats(onStatsSpy);
      
      addTweet(3, streamOnStub);
      clock.tick(500);

      //Then
      onStatsSpy.firstCall.calledWith({"count": 3});
      tweetStats.stop();
      clock.restore();
    });

    it('Should send json correctly with 2 cycles', () => {

      //Given
      let wordFilter = 'Hello World';
      let streamOnStub = sinon.stub();
      let streamStub = sinon.stub();
      let onStatsSpy = sinon.spy();
      let clock = sinon.useFakeTimers();
      let twit = {
        filter : function(){},
        stream : streamStub
      };

      streamStub.returns({on: streamOnStub});

      //When
      let tweetStats = new TweetStats(twit, 500);
      tweetStats.filter(wordFilter);

      tweetStats.onStats(onStatsSpy);
      
      addTweet(3, streamOnStub);
      clock.tick(500);
      addTweet(3, streamOnStub);
      clock.tick(500);

      //Then
      onStatsSpy.firstCall.calledWith({"count": 3});
      onStatsSpy.secondCall.calledWith({"count": 6});
      tweetStats.stop();
      clock.restore();
    });

    it('Should return start and end in Interval', () => {

      //Given
      let wordFilter = 'Hello World';
      let streamOnStub = sinon.stub();
      let streamStub = sinon.stub();
      let onStatsSpy = sinon.spy();

      let clock = sinon.useFakeTimers();

      let twit = {
        filter : function(){},
        stream : streamStub
      };

      streamStub.returns({on: streamOnStub});

      //When
      let tweetStats = new TweetStats(twit, 500);
      tweetStats.filter(wordFilter);

      tweetStats.onStats(onStatsSpy);
      clock.tick(510);

      //Then
      onStatsSpy.firstCall.calledWith({"count": 0, "start":0, "end":500});
      tweetStats.stop();
      clock.restore();

    });


    it('Should return start and end in Interval with 2 cicles', () => {

      //Given
      let wordFilter = 'Hello World';
      let streamOnStub = sinon.stub();
      let streamStub = sinon.stub();
      let onStatsSpy = sinon.spy();

      let clock = sinon.useFakeTimers();

      let twit = {
        filter : function(){},
        stream : streamStub
      };

      streamStub.returns({on: streamOnStub});

      //When
      let tweetStats = new TweetStats(twit, 500);
      tweetStats.filter(wordFilter);

      tweetStats.onStats(onStatsSpy);
      clock.tick(1000);

      //Then
      chai.assert.equal(onStatsSpy.firstCall.calledWith({"count": 0, "start":0, "end":500}), true);
      chai.assert.equal(onStatsSpy.secondCall.calledWith({"count": 0, "start":500, "end":1000}), true);

      tweetStats.stop();
      clock.restore();



    });

    it('Should return with default interval', () => {
      //Given
      let wordFilter = 'Hello World';
      let streamOnStub = sinon.stub();
      let streamStub = sinon.stub();
      let onStatsSpy = sinon.spy();

      let clock = sinon.useFakeTimers();

      let twit = {
        filter : function(){},
        stream : streamStub
      };

      streamStub.returns({on: streamOnStub});

      //When
      let tweetStats = new TweetStats(twit);
      tweetStats.filter(wordFilter);

      var defaultInterval = 1000 * 60 * 60; // 1 hour

      tweetStats.onStats(onStatsSpy);
      clock.tick(defaultInterval * 2);

      //Then
      chai.assert.equal(onStatsSpy.firstCall.calledWith({
        "count": 0, 
        "start": 0, 
        "end": defaultInterval
      }), true);

      chai.assert.equal(onStatsSpy.secondCall.calledWith({
        "count": 0,
        "start": defaultInterval,
        "end": defaultInterval * 2
      }), true);


      tweetStats.stop();
      clock.restore();

    });


  });
});