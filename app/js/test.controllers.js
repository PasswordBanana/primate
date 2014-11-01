describe("Unit Testing: Controllers -", function() {

    beforeEach(module('primate'));

    describe("StateCtrl", function() {
        var ctrl, scope;

        var mockRecords = {
            NULL: null,
            UNDEFINED: undefined,
            empty: [],
            valid: [
                {"uuid":"1d4865d9484b4d144a886260fc6b9d77","group":"Important","title":"Google","username":"Fred","notes":"Fred's Gmail account.","password":"zCnc4UaI","passphraseModifyTime":"2014-08-18T13:58:17.000Z","modifyTime":"2014-08-18T13:58:17.000Z","URL":"http://google.com"},
                {"uuid":"f127b41d29904cac78416d69e6aee07e","group":"Important","title":"Bank","username":"Fred","password":"ju4IJYWR","passphraseModifyTime":"2014-08-18T13:57:13.000Z","modifyTime":"2014-08-18T13:57:13.000Z","URL":"www.bank.bank"},
                {"uuid":"077380da97764e35555b3ae185aaadb2","group":"Games","title":"Runescape","username":"zezima","password":"hunter2","passphraseModifyTime":"2014-08-18T13:58:06.000Z","modifyTime":"2014-08-18T13:58:06.000Z","URL":"www.runescape.com"},
                {"uuid":"542e650d612f4a8f6e1023d4d4bdd05a","title":"Nogroup","username":"Nope","password":"pass","passphraseModifyTime":"2014-08-21T06:01:59.000Z","modifyTime":"2014-08-21T06:01:59.000Z","$$hashKey":"object:23"},
                {"uuid":"bbe2a132444d43595d2d2bdbfda898c4","group":"Games.MOBA","title":"League","username":"zekent","password":"QODRZshf","passphraseModifyTime":"2014-08-21T06:02:36.000Z","modifyTime":"2014-08-21T06:02:36.000Z"},
                {"uuid":"a7471c4892dd4a7b4981b3ba760034f8","title":"HasPolicy","username":"policy","password":"pie#?=b@k\\px","passphraseModifyTime":"2014-09-11T05:47:21.000Z","modifyTime":"2014-09-11T05:47:21.000Z","passphrasePolicy":{"flags":36864,"length":12,"minLowercase":1,"minUppercase":1,"minDigit":1,"minSymbol":1},"ownPassphraseSymbols":"","$$hashKey":"object:24"},
                {"uuid":"2b99dcfb5a334365670da17053ad8cd7","title":"HasHistory","username":"Historie","password":"newhistoreeee","passphraseModifyTime":"2014-09-11T05:48:21.000Z","modifyTime":"2014-09-11T05:48:21.000Z","$$hashKey":"object:25"},
                {"uuid":"90c0586147b84818bdf13a1d83de079c","group":"Important","title":"hello","password":"Y^N@W1(5&aVd","username":"world","passphraseModifyTime":"2014-10-01T12:38:46.000Z","modifyTime":"2014-10-01T12:38:46.000Z"}
            ],
            badUUID: [{"uuid":"1234","group":"Important","title":"Google","username":"Fred","notes":"Fred's Gmail account.","password":"zCnc4UaI","passphraseModifyTime":"2014-08-18T13:58:17.000Z","modifyTime":"2014-08-18T13:58:17.000Z","URL":"http://google.com"}],
            noGroup: [{"uuid":"1d4865d9484b4d144a886260fc6b9d77","group":"","title":"Google","username":"Fred","notes":"Fred's Gmail account.","password":"zCnc4UaI","passphraseModifyTime":"2014-08-18T13:58:17.000Z","modifyTime":"2014-08-18T13:58:17.000Z","URL":"http://google.com"}]
        };

        var mockDb = {
            records: mockRecords.valid,
            headers: {}
        };

        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            ctrl = $controller('StateCtrl', {
                $scope: scope
            });
        }));

        it('should start off with an unloaded state', function() {
            expect(scope.state).toEqual("unloaded");
        });

        //$scope.fileChanged()
        it('$scope.fileChanged()', function() {
            expect(scope.fileChanged).toBeDefined();
        });

        //$scope.open()
        it('$scope.open()', function() {
            expect(scope.open).toBeDefined();
        });

        //$scope.setState()
        it('$scope.setState() should set $scope.state if the provided state is valid', function() {
            expect(scope.setState).toBeDefined();

            scope.setState("unloaded");
            expect(scope.state).toEqual("unloaded");

            scope.setState("loaded");
            expect(scope.state).toEqual("loaded");

            scope.setState("unlocked");
            expect(scope.state).toEqual("unlocked");
        });

        it('$scope.setState() should not change anything if the provided state is invalid', function() {
            scope.setState("unloaded");
            expect(scope.state).toEqual("unloaded");

            scope.setState();
            expect(scope.state).toEqual("unloaded");

            scope.setState(null);
            expect(scope.state).toEqual("unloaded");

            scope.setState("");
            expect(scope.state).toEqual("unloaded");

            scope.setState("unloade");
            expect(scope.state).toEqual("unloaded");

            scope.setState(-22);
            expect(scope.state).toEqual("unloaded");
        });

        //$scope.newDb()
        it('$scope.newDb()', function() {
            expect(scope.newDb).toBeDefined();
        });

        //$scope.setRecords()
        it('$scope.setRecords() should set $scope.records when provided with a database', function() {
            expect(scope.setRecords).toBeDefined();

            expect(scope.records).not.toBeDefined();
            scope.setRecords(mockDb);
            expect(scope.records).toEqual(mockRecords.valid);
        });

        //$scope.lockDb()
        it('$scope.lockDb() should lock the database if a file is unlocked', function() {
            expect(scope.lockDb).toBeDefined();

            scope.setState("unlocked");
            scope.lockDb();
            expect(scope.state).toEqual("loaded");
        });

        it('$scope.lockDb() should do nothing the database if a file is not unlocked', function() {
            scope.setState("unloaded");
            scope.lockDb();
            expect(scope.state).toEqual("unloaded");

            scope.setState("loaded");
            scope.lockDb();
            expect(scope.state).toEqual("loaded");
        });

        //$scope.saveDb()
        it('$scope.saveDb()', function() {
            expect(scope.saveDb).toBeDefined();
        });

        //$scope.closeDb()
        it('$scope.closeDb() should go to an unloaded state', function() {
            expect(scope.closeDb).toBeDefined();

            scope.setState("loaded");
            scope.closeDb();
            expect(scope.state).toEqual("unloaded");
        });

        //$scope.gotoUrl()
        it('$scope.gotoUrl()', function() {
            expect(scope.gotoUrl).toBeDefined();
        });

        //$scope.enableCustomPolicy()
        it('$scope.enableCustomPolicy() should set the default policy on a given record', function() {
            expect(scope.enableCustomPolicy).toBeDefined();

            var record = {
                passphrasePolicy: undefined
            };

            scope.enableCustomPolicy(record);

            expect(record.passphrasePolicy).toBeDefined();
            expect(record.passphrasePolicy).toEqual(new DefaultPolicy());
        });

        //$scope.addRecord()
        it('$scope.addRecord()', function() {
            expect(scope.addRecord).toBeDefined();
        });

        //$scope.deleteRecord()
        it('$scope.deleteRecord()', function() {
            expect(scope.deleteRecord).toBeDefined();
        });

        //$scope.addGroup()
        it('$scope.addGroup()', function() {
            expect(scope.addGroup).toBeDefined();
        });

        //$scope.genPw()
        it('$scope.genPw() should generate a password in a given record', function() {
            expect(scope.genPw).toBeDefined();

            var record = {};
            scope.genPw(record);

            expect(record.password).toBeDefined();
            expect(typeof record.password).toEqual("string");
            expect(record.password.length).toBeGreaterThan(0);
        });

        //$scope.toggleRecordFlag()
        it('$scope.toggleRecordFlag() should toggle a flag on a given record', function() {
            expect(scope.toggleRecordFlag).toBeDefined();
            var record = {
                passphrasePolicy: {
                    flags: 0x0000
                }
            };

            scope.toggleRecordFlag(record, "useLowercase");
            expect(record.passphrasePolicy.flags).toEqual(policyFlags["useLowercase"]);

            scope.toggleRecordFlag(record, "useLowercase");
            expect(record.passphrasePolicy.flags).toEqual(0x0000);
        });

        //$scope.changeMasterPassword()
        it('$scope.changeMasterPassword()', function() {
            expect(scope.changeMasterPassword).toBeDefined();
        });

        //$scope.removePolicy()
        it('$scope.removePolicy() should remove a password policy from a record', function() {
            expect(scope.removePolicy).toBeDefined();

            var record = {
                passphrasePolicy: {
                    flags: 0x0000
                }
            };

            scope.removePolicy(record);

            expect(record.passphrasePolicy).not.toBeDefined();          
        });

        //$scope.copyToClipboard()
        it('$scope.copyToClipboard()', function() {
            expect(scope.copyToClipboard).toBeDefined();
        });

        //$scope.search()
        it('$scope.search()', function() {
            expect(scope.search).toBeDefined();
        });

        //$scope.auditValue()
        it('$scope.auditValue() should return an audit value for a given record', function() {
            expect(scope.auditValue).toBeDefined();

            var record1 = mockRecords.valid[0];
            record1.passphraseModifyTime = new Date(record1.passphraseModifyTime);
            var val1 = scope.auditValue(record1);
            expect(val1).toEqual(51);

            var record2 = mockRecords.valid[1];
            record2.passphraseModifyTime = new Date(record2.passphraseModifyTime);
            var val2 = scope.auditValue(record2);
            expect(val2).toEqual(52);

            var record3 = mockRecords.valid[2];
            record3.passphraseModifyTime = new Date(record3.passphraseModifyTime);
            var val3 = scope.auditValue(record3);
            expect(val3).toEqual(0);
        });

        //$scope.updateNewDBStrengthMeter()
        it('$scope.updateNewDBStrengthMeter()', function() {
            expect(scope.updateNewDBStrengthMeter).toBeDefined();
        });

        //$scope.updateNewMasterStrengthMeter()
        it('$scope.updateNewMasterStrengthMeter()', function() {
            expect(scope.updateNewMasterStrengthMeter).toBeDefined();
        });

        //$scope.changed()
        it('$scope.changed()', function() {
            expect(scope.changed).toBeDefined();
        });

        //$scope.startAudit()
        it('$scope.startAudit() to enable audit mode', function() {
            expect(scope.startAudit).toBeDefined();

            expect(scope.auditMode).toEqual(false);
            scope.startAudit();
            expect(scope.auditMode).toEqual(true);
        });

        //$scope.stopAudit()
        it('$scope.stopAudit() to disable audit mode', function() {
            expect(scope.stopAudit).toBeDefined();

            expect(scope.auditMode).toEqual(false);
            scope.startAudit();
            expect(scope.auditMode).toEqual(true);
            scope.stopAudit();
            expect(scope.auditMode).toEqual(false);
        });
    });
});
