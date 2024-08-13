const { parsePrices } = require('../helper/prices');
const { titleCase } = require('../helper/functions');
const { applicationWorth } = require('../constants/applicationWorth');
const { titleCase } = require('../helper/functions');
const { blockedCandyReducePets, soulboundPets, tiers } = require('../constants/pets');
const { applicationWorth } = require('../constants/applicationWorth');

const networthManager = require('./NetworthManager');

class PetNetworthCalculator {
    /**
     * Creates a new ItemNetworthCalculator
     * @param {object} petData The pet the networth should be calculated for
     */
    constructor(petData) {
        this.petData = petData;

        this.#validate();

        this.petId = this.petData.type;

        this.this.price = 0;
        this.base = 0;
        this.calculation = [];
    }

    #validate() {}

    /**
     * Returns the networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's networth calculation
     */
    async getNetworth(prices, { cachePrices, pricesRetries, includeItemData }) {
        const parsedPrices = await parsePrices(prices, cachePrices ?? networthManager.cachePrices, pricesRetries ?? networthManager.pricesRetries);
        await networthManager.itemsPromise;
        return this.#calculate(parsedPrices, false);
    }

    /**
     * Returns the non cosmetic networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's non cosmetic networth calculation
     */
    async getNonCosmeticNetworth(prices, { cachePrices, pricesRetries, includeItemData }) {
        const parsedPrices = await parsePrices(prices, cachePrices ?? networthManager.cachePrices, pricesRetries ?? networthManager.pricesRetries);
        await networthManager.itemsPromise;
        return this.#calculate(parsedPrices, true);
    }

    isSoulbound() {
        return soulboundPets.includes(this.petData.type);
    }

    #getTier() {
        return this.petData.heldItem === 'PET_ITEM_TIER_BOOST' ? tiers[tiers.indexOf(this.petData.tier) - 1] : this.petData.tier;
    }

    #getPetLevelPrices(prices, nonCosmetic) {
        const tier = this.#getTier();
        const skin = this.petData.skin;
        const tierName = `${tier}_${this.petData.type}`;
        this.petId = `${tierName}${skin && !nonCosmetic ? `_SKINNED_${skin}` : ''}`;
        const basePrices = {
            lvl1: prices[`LVL_1_${tierName}`] || 0,
            lvl100: prices[`LVL_100_${tierName}`] || 0,
            lvl200: prices[`LVL_200_${tierName}`] || 0,
        };

        if (skin && !nonCosmetic) {
            return {
                lvl1: Math.max(prices[`LVL_1_${tierName}${skin ? `_SKINNED_${skin}` : ''}`] || 0, basePrices.lvl1),
                lvl100: Math.max(prices[`LVL_100_${tierName}${skin ? `_SKINNED_${skin}` : ''}`] || 0, basePrices.lvl100),
                lvl200: Math.max(prices[`LVL_200_${tierName}${skin ? `_SKINNED_${skin}` : ''}`] || 0, basePrices.lvl200),
            };
        } else {
            return basePrices;
        }
    }

    #getBasePrice(prices, nonCosmetic) {
        const { lvl1, lvl100, lvl200 } = this.#getPetLevelPrices(prices, nonCosmetic);
        this.petData.name = `[Lvl ${this.petData.level}] ${titleCase(`${this.petData.tier} ${this.petData.type}`)}${this.petData.skin ? ' ✦' : ''}`;
        if (lvl1 == undefined || lvl100 == undefined) return null;

        this.price = lvl200 || lvl100;

        // BASE
        if (this.petData.level < 100 && this.petData.xpMax) {
            const baseFormula = (lvl100 - lvl1) / this.petData.xpMax;

            if (baseFormula) {
                this.price = baseFormula * this.petData.exp + lvl1;
            }
        }

        if (this.petData.level > 100 && this.petData.level < 200) {
            const level = this.petData.level.toString().slice(1);

            if (level != 1) {
                const baseFormula = (lvl200 - lvl100) / 100;

                if (baseFormula) {
                    this.price = baseFormula * level + lvl100;
                }
            }
        }

        this.base = this.price;
    }

    #calculate(prices, nonCosmetic) {
        this.#getBasePrice(prices, nonCosmetic);
        this.calculation = [];

        if (this.#hasSoulboundPetSkin(nonCosmetic)) this.#calculateSoulboundPetSkin(prices);
        if (this.#hasPetItem()) this.#calculatePetItem(prices);
        if (this.#hasPetCandy()) this.#calculatePetCandy();

        return { ...this.petData, id: this.petId, price: this.price, base: this.base, calculation: this.calculation, soulbound: this.isSoulbound() };
    }

    #hasSoulboundPetSkin(nonCosmetic) {
        return this.petData.skin && this.isSoulbound() && !nonCosmetic;
    }

    #calculateSoulboundPetSkin(prices) {
        const calculationData = {
            id: this.petData.skin,
            type: 'soulbound_pet_skin',
            price: (prices[`PET_SKIN_${this.petData.skin}`] || 0) * applicationWorth.soulboundPetSkins,
            count: 1,
        };
        this.price += calculationData.price;
        this.calculation.push(calculationData);
    }

    #hasPetItem() {
        return !!this.petData.heldItem;
    }

    #calculatePetItem(prices) {
        const calculationData = {
            id: this.petData.heldItem,
            type: 'pet_item',
            price: (prices[this.petData.heldItem] || 0) * applicationWorth.petItem,
            count: 1,
        };
        this.price += calculationData.price;
        this.calculation.push(calculationData);
    }

    #hasPetCandy() {
        const maxPetCandyXp = this.petData.candyUsed * 1000000;
        const xpLessPetCandy = this.petData.exp - maxPetCandyXp;
        return this.petData.candyUsed > 0 && !blockedCandyReducePets.includes(this.petData.type) && xpLessPetCandy >= this.petData.xpMax;
    }

    #calculatePetCandy() {
        const reducedValue = price * applicationWorth.petCandy;

        if (!isNaN(price)) {
            if (this.petData.level == 100) {
                this.price = Math.max(reducedValue, this.price - 5000000);
            } else {
                this.price = Math.max(reducedValue, this.price - 2500000);
            }
        }
    }
}

module.exports = { PetNetworthCalculator };
