describe('ng-rules', () => {
    let $rules;

    beforeEach(angular.mock.module('ng-rules'));

    beforeEach(inject((_$rules_) => {
        $rules = _$rules_;
    }));

    it('just a test', () => {
       expect(true).toBe(true);
    });

});