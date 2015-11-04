export default class TweetStats {

	constructor(twit) {
		this.source = twit;
	}

	filter(word) {
		this.source.stream(
      'statuses/filter', 
      { track: word }
    );
	}

}