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

        watchItems();

        return result;


        function watchItems() {
            for (let p in rules) {
                let watchExpressionList = [],
                   // prefix = '',
                    rItems = rules[p];


                if (angular.isDefined(originName) && angular.isArray(source)) {

                    source.forEach((item, index) => {
                        watchExpressionList.push([function () {
                            return item[p];
                        }, index]);
                    });

                    //namespace(result, originName)
                    //prefix = originName;
/*

                    if (angular.isArray(source)) {

                    }
                    else {
                        watchExpressionList = [[p]];
                    }*/
                }
                else {
                    watchExpressionList = [[p]];
                }


                watchExpressionList.forEach((watchExpression) => {

                    let currentPrefix = angular.isDefined(watchExpression[1]) ? `[${watchExpression[1]}].` : '';

                    createProp(result, `${currentPrefix}${p}`, {$invalid: false});

                    $scope.$watch(watchExpression[0], function (value) {
                        if (angular.isUndefined(value)) {
                            return;
                        }

                        for (let i = 0, len = rItems.length; i < len; i++) {
                            let ri = rItems[i],
                                rItemMatchResult = customRules[ri.methodName].apply(customRules, [value].concat(ri.params));

                            createProp(result, `${currentPrefix}${p}.$invalid`, !rItemMatchResult);

                            if (!rItemMatchResult) {
                                break;
                            }
                        }

                        timeChecker && $timeout.cancel(timeChecker);
                        timeChecker = $timeout(checkValid, 60);
                    });
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

        function getInitResult() {
            let result;

            if (angular.isDefined(originName) && angular.isArray(source = $scope.$eval(originName))) {
                result = [];
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