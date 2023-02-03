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

const enrichments = [
  'TALISMAN_ENRICHMENT_CRITICAL_CHANCE',
  'TALISMAN_ENRICHMENT_CRITICAL_DAMAGE',
  'TALISMAN_ENRICHMENT_DEFENSE',
  'TALISMAN_ENRICHMENT_HEALTH',
  'TALISMAN_ENRICHMENT_INTELLIGENCE',
  'TALISMAN_ENRICHMENT_MAGIC_FIND',
  'TALISMAN_ENRICHMENT_WALK_SPEED',
  'TALISMAN_ENRICHMENT_STRENGTH',
  'TALISMAN_ENRICHMENT_ATTACK_SPEED',
  'TALISMAN_ENRICHMENT_FEROCITY',
  'TALISMAN_ENRICHMENT_SEA_CREATURE_CHANCE',
];

module.exports = {
  blockedEnchants,
  ignoredEnchants,
  stackingEnchants,
  ignoreSilex,
  masterStars,
  validRunes,
  allowedRecombTypes,
  allowedRecombIds,
  attributesBaseCosts,
  enrichments,
};
