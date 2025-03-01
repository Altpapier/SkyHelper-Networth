const ArtOfPeaceHandler = require('../../calculators/handlers/ArtOfPeace');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'LEATHER_CHESTPLATE',
            extraAttributes: { artOfPeaceApplied: 1 },
            price: 100,
            calculation: [],
        },
        prices: { THE_ART_OF_PEACE: 50000000 },
        shouldApply: true,
        expectedPriceChange: 50000000 * APPLICATION_WORTH.artOfPeace,
        expectedCalculation: [
            {
                id: 'THE_ART_OF_PEACE',
                type: 'THE_ART_OF_PEACE',
                price: 50000000 * APPLICATION_WORTH.artOfPeace,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'LEATHER_CHESTPLATE',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(ArtOfPeaceHandler, testCases).runTests();
