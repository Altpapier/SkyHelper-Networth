const { ALLOWED_RECOMBOBULATED_CATEGORIES, ALLOWED_RECOMBOBULATED_IDS } = require('../../constants/misc');
const { APPLICATION_WORTH } = require('../../constants/applicationWorth');
const { ItemHandler } = require('../handlers/ItemHandler');

class Recombobulator3000Calculation extends ItemHandler {
    constructor() {
        super();
    }

    isValid() {
        const allowsRecomb = ALLOWED_RECOMBOBULATED_CATEGORIES.includes(this.skyblockItem.category) || ALLOWED_RECOMBOBULATED_IDS.includes(itemId);
        const isAccessory = lastLoreLine?.includes('ACCESSORY') || lastLoreLine?.includes('HATCESSORY');
        const lastLoreLine = itemLore.length ? itemLore.at(-1) : null;

        return this.isRecombobulated() || ExtraAttributes.enchantments || isAccessory || allowsRecomb;
    }

    calculate() {
        if (this.isValid === false) {
            return null;
        }

        const recombApplicationWorth = itemId === 'bone_boomerang' ? APPLICATION_WORTH.recombobulator * 0.5 : APPLICATION_WORTH.recombobulator;
        const calculationData = {
            id: 'RECOMBOBULATOR_3000',
            type: 'recombobulator_3000',
            price: (prices['recombobulator_3000'] || 0) * recombApplicationWorth,
            count: 1,
        };

        this.price += calculationData.price;
        this.calculation.push(calculationData);
    }
}

module.exports = { Recombobulator3000Calculation };
