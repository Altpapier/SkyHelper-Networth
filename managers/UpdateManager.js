const axios = require('axios');

class UpdateManager {
    #interval;
    #intervalInstance;
    /**
     * Creates an instance of UpdateManager and starts the interval for checking for updates (default: 1 minute).
     * @returns {UpdateManager}
     */
    constructor() {
        if (UpdateManager.instance) {
            return UpdateManager.instance;
        }

        UpdateManager.instance = this;
        this.checkForUpdate = this.checkForUpdate.bind(this);
        this.#interval = 1000 * 60; // 1 minute
        this.#intervalInstance = setInterval(this.checkForUpdate, this.#interval);
    }

    /**
     * Disables the interval for checking for updates.
     */
    disable() {
        clearInterval(this.#intervalInstance);
        this.#intervalInstance = null;
    }

    /**
     * Enables the interval for checking for updates. Only useful if the interval is disabled.
     */
    enable() {
        if (this.#intervalInstance) {
            return;
        }

        this.#intervalInstance = setInterval(this.checkForUpdate, this.#interval);
    }

    /**
     * Changes the interval for checking for updates.
     * @param {Number} interval The interval in milliseconds to check for updates.
     */
    setInterval(interval) {
        this.#interval = interval;
        clearInterval(this.#intervalInstance);
        this.#intervalInstance = setInterval(this.checkForUpdate, this.#interval);
    }

    /**
     * Checks for updates of the package on npm.
     */
    async checkForUpdate() {
        try {
            const packageInfo = await axios.get('https://registry.npmjs.org/skyhelper-networth');
            const latestVersion = packageInfo.data['dist-tags'].latest;
            const currentVersion = require('../package.json').version;
            const [latestMajor, latestMinor, latestPatch] = latestVersion.split('.').map(Number);
            const [currentMajor, currentMinor, currentPatch] = currentVersion.split('.').map(Number);

            if (latestMajor > currentMajor) {
                console.warn(
                    `[SKYHELPER-NETWORTH] A MAJOR update is available! Current version: ${currentVersion}, Latest version: ${latestVersion}. NOTE: This update may contain BREAKING changes.`,
                );
            } else if (
                (latestMajor === currentMajor && latestMinor > currentMinor) ||
                (latestMajor === currentMajor && latestMinor === currentMinor && latestPatch > currentPatch)
            ) {
                console.warn(`[SKYHELPER-NETWORTH] An update is available! Current version: ${currentVersion}, Latest version: ${latestVersion}`);
            }
        } catch (err) {
            console.error(`[SKYHELPER-NETWORTH] An error occurred while checking for updates: ${err}`);
        }
    }
}

/**
 * The instance of UpdateManager. Checking for updates is enabled by default (interval: 1 minute).
 */
const updateManager = new UpdateManager();

module.exports = updateManager;
