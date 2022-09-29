const { parse, simplify } = require('prismarine-nbt');
const { promisify } = require('util');
const { getPetLevel } = require('../constants/pets');
const parseNbt = promisify(parse);

const singleContainers = {
  armor: 'inv_armor',
  equipment: 'equippment_contents',
  wardrobe: 'wardrobe_contents',
  inventory: 'inv_contents',
  enderchest: 'ender_chest_contents',
  accessories: 'talisman_bag',
  personal_vault: 'personal_vault_contents',
};

const parseItems = async (profileData) => {
  const items = {};

  // Parse Sacks
  items.sacks = [];
  if (profileData.sacks_counts) {
    for (const [id, amount] of Object.entries(profileData.sacks_counts)) {
      if (amount) items.sacks.push({ id, amount });
    }
  }

  // Parse Single Containers (Armor, Equipment, Wardrobe, Inventory, Enderchest, Personal Vault)
  for (const [container, key] of Object.entries(singleContainers)) {
    items[container] = [];
    if (profileData[key]) {
      items[container] = await parseContainer(profileData[key].data);
    }
  }

  // Parse Storage
  items.storage = [];
  if (profileData.backpack_contents && profileData.backpack_icons) {
    // Parse Storage Contents
    for (const backpackContent of Object.values(profileData.backpack_contents)) {
      items.storage.push(await parseContainer(backpackContent.data));
    }

    // Parse Storage Backpacks
    for (const backpack of Object.values(profileData.backpack_icons)) {
      items.storage.push(await parseContainer(backpack.data));
    }

    items.storage = items.storage.flat();
  }

  items.pets = [];
  if (profileData.pets) {
    for (const pet of profileData.pets) {
      const level = getPetLevel(pet);
      pet.level = level.level;
      pet.xpMax = level.xpMax;
      items.pets.push(pet);
    }
  }

  return items;
};

const parseContainer = async (data) => {
  const decoded = await decodeData(data);
  for (item of decoded) {
    if (!item.tag?.ExtraAttributes?.new_year_cake_bag_data) continue;
    const cakes = await decodeData(item.tag?.ExtraAttributes?.new_year_cake_bag_data);
    if (item?.tag?.ExtraAttributes) {
      item.tag.ExtraAttributes.new_year_cake_bag_years = cakes.filter((cake) => cake.id && cake.tag?.ExtraAttributes?.new_years_cake).map((cake) => cake.tag.ExtraAttributes.new_years_cake);
    }
  }
  return decoded;
};

const decodeData = async (data) => {
  const parsedNbt = await parseNbt(Buffer.from(data, 'base64'));
  const simplifiedNbt = simplify(parsedNbt);
  return simplifiedNbt.i;
};

module.exports = {
  parseItems,
};
