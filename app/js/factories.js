/**
 * AngularJS Factories for DECO3801 Project
 *
**/

primate.factory("Database", ["$q", function($q) {
	var file, //Database File object
		db, //Decrypted PWSafeDB() view of the database
		pass, //Database password
		name = "No database loaded"; //Filename of the database

	var service = {};

	/*
	 * Set the database to File f and decrypt it with password p
	 * Returns a promise object
	 */
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

	// Getter for the decrypted database
	service.getDb = function() {
		return db;
	};

	// Save the database using the File-saver library
	service.save = function() {
		var blob = db.getBlob(pass);
		saveAs(blob, name);
	};

	// Close the database and reset all variables
	service.close = function() {
		db = undefined;
		file = undefined;
		pass = undefined;
		name = "No database loaded";
	};

	return service;
}]);