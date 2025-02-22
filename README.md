# SkyHelper-Networth (TypeScript)

[![discord](https://img.shields.io/discord/720018827433345138?logo=discord)](https://discord.com/invite/fd4Be4W)
[![license](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![npm](https://img.shields.io/npm/v/skyhelper-networth)](https://npmjs.com/package/skyhelper-networth)
[![downloads](https://img.shields.io/npm/dm/skyhelper-networth)](https://npmjs.com/package/skyhelper-networth)

[SkyHelper](https://skyhelper.altpapier.dev/)'s Networth Calculation as a Node.js module to calculate a player's SkyBlock networth by using their profile data provided by the [Hypixel API](https://api.hypixel.net/).

## Installation

```bash
npm install skyhelper-networth
```

---

## Core Concepts

### 📦 Key Classes

- **`ProfileNetworthCalculator`**: Handles networth calculation for player's profile.
- **`GenericItemNetworthCalculator`**: Calculates networth for individual items.
- **`NetworthManager`**: Central class for managing networth calculations ([singleton](https://en.wikipedia.org/wiki/Singleton_pattern)).
- **`UpdateManager`**: Manages periodic updates for items, prices and the networth package itself ([singleton](https://en.wikipedia.org/wiki/Singleton_pattern)).

### 📄 Core Interfaces

- **`NetworthOptions`**: Configuration for networth calculations
- **`NetworthResult`**: Result structure for networth calculations
- **`Item`**: Detailed representation of an in-game item

---

## Quick Start

```typescript
import { ProfileNetworthCalculator } from 'skyhelper-networth';

// Prepare input data
const profile = // https://api.hypixel.net/#tag/SkyBlock/paths/~1v2~1skyblock~1profile/get - profile.members[uuid]
const museumData = // https://api.hypixel.net/v2/skyblock/museum - museum.members[uuid]
const bankBalance = profile.banking.balance;
const profileData = profile.members[uid];

// Initialize the NetworthManager
const networthManager = new ProfileNetworthCalculator(profileData, museumData, bankBalance);

// Calculate profile networth
const networth = await networthManager.getNetworth();

console.log(networth);
```

The data structure of the output from `getNetworth` can be found at [Type Definitions](#type-definitions) section.

---

## Class Documentation

### 📊 ProfileNetworthCalculator

**Handles player profile calculations**

#### Constructor

```typescript
new ProfileNetworthCalculator(profileData: object, museumData?: object, bankBalance?: number)
```

#### Calculation Methods

```typescript
getNetworth(options?: NetworthOptions): Promise<NetworthResult>
getNonCosmeticNetworth(options?: NetworthOptions): Promise<NetworthResult>
fromPreParsed(profileData: object, items: Items, bankBalance: number): ProfileNetworthCalculator;
```

#### Example Usage

```typescript
const networthManager = new ProfileNetworthCalculator(profileData, museumData, bankBalance);
const networth = await networthManager.getNonCosmeticNetworth({ prices: customPrices });
console.log(networth.types.inventory.total); // Total value of player's inventory

const nonCosmeticNetworth = await networthManager.getNonCosmeticNetworth();
console.log(nonCosmeticNetworth.networth); // Total value of player's non-cosmetic items
```

---

### 🔍 ItemNetworthCalculator

**Item-specific calculation**

#### Constructor

```typescript
new ItemNetworthCalculator(item: object)
```

#### Methods

```typescript
getNetworth(options?: NetworthOptions): Promise<Item>
getNonCosmeticNetworth(options?: NetworthOptions): Promise<Item>
```

#### Example

```typescript
const itemCalculator = new ItemNetworthCalculator(item);
const itemValue = await itemCalculator.getNetworth({ prices: newPrices });
console.log(itemValue.price); // Item's calculated value
```

---

### 🧰 NetworthManager

**Manages global configuration and item caching**

#### Constructor

```typescript
new NetworthManager(options?: NetworthManagerOptions)
```

#### Configuration Options

##### Each option can be set and obtained using the corresponding `set` and `get` methods.

| Method                 | Property          | Type      | Default          | Description                                                                        |
| ---------------------- | ----------------- | --------- | ---------------- | ---------------------------------------------------------------------------------- |
| `setCachePrices()`     | `cachePrices`     | `boolean` | `true`           | Whether to cache the prices for time after fetching them or fetch them every time. |
| `setPricesRetries()`   | `cachePricesTime` | `number`  | `300000` (5m)    | The amount of time to cache the prices in milliseconds.                            |
| `setCachePricesTime()` | `pricesRetries`   | `number`  | `3`              | The amount of retries to fetch the prices when failing to fetch them.              |
| `setItemsRetries()`    | `itemsRetries`    | `number`  | `3`              | The amount of retries to fetch the items when failing to fetch them.               |
| `setItemsInterval()`   | `itemsInterval`   | `number`  | `43200000` (12h) | The interval to fetch the items from the Hypixel API in milliseconds.              |
| `setOnlyNetworth()`    | `onlyNetworth`    | `boolean` | `false`          | Whether to only return the total networth or the items as well.                    |
| `setStackItems()`      | `stackItems`      | `boolean` | `true`           | Whether to stack items with the same name and price.                               |
| `setIncludeItemData()` | `includeItemData` | `boolean` | `false`          | hether to include the item data as a property in the item object.                  |

---

## Additional Features

### Price Management

```typescript
import { getPrices } from 'skyhelper-networth';

// Get latest prices with caching
const prices = await getPrices(true);

// Manual cache refresh
networthManager.setCachePrices(false);
```

### Update Management

```typescript
const updateManager = new UpdateManager();
updateManager.setInterval(300000); // Check updates every 5m
updateManager.disable(); // Stop automatic checks
```

---

## Type Definitions

### 📜 NetworthOptions

| Property          | Type      | Default  | Description                                                                        |
| ----------------- | --------- | -------- | ---------------------------------------------------------------------------------- |
| `prices`          | `object`  | `Prices` | A prices object that includes item prices.                                         |
| `cachePrices`     | `boolean` | `true`   | Whether to cache the prices for time after fetching them or fetch them every time. |
| `pricesRetries`   | `number`  | `3`      | The amount of retries to fetch the prices when failing to fetch them.              |
| `onlyNetworth`    | `boolean` | `false`  | Whether to only return the total networth or the items as well.                    |
| `includeItemData` | `boolean` | `false`  | Whether to include the item data as a property in the item object.                 |
| `stackItems`      | `boolean` | `true`   | Whether to stack items with the same name and price.                               |

### 📜 NetworthResult

```typescript
interface NetworthResult {
  networth: number;
  unsoulboundNetworth: number;
  noInventory: boolean;
  isNonCosmetic: boolean;
  personalBank: number;
  purse: number;
  bank: number;
  types: Record<InventoryType, Inventory>;
}

type InventoryType = 'armor' | 'equipment' | 'wardrobe' | ...;

type Inventory = {
    total: number;
    unsoulboundTotal: number;
    items: Array<Item>;
};
```

### 📦 Item Structure

```typescript
interface Item {
    name: string;
    price: number;
    soulbound: boolean;
    cosmetic: boolean;
    calculation: Calculation[];
    // ... additional properties
}
```

---

## Contribution

Contributions welcome! Please follow the project's code style and add tests for new features.

```bash
git clone https://github.com/Altpapier/SkyHelper-Networth.git
npm install
npm test
```
