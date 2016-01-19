describe('ng-rules', () => {
    let $rules,
        $scope;

    beforeEach(angular.mock.module('ng-rules'));

    beforeEach(inject((_$rules_, $rootScope) => {
        $rules = _$rules_;
        $scope = $rootScope.$new();
    }));

    function expectValid(rules, value) {
        var r = $rules($scope, 'origin', rules);

        $scope.$digest();

        if(value !== undefined){
            expect(r.$invalid).toBe(value);
        }
        else{
            expect(r.$invalid).toBe(false);
        }
    }

    function expectInvalid(rules) {
        return expectValid(rules, true);
    }

    describe('single validate', () => {

        describe('base', () => {

            it('should pass with property is not empty', () => {

                $scope.origin = {
                    p1: 'hello'
                };

                var rules = {
                    p1: 'required'
                };

                expectValid(rules);
            });

            it('should fail with property is empty string', () => {
                $scope.origin = {
                    p1: ''
                };
                var rules = {
                    p1: 'required'
                };

                expectInvalid(rules);
            });

            it('should fail with property is spaces', () => {
                $scope.origin = {
                    p1: '   '
                };
                var rules = {
                    p1: 'required'
                };

                expectInvalid(rules);
            });


            it('should pass with property as Number', () => {
                $scope.origin = {
                    num: '123'
                };

                var rules = {
                    num: 'number'
                };

                expectValid(rules);
            });

            it('should faill with property is not Number', () => {
                $scope.origin = {
                    num: 'abc'
                };

                var rules = {
                    num: 'number'
                };

                expectInvalid(rules);
            });

            it("don't need to specify a collection name", () => {
                $scope.num = 'abc';

                var rules = {
                    num: 'number'
                };

                var r = $rules($scope, rules);

                $scope.$digest();

                expect(r.$invalid).toBe(true);
            });

            it('can watch variable change', () => {
                $scope.num = 'abc';

                var rules = {
                    num: 'number'
                };

                var r = $rules($scope, rules);

                $scope.$digest();

                $scope.num = '123';

                $scope.$digest();

                expect(r.$invalid).toBe(false);
            });


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