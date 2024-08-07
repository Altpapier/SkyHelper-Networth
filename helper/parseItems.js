const { getPetLevel } = require('../constants/pets');
const { decodeData } = require('../helper/functions');

const singleContainers = {
  armor: 'inv_armor',
  equipment: 'equipment_contents',
  wardrobe: 'wardrobe_contents',
  inventory: 'inv_contents',
  enderchest: 'ender_chest_contents',
  accessories: 'talisman_bag',
  personal_vault: 'personal_vault_contents',
  fishing_bag: 'fishing_bag',
  potion_bag: 'potion_bag',
  sacks_bag: 'sacks_bag',
  candy_inventory: 'candy_inventory_contents',
  carnival_mask_inventory: 'carnival_mask_inventory_contents',
};

const bagContainers = ['fishing_bag', 'potion_bag', 'talisman_bag', 'sacks_bag']; // In the v2 endpoint: profileData.inventory.bag_contents
const sharedContainers = ['candy_inventory_contents', 'carnival_mask_inventory_contents']; // In the v2 endpoint: profileData.shared_inventory

const parseItems = async (profileData, museumData, v2Endpoint) => {
  const items = {};

  // Parse Single Containers (Armor, Equipment, Wardrobe, Inventory, Enderchest, Personal Vault)
  for (const [container, key] of Object.entries(singleContainers)) {
    items[container] = [];
    if (v2Endpoint) {
      const containerData = bagContainers.includes(key) ? profileData.inventory?.bag_contents?.[key] : sharedContainers.includes(key) ? profileData.shared_inventory?.[key] : profileData.inventory?.[key];
      if (containerData) {
        items[container] = await decodeData(containerData.data);
      }
    } else {
      if (profileData[key]) {
        items[container] = await decodeData(profileData[key].data);
      }
    }
  }

  // Parse Storage
  items.storage = [];
  const inventoryData = v2Endpoint ? profileData.inventory : profileData;
  if (inventoryData?.backpack_contents && inventoryData?.backpack_icons) {
    // Parse Storage Contents
    for (const backpackContent of Object.values(inventoryData.backpack_contents)) {
      items.storage.push(await decodeData(backpackContent.data));
    }

    // Parse Storage Backpacks
    for (const backpack of Object.values(inventoryData.backpack_icons)) {
      items.storage.push(await decodeData(backpack.data));
    }

    items.storage = items.storage.flat();
  }

  // Parse Museum
  items.museum = [];
  if (museumData?.items) {
    for (const data of Object.values(museumData.items)) {
      if (data?.items?.data === undefined || data?.borrowing) continue;

      const decodedItem = await decodeData(data.items.data);

      items.museum.push(...decodedItem);
    }

    for (const data of museumData.special || []) {
      if (data?.items?.data === undefined) continue;

      const decodedItem = await decodeData(data.items.data);

      items.museum.push(...decodedItem);
    }
  }

  await postParseItems(profileData, items, v2Endpoint);

  return items;
};

const postParseItems = async (profileData, items, v2Endpoint) => {
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
  if (profileData.sacks_counts || profileData.inventory?.sacks_counts) {
    for (const [id, amount] of Object.entries(profileData.sacks_counts || profileData.inventory.sacks_counts)) {
      if (amount) items.sacks.push({ id, amount });
    }
  }

  // Parse Essence
  items.essence = [];
  if (v2Endpoint) {
    if (profileData.currencies?.essence) {
      for (const id of Object.keys(profileData.currencies?.essence)) {
        items.essence.push({ id: `essence_${id}`, amount: profileData.currencies.essence[id]?.current });
      }
    }
  } else {
    for (const id of Object.keys(profileData)) {
      if (id.startsWith('essence_')) items.essence.push({ id, amount: profileData[id] });
    }
  }

  // Parse Pets
  items.pets = [];
  if (profileData.pets || profileData.pets_data?.pets) {
    for (const pet of profileData.pets || profileData.pets_data.pets) {
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
