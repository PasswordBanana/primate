describe("Unit Testing: Factories - ", function() {

    beforeEach(module('primate'));

    describe("Database", function() {
        var Database;
        beforeEach(inject(function(_Database_) {
            Database = _Database_;
        }));

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

        //unlock()

        it('should have an unlock function: ', function() {
            expect(Database.unlock).toBeDefined();
        });

        //lock()

        it('should have a lock function: ', function() {
            expect(Database.lock).toBeDefined();
        });

        //save()

        it('should have a save function: ', function() {
            expect(Database.save).toBeDefined();
        });

        //setPass()

        it('should have a setPass function: ', function() {
            expect(Database.setPass).toBeDefined();
        });

        //setName()

        it('should have a setName function: ', function() {
            expect(Database.setName).toBeDefined();
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

        //reset()
        it('should have a reset function: ', function() {
            expect(Alerts.reset).toBeDefined();
        });

        //set()
        it('should have a set function: ', function() {
            expect(Alerts.set).toBeDefined();
        });

        //clear()
        it('should have a clear function: ', function() {
            expect(Alerts.clear).toBeDefined();
        });

        //alerts{}
        it('should have an alerts object: ', function() {
            expect(Alerts.alerts).toBeDefined();
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
        });

        //"state"
        it('should have a state string: ', function() {
            expect(FileState.state).toBeDefined();
            expect(typeof FileState.state).toEqual("string");
        });
    });
});
