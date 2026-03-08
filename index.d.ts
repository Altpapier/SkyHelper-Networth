import { NetworthManagerOptions } from './types/NetworthManager';
import { Items, NetworthResult } from './types/ProfileNetworthCalculator';
import { Item, NetworthOptions } from './types/global';

export { Item, Items, NetworthManagerOptions, NetworthOptions, NetworthResult };

export declare class NetworthManager {
    /**
     * Creates a new instance of NetworthManager. This class is a singleton and should be accessed through the networthManager instance.
     */
    constructor(options?: NetworthManagerOptions);

    /**
     * Sets the cachePrices option.
     */
    static setCachePrices(cachePrices: boolean | number): void;

    /**
     * Sets the pricesRetries option.
     */
    static setPricesRetries(pricesRetries: number): void;

    /**
     * Sets the itemsRetries option.
     */
    static setItemsRetries(itemsRetries: number): void;

    /**
     * Sets the itemsInterval option and restarts the items fetch interval.
     */
    static setItemsInterval(itemsInterval: number): void;

    /**
     * Sets the onlyNetworth option.
     */
    static setOnlyNetworth(onlyNetworth: boolean): void;

    /**
     * Sets the sortItems option.
     */
    static setSortItems(sortItems: boolean): void;

    /**
     * Sets the stackItems option.
     */
    static setStackItems(stackItems: boolean): void;

    /**
     * Sets the includeItemData option.
     */
    static setIncludeItemData(includeItemData: boolean): void;

    /**
     * Sets the removeEmptyItems option
     */
    static setRemoveEmptyItems(removeEmptyItems: boolean): void;

    /**
     * Manually updates the items from the Hypixel API.
     * @param retries The number of retries to fetch the items.
     * @param retryInterval The interval in milliseconds between retries.
     * @param currentRetry The current retry count.
     */
    static updateItems(retries?: number, retryInterval?: number, currentRetry?: number): Promise<void>;
}

export declare class UpdateManager {
    /**
     * Creates an instance of UpdateManager and starts the interval for checking for updates (default: 1 minute).
     */
    constructor();

    /**
     * Disables the interval for checking for updates.
     */
    static disable(): void;

    /**
     * Enables the interval for checking for updates if it was disabled.
     */
    static enable(): void;

    /**
     * Changes the interval for checking for updates.
     * @param interval The interval in milliseconds to check for updates.
     */
    static setInterval(interval: number): void;

    /**
     * Checks for updates of the package on npm.
     */
    static checkForUpdate(): Promise<void>;
}

export declare class ProfileNetworthCalculator {
    /**
     * Creates a new instance of ProfileNetworthCalculator.
     */
    constructor(profileData: object, museumData?: object, bankBalance?: number);

    /**
     * Gets the networth of the player.
     */
    getNetworth(options?: NetworthOptions): Promise<NetworthResult>;

    /**
     * Gets the networth of the player without the cosmetic items.
     */
    getNonCosmeticNetworth(options?: NetworthOptions): Promise<NetworthResult>;

    /**
     * Returns the instance of the ProfileNetworthCalculator.
     */
    static fromPreParsed(profileData: object, items: Items, bankBalance: number): ProfileNetworthCalculator;
}

export declare class ItemNetworthCalculator {
    /**
     * Creates a new instance of ItemNetworthCalculator.
     */
    constructor(item: object);

    /**
     * Returns the networth of an item.
     */
    getNetworth(options?: NetworthOptions): Promise<Item>;

    /**
     * Returns the non-cosmetic networth of an item.
     */
    getNonCosmeticNetworth(options?: NetworthOptions): Promise<Item>;
}

export declare function getPrices(cache?: boolean, cacheTime?: number, retries?: number): Promise<Record<string, number>>;

export declare function parseItems(
    profileData: object,
    museumData: object,
    options?: {
        removeEmptyItems?: boolean;
        combineStorage?: boolean;
        returnRawMuseum?: boolean;
        additionalInventories?: Record<string, string>;
        parsedInventories?: Record<string, object[]>;
    },
): Promise<Items>;
