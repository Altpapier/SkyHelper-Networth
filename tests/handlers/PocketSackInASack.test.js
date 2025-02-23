const PocketSackInASackHandler = require('../../calculators/handlers/PocketSackInASack');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'LARGE_HUSBANDRY_SACK',
            extraAttributes: { sack_pss: 3 },
            price: 100,
            calculation: [],
        },
        prices: { POCKET_SACK_IN_A_SACK: 12000000 },
        shouldApply: true,
        expectedPriceChange: 3 * 12000000 * APPLICATION_WORTH.pocketSackInASack,
        expectedCalculation: [
            {
                id: 'POCKET_SACK_IN_A_SACK',
                type: 'POCKET_SACK_IN_A_SACK',
                price: 3 * 12000000 * APPLICATION_WORTH.pocketSackInASack,
                count: 3,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'LARGE_HUSBANDRY_SACK',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(PocketSackInASackHandler, testCases).runTests();
