const GemstonesHandler = require('../../calculators/handlers/Gemstones');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    {
        description: 'Applies correctly v1',
        item: {
            itemId: 'HYPERION',
            skyblockItem: {
                gemstone_slots: [
                    {
                        slot_type: 'SAPPHIRE',
                        costs: [
                            { type: 'COINS', coins: 250000 },
                            { type: 'ITEM', item_id: 'FLAWLESS_SAPPHIRE_GEM', amount: 4 },
                        ],
                    },
                    {
                        slot_type: 'COMBAT',
                        costs: [
                            { type: 'COINS', coins: 250000 },
                            { type: 'ITEM', item_id: 'FLAWLESS_JASPER_GEM', amount: 1 },
                            { type: 'ITEM', item_id: 'FLAWLESS_SAPPHIRE_GEM', amount: 1 },
                            { type: 'ITEM', item_id: 'FLAWLESS_RUBY_GEM', amount: 1 },
                            { type: 'ITEM', item_id: 'FLAWLESS_AMETHYST_GEM', amount: 1 },
                        ],
                    },
                ],
            },
            extraAttributes: {
                gems: {
                    COMBAT_0: { quality: 'PERFECT' },
                    unlocked_slots: ['SAPPHIRE_0', 'COMBAT_0'],
                    COMBAT_0_gem: 'SAPPHIRE',
                    SAPPHIRE_0: { quality: 'PERFECT' },
                },
            },
            price: 100,
            calculation: [],
        },
        prices: { PERFECT_SAPPHIRE_GEM: 16000000 },
        shouldApply: true,
        expectedPriceChange: 2 * 16000000 * APPLICATION_WORTH.gemstone,
        expectedCalculation: [
            {
                id: 'PERFECT_SAPPHIRE_GEM',
                type: 'GEMSTONE',
                price: 16000000 * APPLICATION_WORTH.gemstone,
                count: 1,
            },
            {
                id: 'PERFECT_SAPPHIRE_GEM',
                type: 'GEMSTONE',
                price: 16000000 * APPLICATION_WORTH.gemstone,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly v2',
        item: {
            itemId: 'HYPERION',
            skyblockItem: {
                gemstone_slots: [
                    {
                        slot_type: 'SAPPHIRE',
                        costs: [
                            { type: 'COINS', coins: 250000 },
                            { type: 'ITEM', item_id: 'FLAWLESS_SAPPHIRE_GEM', amount: 4 },
                        ],
                    },
                    {
                        slot_type: 'COMBAT',
                        costs: [
                            { type: 'COINS', coins: 250000 },
                            { type: 'ITEM', item_id: 'FLAWLESS_JASPER_GEM', amount: 1 },
                            { type: 'ITEM', item_id: 'FLAWLESS_SAPPHIRE_GEM', amount: 1 },
                            { type: 'ITEM', item_id: 'FLAWLESS_RUBY_GEM', amount: 1 },
                            { type: 'ITEM', item_id: 'FLAWLESS_AMETHYST_GEM', amount: 1 },
                        ],
                    },
                ],
            },
            extraAttributes: {
                gems: {
                    COMBAT_0: 'FINE',
                    COMBAT_0_gem: 'SAPPHIRE',
                    UNIVERSAL_0: 'FLAWLESS',
                    UNIVERSAL_0_gem: 'SAPPHIRE',
                    SAPPHIRE_0: 'FINE',
                },
            },
            price: 100,
            calculation: [],
        },
        prices: { FINE_SAPPHIRE_GEM: 30000 },
        shouldApply: true,
        expectedPriceChange: 2 * 30000 * APPLICATION_WORTH.gemstone,
        expectedCalculation: [
            {
                id: 'FINE_SAPPHIRE_GEM',
                type: 'GEMSTONE',
                price: 30000 * APPLICATION_WORTH.gemstone,
                count: 1,
            },
            {
                id: 'FINE_SAPPHIRE_GEM',
                type: 'GEMSTONE',
                price: 30000 * APPLICATION_WORTH.gemstone,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly simple',
        item: {
            itemId: 'ADAPTIVE_BOOTS',
            skyblockItem: { gemstone_slots: [{ slot_type: 'COMBAT' }] },
            extraAttributes: { gems: { COMBAT_0: 'FINE', COMBAT_0_gem: 'JASPER' } },
            price: 100,
            calculation: [],
        },
        prices: { FINE_JASPER_GEM: 90000 },
        shouldApply: true,
        expectedPriceChange: 90000 * APPLICATION_WORTH.gemstone,
        expectedCalculation: [
            {
                id: 'FINE_JASPER_GEM',
                type: 'GEMSTONE',
                price: 90000 * APPLICATION_WORTH.gemstone,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly with pre-parsed',
        item: {
            itemId: 'HYPERION',
            skyblockItem: {
                gemstone_slots: [
                    {
                        slot_type: 'SAPPHIRE',
                        costs: [
                            { type: 'COINS', coins: 250000 },
                            { type: 'ITEM', item_id: 'FLAWLESS_SAPPHIRE_GEM', amount: 4 },
                        ],
                    },
                    {
                        slot_type: 'COMBAT',
                        costs: [
                            { type: 'COINS', coins: 250000 },
                            { type: 'ITEM', item_id: 'FLAWLESS_JASPER_GEM', amount: 1 },
                            { type: 'ITEM', item_id: 'FLAWLESS_SAPPHIRE_GEM', amount: 1 },
                            { type: 'ITEM', item_id: 'FLAWLESS_RUBY_GEM', amount: 1 },
                            { type: 'ITEM', item_id: 'FLAWLESS_AMETHYST_GEM', amount: 1 },
                        ],
                    },
                ],
            },
            extraAttributes: {
                gems: {
                    formatted: true,
                    unlockedSlots: ['SAPPHIRE', 'COMBAT'],
                    gems: [
                        { type: 'SAPPHIRE', tier: 'PERFECT', slotType: 'SAPPHIRE' },
                        { type: 'SAPPHIRE', tier: 'PERFECT', slotType: 'COMBAT' },
                    ],
                },
            },
            price: 100,
            calculation: [],
        },
        prices: { PERFECT_SAPPHIRE_GEM: 16000000 },
        shouldApply: true,
        expectedPriceChange: 2 * 16000000 * APPLICATION_WORTH.gemstone,
        expectedCalculation: [
            {
                id: 'PERFECT_SAPPHIRE_GEM',
                type: 'GEMSTONE',
                price: 16000000 * APPLICATION_WORTH.gemstone,
                count: 1,
            },
            {
                id: 'PERFECT_SAPPHIRE_GEM',
                type: 'GEMSTONE',
                price: 16000000 * APPLICATION_WORTH.gemstone,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly with divan',
        item: {
            itemId: 'DIVAN_CHESTPLATE',
            skyblockItem: {
                gemstone_slots: [
                    { slot_type: 'AMBER', costs: [{ type: 'ITEM', item_id: 'GEMSTONE_CHAMBER', amount: 1 }] },
                    { slot_type: 'JADE', costs: [{ type: 'ITEM', item_id: 'GEMSTONE_CHAMBER', amount: 1 }] },
                    { slot_type: 'AMBER', costs: [{ type: 'ITEM', item_id: 'GEMSTONE_CHAMBER', amount: 1 }] },
                    { slot_type: 'JADE', costs: [{ type: 'ITEM', item_id: 'GEMSTONE_CHAMBER', amount: 1 }] },
                    { slot_type: 'TOPAZ', costs: [{ type: 'ITEM', item_id: 'GEMSTONE_CHAMBER', amount: 1 }] },
                ],
            },
            extraAttributes: {
                gems: {
                    JADE_1: { quality: 'PERFECT' },
                    JADE_0: { quality: 'PERFECT' },
                    unlocked_slots: ['TOPAZ_0', 'JADE_1', 'JADE_0', 'AMBER_0', 'AMBER_1'],
                    AMBER_0: { quality: 'PERFECT' },
                    AMBER_1: { quality: 'PERFECT' },
                    TOPAZ_0: { quality: 'PERFECT' },
                },
            },
            price: 100,
            calculation: [],
        },
        prices: { GEMSTONE_CHAMBER: 7000000, PERFECT_AMBER_GEM: 15000000, PERFECT_JADE_GEM: 16000000, PERFECT_TOPAZ_GEM: 17500000 },
        shouldApply: true,
        expectedPriceChange:
            5 * 7000000 * APPLICATION_WORTH.gemstoneChambers +
            2 * 16000000 * APPLICATION_WORTH.gemstone +
            2 * 15000000 * APPLICATION_WORTH.gemstone +
            17500000 * APPLICATION_WORTH.gemstone,
        expectedCalculation: [
            {
                id: 'AMBER',
                type: 'GEMSTONE_SLOT',
                price: 7000000 * APPLICATION_WORTH.gemstoneChambers,
                count: 1,
            },
            {
                id: 'JADE',
                type: 'GEMSTONE_SLOT',
                price: 7000000 * APPLICATION_WORTH.gemstoneChambers,
                count: 1,
            },
            {
                id: 'AMBER',
                type: 'GEMSTONE_SLOT',
                price: 7000000 * APPLICATION_WORTH.gemstoneChambers,
                count: 1,
            },
            {
                id: 'JADE',
                type: 'GEMSTONE_SLOT',
                price: 7000000 * APPLICATION_WORTH.gemstoneChambers,
                count: 1,
            },
            {
                id: 'TOPAZ',
                type: 'GEMSTONE_SLOT',
                price: 7000000 * APPLICATION_WORTH.gemstoneChambers,
                count: 1,
            },
            {
                id: 'PERFECT_AMBER_GEM',
                type: 'GEMSTONE',
                price: 15000000 * APPLICATION_WORTH.gemstone,
                count: 1,
            },
            {
                id: 'PERFECT_JADE_GEM',
                type: 'GEMSTONE',
                price: 16000000 * APPLICATION_WORTH.gemstone,
                count: 1,
            },
            {
                id: 'PERFECT_AMBER_GEM',
                type: 'GEMSTONE',
                price: 15000000 * APPLICATION_WORTH.gemstone,
                count: 1,
            },
            {
                id: 'PERFECT_JADE_GEM',
                type: 'GEMSTONE',
                price: 16000000 * APPLICATION_WORTH.gemstone,
                count: 1,
            },
            {
                id: 'PERFECT_TOPAZ_GEM',
                type: 'GEMSTONE',
                price: 17500000 * APPLICATION_WORTH.gemstone,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly with divan unlocked and no gems',
        item: {
            itemId: 'DIVAN_CHESTPLATE',
            skyblockItem: {
                gemstone_slots: [
                    { slot_type: 'AMBER', costs: [{ type: 'ITEM', item_id: 'GEMSTONE_CHAMBER', amount: 1 }] },
                    { slot_type: 'JADE', costs: [{ type: 'ITEM', item_id: 'GEMSTONE_CHAMBER', amount: 1 }] },
                    { slot_type: 'AMBER', costs: [{ type: 'ITEM', item_id: 'GEMSTONE_CHAMBER', amount: 1 }] },
                    { slot_type: 'JADE', costs: [{ type: 'ITEM', item_id: 'GEMSTONE_CHAMBER', amount: 1 }] },
                    { slot_type: 'TOPAZ', costs: [{ type: 'ITEM', item_id: 'GEMSTONE_CHAMBER', amount: 1 }] },
                ],
            },
            extraAttributes: { gems: { unlocked_slots: ['TOPAZ_0', 'JADE_1', 'JADE_0', 'AMBER_0', 'AMBER_1'] } },
            price: 100,
            calculation: [],
        },
        prices: { GEMSTONE_CHAMBER: 7000000, PERFECT_AMBER_GEM: 15000000, PERFECT_JADE_GEM: 16000000, PERFECT_TOPAZ_GEM: 17500000 },
        shouldApply: true,
        expectedPriceChange: 5 * 7000000 * APPLICATION_WORTH.gemstoneChambers,
        expectedCalculation: [
            {
                id: 'AMBER',
                type: 'GEMSTONE_SLOT',
                price: 7000000 * APPLICATION_WORTH.gemstoneChambers,
                count: 1,
            },
            {
                id: 'JADE',
                type: 'GEMSTONE_SLOT',
                price: 7000000 * APPLICATION_WORTH.gemstoneChambers,
                count: 1,
            },
            {
                id: 'AMBER',
                type: 'GEMSTONE_SLOT',
                price: 7000000 * APPLICATION_WORTH.gemstoneChambers,
                count: 1,
            },
            {
                id: 'JADE',
                type: 'GEMSTONE_SLOT',
                price: 7000000 * APPLICATION_WORTH.gemstoneChambers,
                count: 1,
            },
            {
                id: 'TOPAZ',
                type: 'GEMSTONE_SLOT',
                price: 7000000 * APPLICATION_WORTH.gemstoneChambers,
                count: 1,
            },
        ],
    },
    {
        description: 'Applies correctly with kuudra',
        item: {
            itemId: 'INFERNAL_AURORA_CHESTPLATE',
            skyblockItem: {
                gemstone_slots: [
                    {
                        slot_type: 'COMBAT',
                        costs: [
                            { type: 'COINS', coins: 250000 },
                            { type: 'ITEM', item_id: 'FLAWLESS_JASPER_GEM', amount: 1 },
                            { type: 'ITEM', item_id: 'FLAWLESS_SAPPHIRE_GEM', amount: 1 },
                            { type: 'ITEM', item_id: 'FLAWLESS_RUBY_GEM', amount: 1 },
                            { type: 'ITEM', item_id: 'FLAWLESS_AMETHYST_GEM', amount: 1 },
                        ],
                    },
                    {
                        slot_type: 'COMBAT',
                        costs: [
                            { type: 'COINS', coins: 250000 },
                            { type: 'ITEM', item_id: 'FLAWLESS_JASPER_GEM', amount: 1 },
                            { type: 'ITEM', item_id: 'FLAWLESS_SAPPHIRE_GEM', amount: 1 },
                            { type: 'ITEM', item_id: 'FLAWLESS_RUBY_GEM', amount: 1 },
                            { type: 'ITEM', item_id: 'FLAWLESS_AMETHYST_GEM', amount: 1 },
                        ],
                    },
                ],
            },
            extraAttributes: {
                gems: {
                    COMBAT_0: 'PERFECT',
                    unlocked_slots: ['COMBAT_0', 'COMBAT_1'],
                    COMBAT_1_gem: 'SAPPHIRE',
                    COMBAT_0_gem: 'SAPPHIRE',
                    COMBAT_1: 'PERFECT',
                },
            },
            price: 100,
            calculation: [],
        },
        prices: {
            FLAWLESS_JASPER_GEM: 7500000,
            FLAWLESS_SAPPHIRE_GEM: 2500000,
            FLAWLESS_RUBY_GEM: 2000000,
            FLAWLESS_AMETHYST_GEM: 2250000,
            PERFECT_SAPPHIRE_GEM: 16000000,
        },
        shouldApply: true,
        expectedPriceChange: 2 * (250000 + 7500000 + 2500000 + 2000000 + 2250000) * APPLICATION_WORTH.gemstoneSlots + 2 * 16000000 * APPLICATION_WORTH.gemstone,
        expectedCalculation: [
            {
                id: 'COMBAT',
                type: 'GEMSTONE_SLOT',
                price: (250000 + 7500000 + 2500000 + 2000000 + 2250000) * APPLICATION_WORTH.gemstoneSlots,
                count: 1,
            },
            {
                id: 'COMBAT',
                type: 'GEMSTONE_SLOT',
                price: (250000 + 7500000 + 2500000 + 2000000 + 2250000) * APPLICATION_WORTH.gemstoneSlots,
                count: 1,
            },
            {
                id: 'PERFECT_SAPPHIRE_GEM',
                type: 'GEMSTONE',
                price: 16000000 * APPLICATION_WORTH.gemstone,
                count: 1,
            },
            {
                id: 'PERFECT_SAPPHIRE_GEM',
                type: 'GEMSTONE',
                price: 16000000 * APPLICATION_WORTH.gemstone,
                count: 1,
            },
        ],
    },
    {
        description: 'Does not apply',
        item: {
            itemId: 'HYPERION',
            skyblockItem: { gemstone_slots: [{ slot_type: 'SAPPHIRE', costs: [{ type: 'COINS', coins: 250000 }] }] },
            extraAttributes: {},
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: false,
    },
];

new BaseHandlerTest(GemstonesHandler, testCases).runTests();
