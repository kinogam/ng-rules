describe('ng-rules', () => {
    let $rules,
        $scope;

    beforeEach(angular.mock.module('ng-rules'));

    beforeEach(inject((_$rules_, $rootScope) => {
        $rules = _$rules_;
        $scope = $rootScope.$new();
    }));

    function expectValidatePass(rules, value){
        var r = $rules($scope, 'origin', rules);

        $scope.$digest();

        expect(r.isPass).toBe(value !== undefined? value: true);
    }

    function expectValidateFaill(rules){
        return expectValidatePass(rules, false);
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

                expectValidatePass(rules);
            });

            it('should fail with property is empty string', () => {
                $scope.origin = {
                        p1: ''
                    };
                var rules = {
                        p1: 'required'
                    };

                expectValidateFaill(rules);
            });

            it('should fail with property is spaces', () => {
                $scope.origin = {
                        p1: '   '
                    };
                var rules = {
                        p1: 'required'
                    };

                expectValidateFaill(rules);
            });


            it('should pass with property as Number', () => {
                $scope.origin = {
                        num: '123'
                    };

                var rules = {
                        num: 'number'
                    };

                expectValidatePass(rules);
            });

            it('should faill with property is not Number', () => {
                $scope.origin = {
                        num: 'abc'
                    };

                var  rules = {
                        num: 'number'
                    };

                expectValidateFaill(rules);
            });

            it("don't need to specify a collection name", () => {
                $scope.num = 'abc';

                var rules = {
                    num: 'number'
                };

                var r = $rules($scope, rules);

                $scope.$digest();

                expect(r.isPass).toBeFalsy();
            });



        });

 /*       describe('error description', () => {
            it('can define an error description', () => {
                $scope.
            });
        });*/

    });

});