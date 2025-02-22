const { starCosts, starCost } = require('../../helper/essenceStars');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

describe('essenceStars', () => {
    describe('starCost', () => {
        test('should calculate essence star cost correctly', () => {
            const prices = { ESSENCE_WITHER: 100 };
            const upgrade = { essence_type: 'WITHER', amount: 2 };
            const star = 1;

            const result = starCost(prices, upgrade, star);

            expect(result).toEqual({
                id: 'WITHER_ESSENCE',
                type: 'STAR',
                price: 200 * APPLICATION_WORTH.essence,
                count: 2,
                star: 1,
            });
        });

        test('should calculate essence star cost correctly without amount', () => {
            const prices = { ESSENCE_WITHER: 100 };
            const upgrade = { essence_type: 'WITHER' };
            const star = 1;

            const result = starCost(prices, upgrade, star);

            expect(result).toEqual({
                id: 'WITHER_ESSENCE',
                type: 'STAR',
                price: 0,
                count: 0,
                star: 1,
            });
        });

        test('should calculate item star cost correctly', () => {
            const prices = { WITHER_CHESTPLATE: 50 };
            const upgrade = { item_id: 'WITHER_CHESTPLATE', amount: 3 };

            const result = starCost(prices, upgrade);

            expect(result).toEqual({
                id: 'WITHER_CHESTPLATE',
                type: 'PRESTIGE',
                price: 150,
                count: 3,
            });
        });

        test('should return undefined if price not found', () => {
            const prices = {};
            const upgrade = {
                item_id: 'UNKNOWN_ITEM',
                amount: 1,
            };

            const result = starCost(prices, upgrade);

            expect(result).toBeUndefined();
        });
    });

    describe('starCosts', () => {
        test('should calculate total cost for upgrades without prestige item', () => {
            const upgrades = [{ essence_type: 'WITHER', amount: 2 }, [{ item_id: 'WITHER_CHESTPLATE', amount: 1 }]];
            const prices = { ESSENCE_WITHER: 100, WITHER_CHESTPLATE: 50 };
            const calculation = [];

            const result = starCosts(prices, calculation, upgrades);

            expect(result).toBe(200 * APPLICATION_WORTH.essence + 50);
            expect(calculation).toHaveLength(2);
        });

        test('should calculate total cost with prestige item', () => {
            const prices = { ESSENCE_WITHER: 100, PRESTIGE_ITEM: 1000 };
            const upgrades = [{ essence_type: 'WITHER', amount: 2 }];
            const prestigeItem = 'PRESTIGE_ITEM';
            const calculation = [];

            const result = starCosts(prices, calculation, upgrades, prestigeItem);

            expect(result).toBe(200 * APPLICATION_WORTH.essence + 1000);
            expect(calculation).toHaveLength(1);
        });
    });
});
