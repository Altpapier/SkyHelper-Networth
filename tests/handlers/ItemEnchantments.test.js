const ItemEnchantmentsHandler = require('../../calculators/handlers/ItemEnchantments');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly',
        item: {
            itemId: 'ROTTEN_LEGGINGS',
            extraAttributes: { enchantments: { true_protection: 1, ultimate_legion: 5, rejuvenate: 5, growth: 6, protection: 5 } },
            price: 100,
            calculation: [],
        },
        prices: { ENCHANTMENT_TRUE_PROTECTION_1: 1000000, ENCHANTMENT_ULTIMATE_LEGION_5: 40000000, ENCHANTMENT_REJUVENATE_5: 450000, ENCHANTMENT_GROWTH_6: 3000000 },
        shouldApply: true,
        expectedPriceChange:
            1000000 * APPLICATION_WORTH.enchantments +
            40000000 * APPLICATION_WORTH.enchantments +
            450000 * APPLICATION_WORTH.enchantments +
            3000000 * APPLICATION_WORTH.enchantments,
        expectedCalculation: [
            {
                id: 'TRUE_PROTECTION_1',
                type: 'ENCHANTMENT',
                price: 1000000 * APPLICATION_WORTH.enchantments,
                count: 1,
            },
            {
                id: 'ULTIMATE_LEGION_5',
                type: 'ENCHANTMENT',
                price: 40000000 * APPLICATION_WORTH.enchantments,
                count: 1,
            },
            {
                id: 'REJUVENATE_5',
                type: 'ENCHANTMENT',
                price: 450000 * APPLICATION_WORTH.enchantments,
                count: 1,
            },
            {
                id: 'GROWTH_6',
                type: 'ENCHANTMENT',
                price: 3000000 * APPLICATION_WORTH.enchantments,
                count: 1,
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
    {
        description: 'Does not apply enchantment',
        item: {
            itemId: 'ENCHANTED_BOOK',
            extraAttributes: { enchantments: { fire_protection: 6 } },
            price: 100,
            calculation: [],
        },
        prices: { ENCHANTMENT_FIRE_PROTECTION_6: 1500 },
        shouldApply: false,
    },
];

new BaseHandlerTest(ItemEnchantmentsHandler, testCases).runTests();
