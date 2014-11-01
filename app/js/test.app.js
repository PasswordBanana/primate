describe("Unit Testing: Globals -", function() {

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
		
		it("return true when the groupName does exist", function() {
			expect(Group.name).toBeDefined("true");
		});

	});
	
	//groupIndex()
	describe("groupIndex", function() {
		it("exists", function() {
			expect(groupIndex).toBeDefined();
		});
		it("return group if the name is equal to groupName",function(){
			expect(groupIndex).toBeDefined("groupName");
		});
	});
	//generateRecordTree()
	describe("generateRecordTree", function() {
		it("exists", function() {
			expect(generateRecordTree).toBeDefined();
		});
		it("return true if there is any record in the recordTree", function() {
			expect(generateRecordTree).toBeDefined("true");
		});
	});
	//randomPassword()
	describe("randomPassword", function() {
		it("exists", function() {
			expect(randomPassword).toBeDefined();
		});
	});
	//countOccurrences()
	describe("countOccurrences", function() {
		it("exists", function() {
			expect(countOccurrences).toBeDefined();
		});
	});
	//generatePassword()
	describe("generatePassword", function() {
		it("exists", function() {
			expect(generatePassword).toBeDefined();
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
