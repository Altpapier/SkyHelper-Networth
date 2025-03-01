const MasterStarsHandler = require('../../calculators/handlers/MasterStars');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'HYPERION',
            skyblockItem: {
                upgrade_costs: [
                    [{ type: 'ESSENCE', essence_type: 'WITHER', amount: 10 }],
                    [{ type: 'ESSENCE', essence_type: 'WITHER', amount: 20 }],
                    [{ type: 'ESSENCE', essence_type: 'WITHER', amount: 30 }],
                    [{ type: 'ESSENCE', essence_type: 'WITHER', amount: 40 }],
                    [{ type: 'ESSENCE', essence_type: 'WITHER', amount: 50 }],
                ],
            },
            extraAttributes: { upgrade_level: 10 },
            price: 100,
            calculation: [],
        },
        prices: { FIRST_MASTER_STAR: 15000000, SECOND_MASTER_STAR: 25000000, THIRD_MASTER_STAR: 50000000, FOURTH_MASTER_STAR: 90000000, FIFTH_MASTER_STAR: 100000000 },
        shouldApply: true,
        expectedPriceChange:
            15000000 * APPLICATION_WORTH.masterStar +
            25000000 * APPLICATION_WORTH.masterStar +
            50000000 * APPLICATION_WORTH.masterStar +
            90000000 * APPLICATION_WORTH.masterStar +
            100000000 * APPLICATION_WORTH.masterStar,
        expectedCalculation: [
            {
                id: 'FIRST_MASTER_STAR',
                type: 'MASTER_STAR',
                price: 15000000 * APPLICATION_WORTH.masterStar,
                count: 1,
            },
            {
                id: 'SECOND_MASTER_STAR',
                type: 'MASTER_STAR',
                price: 25000000 * APPLICATION_WORTH.masterStar,
                count: 1,
            },
            {
                id: 'THIRD_MASTER_STAR',
                type: 'MASTER_STAR',
                price: 50000000 * APPLICATION_WORTH.masterStar,
                count: 1,
            },
            {
                id: 'FOURTH_MASTER_STAR',
                type: 'MASTER_STAR',
                price: 90000000 * APPLICATION_WORTH.masterStar,
                count: 1,
            },
            {
                id: 'FIFTH_MASTER_STAR',
                type: 'MASTER_STAR',
                price: 100000000 * APPLICATION_WORTH.masterStar,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly',
        item: {
            itemId: 'HYPERION',
            skyblockItem: {
                upgrade_costs: [
                    [{ type: 'ESSENCE', essence_type: 'WITHER', amount: 10 }],
                    [{ type: 'ESSENCE', essence_type: 'WITHER', amount: 20 }],
                    [{ type: 'ESSENCE', essence_type: 'WITHER', amount: 30 }],
                    [{ type: 'ESSENCE', essence_type: 'WITHER', amount: 40 }],
                    [{ type: 'ESSENCE', essence_type: 'WITHER', amount: 50 }],
                ],
            },
            extraAttributes: { dungeon_item_level: '6b' },
            price: 100,
            calculation: [],
        },
        prices: { FIRST_MASTER_STAR: 15000000, SECOND_MASTER_STAR: 25000000, THIRD_MASTER_STAR: 50000000, FOURTH_MASTER_STAR: 90000000, FIFTH_MASTER_STAR: 100000000 },
        shouldApply: true,
        expectedPriceChange: 15000000 * APPLICATION_WORTH.masterStar,
        expectedCalculation: [
            {
                id: 'FIRST_MASTER_STAR',
                type: 'MASTER_STAR',
                price: 15000000 * APPLICATION_WORTH.masterStar,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'HYPERION',
            skyblockItem: {
                upgrade_costs: [
                    [{ type: 'ESSENCE', essence_type: 'WITHER', amount: 10 }],
                    [{ type: 'ESSENCE', essence_type: 'WITHER', amount: 20 }],
                    [{ type: 'ESSENCE', essence_type: 'WITHER', amount: 30 }],
                    [{ type: 'ESSENCE', essence_type: 'WITHER', amount: 40 }],
                    [{ type: 'ESSENCE', essence_type: 'WITHER', amount: 50 }],
                ],
            },
            extraAttributes: { upgrade_level: 5 },
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(MasterStarsHandler, testCases).runTests();
