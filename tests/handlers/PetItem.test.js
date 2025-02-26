const PetItemHandler = require('../../calculators/handlers/PetItem');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            petData: { heldItem: 'PET_ITEM_MINING_SKILL_BOOST_UNCOMMON' },
            price: 100,
            calculation: [],
        },
        prices: { PET_ITEM_MINING_SKILL_BOOST_UNCOMMON: 200000 },
        shouldApply: true,
        expectedPriceChange: 200000 * APPLICATION_WORTH.petItem,
        expectedCalculation: [
            {
                id: 'PET_ITEM_MINING_SKILL_BOOST_UNCOMMON',
                type: 'PET_ITEM',
                price: 200000 * APPLICATION_WORTH.petItem,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            petData: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(PetItemHandler, testCases).runTests();
