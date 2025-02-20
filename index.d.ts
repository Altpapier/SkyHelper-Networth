// index.d.ts
import { NetworthResult } from './types/ProfileNetworthCalculator';
import { NetworthManagerOptions } from './types/NetworthManager';
import { Item } from './types/ItemNetworthCalculator';
import { NetworthOptions } from './types/global';

// Declare the classes and their properties/methods
declare class NetworthManager {
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
}

declare class UpdateManager {
    /**
     * Creates an instance of UpdateManager and starts the interval for checking for updates (default: 1 minute).
     */
    constructor();

    /**
     * Disables the interval for checking for updates.
     */
    disable(): void;

    /**
     * Enables the interval for checking for updates if it was disabled.
     */
    enable(): void;

    /**
     * Changes the interval for checking for updates.
     * @param interval The interval in milliseconds to check for updates.
     */
    setInterval(interval: number): void;

    /**
     * Checks for updates of the package on npm.
     */
    checkForUpdate(): Promise<void>;
}

declare class ProfileNetworthCalculator {
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
}

declare class ItemNetworthCalculator {
    /**
     * Returns the networth of an item.
     */
    getNetworth(options?: NetworthOptions): Promise<Item>;

    /**
     * Returns the non-cosmetic networth of an item.
     */
    getNonCosmeticNetworth(options?: NetworthOptions): Promise<Item>;
}

// Declare the getPrices function
declare function getPrices(cache?: boolean, cacheTime?: number, retries?: number): Promise<Record<string, number>>;

// Export all members as a CommonJS module
export = {
    NetworthManager,
    UpdateManager,
    ProfileNetworthCalculator,
    ItemNetworthCalculator,
    getPrices,
};
