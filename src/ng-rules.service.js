import ruleCollections from './ng-rule-collection.service';

function RulesService($timeout) {
    'ngInject';

    return function () {

        var $scope, originName, rules, timeChecker,
            customRules = angular.copy(ruleCollections);

        if (arguments.length === 2) {
            $scope = arguments[0];
            rules = arguments[1];
        }
        else {
            $scope = arguments[0];
            originName = arguments[1];
            rules = arguments[2];
        }

        let result = {
            $invalid: false,
            $setRule: setRule
        };

        watchItems();

        return result;


        function watchItems(){

            for (let p in rules) {
                let watchName = originName ? `${originName}.${p}` : p,
                    rStr = rules[p],
                    isRequired = rStr.indexOf('required') !== -1,
                    rItems = rStr.split(/\s+\|\s+/);

                result[p] = {$invalid: false};

                $scope.$watch(watchName, function (value) {
                    if(angular.isUndefined(value)){
                        return;
                    }

                    if(!isRequired && !customRules.required(value)){
                        result[p].$invalid = false;
                        return;
                    }

                    for(let i = 0, len = rItems.length; i < len; i++){
                        var rsp = rItems[i].split(/\s*:\s*/),
                            machRuleStr = rsp[0],
                            rItemMatchResult = customRules[machRuleStr](value, rsp[1]);

                        result[p].$invalid = !rItemMatchResult;

                        if(!rItemMatchResult){
                            break;
                        }
                    }

                    timeChecker && $timeout.cancel(timeChecker);
                    timeChecker = $timeout(checkValid, 60);
                });
            }
        }

        function checkValid(){
            for(let p in result){
                if(p === '$invalid'){
                    continue;
                }

                if(result[p].$invalid){
                    result.$invalid = true;
                    return;
                }
            }

            result.$invalid = false;
        }

        function setRule(ruleName, method){
            customRules[ruleName] = method;
        }
    };
}

export default RulesService;