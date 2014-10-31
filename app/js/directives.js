/**
 * @namespace Directives
 * @desc AngularJS Directives
 *
**/

/**
 * @name strengthMeter
 * @desc the strengthMeter directive handles the initial creation
 * 		of a strength meter by setting the HTML markup of the element.
 *
 * @memberOf Directives
 * @namespace strengthMeter
 */
primate.directive('strengthMeter', function() {
    return {
        restrict: 'E',
        scope: {
            value: '='
        },
        link: function(scope, element, attrs) {
            var strength = zxcvbn(scope.value).score;

            var temp = ['<div class="strengthMeterWrapper">',
                '<div class="',
                    (strength < 1) ? 'strengthMeterBox' : 'strengthMeterBox1',
                    '"></div>',
                '<div class="',
                    (strength < 2) ? 'strengthMeterBox' : 'strengthMeterBox2',
                    '"></div>',
                '<div class="',
                    (strength < 3) ? 'strengthMeterBox' : 'strengthMeterBox3',
                    '"></div>',
                '<div class="',
                    (strength < 4) ? 'strengthMeterBox' : 'strengthMeterBox4',
                    '"></div>',
            '</div>'].join('');
            element.context.innerHTML = temp;
        }
    };
});