const Overclocker3000Handler = require('../../calculators/handlers/Overclocker3000');
const PolarvoidBookHandler = require('../../calculators/handlers/PolarvoidBook');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'THEORETICAL_HOE_POTATO_3',
            extraAttributes: { levelable_overclocks: 5 },
            price: 100,
            calculation: [],
        },
        prices: { OVERCLOCKER_3000: 250000 },
        shouldApply: true,
        expectedPriceChange: 5 * 250000 * APPLICATION_WORTH.overclocker3000,
        expectedCalculation: [
            {
                id: 'OVERCLOCKER_3000',
                type: 'OVERCLOCKER_3000',
                price: 5 * 250000 * APPLICATION_WORTH.overclocker3000,
                count: 5,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'THEORETICAL_HOE_POTATO_3',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(Overclocker3000Handler, testCases).runTests();
