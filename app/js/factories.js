primate.factory("Database", ["$q", function($q) {
	var file,
		db,
		pass,
		name = "No database loaded";

	var service = {};

	service.setFile = function(f, p) {
		var deferred = $q.defer();
		var reader = new FileReader();

		reader.onloadend = function(event) {
			PWSafeDB.prototype.decrypt(reader.result, p, {}, function(pdb) {
		    	if (pdb instanceof Error) {
		    		deferred.reject(Error.message);
		    	} else {
		    		file = f;
		    		db = pdb;
		    		pass = p;
		    		name = f.name;
		    		deferred.resolve(true);
		    	}
		 	});
		};
		reader.readAsArrayBuffer(f);

		return deferred.promise;
	};

	service.getDb = function() {
		return db;
	};

	service.save = function() {
		db.encryptAndSaveFile(pass, name);
	};

	service.close = function() {
		db = undefined;
		file = undefined;
		pass = undefined;
		name = "No database loaded";
	};

	return service;
}]);