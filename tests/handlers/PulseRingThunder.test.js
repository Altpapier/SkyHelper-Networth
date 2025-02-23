const PulseRingThunderHandler = require('../../calculators/handlers/PulseRingThunder');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'PULSE_RING',
            extraAttributes: { thunder_charge: 100000 },
            price: 100,
            calculation: [],
        },
        prices: { THUNDER_IN_A_BOTTLE: 3000000 },
        shouldApply: true,
        expectedPriceChange: 2 * 3000000 * APPLICATION_WORTH.thunderInABottle,
        expectedCalculation: [
            {
                id: 'THUNDER_IN_A_BOTTLE',
                type: 'THUNDER_CHARGE',
                price: 2 * 3000000 * APPLICATION_WORTH.thunderInABottle,
                count: 2,
            },
        ],
    },
    {
        description: 'Applies correctly when above max',
        item: {
            itemId: 'PULSE_RING',
            extraAttributes: { thunder_charge: 5050000 },
            price: 100,
            calculation: [],
        },
        prices: { THUNDER_IN_A_BOTTLE: 3000000 },
        shouldApply: true,
        expectedPriceChange: 100 * 3000000 * APPLICATION_WORTH.thunderInABottle,
        expectedCalculation: [
            {
                id: 'THUNDER_IN_A_BOTTLE',
                type: 'THUNDER_CHARGE',
                price: 100 * 3000000 * APPLICATION_WORTH.thunderInABottle,
                count: 100,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'PULSE_RING',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(PulseRingThunderHandler, testCases).runTests();
