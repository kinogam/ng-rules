describe('ng-rules', () => {
    let $rules,
        $rootScope;

    beforeEach(angular.mock.module('ng-rules'));

    beforeEach(inject((_$rules_, _$rootScope_) => {
        $rules = _$rules_;
        $rootScope = _$rootScope_;
    }));

    function expectValidatePass(data, value){
        var r = $rules(data.origin, data.rules);

        $rootScope.$digest();

        expect(r.isPass).toBe(value !== undefined? value: true);
    }

    function expectValidateFaill(data){
        return expectValidatePass(data, false);
    }

    describe('single validate', () => {

        describe('base', () => {

            it('should pass with property is not empty', () => {
                var data = {
                    origin: {
                        p1: 'hello'
                    },
                    rules: {
                        p1: 'required'
                    }
                };

                expectValidatePass(data);
            });

            it('should fail with property is empty string', () => {
                var data = {
                    origin: {
                        p1: ''
                    },
                    rules: {
                        p1: 'required'
                    }
                };

                expectValidateFaill(data);
            });

            it('should fail with property is spaces', () => {
                var data = {
                    origin: {
                        p1: '   '
                    },
                    rules: {
                        p1: 'required'
                    }
                };

                expectValidateFaill(data);
            });


            it('should pass with property as Number', () => {
                var data = {
                    origin: {
                        num: '123'
                    },
                    rules: {
                        num: 'number'
                    }
                };

                expectValidatePass(data);
            });

/*            it('should faill with property is not Number', () => {
                var data = {
                    origin: {
                        num: 'abc'
                    },
                    rules: {
                        num: 'number'
                    }
                };

                expectValidateFaill(data);
            });*/

        });

    });

});