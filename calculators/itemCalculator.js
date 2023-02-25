const { calculatePet } = require('./petCalculator');
const { titleCase } = require('../helper/functions');
const { getPetLevel } = require('../constants/pets');
const { prestiges } = require('../constants/prestiges');
const { applicationWorth, enchantsWorth } = require('../constants/applicationWorth');
const { blockedEnchants, ignoredEnchants, stackingEnchants, ignoreSilex, masterStars, validRunes, allowedRecombTypes, allowedRecombIds, attributesBaseCosts, enrichments } = require('../constants/misc');
const { reforges } = require('../constants/reforges');
const { getHypixelItemInformationFromId } = require('../constants/itemsMap');

function starCost(prices, upgrade, star) {
  const upgradePrice = upgrade.essence_type ? prices[`essence_${upgrade.essence_type.toLowerCase()}`] : prices[upgrade.item_id?.toLowerCase()];
  if (!upgradePrice) return;

  const calculationData = {
    id: upgrade.essence_type ? `${upgrade.essence_type}_ESSENCE` : upgrade.item_id,
    type: star ? 'star' : 'prestige',
    price: (upgrade.amount || 0) * (upgradePrice || 0) * (upgrade.essence_type ? applicationWorth.essence : 1),
    count: upgrade.amount || 0,
  };
  if (star) calculationData.star = star;
  return calculationData;
}

function starCosts(prices, calculation, upgrades, prestigeItem) {
  let price = 0;
  let star = 0;
  const datas = [];
  for (const upgrade of upgrades) {
    star++;
    let data;
    if (upgrade instanceof Array) {
      for (const cost of upgrade) {
        data = starCost(prices, cost, star);
        datas.push(data);
        if (!prestigeItem && data) {
          price += data.price;
          calculation.push(data);
        }
      }
    } else {
      data = starCost(prices, upgrade);
      datas.push(data);
      if (!prestigeItem && data) {
        price += data.price;
        calculation.push(data);
      }
    }
  }

  if (prestigeItem && datas.length) {
    const prestige = datas[0].type === 'prestige';
    const calculationData = datas.reduce(
      (acc, val) => {
        acc.price += val?.price || 0;
        return acc;
      },
      { id: prestigeItem, type: prestige ? 'prestige' : 'stars', price: 0, count: prestige ? 1 : star }
    );

    if (prices[prestigeItem.toLowerCase()]) calculationData.price += prices[prestigeItem.toLowerCase()];
    price += calculationData.price;
    calculation.push(calculationData);
  }
  return price;
}

const calculateItem = (item, prices, returnItemData) => {
  // TODO: Implement Backpack Calculations

  if (item?.tag?.ExtraAttributes?.id === 'PET' && item?.tag?.ExtraAttributes?.petInfo) {
    const petInfo = typeof item.tag.ExtraAttributes.petInfo === 'string' ? JSON.parse(item.tag.ExtraAttributes.petInfo) : item.tag.ExtraAttributes.petInfo;
    const level = getPetLevel(petInfo);
    petInfo.level = level.level;
    petInfo.xpMax = level.xpMax;
    return calculatePet(petInfo, prices);
  }

  if (item?.tag?.ExtraAttributes?.id) {
    if (!item.tag.display) return null;
    let itemName = item.tag.display.Name.replace(/§[0-9a-fk-or]/gi, '');
    let itemId = item.tag.ExtraAttributes.id.toLowerCase();
    const ExtraAttributes = item.tag.ExtraAttributes;
    const skyblockItem = getHypixelItemInformationFromId(itemId.toUpperCase());

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
          const foundItem = getHypixelItemInformationFromId(prestigeItem);
          if (isNaN(price)) price = 0;
          if (foundItem?.upgrade_costs) price += starCosts(prices, calculation, foundItem.upgrade_costs, prestigeItem);
          if (foundItem?.prestige?.costs) price += starCosts(prices, calculation, foundItem.prestige.costs, prestigeItem);
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

    if (ExtraAttributes.attributes) {
      for (const [attribute, tier] of Object.entries(ExtraAttributes.attributes)) {
        if (tier === 1) continue;
        // Base price times the amount needed to get that tier which is 2^tier - 1 because of the base item
        const shards = 2 ** (tier - 1) - 1;
        let baseAttributePrice = prices[`attribute_shard_${attribute}`];
        if (attributesBaseCosts[itemId] && prices[attributesBaseCosts[itemId]] < baseAttributePrice) {
          baseAttributePrice = prices[attributesBaseCosts[itemId]];
        } else if (/^(|hot_|fiery_|burning_|infernal_)(aurora|crimson|terror|hollow|fervor)_helmet$/.test(itemId) && prices[`kuudra_helmet_${attribute}`] < baseAttributePrice) {
          baseAttributePrice = prices[`kuudra_helmet_${attribute}`];
        } else if (/^(|hot_|fiery_|burning_|infernal_)(aurora|crimson|terror|hollow|fervor)(_chestplate|_leggings|_boots)$/.test(itemId)) {
          const kuudraPrices = [prices[`kuudra_chestplate_${attribute}`], prices[`kuudra_leggings_${attribute}`], prices[`kuudra_boots_${attribute}`]].filter((v) => v);
          const kuudraPrice = kuudraPrices.reduce((a, b) => a + b, 0) / kuudraPrices.length;
          if (kuudraPrice && (!baseAttributePrice || kuudraPrice < baseAttributePrice)) baseAttributePrice = kuudraPrice;
        }
        if (!baseAttributePrice) continue;
        const attributePrice = baseAttributePrice * shards * applicationWorth.attributes;

        price += attributePrice;
        calculation.push({
          id: `${attribute}_${tier}`.toUpperCase(),
          type: 'attribute',
          price: attributePrice,
          count: 1,
          shards,
        });
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
      const thunderUpgrades = Math.floor(ExtraAttributes.thunder_charge / 50_000);
      const calculationData = {
        id: 'THUNDER_IN_A_BOTTLE',
        type: 'thunder_charge',
        price: (prices['thunder_in_a_bottle'] || 0) * thunderUpgrades * applicationWorth.thunderInABottle,
        count: thunderUpgrades,
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

    // ENRICHMENTS
    if (ExtraAttributes.talisman_enrichment) {
      const enrichmentPrice = enrichments.reduce((acc, val) => Math.min(acc, prices[val] || 0), Infinity);
      if (enrichmentPrice !== Infinity) {
        const calculationData = {
          id: ExtraAttributes.talisman_enrichment.toUpperCase(),
          type: 'talisman_enrichment',
          price: enrichmentPrice * applicationWorth.enrichment,
          count: 1,
        };
        price += calculationData.price;
        calculation.push(calculationData);
      }
    }

    // RECOMBS
    if (ExtraAttributes.rarity_upgrades > 0 && !ExtraAttributes.item_tier) {
      const lastLoreLine = item.tag.display?.Lore?.at(-1);
      if (ExtraAttributes.enchantments || allowedRecombTypes.includes(skyblockItem?.category) || allowedRecombIds.includes(itemId) || lastLoreLine?.includes('ACCESSORY') || lastLoreLine?.includes('HATCCESSORY')) {
        const recombApplicationWorth = itemId === 'bone_boomerang' ? applicationWorth.recomb * 0.5 : applicationWorth.recomb;
        const calculationData = {
          id: 'RECOMBOBULATOR_3000',
          type: 'recombobulator_3000',
          price: (prices['recombobulator_3000'] || 0) * recombApplicationWorth,
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
                  unlockedSlots.push(slot.slot_type);
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

        // UNLOCKED GEMSTONE SLOTS
        // Currently just gemstone chambers
        const isDivansArmor = ['divan_helmet', 'divan_chestplate', 'divan_leggings', 'divan_boots'].includes(itemId);
        if (isDivansArmor || /^(|hot_|fiery_|burning_|infernal_)(aurora|crimson|terror|hollow|fervor)(_chestplate|_leggings|_boots)$/.test(itemId)) {
          const application = isDivansArmor ? applicationWorth.gemstoneChambers : applicationWorth.gemstoneSlots;
          const gemstoneSlots = JSON.parse(JSON.stringify(skyblockItem.gemstone_slots));
          for (const unlockedSlot of unlockedSlots) {
            const slot = gemstoneSlots.find((s) => s.slot_type === unlockedSlot);
            const slotIndex = gemstoneSlots.findIndex((s) => s.slot_type === unlockedSlot);
            if (slotIndex > -1) {
              let total = 0;
              for (const cost of slot.costs || []) {
                if (cost.type === 'COINS') total += cost.coins;
                else if (cost.type === 'ITEM') total += (prices[cost.item_id.toLowerCase()] || 0) * cost.amount;
              }

              const calculationData = {
                id: `${unlockedSlot}`,
                type: 'gemstone_slot',
                price: total * application,
                count: 1,
              };
              price += calculationData.price;
              calculation.push(calculationData);

              gemstoneSlots.splice(slotIndex, 1);
            }
          }
        }

        // GEMSTONES
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
      const level = Math.max(dungeonItemLevel, upgradeLevel);
      price += starCosts(prices, calculation, skyblockItem.upgrade_costs.slice(0, level + 1));
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
    const data = { name: itemName, loreName: item.tag.display.Name, id: itemId, price, base, calculation, count: item.Count || 1, soulbound: isSoulbound };
    if (returnItemData) data.item = item;
    return data;
  }
  return null;
};

module.exports = {
  calculateItem,
};
