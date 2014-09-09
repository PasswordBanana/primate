var primate = angular.module("primate", ['ngAnimate']);

var Group = function(groupName, nestingLevel) {
    var name = groupName || "No name";
    var level = nestingLevel;
    var expanded = true;
    return {
        name: name,
        level: level,
        expanded: expanded,
        subgroups: [],
        records: []
    };
};

var groupIndex = function(arr, groupName) {
    for (var i = 0, il = arr.length; i < il; i++) {
        if (arr[i].name && arr[i].name === groupName) {
            return i;
        }
    }
    return -1;
};

var generateRecordTree = (function(records) {
    var tree = [], currentNode;
    tree.push(new Group("", 0));
    for (var r = 0, rl = records.length; r < rl; r++) {
        var rGroups = (records[r].group) ? records[r].group.split(".") || [] : [];

        currentNode = tree[0];

        for (var g = 0, gl = rGroups.length; g < gl; g++) {
            var idx = groupIndex.call(this, currentNode.subgroups, rGroups[g]);

            if (idx >= 0) {
                currentNode = currentNode.subgroups[idx];
            } else {
                currentNode.subgroups.push(new Group(rGroups[g], g + 1));
                currentNode = currentNode.subgroups[currentNode.subgroups.length - 1];
            }
        }
        currentNode.records.push(records[r]);
    }

    return tree;
});