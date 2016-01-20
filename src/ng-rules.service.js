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
            $invalid: false
        };

        for (let p in rules) {
            let watchName = originName ? `${originName}.${p}` : p,
                rStr = rules[p],
                isRequired = rStr.indexOf('required') !== -1,
                rItems = rStr.split(/\s+\|\s+/);

            $scope.$watch(watchName, function (value) {

                if(!isRequired && !ruleCollections.required(value)){
                    result.$invalid = false;
                    return;
                }

                for(let i = 0, len = rItems.length; i < len; i++){
                    var rsp = rItems[i].split(/\s*:\s*/);
                    var machRuleStr = rsp[0];

                    result[p] = ruleCollections[machRuleStr](value, rsp[1]);

                    if (!result[p]) {
                        result.$invalid = true;
                    }
                    else{
                        result.$invalid = false;
                    }
                }


            });
        }

        return result;
    };
}

export default RulesService;