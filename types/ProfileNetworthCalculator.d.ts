import { Item } from './ItemNetworthCalculator';
import { NetworthOptions } from './global';

interface NetworthResult {
    /**
     * The total networth of the player.
     */
    networth: number;
    /**
     * The total networth of the player without the soulbound items.
     */
    unsoulboundNetworth: number;
    /**
     * Whether the player has inventory API disabled or not.
     */
    noInventory: boolean;
    /**
     * Whether the non cosmetic items are included in the networth calculation.
     */
    isNonCosmetic: boolean;
    /**
     * The purse balance of the player.
     */
    purse: number;
    /**
     * The bank balance of the player.
     */
    bank: number;
    /**
     * The personal bank balance of the player.
     */
    personalBank: number;
    /**
     * The total networth of the player's inventories.
     */
    types: Record<Inventories, Inventory>;
}

type Inventories =
    | 'armor'
    | 'equipment'
    | 'wardrobe'
    | 'inventory'
    | 'enderchest'
    | 'accessories'
    | 'personal_vault'
    | 'fishing_bag'
    | 'potion_bag'
    | 'sacks_bag'
    | 'candy_inventory'
    | 'carnival_mask_inventory'
    | 'storage'
    | 'museum'
    | 'sacks'
    | 'essence'
    | 'pets';

type Inventory = {
    /**
     * The total networth of the inventory.
     */
    total: number;
    /**
     * The total networth of the inventory without the soulbound items.
     */
    unsoulboundTotal: number;
    /**
     * The items in the inventory
     * Only included if the onlyNetworth option is false.
     */
    items?: Array<Item>;
};

export interface ProfileNetworthCalculator {
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
    getNonCosmeticNetworth(options?: NetworthOptions): <NetworthResult>;
}
