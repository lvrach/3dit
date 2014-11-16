var fs = require('fs');
var bson = require('bson');
var BSON = bson.BSONPure.BSON;
var tokenizer = require('./tools').tokenizer;


var lang_tree = BSON.deserialize(fs.readFileSync('lang'));

function match_word(word) {
	var tokens = tokenizer(word, 'gr');

	tokens.push('$');
	var token;
	var pointer = lang_tree;
	for (var i=0; i < tokens.length; i++ ) {
		token = tokens[i];
		if ( token in pointer ) {
			pointer = pointer[token];
		}
		else {
			return false;
		}
	}
	return true;

}

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
	var words = chunk.split('\n');
	words.map(function (word) {
		console.log('word "', word, '"');
		if ( match_word(word) ) {
			console.log('match');
		}
		else {
			console.log('does not match');
		}

	});
  }
});

