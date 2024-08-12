const { ValidationError } = require('./errors');

function validateItem(item) {
    if (!item || typeof item !== 'object') {
        throw new ValidationError('Item must be an object');
    }

    if (item?.tag === undefined && item?.exp === undefined) {
        throw new ValidationError('Invalid item provided');
    }
}

function validateProfileData(profileData) {
    if (!profileData) {
        throw new ValidationError('Profile data must be provided');
    }

    if (typeof profileData !== 'object') {
        throw new ValidationError('Profile data must be an object');
    }

    if (!profileData.profile && !profileData.player_data && !profileData.leveling) {
        throw new ValidationError('Invalid profile data provided');
    }
}

module.exports = { validateItem, validateProfileData };
