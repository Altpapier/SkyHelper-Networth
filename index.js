const { NetworthError, PricesError } = require('./helper/errors');
const { parseItems } = require('./helper/parseItems');
const { calculateNetworth, calculateItemNetworth } = require('./helper/calculateNetworth');
const axios = require('axios');

/**
 * Returns the networth of a profile
 * @param {object} profileData - The profile player data from the Hypixel API (profile.members[uuid])
 * @param {number} bankBalance - The player's bank balance from the Hypixel API (profile.banking?.balance)
 * @param {{ cache: boolean, onlyNetworth: boolean, prices: object }} options - (Optional) cache: By default true (5 minute cache), if set to false it will always make a request to get the latest prices from github, onlyNetworth: If true, only the networth will be returned, prices: A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
 * @returns An object containing the player's networth calculation
 */
const getNetworth = async (profileData, bankBalance, options) => {
  const purse = profileData.coin_purse;
  const prices = await parsePrices(options?.prices, options?.cache);
  const items = await parseItems(profileData);
  return await calculateNetworth(items, purse, bankBalance, prices, options?.onlyNetworth);
};

/**
 * Returns the networth of a profile using pre-decoded items
 * @param {{
 *          sacks: [{ id: string, amount: number }],
 *          essence: [{ id: string, amount: number }],
 *          armor: [],
 *          equipment: [],
 *          wardrobe: [],
 *          inventory: [],
 *          enderchest: [],
 *          accessories: [],
 *          personal_vault: [],
 *          storage: [],
 *          pets: [{ type: string, exp: number, tier: string, heldItem: string, candyUsed: number, skin: string, level: number, xpMax: number }]
 *        }} items - Pre-parsed inventories, most inventories are just decoded except for sacks, essence, and pets which are parsed specifically as listed above
 * @param {number} purse - The player's purse from the Hypixel API (profile.members[uuid].coin_purse)
 * @param {number} bankBalance - The player's bank balance from the Hypixel API (profile.banking?.balance)
 * @param {{ cache: boolean, onlyNetworth: boolean, prices: object }} options - (Optional) cache: By default true (5 minute cache), if set to false it will always make a request to get the latest prices from github, onlyNetworth: If true, only the networth will be returned, prices: A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
 * @returns An object containing the player's networth calculation
 */
const getPreDecodedNetworth = async (items, purse, bankBalance, options) => {
  const prices = await parsePrices(options?.prices, options?.cache);
  return await calculateNetworth(items, purse, bankBalance, prices, options?.onlyNetworth);
};

/**
 * Returns the networth of an item
 * @param {object} item - The item the networth should be calculated for
 * @param {{ cache: boolean, prices: object }} options - (Optional) cache: By default true (5 minute cache), if set to false it will always make a request to get the latest prices from github, prices: A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called
 * @returns {object} - An object containing the item's networth calculation
 */
const getItemNetworth = async (item, options) => {
  if (!item?.tag && !item?.exp) throw new NetworthError('Invalid item provided');
  const prices = await parsePrices(options?.prices, options?.cache);
  return await calculateItemNetworth(item, prices);
};

async function parsePrices(prices, cache) {
  try {
    if (prices) {
      const firstKey = Object.keys(prices)[0];
      if (!prices instanceof Object || prices[firstKey] instanceof Object) throw new NetworthError('Invalid prices data provided');
      if (firstKey !== firstKey.toLowerCase()) for (id of Object.keys(prices)) prices[id.toLowerCase()] = prices[id];
    }
  } catch (err) {
    throw new NetworthError('Unable to parse prices');
  }

  return prices || (await getPrices(cache));
}

let cachedPrices;
/**
 * Returns the prices used in the networth calculation, optimally this can be cached and used when calling `getNetworth`
 * @param {boolean} cache - (Optional) By default true (5 minute cache), if set to false it will always make a request to get the latest prices from github
 * @returns {object} - An object containing the prices for the items in the game from the SkyHelper Prices list
 */
const getPrices = async (cache) => {
  try {
    if (cachedPrices?.lastCache > Date.now() - 1000 * 60 * 5 && cache !== false) {
      return cachedPrices.prices; // Cache for 5 minutes
    }
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
    // -----------------------------

    cachedPrices = { prices: response.data, lastCache: Date.now() };
    return response.data;
  } catch (err) {
    throw new PricesError(`Failed to retrieve prices with status code ${err?.response?.status || 'Unknown'}`);
  }
};

module.exports = {
  getNetworth,
  getPreDecodedNetworth,
  getItemNetworth,
  getPrices,
};
