import ruleCollections from './ng-rule-collection.service';

function RulesService() {
    return function () {

        var $scope, originName, rules;

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
            items: {},
            $invalid: false
        };

        for (let p in rules) {
            let watchName = originName ? `${originName}.${p}` : p;

            $scope.$watch(watchName, function (value) {

                result.items[p] = ruleCollections[rules[p]](value);

                if (!result.items[p]) {
                    result.$invalid = true;
                }
                else{
                    result.$invalid = false;
                }
            });
        }

        return result;
    };
}

export default RulesService;