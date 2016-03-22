import ruleCollections from './regex-collection';
import analyzeOriginRules from './analyze-origin-rules';

function RulesService($timeout) {
    'ngInject';

    return function () {

        var $scope, originName, rules, originRules, timeChecker,
            customRules = angular.copy(ruleCollections);

        if (arguments.length === 2) {
            $scope = arguments[0];
            originRules = arguments[1];
        }
        else {
            $scope = arguments[0];
            originName = arguments[1];
            originRules = arguments[2];
        }

        let result = {
            $invalid: false,
            $setRule: setRule
        };

        rules = analyzeOriginRules(originRules, $scope, originName);

        watchItems();

        return result;


        function watchItems() {

            for (let p in rules) {
                let watchName = originName ? `${originName}.${p}` : p,
                    rItems = rules[p];

                // rStr = rules[p],
                //isRequired = rStr.indexOf('required') !== -1,
                //rItems = rStr.split(/\s+\|\s+/);

                result[p] = {$invalid: false};

                $scope.$watch(watchName, function (value) {
                    if (angular.isUndefined(value)) {
                        return;
                    }

                    for (let i = 0, len = rItems.length; i < len; i++) {
                        let ri = rItems[i],
                            rItemMatchResult = customRules[ri.methodName].apply(customRules, [value].concat(ri.params));
                        result[p].$invalid = !rItemMatchResult;
                        if (!rItemMatchResult) {
                            break;
                        }
                    }

                    timeChecker && $timeout.cancel(timeChecker);
                    timeChecker = $timeout(checkValid, 60);
                });
            }
        }

        function checkValid() {
            for (let p in result) {
                if (p === '$invalid') {
                    continue;
                }

                if (result[p].$invalid) {
                    result.$invalid = true;
                    return;
                }
            }

            result.$invalid = false;
        }

        function setRule(ruleName, method) {
            customRules[ruleName] = method;
        }
    };
}

export default RulesService;