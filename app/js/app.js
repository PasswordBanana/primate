var primate = angular.module("primate", ['ngAnimate']);

/*
 * The default application password policy
 */
var defaultPolicy = {
    flags: "0x8000",
    length: 12,
    minLowercase: 1,
    minUppercase: 1,
    minDigit: 1,
    minSymbol: 1
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

var parseFlags = function(flagString) {
    var flags = {
        useLowercase: true,
        useUppercase: true,
        useDigits: true,
        useSymbols: true,
        useHexDigits: false,
        unused: false 
    };

    /* Spec, to implement */
    // UseLowercase 0x8000
    // UseUppercase 0x4000
    // UseDigits 0x2000
    // UseSymbols 0x1000
    // UseHexDigits 0x0800 (if set, then no other flags can be set)
    // UseEasyVision 0x0400
    // MakePronounceable 0x0200
    // Unused 0x01ff 

    return flags;
};

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
        policy = defaultPolicy;
    }

    var validChars = "";
    var flags = parseFlags(policy.flags);
    var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lowercase = "abcdefghijklmnopqrstuvwxyz";
    var digits = "0123456789";
    var symbols = "+-=_@#$%^&<>/~\\?!|()";
    var hexDigits = "0123456789ABCDEF";

    if (flags.useHexDigits) {
        validChars += hexDigits;
    } else {
        if (flags.useLowercase) validChars += lowercase;
        if (flags.useUppercase) validChars += uppercase;
        if (flags.useDigits) validChars += digits;
        if (flags.useSymbols) validChars += symbols;
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