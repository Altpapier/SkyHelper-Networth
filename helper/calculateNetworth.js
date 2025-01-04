const { calculatePet } = require('../calculators/petCalculator');
const { calculateSackItem } = require('../calculators/sacksCalculator');
const { calculateEssence } = require('../calculators/essenceCalculator');
const { calculateItem } = require('../calculators/itemCalculator');
const { getPetLevel } = require('../constants/pets');

const calculateNetworth = (items, purseBalance, bankBalance, personalBankBalance, prices, onlyNetworth, returnItemData) => {
  const categories = {};

  for (const [category, categoryItems] of Object.entries(items)) {
    // Calculate networth for each category
    categories[category] = { total: 0, unsoulboundTotal: 0, items: [] };

    for (const item of categoryItems) {
      const result =
        category === 'pets'
          ? calculatePet(item, prices)
          : category === 'sacks'
          ? calculateSackItem(item, prices)
          : category === 'essence'
          ? calculateEssence(item, prices)
          : calculateItem(item, prices, returnItemData);

      categories[category].total += result?.price || 0;
      if (!result?.soulbound) categories[category].unsoulboundTotal += result?.price || 0;
      if (!onlyNetworth && result && result?.price) categories[category].items.push(result);
    }

    // Sort items by price
    if (!onlyNetworth && categories[category].items.length > 0) {
      categories[category].items = categories[category].items
        .sort((a, b) => b.price - a.price)
        .reduce((r, a) => {
          const last = r[r.length - 1];
          if (last && last.id === a.id && last.price / last.count === a.price / a.count && !a?.isPet && last.soulbound === a.soulbound) {
            last.price += a.price;
            last.count += a.count;
            last.base = last.base || a.base;
            last.calculation = last.calculation || a.calculation;
          } else {
            r.push(a);
          }
          return r;
        }, [])
        .filter((e) => e);
    }

    if (onlyNetworth) delete categories[category].items;
  }

  // Calculate total networth
  const total = Object.values(categories).reduce((acc, category) => acc + category.total, 0) + (bankBalance || 0) + (purseBalance || 0) + (personalBankBalance || 0);
  const unsoulboundTotal = Object.values(categories).reduce((acc, category) => acc + category.unsoulboundTotal, 0) + (bankBalance || 0) + (purseBalance || 0) + (personalBankBalance || 0);

  return {
    noInventory: !items.inventory?.length,
    networth: total,
    unsoulboundNetworth: unsoulboundTotal,
    purse: purseBalance || 0,
    bank: bankBalance || 0,
    personalBank: personalBankBalance || 0,
    types: categories,
  };
};

const calculateItemNetworth = (item, prices, returnItemNetworth) => {
  const isPet = item.tag?.ExtraAttributes?.petInfo || item.exp;
  if (isPet !== undefined) {
    const petInfoData = item.tag?.ExtraAttributes?.petInfo;
    const petInfo = petInfoData ? (typeof petInfoData === 'string' ? JSON.parse(petInfoData) : petInfoData) : item;
    const level = getPetLevel(petInfo);
    petInfo.level = level.level;
    petInfo.xpMax = level.xpMax;
    return calculatePet(petInfo, prices);
  }
  return calculateItem(item, prices, returnItemNetworth);
};

module.exports = {
  calculateNetworth,
  calculateItemNetworth,
};
