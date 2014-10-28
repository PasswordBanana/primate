describe('Unit: StateController', function() {
	beforeEach(module('primate'));

	var ctrl, scope;
	// inject the $controller and $rootScope services
	// in the beforeEach block
	beforeEach(inject(function($controller, $rootScope) {
	// Create a new scope that's a child of the $rootScope
		scope = $rootScope.$new();
		// Create the controller
		ctrl = $controller('StateController', {
			$scope: scope
		});
	}));

	it('should start off with an unloaded state', 
    function() {
    	expect(scope.state).toEqual("unloaded");
	});
});