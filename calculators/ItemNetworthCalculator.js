const { calculateItemNetworth } = require('../helper/calculateNetworth');
const { parsePrices } = require('../helper/prices');
const { calculatePet } = require('./petCalculator');
const { titleCase } = require('../helper/functions');
const { getPetLevel } = require('../constants/pets');
const { prestiges } = require('../constants/prestiges');
const { applicationWorth, enchantsWorth } = require('../constants/applicationWorth');
const {
    blockedEnchants,
    ignoredEnchants,
    stackingEnchants,
    ignoreSilex,
    masterStars,
    validRunes,
    allowedRecombTypes,
    allowedRecombIds,
    attributesBaseCosts,
    enrichments,
    pickonimbusDurability,
    specialEnchantmentMatches,
} = require('../constants/misc');
const { reforges } = require('../constants/reforges');
const { getHypixelItemInformationFromId } = require('../constants/itemsMap');

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
        return this.#calculateItem(parsedPrices, false, includeItemData ?? networthManager.includeItemData);
    }

    /**
     * Returns the non cosmetic networth of an item
     * @param {object} [prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns {object} An object containing the item's non cosmetic networth calculation
     */
    async getNonCosmeticNetworth(prices, { cachePrices, pricesRetries, includeItemData }) {
        const parsedPrices = await parsePrices(prices, cachePrices ?? networthManager.cachePrices, pricesRetries ?? networthManager.pricesRetries);
        await networthManager.itemsPromise;
        return this.#calculateItem(parsedPrices, true, includeItemData ?? networthManager.includeItemData);
    }

    isCosmetic() {
        const check = (this.itemId + this.itemName).toLowerCase();
        const itemLore = item.tag.display?.Lore || [];
        return skyblockItem?.category === 'COSMETIC' || check.includes('dye') || check.includes('skin') || itemLore.at(-1)?.includes('COSMETIC') || this.#isRune();
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
        if (this.#isRune()) {
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

    #calculateItem(prices, nonCosmetic, returnItemData) {
        if (this.itemId === 'PET' && this.extraAttributes.petInfo); // use pet calculator
        if (!this.itemId) return null;
        if (this.isCosmetic()) return null;

        this.#getBasePrice(prices, nonCosmetic);
        this.calculation = [];

        if (this.#isPickonimbus()) this.#calculatePickonimbus();
        if (this.#hasHotPotatoBook()) this.#calculateHotPotatoBook(prices);
        if (this.#hasRecomb()) this.#calculateRecomb(prices);
        if (this.#isNewYearCakeBag()) this.#calculateNewYearCakeBag(prices);

        const data = { name: itemName, loreName: item.tag.display.Name, id: itemId, price, base, calculation, count: item.Count || 1, soulbound: this.isSoulbound() };
        if (returnItemData) data.item = item;
        return data;
    }

    #isRune() {
        return (this.itemId === 'RUNE' || this.itemId === 'UNIQUE_RUNE') && this.extraAttributes.runes && Object.keys(this.extraAttributes.runes).length > 0;
    }

    #isPickonimbus() {
        return this.itemId === 'PICKONIMBUS' && this.extraAttributes.pickonimbus_durability;
    }

    #calculatePickonimbus() {
        const reduction = this.extraAttributes.pickonimbus_durability / pickonimbusDurability;
        this.price += this.price * (reduction - 1);
        this.base += this.price * (reduction - 1);
    }

    #hasHotPotatoBook() {
        return !!this.extraAttributes.hot_potato_count;
    }

    #calculateHotPotatoBook(prices) {
        const hotPotatoCount = Number(this.extraAttributes.hot_potato_count);
        if (hotPotatoCount > 10) {
            const calculationData = {
                id: 'FUMING_POTATO_BOOK',
                type: 'fuming_potato_book',
                price: (prices['fuming_potato_book'] || 0) * (hotPotatoCount - 10) * applicationWorth.fumingPotatoBook,
                count: hotPotatoCount - 10,
            };
            this.price += calculationData.price;
            this.calculation.push(calculationData);
        }
        const calculationData = {
            id: 'HOT_POTATO_BOOK',
            type: 'hot_potato_book',
            price: (prices['hot_potato_book'] || 0) * Math.min(hotPotatoCount, 10) * applicationWorth.hotPotatoBook,
            count: Math.min(hotPotatoCount, 10),
        };
        this.price += calculationData.price;
        this.calculation.push(calculationData);
    }

    #hasRecomb() {
        return this.extraAttributes.rarity_upgrades > 0 && !this.extraAttributes.item_tier;
    }

    #calculateRecomb(prices) {
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
            this.price += calculationData.price;
            this.calculation.push(calculationData);
        }
    }

    #isNewYearCakeBag() {
        return !!this.extraAttributes.new_year_cake_bag_years;
    }

    #calculateNewYearCakeBag(prices) {
        let cakesPrice = 0;
        for (const year of this.extraAttributes.new_year_cake_bag_years) cakesPrice += prices[`new_year_cake_${year}`] || 0;
        const calculationData = {
            id: `NEW_YEAR_CAKES`,
            type: 'new_year_cakes',
            price: cakesPrice,
            count: 1,
        };
        this.price += calculationData.price;
        this.calculation.push(calculationData);
    }
}

module.exports = { ItemNetworthCalculator };
