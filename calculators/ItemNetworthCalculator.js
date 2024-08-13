const { parsePrices } = require('../helper/prices');
const { titleCase } = require('../helper/functions');
const { getHypixelItemInformationFromId } = require('../constants/itemsMap');
const { ItemChecker } = require('./ItemChecker');
const { ItemManipulator } = require('./ItemManipulator');
const networthManager = require('./NetworthManager');

class ItemNetworthCalculator {
    /**
     * Creates a new ItemNetworthCalculator
     * @param {object} itemData The item the networth should be calculated for
     */
    constructor(itemData) {
        this.itemData = itemData;

        this.#validate();

        this.itemName = this.itemData.tag?.display?.Name.replace(/§[0-9a-fk-or]/gi, '');
        this.extraAttributes = this.itemData.tag?.extraAttributes ?? {};
        this.itemId = this.extraAttributes?.id;
        this.baseItemId = this.itemId;
        this.skyblockItem = getHypixelItemInformationFromId(this.itemId);

        this.price = 0;
        this.base = 0;
        this.calculation = [];
    }

    #validate() {
        if (!this.itemData || typeof this.itemData !== 'object') {
            throw new ValidationError('Item must be an object');
        }

        if (this.itemData?.tag === undefined && this.itemData?.exp === undefined) {
            throw new ValidationError('Invalid item provided');
        }
    }

    /**
     * Returns the networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's networth calculation
     */
    async getNetworth(prices, { cachePrices, pricesRetries, includeItemData }) {
        const parsedPrices = await parsePrices(prices, cachePrices ?? networthManager.cachePrices, pricesRetries ?? networthManager.pricesRetries);
        await networthManager.itemsPromise;
        return this.#calculate(parsedPrices, false, includeItemData ?? networthManager.includeItemData);
    }

    /**
     * Returns the non cosmetic networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's non cosmetic networth calculation
     */
    async getNonCosmeticNetworth(prices, { cachePrices, pricesRetries, includeItemData }) {
        const parsedPrices = await parsePrices(prices, cachePrices ?? networthManager.cachePrices, pricesRetries ?? networthManager.pricesRetries);
        await networthManager.itemsPromise;
        return this.#calculate(parsedPrices, true, includeItemData ?? networthManager.includeItemData);
    }

    isCosmetic() {
        const check = (this.itemId + this.itemName).toLowerCase();
        const itemLore = item.tag.display?.Lore || [];
        return (
            skyblockItem?.category === 'COSMETIC' || check.includes('dye') || check.includes('skin') || itemLore.at(-1)?.includes('COSMETIC') || ItemChecker.isRune(this)
        );
    }

    isSoulbound() {
        return !!(
            this.extraAttributes.donated_museum ||
            item.tag.display?.Lore?.includes('§8§l* §8Co-op Soulbound §8§l*') ||
            item.tag.display?.Lore?.includes('§8§l* §8Soulbound §8§l*')
        );
    }

    #getBasePrice(prices, nonCosmetic) {
        if (this.extraAttributes.skin && !nonCosmetic) {
            if (prices[`${this.itemId}_SKINNED_${this.extraAttributes.skin.toLowerCase()}`]) this.itemId += `_SKINNED_${this.extraAttributes.skin.toLowerCase()}`;
        }
        if (this.itemId === 'PARTY_HAT_SLOTH' && this.extraAttributes.party_hat_emoji) {
            if (prices[`${this.itemId}_${this.extraAttributes.party_hat_emoji.toLowerCase()}`]) this.itemId += `_${this.extraAttributes.party_hat_emoji.toLowerCase()}`;
        }

        if (['Beastmaster Crest', 'Griffin Upgrade Stone', 'Wisp Upgrade Stone'].includes(this.itemName)) {
            this.itemName = `${this.itemName} (${skyblockItem?.tier ? titleCase(skyblockItem?.tier?.replaceAll('_', ' ')) : 'Unknown'})`;
        } else if (this.itemName.endsWith(' Exp Boost')) {
            this.itemName = `${this.itemName} (${skyblockItem?.id ? titleCase(skyblockItem?.id?.split('_')?.at(-1)) : 'Unknown'})`;
        }

        // RUNES (Item)
        if (ItemChecker.isRune(this)) {
            const [runeType, runeTier] = Object.entries(this.extraAttributes.runes)[0];
            this.itemId = `RUNE_${runeType}_${runeTier}`.toLowerCase();
        }
        // CAKES (Item)
        if (this.itemId === 'NEW_YEAR_CAKE') this.itemId = `NEW_YEAR_CAKE_${this.extraAttributes.new_years_cake}`;
        // PARTY_HAT_CRAB (Item)
        if (['PARTY_HAT_CRAB', 'PARTY_HAT_CRAB_ANIMATED', 'BALLOON_HAT_2024'].includes(this.itemId) && this.extraAttributes.party_hat_color) {
            this.itemId = `${this.itemId.toLowerCase()}_${this.extraAttributes.party_hat_color}`;
        }
        // DCTR_SPACE_HELM (Editioned)
        if (this.itemId === 'DCTR_SPACE_HELM' && this.extraAttributes.edition !== undefined) this.itemId = 'DCTR_SPACE_HELM_EDITIONED';
        // CREATIVE_MIND (Editioned/Named) Worth less than unnamed. Unnamed is not obtainable anymore.
        if (this.itemId === 'CREATIVE_MIND' && !this.extraAttributes.edition) this.itemId = 'CREATIVE_MIND_UNEDITIONED';
        // SHINY
        if (this.extraAttributes.is_shiny && prices[`${this.itemId}_SHINY`]) this.itemId = `${this.itemId}_shiny`;
        // FRAGGED
        if (this.itemId.startsWith('STARRED_') && !prices[this.itemId] && prices[this.itemId.replace('STARRED_', '')]) this.itemId = this.itemId.replace('STARRED_', '');

        const itemData = prices[this.itemId];
        this.price = (itemData || 0) * item.Count;
        this.base = (itemData || 0) * item.Count;
        if (this.extraAttributes.skin && !nonCosmetic) {
            const newPrice = prices[item.tag.this.itemId.toLowerCase()];
            if (newPrice && newPrice > this.price) {
                this.price = newPrice * item.Count;
                this.base = newPrice * item.Count;
            }
        }
        if (!this.price && this.extraAttributes.price) {
            this.price = parseInt(this.extraAttributes.price) * 0.85;
            this.base = parseInt(this.extraAttributes.price) * 0.85;
        }
    }

    #calculate(prices, nonCosmetic, returnItemData) {
        if (this.itemId === 'PET' && this.extraAttributes.petInfo); // use pet calculator
        if (!this.itemId) return null;
        if (this.isCosmetic()) return null;

        this.#getBasePrice(prices, nonCosmetic);
        this.calculation = [];

        if (ItemChecker.isPickonimbus(this)) ItemManipulator.calculatePickonimbus(item);
        if (ItemChecker.hasGodRollAttributes(this)) ItemManipulator.calculateGodRollAttributes(item, prices);
        if (ItemChecker.isPrestiged(this)) ItemManipulator.calculatePrestige(item, prices);
        if (ItemChecker.hasHotPotatoBook(this)) ItemManipulator.calculateHotPotatoBook(item, prices);
        if (ItemChecker.hasRecomb(this)) ItemManipulator.calculateRecomb(item, prices);
        if (ItemChecker.isNewYearCakeBag(this)) ItemManipulator.calculateNewYearCakeBag(item, prices);

        const data = { name: itemName, loreName: item.tag.display.Name, id: itemId, price, base, calculation, count: item.Count || 1, soulbound: this.isSoulbound() };
        if (returnItemData) data.item = item;
        return data;
    }
}

module.exports = { ItemNetworthCalculator };
