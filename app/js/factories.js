/**
 * AngularJS Factories for DECO3801 Project
 *
**/

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

    function reset() {
        file = undefined;
        db = undefined;
        pass = undefined;
        name = "No database loaded";
    }

    function setFile(f) {
        file = f;
        name = f.name;
    }

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

    function lock() {
        file = db.getBlob(pass);
        db = undefined;
        pass = undefined;
    }

    function save() {
        var blob = db.getBlob(pass);
        saveAs(blob, name);
    }

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

    function getDatabase() {
        return db;
    }

    return service;
}]);

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

    function reset() {
        for (var i in alerts) {
            if (alerts.hasOwnProperty(i)) {
                alerts[i] = false;
            }
        }
    }

    function set(alertName) {
        if (alerts.hasOwnProperty(alertName)) {
            alerts[alertName] = true;
        }
    }

    function clear(alertName) {
        if (alerts.hasOwnProperty(alertName)) {
            alerts[alertName] = false;
        }
    }

    return service;
});

primate.service("FileState", function() {
    var state = "unloaded",

    states = [
        "unloaded",
        "locked",
        "unlocked"
    ]

    service = {
        set: set,
        state: state
    };

    function set(stateName) {
        if (states.indexOf(stateName) >= 0) {
            state = stateName;
        } 
    }

    return service;
});