const PickonimbusHandler = require('../../calculators/handlers/Pickonimbus');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'PICKONIMBUS',
            extraAttributes: { pickonimbus_durability: 2500 },
            price: 50000,
            base: 50000,
            calculation: [],
        },
        prices: {},
        shouldApply: true,
        expectedPriceChange: -25000,
        expectedCalculation: [
            {
                id: 'PICKONIMBUS_DURABLITY',
                type: 'PICKONIMBUS',
                price: -25000,
                count: 2500,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'PICKONIMBUS',
            extraAttributes: {},
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
            itemId: 'PICKONIMBUS',
            extraAttributes: { pickonimbus_durability: 5000 },
            price: 50000,
            base: 50000,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(PickonimbusHandler, testCases).runTests();
