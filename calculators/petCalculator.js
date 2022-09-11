const { titleCase } = require('../helper/functions');
const { blockedCandyReducePets, recombPetItems, tiers, soulboundPets } = require('../constants/pets');
const { applicationWorth } = require('../constants/applicationWorth');

const getPetLevelPrices = (pet, prices) => {
  const skin = pet.skin;
  return {
    lvl1: prices[`lvl_1_${pet.tier}_${pet.type}${skin ? `_skinned_${skin}` : ''}`.toLowerCase()] || 0,
    lvl100: prices[`lvl_100_${pet.tier}_${pet.type}${skin ? `_skinned_${skin}` : ''}`.toLowerCase()] || 0,
    lvl200: prices[`lvl_200_${pet.tier}_${pet.type}${skin ? `_skinned_${skin}` : ''}`.toLowerCase()] || 0,
  };
};

const calculatePet = (pet, prices) => {
  const { lvl1, lvl100, lvl200 } = getPetLevelPrices(pet, prices);
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
  if (pet.candyUsed > 0 && !blockedCandyReducePets.includes(pet.type)) {
    const reducedValue = price * applicationWorth.petCandy;

    if (!isNaN(price)) {
      if (pet.level == 100) {
        price = Math.max(reducedValue, price - 5000000);
      } else {
        price = Math.max(reducedValue, price - 2500000);
      }
    }
  }

  pet.tier = recombPetItems.includes(pet.heldItem) ? tiers[tiers.indexOf(pet.tier) + 1] : pet.tier;
  pet.price = price;
  pet.base = base;
  pet.calculation = calculation;
  pet.soulbound = soulboundPets.includes(pet.type);

  return pet;
};

module.exports = {
  calculatePet,
};
