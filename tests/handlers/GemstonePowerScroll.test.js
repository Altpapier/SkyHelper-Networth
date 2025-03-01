const GemstonePowerScrollHandler = require('../../calculators/handlers/GemstonePowerScroll');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'FLORID_ZOMBIE_SWORD',
            extraAttributes: { power_ability_scroll: 'RUBY_POWER_SCROLL' },
            price: 100,
            calculation: [],
        },
        prices: { RUBY_POWER_SCROLL: 650000 },
        shouldApply: true,
        expectedPriceChange: 650000 * APPLICATION_WORTH.gemstonePowerScroll,
        expectedCalculation: [
            {
                id: 'RUBY_POWER_SCROLL',
                type: 'GEMSTONE_POWER_SCROLL',
                price: 650000 * APPLICATION_WORTH.gemstonePowerScroll,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'FLORID_ZOMBIE_SWORD',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(GemstonePowerScrollHandler, testCases).runTests();
