const { ItemNetworthCalculator } = require('./ItemNetworthCalculator');

class ItemChecker {
    /**
     * @param {ItemNetworthCalculator} item
     */
    static isRune(item) {
        return (item.itemId === 'RUNE' || item.itemId === 'UNIQUE_RUNE') && item.extraAttributes.runes && Object.keys(item.extraAttributes.runes).length > 0;
    }

    /**
     * @param {ItemNetworthCalculator} item
     */
    static isPickonimbus(item) {
        return item.itemId === 'PICKONIMBUS' && item.extraAttributes.pickonimbus_durability;
    }

    /**
     * @param {ItemNetworthCalculator} item
     */
    static hasHotPotatoBook(item) {
        return !!item.extraAttributes.hot_potato_count;
    }

    /**
     * @param {ItemNetworthCalculator} item
     */
    static hasRecomb(item) {
        return item.extraAttributes.rarity_upgrades > 0 && !item.extraAttributes.item_tier;
    }

    /**
     * @param {ItemNetworthCalculator} item
     */
    static isNewYearCakeBag(item) {
        return !!item.extraAttributes.new_year_cake_bag_years;
    }

    /**
     * @param {ItemNetworthCalculator} item
     */
    static hasGodRollAttributes(item) {
        return item.itemId !== 'ATTRIBUTE_SHARD' && item.extraAttributes.attributes;
    }

    /**
     * @param {ItemNetworthCalculator} item
     */
    static isPrestiged(item, prices) {
        return !prices[item.itemId] && prestiges[item.itemId];
    }

    /**
     * @param {ItemNetworthCalculator} item
     */
    static isFromShensAuction(item) {
        return item.extraAttributes.price && item.extraAttributes.auction !== undefined && item.extraAttributes.bid !== undefined;
    }
}

module.exports = { ItemChecker };
