const ProfileNetworthCalculator = require('../calculators/ProfileNetworthCalculator');
const { describe, test, expect, beforeEach, afterEach, afterAll } = require('@jest/globals');
const { ValidationError } = require('../helper/errors');
const { getPrices } = require('../helper/prices');
const { parseItems } = require('../helper/parseItems');
const networthManager = require('../managers/NetworthManager');
const axios = require('axios');

jest.mock('../helper/prices');
jest.mock('../helper/parseItems');
jest.mock('../managers/NetworthManager', () => ({
    clearIntervals: jest.fn(),
    itemsIntervalInstance: null,
    __clearAllIntervals: () => {
        if (global.itemsIntervalInstance) {
            clearInterval(global.itemsIntervalInstance);
            global.itemsIntervalInstance = null;
        }
    },
}));

describe('ProfileNetworthCalculator', () => {
    let validProfileData;
    let mockPrices;
    let mockItems;
    let axiosInstance;
    let mockAxios;

    beforeEach(() => {
        validProfileData = {
            profile: { bank_account: 1000 },
            player_data: {},
            leveling: {},
            currencies: { coin_purse: 500 },
        };

        mockPrices = {
            EXAMPLE_ITEM: { price: 100 },
        };

        mockItems = {
            inventory: [
                {
                    tag: {
                        display: {
                            Name: 'Diamond Sword',
                        },
                        ExtraAttributes: { id: 'DIAMOND_SWORD' },
                    },
                    Count: 1,
                },
            ],
            armor: [],
            pets: [],
        };

        getPrices.mockResolvedValue(mockPrices);
        parseItems.mockResolvedValue(mockItems);
        networthManager.itemsPromise = Promise.resolve();
        networthManager.getCachePrices = jest.fn().mockReturnValue(true);
        networthManager.getPricesRetries = jest.fn().mockReturnValue(3);
        networthManager.getCachePricesTime = jest.fn().mockReturnValue(300);
        networthManager.getOnlyNetworth = jest.fn().mockReturnValue(false);
        networthManager.getIncludeItemData = jest.fn().mockReturnValue(true);
        networthManager.getSortItems = jest.fn().mockReturnValue(true);
        networthManager.getStackItems = jest.fn().mockReturnValue(true);
        networthManager.clearIntervals = jest.fn();

        mockAxios = jest.spyOn(axios, 'get').mockImplementation(() => {
            const promise = Promise.resolve({ data: { items: [] } });
            promise.cancel = jest.fn();
            return promise;
        });
        mockAxios.isAxiosRequest = true;
        mockAxios.cancel = jest.fn();

        axiosInstance = axios.create();
        axiosInstance.CancelToken = axios.CancelToken;
        axiosInstance.source = axios.CancelToken.source();

        jest.clearAllMocks();
        jest.useFakeTimers();

        if (networthManager.clearIntervals) {
            networthManager.clearIntervals();
        }
    });

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();

        if (axiosInstance && axiosInstance.source) {
            axiosInstance.source.cancel('Test cleanup');
        }

        if (networthManager.clearIntervals) {
            networthManager.clearIntervals();
        }

        if (global.gc) global.gc();
    });

    afterAll(async () => {
        jest.clearAllTimers();
        jest.useRealTimers();

        if (axios.get.mockRestore) {
            axios.get.mockRestore();
        }

        if (axiosInstance && axiosInstance.source) {
            axiosInstance.source.cancel('Test cleanup');
        }

        if (networthManager.clearIntervals) {
            networthManager.clearIntervals();
        }

        await new Promise((resolve) => setTimeout(resolve, 100));

        if (global.gc) global.gc();
    });

    describe('Constructor', () => {
        test('should create instance with valid profile data', () => {
            const calculator = new ProfileNetworthCalculator(validProfileData, {}, 2000);
            expect(calculator).toBeInstanceOf(ProfileNetworthCalculator);
            expect(calculator.bankBalance).toBe(2000);
            expect(calculator.purse).toBe(500);
            expect(calculator.personalBankBalance).toBe(1000);
        });

        test('should throw ValidationError with invalid profile data', () => {
            expect(() => new ProfileNetworthCalculator(null)).toThrow(ValidationError);
            expect(() => new ProfileNetworthCalculator({})).toThrow(ValidationError);
            expect(() => new ProfileNetworthCalculator('invalid')).toThrow(ValidationError);
        });

        test('should handle default values', () => {
            const calculator = new ProfileNetworthCalculator(validProfileData);
            expect(calculator.bankBalance).toBe(0);
            expect(calculator.museumData).toEqual({});
            expect(calculator.items).toEqual({});
        });
    });

    describe('getNetworth', () => {
        test('should calculate basic networth', async () => {
            const calculator = ProfileNetworthCalculator.fromPreParsed(validProfileData, mockItems, 1000);
            const result = await calculator.getNetworth();

            expect(result).toHaveProperty('networth');
            expect(result).toHaveProperty('unsoulboundNetworth');
            expect(result).toHaveProperty('purse', 500);
            expect(result).toHaveProperty('bank', 1000);
            expect(result).toHaveProperty('types');
        });

        test('should respect onlyNetworth option', async () => {
            const calculator = ProfileNetworthCalculator.fromPreParsed(validProfileData, mockItems, 1000);
            const result = await calculator.getNetworth({ onlyNetworth: true });

            expect(result.types).toBeDefined();
            Object.values(result.types).forEach((category) => {
                expect(category.items).toBeUndefined();
            });
        });

        test.each([false, true])('should count Safari Belt modifiers once across containers (onlyNetworth: %s)', async (onlyNetworth) => {
            const safariBelt = () => ({
                tag: {
                    display: {
                        Name: 'Bloodshot Safari Belt',
                        Lore: ['§8§l* §8Soulbound §8§l*'],
                    },
                    ExtraAttributes: {
                        id: 'SAFARI_BELT',
                        modifier: 'blood_shot',
                    },
                },
                Count: 1,
            });
            const items = {
                inventory: [safariBelt(), safariBelt()],
                storage: [safariBelt()],
            };
            const prices = {
                SAFARI_BELT: 0,
                SHRIVELED_CORNEA: 100,
            };
            const calculator = ProfileNetworthCalculator.fromPreParsed(validProfileData, items, 0);

            const result = await calculator.getNetworth({ prices, onlyNetworth });

            expect(result.networth).toBe(1600);
            expect(result.types.inventory.total).toBe(100);
            expect(result.types.storage.total).toBe(0);

            if (!onlyNetworth) {
                expect(result.types.inventory.items).toEqual([
                    expect.objectContaining({
                        id: 'SAFARI_BELT',
                        price: 100,
                        count: 2,
                        calculation: [{ id: 'SHRIVELED_CORNEA', type: 'REFORGE', price: 100, count: 1 }],
                    }),
                ]);
                expect(result.types.storage.items).toEqual([]);
            }
        });
    });

    describe('Edge cases', () => {
        test('should handle empty inventory', async () => {
            const calculator = ProfileNetworthCalculator.fromPreParsed(validProfileData, { inventory: [] }, 1000);
            const result = await calculator.getNetworth();
            expect(result.noInventory).toBe(true);
        });

        test('should handle undefined items', async () => {
            const calculator = ProfileNetworthCalculator.fromPreParsed(
                validProfileData,
                {
                    inventory: [undefined, null, {}],
                },
                1000,
            );
            const result = await calculator.getNetworth();
            expect(result.networth).toBeDefined();
        });
    });
});
