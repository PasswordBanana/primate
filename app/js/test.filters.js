describe("Unit Testing: Filters - ", function() {
    var hash, passwordStrengthScore, recordIndent, groupIndent, flagValue;

    beforeEach(module('primate'));

    beforeEach(inject(function ($filter) {
        hash = $filter("hash");
        passwordStrengthScore = $filter("passwordStrengthScore");
        recordIndent = $filter("recordIndent");
        groupIndent = $filter("groupIndent");
        flagValue = $filter("flagValue");
    }));
    
    // test hash filter
    it('should have a hash filter: ', function () {
        expect(hash).toBeDefined();
        expect(hash("hello")).toEqual("*****");
        expect(hash("")).toEqual("");
        expect(hash(null)).toEqual("");
    });

    // test passwordStrengthScore filter
    it('should have a passwordStrengthScore filter: ', function () {
        expect(passwordStrengthScore).toBeDefined();
        expect(passwordStrengthScore("")).toEqual(0);
        expect(passwordStrengthScore(null)).toEqual(0);
        expect(passwordStrengthScore(undefined)).toEqual(0);
        expect(passwordStrengthScore("hunter2")).toEqual(0);
        expect(passwordStrengthScore("oCjqzh;qj3@/alR")).toEqual(4);
    });

    // test recordIndent filter
    it('should have a recordIndent filter: ', function () {
        var groupedRecord        = { group: "one" },
            subGroupedRecord     = { group: "one.two" },
            grouplessRecord      = { group: "" },
            nullGroupRecord      = { group: null },
            undefinedGroupRecord = { group: undefined };

        expect(recordIndent).toBeDefined();

        //Don't have group or are not records = 0
        expect(recordIndent(null)).toEqual(0);
        expect(recordIndent(undefined)).toEqual(0);
        expect(recordIndent(grouplessRecord)).toEqual(0);
        expect(recordIndent(nullGroupRecord)).toEqual(0);
        expect(recordIndent(undefinedGroupRecord)).toEqual(0);

        //Have group = 20
        expect(recordIndent(groupedRecord)).toEqual(20);
        expect(recordIndent(subGroupedRecord)).toEqual(20);
    });

    // test groupIndent filter
    it('should have a groupIndent filter: ', function () {
        var levelZeroGroup      = { level: 0 },
            levelOneGroup       = { level: 1 },
            levelTenGroup       = { level: 10 },
            levelNegOneGroup    = { level: -1 },
            levelStringGroup    = { level: "1" },
            levelNullGroup      = { level: null },
            levelUndefinedGroup = { level: undefined };

        expect(groupIndent).toBeDefined();

        //Don't have level
        expect(groupIndent(levelUndefinedGroup)).toEqual(0);

        //Level invalid
        expect(groupIndent(levelNullGroup)).toEqual(0);
        expect(groupIndent(levelStringGroup)).toEqual(0);
        expect(groupIndent(levelNegOneGroup)).toEqual(0);

        //Level valid
        expect(groupIndent(levelZeroGroup)).toEqual(0);
        expect(groupIndent(levelOneGroup)).toEqual(0);
        expect(groupIndent(levelTenGroup)).toEqual(180);
    });

    // test flagValue filter
    it('should have a flagValue filter: ', function () {
        var checked           = [0x8000, "useLowercase"],
            unchecked         = [0x0FFF, "useLowercase"],
            nullInputOne      = [null, "useLowercase"],
            nullInputTwo      = [0x8000, null],
            undefinedInputOne = [undefined, "useLowercase"],
            undefinedInputTwo = [0x8000, undefined],
            invalidInputOne   = ["Hello", "useLowercase"],
            invalidInputTwo   = [0x8000, -32],
            nullTuple         = null,
            undefinedTuple    = undefined;

        expect(flagValue).toBeDefined();

        //Non-tuple
        expect(flagValue(nullTuple)).toEqual(false);
        expect(flagValue(undefinedTuple)).toEqual(false);

        //Invalid tuple
        expect(flagValue(nullInputOne)).toEqual(false);
        expect(flagValue(nullInputTwo)).toEqual(false);
        expect(flagValue(undefinedInputOne)).toEqual(false);
        expect(flagValue(undefinedInputTwo)).toEqual(false);
        expect(flagValue(invalidInputOne)).toEqual(false);
        expect(flagValue(invalidInputTwo)).toEqual(false);

        //Valid Tuple
        expect(flagValue(checked)).toEqual(true);
        expect(flagValue(unchecked)).toEqual(false);
    });
});