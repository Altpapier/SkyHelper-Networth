const { NetworthError, PricesError } = require('./helper/errors');
const { parseItems, postParseItems } = require('./helper/parseItems');
const { calculateNetworth, calculateItemNetworth } = require('./helper/calculateNetworth');
const axios = require('axios');

/**
 * Returns the networth of a profile
 * @param {object} profileData - The profile player data from the Hypixel API (profile.members[uuid])
 * @param {number} bankBalance - The player's bank balance from the Hypixel API (profile.banking?.balance)
 * @param {{ v2Endpoint: boolean, cache: boolean, onlyNetworth: boolean, prices: object, returnItemData: boolean, museumData: object }} options - (Optional) v2Endpoint: By default false check true if you are using the new v2 endpoints from hypixel, cache: By default true (5 minute cache), if set to false it will always make a request to get the latest prices from github, onlyNetworth: If true, only the networth will be returned, prices: A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called, returnItemData: If true, the item data will be returned in the object, museumData: player's museum data from the Hypixel API (museum.members[uuid])
 * @returns An object containing the player's networth calculation
 */
const getNetworth = async (profileData, bankBalance, options) => {
  if (!profileData) throw new NetworthError('Invalid profile data provided');
  const purse = options?.v2Endpoint ? profileData.currencies?.coin_purse : profileData.coin_purse;
  const personalBankBalance = options?.v2Endpoint ? profileData.profile?.bank_account : 0;
  const prices = await parsePrices(options?.prices, options?.cache);
  const items = await parseItems(profileData, options?.museumData, options?.v2Endpoint);
  return calculateNetworth(items, purse, bankBalance, personalBankBalance, prices, options?.onlyNetworth, options?.returnItemData);
};

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
 * @param {number} bankBalance - The player's bank balance from the Hypixel API (profile.banking?.balance)
 * @param {{ v2Endpoint: boolean, cache: boolean, onlyNetworth: boolean, prices: object, returnItemData: boolean }} options - (Optional) v2Endpoint: By default false check true if you are using the new v2 endpoints from hypixel, cache: By default true (5 minute cache), if set to false it will always make a request to get the latest prices from github, onlyNetworth: If true, only the networth will be returned, prices: A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called, returnItemData: If true, the item data will be returned in the object
 * @returns An object containing the player's networth calculation
 */
const getPreDecodedNetworth = async (profileData, items, bankBalance, options) => {
  const purse = options?.v2Endpoint ? profileData.currencies?.coin_purse : profileData.coin_purse;
  const personalBankBalance = options?.v2Endpoint ? profileData.profile?.bank_account : 0;
  await postParseItems(profileData, items, options?.v2Endpoint);
  const prices = await parsePrices(options?.prices, options?.cache);
  return calculateNetworth(items, purse, bankBalance, personalBankBalance, prices, options?.onlyNetworth, options?.returnItemData);
};

/**
 * Returns the networth of an item
 * @param {object} item - The item the networth should be calculated for
 * @param {{ cache: boolean, prices: object, returnItemData: boolean }} options - (Optional) cache: By default true (5 minute cache), if set to false it will always make a request to get the latest prices from github, prices: A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called, returnItemData: If true, the item data will be returned in the object
 * @returns {object} - An object containing the item's networth calculation
 */
const getItemNetworth = async (item, options) => {
  if (item?.tag === undefined && item?.exp === undefined) throw new NetworthError('Invalid item provided');
  const prices = await parsePrices(options?.prices, options?.cache);
  return calculateItemNetworth(item, prices, options?.returnItemData);
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
let isLoadingPrices = false;
/**
 * Returns the prices used in the networth calculation, optimally this can be cached and used when calling `getNetworth`
 * @param {boolean} [cache=true] - (Optional) By default true (5 minute cache), if set to false it will always make a request to get the latest prices from github
 * @param {number} [retries=3] - (Optional) By default 3 retries. If set to a negative value, throws error.
 * @returns {object} - An object containing the prices for the items in the game from the SkyHelper Prices list
 */
const getPrices = async (cache = true, retries = 3) => {
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
};

const checkForUpdate = async () => {
  try {
    const packageInfo = await axios.get('https://registry.npmjs.org/skyhelper-networth');
    const latestVersion = packageInfo.data['dist-tags'].latest;
    const currentVersion = require('./package.json').version;

    if (latestVersion !== currentVersion) {
      console.log(`[SKYHELPER-NETWORTH] An update is available! Current version: ${currentVersion}, Latest version: ${latestVersion}`);
    }
  } catch {}
};
checkForUpdate();
let interval;
if (!interval) interval = setInterval(checkForUpdate, 1000 * 60 * 60);

module.exports = {
  getNetworth,
  getPreDecodedNetworth,
  getItemNetworth,
  getPrices,
};
