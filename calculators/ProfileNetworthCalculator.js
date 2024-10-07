const { getPrices } = require('../helper/prices');
const { parseItems } = require('../helper/parseItems');
const networthManager = require('../managers/NetworthManager');
const ItemNetworthCalculator = require('./ItemNetworthCalculator');
const PetNetworthCalculator = require('./PetNetworthCalculator');
const BasicItemNetworthCalculator = require('./BasicItemNetworthCalculator');
const { ValidationError } = require('../helper/errors');

const categoryCalculatorMap = {
    pets: PetNetworthCalculator,
    sacks: BasicItemNetworthCalculator,
    essence: BasicItemNetworthCalculator,
    default: ItemNetworthCalculator,
};

// @ts-check

/**
 * @typedef {import('../types/ProfileNetworthCalculator').ProfileNetworthCalculator} ProfileNetworthCalculator
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
        this.museumData = museumData;
        this.bankBalance = bankBalance || 0;
        this.items = {};

        this.#validate();

        this.purse = profileData.currencies?.coin_purse || 0;
        this.personalBankBalance = profileData.profile?.bank_account || 0;
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
     * @param {object} [options.prices] A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @param {boolean} [options.nonCosmetic] Whether to calculate the non-cosmetic networth
     * @param {boolean} [options.cachePrices] Whether to cache the prices
     * @param {number} [options.pricesRetries] The number of times to retry fetching prices
     * @param {boolean} [options.onlyNetworth] Whether to only return the networth values and not the item calculations
     * @param {boolean} [options.includeItemData] Whether to include item data in the result
     * @param {boolean} [options.stackItems] Whether to stack items with the same name and price
     * @returns An object containing the player's networth calculation
     */
    async #calculate({ prices, nonCosmetic, cachePrices, pricesRetries, onlyNetworth, includeItemData, stackItems }) {
        // Set default options
        cachePrices ??= networthManager.cachePrices;
        pricesRetries ??= networthManager.pricesRetries;
        onlyNetworth ??= networthManager.onlyNetworth;
        includeItemData ??= networthManager.includeItemData;
        stackItems ??= networthManager.stackItems;

        // Get prices and items
        await networthManager.itemsPromise;
        if (!prices) {
            prices = await getPrices(cachePrices, pricesRetries);
        }

        // Parse inventories if not already parsed
        if (!this.items || !Object.keys(this.items).length) {
            this.items = await parseItems(this.profileData, this.museumData);
        }

        // Calculate networth for each category
        const categories = {};
        for (const [category, categoryItems] of Object.entries(this.items)) {
            categories[category] = { total: 0, unsoulboundTotal: 0, items: [] };

            // Calculate networth for each item in the category
            for (let item of categoryItems) {
                if (!item || Object.keys(item).length === 0) continue;

                // Get the calculator for the item
                let calculatorClass = categoryCalculatorMap[category] ?? categoryCalculatorMap.default;
                /**
                 * @type {ItemNetworthCalculator | PetNetworthCalculator | BasicItemNetworthCalculator}
                 */

                if (item.tag?.ExtraAttributes?.petInfo) {
                    try {
                        item = JSON.parse(item.tag.ExtraAttributes.petInfo);
                        calculatorClass = PetNetworthCalculator;
                    } catch {
                        continue;
                    }
                }

                // Instantiate the calculator
                const calculator = new calculatorClass(item);
                // Calculate the networth of the item
                const result = nonCosmetic
                    ? await calculator.getNonCosmeticNetworth({ prices, includeItemData })
                    : await calculator.getNetworth({ prices, includeItemData });

                // Add the item to the category
                categories[category].total += result?.price || 0;
                if (!result?.soulbound) categories[category].unsoulboundTotal += result?.price || 0;
                if (!onlyNetworth && result && result?.price) {
                    categories[category].items.push(result);
                }
            }

            // Sort items by price
            if (!onlyNetworth && categories[category].items.length > 0) {
                categories[category].items = categories[category].items.sort((a, b) => b.price - a.price);

                // Stack items with the same name and price
                if (stackItems) {
                    // TODO: broken for 56ms fishing_bag (not broken before classes update)
                    categories[category].items = categories[category].items
                        .reduce((r, a) => {
                            const last = r[r.length - 1];
                            if (last && last.name === a.name && last.price / last.count === a.price / a.count && !a?.isPet && last.soulbound === a.soulbound) {
                                last.price += a.price;
                                last.count += a.count;
                                last.base = last.base || a.base;
                                last.calculation = last.calculation || a.calculation;
                            } else {
                                r.push(a);
                            }
                            return r;
                        }, [])
                        .filter((e) => e);
                }
            }

            // Remove items if only networth is requested
            if (onlyNetworth) delete categories[category].items;
        }

        // Calculate total networth
        const rawCoinsBalance = (this.bankBalance || 0) + (this.purse || 0) + (this.personalBankBalance || 0);
        const total = Object.values(categories).reduce((acc, category) => acc + category.total, 0) + rawCoinsBalance;
        const unsoulboundTotal = Object.values(categories).reduce((acc, category) => acc + category.unsoulboundTotal, 0) + rawCoinsBalance;

        return {
            networth: total,
            unsoulboundNetworth: unsoulboundTotal,
            noInventory: !this.items.inventory?.length,
            isNonCosmetic: !!nonCosmetic,
            purse: this.purse || 0,
            bank: this.bankBalance || 0,
            personalBank: this.personalBankBalance || 0,
            types: categories,
        };
    }
}

module.exports = ProfileNetworthCalculator;
