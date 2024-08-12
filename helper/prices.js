const { NetworthError, PricesError } = require('./errors');
const axios = require('axios');

async function parsePrices(prices, cache, retries = 3) {
    try {
        if (prices) {
            const firstKey = Object.keys(prices)[0];
            if (!prices?.length || !prices instanceof Object || prices[firstKey] instanceof Object) throw new NetworthError('Invalid prices data provided');
            if (firstKey !== firstKey.toLowerCase()) for (id of Object.keys(prices)) prices[id.toLowerCase()] = prices[id];
        }
    } catch (err) {
        throw new NetworthError('Unable to parse prices');
    }

    return prices || (await getPrices(cache, retries));
}

let cachedPrices;
let isLoadingPrices = null;
/**
 * Returns the prices used in the networth calculation, optimally this can be cached and used when calling `getNetworth`
 * @param {boolean} [cache=true] - (Optional) By default true (5 minute cache), if set to false it will always make a request to get the latest prices from github
 * @param {number} [retries=3] - (Optional) By default 3 retries. If set to a negative value, throws error.
 * @returns {object} - An object containing the prices for the items in the game from the SkyHelper Prices list
 */
async function getPrices(cache = true, retries = 3) {
    if (retries <= 0) throw new PricesError(`Failed to retrieve prices`);

    if (cachedPrices?.lastCache > Date.now() - 1000 * 60 * 5 && cache) return cachedPrices.prices;

    if (isLoadingPrices) return isLoadingPrices;

    isLoadingPrices = (async () => {
        try {
            const response = await axios.get('https://raw.githubusercontent.com/SkyHelperBot/Prices/main/prices.json');

            // Remove this later when prices.json file is updated
            const firstKey = Object.keys(response.data)[0];
            if (response.data[firstKey] instanceof Object) {
                const prices = {};
                for (const [item, priceObject] of Object.entries(response.data)) {
                    prices[item.toLowerCase()] = priceObject.price;
                }
                cachedPrices = { prices, lastCache: Date.now() };
                return prices;
            }

            if (firstKey !== firstKey.toLowerCase()) {
                const prices = {};
                for (const [item, price] of Object.entries(response.data)) {
                    prices[item.toLowerCase()] = price;
                }
                cachedPrices = { prices, lastCache: Date.now() };
                return prices;
            }

            cachedPrices = { prices: response.data, lastCache: Date.now() };
            return response.data;
        } catch (e) {
            if (retries <= 0) {
                throw new PricesError(`Failed to retrieve prices with status code ${e?.response?.status || 'Unknown'}`);
            } else {
                console.warn(`[SKYHELPER-NETWORTH] Failed to retrieve prices with status code ${e?.response?.status || 'Unknown'}. Retrying (${retries} attempt(s) left)...`);
                return getPrices(cache, retries - 1);
            }
        } finally {
            isLoadingPrices = null;
        }
    })();

    return isLoadingPrices;
}

module.exports = { parsePrices, getPrices };
