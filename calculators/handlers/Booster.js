const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const { TIERS } = require('../../constants/pets');

/**
 * A handler for Booster modifier on foraging items.
 */
class BoosterHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.boosters?.length > 0 || Object.keys(item.extraAttributes.booster_tiers ?? {}).length > 0;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        if (Object.keys(item.extraAttributes.booster_tiers ?? {}).length > 0) {
            for (const [booster, tier] of Object.entries(item.extraAttributes.booster_tiers)) {
                const boosterUpgrades = Array.from({ length: tier - 1 }, (_, t) => `${booster.toUpperCase()}_BOOSTER_${TIERS.at(t + 1)}`);
                const boosterIds = [`${booster.toUpperCase()}_BOOSTER`, ...boosterUpgrades];

                for (let boosterId of boosterIds) {
                    let boosterPrice = prices[boosterId] ?? 0;
                    if (!boosterPrice && boosterId.endsWith('_BOOSTER')) {
                        boosterId = `${boosterId}_COMMON`;
                        boosterPrice = prices[boosterId] ?? 0;
                    }
                    if (boosterPrice) {
                        const calculationData = {
                            id: boosterId,
                            type: 'BOOSTER',
                            price: boosterPrice * APPLICATION_WORTH.booster,
                            count: 1,
                        };
                        item.price += calculationData.price;
                        item.calculation.push(calculationData);
                    }
                }
            }
            return;
        }

        // Calculation using old property
        for (const booster of item.extraAttributes.boosters) {
            const boosterId = `${booster.toUpperCase()}_BOOSTER`;
            const boosterPrice = prices[boosterId] ?? 0;
            if (boosterPrice) {
                const calculationData = {
                    id: boosterId,
                    type: 'BOOSTER',
                    price: boosterPrice * APPLICATION_WORTH.booster,
                    count: 1,
                };
                item.price += calculationData.price;
                item.calculation.push(calculationData);
            }
        }
    }
}

module.exports = BoosterHandler;
