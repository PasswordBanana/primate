/**
 * AngularJS Filters for DECO3801 Project
 *
**/

primate.filter("hash", function() {
    return function(input) {
        var input = input || "";
        var out = "";
        for (var i = 0, il = input.length; i < il; i++) {
            out += "*";
        }
        
        return out;
    };
});

primate.filter("passwordStrengthScore", function() {
    return function(input) {
        var input = input || "";
        return zxcvbn(input).score;
    };
});

primate.filter("recordIndent", function() {
    return function(record) {
        return (record.group && record.group !== "") ? 20 : 0;
    };
});

primate.filter("groupIndent", function() {
    return function(group) {
        var level = group.level - 1 || 0;
        return 20 * level;
    }
});

primate.filter("flagValue", function() {
    return function(tuple) {
        return checkFlag(tuple[0], tuple[1]);
    }
});

primate.filter("satrengthMeter", function() {
    return function(strength) {
        return ['<div class="strengthMeterWrapper">',
                    '<div class="strengthMeterBox1',
                        (strength >= 1) ? 'active' : '',
                        '"></div>',
                    '<div class="strengthMeterBox2',
                        (strength >= 2) ? 'active' : '',
                        '"></div>',
                    '<div class="strengthMeterBox3',
                        (strength >= 3) ? 'active' : '',
                        '"></div>',
                    '<div class="strengthMeterBox4',
                        (strength >= 4) ? 'active' : '',
                        '"></div>',
                '</div>'].join('');
    }
});