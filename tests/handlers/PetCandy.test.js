const PetCandyHandler = require('../../calculators/handlers/PetCandy');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            petData: { candyUsed: 10 },
            level: { xpMax: 25000000, level: 100 },
            price: 100000,
            base: 100000,
            calculation: [],
        },
        prices: {},
        shouldApply: true,
        expectedPriceChange: 100000 * APPLICATION_WORTH.petCandy - 100000,
        expectedCalculation: [
            {
                id: 'CANDY',
                type: 'PET_CANDY',
                price: 100000 * APPLICATION_WORTH.petCandy - 100000,
                count: 10,
            },
        ],
    },
    {
        description: 'Applies correctly with cap and level 100',
        item: {
            petData: { candyUsed: 10 },
            level: { xpMax: 25000000, level: 100 },
            price: 100000000,
            base: 100000000,
            calculation: [],
        },
        prices: {},
        shouldApply: true,
        expectedPriceChange: -5000000,
        expectedCalculation: [
            {
                id: 'CANDY',
                type: 'PET_CANDY',
                price: -5000000,
                count: 10,
            },
        ],
    },
    {
        description: 'Applies correctly with cap and not level 100',
        item: {
            petData: { candyUsed: 10 },
            level: { xpMax: 25000000, level: 90 },
            price: 100000000,
            base: 100000000,
            calculation: [],
        },
        prices: {},
        shouldApply: true,
        expectedPriceChange: -2500000,
        expectedCalculation: [
            {
                id: 'CANDY',
                type: 'PET_CANDY',
                price: -2500000,
                count: 10,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            petData: {},
            level: { xpMax: 25000000 },
            price: 50000,
            base: 50000,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
    {
        description: 'Does not apply',
        item: {
            petData: { exp: 35000000, candyUsed: 10 },
            level: { xpMax: 25000000 },
            price: 50000,
            base: 50000,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(PetCandyHandler, testCases).runTests();
