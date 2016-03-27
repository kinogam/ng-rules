import {ParamType} from './enum-type';

function analyzeOriginRules(originRules, $scope, originName) {
    let analyzeScope, newRules = {};

    if (originName) {
        analyzeScope = $scope.$eval(originName);
        if (angular.isArray(analyzeScope)) {
            analyzeScope = analyzeScope[0];
        }
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
        let rsp = sp[i].split(/\s*:\s*/),
            methodName = rsp.splice(0, 1)[0].replace(/^\s+|\s+$/g, ''),
            isReverse = false;


        if (rsp.length > 0) {
            rsp = rsp.map(function (item) {
                let type;

                if (/^\s*['"]|['"]\s*$/.test(item) || /^-?\d+(?:\.\d+)?$/.test(item)) {
                    type = ParamType.VALUE;
                }
                else{
                    type = ParamType.PROPERTY;
                }

                return {
                    type: type,
                    value: item.replace(/^\s+|\s+$/g, '').replace(/^['"]|['"]$/g, '')
                };
            });
        }

        if (methodName.indexOf('!') !== -1) {
            isReverse = true;
            methodName = methodName.substr(1);
        }

        rItem.push({
            methodName: methodName,
            params: rsp,
            isReverse: isReverse
        });
    }
}

export default analyzeOriginRules;