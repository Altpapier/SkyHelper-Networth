const ItemEnchantmentsHandler = require('../../calculators/handlers/ItemEnchantments');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    // region Normal enchantments
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
    // endregion
    // region Blocked item-specific enchantments
    {
        description: 'Applies correctly with blocked item-specific enchantment',
        item: {
            itemId: 'ADVANCED_GARDENING_HOE',
            extraAttributes: { enchantments: { replenish: 1, turbo_cane: 1 } },
            price: 100,
            calculation: [],
        },
        prices: { ENCHANTMENT_REPLENISH_1: 1500000, ENCHANTMENT_TURBO_CANE_1: 5000 },
        shouldApply: true,
        expectedPriceChange: 5000 * APPLICATION_WORTH.enchantments,
        expectedCalculation: [
            {
                id: 'TURBO_CANE_1',
                type: 'ENCHANTMENT',
                price: 5000 * APPLICATION_WORTH.enchantments,
                count: 1,
            },
        ],
    },
    // endregion
    // region Ignored enchantments
    {
        description: 'Applies correctly with ignored enchantment',
        item: {
            itemId: 'IRON_SWORD',
            extraAttributes: { enchantments: { scavenger: 5, smite: 6 } },
            price: 100,
            calculation: [],
        },
        prices: { ENCHANTMENT_SCAVENGER_5: 300000, ENCHANTMENT_SMITE_6: 10 },
        shouldApply: true,
        expectedPriceChange: 10 * APPLICATION_WORTH.enchantments,
        expectedCalculation: [
            {
                id: 'SMITE_6',
                type: 'ENCHANTMENT',
                price: 10 * APPLICATION_WORTH.enchantments,
                count: 1,
            },
        ],
    },
    // endregion
    // region Stacking enchantments
    {
        description: 'Applies correctly with stacking enchantment',
        item: {
            itemId: 'DIVAN_DRILL',
            extraAttributes: { enchantments: { compact: 10 } },
            price: 100,
            calculation: [],
        },
        prices: { ENCHANTMENT_COMPACT_1: 6000000 },
        shouldApply: true,
        expectedPriceChange: 6000000 * APPLICATION_WORTH.enchantments,
        expectedCalculation: [
            {
                id: 'COMPACT_1',
                type: 'ENCHANTMENT',
                price: 6000000 * APPLICATION_WORTH.enchantments,
                count: 1,
            },
        ],
    },
    // endregion
    // region Silex
    {
        description: 'Applies correctly without silex',
        item: {
            itemId: 'DIAMOND_PICKAXE',
            extraAttributes: { enchantments: { efficiency: 5 } },
            price: 100,
            calculation: [],
        },
        prices: { SIL_EX: 4500000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly with silex',
        item: {
            itemId: 'DIAMOND_PICKAXE',
            extraAttributes: { enchantments: { efficiency: 10 } },
            price: 100,
            calculation: [],
        },
        prices: { SIL_EX: 4500000 },
        shouldApply: true,
        expectedPriceChange: 5 * 4500000 * APPLICATION_WORTH.silex,
        expectedCalculation: [
            {
                id: 'SIL_EX',
                type: 'SILEX',
                price: 5 * 4500000 * APPLICATION_WORTH.silex,
                count: 5,
            },
        ],
    },
    {
        description: 'Applies correctly stonk without silex',
        item: {
            itemId: 'STONK_PICKAXE',
            extraAttributes: { enchantments: { efficiency: 6 } },
            price: 100,
            calculation: [],
        },
        prices: { SIL_EX: 4500000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly stonk with silex',
        item: {
            itemId: 'STONK_PICKAXE',
            extraAttributes: { enchantments: { efficiency: 10 } },
            price: 100,
            calculation: [],
        },
        prices: { SIL_EX: 4500000 },
        shouldApply: true,
        expectedPriceChange: 4 * 4500000 * APPLICATION_WORTH.silex,
        expectedCalculation: [
            {
                id: 'SIL_EX',
                type: 'SILEX',
                price: 4 * 4500000 * APPLICATION_WORTH.silex,
                count: 4,
            },
        ],
    },
    {
        description: 'Applies correctly promising spade without silex',
        item: {
            itemId: 'PROMISING_SPADE',
            extraAttributes: { enchantments: { efficiency: 10 } },
            price: 100,
            calculation: [],
        },
        prices: { SIL_EX: 4500000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    // endregion
    // region Golden Bounty
    {
        description: 'Applies correctly without golden bounty',
        item: {
            itemId: 'IRON_SWORD',
            extraAttributes: { enchantments: { scavenger: 5 } },
            price: 100,
            calculation: [],
        },
        prices: { GOLDEN_BOUNTY: 30000000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly with golden bounty',
        item: {
            itemId: 'IRON_SWORD',
            extraAttributes: { enchantments: { scavenger: 6 } },
            price: 100,
            calculation: [],
        },
        prices: { GOLDEN_BOUNTY: 30000000 },
        shouldApply: true,
        expectedPriceChange: 30000000 * APPLICATION_WORTH.enchantmentUpgrades,
        expectedCalculation: [
            {
                id: 'GOLDEN_BOUNTY',
                type: 'ENCHANTMENT_UPGRADE',
                price: 30000000 * APPLICATION_WORTH.enchantmentUpgrades,
                count: 1,
            },
        ],
    },
    // endregion
    // region A Beginner's Guide To Pesthunting
    {
        description: 'Applies correctly without pesthunting guide',
        item: {
            itemId: 'FERMENTO_LEGGINGS',
            extraAttributes: { enchantments: { pesterminator: 5 } },
            price: 100,
            calculation: [],
        },
        prices: { PESTHUNTING_GUIDE: 10000000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly with pesthunting guide',
        item: {
            itemId: 'FERMENTO_LEGGINGS',
            extraAttributes: { enchantments: { pesterminator: 6 } },
            price: 100,
            calculation: [],
        },
        prices: { PESTHUNTING_GUIDE: 10000000 },
        shouldApply: true,
        expectedPriceChange: 10000000 * APPLICATION_WORTH.enchantmentUpgrades,
        expectedCalculation: [
            {
                id: 'PESTHUNTING_GUIDE',
                type: 'ENCHANTMENT_UPGRADE',
                price: 10000000 * APPLICATION_WORTH.enchantmentUpgrades,
                count: 1,
            },
        ],
    },
    // endregion
    // region Gold Bottle Cap
    {
        description: 'Applies correctly without gold bottle cap',
        item: {
            itemId: 'ROD_OF_THE_SEA',
            extraAttributes: { enchantments: { luck_of_the_sea: 6 } },
            price: 100,
            calculation: [],
        },
        prices: { GOLD_BOTTLE_CAP: 28000000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly with gold bottle cap',
        item: {
            itemId: 'ROD_OF_THE_SEA',
            extraAttributes: { enchantments: { luck_of_the_sea: 7 } },
            price: 100,
            calculation: [],
        },
        prices: { GOLD_BOTTLE_CAP: 28000000 },
        shouldApply: true,
        expectedPriceChange: 28000000 * APPLICATION_WORTH.enchantmentUpgrades,
        expectedCalculation: [
            {
                id: 'GOLD_BOTTLE_CAP',
                type: 'ENCHANTMENT_UPGRADE',
                price: 28000000 * APPLICATION_WORTH.enchantmentUpgrades,
                count: 1,
            },
        ],
    },
    // endregion
    // region Does not apply
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
    // endregion
];

new BaseHandlerTest(ItemEnchantmentsHandler, testCases).runTests();
