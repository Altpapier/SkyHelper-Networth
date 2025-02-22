const { describe, expect, beforeEach, afterEach, afterAll } = require('@jest/globals');
const SkyBlockItemNetworthCalculator = require('../calculators/SkyBlockItemNetworthCalculator');
const networthManager = require('../managers/NetworthManager');
const { getPrices } = require('../helper/prices');

jest.mock('../managers/NetworthManager', () => ({
    getCachePrices: jest.fn(),
    getPricesRetries: jest.fn(),
    getCachePricesTime: jest.fn(),
    getIncludeItemData: jest.fn(),
    itemsPromise: Promise.resolve(),
    cleanup: jest.fn(),
}));
jest.mock('../helper/prices');
jest.mock('../calculators/helpers/handlers', () => [
    class MockHandler {
        applies() {
            return true;
        }
        calculate(item) {
            item.price += 100;
        }
    },
]);

jest.mock('../calculators/helpers/SkyBlockItemNetworthHelper', () => {
    return class MockSkyBlockItemNetworthHelper {
        constructor() {
            this.itemName = '';
            this.itemId = '';
            this.price = 0;
            this.base = 0;
            this.calculation = [];
        }
    };
});

describe('SkyBlockItemNetworthCalculator', () => {
    let calculator;
    let mockPrices;

    beforeEach(() => {
        jest.clearAllMocks();

        calculator = new SkyBlockItemNetworthCalculator();
        mockPrices = {
            DIAMOND_SWORD: 1000,
        };

        calculator.itemName = 'DIAMOND_SWORD';
        calculator.itemId = 'test_id';
        calculator.price = 1000;
        calculator.base = 1000;
        calculator.calculation = [];
        calculator.extraAttributes = { id: 'DIAMOND_SWORD' };
        calculator.itemData = {
            tag: {
                display: {
                    Name: 'Diamond Sword',
                },
                ExtraAttributes: { id: 'DIAMOND_SWORD' },
            },
            Count: 1,
        };

        calculator.getBasePrice = jest.fn();
        calculator.isCosmetic = jest.fn().mockReturnValue(false);
        calculator.isSoulbound = jest.fn().mockReturnValue(false);

        networthManager.getCachePrices.mockReturnValue(true);
        networthManager.getPricesRetries.mockReturnValue(3);
        networthManager.getCachePricesTime.mockReturnValue(300);
        networthManager.getIncludeItemData.mockReturnValue(false);
        networthManager.itemsPromise = Promise.resolve();

        getPrices.mockResolvedValue(mockPrices);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        if (networthManager.cleanup) {
            await networthManager.cleanup();
        }

        jest.useRealTimers();
        jest.clearAllTimers();
    });

    describe('getNetworth', () => {
        it('should calculate networth with default options', async () => {
            const result = await calculator.getNetworth();

            expect(result).toEqual({
                name: 'DIAMOND_SWORD',
                loreName: 'Diamond Sword',
                id: 'DIAMOND_SWORD',
                customId: 'test_id',
                price: 1100,
                base: 1000,
                calculation: [],
                count: 1,
                soulbound: false,
                cosmetic: false,
            });
        });

        it('should use provided prices without fetching new ones', async () => {
            await calculator.getNetworth({ prices: mockPrices });
            expect(getPrices).not.toHaveBeenCalled();
        });

        it('should include item data when specified', async () => {
            networthManager.getIncludeItemData.mockReturnValue(true);
            const result = await calculator.getNetworth();
            expect(result.item).toBeDefined();
            expect(result.item).toEqual(calculator.itemData);
        });

        it('should handle items with no count', async () => {
            calculator.itemData.Count = undefined;
            const result = await calculator.getNetworth();
            expect(result.count).toBe(1);
        });
    });

    describe('getNonCosmeticNetworth', () => {
        it('should return undefined for cosmetic items', async () => {
            calculator.isCosmetic.mockReturnValue(true);
            const result = await calculator.getNonCosmeticNetworth();
            expect(result).toBeUndefined();
        });

        it('should calculate networth for non-cosmetic items', async () => {
            const result = await calculator.getNonCosmeticNetworth();
            expect(result).toBeDefined();
            expect(result.cosmetic).toBe(false);
        });

        it('should pass nonCosmetic flag correctly', async () => {
            await calculator.getNonCosmeticNetworth();
            expect(calculator.nonCosmetic).toBe(true);
        });
    });

    describe('price calculation', () => {
        it('should apply handlers correctly', async () => {
            const result = await calculator.getNetworth();
            expect(result.price).toBe(1100);
        });

        it('should fetch prices when not provided', async () => {
            await calculator.getNetworth();
            expect(getPrices).toHaveBeenCalledWith(true, 3, 300);
        });

        it('should handle custom cache options', async () => {
            await calculator.getNetworth({
                cachePrices: false,
                pricesRetries: 5,
                cachePricesTime: 600,
            });
            expect(getPrices).toHaveBeenCalledWith(false, 5, 600);
        });

        it('should maintain price calculation history', async () => {
            calculator.calculation = [{ type: 'base', value: 1000 }];
            const result = await calculator.getNetworth();
            expect(result.calculation).toEqual([{ type: 'base', value: 1000 }]);
        });
    });

    describe('error handling', () => {
        it('should handle price fetch failures', async () => {
            getPrices.mockRejectedValue(new Error('Price fetch failed'));
            await expect(calculator.getNetworth()).rejects.toThrow('Price fetch failed');
        });

        it('should handle missing item data', async () => {
            calculator.itemData = null;
            await expect(calculator.getNetworth()).rejects.toThrow();
        });

        it('should handle missing extraAttributes', async () => {
            calculator.extraAttributes = null;
            await expect(calculator.getNetworth()).rejects.toThrow();
        });
    });
});
