const AvariceCoinsCollectedHandler = require('../../calculators/handlers/AvariceCoinsCollected');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'CROWN_OF_AVARICE',
            extraAttributes: { collected_coins: 500_000_000 },
            basePrice: 100,
            price: 100,
            calculation: [],
        },
        prices: { CROWN_OF_AVARICE: 250_000_000, CROWN_OF_AVARICE_1B: 4_500_000_000 },
        shouldApply: true,
        expectedNewBasePrice: 2_375_000_000,
        expectedCalculation: [
            {
                id: 'CROWN_OF_AVARICE',
                type: 'CROWN_OF_AVARICE',
                price: 2_375_000_000,
                count: 500_000_000,
            },
        ],
    },
    {
        description: 'Applies correctly when maxed',
        item: {
            itemId: 'CROWN_OF_AVARICE',
            extraAttributes: { collected_coins: 1_000_000_000 },
            basePrice: 100,
            price: 100,
            calculation: [],
        },
        prices: { CROWN_OF_AVARICE: 250_000_000, CROWN_OF_AVARICE_1B: 4_500_000_000 },
        shouldApply: true,
        expectedNewBasePrice: 4_500_000_000,
        expectedCalculation: [
            {
                id: 'CROWN_OF_AVARICE',
                type: 'CROWN_OF_AVARICE',
                price: 4_500_000_000,
                count: 1_000_000_000,
            },
        ],
    },
    {
        description: 'Applies correctly when over max',
        item: {
            itemId: 'CROWN_OF_AVARICE',
            extraAttributes: { collected_coins: 10_000_000_000 },
            basePrice: 100,
            price: 100,
            calculation: [],
        },
        prices: { CROWN_OF_AVARICE: 250_000_000, CROWN_OF_AVARICE_1B: 4_500_000_000 },
        shouldApply: true,
        expectedNewBasePrice: 4_500_000_000,
        expectedCalculation: [
            {
                id: 'CROWN_OF_AVARICE',
                type: 'CROWN_OF_AVARICE',
                price: 4_500_000_000,
                count: 1_000_000_000,
            },
        ],
    },
    {
        description: 'Applies correctly BigInt',
        item: {
            itemId: 'CROWN_OF_AVARICE',
            extraAttributes: { collected_coins: BigInt(1_000_000_000_000) },
            basePrice: 100,
            price: 100,
            calculation: [],
        },
        prices: { CROWN_OF_AVARICE: 250_000_000, CROWN_OF_AVARICE_1B: 4_500_000_000 },
        shouldApply: true,
        expectedNewBasePrice: 4_500_000_000,
        expectedCalculation: [
            {
                id: 'CROWN_OF_AVARICE',
                type: 'CROWN_OF_AVARICE',
                price: 4_500_000_000,
                count: 1_000_000_000,
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
    {
        description: 'Does not apply with 0 coins collected',
        item: {
            itemId: 'CROWN_OF_AVARICE',
            extraAttributes: { collected_coins: 0 },
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(AvariceCoinsCollectedHandler, testCases).runTests();
