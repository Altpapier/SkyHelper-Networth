const MIDAS_SWORDS = {
    MIDAS_SWORD: { maxBid: 50_000_000, type: 'MIDAS_SWORD_50M' },
    STARRED_MIDAS_SWORD: { maxBid: 250_000_000, type: 'STARRED_MIDAS_SWORD_250M' },
    MIDAS_STAFF: { maxBid: 100_000_000, type: 'MIDAS_STAFF_100M' },
    STARRED_MIDAS_STAFF: { maxBid: 500_000_000, type: 'STARRED_MIDAS_STAFF_500M' },
};

/**
 * A handler for the price paid in the Dark Auction for Midas weapons.
 */
class MidasWeaponHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return Object.keys(MIDAS_SWORDS).includes(item.itemId);
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     * @param {object} prices A prices object generated from the getPrices function
     */
    calculate(item, prices) {
        const { maxBid, type } = MIDAS_SWORDS[item.itemId];
        const winningBid = item.extraAttributes.winning_bid ?? 0;
        const additionalCoins = item.extraAttributes.additional_coins ?? 0;

        // If max price paid
        if (winningBid + additionalCoins >= maxBid && prices[type]) {
            const calculationData = {
                id: item.itemId,
                type: type,
                price: prices[type],
                count: 1,
            };
            item.basePrice = calculationData.price;
            item.calculation.push(calculationData);
        }
        // Otherwise use the normal AH price
    }
}

module.exports = MidasWeaponHandler;
