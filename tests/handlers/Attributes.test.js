const AttributesHandler = require('../../calculators/handlers/Attributes');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const BaseHandlerTest = require('./BaseHandlerTest');

const testCases = [
    // region Attribute Shards
    {
        description: 'Applies correctly to a tier 1 attribute shard',
        item: {
            itemId: 'ATTRIBUTE_SHARD',
            extraAttributes: { attributes: { lifeline: 1 } },
            price: 100,
            calculation: [],
        },
        prices: { ATTRIBUTE_SHARD_LIFELINE: 1000000 },
        shouldApply: true,
        // No increase in price since the base tier is 1, should be accounted for in the base attrbiute shard price
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly to a tier 2 attribute shard',
        item: {
            itemId: 'ATTRIBUTE_SHARD',
            extraAttributes: { attributes: { lifeline: 2 } },
            price: 100,
            calculation: [],
        },
        prices: { ATTRIBUTE_SHARD_LIFELINE: 1000000 },
        shouldApply: true,
        expectedPriceChange: 1000000 * APPLICATION_WORTH.attributes,
        expectedCalculation: [
            {
                id: 'LIFELINE_2',
                type: 'ATTRIBUTE',
                price: 1000000 * APPLICATION_WORTH.attributes,
                count: 1,
                shards: 1,
            },
        ],
    },
    {
        description: 'Applies correctly to a tier 10 attribute shard',
        item: {
            itemId: 'ATTRIBUTE_SHARD',
            extraAttributes: { attributes: { lifeline: 10 } },
            price: 100,
            calculation: [],
        },
        prices: { ATTRIBUTE_SHARD_LIFELINE: 1000000 },
        shouldApply: true,
        expectedPriceChange: 1000000 * APPLICATION_WORTH.attributes * 511,
        expectedCalculation: [
            {
                id: 'LIFELINE_10',
                type: 'ATTRIBUTE',
                price: 1000000 * APPLICATION_WORTH.attributes * 511,
                count: 1,
                shards: 511,
            },
        ],
    },
    // endregion
    // region Normal Item
    {
        description: 'Applies correctly to a gauntlet of contagion',
        item: {
            itemId: 'GAUNTLET_OF_CONTAGION',
            extraAttributes: { attributes: { mana_pool: 2, dominance: 3 } },
            price: 100,
            calculation: [],
        },
        prices: { ATTRIBUTE_SHARD_MANA_POOL: 10000, ATTRIBUTE_SHARD_DOMINANCE: 20000 },
        shouldApply: true,
        expectedPriceChange: 10000 * APPLICATION_WORTH.attributes * 1 + 20000 * APPLICATION_WORTH.attributes * 3,
        expectedCalculation: [
            {
                id: 'MANA_POOL_2',
                type: 'ATTRIBUTE',
                price: 10000 * APPLICATION_WORTH.attributes * 1,
                count: 1,
                shards: 1,
            },
            {
                id: 'DOMINANCE_3',
                type: 'ATTRIBUTE',
                price: 20000 * APPLICATION_WORTH.attributes * 3,
                count: 1,
                shards: 3,
            },
        ],
    },
    // endregion
    // region Upgraded Item
    {
        description: 'Applies correctly to a tier 1 hellfire rod',
        item: {
            itemId: 'HELLFIRE_ROD',
            extraAttributes: { attributes: { fishing_speed: 1, magic_find: 1 } },
            price: 100,
            calculation: [],
        },
        prices: { MAGMA_ROD: 300000, ATTRIBUTE_SHARD_FISHING_SPEED: 1000000, ATTRIBUTE_SHARD_MAGIC_FIND: 2000000 },
        shouldApply: true,
        // No increase in price since the base tier is 1, should be accounted for in the attribute roll price
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    {
        description: 'Applies correctly to a tier 3 hellfire rod',
        item: {
            itemId: 'HELLFIRE_ROD',
            extraAttributes: { attributes: { fishing_speed: 3, magic_find: 3 } },
            price: 100,
            calculation: [],
        },
        prices: { MAGMA_ROD: 300000, ATTRIBUTE_SHARD_FISHING_SPEED: 1000000, ATTRIBUTE_SHARD_MAGIC_FIND: 2000000 },
        shouldApply: true,
        expectedPriceChange: 300000 * APPLICATION_WORTH.attributes * 3 + 300000 * APPLICATION_WORTH.attributes * 3,
        expectedCalculation: [
            {
                id: 'FISHING_SPEED_3',
                type: 'ATTRIBUTE',
                price: 300000 * APPLICATION_WORTH.attributes * 3,
                count: 1,
                shards: 3,
            },
            {
                id: 'MAGIC_FIND_3',
                type: 'ATTRIBUTE',
                price: 300000 * APPLICATION_WORTH.attributes * 3,
                count: 1,
                shards: 3,
            },
        ],
    },
    {
        description: 'Applies correctly to multi-tier hellfire rod',
        item: {
            itemId: 'HELLFIRE_ROD',
            extraAttributes: { attributes: { fishing_speed: 7, magic_find: 9 } },
            price: 100,
            calculation: [],
        },
        prices: { MAGMA_ROD: 300000, ATTRIBUTE_SHARD_FISHING_SPEED: 1000000, ATTRIBUTE_SHARD_MAGIC_FIND: 2000000 },
        shouldApply: true,
        expectedPriceChange: 300000 * APPLICATION_WORTH.attributes * 63 + 300000 * APPLICATION_WORTH.attributes * 255,
        expectedCalculation: [
            {
                id: 'FISHING_SPEED_7',
                type: 'ATTRIBUTE',
                price: 300000 * APPLICATION_WORTH.attributes * 63,
                count: 1,
                shards: 63,
            },
            {
                id: 'MAGIC_FIND_9',
                type: 'ATTRIBUTE',
                price: 300000 * APPLICATION_WORTH.attributes * 255,
                count: 1,
                shards: 255,
            },
        ],
    },
    // endregion
    // region Kuudra Armor
    {
        description: 'Applies correctly to aurora chestplate',
        item: {
            itemId: 'INFERNAL_AURORA_CHESTPLATE',
            extraAttributes: { attributes: { life_regeneration: 3, mending: 4 } },
            price: 100,
            calculation: [],
        },
        prices: {
            KUUDRA_HELMET_LIFE_REGENERATION: 30000,
            KUUDRA_CHESTPLATE_LIFE_REGENERATION: 40000,
            KUUDRA_LEGGINGS_LIFE_REGENERATION: 50000,
            KUUDRA_BOOTS_LIFE_REGENERATION: 60000,
            KUUDRA_CHESTPLATE_MENDING: 125000,
        },
        shouldApply: true,
        expectedPriceChange: 50000 * APPLICATION_WORTH.attributes * 3 + 125000 * APPLICATION_WORTH.attributes * 7,
        expectedCalculation: [
            {
                id: 'LIFE_REGENERATION_3',
                type: 'ATTRIBUTE',
                price: 50000 * APPLICATION_WORTH.attributes * 3,
                count: 1,
                shards: 3,
            },
            {
                id: 'MENDING_4',
                type: 'ATTRIBUTE',
                price: 125000 * APPLICATION_WORTH.attributes * 7,
                count: 1,
                shards: 7,
            },
        ],
    },
    {
        description: 'Applies correctly to aurora chestplate with cheaper attribute shard price',
        item: {
            itemId: 'INFERNAL_AURORA_CHESTPLATE',
            extraAttributes: { attributes: { life_regeneration: 4, mending: 3 } },
            price: 100,
            calculation: [],
        },
        prices: {
            ATTRIBUTE_SHARD_LIFE_REGENERATION: 40000,
            ATTRIBUTE_SHARD_MENDING: 120000,
            KUUDRA_CHESTPLATE_LIFE_REGENERATION: 50000,
            KUUDRA_CHESTPLATE_MENDING: 125000,
        },
        shouldApply: true,
        expectedPriceChange: 40000 * APPLICATION_WORTH.attributes * 7 + 120000 * APPLICATION_WORTH.attributes * 3,
        expectedCalculation: [
            {
                id: 'LIFE_REGENERATION_4',
                type: 'ATTRIBUTE',
                price: 40000 * APPLICATION_WORTH.attributes * 7,
                count: 1,
                shards: 7,
            },
            {
                id: 'MENDING_3',
                type: 'ATTRIBUTE',
                price: 120000 * APPLICATION_WORTH.attributes * 3,
                count: 1,
                shards: 3,
            },
        ],
    },
    // endregion
    // region Kuudra Helmet
    {
        description: 'Applies correctly to hollow helmet',
        item: {
            itemId: 'INFERNAL_HOLLOW_HELMET',
            extraAttributes: { attributes: { life_regeneration: 3, mending: 4 } },
            price: 100,
            calculation: [],
        },
        prices: {
            KUUDRA_HELMET_LIFE_REGENERATION: 30000,
            KUUDRA_CHESTPLATE_LIFE_REGENERATION: 40000,
            KUUDRA_LEGGINGS_LIFE_REGENERATION: 50000,
            KUUDRA_BOOTS_LIFE_REGENERATION: 60000,
            KUUDRA_HELMET_MENDING: 125000,
        },
        shouldApply: true,
        expectedPriceChange: 30000 * APPLICATION_WORTH.attributes * 3 + 125000 * APPLICATION_WORTH.attributes * 7,
        expectedCalculation: [
            {
                id: 'LIFE_REGENERATION_3',
                type: 'ATTRIBUTE',
                price: 30000 * APPLICATION_WORTH.attributes * 3,
                count: 1,
                shards: 3,
            },
            {
                id: 'MENDING_4',
                type: 'ATTRIBUTE',
                price: 125000 * APPLICATION_WORTH.attributes * 7,
                count: 1,
                shards: 7,
            },
        ],
    },
    {
        description: 'Applies correctly to aurora chestplate with cheaper attribute shard price',
        item: {
            itemId: 'INFERNAL_AURORA_CHESTPLATE',
            extraAttributes: { attributes: { life_regeneration: 4, mending: 3 } },
            price: 100,
            calculation: [],
        },
        prices: {
            ATTRIBUTE_SHARD_LIFE_REGENERATION: 40000,
            ATTRIBUTE_SHARD_MENDING: 120000,
            KUUDRA_HELMET_LIFE_REGENERATION: 50000,
            KUUDRA_HELMET_MENDING: 125000,
        },
        shouldApply: true,
        expectedPriceChange: 40000 * APPLICATION_WORTH.attributes * 7 + 120000 * APPLICATION_WORTH.attributes * 3,
        expectedCalculation: [
            {
                id: 'LIFE_REGENERATION_4',
                type: 'ATTRIBUTE',
                price: 40000 * APPLICATION_WORTH.attributes * 7,
                count: 1,
                shards: 7,
            },
            {
                id: 'MENDING_3',
                type: 'ATTRIBUTE',
                price: 120000 * APPLICATION_WORTH.attributes * 3,
                count: 1,
                shards: 3,
            },
        ],
    },
    // endregion
    // region None
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
        description: 'Safely handles missing attribute shard price',
        item: {
            itemId: 'ATTRIBUTE_SHARD',
            extraAttributes: { attributes: { new_attribute_type: 10 } },
            price: 100,
            calculation: [],
        },
        prices: {},
        shouldApply: true,
        expectedPriceChange: 0,
        expectedCalculation: [],
    },
    // endregion
];

new BaseHandlerTest(AttributesHandler, testCases).runTests();
