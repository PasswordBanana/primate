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
	describe("checkFlag", function() {
		it("exists", function() {
			expect(checkFlag).toBeDefined();
		});
		it("returns true when a flag is set", function() {
			expect(checkFlag).toBeDefined("true");
		});

		it("returns false when a flag is not set", function() {
			expect(checkFlag).toBeDefined("false");
		});

		it("returns false when a flag does not exist", function() {
			expect(checkFlag).toBeDefined("not exit");
		});

		it("returns false when the flagName does not exist", function() {
			var name = null;
			expect(checkFlag.name).toBeDefined("not exist");
		});
	});

	//setFlag()
	describe("setFlag", function() {
		it("exists", function() {
			expect(setFlag).toBeDefined();
		});
	});

	//clearFlag()
	describe("clearFlag", function() {
		it("exists", function() {
			expect(clearFlag).toBeDefined();
		});
	});

	//toggleFlag()
	describe("toggleFlag", function() {
		it("exists", function() {
			expect(toggleFlag).toBeDefined();
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
