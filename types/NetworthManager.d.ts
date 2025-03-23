export interface NetworthManagerOptions {
    /**
     * Whether to cache the prices for time after fetching them or fetch them every time.
     * Default: true
     */
    cachePrices?: boolean;

    /**
     * The amount of time to cache the prices in milliseconds.
     * Default: 1000 * 60 * 5 (5 minutes)
     */
    cachePricesTime?: number;

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
     * Whether to sort items by price.
     * Default: true
     */
    sortItems?: boolean;

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
