describe('ng-rules', () => {
    let $rules,
        rules,
        $scope,
        $timeout,
        r;

    beforeEach(angular.mock.module('ngRules'));

    beforeEach(inject((_$rules_, $rootScope, _$timeout_) => {
        $rules = _$rules_;
        $scope = $rootScope.$new();
        $timeout = _$timeout_;
    }));

    function run() {
        $scope.$digest();
        try {
            $timeout.flush();
        } catch (e) {
            return;
        }
    }

    function expectValid(originName, value) {
        if (angular.isUndefined(r) && angular.isDefined(originName)) {
            r = $rules($scope, originName, rules);
        }
        else if (angular.isUndefined(r)) {
            r = $rules($scope, rules);
        }

        $scope.$digest();
        try {
            $timeout.flush();
        } catch (e) {
            return;
        }

        if (angular.isDefined(value)) {
            expect(r.$invalid).toBe(value);
        }
        else {
            expect(r.$invalid).toBe(false);
        }
    }

    function expectInvalid(originName) {
        return expectValid(originName, true);
    }

    describe('single field validation', () => {

        it('should pass with property is not empty', () => {

            $scope.origin = {
                p1: 'hello'
            };

            rules = {
                p1: 'required'
            };

            expectValid('origin');
        });

        it('should fail with property is empty string', () => {
            $scope.origin = {
                p1: ''
            };
            rules = {
                p1: 'required'
            };

            expectInvalid('origin');
        });

        it('should fail with property is spaces', () => {
            $scope.origin = {
                p1: '   '
            };
            rules = {
                p1: 'required'
            };

            expectInvalid('origin');
        });

        it("don't need to specify a collection name", () => {
            $scope.num = 'abc';

            rules = {
                num: 'number'
            };

            expectInvalid();
        });

        it('can watch variable change', () => {
            $scope.num = 'abc';

            rules = {
                num: 'number'
            };

            expectInvalid();

            $scope.num = '123';

            expectValid();
        });

        it('should pass with property as Number', () => {
            $scope.origin = {
                num: '123'
            };

            rules = {
                num: 'number'
            };

            expectValid('origin');
        });

        it('should faill with property is not Number', () => {
            $scope.origin = {
                num: 'abc'
            };

            rules = {
                num: 'number'
            };

            expectInvalid('origin');
        });

        it('should pass with property as Email Address', () => {
            $scope.origin = {
                email: 'kinogam@gmail.com'
            };

            rules = {
                email: 'email'
            };

            expectValid('origin');
        });

        it('should faill with property is not Address', () => {
            $scope.origin = {
                email: '@kinogl.com!'
            };

            rules = {
                email: 'email'
            };

            expectInvalid('origin');
        });

        it('should allow empty field while not specify required', () => {
            $scope.origin = {
                email: null
            };

            rules = {
                email: 'email'
            };

            expectValid('origin');
        });

        it('should be invalid if specify field required and the field is empty', () => {
            $scope.origin = {
                email: null
            };

            rules = {
                email: 'required | email'
            };

            expectInvalid('origin');
        });

        it('should limit field length', () => {
            $scope.origin = {
                name: 'kino1'
            };

            rules = {
                name: 'maxLen: 5'
            };

            expectValid('origin');
        });

        it('should be invalid if out of field length limit', () => {
            $scope.origin = {
                name: 'kinogam'
            };

            rules = {
                name: 'maxLen: 5'
            };

            expectInvalid('origin');
        });

        it('should limit field by multiple rules', () => {
            $scope.origin = {
                email: 'kino@gmail.com'
            };

            rules = {
                name: 'email | maxLen: 14'
            };

            expectValid('origin');
        });

        it('should be invalid if filed not match multiple rules', () => {
            $scope.origin = {
                email: 'kinogam@gmail.com'
            };

            rules = {
                email: 'email | maxLen: 14'
            };

            expectInvalid('origin');
        });

        it('should support custom rule', () => {
            $scope.myValue = '5abc6';

            rules = {
                myValue: 'customRule'
            };

            r = $rules($scope, rules);

            r.$setRule('customRule', (value) => {
                return /^\d[a-z]+\d$/.test(value);
            });

            expectValid();

            $scope.myValue = 'a323b';

            expectInvalid();
        });

        it('should has field validate status', () => {
            $scope.hello = '123';

            rules = {
                hello: 'number'
            };

            r = $rules($scope, rules);

            run();

            expect(r.hello.$invalid).toBe(false);

        });

        it('can use wildcards', () => {
            $scope.obj = {
                firstName: 'kino',
                lastName: 'tesr'
            };

            rules = {
                '*': 'required'
            };

            r = $rules($scope, 'obj', rules);

            run();

            expect(r.$invalid).toBe(false);
        });

        it('should restrict property equal a specify value', () => {
            $scope.dep = 'can';
            $scope.arr = 'can';

            rules = {
                'dep': 'eq:"can"',
                'arr': 'eq: "can" '
            };

            r = $rules($scope, rules);

            run();

            expect(r.$invalid).toBe(false);

            $scope.arr = 'cand';

            run();

            expect(r.$invalid).toBe(true);
        });

        it('should restrict property not equal a specify value', () => {
            $scope.dep = 'can';

            rules = {
                'dep': `!eq:'can'`
            };

            r = $rules($scope, rules);

            run();

            expect(r.$invalid).toBe(true);
        });

        it('should restrict property equal another property', () => {
            $scope.pwd = 'kino';
            $scope.confirmPwd = 'kino';

            rules = {
                'confirmPwd': 'eq: pwd'
            };

            r = $rules($scope, rules);

            run();

            expect(r.$invalid).toBe(false);
        });




        /*
         describe('error description', () => {
         it('can define an error description', () => {
         $scope.num = 'abc';
         let rules = {
         num: 'number'
         },
         message = {
         'num:number': 'number format error'
         };

         let r = $rules($scope, rules, message);

         $scope.$digest();

         expect(r.num.$invalid)
         });
         });*/

    });


    describe('group validate', () => {

        it('should validate group', () => {
            $scope.query = {
                segments: [
                    {
                        depCity: 'can',
                        arrCity: 'lax',
                        date: '2016-08-06'
                    },
                    {
                        depCity: 'lax',
                        arrCity: 'can',
                        date: ''
                    }
                ]
            };

            rules = {
                '*': 'required'
            };

            r = $rules($scope, 'query.segments', rules);

            run();

            expect(r[1].date.$invalid).toBe(true);
            expect(r.$invalid).toBe(true);
        });

        it('should validate dynamic array', () => {
            $scope.query = {
                segments: [
                    {
                        depCity: 'can',
                        arrCity: 'lax',
                        date: '2016-08-06'
                    },
                    {
                        depCity: 'lax',
                        arrCity: 'can',
                        date: '2016-08-08'
                    }
                ]
            };

            rules = {
                '*': 'required'
            };

            r = $rules($scope, 'query.segments', rules);

            run();

            expect(r.$invalid).toBe(false);

            $scope.query.segments.push({
                depCity: '',
                arrCity: '',
                date: ''
            });

            run();

            expect(r.$invalid).toBe(true);
        });

        it('should watch the value change', () => {
            $scope.query = {
                segments: [
                    {
                        depCity: 'lax',
                        arrCity: 'can',
                        date: ''
                    }
                ]
            };

            rules = {
                '*': 'required'
            };

            r = $rules($scope, 'query.segments', rules);

            run();

            expect(r.$invalid).toBe(true);

            $scope.query.segments[0] = {
                depCity: 'lax',
                arrCity: 'can',
                date: '2016-08-08'
            };

            run();

            expect(r.$invalid).toBe(false);

            $scope.query.segments[0].date = '';

            run();

            expect(r.$invalid).toBe(true);
        });

    });


});

