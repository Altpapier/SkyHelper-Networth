const axios = require('axios');

class UpdateManager {
    constructor({ interval }) {
        this.interval = interval || 1000 * 60 * 60;
    }

    start() {
        this.checkForUpdate();
        this.interval = setInterval(this.checkForUpdate, this.interval);
    }

    stop() {
        clearInterval(this.interval);
    }

    async checkForUpdate() {
        try {
            const packageInfo = await axios.get('https://registry.npmjs.org/skyhelper-networth');
            const latestVersion = packageInfo.data['dist-tags'].latest;
            const currentVersion = require('./package.json').version;

            if (latestVersion !== currentVersion) {
                console.warn(`[SKYHELPER-NETWORTH] An update is available! Current version: ${currentVersion}, Latest version: ${latestVersion}`);
            }
        } catch {}
    }
}

module.exports = UpdateManager;
