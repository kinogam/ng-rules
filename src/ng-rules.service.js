function RulesService($q){
    return (origin, rules) => {
        return {
            validate: () => {
                var d = $q.defer();
                d.resolve();
                return d.promise;
            }
        }
    };
}

export default RulesService;