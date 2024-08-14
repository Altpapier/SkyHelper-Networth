class ItemManipulator {
    static calculatePickonimbus(item) {
        if (item.itemId === 'PICKONIMBUS' && item.extraAttributes.pickonimbus_durability) {
            const reduction = item.extraAttributes.pickonimbus_durability / pickonimbusDurability;
            item.price += item.price * (reduction - 1);
            item.base += item.price * (reduction - 1);
        }
    }

    static calculateHotPotatoBook(item, prices) {
        if (item.extraAttributes.hot_potato_count) {
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
    }

    static calculateRecomb(item, prices) {
        if (item.extraAttributes.rarity_upgrades > 0 && !item.extraAttributes.item_tier) {
            const lastLoreLine = item.tag.display?.Lore?.at(-1);
            if (
                ExtraAttributes.enchantments ||
                allowedRecombTypes.includes(skyblockItem?.category) ||
                allowedRecombIds.includes(item.itemId) ||
                lastLoreLine?.includes('ACCESSORY') ||
                lastLoreLine?.includes('HATCESSORY')
            ) {
                const recombApplicationWorth = item.itemId === 'bone_boomerang' ? applicationWorth.recomb * 0.5 : applicationWorth.recomb;
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
    }

    static calculateNewYearCakeBag(item, prices) {
        if (item.extraAttributes.new_year_cake_bag_years) {
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
    }
}
module.exports = { ItemManipulator };
