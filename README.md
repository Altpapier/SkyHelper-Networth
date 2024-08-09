# SkyHelper-Networth

[![discord](https://img.shields.io/discord/720018827433345138?logo=discord)](https://discord.com/invite/fd4Be4W)
[![license](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![npm](https://img.shields.io/npm/v/skyhelper-networth)](https://npmjs.com/package/skyhelper-networth)
[![downloads](https://img.shields.io/npm/dm/skyhelper-networth)](https://npmjs.com/package/skyhelper-networth)

## About

[SkyHelper](https://skyhelper.altpapier.dev/)'s Networth Calculation as a Node.js module to calculate a player's SkyBlock networth by using their profile data provided by the [Hypixel API](https://api.hypixel.net/).

## Installation

```
npm install skyhelper-networth
```

## Networth Calculation

The following list shows how much each modifier counts towards an item's worth

**Items**:

- Enrichments: **50%**
- Farming for Dummies: **50%**
- Gemstone Power Scrolls: **50%**
- Wood Singularity: **50%**
- Art of War: **60%**
- Fuming Potato Books: **60%**
- Gemstone Slot Unlocks (only crimson armor): **60%**
- Popular Runes: **60%**
  - Music, Enchanting, Grand Searing, etc.
- Transmission Tuners: **70%**
- Essence: **75%**
- Golden Bounty: **75%**
- Silex: **75%**
- Art of Peace: **80%**
- Divan's Powder Coating: **80%**
- Jalapeno Book: **80%**
- Mana Disintegrator: **80%**
- Recombobulators: **80%**
  - Bonemerangs: **40%**
- Thunder In A Bottle: **80%**
- Enchantments: **85%**
  - Counter Strike: **20%**
  - Big Brain, Inferno, Overload, and Soul Eater: **35%**
  - Fatal Tempo: **65%**
- Shen's Auction Price Paid: **85%**
- Dyes: **90%**
- Gemstone Chambers: **90%**
- Attributes: **100%**
  - Based off the corresponding attribute shard's price
  - Lava Fishing rods and Crimson Hunter set use their base item's price instead
  - Kuudra Armor sets use the average sale value of all types with the same attribute
- Drill Upgrades: **100%**
- Etherwarp Conduit: **100%**
- Dungeon Master Stars: **100%**
- Gemstones: **100%**
- Hot Potato Books: **100%**
- Necron Blade Scrolls: **100%**
- Polarvoid Books: **100%**
- Prestige Item: **100%**
- Reforges: **100%**
- Winning Bid: **100%**

**Pets**:

- Pet Item: **100%**
- Soulbound Pet Skins: **80%**
- Pet Candied: **-35%**
  - Except Ender Dragon, Golden Dragon, and Scatha

## Functions

### `getNetworth()`

Returns the networth of a profile

#### Arguments

| Argument    | Description                                                               |
| ----------- | ------------------------------------------------------------------------- |
| profileData | The profile player data from the Hypixel API `profile.members[uuid]`      |
| bankBalance | The player's bank balance from the Hypixel API `profile.banking?.balance` |
| options     | See table below                                                           |

### `getPreDecodedNetworth()`

Returns the networth of a profile using pre-decoded items (used to save resources if you already have decoded the profile's inventories)

#### Arguments

| Argument    | Description                                                                                                                                                                                                                                                                             |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| profileData | The profile player data from the Hypixel API `profile.members[uuid]`                                                                                                                                                                                                                    |
| items       | Decoded and simplified inventories `{ armor, equipment, wardrobe, inventory, enderchest, storage, accessories, personal_vault, fishing_bag, potion_bag, candy_inventory, carnival_mask_inventory, museum }`, museum is an array of member[uuid].items and member[uuid].special combined |
| bankBalance | The player's bank balance from the Hypixel API `profile.banking?.balance`                                                                                                                                                                                                               |
| options     | See table below                                                                                                                                                                                                                                                                         |

##### `options`

| Option         | Description                                                                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| v2Endpoint     | By default false, must be set to true if you are using the profile data of hypixel's v2 endpoints                                         |
| cache          | By default true (5 minute cache), if set to false it will always make a request to get the latest prices from github                      |
| onlyNetworth   | Only return a player's networth without showing all player's items                                                                        |
| prices         | Provide prices from the getPrices() function for the bot not to request SkyHelper's prices each time the getNetworth() function is called |
| returnItemData | Will also return the item data that was used to calculate the item worth                                                                  |
| museumData     | Retrieved from the Hypixel API with the /skyblock/museum endpoint: museum.members[uuid]                                                   |

### `getItemNetworth()`

Returns the networth of an item

#### Arguments

| Argument | Description                              |
| -------- | ---------------------------------------- |
| item     | The data of an item (either pet or item) |
| options  | See table below                          |

##### `options`

| Option         | Description                                                                                                                             |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| cache          | By default true (5 minute cache), if set to false it will always make a request to get the latest prices from github                    |
| prices         | Provide prices from the getPrices() function for the bot not to request SkyHelper's prices each time the getNetworth() function is call |
| returnItemData | Will also return the item data that was used to calculate the item worth                                                                |

### `getPrices()`

Returns the prices used in the networth calculation, optimally this can be cached and used when calling `getNetworth`

## Example Usage

Calculate Networth:

```js
const { getNetworth } = require('skyhelper-networth');

const profile = // Retrieved from the Hypixel API with the /v2/skyblock/profiles endpoint: profiles[index]
const museumData = // Retrieved from the Hypixel API with the /v2/skyblock/museum endpoint: museum.members[uuid]

const profileData = profile.members['<UUID HERE>'];
const bankBalance = profile.banking?.balance;

const networth = await getNetworth(profileData, bankBalance, { v2Endpoint: true, museumData });
console.log(networth);
```

Calculate Networth using pre-decoded items:

```js
const { getPreDecodedNetworth } = require('skyhelper-networth');

const profile = // Retrieved from the Hypixel API with the /v2/skyblock/profiles endpoint: profiles[index]
const museumData = // Retrieved from the Hypixel API with the /v2/skyblock/museum endpoint: museum.members[uuid]

const profileData = profile.members['<UUID HERE>'];
const bankBalance = profile.banking?.balance;

const parsedInventoryExample = NBT.simplify(await NBT.parse(Buffer.from(profileData.inventory.inv_contents, 'base64')));
const items = { inventory: parsedInventoryExample, ... }; // Parsed inventories see ./examples/items.json for object format and required keys

const networth = await getPreDecodedNetworth(profileData, items, bankBalance, { v2Endpoint: true });
console.log(networth);
```

Retrieve prices and calculate Networth:
Note: Prices are cached for 5 minutes by default. Retrieving prices before is not needed for most users

```js
const { getNetworth, getPrices } = require('skyhelper-networth');

let prices = await getPrices();
setInterval(async () => {
	prices = await getPrices();
}, 1000 * 60 * 5); // Retrieve prices every 5 minutes

const profile = // Retrieved from the Hypixel API with the /v2/skyblock/profiles endpoint: profiles[index]
const museumData = // Retrieved from the Hypixel API with the /v2/skyblock/museum endpoint: museum.members[uuid]

const profileData = profile.members['<UUID HERE>'];
const bankBalance = profile.banking?.balance;

const networth = await getNetworth(profileData, bankBalance, { v2Endpoint: true, prices, museumData });
console.log(networth);
```
