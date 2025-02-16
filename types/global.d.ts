export interface NetworthOptions {
    /**
     *  A prices object generated from the getPrices function. If not provided, the prices will be retrieved every time the function is called.
     *  Default: undefined
     */
    prices?: object;

    /**
     *  Whether to cache the prices for 5 minutes after fetching them or fetch them every time. Can also be a number to cache the prices for a specific amount of time in milliseconds.
     *  Default: true
     */
    cachePrices?: boolean;
    /**
     * The amount of retries to fetch the prices when failing to fetch them.
     * Default: 3
     */
    pricesRetries?: number;
    /**
     * Whether to only return the networth values and not the item calculations
     * Default: false
     */
    onlyNetworth?: boolean;
    /**
     * Whether to include the item data as a property in the item object.
     * Default: false
     */
    includeItemData?: boolean;
    /**
     * Whether to stack items with the same name and price.
     * Default: true
     */
    stackItems?: boolean;
}
