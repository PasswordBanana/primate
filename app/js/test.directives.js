describe("Unit Testing: Directives -", function() {
    var scope, $compile;
    beforeEach(module('primate'));

    beforeEach(inject(function ($rootScope, _$compile_) {
        scope = $rootScope.$new();
        $compile = _$compile_;
    }));

    describe("strength-meter", function() {
        var strengthMeter;

        it('should have a strength-meter directive: ', function () {
            strengthMeter = $compile("<strength-meter value='password123'></strength-meter>");
            expect(strengthMeter).toBeDefined();
        });
    });
});
