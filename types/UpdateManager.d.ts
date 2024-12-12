export class UpdateManager {
    /**
     * Creates an instance of UpdateManager and starts the interval for checking for updates (default: 1 minute).
     */
    constructor();

    /**
     * Disables the interval for checking for updates.
     */
    disable(): void;

    /**
     * Enables the interval for checking for updates if it was disabled.
     */
    enable(): void;

    /**
     * Changes the interval for checking for updates.
     * @param interval The interval in milliseconds to check for updates.
     */
    setInterval(interval: number): void;

    /**
     * Checks for updates of the package on npm.
     */
    checkForUpdate(): Promise<void>;
}
