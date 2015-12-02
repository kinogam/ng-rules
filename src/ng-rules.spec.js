describe('ng-rules', () => {
    let $rules,
        $rootScope;

    beforeEach(angular.mock.module('ng-rules'));

    beforeEach(inject((_$rules_, _$rootScope_) => {
        $rules = _$rules_;
        $rootScope = _$rootScope_;
    }));

    describe('single validate', () => {

        describe('base', () => {

            it('should pass with property as Number', () => {

                var obj = {
                        num: '123'
                    },
                    rules = {
                        num: 'number'
                    };

                var r = $rules(obj, rules),
                    result = false;

                r.validate().then(() => {
                    result = true;
                });

                $rootScope.$digest();

                expect(result).toBe(true);

            });

        });

    });

});