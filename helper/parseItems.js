const { getPetLevel } = require('../constants/pets');
const { decodeData } = require('../helper/functions');

const singleContainers = {
  armor: 'inv_armor',
  equipment: 'equippment_contents',
  wardrobe: 'wardrobe_contents',
  inventory: 'inv_contents',
  enderchest: 'ender_chest_contents',
  accessories: 'talisman_bag',
  personal_vault: 'personal_vault_contents',
  fishing_bag: 'fishing_bag',
  potion_bag: 'potion_bag',
  candy_inventory: 'candy_inventory_contents',
};

const parseItems = async (profileData) => {
  const items = {};

  // Parse Single Containers (Armor, Equipment, Wardrobe, Inventory, Enderchest, Personal Vault)
  for (const [container, key] of Object.entries(singleContainers)) {
    items[container] = [];
    if (profileData[key]) {
      items[container] = await decodeData(profileData[key].data);
    }
  }

  // Parse Storage
  items.storage = [];
  if (profileData.backpack_contents && profileData.backpack_icons) {
    // Parse Storage Contents
    for (const backpackContent of Object.values(profileData.backpack_contents)) {
      items.storage.push(await decodeData(backpackContent.data));
    }

    // Parse Storage Backpacks
    for (const backpack of Object.values(profileData.backpack_icons)) {
      items.storage.push(await decodeData(backpack.data));
    }

    items.storage = items.storage.flat();
  }

  await postParseItems(profileData, items);

  return items;
};

const postParseItems = async (profileData, items) => {
  // Parse Cake Bags
  for (const categoryItems of Object.values(items)) {
    for (const item of categoryItems) {
      if (!item?.tag?.ExtraAttributes?.new_year_cake_bag_data) continue;
      const cakes = await decodeData(item.tag?.ExtraAttributes?.new_year_cake_bag_data);
      if (item?.tag?.ExtraAttributes) {
        item.tag.ExtraAttributes.new_year_cake_bag_years = cakes.filter((cake) => cake.id && cake.tag?.ExtraAttributes?.new_years_cake).map((cake) => cake.tag.ExtraAttributes.new_years_cake);
      }
    }
  }

  // Parse Sacks
  items.sacks = [];
  if (profileData.sacks_counts) {
    for (const [id, amount] of Object.entries(profileData.sacks_counts)) {
      if (amount) items.sacks.push({ id, amount });
    }
  }

  // Parse Essence
  items.essence = [];
  for (const id of Object.keys(profileData)) {
    if (id.startsWith('essence_')) items.essence.push({ id, amount: profileData[id] });
  }

  // Parse Pets
  items.pets = [];
  if (profileData.pets) {
    for (const pet of profileData.pets) {
      const newPet = { ...pet };
      const level = getPetLevel(newPet);
      newPet.level = level.level;
      newPet.xpMax = level.xpMax;
      items.pets.push(newPet);
    }
  }
};

module.exports = {
  parseItems,
  postParseItems,
};
