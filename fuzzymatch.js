var fs = require('fs');
var bson = require('bson');
var BSON = bson.BSONPure.BSON;
var tokenizer = require('./tools').tokenizer;

var lang_tree = BSON.deserialize(fs.readFileSync('lang'));

var similarity = {
	'ω': {
		'ώ': 10,
		'ο': 5,
	},
	'η': {
		'ή': 10,
	},
	'ο': {
		'ό': 10,
	},
	'υ': {
		'ύ': 10,
	},
	'ε': {
		'έ': 10,
	},
	'ι': {
		'ί': 10,
		'η': 5,
	},
	'α': {
		'ά': 10,
	},
	'εί': {
		'ι': 5,
		'ει': 10,
	},
	'οι': {
		'οί': 5,
		'ι': 10
	},
	'αι': {
		'αί': 5,
		'ε': 10
	}
};

//	['α', 'ε', 'ι', 'η', 'υ', 'ο', 'ω']


function recEdit (tokens, pointer, cost, word, results, threshold) {


	//add letter
	var addCost; 

	if (tokens.length == 0) {
		addCost = cost + 1.5
	} 
	else if (word.length == 0) {
		addCost = cost + 1.4
	}
	else {
		addCost = cost + 1.3
	}
	for (var newLeter in pointer) {
		if ( newLeter == '$') continue;
		if ( addCost > 2 ) {
			continue;
		}
		recEdit(tokens.slice(0), pointer[newLeter], addCost, word+newLeter, results, threshold);
	}

	//this is the end ?
	if ( tokens.length == 0 ) {
		if ( '$' in pointer ) {
			results.push([word, cost])
		}
		return;
	}

	//replace letter
	var token = tokens.shift();
	var childCost;
	for (var letter in pointer) {

		if ( letter == '$') continue;

		editCost = cost + computeCost(token, letter);
		
		if ( editCost > 2 ) {
			continue;
		}

		recEdit(tokens.slice(0), pointer[letter], editCost, word+letter, results, threshold);
		
	}
	
	//remove letter
	var removeCost = cost+1;
	if ( word.charAt(word.length-1) === token ) {
		removeCost = cost + 0.7; //in case of double letters
	}
	if ( removeCost <= 2) {
		recEdit(tokens.slice(0), pointer, removeCost, word, results, threshold);
	}

}

function computeCost (source, compare) {
	if ( source == compare ) {
		return 0;
	}
	else if ( source in similarity && compare in similarity[source]) {
		return 1/similarity[source][compare];
	}
	else if ( compare in similarity && source in similarity[compare]) {
		return 1/similarity[compare][source];
	}
	else {
		return 1;
	}
}

function fuzzy_match_word(word) {
	var tokens = tokenizer(word, 'gr');

	var results = [];
	var maxThreshold = word.length;
	
	for ( var threshold = 2; threshold < maxThreshold; threshold*=2) {
		console.time('3dit ' + word + ' x' + threshold);
		recEdit(tokens, lang_tree, 0, '', results, threshold);
		console.timeEnd('3dit ' + word + ' x' + threshold);
		
		if ( results.length > 0 ) {
			break;
		}

	}

	results.sort(function (a,b) {
		return a[1] - b[1];
	});

	console.log(results.slice(0, 12));

}

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
	var words = chunk.split(/\s/);
	words.map(function (word) {
		if (word.length < 2) return;
		console.log( word, ':');
		fuzzy_match_word(word); 
	});
  }
});