const FarmingForDummiesHandler = require('../../calculators/handlers/FarmingForDummies');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'THEORETICAL_HOE_CARROT_3',
            extraAttributes: { farming_for_dummies_count: 5 },
            price: 100,
            calculation: [],
        },
        prices: { FARMING_FOR_DUMMIES: 2000000 },
        shouldApply: true,
        expectedPriceChange: 5 * 2000000 * APPLICATION_WORTH.farmingForDummies,
        expectedCalculation: [
            {
                id: 'FARMING_FOR_DUMMIES',
                type: 'FARMING_FOR_DUMMIES',
                price: 5 * 2000000 * APPLICATION_WORTH.farmingForDummies,
                count: 5,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'THEORETICAL_HOE_CARROT_3',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(FarmingForDummiesHandler, testCases).runTests();
