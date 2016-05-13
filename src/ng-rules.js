import ruleCollections from './regex-collection';
import analyzeOriginRules from './analyze-origin-rules';
import {watchHandle, watchContent} from './watch-handle';

class RuleHelper{
    constructor($timeout, $scope, originName, originRules, source){

        this.customRules = angular.copy(ruleCollections);
        this.timeChecker = null;        
        this.$timeout = $timeout;
        this.$scope = $scope;
        this.originName = originName;
        this.source = source;

        this.watchList = [];
        

        this.result = this._getInitResult();

        this.rules = analyzeOriginRules(originRules, $scope, originName);

        this._watchItems();
    }

    getRuleObj(){
        return this.result;
    }

    _watchItems(){
        let vm = this;

        for (let p in vm.rules) {
            let watchExpressionList = [],
                rItems = vm.rules[p];

            if (angular.isDefined(vm.originName) && angular.isArray(vm.source)) {
                vm.source.forEach((item, index) => {
                    watchExpressionList.push({
                        watchFunction: watchHandle(vm.$scope, rItems, vm.originName, index),
                        index: index,
                        item: item
                    });
                });
            }
            else {
                watchExpressionList = [{
                    watchFunction: watchHandle(vm.$scope, rItems, vm.originName),
                    index: undefined,
                    item: vm.source
                }]
            }

            watchExpressionList.forEach((item) => {
                let watchFn = vm.$scope.$watch(item.watchFunction, watchContent(rItems, item, p, vm.customRules, vm.result, vm.timeChecker, vm.$timeout, vm.$scope, vm.originName));
                vm.watchList.push(watchFn);
            });
        }
    }

    _cancelWatchItems(){
        this.watchList.forEach((clear) => {
            clear();
        });

        this.watchList = [];
    }
    
    _getInitResult(){
        let result,
            vm = this;

        if (angular.isDefined(vm.originName) && angular.isArray(vm.source)) {
            result = [];
            vm.$scope.$watchCollection(vm.originName, (val) => {
                if (angular.isDefined(val)) {
                    vm._cancelWatchItems();

                    result.splice(0);

                    vm._watchItems();
                }
            })
        }
        else {
            result = {};
        }

        angular.extend(result, {
            $invalid: false,
            $setRule: (ruleName, method) => {
                vm.customRules[ruleName] = method;
            }
        });

        return result;
    }
}

function RulesService($timeout) {
    'ngInject';

    return function (){
        let $scope,
            originName,
            originRules,
            source;

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

        let ruleHelper = new RuleHelper($timeout, $scope, originName, originRules, source);

        return ruleHelper.getRuleObj();
    };
}

export default angular.module('ngRules', [])
    .factory('$rules', RulesService);