import ruleCollections from './regex-collection';
import analyzeOriginRules from './analyze-origin-rules';

angular.module('ngRules', [])
    .factory('$rules', RulesService);



function RulesService($timeout) {
    'ngInject';

    function ruleFn() {
        let $scope,
            originName,
            rules,
            originRules,
            timeChecker,
            source,
            result,
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

        result = getInitResult();

        rules = analyzeOriginRules(originRules, $scope, originName);


        let watchList = [];

        cancelWatchItems();
        
        watchItems();

        return result;


        function watchItems() {
            for (let p in rules) {
                let watchExpressionList = [],
                    rItems = rules[p];


                if (angular.isDefined(originName) && angular.isArray(source)) {
                    source.forEach((item, index) => {
                        watchExpressionList.push([function () {
                            return item[p];
                        }, index, item]);
                    });
                }
                else {
                    watchExpressionList = [[p, undefined, $scope]];
                }


                watchExpressionList.forEach((watchExpression) => {

                    let currentPrefix = angular.isDefined(watchExpression[1]) ? `[${watchExpression[1]}].` : '';

                    createProp(result, `${currentPrefix}${p}`, {$invalid: false});

                    let watchFn = $scope.$watch(watchExpression[0], function (value) {
                        if (angular.isUndefined(value)) {
                            return;
                        }

                        for (let i = 0, len = rItems.length; i < len; i++) {
                            let ri = rItems[i],
                                rItemMatchResult = customRules[ri.methodName].apply(watchExpression[2], [value].concat(ri.params));

                            if(ri.isReverse){
                                rItemMatchResult = !rItemMatchResult;
                            }

                            createProp(result, `${currentPrefix}${p}.$invalid`, !rItemMatchResult);

                            if (!rItemMatchResult) {
                                break;
                            }
                        }

                        timeChecker && $timeout.cancel(timeChecker);

                        timeChecker = $timeout(() => {
                            checkValid(result);
                        }, 60);
                    });

                    watchList.push(watchFn);
                });
            }
        }
        
        function cancelWatchItems() {
            watchList.forEach((clear) => {
                clear();
            });

            watchList = [];
        }

        function checkValid(obj) {

            if (angular.isArray(obj)) {
                for(var i = 0, len = obj.length; i < len; i++){
                    var arrayItem = obj[i];
                    for (let p in arrayItem) {
                        if (/^$/.test(p)) {
                            continue;
                        }

                        if (arrayItem[p].$invalid) {
                            obj.$invalid = true;
                            return;
                        }
                    }
                }
            }
            else {
                for (let p in obj) {

                    if (/^$/.test(p)) {
                        continue;
                    }

                    if (obj[p].$invalid) {
                        obj.$invalid = true;
                        return;
                    }
                }
            }

            obj.$invalid = false;
        }

        function setRule(ruleName, method) {
            customRules[ruleName] = method;
        }

        function getInitResult() {
            let result;

            if (angular.isDefined(originName) && angular.isArray(source = $scope.$eval(originName))) {
                result = [];
                $scope.$watchCollection(originName, (val) => {
                    if(angular.isDefined(val)){
                        cancelWatchItems();
                        watchItems();
                    }
                })
            }
            else {
                result = {};
            }

            angular.extend(result, {
                $invalid: false,
                $setRule: setRule
            });

            return result;
        }
    }


    function createProp(obj, propStr, propVal) {
        var sp = propStr.split('.');
        var node = obj;

        for (var i = 0, len = sp.length; i < len; i++) {
            var spName = sp[i];

            if(spName.indexOf('[') !== -1){
                spName = /[^\[\]]+/.exec(spName)[0];
            }

            if (angular.isUndefined(node[spName])) {
                node[spName] = {};
            }

            if (i === len - 1) {
                node[spName] = propVal;
            }
            else {
                node = node[spName];
            }
        }
    }

    return ruleFn;
}