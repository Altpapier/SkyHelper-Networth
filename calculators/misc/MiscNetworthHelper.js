const { getHypixelItemInformationFromId } = require('../../constants/itemsMap');
const { titleCase } = require('../../helper/functions');

class MiscNetworthHelper {
    constructor(itemData, prices) {
        this.itemData = itemData;
        this.itemId = itemData.id;
        this.itemName = titleCase(this.itemId);
        this.skyblockItem = getHypixelItemInformationFromId(this.itemId) ?? {};
        this.prices = prices;
    }
}

module.exports = MiscNetworthHelper;
