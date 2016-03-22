function analyzeOriginRules(originRules, $scope, originName) {
    let analyzeScope, newRules = {};

    if (originName) {
        analyzeScope = $scope[originName];
    }
    else {
        analyzeScope = $scope;
    }

    for (let p in originRules) {
        let ruleStr = originRules[p];

        if (p === '*') {
            for (var np in analyzeScope) {
                updateRule(newRules, np, ruleStr)
            }
        }
        else {
            updateRule(newRules, p, ruleStr);
        }
    }


    return newRules;
}

function updateRule(rules, p, ruleStr) {
    let sp = ruleStr.split(/\s*\|\s*/);

    if (angular.isUndefined(rules[p])) {
        rules[p] = [];
    }

    let rItem = rules[p];

    for (let i = 0, len = sp.length; i < len; i++) {
        var rsp = sp[i].split(/\s*:\s*/),
            methodName = rsp.splice(0, 1);



        rItem.push({
            methodName: methodName,
            params: rsp
        });
    }
}

export default analyzeOriginRules;