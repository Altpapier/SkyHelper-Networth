const DrillPartsHandler = require('../../calculators/handlers/DrillParts');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'TITANIUM_DRILL_1',
            extraAttributes: { drill_part_engine: 'amber_polished_drill_engine', drill_part_fuel_tank: 'perfectly_cut_fuel_tank' },
            price: 100,
            calculation: [],
        },
        prices: { AMBER_POLISHED_DRILL_ENGINE: 250000000, PERFECTLY_CUT_FUEL_TANK: 100000000 },
        shouldApply: true,
        expectedPriceChange: 250000000 * APPLICATION_WORTH.drillPart + 100000000 * APPLICATION_WORTH.drillPart,
        expectedCalculation: [
            {
                id: 'PERFECTLY_CUT_FUEL_TANK',
                type: 'DRILL_PART',
                price: 100000000 * APPLICATION_WORTH.drillPart,
                count: 1,
            },
            {
                id: 'AMBER_POLISHED_DRILL_ENGINE',
                type: 'DRILL_PART',
                price: 250000000 * APPLICATION_WORTH.drillPart,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'TITANIUM_DRILL_1',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(DrillPartsHandler, testCases).runTests();
