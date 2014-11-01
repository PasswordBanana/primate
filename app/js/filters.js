/**
 * @namespace Filters
 * @desc AngularJS Filters for DECO3801 Project
 *
**/

/**
 * @name hash
 * @desc Replace the given input with asterisks
 * @param {string} input - text input to replace with asterisks
 * @return {string}
 * @memberOf Filters
 */
primate.filter("hash", function() {
    return function(input) {
        input = input || "";
        var out = "";
        for (var i = 0, il = input.length; i < il; i++) {
            out += "*";
        }
        
        return out;
    };
});

/**
 * @name passwordStrengthScore
 * @desc get the zxcvbn score of a given string
 * @param {string} input - text input to score
 * @return {string}
 * @memberOf Filters
 */
primate.filter("passwordStrengthScore", function() {
    return function(input) {
        input = input || "";
        return zxcvbn(input).score;
    };
});

/**
 * @name recordIndent
 * @desc If the given record is valid and part of a group, add an indent amount.
 * @param {object} record - a valid record object
 * @return {number} pixel value of the indent of the object
 * @memberOf Filters
 */
primate.filter("recordIndent", function() {
    return function(record) {
        return (record && record.group && record.group !== "") ? 20 : 0;
    };
});

/**
 * @name groupIndent
 * @desc If the given object is a group, get a pixel indent value based upon it's nesting
 * @param {object} group - a valid group in the records tree view
 * @return {number} pixel value of the indent of the object
 * @memberOf Filters
 */
primate.filter("groupIndent", function() {
    return function(group) {
        if (!group || !group.level) return 0;
        var level = (Math.floor(group.level) >= 1) ? Math.floor(group.level - 1) : 0;
        return 20 * level;
    };
});

/**
 * @name flagValue
 * @desc get the boolean value of whether a given flag in GLOBAL.policyFlags is set in the given number.
 * @param {array} tuple - an array that should have two values, a number and a string which corresponds to a flag name in the GLOBAL.policyFlags object.
 * @return {bool}
 * @memberOf Filters
 */
primate.filter("flagValue", function() {
    return function(tuple) {
        if (tuple && tuple.length === 2 && typeof tuple[0] === "number" && policyFlags.hasOwnProperty(tuple[1])) {
            return checkFlag(tuple[0], tuple[1]);
        }

        return false;
    };
});
