const DivanPowderCoatingHandler = require('../../calculators/handlers/DivanPowderCoating');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'DIVAN_DRILL',
            extraAttributes: { divan_powder_coating: 1 },
            price: 100,
            calculation: [],
        },
        prices: { DIVAN_POWDER_COATING: 100000000 },
        shouldApply: true,
        expectedPriceChange: 100000000 * APPLICATION_WORTH.divanPowderCoating,
        expectedCalculation: [
            {
                id: 'DIVAN_POWDER_COATING',
                type: 'DIVAN_POWDER_COATING',
                price: 100000000 * APPLICATION_WORTH.divanPowderCoating,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'DIVAN_DRILL',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(DivanPowderCoatingHandler, testCases).runTests();
