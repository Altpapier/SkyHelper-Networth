const { starCosts, starCost } = require('../../helper/essenceStars');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

describe('essenceStars', () => {
    describe('starCost', () => {
        test('should calculate essence star cost correctly', () => {
            const prices = { ESSENCE_WITHER: 100 };
            const upgrade = { type: 'ESSENCE', essence_type: 'WITHER', amount: 10 };
            const star = 1;

            const result = starCost(prices, upgrade, star);

            expect(result).toEqual({
                type: 'STAR',
                id: 'WITHER_ESSENCE',
                price: 1000 * APPLICATION_WORTH.essence,
                count: 10,
                star: 1,
            });
        });

        test('should calculate prestige star cost correctly ', () => {
            const prices = { ESSENCE_WITHER: 100 };
            const upgrade = { type: 'ESSENCE', essence_type: 'WITHER', amount: 10 };

            const result = starCost(prices, upgrade);

            expect(result).toEqual({
                type: 'PRESTIGE',
                id: 'WITHER_ESSENCE',
                price: 1000 * APPLICATION_WORTH.essence,
                count: 10,
            });
        });

        test('should calculate item star cost correctly', () => {
            const prices = { HEAVY_PEARL: 10000 };
            const upgrade = { type: 'ITEM', item_id: 'HEAVY_PEARL', amount: 5 };
            const star = 10;

            const result = starCost(prices, upgrade, star);

            expect(result).toEqual({
                type: 'STAR',
                id: 'HEAVY_PEARL',
                price: 50000,
                count: 5,
                star: 10,
            });
        });
    });

    describe('starCosts', () => {
        test('should calculate star costs correctly', () => {
            const upgrades = [
                { type: 'ESSENCE', essence_type: 'CRIMSON', amount: 25500 },
                { type: 'ITEM', item_id: 'KUUDRA_TEETH', amount: 80 },
            ];
            const prices = { ESSENCE_CRIMSON: 100, KUUDRA_TEETH: 1000 };
            const prestigeItem = 'FIERY_FERVOR_LEGGINGS';
            const calculation = [];

            const result = starCosts(prices, calculation, upgrades, prestigeItem);

            expect(result).toBe(1992500);
            expect(calculation).toEqual([
                {
                    id: 'FIERY_FERVOR_LEGGINGS',
                    type: 'PRESTIGE',
                    price: 1992500,
                    count: 1,
                },
            ]);
        });
    });
});
