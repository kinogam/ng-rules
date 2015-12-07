function RulesService($q, $rootScope){
    return ($scope, originName, rules) => {
        let //$scope = $rootScope.$new(),
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

        //angular.extend($scope, origin);

        for(let p in $scope[originName]){
            $scope.$watch(`${originName}.${p}`, function(value){

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