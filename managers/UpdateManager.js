const axios = require('axios');

// @ts-check

/**
 * @typedef {import('../types/UpdateManager').UpdateManager} UpdateManager
 */

/**
 * UpdateManager class.
 * Manages checking for updates at regular intervals.
 * @implements {UpdateManager}
 */
class UpdateManager {
    /**
     * Creates an instance of UpdateManager and starts the interval for checking for updates (default: 1 minute).
     * @returns {UpdateManager}
     */
    constructor() {
        if (UpdateManager.instance) {
            return UpdateManager.instance;
        }

        UpdateManager.instance = this;

        this.interval = 1000 * 60; // 1 minute
        this.intervalInstance = setInterval(this.checkForUpdate, this.interval);
    }

    /**
     * Disables the interval for checking for updates.
     */
    disable() {
        clearInterval(this.intervalInstance);
        this.intervalInstance = null;
    }

    /**
     * Enables the interval for checking for updates. Only useful if the interval is disabled.
     */
    enable() {
        if (this.intervalInstance) {
            return;
        }

        this.intervalInstance = setInterval(this.checkForUpdate, this.interval);
    }

    /**
     * Changes the interval for checking for updates.
     * @param {Number} interval The interval in milliseconds to check for updates.
     */
    setInterval(interval) {
        this.interval = interval;
        clearInterval(this.intervalInstance);
        this.intervalInstance = setInterval(this.checkForUpdate, this.interval);
    }

    /**
     * Checks for updates of the package on npm.
     */
    async checkForUpdate() {
        try {
            const packageInfo = await axios.get('https://registry.npmjs.org/skyhelper-networth');
            const latestVersion = packageInfo.data['dist-tags'].latest;
            const currentVersion = require('../package.json').version;

            if (latestVersion !== currentVersion) {
                console.warn(`[SKYHELPER-NETWORTH] An update is available! Current version: ${currentVersion}, Latest version: ${latestVersion}`);
            }
        } catch (err) {
            console.error(`[SKYHELPER-NETWORTH] An error occurred while checking for updates: ${err}`);
        }
    }
}

const updateManager = new UpdateManager();

module.exports = { updateManager };
