import './polyfill';
import {ParamType} from './enum-type';


export function watchHandle(rItemList, prop) {
    //if it has specify another field as parameter, then we need check combo
    if (hasAnotherField(rItemList)) {
        let fields = getWatchFields(rItemList);

        let funcStr = fields.map((item) => {
            return `(angular.isObject($scope${prop}.${item})? JSON.stringify($scope${prop}.${item}) : $scope${prop}.${item})`
        }).join('+');

        return new Function('$scope', `
            return ${funcStr};
        `);
    }
    else {
        return new Function('$scope', `
            return $scope${prop}.${rItemList.field};
        `);
    }
}

export function watchContent(rItems, watchItem, p, customRules, result, timeChecker, $timeout) {
    
    let path = angular.isDefined(watchItem.index) ? `[${watchItem.index}].${p}` : `.${p}`;

    createProp(result, path.replace(/^\./, ''), {$invalid: false});

    let funcStr = [`
        var itemResult;
    `];

    for (let i = 0, len = rItems.length; i < len; i++) {
        let ri = rItems[i];

        let params = ri.params.map((param) => {
            if (param.type === ParamType.PROPERTY) {
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

    let watchFn = new Function('result', 'layerItem', 'customRules', 'checkResult', funcStr.join(''));

    return (newValue) => {
        if (angular.isUndefined(newValue)) {
            return;
        }

        watchFn(result, watchItem.item, customRules, () => {
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

function getWatchFields(rItemList) {
    let fields = [rItemList.field], result = [];

    for (let i = 0, len = rItemList.length; i < len; i++) {
        let rItem = rItemList[i];

        let values = rItem.params.filter((item) => {
            return item.type === ParamType.PROPERTY;
        }).map((item) => {
            return item.value;
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