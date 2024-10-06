const { setItems, itemsBackupLoaded } = require('../constants/itemsMap');
const { ItemsError } = require('../helper/errors');
const { sleep } = require('../helper/functions');
const axios = require('axios');

/**
 * @typedef {import('../types/NetworthManager').NetworthManager} NetworthManagerClass
 */

/**
 * NetworthManager class.
 * Manages the networth of a player's inventory.
 * @implements {NetworthManagerClass}
 */
class NetworthManager {
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

        this.itemsPromise = this.updateItems(this.itemsRetries);
        this.itemsIntervalInstance = setInterval(() => {
            this.updateItems(this.itemsRetries);
        }, this.itemsInterval);
    }

    setCachePrices(cachePrices) {
        this.cachePrices = cachePrices;
        return this;
    }

    setPricesRetries(pricesRetries) {
        this.pricesRetries = pricesRetries;
        return this;
    }

    setItemsRetries(itemsRetries) {
        this.itemsRetries = itemsRetries;
        return this;
    }

    setItemsInterval(itemsInterval) {
        this.itemsInterval = itemsInterval;

        clearInterval(this.itemsIntervalInstance);
        this.itemsIntervalInstance = setInterval(() => {
            this.updateItems(this.itemsRetries);
        }, this.itemsInterval);
        return this;
    }

    setOnlyNetworth(onlyNetworth) {
        this.onlyNetworth = onlyNetworth;
        return this;
    }

    setStackItems(stackItems) {
        this.stackItems = stackItems;
        return this;
    }

    setIncludeItemData(includeItemData) {
        this.includeItemData = includeItemData;
        return this;
    }

    async updateItems(retries = 3, retryInterval = 1000, currentRetry = 0) {
        try {
            const response = await axios.get('https://api.hypixel.net/v2/resources/skyblock/items');
            const items = response.data.items;
            if (!items) {
                if (currentRetry >= retries) throw new ItemsError('Failed to retrieve items');
                console.warn(`[SKYHELPER-NETWORTH] Failed to retrieve items. Retrying (${retries - currentRetry} attempt(s) left)...`);
                await sleep(retryInterval);
                return await this.updateItems(retries, retryInterval, currentRetry + 1);
            }
            setItems(items);
            return;
        } catch (err) {
            const error = `[SKYHELPER-NETWORTH] ${
                axios.isAxiosError(err) ? `Failed to retrieve items with status code ${err?.response?.status || 'Unknown'}.` : `Failed to retrieve items: ${err}.`
            }`;
            if (currentRetry >= retries) {
                if (itemsBackupLoaded) return console.warn(`${error} Using backup items...`);
                else throw new ItemsError(error);
            }
            console.warn(`${error} Retrying (${retries - currentRetry} attempt(s) left)...`);
            await sleep(retryInterval);
            return await this.updateItems(retries, retryInterval, currentRetry + 1);
        }
    }
}

const networthManager = new NetworthManager();

module.exports = networthManager;
