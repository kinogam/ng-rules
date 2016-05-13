import pseudoFilter from  './pseudo-filter';

describe('pseudo-filter', () => {
    it('first child', () => {
        var fn = pseudoFilter(':first-child');

        expect(fn(0)).toBe(true);

        expect(fn(1)).toBe(false);
    });

    it('reverse', () => {
        var fn = pseudoFilter(':not(:first-child)');
        expect(fn(1)).toBe(true);
    });


    it('nth-child', () => {
        var fn = pseudoFilter(':nth-child(3)');

        expect(fn(2)).toBe(true);

        expect(fn(3)).toBe(false);
    });
});