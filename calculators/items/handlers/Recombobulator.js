const { ALLOWED_RECOMBOBULATED_CATEGORIES, ALLOWED_RECOMBOBULATED_IDS } = require('../../../constants/misc');
const { APPLICATION_WORTH } = require('../../../constants/applicationWorth');
const ItemCalculationHandler = require('../ItemCalculationHandler');

class RecombobulatorHandler extends ItemCalculationHandler {
    constructor(data) {
        super(data);

        this.extra = data;
    }

    applies() {
        const allowsRecomb = ALLOWED_RECOMBOBULATED_CATEGORIES.includes(this.skyblockItem.category) || ALLOWED_RECOMBOBULATED_IDS.includes(this.itemId);
        const lastLoreLine = this.itemLore.length ? this.itemLore.at(-1) : null;
        const isAccessory = lastLoreLine?.includes('ACCESSORY') || lastLoreLine?.includes('HATCESSORY');

        return this.extra.isRecombobulated() || this.itemData.tag.ExtraAttributes.enchantments || isAccessory || allowsRecomb;
    }

    calculate() {
        const recombobulatorApplicationWorth = this.itemId === 'bone_boomerang' ? APPLICATION_WORTH.recombobulator * 0.5 : APPLICATION_WORTH.recombobulator;
        const calculationData = {
            id: 'RECOMBOBULATOR_3000',
            type: 'recombobulator_3000',
            price: (this.prices['recombobulator_3000'] || 0) * recombobulatorApplicationWorth,
            count: 1,
        };

        this.price += calculationData.price;
        this.calculation.push(calculationData);
    }
}

module.exports = RecombobulatorHandler;
