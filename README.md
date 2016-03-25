# ng-rules

[![Build Status](https://travis-ci.org/kinogam/ng-rules.svg?branch=master)](https://travis-ci.org/kinogam/ng-rules)

[![Coverage Status](https://coveralls.io/repos/github/kinogam/ng-rules/badge.svg?branch=master)](https://coveralls.io/github/kinogam/ng-rules?branch=master)

an easy to test angular validator

# How to install

```sh 
bower install ng-rules --save
```

# How to use

Include it as dependency 
```javascript
angular.module('yourApp', ['ngRules']);
```


Inject in Controller
```javascript
        angular.module('kino', ['ngRules'])
                .controller('MyController', function($scope, $rules){
                    $scope. num = 123;
                    
                    var rules = {
                      "num": "number | maxLen: 5"
                    };
                    
                    var r = $rules($scope, rules);

                    $scope.r = r;
                });
``` 