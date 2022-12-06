const blockedEnchants = {
  bone_boomerang: ['overload', 'power', 'ultimate_soul_eater'],
  death_bow: ['overload', 'power', 'ultimate_soul_eater'],
};

const ignoredEnchants = {
  scavenger: 5,
};

const stackingEnchants = ['expertise', 'compact', 'cultivating', 'champion', 'hecatomb'];

const ignoreSilex = ['promising_spade'];

const masterStars = ['first_master_star', 'second_master_star', 'third_master_star', 'fourth_master_star', 'fifth_master_star'];

const thunderCharge = { UNCOMMON: 0, RARE: 150000, EPIC: 1000000, LEGENDARY: 5000000 };

const validRunes = ['MUSIC_1', 'MUSIC_2', 'MUSIC_3', 'ENCHANT_1', 'ENCHANT_2', 'ENCHANT_3', 'GRAND_SEARING_3'];

const allowedRecombTypes = ['ACCESSORY', 'NECKLACE', 'GLOVES', 'BRACELET', 'BELT', 'CLOAK'];
const allowedRecombIds = ['divan_helmet', 'divan_chestplate', 'divan_leggings', 'divan_boots'];

const attributesBaseCosts = {
  glowstone_gauntlet: 'glowstone_gauntlet',
  vanquished_glowstone_gauntlet: 'glowstone_gauntlet',
  blaze_belt: 'blaze_belt',
  vanquished_blaze_belt: 'blaze_belt',
  magma_necklace: 'magma_necklace',
  vanquished_magma_necklace: 'magma_necklace',
  magma_rod: 'magma_rod',
  inferno_rod: 'magma_rod',
  hellfire_rod: 'magma_rod',
};

module.exports = {
  blockedEnchants,
  ignoredEnchants,
  stackingEnchants,
  ignoreSilex,
  masterStars,
  thunderCharge,
  validRunes,
  allowedRecombTypes,
  allowedRecombIds,
  attributesBaseCosts,
};
