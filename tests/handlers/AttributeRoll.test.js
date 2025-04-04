const AttributeRollHandler = require('../../calculators/handlers/AttributeRoll');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'BURNING_FERVOR_LEGGINGS',
            extraAttributes: { attributes: { mana_regeneration: 10, mana_pool: 10 } },
            basePrice: 10000000,
            price: 10000000,
            calculation: [],
        },
        prices: { BURNING_FERVOR_LEGGINGS_ROLL_MANA_POOL_ROLL_MANA_REGENERATION: 20000000 },
        shouldApply: true,
        expectedNewBasePrice: 20000000,
        expectedCalculation: [
            {
                id: 'ROLL_MANA_POOL_ROLL_MANA_REGENERATION',
                type: 'ATTRIBUTE_ROLL',
                price: 20000000,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly with attribute shard',
        item: {
            itemId: 'ATTRIBUTE_SHARD',
            extraAttributes: { attributes: { dominance: 1 } },
            basePrice: 100,
            price: 100,
            calculation: [],
        },
        prices: { ATTRIBUTE_SHARD_DOMINANCE: 1500000 },
        shouldApply: true,
        expectedNewBasePrice: 1500000,
        expectedCalculation: [
            {
                id: 'DOMINANCE',
                type: 'ATTRIBUTE_ROLL',
                price: 1500000,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'FERVOR_CHESTPLATE',
            extraAttributes: {},
            basePrice: 100,
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(AttributeRollHandler, testCases).runTests();
