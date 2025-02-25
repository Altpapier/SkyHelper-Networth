const { APPLICATION_WORTH } = require('../../constants/applicationWorth');

/**
 * A handler for the price paid in shens auctions.
 */
class ShensAuctionHandler {
    /**
     * Checks if the handler applies to the item
     * @param {object} item The item data
     * @returns {boolean} Whether the handler applies to the item
     */
    applies(item) {
        return item.extraAttributes.price && item.extraAttributes.auction !== undefined && item.extraAttributes.bid !== undefined;
    }

    /**
     * Calculates and adds the price of the modifier to the item
     * @param {object} item The item data
     */
    calculate(item) {
        const pricePaid = Number(item.extraAttributes.price) * APPLICATION_WORTH.shensAuctionPrice;
        if (pricePaid > item.price) {
            item.price = pricePaid + item.calculation.reduce((acc, curr) => acc + curr.price, 0);
            item.calculation.push({
                id: item.itemId,
                type: 'SHENS_AUCTION',
                price: pricePaid,
                count: 1,
            });
        }
    }
}

module.exports = ShensAuctionHandler;
