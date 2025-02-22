# SkyHelper-Networth (TypeScript)

[![license](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![npm](https://img.shields.io/npm/v/skyhelper-networth)](https://npmjs.com/package/skyhelper-networth)

[SkyHelper](https://skyhelper.altpapier.dev/)'s Networth Calculation as a Node.js module to calculate a player's SkyBlock networth by using their profile data provided by the [Hypixel API](https://api.hypixel.net/).

## Installation

```bash
npm install skyhelper-networth
```

---

## Core Concepts

### 📦 Key Classes

- **`NetworthManager`**: Central class for managing networth calculations (singleton pattern)
- **`ProfileNetworthCalculator`**: Handles networth calculation for player's profile
- **`GenericItemNetworthCalculator`**: Calculates networth for individual items
- **`UpdateManager`**: Manages periodic updates for items, prices and calculation itself

### 📄 Core Interfaces

- **`NetworthResult`**: Result structure for networth calculations
- **`Item`**: Detailed representation of an in-game item
- **`NetworthOptions`**: Configuration for networth calculations

---

## Quick Start

```typescript
import { ProfileNetworthCalculator } from 'skyhelper-networth';

const profile = // /v2/skyblock/profile: profile.members[uuid]
const museumData = // /v2/skyblock/museum: museum.members[uuid]
const bankBalance = profile.banking.balance;
const profileData = profile.members[uid];

// Initialize the NetworthManager
const networthManager = new ProfileNetworthCalculator(profileData, museumData, bankBalance);

// Calculate profile networth
const networth = await networthManager.getNetworth();

console.log(networth);
```

---

## Class Documentation

### 🧰 NetworthManager

**Manages global configuration and item caching**

#### Constructor

```typescript
new NetworthManager(options?: NetworthManagerOptions)
```

| Option            | Type      | Default          | Description                                                                        |
| ----------------- | --------- | ---------------- | ---------------------------------------------------------------------------------- |
| `cachePrices`     | `boolean` | `true`           | Whether to cache the prices for time after fetching them or fetch them every time. |
| `cachePricesTime` | `number`  | `300000` (5m)    | The amount of time to cache the prices in milliseconds.                            |
| `pricesRetries`   | `number`  | `3`              | The amount of retries to fetch the prices when failing to fetch them.              |
| `itemsRetries`    | `number`  | `3`              | The amount of retries to fetch the items when failing to fetch them.               |
| `itemsInterval`   | `number`  | `43200000` (12h) | The interval to fetch the items from the Hypixel API in milliseconds.              |
| `onlyNetworth`    | `boolean` | `false`          | Whether to only return the total networth or the items as well.                    |
| `stackItems`      | `boolean` | `true`           | Whether to stack items with the same name and price.                               |
| `includeItemData` | `boolean` | `false`          | hether to include the item data as a property in the item object.                  |

#### Key Methods

```typescript
setCachePrices(cache: boolean): void
setCachePricesTime(time: number): void
setOnlyNetworth(onlyNetworth: boolean): void
setIncludeItemData(includeItemData: boolean): void
```

---

### 📊 ProfileNetworthCalculator

**Handles player profile calculations**

#### Constructor

```typescript
new ProfileNetworthCalculator(
  profileData: object,
  museumData?: object,
  bankBalance?: number
)
```

#### Calculation Methods

```typescript
getNetworth(options?: NetworthOptions): Promise<NetworthResult>
getNonCosmeticNetworth(options?: NetworthOptions): Promise<NetworthResult>
```

#### Example Usage

```typescript
const networthManager = new ProfileNetworthCalculator(profileData, museumData, bankBalance);
const networth = await networthManager.getNonCosmeticNetworth({ prices: customPrices });

console.log(networth.types.inventory.total); // Total value of player's inventory
```

---

### 🔍 GenericItemNetworthCalculator

**Item-specific valuation**

#### Constructor

```typescript
new GenericItemNetworthCalculator(item: object)
```

#### Methods

```typescript
getNetworth(options?: NetworthOptions): Promise<Item>
getNonCosmeticNetworth(options?: NetworthOptions): Promise<Item>
```

#### Example

```typescript
const itemCalculator = new GenericItemNetworthCalculator(hyperionItem);
const itemValue = await itemCalculator.getNetworth();
console.log(itemValue.price); // Item's calculated value
```

---

## Advanced Features

### Price Management

```typescript
import { getPrices } from 'skyhelper-networth';

// Get latest prices with caching
const prices = await getPrices(true, 300000); // Cache for 5 minutes

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

### 📜 NetworthResult

```typescript
interface NetworthResult {
  networth: number;
  unsoulboundNetworth: number;
  purse: number;
  bank: number;
  types: Record<InventoryType, Inventory>;
}

type InventoryType = 'armor' | 'equipment' | 'wardrobe' | ...;
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
