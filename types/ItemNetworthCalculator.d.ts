import { NetworthOptions } from './shared';

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
    price: number;
    /**
     * The base price of the item.
     */
    base: number;
    /**
     * The calculation of the item.
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
     * The item data of the item.
     * Only included if the includeItemData option is true.
     */
    item: object;
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
};