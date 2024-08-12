const { setItems } = require('../constants/itemsMap');
const { ItemsError } = require('../helper/errors');
const { sleep } = require('../helper/functions');
const axios = require('axios');

class NetworthManager {
    /**
     * Create a new NetworthManager instance. This class is a singleton and should be accessed through the networthManager instance
     * @param {Object} options - Options for the NetworthManager
     * @param {boolean | number} [options.cachePrices=true] - Whether to cache the prices for 5 minutes after fetching them or fetch them every time. Can also be a number to cache the prices for a specific amount of time in milliseconds
     * @param {number} [options.pricesRetries=3] - The amount of retries to fetch the prices when failing to fetch them
     * @param {number} [options.itemsRetries=3] - The amount of retries to fetch the items when failing to fetch them
     * @param {number} [options.itemsInterval=1000 * 60 * 60 * 12] - The interval to fetch the items from the Hypixel API
     * @param {boolean} [options.onlyNetworth=false] - Whether to only return the total networth or the items as well
     * @param {boolean} [options.stackItems=true] - Whether to stack items with the same name and price
     * @param {boolean} [options.includeItemData=false] - Whether to include the item data as a property in the item object
     */
    constructor({ cachePrices, pricesRetries, itemsRetries, itemsInterval, onlyNetworth, stackItems, includeItemData } = {}) {
        if (NetworthManager.instance) {
            return NetworthManager.instance;
        }

        NetworthManager.instance = this;

        this.cachePrices = cachePrices || true;
        this.pricesRetries = pricesRetries || 3;
        this.itemsRetries = itemsRetries || 3;
        this.itemsInterval = itemsInterval || 1000 * 60 * 60 * 12;
        this.onlyNetworth = onlyNetworth || false;
        this.stackItems = stackItems || true;
        this.includeItemData = includeItemData || false;

        this.itemsPromise = updateItems(this.itemsRetries);
        this.itemsIntervalInstance = setInterval(() => {
            updateItems(this.itemsRetries);
        }, this.itemsInterval);
    }

    /**
     * Whether to cache the prices for 5 minutes after fetching them or fetch them every time. Can also be a number to cache the prices for a specific amount of time in milliseconds. Default: true
     * @param {boolean | number} cachePrices
     * @returns {NetworthManager} The NetworthManager instance
     */
    setCachePrices(cachePrices) {
        this.cachePrices = cachePrices;
        return this;
    }

    /**
     * The amount of retries to fetch the prices when failing to fetch them. Default: 3
     * @param {number} pricesRetries
     * @returns {NetworthManager} The NetworthManager instance
     */
    setPricesRetries(pricesRetries) {
        this.pricesRetries = pricesRetries;
        return this;
    }

    /**
     * The amount of retries to fetch the items endpoint from the Hypixel API when failing to fetch them. Default: 3
     * @param {number} itemsRetries
     * @returns {NetworthManager} The NetworthManager instance
     */
    setItemsRetries(itemsRetries) {
        this.itemsRetries = itemsRetries;
        return this;
    }

    /**
     * The interval in milliseconds to fetch the items from the Hypixel API. Default: 1000 * 60 * 60 * 12 (12 hours)
     * @param {number} itemsInterval
     * @returns {NetworthManager} The NetworthManager instance
     */
    setItemsInterval(itemsInterval) {
        this.itemsInterval = itemsInterval;

        clearInterval(this.itemsIntervalInstance);
        this.itemsIntervalInstance = setInterval(() => {
            updateItems(this.itemsRetries);
        }, this.itemsInterval);
        return this;
    }

    /**
     * Whether to only return the total networth or the items as well. Default: false
     * @param {boolean} onlyNetworth
     * @returns {NetworthManager} The NetworthManager instance
     */
    setOnlyNetworth(onlyNetworth) {
        this.onlyNetworth = onlyNetworth;
        return this;
    }

    /**
     * Whether to stack items with the same attributes and price. Default: true
     * @param {boolean} stackItems
     * @returns {NetworthManager} The NetworthManager instance
     */
    setStackItems(stackItems) {
        this.stackItems = stackItems;
        return this;
    }

    /**
     * Whether to include the item data as a property in the item object. Default: false
     * @param {boolean} includeItemData
     * @returns {NetworthManager} The NetworthManager instance
     */
    setIncludeItemData(includeItemData) {
        this.includeItemData = includeItemData;
        return this;
    }

    /**
     * Manually update the items from the Hypixel API
     * @param {number} [retries = 3] The amount of retries to fetch the items when failing to fetch them
     * @param {number} [retryInterval = 1000] The interval in milliseconds to fetch the items from the Hypixel API when failing to fetch them
     * @param {number} [currentRetry = 0] The current retry count
     */
    async updateItems(retries = 3, retryInterval = 1000, currentRetry = 0) {
        try {
            const response = await axios.get('https://api.hypixel.net/v2/resources/skyblock/items');
            const items = response.data.items;
            if (!items) {
                if (currentRetry >= retries) throw new ItemsError(`Failed to retrieve items`);
                console.warn(`[SKYHELPER-NETWORTH] Failed to retrieve items. Retrying (${retries - currentRetry} attempt(s) left)...`);
                await sleep(retryInterval);
                return await updateItems(retries, retryInterval, currentRetry + 1);
            }
            setItems(items);
            return;
        } catch (err) {
            if (currentRetry >= retries) throw new ItemsError(`Failed to retrieve items with status code ${err?.response?.status || 'Unknown'}`);
            console.warn(
                `[SKYHELPER-NETWORTH] Failed to retrieve items with status code ${err?.response?.status || 'Unknown'}. Retrying (${
                    retries - currentRetry
                } attempt(s) left)...`
            );
            await sleep(retryInterval);
            return await updateItems(retries, retryInterval, currentRetry + 1);
        }
    }
}

/**
 * The NetworthManager instance. This class is a singleton and should be accessed through this instance
 */
const networthManager = new NetworthManager();

module.exports = { networthManager };
