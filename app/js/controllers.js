primate.controller("StateController", ["$scope", "Database", function($scope, db) {
	$scope.state = "unloaded"; //State of the main database
	$scope.databaseFile;
	$scope.databaseFilename;
	$scope.records;
	$scope.currentRecord;
	$scope.viewing = false;
	$scope.invalidFile = false;
	$scope.pass;
	$scope.filePicker;

	var getRecord = function(uuid) {
		for (var i = 0, il = $scope.records.length; i < il; i++) {
			if ($scope.records[i].uuid === uuid) {
				return $scope.records[i];
			}
		}
	};

	$scope.fileChanged = function(newFile) {
		$scope.filePicker = newFile;
		$scope.databaseFile = newFile.files[0];
		$scope.databaseFilename = $scope.databaseFile.name;
		$scope.setState("loaded");
		$scope.$apply();

		document.getElementById("passwordField").focus();
	};

	$scope.open = function() {
		var promise = db.setFile($scope.databaseFile, $scope.pass);

		promise.then(function(success) {
			$scope.setRecords(db.getDb().records);
			$scope.setState("unlocked");
		}, function(failure) {
			$scope.invalidFile = true;
		});

		$scope.pass = "";
	};

	$scope.setState = function(state) {
		$scope.state = state;
	};

	$scope.setRecords = function(records) {
		$scope.records = records;
		$scope.currentRecord = $scope.records[0];
	};

	$scope.lockDb = function() {
		db.close();
		$scope.records = undefined;
		$scope.setState("loaded");
	};

	$scope.saveDb = function() {
		db.save();
	};

	$scope.closeDb = function() {
		$scope.lockDb();
		$scope.filePicker.value = "";
		$scope.setState("unloaded");
	};

	$scope.viewRecord = function(uuid) {
		for (var i = 0, il = $scope.records.length; i < il; i++) {
			if ($scope.records[i].uuid === uuid) {
				$scope.currentRecord = $scope.records[i];
				$scope.viewing = true;
			}
		}
	};

	$scope.closeView = function() {
		$scope.currentRecord = undefined;
		$scope.viewing = false;
	};

	$scope.gotoUrl = function(uuid) {
		var r = getRecord(uuid);
		var url = r.URL;
		if (url != null) {
			window.open(url, '_blank').focus();
  		}
	};
	
}]);