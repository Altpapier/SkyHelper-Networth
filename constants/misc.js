const blockedEnchants = {
  bone_boomerang: ['overload', 'power', 'ultimate_soul_eater'],
  death_bow: ['overload', 'power', 'ultimate_soul_eater'],
};

const ignoredEnchants = {
  scavenger: 5,
};

const stackingEnchants = ['expertise', 'compact', 'cultivating', 'champion', 'hecatomb'];

const masterStars = ['first_master_star', 'second_master_star', 'third_master_star', 'fourth_master_star', 'fifth_master_star'];

const thunderCharge = { UNCOMMON: 0, RARE: 150000, EPIC: 1000000, LEGENDARY: 5000000 };

const validRunes = ['MUSIC_1', 'MUSIC_2', 'MUSIC_3', 'ENCHANT_1', 'ENCHANT_2', 'ENCHANT_3', 'GRAND_SEARING_3'];

const allowedRecombTypes = ['ACCESSORY', 'NECKLACE', 'GLOVES', 'BRACELET', 'BELT', 'CLOAK'];

module.exports = {
  blockedEnchants,
  ignoredEnchants,
  stackingEnchants,
  masterStars,
  thunderCharge,
  validRunes,
  allowedRecombTypes,
};
