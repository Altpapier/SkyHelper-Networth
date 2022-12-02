const { calculatePet } = require('./petCalculator');
const { titleCase } = require('../helper/functions');
const { getPetLevel } = require('../constants/pets');
const { prestiges } = require('../constants/prestiges');
const { applicationWorth, enchantsWorth } = require('../constants/applicationWorth');
const { blockedEnchants, ignoredEnchants, stackingEnchants, ignoreSilex, masterStars, thunderCharge, validRunes, allowedRecombTypes, allowedRecombIds } = require('../constants/misc');
const { reforges } = require('../constants/reforges');
const skyblockItems = require('../constants/items.json');

const calculateItem = (item, prices) => {
  // TODO: Implement Backpack Calculations

  if (item.tag?.ExtraAttributes?.id === 'PET' && item.tag?.ExtraAttributes?.petInfo) {
    const petInfo = JSON.parse(item.tag.ExtraAttributes.petInfo);
    const level = getPetLevel(petInfo);
    petInfo.level = level.level;
    petInfo.xpMax = level.xpMax;
    return calculatePet(petInfo, prices);
  }

  if (item.tag?.ExtraAttributes?.id) {
    let itemName = item.tag.display.Name.replace(/§[0-9a-fk-or]/gi, '');
    let itemId = item.tag.ExtraAttributes.id.toLowerCase();
    const ExtraAttributes = item.tag.ExtraAttributes;
    const skyblockItem = skyblockItems.find((i) => i.id === itemId.toUpperCase());

    if (ExtraAttributes.skin) {
      itemId += `_skinned_${ExtraAttributes.skin.toLowerCase()}`;
    }

    if (['Beastmaster Crest', 'Griffin Upgrade Stone', 'Wisp Upgrade Stone'].includes(itemName)) {
      itemName = `${itemName} (${skyblockItem.tier ? titleCase(skyblockItem.tier.replaceAll('_', ' ')) : 'Unknown'})`;
    } else if (itemName.endsWith(' Exp Boost')) {
      itemName = `${itemName} (${skyblockItem.id ? titleCase(skyblockItem.id.split('_').at(-1)) : 'Unknown'})`;
    }

    // RUNES (Item)
    if (ExtraAttributes.id === 'RUNE' && ExtraAttributes.runes && Object.keys(ExtraAttributes.runes).length > 0) {
      const [runeType, runeTier] = Object.entries(ExtraAttributes.runes)[0];
      itemId = `rune_${runeType}_${runeTier}`.toLowerCase();
    }
    // CAKES (Item)
    if (ExtraAttributes.id === 'NEW_YEAR_CAKE') itemId = `new_year_cake_${ExtraAttributes.new_years_cake}`;
    // PARTY_HAT_CRAB (Item)
    if (ExtraAttributes.id.startsWith('PARTY_HAT_CRAB') && ExtraAttributes.party_hat_color) itemId = `${ExtraAttributes.id.toLowerCase()}_${ExtraAttributes.party_hat_color}`;

    const itemData = prices[itemId];
    let price = (itemData || 0) * item.Count;
    let base = (itemData || 0) * item.Count;
    if (!price && ExtraAttributes.price) {
      price = parseInt(ExtraAttributes.price) * 0.85;
      base = parseInt(ExtraAttributes.price) * 0.85;
    }
    const calculation = [];

    // UPGRADABLE ARMOR PRICE CALCULATION (eg. crimson)
    if (!itemData) {
      // if armor piece does not have base value
      const prestige = prestiges[itemId.toUpperCase()];
      if (prestige) {
        for (const prestigeItem of prestige) {
          const foundItem = skyblockItems.find((i) => i.id === prestigeItem);
          if (isNaN(price)) price = 0;

          if (foundItem?.upgrade_costs) {
            const allUpgrades = [...foundItem.upgrade_costs, foundItem.prestige?.costs || {}].flat();
            for (const upgrade of allUpgrades) {
              if (upgrade?.essence_type) {
                const calculationData = {
                  id: upgrade.essence_type,
                  type: 'essence',
                  price: (upgrade.amount || 0) * (prices[`essence_${upgrade.essence_type.toLowerCase()}`] || 0) * applicationWorth.essence,
                  count: upgrade.amount || 0,
                };
                price += calculationData.price;
                calculation.push(calculationData);
              } else {
                const prestigeItemPrice = prices[prestigeItem];
                if (prestigeItemPrice) {
                  const calculationData = {
                    id: prestigeItem,
                    type: 'prestige',
                    price: prestigeItemPrice * applicationWorth.prestigeItem,
                    count: 1,
                  };
                  price += calculationData.price;
                  calculation.push(calculationData);
                }
              }
            }
          }
        }
      }
    }

    // SHENS AUCTIONS PRICE PAID
    if (ExtraAttributes.price && ExtraAttributes.auction !== undefined && ExtraAttributes.bid !== undefined) {
      const pricePaid = Number(ExtraAttributes.price) * applicationWorth.shensAuctionPrice;
      if (pricePaid > price) {
        price = pricePaid;
        calculation.push({
          id: itemId,
          type: 'shens_auction',
          price: pricePaid,
          count: 1,
        });
      }
    }

    // MIDAS WEAPONS
    if (itemId === 'midas_staff' || itemId === 'midas_sword') {
      const maxBid = itemId === 'midas_sword' ? 50_000_000 : 100_000_000;
      const type = itemId === 'midas_sword' ? 'MIDAS_SWORD_50M' : 'MIDAS_STAFF_100M';

      // If max price paid
      if (ExtraAttributes.winning_bid >= maxBid) {
        const calculationData = {
          id: itemId,
          type: type,
          price: prices[type] || price,
          count: 1,
        };
        price = calculationData.price;
        calculation.push(calculationData);
      } else {
        // Else use winning bid amount
        const calculationData = {
          id: itemId,
          type: 'winning_bid',
          price: ExtraAttributes.winning_bid * applicationWorth.winningBid,
          count: 1,
        };
        price = calculationData.price;
        calculation.push(calculationData);
      }
    }

    // ENCHANTMENTS
    if (itemId === 'enchanted_book' && ExtraAttributes.enchantments) {
      // ENCHANTMENT BOOK
      if (Object.keys(ExtraAttributes.enchantments).length == 1) {
        const [name, value] = Object.entries(ExtraAttributes.enchantments)[0];

        const calculationData = {
          id: `${name}_${value}`.toUpperCase(),
          type: 'enchant',
          price: prices[`enchantment_${name}_${value}`] || 0,
          count: 1,
        };
        price = calculationData.price;
        calculation.push(calculationData);
        itemName = titleCase((name === 'aiming' ? 'dragon tracer' : name).replace(/_/g, ' '));
      }
    } else if (ExtraAttributes.enchantments) {
      // ITEM ENCHANTMENTS
      for (let [name, value] of Object.entries(ExtraAttributes.enchantments)) {
        if (blockedEnchants[itemId]?.includes(name)) continue;
        if (ignoredEnchants[name] == value) continue;

        // STACKING ENCHANTS
        if (stackingEnchants.includes(name)) value = 1;

        // SILEX
        if (name === 'efficiency' && value > 5 && !ignoreSilex.includes(itemId)) {
          const calculationData = {
            id: 'SIL_EX',
            type: 'silex',
            price: (prices['sil_ex'] || 0) * (value - (itemId === 'stonk_pickaxe' ? 6 : 5)) * applicationWorth.silex,
            count: 1,
          };
          price += calculationData.price;
          calculation.push(calculationData);
        }

        const calculationData = {
          id: `${name}_${value}`.toUpperCase(),
          type: 'enchant',
          price: (prices[`enchantment_${name}_${value}`] || 0) * (enchantsWorth[name] || applicationWorth.enchants),
          count: 1,
        };
        if (calculationData.price) {
          price += calculationData.price;
          calculation.push(calculationData);
        }
      }
    }

    // WOOD SINGULARITY
    if (ExtraAttributes.wood_singularity_count) {
      const calculationData = {
        id: 'WOOD_SINGULARITY',
        type: 'wood_singularity',
        price: (prices['wood_singularity'] || 0) * ExtraAttributes.wood_singularity_count * applicationWorth.woodSingularity,
        count: ExtraAttributes.wood_singularity_count,
      };
      price += calculationData.price;
      calculation.push(calculationData);
    }

    // TUNED TRANSMISSION
    if (ExtraAttributes.tuned_transmission) {
      const calculationData = {
        id: 'TRANSMISSION_TUNER',
        type: 'tuned_transmission',
        price: (prices['transmission_tuner'] || 0) * ExtraAttributes.tuned_transmission * applicationWorth.tunedTransmission,
        count: ExtraAttributes.tuned_transmission,
      };
      price += calculationData.price;
      calculation.push(calculationData);
    }

    // PULSE RING
    if (ExtraAttributes.thunder_charge && itemId === 'pulse_ring') {
      const thunderUpgrades = Object.values(thunderCharge).filter((charge) => charge <= ExtraAttributes.thunder_charge);
      const calculationData = {
        id: 'THUNDER_IN_A_BOTTLE',
        type: 'thunder_charge',
        price: (prices['thunder_in_a_bottle'] || 0) * (thunderUpgrades.at(-1) / 50_000) * applicationWorth.thunderInABottle,
        count: thunderUpgrades.at(-1) / 50_000,
      };
      price += calculationData.price;
      calculation.push(calculationData);
    }

    // RUNES  (Applied)
    if (ExtraAttributes.runes && Object.keys(ExtraAttributes.runes).length > 0 && !itemId.startsWith('rune')) {
      const [runeType, runeTier] = Object.entries(ExtraAttributes.runes)[0];
      const runeId = `${runeType}_${runeTier}`;
      if (validRunes.includes(runeId)) {
        const calculationData = {
          id: `RUNE_${runeId.toUpperCase()}`,
          type: 'rune',
          price: (prices[`rune_${runeId}`.toLowerCase()] || 0) * applicationWorth.runes,
          count: 1,
        };
        price += calculationData.price;
        calculation.push(calculationData);
      }
    }

    // HOT POTATO BOOKS
    if (ExtraAttributes.hot_potato_count) {
      if (ExtraAttributes.hot_potato_count > 10) {
        const calculationData = {
          id: 'FUMING_POTATO_BOOK',
          type: 'fuming_potato_book',
          price: (prices['fuming_potato_book'] || 0) * (ExtraAttributes.hot_potato_count - 10) * applicationWorth.fumingPotatoBook,
          count: ExtraAttributes.hot_potato_count - 10,
        };
        price += calculationData.price;
        calculation.push(calculationData);
      }

      const calculationData = {
        id: 'HOT_POTATO_BOOK',
        type: 'hot_potato_book',
        price: (prices['hot_potato_book'] || 0) * Math.min(ExtraAttributes.hot_potato_count, 10) * applicationWorth.hotPotatoBook,
        count: Math.min(ExtraAttributes.hot_potato_count, 10),
      };
      price += calculationData.price;
      calculation.push(calculationData);
    }

    // DYES
    if (ExtraAttributes.dye_item) {
      const calculationData = {
        id: ExtraAttributes.dye_item,
        type: 'dye',
        price: (prices[ExtraAttributes.dye_item] || 0) * applicationWorth.dye,
        count: 1,
      };
      price += calculationData.price;
      calculation.push(calculationData);
    }

    // ART OF WAR
    if (ExtraAttributes.art_of_war_count) {
      const calculationData = {
        id: 'THE_ART_OF_WAR',
        type: 'the_art_of_war',
        price: (prices['the_art_of_war'] || 0) * ExtraAttributes.art_of_war_count * applicationWorth.artOfWar,
        count: ExtraAttributes.art_of_war_count,
      };
      price += calculationData.price;
      calculation.push(calculationData);
    }

    // ART OF PEACE
    if (ExtraAttributes.artOfPeaceApplied) {
      const calculationData = {
        id: 'THE_ART_OF_PEACE',
        type: 'the_art_of_peace',
        price: (prices['the_art_of_peace'] || 0) * ExtraAttributes.artOfPeaceApplied * applicationWorth.artOfPeace,
        count: ExtraAttributes.artOfPeaceApplied,
      };
      price += calculationData.price;
      calculation.push(calculationData);
    }

    // FARMING FOR DUMMIES
    if (ExtraAttributes.farming_for_dummies_count) {
      const calculationData = {
        id: 'FARMING_FOR_DUMMIES',
        type: 'farming_for_dummies',
        price: (prices['farming_for_dummies'] || 0) * ExtraAttributes.farming_for_dummies_count * applicationWorth.farmingForDummies,
        count: ExtraAttributes.farming_for_dummies_count,
      };
      price += calculationData.price;
      calculation.push(calculationData);
    }

    // RECOMBS
    if (ExtraAttributes.rarity_upgrades > 0 && !ExtraAttributes.item_tier) {
      if (ExtraAttributes.enchantments || allowedRecombTypes.includes(skyblockItem?.category) || allowedRecombIds.includes(itemId)) {
        const calculationData = {
          id: 'RECOMBOBULATOR_3000',
          type: 'recombobulator_3000',
          price: (prices['recombobulator_3000'] || 0) * applicationWorth.recomb,
          count: 1,
        };
        price += calculationData.price;
        calculation.push(calculationData);
      }
    }

    // GEMSTONES
    if (ExtraAttributes.gems) {
      let unlockedSlots = [];
      let gems = [];
      if (skyblockItem?.gemstone_slots) {
        if (ExtraAttributes.gems.formatted) {
          unlockedSlots = ExtraAttributes.gems.unlockedSlots;
          gems = ExtraAttributes.gems.gems;
        } else {
          skyblockItem?.gemstone_slots.forEach((slot) => {
            if (slot.costs && ExtraAttributes.gems.unlocked_slots) {
              for (const [index, type] of ExtraAttributes.gems.unlocked_slots.entries()) {
                if (type.startsWith(slot.slot_type)) {
                  unlockedSlots.push(slot.slot_typ);
                  ExtraAttributes.gems.unlocked_slots.slice(Number(index), 1);
                  break;
                }
              }
            }
            if (!slot.costs) unlockedSlots.push(slot.slot_type);
            const key = Object.keys(ExtraAttributes.gems).find((k) => k.startsWith(slot.slot_type) && !k.endsWith('_gem'));
            if (key) {
              const type = ['COMBAT', 'OFFENSIVE', 'DEFENSIVE', 'MINING', 'UNIVERSAL'].includes(slot.slot_type) ? ExtraAttributes.gems[`${key}_gem`] : slot.slot_type;
              gems.push({ type, tier: ExtraAttributes.gems[key] instanceof Object ? ExtraAttributes.gems[key].quality : ExtraAttributes.gems[key], slotType: slot.slot_type });

              delete ExtraAttributes.gems[key];
              if (slot.costs && !ExtraAttributes.gems.unlocked_slots) unlockedSlots.push(slot.slot_type);
            }
          });
        }

        for (const gemstone of gems) {
          const calculationData = {
            id: `${gemstone.tier}_${gemstone.type}_GEM`,
            type: 'gemstone',
            price: (prices[`${gemstone.tier}_${gemstone.type}_gem`.toLowerCase()] || 0) * applicationWorth.gemstone,
            count: 1,
          };
          price += calculationData.price;
          calculation.push(calculationData);
        }
      }
    }

    // REFORGES
    if (ExtraAttributes.modifier && skyblockItem?.category !== 'ACCESSORY') {
      const reforge = ExtraAttributes.modifier;

      if (reforges[reforge]) {
        const calculationData = {
          id: reforges[reforge],
          type: 'reforge',
          price: (prices[reforges[reforge]] || 0) * applicationWorth.reforge,
          count: 1,
        };
        price += calculationData.price;
        calculation.push(calculationData);
      }
    }

    // STARS
    const dungeonItemLevel = parseInt((ExtraAttributes.dungeon_item_level || 0).toString().replace(/\D/g, ''));
    const upgradeLevel = parseInt((ExtraAttributes.upgrade_level || 0).toString().replace(/\D/g, ''));
    if (skyblockItem?.upgrade_costs && (dungeonItemLevel > 5 || upgradeLevel > 5)) {
      const starsUsedDungeons = dungeonItemLevel - 5;
      const starsUsedUpgrade = (upgradeLevel || 0) - 5;
      const starsUsed = Math.max(starsUsedDungeons, starsUsedUpgrade);

      if (skyblockItem.upgrade_costs.length <= 5) {
        for (const star of Array(starsUsed).keys()) {
          const calculationData = {
            id: masterStars[star],
            type: 'master_star',
            price: (prices[masterStars[star]] || 0) * applicationWorth.masterStar,
            count: 1,
          };
          price += calculationData.price;
          calculation.push(calculationData);
        }
      }
    }

    if (skyblockItem?.upgrade_costs && (dungeonItemLevel > 0 || upgradeLevel > 0)) {
      const itemUpgrades = skyblockItem.upgrade_costs;
      const level = Math.max(dungeonItemLevel, upgradeLevel);

      for (let i = 0; i < level; i++) {
        for (const upgrade of itemUpgrades[i] || []) {
          if (upgrade?.essence_type) {
            const calculationData = {
              id: upgrade.essence_type,
              type: 'essence',
              price: (prices[`essence_${upgrade.essence_type.toLowerCase()}`] || 0) * upgrade?.amount * applicationWorth.essence,
              count: upgrade?.amount,
            };
            price += calculationData.price;
            calculation.push(calculationData);
          }
        }
      }
    }

    // NECRON BLADE SCROLLS
    if (ExtraAttributes.ability_scroll) {
      for (const id of Object.values(ExtraAttributes.ability_scroll)) {
        const calculationData = {
          id,
          type: 'necron_scroll',
          price: (prices[id.toLowerCase()] || 0) * applicationWorth.necronBladeScroll,
          count: 1,
        };
        price += calculationData.price;
        calculation.push(calculationData);
      }
    }

    // GEMSTONE CHAMBERS
    if (ExtraAttributes.gemstone_slots || ['divan_chestplate', 'divan_leggings', 'divan_boots', 'divan_helmet'].includes(itemId)) {
      const gemstoneSlotAmount = ExtraAttributes.gemstone_slots ? ExtraAttributes.gemstone_slots : ExtraAttributes.gems?.unlocked_slots ? ExtraAttributes.gems.unlocked_slots.length : 0;
      const calculationData = {
        id: 'GEMSTONE_CHAMBER',
        type: 'gemstone_chamber',
        price: (prices['gemstone_chamber'] || 0) * gemstoneSlotAmount * applicationWorth.gemstoneChamber,
        count: gemstoneSlotAmount,
      };
      price += calculationData.price;
      calculation.push(calculationData);
    }

    // DRILLS
    const drillPartTypes = ['drill_part_upgrade_module', 'drill_part_fuel_tank', 'drill_part_engine'];
    if (drillPartTypes.some((type) => Object.keys(ExtraAttributes).includes(type))) {
      for (const type of drillPartTypes) {
        const calculationData = {
          id: ExtraAttributes[type],
          type: 'drill_part',
          price: (prices[ExtraAttributes[type]] || 0) * applicationWorth.drillPart,
          count: 1,
        };
        price += calculationData.price;
        calculation.push(calculationData);
      }
    }

    // ETHERWARP CONDUIT (Aspect of the Void)
    if (ExtraAttributes.ethermerge > 0) {
      const calculationData = {
        id: 'ETHERWARP_CONDUIT',
        type: 'etherwarp_conduit',
        price: (prices['etherwarp_conduit'] || 0) * applicationWorth.etherwarp,
        count: 1,
      };

      price += calculationData.price;
      calculation.push(calculationData);
    }

    // NEW YEAR CAKE BAG
    if (ExtraAttributes.new_year_cake_bag_years) {
      let cakesPrice = 0;
      for (const year of ExtraAttributes.new_year_cake_bag_years) cakesPrice += prices[`new_year_cake_${year}`] || 0;

      const calculationData = {
        id: `NEW_YEAR_CAKES`,
        type: 'new_year_cakes',
        price: cakesPrice,
        count: 1,
      };

      price += calculationData.price;
      calculation.push(calculationData);
    }

    const isSoulbound = !!(ExtraAttributes.donated_museum || item.tag.display?.Lore?.includes('§8§l* §8Co-op Soulbound §8§l*') || item.tag.display?.Lore?.includes('§8§l* §8Soulbound §8§l*'));
    return { name: itemName, id: itemId, price, base, calculation, count: item.Count || 1, soulbound: isSoulbound };
  }
  return null;
};

module.exports = {
  calculateItem,
};
