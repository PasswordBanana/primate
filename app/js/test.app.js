describe("Unit Testing: Globals -", function() {

	var mockRecords = [
		{"uuid":"1d4865d9484b4d144a886260fc6b9d77","group":"Important","title":"Google","username":"Fred","notes":"Freds Gmail account.","password":"zCnc4UaI","passphraseModifyTime":"2014-08-18T13:58:17.000Z","modifyTime":"2014-08-18T13:58:17.000Z","URL":"http://google.com"},
		{"uuid":"f127b41d29904cac78416d69e6aee07e","group":"Important","title":"Bank","username":"Fred","password":"ju4IJYWR","passphraseModifyTime":"2014-08-18T13:57:13.000Z","modifyTime":"2014-08-18T13:57:13.000Z","URL":"www.bank.bank"},
		{"uuid":"077380da97764e35555b3ae185aaadb2","group":"Games","title":"Runescape","username":"zezima","password":"hunter2","passphraseModifyTime":"2014-08-18T13:58:06.000Z","modifyTime":"2014-08-18T13:58:06.000Z","URL":"www.runescape.com"},
		{"uuid":"542e650d612f4a8f6e1023d4d4bdd05a","title":"Nogroup","username":"Nope","password":"pass","passphraseModifyTime":"2014-08-21T06:01:59.000Z","modifyTime":"2014-08-21T06:01:59.000Z","$$hashKey":"object:23"},
		{"uuid":"bbe2a132444d43595d2d2bdbfda898c4","group":"Games.MOBA","title":"League","username":"zekent","password":"QODRZshf","passphraseModifyTime":"2014-08-21T06:02:36.000Z","modifyTime":"2014-08-21T06:02:36.000Z"},
		{"uuid":"a7471c4892dd4a7b4981b3ba760034f8","title":"HasPolicy","username":"policy","password":"pie#?=b@k\\px","passphraseModifyTime":"2014-09-11T05:47:21.000Z","modifyTime":"2014-09-11T05:47:21.000Z","passphrasePolicy":{"flags":36864,"length":12,"minLowercase":1,"minUppercase":1,"minDigit":1,"minSymbol":1},"ownPassphraseSymbols":"","$$hashKey":"object:24"},
		{"uuid":"2b99dcfb5a334365670da17053ad8cd7","title":"HasHistory","username":"Historie","password":"newhistoreeee","passphraseModifyTime":"2014-09-11T05:48:21.000Z","modifyTime":"2014-09-11T05:48:21.000Z","$$hashKey":"object:25"},
		{"uuid":"90c0586147b84818bdf13a1d83de079c","group":"Important","title":"hello","password":"Y^N@W1(5&aVd","username":"world","passphraseModifyTime":"2014-10-01T12:38:46.000Z","modifyTime":"2014-10-01T12:38:46.000Z"}
	];

	var mockRecordTree =[{"name":"No name","level":0,"fullGroup":"","expanded":true,"subgroups":[{"name":"Important","level":1,"fullGroup":"Important","expanded":false,"subgroups":[],"records":[{"uuid":"1d4865d9484b4d144a886260fc6b9d77","group":"Important","title":"Google","username":"Fred","notes":"Freds Gmail account.","password":"zCnc4UaI","passphraseModifyTime":"2014-08-18T13:58:17.000Z","modifyTime":"2014-08-18T13:58:17.000Z","URL":"http://google.com"},{"uuid":"f127b41d29904cac78416d69e6aee07e","group":"Important","title":"Bank","username":"Fred","password":"ju4IJYWR","passphraseModifyTime":"2014-08-18T13:57:13.000Z","modifyTime":"2014-08-18T13:57:13.000Z","URL":"www.bank.bank"},{"uuid":"90c0586147b84818bdf13a1d83de079c","group":"Important","title":"hello","password":"Y^N@W1(5&aVd","username":"world","passphraseModifyTime":"2014-10-01T12:38:46.000Z","modifyTime":"2014-10-01T12:38:46.000Z"}]},{"name":"Games","level":1,"fullGroup":"Games","expanded":false,"subgroups":[{"name":"MOBA","level":2,"fullGroup":"Games.MOBA","expanded":false,"subgroups":[],"records":[{"uuid":"bbe2a132444d43595d2d2bdbfda898c4","group":"Games.MOBA","title":"League","username":"zekent","password":"QODRZshf","passphraseModifyTime":"2014-08-21T06:02:36.000Z","modifyTime":"2014-08-21T06:02:36.000Z"}]}],"records":[{"uuid":"077380da97764e35555b3ae185aaadb2","group":"Games","title":"Runescape","username":"zezima","password":"hunter2","passphraseModifyTime":"2014-08-18T13:58:06.000Z","modifyTime":"2014-08-18T13:58:06.000Z","URL":"www.runescape.com"}]}],"records":[{"uuid":"542e650d612f4a8f6e1023d4d4bdd05a","title":"Nogroup","username":"Nope","password":"pass","passphraseModifyTime":"2014-08-21T06:01:59.000Z","modifyTime":"2014-08-21T06:01:59.000Z","$$hashKey":"object:23"},{"uuid":"a7471c4892dd4a7b4981b3ba760034f8","title":"HasPolicy","username":"policy","password":"pie#?=b@k\\px","passphraseModifyTime":"2014-09-11T05:47:21.000Z","modifyTime":"2014-09-11T05:47:21.000Z","passphrasePolicy":{"flags":36864,"length":12,"minLowercase":1,"minUppercase":1,"minDigit":1,"minSymbol":1},"ownPassphraseSymbols":"","$$hashKey":"object:24"},{"uuid":"2b99dcfb5a334365670da17053ad8cd7","title":"HasHistory","username":"Historie","password":"newhistoreeee","passphraseModifyTime":"2014-09-11T05:48:21.000Z","modifyTime":"2014-09-11T05:48:21.000Z","$$hashKey":"object:25"}]}];

	//DefaultPolicy()
	describe("DefaultPolicy", function() {
		it("returns an object literal with valid values for each variable", function() {
			var a = new DefaultPolicy();
			expect(typeof a).toBe("object");
			expect(a.flags).toBeDefined();
			expect(a.length).toBeDefined();
			expect(a.minLowercase).toBeDefined();
			expect(a.minUppercase).toBeDefined();
			expect(a.minDigit).toBeDefined();
			expect(a.minSymbol).toBeDefined();
		});
	});

	//checkFlag()
	describe("checkFlag()", function() {
		it("exists", function() {
			expect(checkFlag).toBeDefined();
		});

		it("returns true when a flag is set", function() {
			expect(checkFlag(0x8000, "useLowercase")).toEqual(true);
			expect(checkFlag(0xF000, "useUppercase")).toEqual(true);
		});

		it("returns false when a flag is not set", function() {
			expect(checkFlag(0x8000, "useDigits")).toEqual(false);
			expect(checkFlag(0x8000, "useUppercase")).toEqual(false);
		});

		it("returns false when a flag does not exist", function() {
			expect(checkFlag(null, "useLowercase")).toEqual(false);
			expect(checkFlag(undefined, "useLowercase")).toEqual(false);
			expect(checkFlag(NaN, "useLowercase")).toEqual(false);
		});

		it("returns false when the flagName does not exist", function() {
			expect(checkFlag(0x8000, undefined)).toEqual(false);
			expect(checkFlag(0x8000, null)).toEqual(false);
			expect(checkFlag(0x8000, "")).toEqual(false);
			expect(checkFlag(0x8000, "useNothing")).toEqual(false);
		});
	});

	//setFlag()
	describe("setFlag()", function() {
		it("exists", function() {
			expect(setFlag).toBeDefined();
		});

		it('returns value with set flags when given valid inputs', function() {
			expect(setFlag(0x0000, "useLowercase")).toEqual(0x8000);
			expect(setFlag(0x0000, "useUppercase")).toEqual(0x4000);
			expect(setFlag(0x8000, "useUppercase")).toEqual(0xC000);

			var all = 0x0000;
			all = setFlag(all, "useLowercase");
			all = setFlag(all, "useUppercase");
			all = setFlag(all, "useSymbols");
			all = setFlag(all, "useDigits");
			all = setFlag(all, "useHexDigits");
			all = setFlag(all, "useEasyVision");
			all = setFlag(all, "makePronounceable");
			expect(all ^ 0x01ff).toEqual(0xFFFF);
		});

		it('returns original value if input isn\'t valid', function() {
			expect(setFlag(0x0000, "useNothing")).toEqual(0x0000);
			expect(setFlag(null, "useLowercase")).toEqual(null);
			expect(setFlag("Hello", "useLowercase")).toEqual("Hello");
		});
	});

	//clearFlag()
	describe("clearFlag", function() {
		it("exists", function() {
			expect(clearFlag).toBeDefined();
		});

		it('returns the original value with flag cleared given valid inputs', function() {
			expect(clearFlag(0x8000, "useLowercase")).toEqual(0x0000);
			expect(clearFlag(0xF000, "useLowercase")).toEqual(0x7000);

			var all = 0xffff;
			all = clearFlag(all, "useLowercase");
			all = clearFlag(all, "useUppercase");
			all = clearFlag(all, "useSymbols");
			all = clearFlag(all, "useDigits");
			all = clearFlag(all, "useHexDigits");
			all = clearFlag(all, "useEasyVision");
			all = clearFlag(all, "makePronounceable");
			expect(all).toEqual(0x01ff);
		});

		it('returns the original value unmodified given invalid inputs', function() {
			expect(clearFlag(0x0000, "useNothing")).toEqual(0x0000);
			expect(clearFlag(null, "useLowercase")).toEqual(null);
			expect(clearFlag("Hello", "useLowercase")).toEqual("Hello");
		});
	});

	//toggleFlag()
	describe('toggleFlag', function() {
		it('exists', function() {
			expect(toggleFlag).toBeDefined();
		});

		it('toggles the value of a flag given valid inputs', function() {
			var policy = {
				flags: 0x0000
			};
			expect(toggleFlag(policy, "useLowercase")).toEqual(0x8000);
			expect(toggleFlag(policy, "useLowercase")).toEqual(0x0000);

			expect(toggleFlag(policy, "useUppercase")).toEqual(0x4000);
			expect(toggleFlag(policy, "useLowercase")).toEqual(0xC000);
			expect(toggleFlag(policy, "useDigits")).toEqual(0xE000);
			expect(toggleFlag(policy, "useLowercase")).toEqual(0x6000);
		});

		it('does not modify the value given invalid inputs', function() {
			var policy = {
				flags: 0x8000
			};
			expect(toggleFlag(policy, "useNothing")).toEqual({flags:0x8000});
			expect(toggleFlag(null, "useLowercase")).toEqual(null);
			expect(toggleFlag("Hello", "useNothing")).toEqual("Hello");
		});
	});
	
	//Group()
	describe("group", function() {
		it("exists", function() {
			expect(Group).toBeDefined();
		});

		it('creates a Group object with the given details', function() {
			var a = new Group("TestName", "Parent.TestName", 1);

			expect(a.name).toEqual("TestName");
			expect(a.level).toEqual(1);
			expect(a.fullGroup).toEqual("Parent.TestName");
		});

		it('sets a default name if no name is given', function() {
			var a = new Group(null, "Parent.TestName", 1);

			expect(!!a.name).toEqual(true);
			expect(typeof a.name).toEqual("string");
		});
	});
	
	//groupIndex()
	describe("groupIndex", function() {
		var group1 = new Group("Parent", "Parent", 0),
			group2 = new Group("Self", "Self", 0),
			group3 = new Group("Child", "Child", 0),
			arr = [group1, group2, group3];

		it("exists", function() {
			expect(groupIndex).toBeDefined();
		});

		it("returns correct index if the groupName is found", function() {
			expect(groupIndex(arr, "Parent")).toEqual(0);
			expect(groupIndex(arr, "Self")).toEqual(1);
			expect(groupIndex(arr, "Child")).toEqual(2);
		});

		it('returns -1 if the groupName is not found or input invalid', function() {
			expect(groupIndex(arr, "Alien")).toEqual(-1);

			//Invalid inputs
			expect(groupIndex(arr, null)).toEqual(-1);
			expect(groupIndex("arr", "Parent")).toEqual(-1);
			expect(groupIndex(arr, undefined)).toEqual(-1);
		});
	});

	//generateRecordTree()
	describe("generateRecordTree", function() {
		it("exists", function() {
			expect(generateRecordTree).toBeDefined();
		});

		it("generates a valid record tree", function() {
			expect(generateRecordTree(mockRecords)).toEqual(mockRecordTree);
		});
	});

	//randomPassword()
	describe("randomPassword", function() {
		it("exists", function() {
			expect(randomPassword).toBeDefined();
		});

		it('generates a string using only characters in validChars', function() {
			var valid = 'abcd_@#';
			var pw = randomPassword(30, valid);

			for(var i = 0, il = pw.length; i < il; i++) {
				expect(valid.indexOf(pw[i])).toBeGreaterThan(-1);
			}
		});

		it('returns null if validChars isn\'t valid', function() {
			expect(randomPassword(10, "")).toEqual(null);
			expect(randomPassword(10, null)).toEqual(null);
			expect(randomPassword(10, undefined)).toEqual(null);
		})
	});

	//countOccurrences()
	describe("countOccurrences", function() {
		it("exists", function() {
			expect(countOccurrences).toBeDefined();
		});

		it('counts the correct number of occurrences for valid input', function() {
			expect(countOccurrences("abcd", "haha")).toEqual(2);
			expect(countOccurrences("a#2Kbcd", "haKX32#!ha")).toEqual(5);
			expect(countOccurrences("", "haKX32#!ha")).toEqual(0);
			expect(countOccurrences("a#2Kbcd", "")).toEqual(0);
			expect(countOccurrences("fred", "fred")).toEqual(4);
			expect(countOccurrences("", "")).toEqual(0);
		});

		it('returns false for incorrect inputs', function() {
			expect(countOccurrences(null, "abc")).toEqual(false);
			expect(countOccurrences("abc", null)).toEqual(false);
			expect(countOccurrences(undefined, "abc")).toEqual(false);
			expect(countOccurrences("abc", 1)).toEqual(false);
		});
	});

	//generatePassword()
	describe("generatePassword", function() {
		it("exists", function() {
			expect(generatePassword).toBeDefined();
		});

		it('generates a valid password for a given policy', function() {
			var pw = generatePassword();
			expect(typeof pw).toEqual("string");
			expect(pw.length).toEqual(12);
			expect(countOccurrences("abcdefghijklmnopqrstuvwxyz", pw)).toBeGreaterThan(0);
			expect(countOccurrences("ABCDEFGHIJKLMNOPQRSTUVWXYZ", pw)).toBeGreaterThan(0);
			expect(countOccurrences("0123456789", pw)).toBeGreaterThan(0);
			expect(countOccurrences("+-=_@#$%^&<>/~\\?!|()", pw)).toBeGreaterThan(0);

			//Lowercase only, length 5
			var pw2policy = {
				flags: 0x8000,
				length: 5,
				minLowercase: 1,
				minUppercase: 1,
				minDigit: 1,
				minSymbol: 1
			};
			var pw2 = generatePassword(pw2policy);
			expect(typeof pw2).toEqual("string");
			expect(pw2.length).toEqual(5);
			expect(countOccurrences("abcdefghijklmnopqrstuvwxyz", pw2)).toEqual(5);
			expect(countOccurrences("ABCDEFGHIJKLMNOPQRSTUVWXYZ", pw2)).toEqual(0);
			expect(countOccurrences("0123456789", pw2)).toEqual(0);
			expect(countOccurrences("+-=_@#$%^&<>/~\\?!|()", pw2)).toEqual(0);

			//Digits & Symbols, more minLowercase than length
			var pw3policy = {
				flags: 0x3000,
				length: 8,
				minLowercase: 9,
				minUppercase: 1,
				minDigit: 3,
				minSymbol: 5
			};
			var pw3 = generatePassword(pw3policy);
			expect(typeof pw3).toEqual("string");
			expect(pw3.length).toEqual(8);
			expect(countOccurrences("abcdefghijklmnopqrstuvwxyz", pw3)).toEqual(0);
			expect(countOccurrences("ABCDEFGHIJKLMNOPQRSTUVWXYZ", pw3)).toEqual(0);
			expect(countOccurrences("0123456789", pw3)).toBeGreaterThan(2);
			expect(countOccurrences("+-=_@#$%^&<>/~\\?!|()", pw3)).toBeGreaterThan(4);
		});
	});

	//toggleNewDB()
	describe("toggleNewDB", function() {
		it("exists", function() {
			expect(toggleNewDB).toBeDefined();
		});
	});

	//resetDrag()
	describe("resetDrag", function() {
		it("exists", function() {
			expect(resetDrag).toBeDefined();
		});
	});

	//windowMenu()
	describe("windowMenu", function() {
		it("exists", function() {
			expect(windowMenu).toBeDefined();
		});
	});
});
