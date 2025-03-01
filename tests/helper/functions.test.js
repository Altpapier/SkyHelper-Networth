const { titleCase, sleep } = require('../../helper/functions');

describe('titleCase', () => {
    test('converts string to title case', () => {
        expect(titleCase('hello_world')).toEqual('Hello World');
        expect(titleCase('duckysolucky_was_here')).toEqual('Duckysolucky Was Here');
        expect(titleCase('HYPERION 123')).toEqual('Hyperion 123');
        expect(titleCase('SUPERIOR_DRAGON_BOOTS')).toEqual('Superior Dragon Boots');
        expect(titleCase('altpapier_matt the cuber and ducky')).toEqual('Altpapier Matt The Cuber And Ducky');
    });

    test('handles empty string', () => {
        expect(titleCase('')).toBe('');
    });

    test('handles null/undefined', () => {
        expect(titleCase(null)).toBe('');
        expect(titleCase(undefined)).toBe('');
    });

    test('handles non-string input', () => {
        expect(titleCase(123)).toBe('');
        expect(titleCase({})).toBe('');
        expect(titleCase([])).toBe('');
    });
});

describe('sleep', () => {
    test('resolves after specified time', async () => {
        const start = Date.now();
        await sleep(100);
        const duration = Date.now() - start;
        // expect(duration).toEqual(100);
        expect(duration).toBeGreaterThanOrEqual(99);
    });
});
