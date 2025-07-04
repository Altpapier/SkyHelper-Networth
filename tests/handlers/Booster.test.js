const BoosterHandler = require('../../calculators/handlers/Booster');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'FIGSTONE_AXE',
            extraAttributes: { boosters: ['sweep'] },
            price: 100,
            calculation: [],
        },
        prices: { SWEEP_BOOSTER: 100000 },
        shouldApply: true,
        expectedPriceChange: 100000 * APPLICATION_WORTH.booster,
        expectedCalculation: [
            {
                id: 'SWEEP_BOOSTER',
                type: 'BOOSTER',
                price: 100000 * APPLICATION_WORTH.booster,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'FIGSTONE_AXE',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(BoosterHandler, testCases).runTests();
