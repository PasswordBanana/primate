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

describe("checkFlag", function() {
	it("returns true when a flag is set", function() {

	});
	
	it("returns false when a flag is not set", function() {

	});

	it("returns ___________ when a flag does not exist", function() {

	});

	it("returns ________ when the policy does not exist", function() {

	});
});

describe("setFlag", function() {
	it("", function() {
		
	});
});
describe("clearFlag", function() {
	it("", function() {
		
	});
});
describe("toggleFlag", function() {
	it("", function() {
		
	});
});
// describe("checkFlag", function() {
// 	it("", function() {
		
// 	});
// });
// describe("checkFlag", function() {
// 	it("", function() {
		
// 	});
// });
// describe("checkFlag", function() {
// 	it("", function() {
		
// 	});
// });
// describe("checkFlag", function() {
// 	it("", function() {
		
// 	});
// });
// describe("checkFlag", function() {
// 	it("", function() {
		
// 	});
// });