const { APPLICATION_WORTH, ENCHANTMENTS_WORTH } = require('../../constants/applicationWorth');
const { BLOCKED_ENCHANTMENTS, IGNORED_ENCHANTMENTS, STACKING_ENCHANTMENTS, IGNORE_SILEX } = require('../../constants/misc');

const TURBO_CROP_UPGRADES = [
    { upgradeItem: 'TURBO_GOURD', tier: 6, oncePerItem: true },
    { upgradeItem: 'ENCHANTED_TURBO_GOURD', tier: 7, oncePerItem: true },
];

const ENCHANTMENT_UPGRADES = {
    SCAVENGER: [{ upgradeItem: 'GOLDEN_BOUNTY', tier: 6 }],
    PESTERMINATOR: [{ upgradeItem: 'PESTHUNTING_GUIDE', tier: 6 }],
    LUCK_OF_THE_SEA: [{ upgradeItem: 'GOLD_BOTTLE_CAP', tier: 7 }],
    PISCARY: [{ upgradeItem: 'TROUBLED_BUBBLE', tier: 7 }],
    FRAIL: [{ upgradeItem: 'SEVERED_PINCER', tier: 7 }],
    SPIKED_HOOK: [{ upgradeItem: 'OCTOPUS_TENDRIL', tier: 7 }],
    CHARM: [{ upgradeItem: 'CHAIN_END_TIMES', tier: 6 }],
    SMITE: [{ upgradeItem: 'SEVERED_HAND', tier: 7 }],
    ENDER_SLAYER: [{ upgradeItem: 'ENDSTONE_IDOL', tier: 7 }],
    BANE_OF_ARTHROPODS: [{ upgradeItem: 'ENSNARED_SNAIL', tier: 7 }],
    VENOMOUS: [{ upgradeItem: 'FATEFUL_STINGER', tier: 7 }],
    TURBO_WHEAT: TURBO_CROP_UPGRADES,
    TURBO_CARROT: TURBO_CROP_UPGRADES,
    TURBO_POTATO: TURBO_CROP_UPGRADES,
    TURBO_PUMPKIN: TURBO_CROP_UPGRADES,
    TURBO_MELON: TURBO_CROP_UPGRADES,
    TURBO_MUSHROOMS: TURBO_CROP_UPGRADES,
    TURBO_COCOA: TURBO_CROP_UPGRADES,
    TURBO_CACTI: TURBO_CROP_UPGRADES,
    TURBO_CANE: TURBO_CROP_UPGRADES,
    TURBO_WARTS: TURBO_CROP_UPGRADES,
    TURBO_SUNFLOWER: TURBO_CROP_UPGRADES,
    TURBO_MOONFLOWER: TURBO_CROP_UPGRADES,
    TURBO_ROSE: TURBO_CROP_UPGRADES,
    THORNS: [{ upgradeItem: 'PRICKLY_CREEPER', tier: 4 }],
    SCUBA: [{ upgradeItem: 'VIBRANT_CORAL', tier: 6 }],
};

/**
 * A handler for the enchantments on an item.
 */
class ItemEnchantmentsHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.itemId !== 'ENCHANTED_BOOK' && Object.keys(item.extraAttributes.enchantments || {}).length > 0;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const appliedOncePerItemUpgrades = new Set();

        for (let [name, value] of Object.entries(item.extraAttributes.enchantments)) {
            name = name.toUpperCase();
            if (BLOCKED_ENCHANTMENTS[item.itemId]?.includes(name)) continue;
            if (IGNORED_ENCHANTMENTS[name] === value) continue;

            // Set stacking enchantments to 1 since that is the only value we track
            if (STACKING_ENCHANTMENTS.includes(name)) value = 1;

            // Silex
            if (name === 'EFFICIENCY' && value >= 6 && !IGNORE_SILEX.includes(item.itemId)) {
                const efficiencyLevel = value - (item.itemId === 'STONK_PICKAXE' ? 6 : 5);

                if (efficiencyLevel > 0) {
                    const calculationData = {
                        id: 'SIL_EX',
                        type: 'SILEX',
                        price: (prices['SIL_EX'] ?? 0) * efficiencyLevel * APPLICATION_WORTH.silex,
                        count: efficiencyLevel,
                    };
                    item.price += calculationData.price;
                    item.calculation.push(calculationData);
                }
            }

            for (const { upgradeItem, tier, oncePerItem = false } of ENCHANTMENT_UPGRADES[name] ?? []) {
                if (value >= tier && (!oncePerItem || !appliedOncePerItemUpgrades.has(upgradeItem))) {
                    const calculationData = {
                        id: upgradeItem,
                        type: 'ENCHANTMENT_UPGRADE',
                        price: (prices[upgradeItem] ?? 0) * APPLICATION_WORTH.enchantmentUpgrades,
                        count: 1,
                    };
                    item.price += calculationData.price;
                    item.calculation.push(calculationData);

                    if (oncePerItem) {
                        appliedOncePerItemUpgrades.add(upgradeItem);
                    }
                }
            }

            const calculationData = {
                id: `${name}_${value}`,
                type: 'ENCHANTMENT',
                price: (prices[`ENCHANTMENT_${name}_${value}`] ?? 0) * (ENCHANTMENTS_WORTH[name] || APPLICATION_WORTH.enchantments),
                count: 1,
            };
            if (calculationData.price) {
                item.price += calculationData.price;
                item.calculation.push(calculationData);
            }
        }
    }
}

module.exports = ItemEnchantmentsHandler;
