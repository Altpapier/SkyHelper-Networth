const ManaDisintegratorHandler = require('../../calculators/handlers/ManaDisintegrator');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'WAND_OF_ATONEMENT',
            extraAttributes: { mana_disintegrator_count: 10 },
            price: 100,
            calculation: [],
        },
        prices: { MANA_DISINTEGRATOR: 35000 },
        shouldApply: true,
        expectedPriceChange: 10 * 35000 * APPLICATION_WORTH.manaDisintegrator,
        expectedCalculation: [
            {
                id: 'MANA_DISINTEGRATOR',
                type: 'MANA_DISINTEGRATOR',
                price: 10 * 35000 * APPLICATION_WORTH.manaDisintegrator,
                count: 10,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'WAND_OF_ATONEMENT',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(ManaDisintegratorHandler, testCases).runTests();
