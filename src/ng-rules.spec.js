describe('ng-rules', () => {
    let $rules,
        rules,
        $scope,
        $timeout;

    beforeEach(angular.mock.module('ng-rules'));

    beforeEach(inject((_$rules_, $rootScope, _$timeout_) => {
        $rules = _$rules_;
        $scope = $rootScope.$new();
        $timeout = _$timeout_;
    }));

    function expectValid(value) {
        var r = $rules($scope, 'origin', rules);

        $scope.$digest();
        $timeout.flush();

        if(angular.isDefined(value)){
            expect(r.$invalid).toBe(value);
        }
        else{
            expect(r.$invalid).toBe(false);
        }
    }

    function expectInvalid() {
        return expectValid(true);
    }

    describe('single field validation', () => {

        it('should pass with property is not empty', () => {

            $scope.origin = {
                p1: 'hello'
            };

            rules = {
                p1: 'required'
            };

            expectValid();
        });

        it('should fail with property is empty string', () => {
            $scope.origin = {
                p1: ''
            };
            rules = {
                p1: 'required'
            };

            expectInvalid();
        });

        it('should fail with property is spaces', () => {
            $scope.origin = {
                p1: '   '
            };
            rules = {
                p1: 'required'
            };

            expectInvalid();
        });

        it("don't need to specify a collection name", () => {
            $scope.num = 'abc';

            rules = {
                num: 'number'
            };

            var r = $rules($scope, rules);

            $scope.$digest();

            expect(r.$invalid).toBe(true);
        });

        it('can watch variable change', () => {
            $scope.num = 'abc';

            rules = {
                num: 'number'
            };

            var r = $rules($scope, rules);

            $scope.$digest();

            $scope.num = '123';

            $scope.$digest();

            expect(r.$invalid).toBe(false);
        });

        it('should pass with property as Number', () => {
            $scope.origin = {
                num: '123'
            };

            rules = {
                num: 'number'
            };

            expectValid();
        });

        it('should faill with property is not Number', () => {
            $scope.origin = {
                num: 'abc'
            };

            rules = {
                num: 'number'
            };

            expectInvalid();
        });

        it('should pass with property as Email Address', () => {
            $scope.origin = {
                email: 'kinogam@gmail.com'
            };

            rules = {
                email: 'email'
            };

            expectValid();
        });

        it('should faill with property is not Address', () => {
            $scope.origin = {
                email: '@kinogl.com!'
            };

            rules = {
                email: 'email'
            };

            expectInvalid();
        });

        it('should allow empty field while not specify required', () => {
            $scope.origin = {
                email: null
            };

            rules = {
                email: 'email'
            };

            expectValid();
        });

        it('should be invalid if specify field required and the field is empty', () => {
            $scope.origin = {
                email: null
            };

            rules = {
                email: 'required | email'
            };

            expectInvalid();
        });

        it('should limit field length', () => {
            $scope.origin = {
                name: 'kino1'
            };

            rules = {
                name: 'maxLen: 5'
            };

            expectValid();
        });

        it('should be invalid if out of field length limit', () => {
            $scope.origin = {
                name: 'kinogam'
            };

            rules = {
                name: 'maxLen: 5'
            };

            expectInvalid();
        });

        it('should limit field by multiple rules', () => {
            $scope.origin = {
                email: 'kino@gmail.com'
            };

            rules = {
                name: 'email | maxLen: 14'
            };

            expectValid();
        });

        it('should be invalid if filed not match multiple rules', () => {
            $scope.origin = {
                email: 'kinogam@gmail.com'
            };

            rules = {
                email: 'email | maxLen: 14'
            };

            expectInvalid();
        });

/*        describe('group validate', () => {

            it('should pass if group data is validate')

        });*/
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

});