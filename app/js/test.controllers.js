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
		}


		beforeEach(inject(function($controller, $rootScope) {
			scope = $rootScope.$new();
			ctrl = $controller('StateCtrl', {
				$scope: scope
			});
		}));

		it('should start off with an unloaded state', function() {
			expect(scope.state).toEqual("unloaded");
		});

		//getRecordIndex()

		//getRecord()

		//$scope.fileChanged()

		//$scope.open()

		//$scope.setState()

		//$scope.newDb()

		//updateRecordTree()

		//$scope.setRecords()

		//clearVars()

		//$scope.lockDb()

		//$scope.saveDb()

		//$scope.closeDb()

		//$scope.gotoUrl()

		//$scope.enableCustomPolicy()

		//$scope.addRecord()

		//$scope.deleteRecord()

		//$scope.addGroup()

		//getGroup()

		//$scope.genPw()

		//$scope.toggleRecordFlag()

		//$scope.changeMasterPassword()

		//$scope.removePolicy()

		//idleTimeout()

		//$scope.copyToClipboard

		//$scope.search()

		//$scope.auditValue()

		//getStrengthMeter()

		//updateStrengthMeter()

		//$scope.updateNewDBStrengthMeter()

		//$scope.updateNewMasterStrengthMeter()

		//$scope.changed()

		//$scope.startAudit()

		//$scope.stopAudit()
	});
});
