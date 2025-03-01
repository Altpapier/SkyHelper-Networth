const JalapenoBookHandler = require('../../calculators/handlers/JalapenoBook');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'SOS_FLARE',
            extraAttributes: { jalapeno_count: 1 },
            price: 100,
            calculation: [],
        },
        prices: { JALAPENO_BOOK: 31000000 },
        shouldApply: true,
        expectedPriceChange: 31000000 * APPLICATION_WORTH.jalapenoBook,
        expectedCalculation: [
            {
                id: 'JALAPENO_BOOK',
                type: 'JALAPENO_BOOK',
                price: 31000000 * APPLICATION_WORTH.jalapenoBook,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'SOS_FLARE',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(JalapenoBookHandler, testCases).runTests();
