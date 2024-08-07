declare module 'skyhelper-networth' {
  export interface NetworthOptions {
    v2Endpoint?: boolean;
    cache?: boolean;
    onlyNetworth?: boolean;
    prices?: object;
    returnItemData?: boolean;
    museumData?: object;
  }

  export interface PreDecodedNetworthOptions {
    v2Endpoint?: boolean;
    cache?: boolean;
    onlyNetworth?: boolean;
    prices?: object;
    returnItemData?: boolean;
  }

  export interface ItemNetworthOptions {
    cache?: boolean;
    prices?: object;
    returnItemData?: boolean;
  }

  export interface ItemCalculation {
    id: string;
    type: string;
    price: number;
    count: number;
    star?: number;
    shards?: number;
  }

  export interface Item {
    uuid?: string | null;
    uniqueId?: string;
    type?: string;
    exp?: number;
    active?: boolean;
    tier?: string;
    heldItem?: string | null;
    candyUsed?: number;
    skin?: string | null;
    level?: number;
    xpMax?: number;
    name: string;
    loreName?: string;
    id: string;
    price: number;
    base: number;
    calculation: ItemCalculation[];
    count: number;
    soulbound: boolean;
    item?: object;
  }

  export interface Category {
    total: number;
    unsoulboundTotal: number;
    items?: Item[];
  }

  export interface Categories {
    armor: Category;
    equipment: Category;
    wardrobe: Category;
    inventory: Category;
    enderchest: Category;
    accessories: Category;
    personal_vault: Category;
    fishing_bag: Category;
    potion_bag: Category;
    candy_inventory: Category;
    carvinal_mask_inventory: Category;
    storage: Category;
    museum: Category;
    sacks: Category;
    essence: Category;
    pets: Category;
  }

  export interface NetworthResult {
    noInventory: boolean;
    networth: number;
    unsoulboundNetworth: number;
    purse: number;
    bank: number;
    types: Categories;
  }

  export function getNetworth(profileData: object, bankBalance: number, options?: NetworthOptions): Promise<NetworthResult>;

  export function getPreDecodedNetworth(profileData: object, items: object, bankBalance: number, options?: PreDecodedNetworthOptions): Promise<NetworthResult>;

  export function getItemNetworth(item: object, options?: ItemNetworthOptions): Promise<Item>;

  export function getPrices(cache?: boolean): Promise<object>;
}
