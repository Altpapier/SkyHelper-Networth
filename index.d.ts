import { ItemNetworthCalculator } from './types/ItemNetworthCalculator';
import { NetworthManager } from './types/NetworthManager';
import { ProfileNetworthCalculator } from './types/ProfileNetworthCalculator';
import { UpdateManager } from './types/UpdateManager';

declare module 'skyhelper-networth' {
    /**
     * The singleton instance of NetworthManager.
     */
    const NetworthManager: NetworthManager;

    /**
     * The instance of UpdateManager. Checking for updates is enabled by default (interval: 1 minute).
     */
    const UpdateManager: UpdateManager;

    /**
     * The ProfileNetworthCalculator class.
     */
    const ProfileNetworthCalculator: ProfileNetworthCalculator;

    /**
     * The ItemNetworthCalculator class.
     */
    const ItemNetworthCalculator: ItemNetworthCalculator;

    /**
     * Returns the prices used in the networth calculation, optimally this can be cached and used when calling `getNetworth`
     */
    export function getPrices(cache?: boolean, cacheTime?: number, retries?: number): Promise<object>;

    export { UpdateManager, NetworthManager, ProfileNetworthCalculator, ItemNetworthCalculator };
}
