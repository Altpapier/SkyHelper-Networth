const NewYearCakeBagHandler = require('../../calculators/handlers/NewYearCakeBag');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'NEW_YEAR_CAKE_BAG',
            extraAttributes: { new_year_cake_bag_years: [0, 1, 2, 3, 4, 5] },
            price: 100,
            calculation: [],
        },
        prices: { NEW_YEAR_CAKE_1: 1000000, NEW_YEAR_CAKE_2: 2000000, NEW_YEAR_CAKE_3: 3000000, NEW_YEAR_CAKE_4: 4000000, NEW_YEAR_CAKE_5: 5000000 },
        shouldApply: true,
        expectedPriceChange: 1000000 + 2000000 + 3000000 + 4000000 + 5000000,
        expectedCalculation: [
            {
                id: 'NEW_YEAR_CAKES',
                type: 'NEW_YEAR_CAKES',
                price: 1000000 + 2000000 + 3000000 + 4000000 + 5000000,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'NEW_YEAR_CAKE_BAG',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'NEW_YEAR_CAKE_BAG',
            extraAttributes: { new_year_cake_bag_years: [] },
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(NewYearCakeBagHandler, testCases).runTests();
