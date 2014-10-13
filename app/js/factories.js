/**
 * AngularJS Factories for DECO3801 Project
 *
**/

primate.service("Database", ["$q", function($q) {
    var vm = this,
        file, //Database File object
        db, //Decrypted PWSafeDB() view of the database
        pass, //Database password
        name = "No database loaded"; //Filename of the database

    var service = {
        setFile: setFile,
        unlock: unlock,
        getDb: getDb,
        save: save,
        lock: lock,
        close: close,
        setPass: setPass,
        setName: setName
    };

    /*
     * Set the database to File f and decrypt it with password p
     * Returns a promise object
     */
    function setFile(f) {
        file = f;
        name = f.name;
    }

    //Unlock the loaded database file
    function unlock(p) {
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
    }

    // Getter for the decrypted database
    function getDb() {
        return db;
    }

    // Save the database using the File-saver library
    function save() {
        var blob = db.getBlob(pass);
        saveAs(blob, name);
    }

    // Lock the database, maintain state by switchig the file for a blob
    function lock() {
        file = db.getBlob(pass);
        db = undefined;
        pass = undefined;
    }

    // Close the database and reset all variables
    function close() {
        db = undefined;
        file = undefined;
        pass = undefined;
        name = "No database loaded";
    }

    // Set a new master database password
    function setPass(oldPass, newPass) {
        if (oldPass === pass) {
            pass = newPass;
        } else {
            return false;
        }
        return true;
    }

    function setName(newName) {
        name = newName;
    }

    return service;
}]);
