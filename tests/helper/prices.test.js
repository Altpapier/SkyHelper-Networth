const { describe, expect, beforeEach, afterEach } = require('@jest/globals');
const axios = require('axios');
const { getPrices } = require('../../helper/prices');
const { PricesError } = require('../../helper/errors');

jest.mock('axios');

describe('getPrices', () => {
    const mockPricesData = {
        HYPERION: 1000000,
        ASPECT_OF_THE_VOID: 500000,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    it('should fetch prices successfully', async () => {
        axios.get.mockResolvedValueOnce({ data: mockPricesData });

        const prices = await getPrices();

        expect(prices).toEqual(mockPricesData);
        expect(axios.get).toHaveBeenCalledWith('https://raw.githubusercontent.com/SkyHelperBot/Prices/main/pricesV2.json');
    });

    it('should use cached prices when available and within cache time', async () => {
        axios.get.mockResolvedValueOnce({ data: mockPricesData });

        await getPrices(true, 2500);
        axios.get.mockClear();

        const prices = await getPrices(true, 2500);

        expect(prices).toEqual(mockPricesData);
        expect(axios.get).not.toHaveBeenCalled();
    });

    it('should bypass cache when cache is set to false', async () => {
        axios.get.mockResolvedValueOnce({ data: mockPricesData });
        await getPrices(true, 2500);
        axios.get.mockClear();

        axios.get.mockResolvedValueOnce({ data: mockPricesData });
        await getPrices(false, 2500);

        expect(axios.get).toHaveBeenCalled();
    });

    it('should throw PricesError immediately when retries is 0', async () => {
        await expect(getPrices(true, 2500, 0)).rejects.toThrow(PricesError);
        expect(axios.get).not.toHaveBeenCalled();
    });

    it('should handle concurrent requests by returning the same promise', async () => {
        axios.get.mockReset();

        const mockPromise = Promise.resolve({ data: mockPricesData });
        axios.get.mockImplementation(() => mockPromise);

        const promise1 = getPrices(false);
        const promise2 = getPrices(false);

        const [result1, result2] = await Promise.all([promise1, promise2]);

        expect(result1).toEqual(mockPricesData);
        expect(result2).toEqual(mockPricesData);
        expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it('should handle error with unknown status code', async () => {
        const error = new Error('Unknown error');
        error.response = { status: undefined };
        axios.get.mockRejectedValueOnce(error);

        await expect(getPrices(false, 2500, 1)).rejects.toThrow('Failed to retrieve prices');
    });

    it('should throw an error when retries is negative', async () => {
        const error = new Error('Unknown error');
        error.response = { status: undefined };
        axios.get.mockRejectedValueOnce(error);

        await expect(getPrices(true, 2500, -1)).rejects.toThrow(PricesError);
    });
});
