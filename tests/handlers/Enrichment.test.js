const EnrichmentHandler = require('../../calculators/handlers/Enrichment');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'ARTIFACT_OF_CONTROL',
            extraAttributes: { talisman_enrichment: 'magic_find' },
            price: 100,
            calculation: [],
        },
        prices: { TALISMAN_ENRICHMENT_MAGIC_FIND: 9000000, TALISMAN_ENRICHMENT_CRITICAL_CHANCE: 8000000 },
        shouldApply: true,
        expectedPriceChange: 8000000 * APPLICATION_WORTH.enrichment,
        expectedCalculation: [
            {
                id: 'MAGIC_FIND',
                type: 'TALISMAN_ENRICHMENT',
                price: 8000000 * APPLICATION_WORTH.enrichment,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'ARTIFACT_OF_CONTROL',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(EnrichmentHandler, testCases).runTests();
