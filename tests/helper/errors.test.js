const { NetworthError, PricesError, ItemsError, ValidationError } = require('../../helper/errors');

describe('Custom Error Classes', () => {
    test('NetworthError should set message correctly', () => {
        const message = 'Networth calculation error';
        const error = new NetworthError(message);
        expect(error.message).toBe(message);
        expect(error instanceof Error).toBe(true);
    });

    test('PricesError should set message correctly', () => {
        const message = 'Price lookup error';
        const error = new PricesError(message);
        expect(error.message).toBe(message);
        expect(error instanceof Error).toBe(true);
    });

    test('ItemsError should set message correctly', () => {
        const message = 'Items processing error';
        const error = new ItemsError(message);
        expect(error.message).toBe(message);
        expect(error instanceof Error).toBe(true);
    });

    test('ValidationError should set message correctly', () => {
        const message = 'Validation failed';
        const error = new ValidationError(message);
        expect(error.message).toBe(message);
        expect(error instanceof Error).toBe(true);
    });
});
