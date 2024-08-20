const { parsePrices } = require('../helper/prices');
const { parseItems } = require('../helper/parseItems');
const networthManager = require('./NetworthManager');
const ItemNetworthCalculator = require('./ItemNetworthCalculator');
const EssenceNetworthCalculator = require('./EssenceNetworthCalculator');
const SackItemNetworthCalculator = require('./SackItemNetworthCalculator');
const PetNetworthCalculator = require('./PetNetworthCalculator');

const categoryCalculatorMap = {
    pets: PetNetworthCalculator,
    sacks: SackItemNetworthCalculator,
    essence: EssenceNetworthCalculator,
    item: ItemNetworthCalculator,
};

class ProfileNetworthCalculator {
    /**
     * Creates a new ProfileNetworthCalculator
     * @param {object} profileData The profile data from the Hypixel API (profile.members[uuid])
     * @param {object} [museumData] The museum data from the Hypixel API (museum.members[uuid]). If not provided, the museum data will not be included in the networth calculation
     * @param {number} bankBalance The bank balance of the player from the Hypixel API (profile.banking.balance)
     */
    constructor(profileData, museumData, bankBalance) {
        this.profileData = profileData;
        this.museumData = museumData;
        this.bankBalance = bankBalance || 0;
        this.items = {};

        this.#validate();

        this.purse = profileData.currencies?.coin_purse;
        this.personalBankBalance = profileData.profile?.bank_account;
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
     * Returns the networth of a profile
     * @param {object} [prices] - A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns An object containing the player's networth calculation
     */
    async getNetworth(prices, { cachePrices, pricesRetries, onlyNetworth, includeItemData, stackItems }) {
        return this.#calculate(prices, { cachePrices, pricesRetries, onlyNetworth, includeItemData, stackItems }, false);
    }

    /**
     * Returns the non cosmetic networth of a profile
     * @param {object} [prices] - A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns An object containing the player's non cosmetic networth calculation
     */
    async getNonCosmeticNetworth(prices, { cachePrices, pricesRetries, onlyNetworth, includeItemData, stackItems }) {
        return this.#calculate(prices, { cachePrices, pricesRetries, onlyNetworth, includeItemData, stackItems }, true);
    }

    async #calculate(prices, { cachePrices, pricesRetries, onlyNetworth, includeItemData, stackItems }, nonCosmetic) {
        if (!this.items) {
            this.items = await parseItems(this.profileData, this.museumData);
        }

        const cachePrices = cachePrices ?? networthManager.cachePrices;
        const pricesRetries = pricesRetries ?? networthManager.pricesRetries;
        const onlyNetworth = onlyNetworth ?? networthManager.onlyNetworth;
        const includeItemData = includeItemData ?? networthManager.includeItemData;
        const stackItems = stackItems ?? networthManager.stackItems;

        await postParseItems(this.profileData, this.items);
        const parsedPrices = await parsePrices(prices, cachePrices, pricesRetries);
        await networthManager.itemsPromise;

        const categories = {};
        for (const [category, categoryItems] of Object.entries(this.items)) {
            // Calculate networth for each category
            categories[category] = { total: 0, unsoulboundTotal: 0, items: [] };

            for (const item of categoryItems) {
                const calculatorClass = categoryCalculatorMap[category];
                /**
                 * @type {PetNetworthCalculator | SacksNetworthCalculator | EssenceNetworthCalculator | ItemNetworthCalculator}
                 */
                const calculator = new calculatorClass(item);
                const result = calculator.getNetworth(parsedPrices, { includeItemData });

                categories[category].total += result?.price || 0;
                if (!result?.soulbound) categories[category].unsoulboundTotal += result?.price || 0;
                if (!onlyNetworth && result && result?.price) categories[category].items.push(result);
            }

            // Sort items by price
            if (!onlyNetworth && categories[category].items.length > 0) {
                categories[category].items = categories[category].items.sort((a, b) => b.price - a.price);

                if (stackItems) {
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
