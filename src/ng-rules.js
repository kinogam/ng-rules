import ruleCollections from './regex-collection';
import analyzeOriginRules from './analyze-origin-rules';
//import {ParamType} from './enum-type';
import {watchHandle, watchContent} from './watch-handle';

angular.module('ngRules', [])
    .factory('$rules', RulesService);

function RulesService($timeout) {
    'ngInject';

    return function ruleFn() {
        let $scope,
            originName,
            rules,
            originRules,
            timeChecker,
            source,
            result,
            customRules = angular.copy(ruleCollections);

        //handle dynamic arguments
        if (arguments.length === 2) {
            $scope = arguments[0];
            originRules = arguments[1];
            source = $scope;
        }
        else {
            $scope = arguments[0];
            originName = arguments[1];
            originRules = arguments[2];
            source = $scope.$eval(originName)
        }

        result = getInitResult();

        rules = analyzeOriginRules(originRules, $scope, originName);

        let watchList = [];

        watchItems();

        return result;


        function watchItems() {
            for (let p in rules) {
                let watchExpressionList = [],
                    rItems = rules[p];

                if (angular.isDefined(originName) && angular.isArray(source)) {
                    source.forEach((item, index) => {
                        let propPath =  `${originName}[${index}].${p}`;
                        watchExpressionList.push({
                            watchFunction: watchHandle(rItems, propPath),
                            index: index,
                            item: item
                        });
                    });
                }
                else {
                    let propPath = angular.isDefined(originName) ? `${originName}.${p}` : p;
                    watchExpressionList = [{
                        watchFunction: watchHandle(rItems, propPath),
                        index: undefined,
                        item: source
                    }]
                }

                watchExpressionList.forEach((item) => {
                    let watchFn = $scope.$watch(item.watchFunction, watchContent(rItems, item, p, customRules, result, timeChecker, $timeout));
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

        function setRule(ruleName, method) {
            customRules[ruleName] = method;
        }

        function getInitResult() {
            let result;

            if (angular.isDefined(originName) && angular.isArray(source)) {
                result = [];
                $scope.$watchCollection(originName, (val) => {
                    if (angular.isDefined(val)) {
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
}



export default RulesService;