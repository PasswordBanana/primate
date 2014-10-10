/**
 * AngularJS Controllers for DECO3801 Project
 *
**/

/*
 * StateController handles all the primary application controls
 * including the application state (unloaded, loaded, unlocked)
 */
primate.controller("StateController", ["$scope", "Database", "$http", function($scope, db, $http) {
    var databaseFile, recordFuse,
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
    $scope.state = "unloaded"; //State of the main database ["unloaded", "loaded", "unlocked"]
    $scope.databaseFilename;
    $scope.records; //Array of all records in the database
    $scope.headers; //Object containing the database headers
    $scope.recordTree; //$scope.records organised in a tree, nested by groups
    $scope.viewing = false; //Is the edit modal visible
    $scope.pass; //Master password field contents
    $scope.filePicker; //File input object
    $scope.currentFlags = {
        useLowercase: false,
        useUppercase: false,
        useDigits: false,
        useSymbols: false
    };
    $scope.defaultPolicy = defaultPolicy;
    $scope.defaultSymbols = defaultSymbols;

    $scope.alerts = {
        invalidPassword: false,
        notSaved: false,
        autoLocked: false
    };

    /*
     * Return the index for the record with the given UUID
     * If it doesn't exist, return -1
     */
    var getRecordIndex = function(uuid) {
        for (var i = 0, il = $scope.records.length; i < il; i++) {
            if ($scope.records[i].uuid === uuid) {
                return i;
            }
        }
        return -1;
    };

    /*
     * Return the record with the given UUID
     */
    var getRecord = function(uuid) {
        var idx = getRecordIndex(uuid);
        return (idx > -1) ? $scope.records[idx] : null;
    };

    /*
     * Handle file input object in open screen changing state
     */
    $scope.fileChanged = function(picker) {
        $scope.filePicker = picker;
        db.setFile($scope.filePicker.files[0]);
        $scope.databaseFilename = $scope.filePicker.files[0].name;

        $scope.setState("loaded");
        $scope.$apply();

        document.getElementById("passwordField").focus();
    };

    /*
     * Open the database file
     */
    $scope.open = function() {
        var promise = db.unlock($scope.pass);

        promise.then(function(success) {
            $scope.setRecords(db.getDb());
            $scope.setState("unlocked");
        }, function(failure) {
            $scope.alerts.invalidPassword = true;
        });

        $scope.pass = "";
        $scope.resetAlerts();
    };

    $scope.resetAlerts = function() {
        for (var i in $scope.alerts) {
            if ($scope.alerts.hasOwnProperty(i)) {
                $scope.alerts[i] = false;
            }
        }
    };

    $scope.setState = function(state) {
        $scope.state = state;
    };

    /*
     * Create and open a new database with the given master password
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
            $scope.open();
            db.setPass(master);
        }).
        error(function(data, status, headers, config) {
            throw new Error("Failed to create new database. Could not access file empty.psafe3");
        }); 
    };

    /*
     * Update the Records tree view
     */
    var updateRecordTree = function(recordList) {
        $scope.recordTree = generateRecordTree.call(this, (recordList || $scope.records));
    };

    /*
     * Update records with current list from the database
     * and re-generate recordTree.
     */
    $scope.setRecords = function(db) {
        $scope.records = db.records;
        $scope.headers = db.headers;
        updateRecordTree();

        recordFuse = new Fuse(db.records, searchOptions);
    };

    var clearVars = function() {
        $scope.records = undefined;
        $scope.recordTree = undefined;
        $scope.headers = undefined;
    };

    /*
     * Lock the database and clear variables
     */
    $scope.lockDb = function() {
        db.lock();
        clearVars();
        $scope.setState("loaded");
    };

    /*
     * Pass through a save call to the Database factory
     */
    $scope.saveDb = function() {
        db.save();
    };

    /*
     * Close the database and clear inputs, resetting whole application state
     */
    $scope.closeDb = function() {
        db.close();
        clearVars();
        if ($scope.filePicker)
            $scope.filePicker.value = "";
        $scope.setState("unloaded");
    };

    /*
     * Open a new window with the URL set in a record with the given UUID
     */
    $scope.gotoUrl = function(uuid) {
        var url = getRecord(uuid).URL;
        if (url != null) {
            window.open(url, '_blank').focus();
        }
    };

    /*
     * Enable a custom password policy for the given record
     * Overrides the default policy for the database
     */
    $scope.enableCustomPolicy = function(record) {
        record.passphrasePolicy = new DefaultPolicy();
        record.ownPassphraseSymbols = "";
    };

    /*
     * Add a new record to the given group
     */
    $scope.addRecord = function(group) {
        /*
         * RFC4122 Compliant UUID generator
         * Created by user 'broofa' on StackOverflow
         * http://stackoverflow.com/a/2117523
         * Removed dashes as libpwsafejs/Password Gorilla don't support them (invalid implementation?)
         */
        var group = group,
            uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
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
        //TODO: update this to use promises rather than timeout
        setTimeout(function() {
            var newRecordElement = document.querySelector("[data-record-modal-uuid='" + newRecord.uuid + "']");
            var newRecordScope = angular.element(newRecordElement).scope();
            newRecordScope.$apply();
            $("*[data-record-modal-uuid=" + newRecord.uuid + "]").modal('show');
        }, 200);
    };

    /*
     * Delete a record from the database
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

    /*
     * Add a group to the tree view.
     */
    $scope.addGroup = function(group) {
        var name = window.prompt("Group Name:");
        if (group == null) {
            this.recordTree[0].subgroups.push(new Group(name, name, 1));
        } else {
            group.subgroups.push(new Group(name, group.fullGroup + "." + name, group.level + 1));
        }
    };

    /*
     * Get a reference to the given group in the recordTree
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

    /*
     * Generate a password for a given record
     */
    $scope.genPw = function(record) {
        record.password = generatePassword(record.passphrasePolicy);
    };

    /*
     * Toggle policy flags for a given record
     */
    $scope.toggleRecordFlag = function(record, flagName) {
        if (checkFlag(record.passphrasePolicy.flags, flagName)) {
            record.passphrasePolicy.flags = clearFlag(record.passphrasePolicy.flags, flagName);
        } else {
            record.passphrasePolicy.flags = setFlag(record.passphrasePolicy.flags, flagName);
        }
    };

    /*
     * Maintain the state of the flag checkbox models
     */
    $scope.toggleFlag = toggleFlag;
    $scope.checkFlag = checkFlag;

    /*
     * Pass new password through to the database factory
     */
    $scope.changeMasterPassword = function(oldPass, givenPass) {
        return db.setPass(oldPass, givenPass);
    };

    /*
     * Remove the passphrase policy from the given record
     */
    $scope.removePolicy = function(record) {
        record.passphrasePolicy = undefined;
    };

    var idleTimer;
    var idleTimeout = function() {
        if ($scope.state === "unlocked") {
            $scope.alerts.autoLocked = true;
            $scope.lockDb();
            $scope.$apply();
        }
    };

    document.addEventListener('blur', function() {
        idleTimer = setTimeout(idleTimeout, 30000);
    });

    document.addEventListener('focus', function() {
        clearTimeout(idleTimer);
    });
	
	$scope.copyToClipboard = function(text) {
		if (isNW) {
			var gui = require('nw.gui');
			gui.Clipboard.get().set(text, 'text');	
		}
	};

    /*
     * Perform a fuzzy search on the list of records and show the results
     */
    $scope.search = function(val) {
        if (val) {
            var res = recordFuse.search(val);
            updateRecordTree(res);
        } else {
            updateRecordTree();
        }
    };

    $scope.auditValue = function(record) {
        var score = 0;
        score += record.passphraseModifyTime.getSeconds();
        score *= zxcvbn(record.password).score;
        return score;
    };
}]);
