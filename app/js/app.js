var isNW;

try {
    isNW = (typeof require('nw.gui') !== "undefined");
} catch(e) {
    isNW = false;
}


var primate = angular.module("primate", ['ngAnimate']);

primate.directive('strengthMeter', function() {
    return {
        restrict: 'E',
        scope: {
            value: '='
        },
        link: function(scope, element, attrs) {
            var strength = zxcvbn(scope.value).score;

            var temp = ['<div class="strengthMeterWrapper">',
                '<div class="',
                    (strength < 1) ? 'strengthMeterBox' : 'strengthMeterBox1',
                    '"></div>',
                '<div class="',
                    (strength < 2) ? 'strengthMeterBox' : 'strengthMeterBox2',
                    '"></div>',
                '<div class="',
                    (strength < 3) ? 'strengthMeterBox' : 'strengthMeterBox3',
                    '"></div>',
                '<div class="',
                    (strength < 4) ? 'strengthMeterBox' : 'strengthMeterBox4',
                    '"></div>',
            '</div>'].join('');
            element.context.innerHTML = temp;
        }
    };
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

var checkFlag = function(flags, flagName) {
    return !!(flags & policyFlags[flagName]);
};

var setFlag = function(flags, flagName) {
    return flags |= policyFlags[flagName];
};

var clearFlag = function(flags, flagName) {
    return flags &= ~policyFlags[flagName];
};

var toggleFlag = function(policy, flagName) {
    return policy.flags ^= policyFlags[flagName];
};

var Group = function(groupName, fullGroup, nestingLevel) {
    var name = groupName || "No name";
    var level = nestingLevel;
    var fullGroup = fullGroup;
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

var groupIndex = function(arr, groupName) {
    for (var i = 0, il = arr.length; i < il; i++) {
        if (arr[i].name && arr[i].name === groupName) {
            return i;
        }
    }
    return -1;
};

/*
 * Generate a tree object containing the records
 * Organised by groups/subgroups
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

/*
 * Return a random string of characters in validChars of length len
 */
var randomPassword = function(len, validChars){
    var str = "",
        charLen = validChars.length;

    if (validChars == null) return null;

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
var generatePassword = function(policy, symbols) {

    if (policy === undefined) {
        policy = new DefaultPolicy();
    }

    if (symbols == "") {
        symbols = defaultSymbols;
    }

    var validChars = "";
    var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lowercase = "abcdefghijklmnopqrstuvwxyz";
    var digits = "0123456789";
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

    if (policy.minLowercase + policy.minUppercase + policy.minDigit + policy.minSymbol > policy.length ||
        policy.minLowercase + policy.minUppercase + policy.minDigit + policy.minSymbol <= 0 ||
        validChars.length == 0) {
        alert("Password policy invalid, impossible conditions!");
        return null;
    }

    do {
        pass = randomPassword(policy.length, validChars);
    } while (countOccurrences(lowercase, pass) < policy.minLowercase &&
             countOccurrences(uppercase, pass) < policy.minUppercase &&
             countOccurrences(digits, pass) < policy.minDigit &&
             countOccurrences(symbols, pass) < policy.minSymbol);

    return pass;
};

/*
 * Toggle the new database modal
 */
var toggleNewDB = function(e) {
    var e = e || window.event;
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

/*
 * System Window Menu
 */

var windowMenu = (function($scope) {
    var menu, gui, win,
    debug = false,

    /*
     * Remove all menu items from the window menu
     */
    clearMenu = function() {
        while (menu.items.length) {
            menu.removeAt(0);
        }
    },

    /*
     * Load one of the configured states for the menubar
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
            case "unloaded":
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
    
    /*
     * Create the initial menubar object and link it to the window
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
