const { tiers, soulboundPets, getPetLevel } = require('../../constants/pets');
const { titleCase } = require('../../helper/functions');

class PetNetworthHelper {
    constructor(petData, prices, nonCosmetic) {
        this.prices = prices;
        this.nonCosmetic = nonCosmetic;

        this.petData = petData;
        this.tier = this.getTier();
        this.skin = this.petData.skin;
        this.basePetId = this.petData.type;
        this.petId = this.getPetId();
        this.level = this.getPetLevel();
        this.petName = `[Lvl ${this.level.level}] ${titleCase(`${this.tier} ${titleCase(this.basePetId)}`)}${this.petData.skin ? ' ✦' : ''}`;

        this.calculation = [];
        this.price = 0;
        this.base = 0;

        this.getBasePrice();
    }

    getTier() {
        return this.petData.heldItem === 'PET_ITEM_TIER_BOOST' ? tiers[tiers.indexOf(this.petData.tier) - 1] : this.petData.tier;
    }

    getPetId() {
        if (this.skin && !this.nonCosmetic) {
            const itemId = `${this.tier}_${this.basePetId}${this.skin ? `_SKINNED_${this.skin}` : ''}`;
            if (this.prices[itemId]) {
                return itemId;
            }
        }

        return `${this.tier}_${this.basePetId}`;
    }

    isSoulbound() {
        return soulboundPets.includes(this.basePetId);
    }

    getPetLevelPrices() {
        const basePrices = {
            LVL_1: this.prices[`LVL_1_${this.petId}`] || 0,
            LVL_100: this.prices[`LVL_100_${this.petId}`] || 0,
            LVL_200: this.prices[`LVL_200_${this.petId}`] || 0,
        };

        if (this.skin && !this.nonCosmetic) {
            return {
                LVL_1: Math.max(this.prices[`LVL_1_${this.petId}`] || 0, basePrices.LVL_1),
                LVL_100: Math.max(this.prices[`LVL_100_${this.petId}`] || 0, basePrices.LVL_100),
                LVL_200: Math.max(this.prices[`LVL_200_${this.petId}`] || 0, basePrices.LVL_200),
            };
        }

        return basePrices;
    }

    getBasePrice(prices, nonCosmetic) {
        const { LVL_1, LVL_100, LVL_200 } = this.getPetLevelPrices(prices, nonCosmetic);
        if (LVL_1 === undefined || LVL_100 === undefined) {
            return null;
        }

        this.price = LVL_200 || LVL_100;
        if (this.level.level < 100 && this.level.xpMax) {
            const baseFormula = (LVL_100 - LVL_1) / this.level.xpMax;
            if (baseFormula) {
                this.price = baseFormula * this.level.xp + LVL_1;
            }
        }

        if (this.level.level > 100 && this.level.level < 200) {
            const level = this.level.level.toString().slice(1);
            if (level !== 1) {
                const baseFormula = (LVL_200 - LVL_100) / 100;
                if (baseFormula) {
                    this.price = baseFormula * level + LVL_100;
                }
            }
        }

        this.base = this.price;
    }

    getPetLevel() {
        // TODO: Move from constants to helper
        return getPetLevel(this.petData);
    }
}

module.exports = PetNetworthHelper;
