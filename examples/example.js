const axios = require('axios');
const fs = require('fs');
const ProfileNetworthCalculator = require('../calculators/ProfileNetworthCalculator');

const API_KEY = '';
const UUID = 'ea805d40e8284d8d8e64e9fc8ac301ca'; // Altpapier
const PROFILE_NAME = 'Watermelon';

(async () => {
    // Prepare input data
    const skyblockResponse = await axios.get(`https://api.hypixel.net/v2/skyblock/profiles?key=${API_KEY}&uuid=${UUID}`);
    const profile = skyblockResponse.data.profiles.find((e) => e.cute_name === PROFILE_NAME);
    const museumResponse = await axios.get(`https://api.hypixel.net/v2/skyblock/museum?key=${API_KEY}&profile=${profile.profile_id}`);
    const museumData = museumResponse.data.members[UUID];
    const bankBalance = profile.banking.balance;
    const profileData = profile.members[UUID];

    // Initialize the NetworthManager
    const networthManager = new ProfileNetworthCalculator(profileData, museumData, bankBalance);

    // Calculate profile networth
    const networth = await networthManager.getNetworth();

    // Print output
    console.log(networth);

    // Save output
    fs.writeFileSync('examples/items.json', JSON.stringify(networthManager.items, null, 2));
    fs.writeFileSync('examples/output.json', JSON.stringify(networth, null, 2));

    process.exit(0);
})();
