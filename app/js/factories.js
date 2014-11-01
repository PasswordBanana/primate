/**
 * @namespace Factories
 * @desc AngularJS Factories for DECO3801 Project
 *
**/

/**
 * @name Database
 * @desc the Database service handles operations which 
 *      involve the actual database file.
 *
 * @memberOf Factories
 * @namespace Database
 */
primate.service("Database", ["$q", function($q) {
    var service = {
        reset: reset,
        setFile: setFile,
        unlock: unlock,
        lock: lock,
        save: save,
        setPass: setPass,
        setName: setName,
        getDb: getDatabase
    },

    file,
    name = "No database loaded",
    db,
    pass;

    /**
     * reset
     * @desc reset the state of the service.
     * @memberOf Factories.Database
     */
    function reset() {
        file = undefined;
        db = undefined;
        pass = undefined;
        name = "No database loaded";
    }

    /**
     * setFile
     * @desc set the database file to the given password database
     *
     * @param {File} f - a PWSafeV3 database file
     * @memberOf Factories.Database
     */
    function setFile(f) {
        if (f && typeof f === "object") {
            file = f;
            name = f.name || "untitled";
            return true;
        } 
        return false;
    }

    /**
     * unlock
     * @desc unlock the loaded database with the given password.
     * @param {string} p - password to attempt to unlock the database with.
     * @return {promise} a promise object for when the file is finished unlocking
     * @memberOf Factories.Database
     */
    function unlock(p) {
        var deferred = $q.defer();
        var reader = new FileReader();

        if (!file) deferred.reject(Error.message);

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

    /**
     * lock
     * @desc put the database into a locked state.
     * @memberOf Factories.Database
     */
    function lock() {
        if (!db) return;
        file = db.getBlob(pass);
        db = undefined;
        pass = undefined;
    }

    /**
     * save
     * @desc save the current state of the database to a file.
     * @memberOf Factories.Database
     */
    function save() {
        var blob = db.getBlob(pass);
        saveAs(blob, name);
    }

    /**
     * setPass
     * @desc set the master password for the database.
     * @param {string} oldPass - the current master password.
     * @param {string} newPass - the intended new master password.
     * @return {bool} whether or not the password change succeeded.
     * @memberOf Factories.Database
     */
    function setPass(oldPass, newPass) {
        if (typeof newPass !== "string") return false;
        if (oldPass === pass) {
            pass = newPass;
        } else {
            return false;
        }
        return true;
    }

    /**
     * setName
     * @desc set the filename for the database
     * @param {string} newName - the new name for the database file
     * @memberOf Factories.Database
     */
    function setName(newName) {
        if (!newName || typeof newName !== "string") return false;
        name = newName;
        return true;
    }

    /**
     * getDatabase
     * @desc get the unlocked database object
     * @return {object} PWSafeDB object that is the current state of the database
     * @memberOf Factories.Database
     */
    function getDatabase() {
        return db;
    }

    return service;
}]);

/**
 * @name Alerts
 * @desc the Alerts service handles the state of bootstrap alerts for notifying users.
 *
 * @memberOf Factories
 * @namespace Alerts
 */
primate.service("Alerts", function() {
    var alerts = {
        invalidPassword: false,
        notSaved: false,
        autoLocked: false
    },

    service = {
        reset: reset,
        set: set,
        clear: clear,
        alerts: alerts
    };

    /**
     * reset
     * @desc reset all alerts to undisplayed
     * @memberOf Factories.Alerts
     */
    function reset() {
        for (var i in alerts) {
            if (alerts.hasOwnProperty(i)) {
                alerts[i] = false;
            }
        }
    }

    /**
     * set
     * @desc display an alert
     * @param {string} alertName - the name of the alert you want to show from the Alerts.alerts{} object
     * @memberOf Factories.Alerts
     */
    function set(alertName) {
        if (alerts.hasOwnProperty(alertName)) {
            alerts[alertName] = true;
        }
    }

    /**
     * clear
     * @desc hide an alert
     * @param {string} alertName - the name of the alert you want to hide from the Alerts.alerts{} object
     * @memberOf Factories.Alerts
     */
    function clear(alertName) {
        if (alerts.hasOwnProperty(alertName)) {
            alerts[alertName] = false;
        }
    }

    return service;
});

/**
 * @name FileState
 * @desc the FileState service handles the state of the database file shown to other components in the system.
 *
 * @memberOf Factories
 * @namespace FileState
 */
primate.service("FileState", function() {
    var state = "unloaded",

    states = [
        "unloaded",
        "locked",
        "unlocked"
    ];

    service = {
        set: set,
        state: state
    };

    /**
     * set
     * @desc set the state of the database file
     * @param {string} stateName - a state in the FileState.states array
     * @memberOf Factories.FileState
     */
    function set(stateName) {
        if (stateName && states.indexOf(stateName) >= 0) {
            state = stateName;
            return true;
        }
        return false;
    }

    return service;
});
