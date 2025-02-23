const PotatoBooksHandler = require('../../calculators/handlers/PotatoBooks');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'IRON_SWORD',
            extraAttributes: { hot_potato_count: 10 },
            price: 100,
            calculation: [],
        },
        prices: { HOT_POTATO_BOOK: 80000, FUMING_POTATO_BOOK: 1400000 },
        shouldApply: true,
        expectedPriceChange: 10 * 80000 * APPLICATION_WORTH.hotPotatoBook,
        expectedCalculation: [
            {
                id: 'HOT_POTATO_BOOK',
                type: 'HOT_POTATO_BOOK',
                price: 10 * 80000 * APPLICATION_WORTH.hotPotatoBook,
                count: 10,
            },
        ],
    },
    {
        description: 'Applies correctly with Fuming Potato Books',
        item: {
            itemId: 'IRON_SWORD',
            extraAttributes: { hot_potato_count: 15 },
            price: 100,
            calculation: [],
        },
        prices: { HOT_POTATO_BOOK: 80000, FUMING_POTATO_BOOK: 1400000 },
        shouldApply: true,
        expectedPriceChange: 10 * 80000 * APPLICATION_WORTH.hotPotatoBook + 5 * 1400000 * APPLICATION_WORTH.fumingPotatoBook,
        expectedCalculation: [
            {
                id: 'FUMING_POTATO_BOOK',
                type: 'FUMING_POTATO_BOOK',
                price: 5 * 1400000 * APPLICATION_WORTH.fumingPotatoBook,
                count: 5,
            },
            {
                id: 'HOT_POTATO_BOOK',
                type: 'HOT_POTATO_BOOK',
                price: 10 * 80000 * APPLICATION_WORTH.hotPotatoBook,
                count: 10,
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
];

new BaseHandlerTest(PotatoBooksHandler, testCases).runTests();
