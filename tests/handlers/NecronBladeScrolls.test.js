const NecronBladeScrollsHandler = require('../../calculators/handlers/NecronBladeScrolls');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'HYPERION',
            extraAttributes: { ability_scroll: ['WITHER_SHIELD_SCROLL', 'IMPLOSION_SCROLL'] },
            price: 100,
            calculation: [],
        },
        prices: { WITHER_SHIELD_SCROLL: 280000000, IMPLOSION_SCROLL: 300000000 },
        shouldApply: true,
        expectedPriceChange: 280000000 * APPLICATION_WORTH.necronBladeScroll + 300000000 * APPLICATION_WORTH.necronBladeScroll,
        expectedCalculation: [
            {
                id: 'WITHER_SHIELD_SCROLL',
                type: 'NECRON_SCROLL',
                price: 280000000 * APPLICATION_WORTH.necronBladeScroll,
                count: 1,
            },
            {
                id: 'IMPLOSION_SCROLL',
                type: 'NECRON_SCROLL',
                price: 300000000 * APPLICATION_WORTH.necronBladeScroll,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'HYPERION',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(NecronBladeScrollsHandler, testCases).runTests();
