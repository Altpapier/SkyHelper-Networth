const ArtOfWarHandler = require('../../calculators/handlers/ArtOfWar');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'IRON_SWORD',
            extraAttributes: { art_of_war_count: 1 },
            price: 100,
            calculation: [],
        },
        prices: { THE_ART_OF_WAR: 20000000 },
        shouldApply: true,
        expectedPriceChange: 20000000 * APPLICATION_WORTH.artOfWar,
        expectedCalculation: [
            {
                id: 'THE_ART_OF_WAR',
                type: 'THE_ART_OF_WAR',
                price: 20000000 * APPLICATION_WORTH.artOfWar,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'IRON_SWORD',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(ArtOfWarHandler, testCases).runTests();
