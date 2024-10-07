interface NetworthManagerOptions {
    /**
     * Whether to cache the prices for 5 minutes after fetching them or fetch them every time. Can also be a number to cache the prices for a specific amount of time in milliseconds.
     * Default: true
     */
    cachePrices?: boolean | number;

    /**
     * The amount of retries to fetch the prices when failing to fetch them.
     * Default: 3
     */
    pricesRetries?: number;

    /**
     * The amount of retries to fetch the items when failing to fetch them.
     * Default: 3
     */
    itemsRetries?: number;

    /**
     * The interval to fetch the items from the Hypixel API in milliseconds.
     * Default: 1000 * 60 * 60 * 12 (12 hours)
     */
    itemsInterval?: number;

    /**
     * Whether to only return the total networth or the items as well.
     * Default: false
     */
    onlyNetworth?: boolean;

    /**
     * Whether to stack items with the same name and price.
     * Default: true
     */
    stackItems?: boolean;

    /**
     * Whether to include the item data as a property in the item object.
     * Default: false
     */
    includeItemData?: boolean;
}

export class NetworthManager {
    /**
     * Creates a new instance of NetworthManager. This class is a singleton and should be accessed through the networthManager instance.
     */
    constructor(options?: NetworthManagerOptions);

    /**
     * Sets the cachePrices option.
     */
    setCachePrices(cachePrices: boolean | number): void;

    /**
     * Sets the pricesRetries option.
     */
    setPricesRetries(pricesRetries: number): void;

    /**
     * Sets the itemsRetries option.
     */
    setItemsRetries(itemsRetries: number): void;

    /**
     * Sets the itemsInterval option and restarts the items fetch interval.
     */
    setItemsInterval(itemsInterval: number): void;

    /**
     * Sets the onlyNetworth option.
     */
    setOnlyNetworth(onlyNetworth: boolean): void;

    /**
     * Sets the stackItems option.
     */
    setStackItems(stackItems: boolean): void;

    /**
     * Sets the includeItemData option.
     */
    setIncludeItemData(includeItemData: boolean): void;

    /**
     * Manually updates the items from the Hypixel API.
     * @param retries The number of retries to fetch the items.
     * @param retryInterval The interval in milliseconds between retries.
     * @param currentRetry The current retry count.
     */
    updateItems(retries?: number, retryInterval?: number, currentRetry?: number): Promise<void>;

    instance: NetworthManager;
}
