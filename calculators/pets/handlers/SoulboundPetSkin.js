const { APPLICATION_WORTH } = require('../../../constants/applicationWorth');
const PetNetworthHelper = require('../PetNetworthHelper');

class SoulboundPetSkinHandler extends PetNetworthHelper {
    constructor(petData, prices) {
        super(petData, prices);
    }

    applies() {
        return this.petData.skin && this.isSoulbound() && !this.nonCosmetic;
    }

    calculate() {
        if (!this.prices[`PET_SKIN_${this.skin}`]) {
            return;
        }

        const calculationData = {
            id: this.skin,
            type: 'SOULBOUND_PET_SKIN',
            price: (this.prices[`PET_SKIN_${this.skin}`] || 0) * APPLICATION_WORTH.soulboundPetSkins,
            count: 1,
        };

        this.price += calculationData.price;
        this.calculation.push(calculationData);
    }
}

module.exports = SoulboundPetSkinHandler;
