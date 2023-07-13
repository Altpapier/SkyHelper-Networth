const API_KEY = "1090a4d3-864d-43a1-8641-820617fe21d9";
const axios = require("axios");

async function getUUID(username) {
  try {
    const { data } = await axios.get(
      `https://api.mojang.com/users/profiles/minecraft/${username}`
    );

    if (data === undefined) {
      throw new Error("Request to Mojang API failed. Please try again!");
    }

    return data.id;
  } catch (e) {
    throw new Error(e);
  }
}

async function getLatestProfile(username, profileName) {
  try {
    const uuid = await getUUID(username);

    const { data } = await axios.get(
      `https://api.hypixel.net/skyblock/profiles?key=${API_KEY}&uuid=${uuid}`
    );

    if (data === undefined || data.success === false) {
      throw new Error("Request to Hypixel API failed. Please try again!");
    }

    if (data.profiles === null || data.profiles.length === 0) {
      throw new Error("Player has no SkyBlock profiles.");
    }

    const profile =
      data.profiles.find((a) => a.cute_name === profileName) ??
      data.profiles.find((a) => a.selected === true) ??
      data.profiles[0];

    if (profile === undefined) {
      throw new Error("Player has no SkyBlock profiles.");
    }

    return {
      profiles: data.profiles,
      profileData: profile,
      profile: profile.members[uuid],
      uuid: uuid,
    };
  } catch (e) {
    throw new Error(e);
  }
}

async function getMuseum(profileID, uuid) {
  try {
    const { data } = await axios.get(
      `https://api.hypixel.net/skyblock/museum?key=${API_KEY}&profile=${profileID}`
    );

    if (data === undefined || data.success === false) {
      throw new Error("Request to Hypixel API failed. Please try again!");
    }

    if (data.members === null || Object.keys(data.members).length === 0) {
      throw new Error("Profile doesn't have a museum.");
    }

    if (data.members[uuid] === undefined) {
      throw new Error("Player doesn't have a museum.");
    }

    return {
      museum: data.members[uuid],
      museumData: data.members,
    };
  } catch (e) {
    throw new Error(e);
  }
}

module.exports = {
  getLatestProfile,
  getMuseum,
};
