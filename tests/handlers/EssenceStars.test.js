const EssenceStarsHandler = require('../../calculators/handlers/EssenceStars');
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
            extraAttributes: { dungeon_item_level: '3b' },
            price: 100,
            calculation: [],
        },
        prices: { ESSENCE_WITHER: 100 },
        shouldApply: true,
        expectedPriceChange: (10 + 20 + 30) * 100 * APPLICATION_WORTH.essence,
        expectedCalculation: [
            {
                id: 'WITHER_ESSENCE',
                type: 'STAR',
                price: 10 * 100 * APPLICATION_WORTH.essence,
                count: 10,
                star: 1,
            },
            {
                id: 'WITHER_ESSENCE',
                type: 'STAR',
                price: 20 * 100 * APPLICATION_WORTH.essence,
                count: 20,
                star: 2,
            },
            {
                id: 'WITHER_ESSENCE',
                type: 'STAR',
                price: 30 * 100 * APPLICATION_WORTH.essence,
                count: 30,
                star: 3,
            },
        ],
    },
    {
        description: 'Applies correctly when no prices',
        item: {
            itemId: 'HYPERION',
            skyblockItem: { upgrade_costs: [[{ type: 'ESSENCE', essence_type: 'WITHER', amount: 10 }]] },
            extraAttributes: { dungeon_item_level: '1b' },
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly when above range',
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
        prices: { ESSENCE_WITHER: 100 },
        shouldApply: true,
        expectedPriceChange: (10 + 20 + 30 + 40 + 50) * 100 * APPLICATION_WORTH.essence,
        expectedCalculation: [
            {
                id: 'WITHER_ESSENCE',
                type: 'STAR',
                price: 10 * 100 * APPLICATION_WORTH.essence,
                count: 10,
                star: 1,
            },
            {
                id: 'WITHER_ESSENCE',
                type: 'STAR',
                price: 20 * 100 * APPLICATION_WORTH.essence,
                count: 20,
                star: 2,
            },
            {
                id: 'WITHER_ESSENCE',
                type: 'STAR',
                price: 30 * 100 * APPLICATION_WORTH.essence,
                count: 30,
                star: 3,
            },
            {
                id: 'WITHER_ESSENCE',
                type: 'STAR',
                price: 40 * 100 * APPLICATION_WORTH.essence,
                count: 40,
                star: 4,
            },
            {
                id: 'WITHER_ESSENCE',
                type: 'STAR',
                price: 50 * 100 * APPLICATION_WORTH.essence,
                count: 50,
                star: 5,
            },
        ],
    },
    {
        description: 'Does not apply 1',
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
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
    {
        description: 'Does not apply 2',
        item: {
            itemId: 'GENERALS_ARMOR_OF_THE_RESISTANCE_LEGGINGS',
            skyblockItem: {},
            extraAttributes: { dungeon_item_level: '1b' },
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
    {
        description: 'Does not apply 3',
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
            extraAttributes: { upgrade_level: 0 },
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(EssenceStarsHandler, testCases).runTests();
