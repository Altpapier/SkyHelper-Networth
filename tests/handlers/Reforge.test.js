const ReforgeHandler = require('../../calculators/handlers/Reforge');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'SUPERIOR_DRAGON_HELMET',
            extraAttributes: { modifier: 'renowned' },
            price: 100,
            calculation: [],
        },
        prices: { DRAGON_HORN: 10000000 },
        shouldApply: true,
        expectedPriceChange: 10000000 * APPLICATION_WORTH.reforge,
        expectedCalculation: [
            {
                id: 'DRAGON_HORN',
                type: 'REFORGE',
                price: 10000000 * APPLICATION_WORTH.reforge,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'IRON_HELMET',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
    {
        description: 'Does not apply with accessory',
        item: {
            itemId: 'BAT_TALISMAN',
            skyblockItem: { category: 'ACCESSORY' },
            extraAttributes: { modifier: 'strong' },
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(ReforgeHandler, testCases).runTests();
