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
    // region Troubled Bubble
    {
        description: 'Applies correctly without troubled bubble',
        item: {
            itemId: 'ROD_OF_THE_SEA',
            extraAttributes: { enchantments: { piscary: 6 } },
            price: 100,
            calculation: [],
        },
        prices: { TROUBLED_BUBBLE: 150000000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly with troubled bubble',
        item: {
            itemId: 'ROD_OF_THE_SEA',
            extraAttributes: { enchantments: { piscary: 7 } },
            price: 100,
            calculation: [],
        },
        prices: { TROUBLED_BUBBLE: 150000000 },
        shouldApply: true,
        expectedPriceChange: 150000000 * APPLICATION_WORTH.enchantmentUpgrades,
        expectedCalculation: [
            {
                id: 'TROUBLED_BUBBLE',
                type: 'ENCHANTMENT_UPGRADE',
                price: 150000000 * APPLICATION_WORTH.enchantmentUpgrades,
                count: 1,
            },
        ],
    },
    // endregion
    // region Severed Pincer
    {
        description: 'Applies correctly without severed pincer',
        item: {
            itemId: 'ROD_OF_THE_SEA',
            extraAttributes: { enchantments: { frail: 6 } },
            price: 100,
            calculation: [],
        },
        prices: { SEVERED_PINCER: 4000000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly with severed pincer',
        item: {
            itemId: 'ROD_OF_THE_SEA',
            extraAttributes: { enchantments: { frail: 7 } },
            price: 100,
            calculation: [],
        },
        prices: { SEVERED_PINCER: 4000000 },
        shouldApply: true,
        expectedPriceChange: 4000000 * APPLICATION_WORTH.enchantmentUpgrades,
        expectedCalculation: [
            {
                id: 'SEVERED_PINCER',
                type: 'ENCHANTMENT_UPGRADE',
                price: 4000000 * APPLICATION_WORTH.enchantmentUpgrades,
                count: 1,
            },
        ],
    },
    // endregion
    // region Octopus Tendril
    {
        description: 'Applies correctly without octopus tendril',
        item: {
            itemId: 'ROD_OF_THE_SEA',
            extraAttributes: { enchantments: { spiked_hook: 6 } },
            price: 100,
            calculation: [],
        },
        prices: { OCTOPUS_TENDRIL: 4500000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly with octopus tendril',
        item: {
            itemId: 'ROD_OF_THE_SEA',
            extraAttributes: { enchantments: { spiked_hook: 7 } },
            price: 100,
            calculation: [],
        },
        prices: { OCTOPUS_TENDRIL: 4500000 },
        shouldApply: true,
        expectedPriceChange: 4500000 * APPLICATION_WORTH.enchantmentUpgrades,
        expectedCalculation: [
            {
                id: 'OCTOPUS_TENDRIL',
                type: 'ENCHANTMENT_UPGRADE',
                price: 4500000 * APPLICATION_WORTH.enchantmentUpgrades,
                count: 1,
            },
        ],
    },
    // endregion
    // region Chain of the End Times
    {
        description: 'Applies correctly without chain of the end times',
        item: {
            itemId: 'ROD_OF_THE_SEA',
            extraAttributes: { enchantments: { charm: 5 } },
            price: 100,
            calculation: [],
        },
        prices: { CHAIN_END_TIMES: 2000000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly with chain of the end times',
        item: {
            itemId: 'ROD_OF_THE_SEA',
            extraAttributes: { enchantments: { charm: 6 } },
            price: 100,
            calculation: [],
        },
        prices: { CHAIN_END_TIMES: 2000000 },
        shouldApply: true,
        expectedPriceChange: 2000000 * APPLICATION_WORTH.enchantmentUpgrades,
        expectedCalculation: [
            {
                id: 'CHAIN_END_TIMES',
                type: 'ENCHANTMENT_UPGRADE',
                price: 2000000 * APPLICATION_WORTH.enchantmentUpgrades,
                count: 1,
            },
        ],
    },
    // endregion
    // endregion
    // region Fateful Stinger
    {
        description: 'Applies correctly without chain of the end times',
        item: {
            itemId: 'HYPERION',
            extraAttributes: { enchantments: { venomous: 6 } },
            price: 100,
            calculation: [],
        },
        prices: { FATEFUL_STINGER: 1000000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly with chain of the end times',
        item: {
            itemId: 'HYPERION',
            extraAttributes: { enchantments: { venomous: 7 } },
            price: 100,
            calculation: [],
        },
        prices: { FATEFUL_STINGER: 1000000 },
        shouldApply: true,
        expectedPriceChange: 1000000 * APPLICATION_WORTH.enchantmentUpgrades,
        expectedCalculation: [
            {
                id: 'FATEFUL_STINGER',
                type: 'ENCHANTMENT_UPGRADE',
                price: 1000000 * APPLICATION_WORTH.enchantmentUpgrades,
                count: 1,
            },
        ],
    },
    // endregion
    // region Severed Hand
    {
        description: 'Applies correctly without severed hand',
        item: {
            itemId: 'IRON_SWORD',
            extraAttributes: { enchantments: { smite: 6 } },
            price: 100,
            calculation: [],
        },
        prices: { SEVERED_HAND: 10000000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly with severed hand',
        item: {
            itemId: 'IRON_SWORD',
            extraAttributes: { enchantments: { smite: 7 } },
            price: 100,
            calculation: [],
        },
        prices: { SEVERED_HAND: 10000000 },
        shouldApply: true,
        expectedPriceChange: 10000000 * APPLICATION_WORTH.enchantmentUpgrades,
        expectedCalculation: [
            {
                id: 'SEVERED_HAND',
                type: 'ENCHANTMENT_UPGRADE',
                price: 10000000 * APPLICATION_WORTH.enchantmentUpgrades,
                count: 1,
            },
        ],
    },
    // endregion
    // region End Stone Idol
    {
        description: 'Applies correctly without end stone idol',
        item: {
            itemId: 'HYPERION',
            extraAttributes: { enchantments: { ender_slayer: 6 } },
            price: 100,
            calculation: [],
        },
        prices: { ENDSTONE_IDOL: 62000000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly with end stone idol',
        item: {
            itemId: 'HYPERION',
            extraAttributes: { enchantments: { ender_slayer: 7 } },
            price: 100,
            calculation: [],
        },
        prices: { ENDSTONE_IDOL: 62000000 },
        shouldApply: true,
        expectedPriceChange: 62000000 * APPLICATION_WORTH.enchantmentUpgrades,
        expectedCalculation: [
            {
                id: 'ENDSTONE_IDOL',
                type: 'ENCHANTMENT_UPGRADE',
                price: 62000000 * APPLICATION_WORTH.enchantmentUpgrades,
                count: 1,
            },
        ],
    },
    // endregion
    // region Ensnared Snail
    {
        description: 'Applies correctly without ensnared snail',
        item: {
            itemId: 'IRON_SWORD',
            extraAttributes: { enchantments: { bane_of_arthropods: 6 } },
            price: 100,
            calculation: [],
        },
        prices: { ENSNARED_SNAIL: 4000000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly with ensnared snail',
        item: {
            itemId: 'IRON_SWORD',
            extraAttributes: { enchantments: { bane_of_arthropods: 7 } },
            price: 100,
            calculation: [],
        },
        prices: { ENSNARED_SNAIL: 4000000 },
        shouldApply: true,
        expectedPriceChange: 4000000 * APPLICATION_WORTH.enchantmentUpgrades,
        expectedCalculation: [
            {
                id: 'ENSNARED_SNAIL',
                type: 'ENCHANTMENT_UPGRADE',
                price: 4000000 * APPLICATION_WORTH.enchantmentUpgrades,
                count: 1,
            },
        ],
    },
    // endregion
    // region Turbo Gourd
    {
        description: 'Applies correctly without turbo gourd',
        item: {
            itemId: 'THEORETICAL_HOE_WHEAT_3',
            extraAttributes: { enchantments: { turbo_wheat: 5 } },
            price: 100,
            calculation: [],
        },
        prices: { TURBO_GOURD: 2000000, ENCHANTED_TURBO_GOURD: 10000000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly with turbo gourd',
        item: {
            itemId: 'THEORETICAL_HOE_WHEAT_3',
            extraAttributes: { enchantments: { turbo_wheat: 6 } },
            price: 100,
            calculation: [],
        },
        prices: { TURBO_GOURD: 2000000, ENCHANTED_TURBO_GOURD: 10000000 },
        shouldApply: true,
        expectedPriceChange: 2000000 * APPLICATION_WORTH.enchantmentUpgrades,
        expectedCalculation: [
            {
                id: 'TURBO_GOURD',
                type: 'ENCHANTMENT_UPGRADE',
                price: 2000000 * APPLICATION_WORTH.enchantmentUpgrades,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly with enchanted turbo gourd',
        item: {
            itemId: 'THEORETICAL_HOE_WHEAT_3',
            extraAttributes: { enchantments: { turbo_wheat: 7 } },
            price: 100,
            calculation: [],
        },
        prices: { TURBO_GOURD: 2000000, ENCHANTED_TURBO_GOURD: 10000000 },
        shouldApply: true,
        expectedPriceChange: (2000000 + 10000000) * APPLICATION_WORTH.enchantmentUpgrades,
        expectedCalculation: [
            {
                id: 'TURBO_GOURD',
                type: 'ENCHANTMENT_UPGRADE',
                price: 2000000 * APPLICATION_WORTH.enchantmentUpgrades,
                count: 1,
            },
            {
                id: 'ENCHANTED_TURBO_GOURD',
                type: 'ENCHANTMENT_UPGRADE',
                price: 10000000 * APPLICATION_WORTH.enchantmentUpgrades,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies turbo crop upgrades once per item',
        item: {
            itemId: 'THEORETICAL_HOE_WHEAT_3',
            extraAttributes: { enchantments: { turbo_wheat: 7, turbo_cane: 7 } },
            price: 100,
            calculation: [],
        },
        prices: { TURBO_GOURD: 2000000, ENCHANTED_TURBO_GOURD: 10000000 },
        shouldApply: true,
        expectedPriceChange: (2000000 + 10000000) * APPLICATION_WORTH.enchantmentUpgrades,
        expectedCalculation: [
            {
                id: 'TURBO_GOURD',
                type: 'ENCHANTMENT_UPGRADE',
                price: 2000000 * APPLICATION_WORTH.enchantmentUpgrades,
                count: 1,
            },
            {
                id: 'ENCHANTED_TURBO_GOURD',
                type: 'ENCHANTMENT_UPGRADE',
                price: 10000000 * APPLICATION_WORTH.enchantmentUpgrades,
                count: 1,
            },
        ],
    },
    // endregion
    // region Prickly Creeper
    {
        description: 'Applies correctly without prickly creeper',
        item: {
            itemId: 'ROTTEN_LEGGINGS',
            extraAttributes: { enchantments: { thorns: 3 } },
            price: 100,
            calculation: [],
        },
        prices: { PRICKLY_CREEPER: 9000000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly with prickly creeper',
        item: {
            itemId: 'ROTTEN_LEGGINGS',
            extraAttributes: { enchantments: { thorns: 4 } },
            price: 100,
            calculation: [],
        },
        prices: { PRICKLY_CREEPER: 9000000 },
        shouldApply: true,
        expectedPriceChange: 9000000 * APPLICATION_WORTH.enchantmentUpgrades,
        expectedCalculation: [
            {
                id: 'PRICKLY_CREEPER',
                type: 'ENCHANTMENT_UPGRADE',
                price: 9000000 * APPLICATION_WORTH.enchantmentUpgrades,
                count: 1,
            },
        ],
    },
    // endregion
    // region Vibrant Coral
    {
        description: 'Applies correctly without vibrant coral',
        item: {
            itemId: 'DIVER_HELMET',
            extraAttributes: { enchantments: { scuba: 5 } },
            price: 100,
            calculation: [],
        },
        prices: { VIBRANT_CORAL: 3000000 },
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly with vibrant coral',
        item: {
            itemId: 'DIVER_HELMET',
            extraAttributes: { enchantments: { scuba: 6 } },
            price: 100,
            calculation: [],
        },
        prices: { VIBRANT_CORAL: 3000000 },
        shouldApply: true,
        expectedPriceChange: 3000000 * APPLICATION_WORTH.enchantmentUpgrades,
        expectedCalculation: [
            {
                id: 'VIBRANT_CORAL',
                type: 'ENCHANTMENT_UPGRADE',
                price: 3000000 * APPLICATION_WORTH.enchantmentUpgrades,
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
