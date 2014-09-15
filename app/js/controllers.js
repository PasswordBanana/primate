/**
 * AngularJS Controllers for DECO3801 Project
 *
**/

/*
 * StateController handles all the primary application controls
 * including the application state (unloaded, loaded, unlocked)
 */
primate.controller("StateController", ["$scope", "Database", function($scope, db) {
	var databaseFile;
	$scope.state = "unloaded"; //State of the main database ["unloaded", "loaded", "unlocked"]
	$scope.databaseFilename;
	$scope.records; //Array of all records in the database
	$scope.headers; //Object containing the database headers
	$scope.recordTree; //$scope.records organised in a tree, nested by groups
	$scope.viewing = false; //Is the edit modal visible
	$scope.invalidFile = false; //Should the invalid file message be displayed
	$scope.pass; //Master password field contents
	$scope.filePicker; //File input object

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
		return (idx > -1) ? idx : null;
	};

	/*
	 * Handle file input object in open screen changing state
	 */
	$scope.fileChanged = function(newFile) {
		$scope.filePicker = newFile;
		databaseFile = newFile.files[0];
		$scope.databaseFilename = databaseFile.name;
		$scope.setState("loaded");
		$scope.$apply();

		document.getElementById("passwordField").focus();
	};

	/*
	 * Open the database file
	 */
	$scope.open = function() {
		var promise = db.setFile(databaseFile, $scope.pass);

		promise.then(function(success) {
			$scope.setRecords(db.getDb());
			$scope.setState("unlocked");
		}, function(failure) {
			$scope.invalidFile = true;
		});

		$scope.pass = "";
	};

	$scope.setState = function(state) {
		$scope.state = state;
	};

	/*
	 * Update the Records tree view
	 */
	var updateRecordTree = function() {
		$scope.recordTree = generateRecordTree.call(this, $scope.records);
	};

	/*
	 * Update records with current list from the database
	 * and re-generate recordTree.
	 */
	$scope.setRecords = function(db) {
		$scope.records = db.records;
		$scope.headers = db.headers;
		updateRecordTree();
	};

	/*
	 * Lock the database and clear variables
	 */
	$scope.lockDb = function() {
		db.close();
		$scope.records = undefined;
		$scope.recordTree = undefined;
		$scope.headers = undefined;
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
		$scope.lockDb();
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
	 * Enable a custom password policy for the record with the given UUID
	 * Overrides the default policy for the database
	 */
	$scope.enableCustomPolicy = function(uuid) {
		var r = getRecord(uuid);
		r.passphrasePolicy = {
			flags: "",
			length: 12,
			minLowercase: 0,
			minUppercase: 0,
			minDigit: 0,
			minSymbol: 0
		};

		r.ownPassphraseSymbols = "";
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

		//Show the edit modal for the new record
		//TODO: update this to use promises rather than timeout
		setTimeout(function() {
			var newRecordElement = document.querySelector("[data-record-uuid='" + newRecord.uuid + "']");
			var newRecordScope = angular.element(newRecordElement).scope();
			newRecordScope.recordShown = true;
			newRecordScope.$apply();
		}, 200);
	};

	$scope.deleteRecord = function(uuid) {
		if (window.confirm("Are you sure you want to delete this record?")) {
			var idx = getRecordIndex(uuid);
			if (idx > -1) {
				$scope.records.splice(idx, 1);
				updateRecordTree();
			}
		}
	};
}]);