primate.filter("hash", function() {
	return function(input) {
		var input = input || "";
		var out = "";
		for (var i = 0, il = input.length; i < il; i++) {
			out += "*";
		}
		
		return out;
	};
});

primate.filter("passwordStrengthScore", function() {
	return function(input) {
		var input = input || "";
		return zxcvbn(input).score;
	};
});

primate.filter("recordIndent", function() {
	return function(record) {
		var level = record.group.split(".").length;
		return 20 * level;
	};
});