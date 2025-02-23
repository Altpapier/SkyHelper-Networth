const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const { GEMSTONE_SLOTS } = require('../../constants/misc');

/**
 * A handler for Gemstones on an item.
 */
class GemstonesHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return Object.keys(item.extraAttributes.gems ?? {}).length > 0 && item.skyblockItem?.gemstone_slots?.length > 0;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        let unlockedSlots = [];
        let gems = [];

        if (item.extraAttributes.gems.formatted) {
            unlockedSlots = item.extraAttributes.gems.unlockedSlots;
            gems = item.extraAttributes.gems.gems;
        } else {
            const extraAttributesGems = JSON.parse(JSON.stringify(item.extraAttributes.gems));
            item.skyblockItem.gemstone_slots.forEach((slot) => {
                if (slot.costs && extraAttributesGems.unlocked_slots) {
                    for (const [index, type] of extraAttributesGems.unlocked_slots.entries()) {
                        if (type.startsWith(slot.slot_type)) {
                            unlockedSlots.push(slot.slot_type);
                            extraAttributesGems.unlocked_slots.splice(Number(index), 1);
                            break;
                        }
                    }
                }
                if (!slot.costs) unlockedSlots.push(slot.slot_type);
                const key = Object.keys(extraAttributesGems).find((k) => k.startsWith(slot.slot_type) && !k.endsWith('_gem'));
                if (key) {
                    const type = GEMSTONE_SLOTS.includes(slot.slot_type) ? extraAttributesGems[`${key}_gem`] : slot.slot_type;
                    gems.push({
                        type,
                        tier: extraAttributesGems[key] instanceof Object ? extraAttributesGems[key].quality : extraAttributesGems[key],
                        slotType: slot.slot_type,
                    });

                    delete extraAttributesGems[key];
                    if (slot.costs && !extraAttributesGems.unlocked_slots) unlockedSlots.push(slot.slot_type);
                }
            });
        }

        // UNLOCKED GEMSTONE SLOTS
        // Currently just gemstone chambers
        const isDivansArmor = /^DIVAN_(HELMET|CHESTPLATE|LEGGINGS|BOOTS)$/.test(item.itemId);
        const isCrimsonArmor = /^(|HOT_|FIERY_|BURNING_|INFERNAL_)(AURORA|CRIMSON|TERROR|HOLLOW|FERVOR)(_HELMET|_CHESTPLATE|_LEGGINGS|_BOOTS)$/.test(item.itemId);
        if (isDivansArmor || isCrimsonArmor) {
            const application = isDivansArmor ? APPLICATION_WORTH.gemstoneChambers : APPLICATION_WORTH.gemstoneSlots;
            const gemstoneSlots = JSON.parse(JSON.stringify(item.skyblockItem.gemstone_slots));
            for (const unlockedSlot of unlockedSlots) {
                const slot = gemstoneSlots.find((s) => s.slot_type === unlockedSlot);
                const slotIndex = gemstoneSlots.findIndex((s) => s.slot_type === unlockedSlot);
                if (slotIndex > -1) {
                    let total = 0;
                    for (const cost of slot.costs || []) {
                        if (cost.type === 'COINS') total += cost.coins;
                        else if (cost.type === 'ITEM') total += (prices[cost.item_id.toUpperCase()] ?? 0) * cost.amount;
                    }

                    const calculationData = {
                        id: unlockedSlot,
                        type: 'GEMSTONE_SLOT',
                        price: total * application,
                        count: 1,
                    };
                    item.price += calculationData.price;
                    item.calculation.push(calculationData);

                    gemstoneSlots.splice(slotIndex, 1);
                }
            }
        }

        // GEMSTONES
        for (const gemstone of gems) {
            const calculationData = {
                id: `${gemstone.tier}_${gemstone.type}_GEM`,
                type: 'GEMSTONE',
                price: (prices[`${gemstone.tier}_${gemstone.type}_GEM`.toUpperCase()] ?? 0) * APPLICATION_WORTH.gemstone,
                count: 1,
            };
            item.price += calculationData.price;
            item.calculation.push(calculationData);
        }
    }
}

module.exports = GemstonesHandler;
