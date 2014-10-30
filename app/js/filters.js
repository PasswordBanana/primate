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

/*
 * return a fixed pixel offset if the record is part of a group/subgroup
 */
primate.filter("recordIndent", function() {
    return function(record) {
        return (record && record.group && record.group !== "") ? 20 : 0;
    };
});

primate.filter("groupIndent", function() {
    return function(group) {
        if (!group || !group.level) return 0;
        var level = (Math.floor(group.level) >= 1) ? Math.floor(group.level - 1) : 0;
        return 20 * level;
    }
});

primate.filter("flagValue", function() {
    return function(tuple) {
        if (tuple && tuple.length === 2 && typeof tuple[0] === "number" && policyFlags.hasOwnProperty(tuple[1])) {
            return checkFlag(tuple[0], tuple[1]);
        }

        return false;
    }
});
