const PolarvoidBookHandler = require('../../calculators/handlers/PolarvoidBook');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'TITANIUM_DRILL_2',
            extraAttributes: { polarvoid: 5 },
            price: 100,
            calculation: [],
        },
        prices: { POLARVOID_BOOK: 2500000 },
        shouldApply: true,
        expectedPriceChange: 5 * 2500000 * APPLICATION_WORTH.polarvoidBook,
        expectedCalculation: [
            {
                id: 'POLARVOID_BOOK',
                type: 'POLARVOID_BOOK',
                price: 5 * 2500000 * APPLICATION_WORTH.polarvoidBook,
                count: 5,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'TITANIUM_DRILL_2',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(PolarvoidBookHandler, testCases).runTests();
