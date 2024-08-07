const { calculateNetworth, calculateItemNetworth } = require('./helper/calculateNetworth');
const { parseItems, postParseItems } = require('./helper/parseItems');
const { NetworthError, PricesError, ItemsError } = require('./helper/errors');
const NetworthTypes = require('./NetworthTypes');
const axios = require('axios');
const { setItems } = require('./constants/itemsMap');

class NetworthManager {
    /**
     * Create a new NetworthManager instance
     * @param {Object} options - Options for the NetworthManager
     * @param {NetworthTypes} [options.networthType=NetworthTypes.Normal] - The type of networth calculation to use
     * @param {boolean} [options.cachePrices=true] - Whether to cache the prices for 5 minutes after fetching them or fetch them every time
     * @param {number} [options.pricesRetries=3] - The amount of retries to fetch the prices when failing to fetch them
     * @param {number} [options.itemsRetries=3] - The amount of retries to fetch the items when failing to fetch them
     * @param {number} [options.itemsInterval=1000 * 60 * 60 * 12] - The interval to fetch the items from the Hypixel API
     * @param {boolean} [options.onlyNetworth=false] - Whether to only return the total networth or the items as well
     * @param {boolean} [options.stackItems=true] - Whether to stack items with the same name and price
     * @param {boolean} [options.includeItemData=false] - Whether to include the item data as a property in the item object
     */
    constructor({ networthType, cachePrices, pricesRetries, itemsRetries, itemsInterval, onlyNetworth, stackItems, includeItemData }) {
        this.networthType = networthType || NetworthTypes.Normal;
        this.cachePrices = cachePrices || true;
        this.pricesRetries = pricesRetries || 3;
        this.itemsRetries = itemsRetries || 3;
        this.itemsInterval = itemsInterval || 1000 * 60 * 60 * 12; // 12 hours
        this.onlyNetworth = onlyNetworth || false;
        this.stackItems = stackItems || true;
        this.includeItemData = includeItemData || false;

        this.itemsPromise = updateItems(this.itemsRetries);
        setInterval(() => {
            updateItems(this.itemsRetries);
        }, this.itemsInterval);
    }

    /**
     * Set the type of networth calculation to use
     * @param {NetworthTypes} networthType - The type of networth calculation to use
     * @returns {NetworthManager} The NetworthManager instance
     */
    setNetworthType(networthType) {
        this.networthType = networthType;
        return this;
    }

    /**
     * Returns the networth of a profile
     * @param {object} profileData - The profile player data from the Hypixel API (profile.members[uuid])
     * @param {object} [museumData] - The museum data from the Hypixel API (museum.members[uuid]). If not provided, the museum data will not be included in the networth calculation
     * @param {number} bankBalance - The bank balance of the player from the Hypixel API (profile.banking.balance)
     * @param {object} [prices] - A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns An object containing the player's networth calculation
     */
    async getNetworth({ profileData, museumData, bankBalance, prices: prePrices }) {
        if (!profileData) throw new NetworthError('Invalid profile data provided');
        const purse = profileData.currencies?.coin_purse;
        const personalBankBalance = profileData.profile?.bank_account;
        const prices = await parsePrices(prePrices, this.cachePrices, this.pricesRetries);
        const items = await parseItems(profileData, museumData);
        await this.itemsPromise.catch(() => {});
        return calculateNetworth(items, purse, bankBalance, personalBankBalance, prices, this);
    }

    /**
     * Returns the networth of a profile using pre-decoded items
     * @param {object} profileData - The profile player data from the Hypixel API (profile.members[uuid])
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
     *        }} items - Pre-parsed inventories, most inventories are just decoded except for sacks, essence, and pets which are parsed specifically as listed above, museum is an array of member[uuid].items and member[uuid].special combined and decoded (see parseItems.js)
     * @param {number} bankBalance - The bank balance of the player from the Hypixel API (profile.banking.balance)
     * @param {object} [prices] - A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
     * @returns An object containing the player's networth calculation
     */
    async getPreDecodedNetworth({ profileData, items, bankBalance, prices: prePrices }) {
        const purse = profileData.currencies?.coin_purse;
        const personalBankBalance = profileData.profile?.bank_account;
        await postParseItems(profileData, items);
        const prices = await parsePrices(prePrices, this.cachePrices, this.pricesRetries);
        await this.itemsPromise.catch(() => {});
        return calculateNetworth(items, purse, bankBalance, personalBankBalance, prices, this);
    }

    /**
     * Returns the networth of an item
     * @param {object} item - The item the networth should be calculated for
     * @param {object} [prices] - A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function
     * @returns {object} - An object containing the item's networth calculation
     */
    async getItemNetworth({ item, prices: prePrices }) {
        if (item?.tag === undefined && item?.exp === undefined) throw new NetworthError('Invalid item provided');
        const prices = await parsePrices(prePrices, this.cachePrices, this.pricesRetries);
        await this.itemsPromise;
        return calculateItemNetworth(item, prices, this);
    }
}

async function updateItems(retries = 3, retryInterval = 1000, currentRetry = 0) {
    try {
        const response = await axios.get('https://api.hypixel.net/v2/resources/skyblock/items');
        const items = response.data.items;
        if (!items) {
            if (currentRetry >= retries) throw new ItemsError(`Failed to retrieve items`);
            console.warn(`[SKYHELPER-NETWORTH] Failed to retrieve items. Retrying (${retries - currentRetry} attempt(s) left)...`);
            await new Promise((r) => setTimeout(r, retryInterval)); // Wait 1 second before retrying
            return await updateItems(retries, retryInterval, currentRetry + 1);
        }
        setItems(items);
        return;
    } catch (err) {
        if (currentRetry >= retries) throw new ItemsError(`Failed to retrieve items with status code ${err?.response?.status || 'Unknown'}`);
        console.warn(`[SKYHELPER-NETWORTH] Failed to retrieve items with status code ${err?.response?.status || 'Unknown'}. Retrying (${retries - currentRetry} attempt(s) left)...`);
        await new Promise((r) => setTimeout(r, retryInterval)); // Wait 1 second before retrying
        return await updateItems(retries, retryInterval, currentRetry + 1);
    }
}

async function parsePrices(prices, cache, retries = 3) {
    try {
        if (prices) {
            const firstKey = Object.keys(prices)[0];
            if (!prices instanceof Object || prices[firstKey] instanceof Object) throw new NetworthError('Invalid prices data provided');
            if (firstKey !== firstKey.toLowerCase()) for (id of Object.keys(prices)) prices[id.toLowerCase()] = prices[id];
        }
    } catch (err) {
        throw new NetworthError('Unable to parse prices');
    }

    return prices || (await getPrices(cache, retries));
}

let cachedPrices;
let isLoadingPrices = false;
/**
 * Returns the prices used in the networth calculation, optimally this can be cached and used when calling `getNetworth`
 * @param {boolean} [cache=true] - (Optional) By default true (5 minute cache), if set to false it will always make a request to get the latest prices from github
 * @param {number} [retries=3] - (Optional) By default 3 retries. If set to a negative value, throws error.
 * @returns {object} - An object containing the prices for the items in the game from the SkyHelper Prices list
 */
async function getPrices(cache = true, retries = 3) {
    if (retries <= 0) throw new PricesError(`Failed to retrieve prices`);
    try {
        if (cachedPrices?.lastCache > Date.now() - 1000 * 60 * 5 && cache) {
            return cachedPrices.prices; // Cache for 5 minutes
        }

        if (isLoadingPrices) {
            while (isLoadingPrices) {
                await new Promise((r) => setTimeout(r, 100)); //re-check if prices have loaded yet in 100ms
            }
            return getPrices(cache, retries);
        }

        isLoadingPrices = true;
        const response = await axios.get('https://raw.githubusercontent.com/SkyHelperBot/Prices/main/prices.json');

        // Remove this later when prices.json file is updated
        const firstKey = Object.keys(response.data)[0];
        if (response.data[firstKey] instanceof Object) {
            const prices = {};
            for (const [item, priceObject] of Object.entries(response.data)) {
                prices[item.toLowerCase()] = priceObject.price;
            }
            cachedPrices = { prices, lastCache: Date.now() };
            isLoadingPrices = false;
            return prices;
        }

        if (firstKey !== firstKey.toLowerCase()) {
            const prices = {};
            for (const [item, price] of Object.entries(response.data)) {
                prices[item.toLowerCase()] = price;
            }
            cachedPrices = { prices, lastCache: Date.now() };
            isLoadingPrices = false;
            return prices;
        }
        // -----------------------------

        cachedPrices = { prices: response.data, lastCache: Date.now() };
        isLoadingPrices = false;
        return response.data;
    } catch (err) {
        isLoadingPrices = false;
        if (retries <= 0) {
            throw new PricesError(`Failed to retrieve prices with status code ${err?.response?.status || 'Unknown'}`);
        } else {
            console.warn(`[SKYHELPER-NETWORTH] Failed to retrieve prices with status code ${err?.response?.status || 'Unknown'}. Retrying (${retries} attempt(s) left)...`);
            return getPrices(cache, retries - 1);
        }
    }
}

module.exports = NetworthManager;
