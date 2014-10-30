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

		});

		it("returns false when a flag is not set", function() {

		});

		it("returns false when a flag does not exist", function() {

		});

		it("returns false when the flagName does not exist", function() {

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

	//groupIndex()

	//generateRecordTree()

	//randomPassword()

	//countOccurrences()

	//generatePassword()

	//toggleNewDB()

	//resetDrag()

	//windowMenu()
});
