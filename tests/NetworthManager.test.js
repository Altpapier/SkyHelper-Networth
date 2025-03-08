const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');
const networthManager = require('../managers/NetworthManager');
const { sleep } = require('../helper/functions');
const axios = require('axios');

jest.mock('axios');
jest.mock('../helper/functions');
jest.mock('../constants/itemsMap', () => ({
    setItems: jest.fn(),
    itemsBackupLoaded: true,
}));

describe('NetworthManager', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    describe('Singleton Pattern', () => {
        test('should return same instance when creating multiple instances', () => {
            const instance1 = new (require('../managers/NetworthManager').constructor)({});
            const instance2 = new (require('../managers/NetworthManager').constructor)({});
            expect(instance1).toBe(instance2);
        });

        test('should initialize with default values', () => {
            expect(networthManager.getCachePrices()).toBe(true);
            expect(networthManager.getPricesRetries()).toBe(3);
            expect(networthManager.getCachePricesTime()).toBe(1000 * 60 * 5);
            expect(networthManager.getOnlyNetworth()).toBe(false);
            expect(networthManager.getSortItems()).toBe(true);
            expect(networthManager.getStackItems()).toBe(true);
            expect(networthManager.getIncludeItemData()).toBe(false);
        });
    });

    describe('Setter Methods', () => {
        test('should be chainable', () => {
            const instance = networthManager
                .setCachePrices(false)
                .setPricesRetries(5)
                .setCachePricesTime(1000)
                .setOnlyNetworth(true)
                .setSortItems(false)
                .setStackItems(false)
                .setIncludeItemData(true);

            expect(instance).toBe(networthManager);
        });

        test('should update values correctly', () => {
            networthManager.setCachePrices(false);
            expect(networthManager.getCachePrices()).toBe(false);

            networthManager.setPricesRetries(5);
            expect(networthManager.getPricesRetries()).toBe(5);

            networthManager.setCachePricesTime(1000);
            expect(networthManager.getCachePricesTime()).toBe(1000);

            networthManager.setOnlyNetworth(true);
            expect(networthManager.getOnlyNetworth()).toBe(true);

            networthManager.setSortItems(false);
            expect(networthManager.getSortItems()).toBe(false);

            networthManager.setStackItems(false);
            expect(networthManager.getStackItems()).toBe(false);

            networthManager.setIncludeItemData(true);
            expect(networthManager.getIncludeItemData()).toBe(true);
        });

        test('setItemsInterval should clear and set new interval', () => {
            const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
            const setIntervalSpy = jest.spyOn(global, 'setInterval');

            networthManager.setItemsInterval(5000);

            expect(clearIntervalSpy).toHaveBeenCalled();
            expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
        });
    });

    describe('updateItems Method', () => {
        test('should successfully update items on valid response', async () => {
            const mockItems = [{ id: 1, name: 'Test Item' }];
            axios.get.mockResolvedValueOnce({ data: { items: mockItems } });

            await networthManager.updateItems();

            expect(axios.get).toHaveBeenCalledWith('https://api.hypixel.net/v2/resources/skyblock/items', {
                timeout: 5000,
            });
        });

        test('should retry on failed response', async () => {
            axios.get.mockRejectedValueOnce(new Error('API Error')).mockResolvedValueOnce({ data: { items: [] } });

            await networthManager.updateItems(2, 100);

            expect(axios.get).toHaveBeenCalledTimes(2);
            expect(sleep).toHaveBeenCalledWith(100);
        });

        test('should use backup items when all retries fail', async () => {
            const axiosError = new Error('API Error');
            axiosError.response = { status: 500 };
            axios.get.mockRejectedValue(axiosError);

            const consoleSpy = jest.spyOn(console, 'warn');

            await networthManager.updateItems(2, 100);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Using backup items...'));
        });
    });
});
