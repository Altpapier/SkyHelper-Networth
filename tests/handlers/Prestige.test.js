const PrestigeHandler = require('../../calculators/handlers/Prestige');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'INFERNAL_FERVOR_CHESTPLATE',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: { HEAVY_PEARL: 220000, ESSENCE_CRIMSON: 1500, KUUDRA_TEETH: 12000 },
        shouldApply: true,
        expectedPriceChange:
            (90100 + 25500 + 16345 + 4500 + 3055 + 800 + 555 + 150) * 1500 * APPLICATION_WORTH.essence + (12 + 12 + 12 + 9) * 220000 + (80 + 50 + 20 + 10) * 12000,
        expectedCalculation: [
            { id: 'FIERY_FERVOR_CHESTPLATE', type: 'STARS', price: 90100 * 1500 * APPLICATION_WORTH.essence + 12 * 220000, count: 10 },
            { id: 'FIERY_FERVOR_CHESTPLATE', type: 'PRESTIGE', price: 25500 * 1500 * APPLICATION_WORTH.essence + 80 * 12000, count: 1 },
            { id: 'BURNING_FERVOR_CHESTPLATE', type: 'STARS', price: 16345 * 1500 * APPLICATION_WORTH.essence + 12 * 220000, count: 10 },
            { id: 'BURNING_FERVOR_CHESTPLATE', type: 'PRESTIGE', price: 4500 * 1500 * APPLICATION_WORTH.essence + 50 * 12000, count: 1 },
            { id: 'HOT_FERVOR_CHESTPLATE', type: 'STARS', price: 3055 * 1500 * APPLICATION_WORTH.essence + 12 * 220000, count: 10 },
            { id: 'HOT_FERVOR_CHESTPLATE', type: 'PRESTIGE', price: 800 * 1500 * APPLICATION_WORTH.essence + 20 * 12000, count: 1 },
            { id: 'FERVOR_CHESTPLATE', type: 'STARS', price: 555 * 1500 * APPLICATION_WORTH.essence + 9 * 220000, count: 10 },
            { id: 'FERVOR_CHESTPLATE', type: 'PRESTIGE', price: 150 * 1500 * APPLICATION_WORTH.essence + 10 * 12000, count: 1 },
        ],
    },
    {
        description: 'Applies correctly when has price',
        item: {
            itemId: 'INFERNAL_CRIMSON_BOOTS',
            extraAttributes: {},
            price: 350000000,
            calculation: [],
        },
        prices: { INFERNAL_CRIMSON_BOOTS: 350000000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
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
];

new BaseHandlerTest(PrestigeHandler, testCases).runTests();
