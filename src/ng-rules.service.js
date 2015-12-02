function RulesService($q, $rootScope){
    return (origin, rules) => {
        let $scope = $rootScope.$new(),
            result = {
                isPass: false
            };

        angular.extend($scope, origin);

        for(let p in origin){
            $scope.$watch(p, function(value){
                result.isPass = !checkEmpty(value);
            });
        }

        return result;
    };
}


function checkEmpty(value){
    return value === undefined || /^\s*$/.test(value);
}

export default RulesService;