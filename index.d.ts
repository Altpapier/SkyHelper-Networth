declare module 'skyhelper-networth' {
  export interface ItemData {
    name: string;
    count: number;
    value: number;
    lore?: string[];
    attributes?: object;
    enchantments?: object;
    texture?: string;
  }

  export interface NetworthOptions {
    cache?: boolean;
    onlyNetworth?: boolean;
    prices?: object;
    returnItemData?: boolean;
    museumData?: object;
  }

  export interface NetworthResult {
    networth: number;
    items?: ItemData[];
  }

  export function getNetworth(profileData: object, bankBalance: number, options?: NetworthOptions): Promise<NetworthResult>;

  export function getPreDecodedNetworth(profileData: object, items: object, bankBalance: number, options?: NetworthOptions): Promise<NetworthResult>;

  export function getItemNetworth(item: object, options?: NetworthOptions): Promise<{ networth: number; itemData?: ItemData }>;

  export function getPrices(cache?: boolean): Promise<object>;
}