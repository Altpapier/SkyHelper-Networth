const EtherwarpConduitHandler = require('../../calculators/handlers/EtherwarpConduit');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'ASPECT_OF_THE_VOID',
            extraAttributes: { ethermerge: '1b' },
            price: 100,
            calculation: [],
        },
        prices: { ETHERWARP_CONDUIT: 15000000 },
        shouldApply: true,
        expectedPriceChange: 15000000 * APPLICATION_WORTH.etherwarp,
        expectedCalculation: [
            {
                id: 'ETHERWARP_CONDUIT',
                type: 'ETHERWARP_CONDUIT',
                price: 15000000 * APPLICATION_WORTH.etherwarp,
                count: 1,
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

new BaseHandlerTest(EtherwarpConduitHandler, testCases).runTests();
