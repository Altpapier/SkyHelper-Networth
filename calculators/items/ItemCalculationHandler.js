const { getHypixelItemInformationFromId } = require('../../constants/itemsMap');

class ItemCalculationHandler {
    constructor({ itemData, prices, calculation, price }) {
        this.itemData = itemData;
        this.itemId = this.itemData.tag.ExtraAttributes.id;
        this.skyblockItem = getHypixelItemInformationFromId(this.itemId) ?? {};
        this.itemName = this.itemData.tag.display.Name.replace(/§[0-9a-fk-or]/gi, '');
        this.extraAttributes = this.itemData.tag.ExtraAttributes ?? {};
        this.itemLore = this.itemData.tag.display.Lore ?? [];
        this.count = this.itemData.Count ?? 1;
        this.baseItemId = this.itemId;
        this.calculation = calculation;
        this.prices = prices;
        this.price = price;
    }
}

module.exports = ItemCalculationHandler;
