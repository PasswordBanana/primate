primate.controller("LibraryTestController", ["$scope", function($scope) {
	$scope.records;
	
	var loadDb = function(pdb) {
		if (pdb instanceof Error) {
			console.log("Error, couldn't load password database");
			return;
		}
		
		$scope.records = pdb.records;
		$scope.$apply();
	};
	
	PWSafeDB.decryptFromUrl("password-is-pass.psafe3", "pass", {}, loadDb);
}]);