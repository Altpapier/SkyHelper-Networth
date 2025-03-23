const PrestigeHandler = require('../../calculators/handlers/Prestige');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

jest.mock('../../constants/itemsMap', () => {
    const itemsMapMock = new Map();
    itemsMapMock.set('FIERY_FERVOR_LEGGINGS', {
        upgrade_costs: [
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 5000 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 5600 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 6300 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 7000 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 8000 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 9000 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 10200 }],
            [
                { type: 'ESSENCE', essence_type: 'CRIMSON', amount: 11500 },
                { type: 'ITEM', item_id: 'HEAVY_PEARL', amount: 3 },
            ],
            [
                { type: 'ESSENCE', essence_type: 'CRIMSON', amount: 13000 },
                { type: 'ITEM', item_id: 'HEAVY_PEARL', amount: 4 },
            ],
            [
                { type: 'ESSENCE', essence_type: 'CRIMSON', amount: 14500 },
                { type: 'ITEM', item_id: 'HEAVY_PEARL', amount: 5 },
            ],
        ],
        prestige: {
            item_id: 'INFERNAL_FERVOR_LEGGINGS',
            costs: [
                { type: 'ESSENCE', essence_type: 'CRIMSON', amount: 25500 },
                { type: 'ITEM', item_id: 'KUUDRA_TEETH', amount: 80 },
            ],
        },
    });
    itemsMapMock.set('BURNING_FERVOR_LEGGINGS', {
        upgrade_costs: [
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 900 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 1000 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 1125 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 1270 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 1450 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 1650 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 1850 }],
            [
                { type: 'ESSENCE', essence_type: 'CRIMSON', amount: 2100 },
                { type: 'ITEM', item_id: 'HEAVY_PEARL', amount: 3 },
            ],
            [
                { type: 'ESSENCE', essence_type: 'CRIMSON', amount: 2350 },
                { type: 'ITEM', item_id: 'HEAVY_PEARL', amount: 4 },
            ],
            [
                { type: 'ESSENCE', essence_type: 'CRIMSON', amount: 2650 },
                { type: 'ITEM', item_id: 'HEAVY_PEARL', amount: 5 },
            ],
        ],
        prestige: {
            item_id: 'FIERY_FERVOR_LEGGINGS',
            costs: [
                { type: 'ESSENCE', essence_type: 'CRIMSON', amount: 4500 },
                { type: 'ITEM', item_id: 'KUUDRA_TEETH', amount: 50 },
            ],
        },
    });
    itemsMapMock.set('HOT_FERVOR_LEGGINGS', {
        upgrade_costs: [
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 170 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 190 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 215 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 240 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 270 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 300 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 340 }],
            [
                { type: 'ESSENCE', essence_type: 'CRIMSON', amount: 390 },
                { type: 'ITEM', item_id: 'HEAVY_PEARL', amount: 3 },
            ],
            [
                { type: 'ESSENCE', essence_type: 'CRIMSON', amount: 440 },
                { type: 'ITEM', item_id: 'HEAVY_PEARL', amount: 4 },
            ],
            [
                { type: 'ESSENCE', essence_type: 'CRIMSON', amount: 500 },
                { type: 'ITEM', item_id: 'HEAVY_PEARL', amount: 5 },
            ],
        ],
        prestige: {
            item_id: 'BURNING_FERVOR_LEGGINGS',
            costs: [
                { type: 'ESSENCE', essence_type: 'CRIMSON', amount: 800 },
                { type: 'ITEM', item_id: 'KUUDRA_TEETH', amount: 20 },
            ],
        },
    });
    itemsMapMock.set('FERVOR_LEGGINGS', {
        upgrade_costs: [
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 30 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 35 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 40 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 45 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 50 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 55 }],
            [{ type: 'ESSENCE', essence_type: 'CRIMSON', amount: 60 }],
            [
                { type: 'ESSENCE', essence_type: 'CRIMSON', amount: 70 },
                { type: 'ITEM', item_id: 'HEAVY_PEARL', amount: 2 },
            ],
            [
                { type: 'ESSENCE', essence_type: 'CRIMSON', amount: 80 },
                { type: 'ITEM', item_id: 'HEAVY_PEARL', amount: 3 },
            ],
            [
                { type: 'ESSENCE', essence_type: 'CRIMSON', amount: 90 },
                { type: 'ITEM', item_id: 'HEAVY_PEARL', amount: 4 },
            ],
        ],
        prestige: {
            item_id: 'HOT_FERVOR_LEGGINGS',
            costs: [
                { type: 'ESSENCE', essence_type: 'CRIMSON', amount: 150 },
                { type: 'ITEM', item_id: 'KUUDRA_TEETH', amount: 10 },
            ],
        },
    });

    return {
        getHypixelItemInformationFromId: jest.fn((id) => itemsMapMock.get(id)),
    };
});

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'INFERNAL_FERVOR_LEGGINGS',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {
            HEAVY_PEARL: 220000,
            ESSENCE_CRIMSON: 1500,
            KUUDRA_TEETH: 12000,
            BURNING_FERVOR_LEGGINGS: 30000000,
            HOT_FERVOR_LEGGINGS: 2000000,
            FERVOR_LEGGINGS: 1000000,
        },
        shouldApply: true,
        expectedPriceChange: (90100 + 25500 + 16345 + 4500) * 1500 * APPLICATION_WORTH.essence + (12 + 12) * 220000 + (80 + 50) * 12000 + 30000000,
        expectedCalculation: [
            { id: 'FIERY_FERVOR_LEGGINGS', type: 'STARS', price: 90100 * 1500 * APPLICATION_WORTH.essence + 12 * 220000, count: 10 },
            { id: 'FIERY_FERVOR_LEGGINGS', type: 'PRESTIGE', price: 25500 * 1500 * APPLICATION_WORTH.essence + 80 * 12000, count: 1 },
            { id: 'BURNING_FERVOR_LEGGINGS', type: 'STARS', price: 16345 * 1500 * APPLICATION_WORTH.essence + 12 * 220000, count: 10 },
            { id: 'BURNING_FERVOR_LEGGINGS', type: 'PRESTIGE', price: 4500 * 1500 * APPLICATION_WORTH.essence + 50 * 12000, count: 1 },
            { id: 'BURNING_FERVOR_LEGGINGS', type: 'BASE_PRESTIGE_ITEM', price: 30000000, count: 1 },
        ],
    },
    {
        description: 'Applies correctly when only base item has price',
        item: {
            itemId: 'INFERNAL_FERVOR_LEGGINGS',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: { HEAVY_PEARL: 220000, ESSENCE_CRIMSON: 1500, KUUDRA_TEETH: 12000, FERVOR_LEGGINGS: 1000000 },
        shouldApply: true,
        expectedPriceChange:
            (90100 + 25500 + 16345 + 4500 + 3055 + 800 + 555 + 150) * 1500 * APPLICATION_WORTH.essence +
            (12 + 12 + 12 + 9) * 220000 +
            (80 + 50 + 20 + 10) * 12000 +
            1000000,
        expectedCalculation: [
            { id: 'FIERY_FERVOR_LEGGINGS', type: 'STARS', price: 90100 * 1500 * APPLICATION_WORTH.essence + 12 * 220000, count: 10 },
            { id: 'FIERY_FERVOR_LEGGINGS', type: 'PRESTIGE', price: 25500 * 1500 * APPLICATION_WORTH.essence + 80 * 12000, count: 1 },
            { id: 'BURNING_FERVOR_LEGGINGS', type: 'STARS', price: 16345 * 1500 * APPLICATION_WORTH.essence + 12 * 220000, count: 10 },
            { id: 'BURNING_FERVOR_LEGGINGS', type: 'PRESTIGE', price: 4500 * 1500 * APPLICATION_WORTH.essence + 50 * 12000, count: 1 },
            { id: 'HOT_FERVOR_LEGGINGS', type: 'STARS', price: 3055 * 1500 * APPLICATION_WORTH.essence + 12 * 220000, count: 10 },
            { id: 'HOT_FERVOR_LEGGINGS', type: 'PRESTIGE', price: 800 * 1500 * APPLICATION_WORTH.essence + 20 * 12000, count: 1 },
            { id: 'FERVOR_LEGGINGS', type: 'STARS', price: 555 * 1500 * APPLICATION_WORTH.essence + 9 * 220000, count: 10 },
            { id: 'FERVOR_LEGGINGS', type: 'PRESTIGE', price: 150 * 1500 * APPLICATION_WORTH.essence + 10 * 12000, count: 1 },
            { id: 'FERVOR_LEGGINGS', type: 'BASE_PRESTIGE_ITEM', price: 1000000, count: 1 },
        ],
    },
    {
        description: 'Applies correctly with no prices',
        item: {
            itemId: 'INFERNAL_FERVOR_LEGGINGS',
            extraAttributes: {},
            price: 350000000,
            calculation: [],
        },
        prices: {},
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly item when has price',
        item: {
            itemId: 'INFERNAL_CRIMSON_BOOTS',
            extraAttributes: {},
            price: 350000000,
            calculation: [],
        },
        prices: { INFERNAL_CRIMSON_BOOTS: 350000000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'IRON_SWORD',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(PrestigeHandler, testCases).runTests();
