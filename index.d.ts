const { NetworthTypes } = require('./NetworthTypes');

declare module 'skyhelper-networth' {
    export class NetworthManager {
        constructor(options: {
            networthType?: NetworthTypes;
            cachePrices?: boolean;
            pricesRetries?: number;
            itemsRetries?: number;
            itemsInterval?: number;
            onlyNetworth?: boolean;
            stackItems?: boolean;
            includeItemData?: boolean;
        });

        setNetworthType(networthType: NetworthTypes): this;

        getNetworth(params: { profileData: object; museumData?: object; bankBalance: number; prices?: object }): Promise<object>;

        getPreDecodedNetworth(params: {
            profileData: object;
            items: {
                armor: any[];
                equipment: any[];
                wardrobe: any[];
                inventory: any[];
                enderchest: any[];
                accessories: any[];
                personal_vault: any[];
                storage: any[];
                fishing_bag: any[];
                potion_bag: any[];
                sacks_bag: any[];
                candy_inventory: any[];
                carnival_mask_inventory: any[];
                museum: any[];
            };
            bankBalance: number;
            prices?: object;
        }): Promise<object>;

        getItemNetworth(params: { item: object; prices?: object }): Promise<object>;
    }

    export const NetworthTypes: {
        Normal: 'normal';
        NonCosmetic: 'nonCosmetic';
    };

    export class UpdateManager {
        constructor(options: { interval?: number });
        start(): void;
        stop(): void;
        checkForUpdate(): Promise<void>;
    }

    export class NetworthError extends Error {
        constructor(message: string);
    }

    export class PricesError extends Error {
        constructor(message: string);
    }

    export class ItemsError extends Error {
        constructor(message: string);
    }
}
