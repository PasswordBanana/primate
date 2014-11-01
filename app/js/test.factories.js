describe("Unit Testing: Factories -", function() {

    beforeEach(module('primate'));

    describe("Database", function() {
        var Database;

        var validDbFile, //password is pass
            nonDbFile;

        var openDbFiles = function(done) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/base/app/fred.psafe3', true);
            xhr.responseType = 'blob';

            xhr.onload = function(e) {
                if (this.status == 200) {
                    var blob = this.response;
                    validDbFile = blob;
                    done();
                } else {
                    console.log(this.status);
                    done();
                }
            };

            xhr.send();
        };

        beforeEach(inject(function(_Database_) {
            Database = _Database_;
        }));

        it('loads a file', function(done) {
            openDbFiles(done);
        });

        it('should have a Database service: ', function () {
            expect(Database).toBeDefined();
        });

        //reset()

        it('should have a reset function: ', function() {
            expect(Database.reset).toBeDefined();
        });

        //setFile()

        it('should have a setFile function: ', function() {
            expect(Database.setFile).toBeDefined();
        });

        it('should set the database to a given file', function() {
            var b = new Blob(["Hello, world!"], {type: "application/octet-binary"});
            expect(Database.setFile(b)).toEqual(true);
        });

        it('should not set the database to an invalid type', function() {
            expect(Database.setFile(null)).toEqual(false);
            expect(Database.setFile(undefined)).toEqual(false);
            expect(Database.setFile("BadFile")).toEqual(false);
            expect(Database.setFile(-1223)).toEqual(false);
        });

        //unlock()

        it('should have an unlock function: ', function() {
            expect(Database.unlock).toBeDefined();
        });

        xit('should unlock a valid database with the correct password', function(done) {
            //Promise never resolves.
            Database.reset();
            Database.setFile(validDbFile);
            var promise = Database.unlock("pass");

            promise.then(function(success) {
                expect(true).toEqual(true);
                done();
            }, function(failure) {
                expect(false).toEqual(true);
                done();
            });
        });

        xit('should not unlock a valid database with an incorrect password', function(done) {
            Database.reset();
            Database.setFile(validDbFile);
            var promise = Database.unlock("wrongpassword");

            promise.then(function(success) {
                expect(false).toEqual(true);
                done();
            }, function(failure) {
                expect(true).toEqual(true);
                done();
            });
        });

        xit('should not unlock an invalid database file', function() {

        });

        //lock()

        it('should have a lock function: ', function() {
            expect(Database.lock).toBeDefined();
        });

        xit('should not expose database content when locked', function() {
            Database.setFile(validDbFile);
            var promise = Database.unlock("pass");

            promise.then(function(success) {
                expect(Database.getDb()).toBeDefined();
                Database.lock();
                expect(Database.getDb()).not.toBeDefined();
                done();
            });
        })

        //save()

        it('should have a save function: ', function() {
            expect(Database.save).toBeDefined();
        });

        //setPass()

        it('should have a setPass function: ', function() {
            expect(Database.setPass).toBeDefined();
        });

        it('should set the password if a valid old and new pass are provided', function() {
            expect(Database.setPass(undefined, "Test")).toEqual(true);
            expect(Database.setPass("Test", "Test2")).toEqual(true);
        });

        it('should not set the password if invalid arguments are provided', function() {
            expect(Database.setPass(undefined, -2)).toEqual(false);
            expect(Database.setPass("notTheCurrentPassword", "Test")).toEqual(false);
            expect(Database.setPass(undefined, undefined)).toEqual(false);
        });

        //setName()

        it('should have a setName function: ', function() {
            expect(Database.setName).toBeDefined();
        });

        it('should set the name to a string', function() {
            expect(Database.setName("Hello")).toEqual(true);
        });

        it('should not set the name to an invalid input', function() {
            expect(Database.setName()).toEqual(false);
            expect(Database.setName("")).toEqual(false);
            expect(Database.setName(null)).toEqual(false);
            expect(Database.setName(-21)).toEqual(false);
            expect(Database.setName(NaN)).toEqual(false);
        });

        //getDb()

        it('should have a getDb function: ', function() {
            expect(Database.getDb).toBeDefined();
        });
    });

    describe("Alerts", function() {
        var Alerts;
        beforeEach(inject(function(_Alerts_) {
            Alerts = _Alerts_;
        }));

        it('should have an Alerts service: ', function () {
            expect(Alerts).toBeDefined();
        });

        //alerts{}
        it('should have an alerts object: ', function() {
            expect(Alerts.alerts).toBeDefined();
        });

        //reset()
        it('should have a reset function: ', function() {
            expect(Alerts.reset).toBeDefined();
        });

        it('should reset all alerts values', function() {
            for (var a in Alerts.alerts) {
                if (Alerts.alerts.hasOwnProperty(a)) {
                    Alerts.alerts[a] = true;
                }
            }
            Alerts.reset();
            for (var a in Alerts.alerts) {
                if (Alerts.alerts.hasOwnProperty(a)) {
                    expect(Alerts.alerts[a]).toEqual(false);
                }
            }
        });

        //set()
        it('should have a set function: ', function() {
            expect(Alerts.set).toBeDefined();
        });

        it('should set properties to true', function() {
            for (var a in Alerts.alerts) {
                if (Alerts.alerts.hasOwnProperty(a)) {
                    Alerts.set(a);
                    expect(Alerts.alerts[a]).toEqual(true);
                }
            }
        });

        //clear()
        it('should have a clear function: ', function() {
            expect(Alerts.clear).toBeDefined();
        });

        it('should set properties to false', function() {
            for (var a in Alerts.alerts) {
                if (Alerts.alerts.hasOwnProperty(a)) {
                    Alerts.set(a);
                    expect(Alerts.alerts[a]).toEqual(true);
                    Alerts.clear(a);
                    expect(Alerts.alerts[a]).toEqual(false);
                }
            }
        });
    });

    describe("FileState", function() {
        var FileState;
        beforeEach(inject(function(_FileState_) {
            FileState = _FileState_;
        }));

        it('should have a FileState service: ', function () {
            expect(FileState).toBeDefined();
        });

        //set()
        it('should have a set function: ', function() {
            expect(FileState.set).toBeDefined();
            expect(typeof FileState.set).toBe("function");
        });

        xit('should set the state to all valid values', function() {
            expect(FileState.state).toEqual('unloaded');

            expect(FileState.set('locked')).toEqual(true);
            expect(FileState.set('unlocked')).toEqual(true);
            expect(FileState.set('unloaded')).toEqual(true);
        });

        it('should not set the state to an invalid value', function() {
            expect(FileState.set()).toEqual(false);
            expect(FileState.set(null)).toEqual(false);
            expect(FileState.set('')).toEqual(false);
            expect(FileState.set(-21)).toEqual(false);
            expect(FileState.set('test')).toEqual(false);
        });
    });
});
