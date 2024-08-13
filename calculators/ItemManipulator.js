const { ItemNetworthCalculator } = require('./ItemNetworthCalculator');

class ItemManipulator {
    /**
     * @param {ItemNetworthCalculator} item
     */
    static calculatePickonimbus(item) {
        const reduction = item.extraAttributes.pickonimbus_durability / pickonimbusDurability;
        item.price += item.price * (reduction - 1);
        item.base += item.price * (reduction - 1);
    }

    /**
     * @param {ItemNetworthCalculator} item
     */
    static calculateHotPotatoBook(item, prices) {
        const hotPotatoCount = Number(item.extraAttributes.hot_potato_count);
        if (hotPotatoCount > 10) {
            const calculationData = {
                id: 'FUMING_POTATO_BOOK',
                type: 'fuming_potato_book',
                price: (prices['fuming_potato_book'] || 0) * (hotPotatoCount - 10) * applicationWorth.fumingPotatoBook,
                count: hotPotatoCount - 10,
            };
            item.price += calculationData.price;
            item.calculation.push(calculationData);
        }
        const calculationData = {
            id: 'HOT_POTATO_BOOK',
            type: 'hot_potato_book',
            price: (prices['hot_potato_book'] || 0) * Math.min(hotPotatoCount, 10) * applicationWorth.hotPotatoBook,
            count: Math.min(hotPotatoCount, 10),
        };
        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }

    /**
     * @param {ItemNetworthCalculator} item
     */
    static calculateRecomb(item, prices) {
        const lastLoreLine = item.tag.display?.Lore?.at(-1);
        if (
            ExtraAttributes.enchantments ||
            allowedRecombTypes.includes(skyblockItem?.category) ||
            allowedRecombIds.includes(itemId) ||
            lastLoreLine?.includes('ACCESSORY') ||
            lastLoreLine?.includes('HATCESSORY')
        ) {
            const recombApplicationWorth = itemId === 'bone_boomerang' ? applicationWorth.recomb * 0.5 : applicationWorth.recomb;
            const calculationData = {
                id: 'RECOMBOBULATOR_3000',
                type: 'recombobulator_3000',
                price: (prices['recombobulator_3000'] || 0) * recombApplicationWorth,
                count: 1,
            };
            item.price += calculationData.price;
            item.calculation.push(calculationData);
        }
    }

    /**
     * @param {ItemNetworthCalculator} item
     */
    static calculateNewYearCakeBag(item, prices) {
        let cakesPrice = 0;
        for (const year of item.extraAttributes.new_year_cake_bag_years) cakesPrice += prices[`new_year_cake_${year}`] || 0;
        const calculationData = {
            id: `NEW_YEAR_CAKES`,
            type: 'new_year_cakes',
            price: cakesPrice,
            count: 1,
        };
        item.price += calculationData.price;
        item.calculation.push(calculationData);
    }

    /**
     * @param {ItemNetworthCalculator} item
     */
    static calculateGodRollAttributes(item, price) {
        const sortedAttributes = Object.keys(item.extraAttributes.attributes).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        const formattedId = item.itemId.replace(/(hot_|fiery_|burning_|infernal_)/g, '');
        const godRollId = `${formattedId}${sortedAttributes.map((attribute) => `_roll_${attribute.toLowerCase()}`).join('')}`;
        const godRollPrice = prices[godRollId];
        if (godRollPrice > price) {
            item.price = godRollPrice;
            item.base = godRollPrice;
            item.calculation.push({
                id: godRollId.slice(formattedId.length + 1),
                type: 'god_roll',
                price: godRollPrice,
                count: 1,
            });
        }
    }

    /**
     * @param {ItemNetworthCalculator} item
     */
    static calculatePrestige(item, prices) {
        const prestige = prestiges[item.itemId];
        for (const prestigeItem of prestige) {
            const foundItem = getHypixelItemInformationFromId(prestigeItem);
            if (isNaN(item.price)) item.price = 0;
            if (foundItem?.upgrade_costs) item.price += starCosts(prices, item.calculation, foundItem.upgrade_costs, prestigeItem);
            if (foundItem?.prestige?.costs) item.price += starCosts(prices, item.calculation, foundItem.prestige.costs, prestigeItem);
        }
    }

    /**
     * @param {ItemNetworthCalculator} item
     */
    static calculateShensAuction(item) {
        const pricePaid = Number(item.extraAttributes.price) * applicationWorth.shensAuctionPrice;
        if (pricePaid > price) {
            item.price = pricePaid;
            item.calculation.push({
                id: item.itemId,
                type: 'shens_auction',
                price: pricePaid,
                count: 1,
            });
        }
    }
}

module.exports = { ItemManipulator };
