const TransmissionTunerHandler = require('../../calculators/handlers/TransmissionTuner');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'ASPECT_OF_THE_END',
            extraAttributes: { tuned_transmission: 4 },
            price: 100,
            calculation: [],
        },
        prices: { TRANSMISSION_TUNER: 50000 },
        shouldApply: true,
        expectedPriceChange: 4 * 50000 * APPLICATION_WORTH.tunedTransmission,
        expectedCalculation: [
            {
                id: 'TRANSMISSION_TUNER',
                type: 'TRANSMISSION_TUNER',
                price: 4 * 50000 * APPLICATION_WORTH.tunedTransmission,
                count: 4,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'ASPECT_OF_THE_END',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(TransmissionTunerHandler, testCases).runTests();
