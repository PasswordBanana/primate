var isNW;

try {
    isNW = (typeof require('nw.gui') !== "undefined");
} catch(e) {
    isNW = false;
}

var primate = angular.module("primate", ['ngAnimate', 'mgcrea.ngStrap']);

primate.config(function($tooltipProvider) {
    angular.extend($tooltipProvider.defaults, {
        html: true
    });
});

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

var defaultSymbols = "+-=_@#$%^&<>/~\\?!|()";

/**
 * @constructor DefaultPolicy
 * @desc returns a new DefaultPolicy object
 * @returns {object} default password policy
 */
var DefaultPolicy = function() {
    return {
        flags: defaultPolicy.flags,
        length: defaultPolicy.length,
        minLowercase: defaultPolicy.minLowercase,
        minUppercase: defaultPolicy.minUppercase,
        minDigit: defaultPolicy.minDigit,
        minSymbol: defaultPolicy.minSymbol
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

/**
 * @name checkFlag
 * @desc Check if a flag is set in a given number
 * @param {number} flags - a number which is treated as a bitfield
 * @param {string} flagName - a flag name in the GLOBAL.policyFlags object
 * @returns {bool} whether or not the flag (flagName) is set in the flags bitfield/number
 */
var checkFlag = function(flags, flagName) {
    return !!(flags & policyFlags[flagName]);
};

/**
 * @name setFlag
 * @desc Set a flag in a given number
 * @param {number} flags - a number which is treated as a bitfield
 * @param {string} flagName - a flag name in the GLOBAL.policyFlags object
 * @returns {number} flags with the flagName bits set
 */
var setFlag = function(flags, flagName) {
    return flags |= policyFlags[flagName];
};

/**
 * @name clearFlag
 * @desc Clear a flag in a given number
 * @param {number} flags - a number which is treated as a bitfield
 * @param {string} flagName - a flag name in the GLOBAL.policyFlags object
 * @returns {number} flags with the flagName bits cleared
 */
var clearFlag = function(flags, flagName) {
    return flags &= ~policyFlags[flagName];
};

/**
 * @name toggleFlag
 * @desc Toggle the state of flag bits in a given password policy
 * @param {object} policy - a password policy object
 * @param {string} flagName - a flag name in the GLOBAL.policyFlags object
 * @returns {number} the new number/bitfield with the policies flags toggled
 */
var toggleFlag = function(policy, flagName) {
    return policy.flags ^= policyFlags[flagName];
};

/**
 * @constructor Group
 * @desc a group object used in the construction of a recordTree
 * @param {string} groupName - the name of the current group node
 * @param {string} fullGroup - a period delimited string of the groupName and all parent groups names
 * @param {number} nestingLevel - the level of this group in the recordTree
 * @returns {object} new group object with the provided details filled in
 */
var Group = function(groupName, fullGroup, nestingLevel) {
    var name = groupName || "No name";
    var level = nestingLevel;
    var expanded = false; //TODO: Maintain expanded state
    return {
        name: name,
        level: level,
        fullGroup: fullGroup,
        expanded: expanded,
        subgroups: [],
        records: []
    };
};

/**
 * @name groupIndex
 * @desc get the index of a groupName in an array
 * @param {array} arr - an array of strings
 * @param {string} groupName - the string to search for
 *
 * @return {number} the index of the groupName, or -1 if it's not found.
 */
var groupIndex = function(arr, groupName) {
    for (var i = 0, il = arr.length; i < il; i++) {
        if (arr[i].name && arr[i].name === groupName) {
            return i;
        }
    }
    return -1;
};

/**
 * @name generateRecordTree
 * @desc Generate a tree object containing the given records
 *      organised by groups/subgroups.
 * @param {array} records - an array of record objects
 * @returns {object} a recordTree object constructed from Group()s
 */
var generateRecordTree = (function(records) {
    var tree = [], currentNode;
    tree.push(new Group("", "", 0));
    tree[0].expanded = true;
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

/**
 * @name randomPassword
 * @desc Return a random string of characters using the given valid characters
 * @param {number} len - the length of the generated password
 * @param {string} validChars - a non-empty string containing the valid characters that can make up the password
 * @returns {string} the generated random password
 */
var randomPassword = function(len, validChars){
    var str = "",
        charLen = validChars.length;

    if (!validChars) return null;

    for (var i = 0; i < len; i++) {
        str += validChars.charAt(Math.floor(Math.random() * charLen));
    }
    return str;
};

/**
 * @name countOccurrences
 * @desc Count occurrences of characters from a given set in a password
 * @param {string} charset - a string containing all the characters to count
 * @param {string} pass - the string to search (a password)
 * @returns {number} the count of characters in charset that occur in pass.
 */
var countOccurrences = function(charset, pass) {
    var count = 0;
    for (var i = 0, il = pass.length; i < il; i++) {
        if (charset.indexOf(pass[i]) !== -1) {
            count++;
        }
    }
    return count;
};

/**
 * @name generatePassword
 * @desc generate a password from the given password policy,
 *      or the default policy if one is not provided/undefined.
 * @param {object} policy - a password policy
 * @param {string} symbols - a string containing the symbols to use if symbols are enabled for the password.
 * @return {string} a generated password which meets the provided policy.
 */
var generatePassword = function(policy, symbols) {

    if (policy === undefined) {
        policy = new DefaultPolicy();
    }

    if (!symbols) {
        symbols = defaultSymbols;
    }

    var validChars = "";
    var totalMinLength = 0;
    var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lowercase = "abcdefghijklmnopqrstuvwxyz";
    var digits = "0123456789";
    var hexDigits = "0123456789ABCDEF";

    if (checkFlag(policy.flags, "useHexDigits")) {
        validChars += hexDigits;
    } else {
        if (checkFlag(policy.flags, "useLowercase")) {
            validChars += lowercase;
            totalMinLength += policy.minLowercase;
        }
        if (checkFlag(policy.flags, "useUppercase")) {
            validChars += uppercase;
            totalMinLength += policy.minUppercase;  
        } 
        if (checkFlag(policy.flags, "useDigits")) {
            validChars += digits;
            totalMinLength += policy.minDigit;
        }
        if (checkFlag(policy.flags, "useSymbols")) {
            validChars += symbols;
            totalMinLength += policy.minSymbol;
        }
    }

    var pass = "";
    if (totalMinLength > policy.length || totalMinLength <= 0 ||
            validChars.length === 0) {
        alert("Password policy invalid, impossible conditions!");
        return null;
    }

    do {
        pass = randomPassword(policy.length, validChars);
    } while (countOccurrences(lowercase, pass) < policy.minLowercase ||
             countOccurrences(uppercase, pass) < policy.minUppercase ||
             countOccurrences(digits, pass) < policy.minDigit ||
             countOccurrences(symbols, pass) < policy.minSymbol);

    return pass;
};

/**
 * @name toggleNewDB
 * @desc toggle the new database modal
 */
var toggleNewDB = function(e) {
    e = e || window.event;
    e.stopPropagation();
    $("#newDBModal").modal('show');
};

document.addEventListener('dragenter', function() {
    var input = document.getElementById("fileInput");
    if (input) {
        document.body.style.backgroundColor = "#f8f8f8";
        input.style.display = "block";
    }
}, false);

document.addEventListener('dragover', function(event) {
        var clamp = function(num, min, max) {
            return Math.min(Math.max(num, min), max);
        };
        var follow = $('#follow'),
        top = clamp(event.pageY - (follow.height() / 2), 10, window.innerHeight - follow.height() - 10),
        left = clamp(event.pageX - (follow.width() / 2), 10, window.innerWidth - follow.width() - 10);
        follow.css({
            position: 'absolute', 
            display: 'block', 
            top: top,
            left: left,
        });
}, false);

/**
 * @name resetDrag
 * @desc clean up after the drag events
 */
var resetDrag = function() {
    document.body.style.backgroundColor = "white";
    $('#follow').css('display', 'none');
};

document.addEventListener('dragend', resetDrag, false);
document.addEventListener('dragleave', resetDrag, false);
document.addEventListener('drop', resetDrag, false);

$(document).ready(function() {
    $("#openFileButton").focus();
});

$(window).resize(function() {
    if ($(window).width() < 400) {
        $('#dbSelectButtons').removeClass('btn-group');
        $('#dbSelectButtons').addClass('btn-group-vertical');
    } else {
        $('#dbSelectButtons').addClass('btn-group');
        $('#dbSelectButtons').removeClass('btn-group-vertical');
    }
});


/**
 * @namespace WindowMenu
 * @desc System Window Menu
 */
var windowMenu = (function($scope) {
    var menu, gui, win,
    debug = false,

    /**
     * @name clearMenu
     * @desc remove all menu items from the window menu
     * @memberOf WindowMenu
     */
    clearMenu = function() {
        while (menu.items.length) {
            menu.removeAt(0);
        }
    },

    /**
     * @name setState
     * @desc load one of the configured states for the menubar
     * @param {string} state - a state name from "loaded", "unlocked" and "unloaded"
     * @memberOf WindowMenu
     */
    setState = function(state) {
        if (!isNW) return;
		
		if (process.platform === "darwin") {
			menu.removeAt(1);
		} else {
            clearMenu();
        }
		
		var submenu;
        switch(state) {
            case "loaded":
				submenu = (function() {
					var submenu = new gui.Menu();
					submenu.append(new gui.MenuItem({
						label: "Open Database",
						click: function() {
                            $('.openCancelButton').click();
							$('#fileInput').click();
						}
					}));
					
					submenu.append(new gui.MenuItem({
						label: "Close Database",
						click: function() {
							$('.openCancelButton').click();
						}
					}));

					if (debug) {
						submenu.append(new gui.MenuItem({ type: 'separator' }));
						submenu.append(new gui.MenuItem({
							label: "Dev Tools",
							click: function() {
								win.showDevTools();
							}
						}));
					}

					submenu.append(new gui.MenuItem({ type: 'separator' }));
					submenu.append(new gui.MenuItem({
						label: "Exit",
						click: function() {
							win.close();
						}
					}));
					return submenu;
				}());
                break;
            case "unlocked":
                submenu = (function() {
					var submenu = new gui.Menu();
					submenu.append(new gui.MenuItem({
						label: "Lock Database",
						click: function() {
                            $('#lockButton').click();
						}
					}));
					submenu.append(new gui.MenuItem({
						label: "Close Database",
						click: function() {
                            $('#lockButton').click();
                            $('.openCancelButton').click();
						}
					}));
					submenu.append(new gui.MenuItem({ type: 'separator' }));
					submenu.append(new gui.MenuItem({
						label: "Database Settings",
						click: function() {
							$('#settingsModal').modal('show');
						}
					}));

					if (debug) {
						submenu.append(new gui.MenuItem({
							label: "Dev Tools",
							click: function() {
								win.showDevTools();
							}
						}));
					}

					submenu.append(new gui.MenuItem({ type: 'separator' }));
					submenu.append(new gui.MenuItem({
						label: "Exit",
						click: function() {
							win.close();
						}
					}));
					return submenu;
				}());
                break;
            default:
				submenu = (function() {
					var submenu = new gui.Menu();
					submenu.append(new gui.MenuItem({
						label: "Open Database",
						click: function() {
							$('#fileInput').click();
						}
					}));
					submenu.append(new gui.MenuItem({
						label: "New Database",
						click: function() {
							$('#newDBModal').modal('show');
						}
					}));

					if (debug) {
						submenu.append(new gui.MenuItem({ type: 'separator' }));
						submenu.append(new gui.MenuItem({
							label: "Dev Tools",
							click: function() {
								win.showDevTools();
							}
						}));
					}
					submenu.append(new gui.MenuItem({ type: 'separator' }));
					submenu.append(new gui.MenuItem({
						label: "Exit",
						click: function() {
							win.close();
						}
					}));
					return submenu;
				}());
                break;
        }
		
		if (process.platform === "darwin") {
			menu.insert(new gui.MenuItem({ 
				label: "File",
				submenu: submenu
			}), 1);
		} else {
			menu.append(new gui.MenuItem({ 
				label: "File",
				submenu: submenu
			}));
		}
    },
    
    /**
     * @name init
     * @desc Create the initial menubar object and link it to the window. Called on load.
     * @memberOf WindowMenu
     */
    init = function() {
        if (!isNW) return;

        gui = require('nw.gui');
        win = gui.Window.get();

        menu = new gui.Menu({ type: 'menubar' });

		if (process.platform === "darwin") {
            menu.createMacBuiltin("Primate");
			menu.insert(new gui.MenuItem({ label: "File" }), 1);
        }
		
		gui.Window.get().menu = menu;
		
        setState("unloaded");
    }();

    return {
        setState: setState
    };
}());
