

token_regex = {
	'gr': /(ού|ού|αι|αί|οι|οί|ει|εί|[Α-ώ])/gi //ου, αι, ει, οι, υι
}

token_word_regex = {
	'gr': /(ού|ού|αι|αί|οι|οί|ει|εί|[Α-ώ])+/gi
}

exports.tokenizer = function (word, lang) {
	return word.match(token_regex[lang]);
}

exports.wordTokenizer = function (text, lang) {
	return word.match(token_regex[lang]);
}