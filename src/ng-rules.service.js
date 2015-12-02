function RulesService($q, $rootScope){
    return (origin, rules) => {
        let $scope = $rootScope.$new(),
            ruleCollections = {
                'required': (value) => {
                    return !(value === undefined || /^\s*$/.test(value));
                },
                'number': (value) => {
                    return /^-?\d+(?:\.\d+)?$/.test(value);
                }
            },
            result = {
                items: {},
                isPass: true
            };

        angular.extend($scope, origin);

        for(let p in origin){
            $scope.$watch(p, function(value){

                result.items[p] = ruleCollections[rules[p]](value);

                if(result.isPass && !result.items[p]){
                    result.isPass = false;
                }
            });
        }

        return result;
    };
}

export default RulesService;