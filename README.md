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
            $scope.num = 123;
            
            var rules = {
              "num": "number | maxLen: 5"
            };
            
            var r = $rules($scope, rules);

            $scope.r = r;
        });
``` 



Rules
```javascript
    rules = {
            '*': 'required',
            p1: 'number| maxLen: 5',
            p2: 'email',
            p3: 'eq: p1',
            p4: '!eq: p2',
            p5: 'eq: \'can\'',
            p6: 'gt:p1',
            'date:not(:first-child)': 'gt:@group[index-1].date',
            'px:first-child': 'number',
            'py:not(:first-child)': 'maxLen: 5'
        };
```

Use custom rule
```javascript
    r = $rules($scope, rules);       
    r.$setRule('customRule', (value) => {
        return /^\d[a-z]+\d$/.test(value);
    });
```

Validate
```javascript
    //you can use r.$invalid to check the validation
    expect(r.$invalidate).toBe(true);
    
    //or check the field's validate like this
    expect(r.p1.$invalid).toBe(true);
```