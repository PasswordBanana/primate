var primate = angular.module("primate", ['ngAnimate']);

/*
 * The default application password policy
 */
var defaultPolicy = {
    flags: 0xF000,
    length: 12,
    minLowercase: 1,
    minUppercase: 1,
    minDigit: 1,
    minSymbol: 1
};

var DefaultPolicy = function() {
    return {
        flags: 0xF000,
        length: 12,
        minLowercase: 1,
        minUppercase: 1,
        minDigit: 1,
        minSymbol: 1
    };
};

var policyFlags = {
    "useLowercase": 0x8000,
    "useUppercase": 0x4000,
    "useDigits": 0x2000,
    "useSymbols": 0x1000,
    "useHexDigits": 0x0800,
    "useEasyVision": 0x0400,
    "makePronounceable": 0x0200
    //unused: 0x01ff
};

var checkFlag = function(flags, flagName) {
    return !!(flags & policyFlags[flagName]);
};

var setFlag = function(flags, flagName) {
    return flags |= policyFlags[flagName];
};

var clearFlag = function(flags, flagName) {
    return flags &= ~policyFlags[flagName];
};

var Group = function(groupName, fullGroup, nestingLevel) {
    var name = groupName || "No name";
    var level = nestingLevel;
    var fullGroup = fullGroup;
    var expanded = true;
    return {
        name: name,
        level: level,
        fullGroup: fullGroup,
        expanded: expanded,
        subgroups: [],
        records: []
    };
};

var groupIndex = function(arr, groupName) {
    for (var i = 0, il = arr.length; i < il; i++) {
        if (arr[i].name && arr[i].name === groupName) {
            return i;
        }
    }
    return -1;
};

var generateRecordTree = (function(records) {
    var tree = [], currentNode;
    tree.push(new Group("", "", 0));
    for (var r = 0, rl = records.length; r < rl; r++) {
        var rGroups = (records[r].group) ? records[r].group.split(".") || [] : [];

        currentNode = tree[0];

        for (var g = 0, gl = rGroups.length; g < gl; g++) {
            var idx = groupIndex.call(this, currentNode.subgroups, rGroups[g]);

            if (idx >= 0) {
                currentNode = currentNode.subgroups[idx];
            } else {
                var fullGroup = rGroups.slice(0, g + 1).join(".");
                currentNode.subgroups.push(new Group(rGroups[g], fullGroup, g + 1));
                currentNode = currentNode.subgroups[currentNode.subgroups.length - 1];
            }
        }
        currentNode.records.push(records[r]);
    }

    return tree;
});

/*
 * Return a random string of characters in validChars of length len
 */
var randomPassword = function(len, validChars){
    var str = "",
        charLen = validChars.length;

    for (var i = 0; i < len; i++) {
        str += validChars.charAt(Math.floor(Math.random() * charLen));
    }
    return str;
};

/*
 * Count occurrences of characters from charset in pass
 */
var countOccurrences = function(charset, pass) {
    var count = 0;
    for (var i = 0, il = pass.length; i < il; i++) {
        if (charset.indexOf(pass[i]) > -1) {
            count++;
        }
    }
    return count;
};

/*
 * Generate a password from the given password policy
 * or the default policy if one is not provided/undefined
 */
var generatePassword = function(policy) {

    if (policy === undefined) {
        policy = new DefaultPolicy();
    }

    var validChars = "";
    var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lowercase = "abcdefghijklmnopqrstuvwxyz";
    var digits = "0123456789";
    var symbols = "+-=_@#$%^&<>/~\\?!|()";
    var hexDigits = "0123456789ABCDEF";

    if (checkFlag(policy.flags, "useHexDigits")) {
        validChars += hexDigits;
    } else {
        if (checkFlag(policy.flags, "useLowercase")) validChars += lowercase;
        if (checkFlag(policy.flags, "useUppercase")) validChars += uppercase;
        if (checkFlag(policy.flags, "useDigits")) validChars += digits;
        if (checkFlag(policy.flags, "useSymbols")) validChars += symbols;
    }

    var pass = "";

    if (policy.minLowercase + policy.minUppercase + policy.minDigit + policy.minSymbol > policy.length) {
        throw new Error("Policy invalid, impossible conditions");
    }

    do {
        pass = randomPassword(policy.length, validChars);
    } while (countOccurrences(lowercase, pass) < policy.minLowercase &&
             countOccurrences(uppercase, pass) < policy.minUppercase &&
             countOccurrences(digits, pass) < policy.minDigit &&
             countOccurrences(symbols, pass) < policy.minSymbol);

    return pass;
};