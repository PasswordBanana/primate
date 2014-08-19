primate.controller("FilePicker", ["$scope", "Database", function($scope, db) {
	$scope.invalidFile = false;

	$scope.open = function() {
		var f = document.getElementById("fileInput").files[0];

		var promise = db.setFile(f, $scope.pass);

		promise.then(function(success) {
			$scope.$parent.setRecords(db.getDb().records);
			$scope.$parent.setState("loaded");
		}, function(failure) {
			$scope.invalidFile = true;
		});
	};
}]);

primate.controller("StateController", ["$scope", "Database", function($scope, db) {
	$scope.state = "unloaded"; //State of the main database
	$scope.records;
	$scope.currentRecord;
	$scope.viewing = false;

	$scope.setState = function(state) {
		$scope.state = state;
	};

	$scope.setRecords = function(records) {
		$scope.records = records;
		$scope.currentRecord = $scope.records[0];
	};

	$scope.closeDb = function() {
		db.close();
		$scope.records = undefined;
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
}]);

primate.controller("LibraryTestController", ["$scope", function($scope) {
	$scope.records;
	
	var loadDb = function(pdb) {
		if (pdb instanceof Error) {
			console.log("Error, couldn't load password database");
			return;
		}
		
		$scope.records = pdb.records;
		$scope.$apply();

		console.log(pdb.records[1].passphraseHistory);
	};
	
	PWSafeDB.decryptFromUrl("password-is-pass.psafe3", "pass", {}, loadDb);
}]);