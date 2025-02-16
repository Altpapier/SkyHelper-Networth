import { ItemNetworthCalculator } from './types/ItemNetworthCalculator';
import { NetworthManager } from './types/NetworthManager';
import { ProfileNetworthCalculator } from './types/ProfileNetworthCalculator';
import { UpdateManager } from './types/UpdateManager';

declare module 'networthManager' {
    /**
     * The singleton instance of NetworthManager.
     */
    const networthManager: NetworthManager;

    /**
     * The instance of UpdateManager. Checking for updates is enabled by default (interval: 1 minute).
     */
    const updateManager: UpdateManager;

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
    export function getPrices(cache?: boolean, retries?: number): Promise<object>;

    export { updateManager, networthManager, ProfileNetworthCalculator, ItemNetworthCalculator };
}
