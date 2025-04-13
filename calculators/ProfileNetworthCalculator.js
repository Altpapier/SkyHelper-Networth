const { getPrices } = require('../helper/prices');
const { parseItems } = require('../helper/parseItems');
const networthManager = require('../managers/NetworthManager');
const SkyBlockItemNetworthCalculator = require('./SkyBlockItemNetworthCalculator');
const PetNetworthCalculator = require('./PetNetworthCalculator');
const BasicItemNetworthCalculator = require('./BasicItemNetworthCalculator');
const { ValidationError } = require('../helper/errors');

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
     * Processes a batch of items to calculate their networth
     * @private
     */
    async #processBatchedItems(items, category, calculators, options) {
        const { prices, nonCosmetic, includeItemData } = options;
        const batchPromises = [];

        const chunkSize = 10;
        for (let i = 0; i < items.length; i += chunkSize) {
            const chunk = items.slice(i, i + chunkSize);

            const promise = Promise.all(
                chunk.map(async (item) => {
                    if (!item || Object.keys(item).length === 0) return null;

                    let calculatorClass = categoryCalculatorMap[category] ?? categoryCalculatorMap.default;
                    let processedItem = item;

                    if (item.tag?.ExtraAttributes?.petInfo) {
                        try {
                            processedItem = JSON.parse(item.tag.ExtraAttributes.petInfo);
                            calculatorClass = PetNetworthCalculator;
                        } catch {
                            return null;
                        }
                    } else if (!item.tag?.ExtraAttributes && item.exp === undefined && typeof item.id !== 'string') {
                        return null;
                    }

                    let calculator;
                    try {
                        calculator = new calculatorClass(processedItem);
                    } catch {
                        return null;
                    }

                    const result = nonCosmetic
                        ? await calculator.getNonCosmeticNetworth({ prices, includeItemData })
                        : await calculator.getNetworth({ prices, includeItemData });

                    if (!result) return null;

                    return result;
                }),
            );

            batchPromises.push(promise);
        }

        const batchResults = await Promise.all(batchPromises);

        return batchResults.flat().filter(Boolean);
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
        const [priceData, itemsData] = await Promise.all([
            (async () => {
                await networthManager.itemsPromise;
                if (!prices) {
                    return await getPrices(cachePrices, pricesRetries, cachePricesTime);
                }
                return prices;
            })(),
            (async () => {
                if (!this.items || !Object.keys(this.items).length) {
                    return await parseItems(this.profileData, this.museumData);
                }
                return this.items;
            })(),
        ]);

        prices = priceData;
        this.items = itemsData;

        const categories = {};
        for (const category in this.items) {
            categories[category] = {
                total: 0,
                unsoulboundTotal: 0,
                items: onlyNetworth ? undefined : [],
            };
        }

        const categoryPromises = [];
        const calculators = {};

        for (const [category, categoryItems] of Object.entries(this.items)) {
            if (!categoryItems || !categoryItems.length) continue;

            const promise = (async () => {
                calculators[category] = {};

                const results = await this.#processBatchedItems(categoryItems, category, calculators, { prices, nonCosmetic, includeItemData });

                const categoryData = categories[category];

                for (const result of results) {
                    const price = Number(result.price) || 0;
                    const soulboundPortion = Number(result.soulboundPortion) || 0;

                    categoryData.total += price;
                    if (!result.soulbound) {
                        categoryData.unsoulboundTotal += price - soulboundPortion;
                    }

                    if (!onlyNetworth && price > 0) {
                        categoryData.items.push(result);
                    }
                }

                if (sortItems && !onlyNetworth && categoryData.items && categoryData.items.length > 0) {
                    categoryData.items.sort((a, b) => b.price - a.price);
                }

                return { category, categoryData };
            })();

            categoryPromises.push(promise);
        }

        await Promise.all(categoryPromises);

        if (stackItems) {
            for (const category in categories) {
                const categoryData = categories[category];

                if (!onlyNetworth && categoryData.items && categoryData.items.length > 1) {
                    const itemStackMap = new Map();

                    for (const item of categoryData.items) {
                        // Dont stack pets
                        if (item.isPet) {
                            itemStackMap.set(`pet:${Math.random()}`, item);
                            continue;
                        }

                        // Create a unique key for each stackable item
                        const key = `${item.id}:${Math.floor(item.price / item.count)}:${item.soulbound}`;

                        if (itemStackMap.has(key)) {
                            const existingItem = itemStackMap.get(key);
                            existingItem.price += item.price;
                            existingItem.count += item.count;
                            if (!existingItem.basePrice && item.basePrice) existingItem.basePrice = item.basePrice;
                            if (!existingItem.calculation && item.calculation) existingItem.calculation = item.calculation;
                        } else {
                            itemStackMap.set(key, item);
                        }
                    }

                    categoryData.items = Array.from(itemStackMap.values());
                }
            }
        }

        // Calculate total networth
        const rawCoinsBalance = (this.bankBalance || 0) + (this.purse || 0) + (this.personalBankBalance || 0);
        let total = rawCoinsBalance;
        let unsoulboundTotal = rawCoinsBalance;

        for (const category in categories) {
            const categoryData = categories[category];
            total += categoryData.total;
            unsoulboundTotal += categoryData.unsoulboundTotal;
        }

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
