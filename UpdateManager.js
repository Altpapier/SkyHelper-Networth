const axios = require('axios');

class UpdateManager {
    constructor() {
        if (UpdateManager.instance) {
            return UpdateManager.instance;
        }

        UpdateManager.instance = this;

        this.interval = 1000 * 60; // 1 minute
        this.intervalInstance = setInterval(this.checkForUpdate, this.interval);
    }

    disable() {
        clearInterval(this.intervalInstance);
        this.intervalInstance = null;
    }

    enable() {
        if (this.intervalInstance) {
            return;
        }

        this.intervalInstance = setInterval(this.checkForUpdate, this.interval);
    }

    setInterval(interval) {
        this.interval = interval;
        clearInterval(this.intervalInstance);
        this.intervalInstance = setInterval(this.checkForUpdate, this.interval);
    }

    async checkForUpdate() {
        try {
            const packageInfo = await axios.get('https://registry.npmjs.org/skyhelper-networth');
            const latestVersion = packageInfo.data['dist-tags'].latest;
            const currentVersion = require('./package.json').version;

            if (latestVersion !== currentVersion) {
                console.warn(`[SKYHELPER-NETWORTH] An update is available! Current version: ${currentVersion}, Latest version: ${latestVersion}`);
            }
        } catch (err) {
            console.error(`[SKYHELPER-NETWORTH] An error occurred while checking for updates: ${err}`);
        }
    }
}

const updateManager = new UpdateManager();

module.exports = updateManager;
