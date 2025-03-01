const WoodSingularityHandler = require('../../calculators/handlers/WoodSingularity');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'TACTICIAN_SWORD',
            extraAttributes: { wood_singularity_count: 1 },
            price: 100,
            calculation: [],
        },
        prices: { WOOD_SINGULARITY: 7000000 },
        shouldApply: true,
        expectedPriceChange: 7000000 * APPLICATION_WORTH.woodSingularity,
        expectedCalculation: [
            {
                id: 'WOOD_SINGULARITY',
                type: 'WOOD_SINGULARITY',
                price: 7000000 * APPLICATION_WORTH.woodSingularity,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'TACTICIAN_SWORD',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(WoodSingularityHandler, testCases).runTests();
