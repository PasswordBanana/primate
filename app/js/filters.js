/**
 * AngularJS Filters for DECO3801 Project
 *
**/

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
		return (record.group && record.group !== "") ? 20 : 0;
	};
});

primate.filter("groupIndent", function() {
	return function(group) {
		var level = group.level - 1 || 0;
		return 20 * level;
	}
});