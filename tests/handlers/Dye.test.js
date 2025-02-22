const DyeHandler = require('../../calculators/handlers/Dye');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'POWER_WITHER_LEGGINGS',
            extraAttributes: { dye_item: 'DYE_WARDEN' },
            price: 100,
            calculation: [],
        },
        prices: { DYE_WARDEN: 90000000 },
        shouldApply: true,
        expectedPriceChange: 90000000 * APPLICATION_WORTH.dye,
        expectedCalculation: [
            {
                id: 'DYE_WARDEN',
                type: 'DYE',
                price: 90000000 * APPLICATION_WORTH.dye,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'POWER_WITHER_LEGGINGS',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(DyeHandler, testCases).runTests();
