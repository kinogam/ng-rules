import './polyfill';
import {ParamType} from './enum-type';


export function watchHandle($scope, rItemList, originName, index) {
    let propPath;

    if (angular.isDefined(originName) && angular.isDefined(index)) {
        propPath = `.${originName}[${index}]`;
    }
    else{
        propPath = angular.isDefined(originName) ? `.${originName}` : '';
    }

    //if it has specify another field as parameter, then we need check combo
    if (hasAnotherField(rItemList)) {
        let fields = getWatchFields(rItemList, propPath, originName);

        let funcStr = fields.map((itemPath) => {
            
 /*           try{
                $scope.$eval(itemPath.replace(/^./, ''));

                return `(angular.isObject($scope${itemPath})? JSON.stringify($scope${itemPath}) : $scope${itemPath})`;
            }
            catch(e){
                return '\'\'';
            }*/
            
            return `(function(){             
                    try{
                        return (angular.isObject($scope${itemPath})? JSON.stringify($scope${itemPath}) : $scope${itemPath})
                    }
                    catch(e){
                        return '""';
                    }
                })()`;

           // return `(angular.isObject($scope${itemPath})? JSON.stringify($scope${itemPath}) : $scope${itemPath})`
            //return `(angular.isObject($scope${propPath}.${item})? JSON.stringify($scope${propPath}.${item}) : $scope${propPath}.${item})`
        }).join('+');

        let watchFn = new Function('$scope', 'index', `
            return ${funcStr};
        `);

        return ($scope) => {
            return watchFn($scope, index);
        };
    }
    else {
        return new Function('$scope', `
            return $scope${propPath}.${rItemList.field};
        `);
    }
}

export function watchContent(rItems, watchItem, p, customRules, result, timeChecker, $timeout, $scope, originName) {
    
    let path = angular.isDefined(watchItem.index) ? `[${watchItem.index}].${p}` : `.${p}`;

    createProp(result, path.replace(/^\./, ''), {$invalid: false});

    let funcStr = [`
        var itemResult;
    `];

    for (let i = 0, len = rItems.length; i < len; i++) {
        let ri = rItems[i];

        if(!ri.filter(watchItem.index)){
            continue;
        }

        let params = ri.params.map((param) => {
            if (param.type === ParamType.PROPERTY) {
                if(param.value.indexOf('@') !== -1){
                    return param.value.replace(/@group/g,`$scope.${originName}`);
                }
                return `layerItem.${param.value}`;
            }
            else {
                return `'${param.value}'`;
            }
        });

        params = [`layerItem.${p}`].concat(params);

        let paramsStr = params.join(','),
            isReverse = ri.isReverse ? '!' : '';

        funcStr.push(`
            itemResult = ${isReverse}customRules.${ri.methodName}(${paramsStr});
            
            result${path}.$invalid = !itemResult;
            
            if(!itemResult){
                checkResult();
                return;
            }
        `);
    }

    funcStr.push(`
        checkResult();
    `);

    let watchFn = new Function('result', 'layerItem', 'customRules', '$scope', 'index', 'checkResult', funcStr.join(''));

    return (newValue) => {
        if (angular.isUndefined(newValue)) {
            return;
        }

        watchFn(result, watchItem.item, customRules, $scope, watchItem.index, () => {
            timeChecker && $timeout.cancel(timeChecker);

            timeChecker = $timeout(() => {
                checkValid(result);
            }, 60);
        });
    };

}


function hasAnotherField(rItemList) {
    for (let i = 0, len = rItemList.length; i < len; i++) {
        let rItem = rItemList[i];

        if (angular.isDefined(rItem.params) && rItem.params.findIndex(function (item) {
                return item.type === ParamType.PROPERTY;
            }) !== -1) {
            return true;
        }
    }
    return false;
}

function getWatchFields(rItemList, propPath, originName) {
    let fields = [`${propPath}.${rItemList.field}`],
        result = [];

    for (let i = 0, len = rItemList.length; i < len; i++) {
        let rItem = rItemList[i];

        let values = rItem.params.filter((item) => {
            return item.type === ParamType.PROPERTY;
        }).map((item) => {

            if(item.value.indexOf('@group') !== -1){
                return '.' + item.value.replace(/@group/g, originName);
            }
            else{
                return `${propPath}.${item.value}`;
            }
        });

        fields = fields.concat(values);
    }

    fields.forEach((item) => {
        if (result.indexOf(item) === -1) {
            result.push(item);
        }
    });

    return result;
}

function createProp(obj, propStr, propVal) {
    var sp = propStr.split('.');
    var node = obj;

    for (var i = 0, len = sp.length; i < len; i++) {
        var spName = sp[i];

        if (spName.indexOf('[') !== -1) {
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

function checkValid(obj) {

    if (angular.isArray(obj)) {
        for (var i = 0, len = obj.length; i < len; i++) {
            var arrayItem = obj[i];
            for (let p in arrayItem) {
                if (!/^$/.test(p) && arrayItem[p].$invalid) {
                    obj.$invalid = true;
                    return;
                }
            }
        }
    }
    else {
        for (var p in obj) {
            if (!/^$/.test(p) && obj[p].$invalid) {
                obj.$invalid = true;
                return;
            }
        }
    }

    obj.$invalid = false;
}