const EnchantedBookHandler = require('../../calculators/handlers/EnchantedBook');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly with single enchantment',
        item: {
            itemId: 'ENCHANTED_BOOK',
            extraAttributes: { enchantments: { ultimate_legion: 7 } },
            basePrice: 0,
            price: 100,
            calculation: [],
        },
        prices: { ENCHANTMENT_ULTIMATE_LEGION_7: 50000000 },
        shouldApply: true,
        expectedNewBasePrice: 50000000,
        expectedCalculation: [
            {
                id: 'ULTIMATE_LEGION_7',
                type: 'ENCHANT',
                price: 50000000,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly with mutliple enchantment',
        item: {
            itemId: 'ENCHANTED_BOOK',
            extraAttributes: { enchantments: { ultimate_legion: 7, smite: 7 } },
            basePrice: 0,
            price: 100,
            calculation: [],
        },
        prices: { ENCHANTMENT_ULTIMATE_LEGION_7: 50000000, ENCHANTMENT_SMITE_7: 4000000 },
        shouldApply: true,
        expectedNewBasePrice: 50000000 * APPLICATION_WORTH.enchantments + 4000000 * APPLICATION_WORTH.enchantments,
        expectedCalculation: [
            {
                id: 'ULTIMATE_LEGION_7',
                type: 'ENCHANT',
                price: 50000000 * APPLICATION_WORTH.enchantments,
                count: 1,
            },
            {
                id: 'SMITE_7',
                type: 'ENCHANT',
                price: 4000000 * APPLICATION_WORTH.enchantments,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly with no price',
        item: {
            itemId: 'ENCHANTED_BOOK',
            extraAttributes: { enchantments: { smite: 5 } },
            basePrice: 0,
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: true,
        expectedNewBasePrice: 0,
        expectedCalculation: [],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'IRON_SWORD',
            extraAttributes: { enchantments: { sharpness: 5 } },
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'ENCHANTED_BOOK',
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(EnchantedBookHandler, testCases).runTests();
