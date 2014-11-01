/**
 * @namespace Controllers
 * @desc AngularJS Controllers for DECO3801 Project
 *
**/

/**
 * @name StateCtrl
 * @desc StateCtrl handles all the primary application controls
 *      including the application state (unloaded, loaded, unlocked)
 *
 * @memberOf Controllers
 * @namespace StateCtrl
 */
primate.controller("StateCtrl", ["$scope", "Database", "$http", "$q", "Alerts", "FileState", function($scope, db, $http, $q, Alerts, FileState, $tooltip) {
    var databaseFile, recordFuse, idleTimer,
        searchOptions = {
            caseSensitive: false,
            includeScore: false,
            shouldSort: false,
            threshold: 0.4,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            keys: ['title', 'username', 'notes']
        };
    $scope.state = FileState.state; //State of the main database ["unloaded", "loaded", "unlocked"]
    $scope.auditMode = false;
    $scope.searchMode = false;
    $scope.databaseFilename = undefined;
    $scope.records = undefined; //Array of all records in the database
    $scope.headers = undefined; //Object containing the database headers
    $scope.recordTree = undefined; //$scope.records organised in a tree, nested by groups
    $scope.viewing = false; //Is the edit modal visible
    $scope.pass = undefined; //Master password field contents
    $scope.filePicker = undefined; //File input object
    $scope.currentFlags = {
        useLowercase: false,
        useUppercase: false,
        useDigits: false,
        useSymbols: false
    };
    $scope.defaultPolicy = defaultPolicy;
    $scope.defaultSymbols = defaultSymbols;

    $scope.alerts = Alerts.alerts;
    $scope.searchRecords = null;

    /**
     * getRecordIndex
     * @desc Get the index in the $scope.records array
     *      for the record with the given UUID.
     *
     * @param {string} uuid - the valid UUID of a record
     * @returns {number} index of the record with the given UUID.
     * If it doesn't exist, -1.
     * @memberOf Controllers.StateCtrl
     */
    var getRecordIndex = function(uuid) {
        for (var i = 0, il = $scope.records.length; i < il; i++) {
            if ($scope.records[i].uuid === uuid) {
                return i;
            }
        }
        return -1;
    };

    /**
     * getRecord
     * @desc Get the record with the given UUID.
     * 
     * @param {string} uuid - the valid UUID of a record
     * @returns {object | null} record object from the $scope.records array.
     *      If the UUID doesn't exist, null.
     * @memberOf Controllers.StateCtrl
     */
    var getRecord = function(uuid) {
        var idx = getRecordIndex(uuid);
        return (idx > -1) ? $scope.records[idx] : null;
    };

    /**
     * $scope.fileChanged
     * @desc Handle file input object in open screen changing state
     * @param {element} picker - file picker object to take database file from
     * @memberOf Controllers.StateCtrl
     */
    $scope.fileChanged = function(picker) {
        $scope.filePicker = picker;
        db.setFile($scope.filePicker.files[0]);
        $scope.databaseFilename = $scope.filePicker.files[0].name;

        $scope.setState("loaded");
        $scope.$apply();

        document.getElementById("passwordField").focus();
    };

    /**
     * $scope.open
     * @desc Open the database file
     * @memberOf Controllers.StateCtrl
     */
    $scope.open = function() {
        var deferred = $q.defer();
        var promise = db.unlock($scope.pass);

        promise.then(function(success) {
            $scope.setRecords(db.getDb());
            $scope.setState("unlocked");
            deferred.resolve(true);
        }, function(failure) {
            Alerts.set("invalidPassword");
            deferred.reject();
        });

        $scope.pass = "";
        Alerts.reset();
        return deferred.promise;
    };

    /**
     * $scope.setState
     * @desc Set the state of the application
     * @param {string} state - one of either "unloaded", "loaded" or "unlocked"
     * @memberOf Controllers.StateCtrl
     */
    $scope.setState = function(state) {
        $scope.state = state;
		windowMenu.setState(state);
    };

    /**
     * $scope.newDb
     * @desc Create and open a new database with the given master password
     * @param {string} master - master password
     * @param {string} filename - filename of the new database file
     * @memberOf Controllers.StateCtrl
     */
    $scope.newDb = function(master, filename) {
        $http({
            method: 'GET', 
            url: 'empty.psafe3',
            responseType: 'arraybuffer'
        }).
        success(function(data, status, headers, config) {
            db.setFile(new Blob([new Uint8Array(data)], {type: "application/octet-stream"}));
            db.setName(filename);
            $scope.databaseFilename = filename;
            $scope.pass = "";
            $scope.open().then(function(success) {
                db.setPass("", master);
            });
        }).
        error(function(data, status, headers, config) {
            throw new Error("Failed to create new database. Could not access file empty.psafe3");
        }); 
    };

    /**
     * updateRecordTree
     * @desc Update the $scope.recordTree records tree view
     * @param {array} recordList - an array of record objects
     * @memberOf Controllers.StateCtrl
     */
    var updateRecordTree = function(recordList) {
        $scope.recordTree = generateRecordTree.call(this, (recordList || $scope.records));
    };

    /**
     * $scope.setRecords
     * @desc Update records array with current list from the database
     *      and re-generate recordTree.
     * @param {object} db - PWSafeDB database object
     * @memberOf Controllers.StateCtrl
     */
    $scope.setRecords = function(db) {
        $scope.records = db.records;
        $scope.headers = db.headers;
        updateRecordTree();

        recordFuse = new Fuse(db.records, searchOptions);
    };

    /**
     * clearVars
     * @desc reset the shared controller variables back to their initial state
     * @memberOf Controllers.StateCtrl
     */
    var clearVars = function() {
        $scope.records = undefined;
        $scope.recordTree = undefined;
        $scope.headers = undefined;
        $scope.auditMode = false;
        $scope.recordFuse = undefined;
    };

    /**
     * $scope.lockDb
     * @desc Lock the database and reset controller variables
     * @memberOf Controllers.StateCtrl
     */
    $scope.lockDb = function() {
        db.lock();
        clearVars();
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        $scope.setState("loaded");
    };

    /**
     * $scope.saveDb
     * @desc Pass through a save call to the Database factory
     * @memberOf Controllers.StateCtrl
     */
    $scope.saveDb = function() {
        db.save();
        Alerts.clear("notSaved");
    };

    /**
     * $scope.closeDb
     * @desc Close the database and clear inputs, resetting whole application state
     * @memberOf Controllers.StateCtrl
     */
    $scope.closeDb = function() {
        db.reset();
        clearVars();
        if ($scope.filePicker)
            $scope.filePicker.value = "";
        $scope.setState("unloaded");
    };

    /**
     * $scope.gotoUrl
     * @desc Open a new window with the URL set in a record with the given UUID
     * @param {string} uuid - a valid record UUID
     * @memberOf Controllers.StateCtrl
     */
    $scope.gotoUrl = function(uuid) {
        var url = getRecord(uuid).URL;
        if (!url) return;
        if (isNW) {
            var gui = require('nw.gui');
            gui.Shell.openExternal(url);
        } else {
            window.open(url, '_blank').focus();
        }
    };

    /**
     * $scope.enableCustomPolicy
     * @desc Enable a custom password policy for the given record,
     *      overriding the default policy for the database.
     * @param {object} record - a valid record object
     * @memberOf Controllers.StateCtrl
     */
    $scope.enableCustomPolicy = function(record) {
        record.passphrasePolicy = new DefaultPolicy();
        record.ownPassphraseSymbols = "";
    };

    /**
     * $scope.addRecord
     * @desc Add a new record to the given group
     * @param {object} group - a group object in the $scope.recordTree tree.
     * @memberOf Controllers.StateCtrl
     */
    $scope.addRecord = function(group) {
        /*
         * RFC4122 Compliant UUID generator
         * Created by user 'broofa' on StackOverflow
         * http://stackoverflow.com/a/2117523
         * Removed dashes as libpwsafejs/Password Gorilla don't support them (invalid implementation?)
         */
        var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });

        var Record = function() {
            return {
                uuid: uuid,
                group: group,
                title: "",
                password: "",
                username: "",
                passphraseModifyTime: new Date(),
                modifyTime: new Date()
            };
        };
        var newRecord = new Record();
        $scope.records.push(newRecord);
        updateRecordTree();
        
        //Expand the group so the modal exists
        getGroup(newRecord.group).expanded = true;

        //Show the edit modal for the new record
        setTimeout(function() {
            var newRecordElement = document.querySelector("[data-record-modal-uuid='" + newRecord.uuid + "']");
            var newRecordScope = angular.element(newRecordElement).scope();
            newRecordScope.$apply();
            $("*[data-record-modal-uuid=" + newRecord.uuid + "]").modal('show');
        }, 200);
    };

    /**
     * $scope.deleteRecord
     * @desc Delete a record from the database.
     * @param {string} uuid - a valid record UUID
     * @memberOf Controllers.StateCtrl
     */
    $scope.deleteRecord = function(uuid) {
        if (window.confirm("Are you sure you want to delete this record?")) {
            var idx = getRecordIndex(uuid);
            if (idx > -1) {
                $scope.records.splice(idx, 1);
                updateRecordTree();
            }

            $('body').removeClass('modal-open'); 
            $('.modal-backdrop').remove(); 
        }
    };

    /**
     * $scope.addGroup
     * @desc Add a group to the $scope.recordTree tree view.
     * @param {object} group - a group in the $scope.recordTree tree.
     * @memberOf Controllers.StateCtrl
     */
    $scope.addGroup = function(group) {
        var name = window.prompt("Group Name:");
        if (!group) {
            this.recordTree[0].subgroups.push(new Group(name, name, 1));
        } else {
            group.subgroups.push(new Group(name, group.fullGroup + "." + name, group.level + 1));
        }
    };

    /**
     * getGroup
     * @desc Get a reference to the given group in $scope.recordTree.
     * @param {string} fullGroup - '.' delimited string which represents
     *      a full group branch structure in the $scope.recordTree.
     * @returns {object} A group object which is the leaf node for the branch represented by the given group string.
     * @memberOf Controllers.StateCtrl
     */
    var getGroup = function(fullGroup) {

        if (fullGroup === "") {
            return $scope.recordTree[0];
        }

        var groupArray = fullGroup.split(".");
        var currentNode = $scope.recordTree[0];

        for (var g = 0, gl = groupArray.length; g < gl; g++) {
            var idx = groupIndex(currentNode.subgroups, groupArray[g]);

            if (idx >= 0) {
                currentNode = currentNode.subgroups[idx];
            } else {
                return null;
            }
        }
        return currentNode;
    };

    /**
     * $scope.genPw
     * @desc Generate a password for a given record
     * @param {object} record - a valid record object in the $scope.records array
     * @memberOf Controllers.StateCtrl
     */
    $scope.genPw = function(record) {
        var newPw = generatePassword(record.passphrasePolicy, record.ownPassphraseSymbols);
        if (newPw) {
            record.password = newPw;
            updateStrengthMeter(record);
        }
    };

    /**
     * $scope.toggleRecordFlag
     * @desc Toggle policy flags for a given record.
     * @param {object} record - a valid record object in the $scope.records array
     * @param {string} flagName - a flagName from the policyFlags object
     * @memberof Controllers.StateCtrl
     */
    $scope.toggleRecordFlag = function(record, flagName) {
        if (checkFlag(record.passphrasePolicy.flags, flagName)) {
            record.passphrasePolicy.flags = clearFlag(record.passphrasePolicy.flags, flagName);
        } else {
            record.passphrasePolicy.flags = setFlag(record.passphrasePolicy.flags, flagName);
        }
    };

    /**
     * $scope.toggleFlag
     * @see Global.toggleFlag()
     * @memberOf Controllers.StateCtrl
     */
    $scope.toggleFlag = toggleFlag;
    
    /**
     * $scope.checkFlag
     * @see Global.checkFlag()
     * @memberOf Controllers.StateCtrl
     */
    $scope.checkFlag = checkFlag;

    /**
     * $scope.changeMasterPassword
     * @desc Pass new password through to the database factory.
     * @param {string} oldPass - the current master password
     * @param {string} givenPass - the intended new master password
     * @return {bool}
     * @memberOf Controllers.StateCtrl
     */
    $scope.changeMasterPassword = function(oldPass, givenPass) {
        return db.setPass(oldPass, givenPass);
    };

    /**
     * $scope.removePolicy
     * @desc Remove the passphrase policy from the given record.
     * @param {object} record - a valid record object in the $scope.records array.
     * @memberOf Controllers.StateCtrl
     */
    $scope.removePolicy = function(record) {
        record.passphrasePolicy = undefined;
    };

    /**
     * idleTimeout
     * @desc triggered when the user is considered to be idle
     * @memberOf Controllers.StateCtrl
     */
    var idleTimeout = function() {
        if ($scope.state === "unlocked") {
            Alerts.set("autoLocked");
            $scope.lockDb();
            $scope.$apply();
        }
    };

    document.addEventListener('blur', function() {
        idleTimer = setTimeout(idleTimeout, 300000); //300,000 = 5 minutes
    });

    document.addEventListener('focus', function() {
        clearTimeout(idleTimer);
    });
	
    /**
     * $scope.copyToClipboard
     * @desc copy the given text to the system clipboard.
     *      Only functions under Node-webkit.
     * @param {string} text - the text to copy
     * @memberOf Controllers.StateCtrl
     */
	$scope.copyToClipboard = function(text) {
		if (isNW) {
			var gui = require('nw.gui');
			gui.Clipboard.get().set(text, 'text');	
		}
	};

    /**
     * $scope.search
     * @desc Perform a fuzzy search on the list of records and show the results in the search view.
     * @param {string} val - the text to search for
     * @memberOf Controllers.StateCtrl
     */
    $scope.search = function(val) {
        if (val) {
            $scope.searchRecords = recordFuse.search(val);
            $scope.searchMode = true;
        } else {
            $scope.searchMode = false;
            $scope.searchRecords = null;
        }
    };

    /**
     * $scope.auditValue
     * @desc get the determined audit value of a given record
     * @param {object} record - a valid record object in the $scope.records array.
     * @returns {number} an arbitrary audit value for comparing with other records.
     * @memberOf Controllers.StateCtrl
     */
    $scope.auditValue = function(record) {
        var score = 0;
        score += record.passphraseModifyTime.getSeconds();
        score *= zxcvbn(record.password).score;
        return score;
    };

    /**
     * getStrengthMeter
     * @desc get the HTML markup for a strength meter display with the given strength value.
     * @param {number} strength - integer from 0 to 4
     * @returns {string} HTML markup for a strength meter display
     * @memberOf Controllers.StateCtrl
     */
    var getStrengthMeter = function(strength) {
        return ['<div class="strengthMeterWrapper">',
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
    };

    /**
     * updateStrengthMeter
     * @desc update a strength meter associated with the given record
     * @param {object} record - a valid record in the $scope.records array.
     * @memberOf Controllers.StateCtrl
     */
    var updateStrengthMeter = function(record) {
        var strength = zxcvbn(record.password).score;
        var html = getStrengthMeter(strength);
        $("[data-record-meter-uuid=" + record.uuid + "]").each(function() {
            $(this).html(html);
        });
    };

    /**
     * $scope.updateNewDBStrengthMeter
     * @desc update the new master password strength meter on 
     *      the new database modal.
     *
     * @param {string} p - the new master password
     * @memberOf Controllers.StateCtrl
     */
    $scope.updateNewDBStrengthMeter = function(p) {
        p = p || '';
        var strength = zxcvbn(p).score;
        $("#newDBModal strength-meter").html(getStrengthMeter(strength));
    };

    /**
     * $scope.updateNewMasterStrengthMeter
     * @desc update the new master password strength meter on
     *      the new master password settings modal tab.
     *
     * @param {string} p - the new master password
     * @memberOf Controllers.StateCtrl 
     */
    $scope.updateNewMasterStrengthMeter = function(p) {
        p = p || '';
        var strength = zxcvbn(p).score;
        $("#masterPasswordTab strength-meter").html(getStrengthMeter(strength));
    };

    /**
     * $scope.changed
     * @desc Called when any part of the database has been changed
     * @param {object} record - an associated record if it was a record that was updated
     * @memberOf Controllers.StateCtrl
     */
    $scope.changed = function(record) {
        Alerts.set("notSaved");

        if (record) {
            record.passphraseModifyTime = new Date();
            updateStrengthMeter(record);
        }
    };

    /**
     * $scope.startAudit
     * @desc enable Audit mode
     * @memberOf Controllers.StateCtrl
     */
    $scope.startAudit = function() {
        $scope.auditMode = true;
    };

    /**
     * $scope.stopAudit
     * @desc disable Audit mode
     * @memberOf Controllers.StateCtrl
     */
    $scope.stopAudit = function() {
        $scope.auditMode = false;
    };
}]);
