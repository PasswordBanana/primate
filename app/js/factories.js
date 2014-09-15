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
	service.setFile = function(f) {
		file = f;
		name = f.name;
	};

	//Unlock the loaded database file
	service.unlock = function(p) {
		var deferred = $q.defer();
		var reader = new FileReader();

		reader.onloadend = function(event) {
			PWSafeDB.prototype.decrypt(reader.result, p, {}, function(pdb) {
		    	if (pdb instanceof Error) {
		    		deferred.reject(Error.message);
		    	} else {
		    		db = pdb;
		    		pass = p;
		    		deferred.resolve(true);
		    	}
		 	});
		};
		reader.readAsArrayBuffer(file);

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

	// Lock the database, maintain state by switchig the file for a blob
	service.lock = function() {
		file = db.getBlob(pass);
		db = undefined;
		pass = undefined;
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