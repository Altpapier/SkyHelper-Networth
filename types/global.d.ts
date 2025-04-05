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
     * Whether to sort items by price.
     * Default: true
     */
    sortItems?: boolean;
    /**
     * Whether to stack items with the same name and price.
     * Default: true
     */
    stackItems?: boolean;
}

export type Item = {
    /**
     * The name of the item.
     */
    name: string;
    /**
     * The display name of the item.
     */
    loreName: string;
    /**
     * The id of the item.
     */
    id: string;
    /**
     * The price of the item.
     */
    basePrice: number;
    /**
     * The calculation of the item.
     */
    price: number;
    /**
     * The base price of the item.
     */
    calculation: Calculation[];
    /**
     * The amount of the item
     */
    count: number;
    /**
     * Whether the item is soulbound or not.
     */
    soulbound: boolean;
    /**
     * Whether the item is cosmetic or not.
     */
    cosmetic: boolean;
    /**
     * The item data of the item.
     * Only included if the includeItemData option is true.
     */
    item?: object;
    /**
     * The pet data of the item.
     * Only included if the includeItemData option is true.
     */
    petData?: object;
};

type Calculation = {
    /**
     * The name of the item modifier.
     */
    id: string;
    /**
     * The id of the item modifier.
     */
    type: string;
    /**
     * The value of the item modifier.
     */
    price: number;
    /**
     * The amount of the item modifier.
     */
    count: number;
    /**
     * The amount of Attribute Shards on the item.
     */
    shards?: number;
    /**
     * The amount of stars on the item.
     */
    star?: number;
    /**
     * Whether this part of the calculation is soulbound.
     */
    soulbound?: boolean;
};
