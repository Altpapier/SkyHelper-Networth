const RuneHandler = require('../../calculators/handlers/Rune');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'SUPERIOR_DRAGON_HELMET',
            extraAttributes: { runes: { GRAND_SEARING: 3 } },
            price: 100,
            calculation: [],
        },
        prices: { RUNE_GRAND_SEARING_3: 1200000000 },
        shouldApply: true,
        expectedPriceChange: 1200000000 * APPLICATION_WORTH.runes,
        expectedCalculation: [
            {
                id: 'RUNE_GRAND_SEARING_3',
                type: 'RUNE',
                price: 1200000000 * APPLICATION_WORTH.runes,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'IRON_HELMET',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
    {
        description: 'Does not apply with rune',
        item: {
            itemId: 'RUNE',
            extraAttributes: { runes: { GRAND_SEARING: 3 } },
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(RuneHandler, testCases).runTests();
