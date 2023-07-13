const { getLatestProfile, getMuseum } = require("./functions");
const { getNetworth } = require("..");

const username = "DeathStreeks";
const profileName = null;

(async () => {
  try {
    console.log(`Fetching ${username}'s ${profileName ?? "latest"} profile...`);
    const { profile, profileData, uuid } = await getLatestProfile(username, profileName);
    console.log(`Fetched ${username}'s ${profileData.cute_name} profile!`);

    console.log(`Fetching ${username}'s ${profileData.cute_name} profile's museum...`);
    const { museum } = await getMuseum(profileData.profile_id, uuid);
    console.log(`Fetched ${username}'s museum on ${profileData.cute_name} profile!`);

    const bank = profileData.banking?.balance ?? 0;
    const networth = await getNetworth(profile, bank, museum, {
      cache: true,
    });

    console.log(networth);
  } catch (e) {
    console.log(e);
  }
})();
