const { getPrices } = require('../helper/prices');
const { parseItems } = require('../helper/parseItems');
const networthManager = require('../managers/NetworthManager');
const SkyBlockItemNetworthCalculator = require('./SkyBlockItemNetworthCalculator');
const PetNetworthCalculator = require('./PetNetworthCalculator');
const BasicItemNetworthCalculator = require('./BasicItemNetworthCalculator');
const { ValidationError } = require('../helper/errors');
const { ITEMS_WITH_UNIQUE_MODIFIERS } = require('../constants/misc');

const categoryCalculatorMap = {
    pets: PetNetworthCalculator,
    sacks: BasicItemNetworthCalculator,
    essence: BasicItemNetworthCalculator,
    default: SkyBlockItemNetworthCalculator,
};

// @ts-check

/**
 * @typedef {import('../index').ProfileNetworthCalculator} ProfileNetworthCalculator
 * @typedef {import('../types/ProfileNetworthCalculator').NetworthResult} NetworthResult
 * @typedef {import('../types/global').NetworthOptions} NetworthOptions
 */

/**
 * ProfileNetworthCalculator class.
 * Calculates the networth of a player's profile.
 * @implements {ProfileNetworthCalculator}
 */
class ProfileNetworthCalculator {
    constructor(profileData, museumData, bankBalance) {
        this.profileData = profileData;
        this.museumData = museumData || {};
        this.bankBalance = bankBalance ?? 0;
        this.items = {};

        this.#validate();

        this.purse = profileData.currencies?.coin_purse ?? 0;
        this.personalBankBalance = profileData.profile?.bank_account ?? 0;
    }

    /**
     * Creates a new PreDecodedNetworthCalculator
     * @param {object} profileData The profile data from the Hypixel API (profile.members[uuid])
     * @param {{
     *          armor: [],
     *          equipment: [],
     *          wardrobe: [],
     *          inventory: [],
     *          enderchest: [],
     *          accessories: [],
     *          personal_vault: [],
     *          storage: [],
     *          fishing_bag: [],
     *          potion_bag: [],
     *          sacks_bag: [],
     *          candy_inventory: [],
     *          carnival_mask_inventory: [],
     *          quiver: [],
     *          museum: [],
     *        }} items Pre-parsed inventories, most inventories are just decoded except for sacks, essence, and pets which are parsed specifically as listed above, museum is an array of member[uuid].items and member[uuid].special combined and decoded (see {@link parseItems})
     * @param {number} bankBalance The bank balance of the player from the Hypixel API (profile.banking.balance)
     */
    static fromPreParsed(profileData, items, bankBalance) {
        const calculator = new ProfileNetworthCalculator(profileData, {}, bankBalance);
        calculator.items = items;
        return calculator;
    }

    /**
     * Validates that the profile data is correct
     */
    #validate() {
        if (!this.profileData) {
            throw new ValidationError('Profile data must be provided');
        }

        if (typeof this.profileData !== 'object') {
            throw new ValidationError('Profile data must be an object');
        }

        if (!this.profileData.profile && !this.profileData.player_data && !this.profileData.leveling) {
            throw new ValidationError('Invalid profile data provided');
        }
    }

    /**
     * Gets the networth of the player.
     * @param {NetworthOptions} [options]   The options for calculating networth.
     * @returns {Promise<NetworthResult>} The networth result.
     */
    async getNetworth(options) {
        return this.#calculate({ ...options, nonCosmetic: false });
    }

    /**
     * Gets the networth of the player without the cosmetic items.
     * @param {NetworthOptions} [options] The options for calculating networth.
     * @returns {Promise<NetworthResult>} The networth result.
     */
    async getNonCosmeticNetworth(options) {
        return this.#calculate({ ...options, nonCosmetic: true });
    }

    /**
     * Calculates the networth of a profile
     * @param {NetworthOptions} [options] The options for calculating networth.
     * @returns {Promise<NetworthResult>} The networth result.
     */
    async #calculate({ prices, nonCosmetic, cachePrices, pricesRetries, cachePricesTime, onlyNetworth, includeItemData, sortItems, stackItems }) {
        // Set default options
        cachePrices ??= networthManager.getCachePrices();
        pricesRetries ??= networthManager.getPricesRetries();
        cachePricesTime ??= networthManager.getCachePricesTime();
        onlyNetworth ??= networthManager.getOnlyNetworth();
        includeItemData ??= networthManager.getIncludeItemData();
        sortItems ??= networthManager.getSortItems();
        stackItems ??= networthManager.getStackItems();

        // Get prices and items
        await networthManager.itemsPromise;
        if (!prices) {
            prices = await getPrices(cachePrices, pricesRetries, cachePricesTime);
        }

        // Parse inventories if not already parsed
        if (!this.items || !Object.keys(this.items).length) {
            this.items = await parseItems(this.profileData, this.museumData);
        }

        // Calculate networth for each category
        const categories = {};
        const uniqueModifierItemIds = new Set(ITEMS_WITH_UNIQUE_MODIFIERS);
        const modifierCalculations = new WeakMap();
        const countedModifiers = new Map();
        for (const [category, categoryItems] of Object.entries(this.items)) {
            categories[category] = { total: 0, unsoulboundTotal: 0, items: [] };

            // Calculate networth for each item in the category
            for (let item of categoryItems) {
                if (!item || Object.keys(item).length === 0) continue;

                // Get the calculator for the item
                let calculatorClass = categoryCalculatorMap[category] ?? categoryCalculatorMap.default;
                /**
                 * @type {SkyBlockItemNetworthCalculator | PetNetworthCalculator | BasicItemNetworthCalculator}
                 */

                if (item.tag?.ExtraAttributes?.petInfo) {
                    try {
                        item = JSON.parse(item.tag.ExtraAttributes.petInfo);
                        calculatorClass = PetNetworthCalculator;
                    } catch {
                        continue;
                    }
                } else if (!item.tag?.ExtraAttributes && item.exp === undefined && typeof item.id !== 'string') {
                    continue;
                }

                // Instantiate the calculator
                let calculator;
                try {
                    calculator = new calculatorClass(item);
                } catch {
                    continue;
                }
                // Calculate the networth of the item
                const result = nonCosmetic
                    ? await calculator.getNonCosmeticNetworth({ prices, includeItemData })
                    : await calculator.getNetworth({ prices, includeItemData });

                // Add the item to the category
                const price = isNaN(result?.price) ? 0 : result?.price;
                const soulboundPortion = isNaN(result?.soulboundPortion) ? 0 : result?.soulboundPortion;
                categories[category].total += price;
                if (!result?.soulbound) categories[category].unsoulboundTotal += price - soulboundPortion;
                if (result && price && uniqueModifierItemIds.has(result.id)) {
                    modifierCalculations.set(result, result.calculation ?? []);
                }
                if ((!onlyNetworth || uniqueModifierItemIds.has(result?.id)) && result && price) {
                    categories[category].items.push(result);
                }
            }

            // Stack items with the same id and price
            if (stackItems) {
                categories[category].items = categories[category].items.reduce((acc, item) => {
                    if (!item?.isPet) {
                        const existing = acc.find(
                            (existingItem) =>
                                existingItem.id === item.id &&
                                existingItem.price / existingItem.count === item.price / item.count &&
                                existingItem.soulbound === item.soulbound,
                        );
                        if (existing) {
                            existing.price += item.price;
                            existing.count += item.count;
                            existing.basePrice = existing.basePrice || item.basePrice;
                            existing.calculation = existing.calculation || item.calculation;
                            if (uniqueModifierItemIds.has(item.id)) {
                                modifierCalculations.set(existing, [...(modifierCalculations.get(existing) ?? []), ...(modifierCalculations.get(item) ?? [])]);
                            }
                        } else {
                            acc.push(item);
                        }
                    } else {
                        acc.push(item);
                    }
                    return acc;
                }, []);
            }

            // Some combined items remain as separate records across containers.
            // Remove repeated modifier values after stacking so their prices are
            // counted once across the entire profile, while base prices remain intact.
            for (const item of categories[category].items) {
                if (!uniqueModifierItemIds.has(item.id)) continue;

                const seen = countedModifiers.get(item.id) ?? new Set();
                const calculations = modifierCalculations.get(item) ?? [];
                const retainedCalculations = [];
                let duplicatePrice = 0;
                let duplicateSoulboundPortion = 0;

                for (const calculation of calculations) {
                    const modifierKey = `${calculation.type}:${calculation.id}`;
                    if (seen.has(modifierKey)) {
                        duplicatePrice += calculation.price;
                        if (calculation.soulbound) duplicateSoulboundPortion += calculation.price;
                    } else {
                        seen.add(modifierKey);
                        retainedCalculations.push(calculation);
                    }
                }

                countedModifiers.set(item.id, seen);
                item.price -= duplicatePrice;
                item.soulboundPortion -= duplicateSoulboundPortion;
                item.calculation = retainedCalculations;
                categories[category].total -= duplicatePrice;
                if (!item.soulbound) categories[category].unsoulboundTotal -= duplicatePrice - duplicateSoulboundPortion;
            }

            categories[category].items = categories[category].items.filter((item) => item.price);

            if (sortItems && !onlyNetworth && categories[category].items.length > 0) {
                categories[category].items = categories[category].items.sort((a, b) => b.price - a.price);
            }

            // Remove items if only networth is requested
            if (onlyNetworth) delete categories[category].items;
        }

        // Calculate total networth
        const rawCoinsBalance = (this.bankBalance ?? 0) + (this.purse ?? 0) + (this.personalBankBalance ?? 0);
        const total = Object.values(categories).reduce((acc, category) => acc + category.total, 0) + rawCoinsBalance;
        const unsoulboundTotal = Object.values(categories).reduce((acc, category) => acc + category.unsoulboundTotal, 0) + rawCoinsBalance;

        return {
            networth: total,
            unsoulboundNetworth: unsoulboundTotal,
            noInventory: !this.items.inventory?.length,
            isNonCosmetic: !!nonCosmetic,
            purse: this.purse ?? 0,
            bank: this.bankBalance ?? 0,
            personalBank: this.personalBankBalance ?? 0,
            types: categories,
        };
    }
}

module.exports = ProfileNetworthCalculator;
