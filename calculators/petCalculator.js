const { titleCase } = require('../helper/functions');
const { blockedCandyReducePets, soulboundPets, tiers } = require('../constants/pets');
const { applicationWorth } = require('../constants/applicationWorth');

const getPetLevelPrices = (pet, prices) => {
  const tier = pet.heldItem === 'PET_ITEM_TIER_BOOST' ? tiers[tiers.indexOf(pet.tier) - 1] : pet.tier;
  const skin = pet.skin?.toLowerCase();
  const tierName = `${tier}_${pet.type}`.toLowerCase();
  const basePrices = {
    id: `${tierName}${skin ? `_skinned_${skin}` : ''}`,
    lvl1: prices[`lvl_1_${tierName}`] || 0,
    lvl100: prices[`lvl_100_${tierName}`] || 0,
    lvl200: prices[`lvl_200_${tierName}`] || 0,
  };

  if (skin) {
    return {
      id: basePrices.id,
      lvl1: Math.max(prices[`lvl_1_${tierName}${skin ? `_skinned_${skin}` : ''}`] || 0, basePrices.lvl1),
      lvl100: Math.max(prices[`lvl_100_${tierName}${skin ? `_skinned_${skin}` : ''}`] || 0, basePrices.lvl100),
      lvl200: Math.max(prices[`lvl_200_${tierName}${skin ? `_skinned_${skin}` : ''}`] || 0, basePrices.lvl200),
    };
  } else {
    return basePrices;
  }
};

const calculatePet = (pet, prices) => {
  const { lvl1, lvl100, lvl200, id } = getPetLevelPrices(pet, prices);
  pet.name = `[Lvl ${pet.level}] ${titleCase(`${pet.tier} ${pet.type}`)}${pet.skin ? ' ✦' : ''}`;
  if (lvl1 == undefined || lvl100 == undefined) return null;

  let price = lvl200 || lvl100;
  let calculation = [];

  // BASE
  if (pet.level < 100 && pet.xpMax) {
    const baseFormula = (lvl100 - lvl1) / pet.xpMax;

    if (baseFormula) {
      price = baseFormula * pet.exp + lvl1;
    }
  }

  if (pet.level > 100 && pet.level < 200) {
    const level = pet.level.toString().slice(1);

    if (level != 1) {
      const baseFormula = (lvl200 - lvl100) / 100;

      if (baseFormula) {
        price = baseFormula * level + lvl100;
      }
    }
  }

  let base = price;
  const soulbound = soulboundPets.includes(pet.type);

  // SOULBOUND PET SKIN
  if (pet.skin && soulbound) {
    const calculationData = {
      id: pet.skin,
      type: 'soulbound_pet_skin',
      price: (prices[`pet_skin_${pet.skin.toLowerCase()}`] || 0) * applicationWorth.soulboundPetSkins,
      count: 1,
    };
    price += calculationData.price;
    calculation.push(calculationData);
  }

  // PET ITEM
  if (pet.heldItem) {
    const calculationData = {
      id: pet.heldItem,
      type: 'pet_item',
      price: (prices[pet.heldItem.toLowerCase()] || 0) * applicationWorth.petItem,
      count: 1,
    };
    price += calculationData.price;
    calculation.push(calculationData);
  }

  // PET CANDY REDUCE
  const maxPetCandyXp = pet.candyUsed * 1000000;
  const xpLessPetCandy = pet.exp - maxPetCandyXp;
  if (pet.candyUsed > 0 && !blockedCandyReducePets.includes(pet.type) && xpLessPetCandy < pet.xpMax) {
    const reducedValue = price * applicationWorth.petCandy;

    if (!isNaN(price)) {
      if (pet.level == 100) {
        price = Math.max(reducedValue, price - 5000000);
      } else {
        price = Math.max(reducedValue, price - 2500000);
      }
    }
  }

  pet.id = id;
  pet.price = price;
  pet.base = base;
  pet.calculation = calculation;
  pet.soulbound = soulbound;

  return pet;
};

module.exports = {
  calculatePet,
};
