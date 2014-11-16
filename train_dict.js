var fs = require('fs');
var bson = require("bson");
var BSON = bson.BSONPure.BSON;
var tokenizer = require('./tools').tokenizer;

var lang_tree = {};

function insert_lang(word) {
	var tokens = tokenizer(word, 'gr');

	tokens.push('$');
	var token;
	var pointer = lang_tree;
	for (var i=0; i < tokens.length; i++ ) {
		token = tokens[i];
		if ( !(token in pointer) ) {
			pointer[token] = {};
		}
		pointer = pointer[token];
	}
}


var dictFile = process.argv[2] || 'dict';
fs.readFile(dictFile, function (err, data) {
	if (err) throw err;

	var words = data.toString().split('\n');
	words.map(function (word) {
		if ( word.length < 2) return;
		console.log(word);
		insert_lang(word);
	});

	var bson = BSON.serialize(lang_tree, false, true, false);
	fs.writeFile('lang', bson);
});
