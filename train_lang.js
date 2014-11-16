var fs = require('fs');
var bson = require("bson");
var BSON = bson.BSONPure.BSON;
var wordTokenizer = require('./tools').wordTokenizer;

var wordFreq = {};
var wordTotal = 0;

function addWord(word) {

	wordTotal++;
	if (word in wordFreq) {
		wordFreq[word]++;
	}
	else {
		wordFreq[word] = 1;
	}

}

function flashFreqs () {
	for ( var word in wordFreq ) {
		wordFreq[word] /= wordTotal;
	}
	wordTotal = 0;
	var bson = BSON.serialize(wordFreq, false, true, false);
	fs.writeFile('wfreq', bson);
}


var dictFile = process.argv[2] || 'text';
fs.readFile(dictFile, function (err, data) {
	if (err) throw err;

	var words = wordTokenizer(data.toString());
	words.map(function (word) {
		if ( word.length < 2) return;
		addWord(word);
	});


});
