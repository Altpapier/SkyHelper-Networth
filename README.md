# SkyHelper-Networth

## About

[SkyHelper](https://skyhelper.altpapier.dev/)'s Networth Calculation as a Node.js module to calculate a player's Skyblock networth by using their profile data provided by the [Hypixel API](https://api.hypixel.net/).

## Installation

```
npm install skyhelper-networth
```

## Networth Calculation

The following list shows how much each modifier counts towards an item's worth

**Items**:

- Enchantments: **85%**
  → Overload, Soul Eater, Inferno, Fatal Tempo: **35%**
  → Counter Strike: **20%**
- Hot Potato Books: **100%**
- Fuming Potato Books: **60%**
- Art of War: **60%**
- Farming for Dummies: **50%**
- Enrichments: **75%**
- Recombobulators: **80%**
- Transmission Tuners: **70%**
- Wood Singularity: **50%**
- Silex: **75%**
- Gemstones: **100%**
- Reforges: **100%**
- Drill Upgrades: **100%**
- Etherwarp Conduit: **100%**
- Dungeon Master Stars: **100%**
- Essence: **75%**
- Prestige Item: **100%**
- Thunder In A Bottle: **80%**
- Popular Runes: **60%**
- Winning Bid: **100%**
- Necron Blade Scrolls: **100%**
- Gemstone Chambers: **90%**
- Dyes: **90%**

**Pets**:

- Pet Item: **100%**
- Pet Candied: **-35%**
  → Except Golden Dragon, Ender Dragon and Scatha

## Functions

### `getNetworth()`

Returns the networth of a profile

#### Arguments

| Argument    | Description                                                               |
| ----------- | ------------------------------------------------------------------------- |
| profileData | The profile player data from the Hypixel API `profile.members[uuid]`      |
| bankBalance | The player's bank balance from the Hypixel API `profile.banking?.balance` |
| options     | See table below                                                           |

##### `options`

| Option       | Description                                                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| onlyNetworth | Only return a player's networth without showing all player's items                                                                        |
| prices       | Provide prices from the getPrices() function for the bot not to request SkyHelper's prices each time the getNetworth() function is called |

### `getItemNetworth()`

Returns the networth of an item

#### Arguments

| Argument | Description                              |
| -------- | ---------------------------------------- |
| item     | The data of an item (either pet or item) |
| options  | See table below                          |

##### `options`

| Option | Description                                                                                                                             |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| prices | Provide prices from the getPrices() function for the bot not to request SkyHelper's prices each time the getNetworth() function is call |

### `getPrices()`

Returns the prices used in the networth calculation, optimally this can be cached and used when calling `getNetworth`

## Example Usage

Calculate Networth:

```js
const { getNetworth } = require('skyhelper-networth');

const profile = // Retrieved from the Hypixel API with the /skyblock/profiles endpoint: profiles[index]

const profileData = profile.members['<UUID HERE>'];
const bankBalance = profile.banking?.balance;

const networth = await getNetworth(profileData, bankBalance);
console.log(networth);
```

Retrieve prices and calculate Networth:

```js
const { getNetworth, getPrices } = require('skyhelper-networth');

let prices = await getPrices();
setInterval(async () => {
	prices = await getPrices();
}, 1000 * 60 * 5); // Retrieve prices every 5 minutes

const profile = // Retrieved from the Hypixel API with the /skyblock/profiles endpoint: profiles[index]

const profileData = profile.members['<UUID HERE>'];
const bankBalance = profile.banking?.balance;

// Networth can now be retrieved without having to request SkyHelper's prices every function call
const networth = await getNetworth(profileData, bankBalance, { prices });
console.log(networth);
```
