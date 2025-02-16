const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');
const axios = require('axios');

jest.mock('axios');
jest.mock('../package.json', () => ({
    version: '1.0.0',
}));

describe('UpdateManager', () => {
    let UpdateManager;
    let consoleSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        consoleSpy = {
            warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
            error: jest.spyOn(console, 'error').mockImplementation(() => {}),
        };

        jest.isolateModules(() => {
            UpdateManager = require('../managers/UpdateManager');
        });
    });

    afterEach(() => {
        jest.clearAllTimers();
        if (consoleSpy.warn) consoleSpy.warn.mockRestore();
        if (consoleSpy.error) consoleSpy.error.mockRestore();
    });

    describe('Singleton Pattern', () => {
        test('should return same instance when creating multiple instances', () => {
            const instance1 = new (require('../managers/UpdateManager').constructor)();
            const instance2 = new (require('../managers/UpdateManager').constructor)();
            expect(instance1).toBe(instance2);
        });
    });

    describe('Interval Management', () => {
        test('should initialize with 1 minute interval', () => {
            const setIntervalSpy = jest.spyOn(global, 'setInterval');
            jest.isolateModules(() => {
                require('../managers/UpdateManager');
            });
            expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 60000);
            setIntervalSpy.mockRestore();
        });

        test('disable() should clear interval', () => {
            const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
            UpdateManager.disable();
            expect(clearIntervalSpy).toHaveBeenCalled();
        });

        test('enable() should set new interval if disabled', () => {
            const setIntervalSpy = jest.spyOn(global, 'setInterval');
            UpdateManager.disable();
            UpdateManager.enable();
            expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 60000);
        });

        test('enable() should not set new interval if already enabled', () => {
            const setIntervalSpy = jest.spyOn(global, 'setInterval');
            UpdateManager.enable();
            expect(setIntervalSpy).not.toHaveBeenCalled();
        });

        test('setInterval() should update interval duration', () => {
            const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
            const setIntervalSpy = jest.spyOn(global, 'setInterval');
            UpdateManager.setInterval(30000);
            expect(clearIntervalSpy).toHaveBeenCalled();
            expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 30000);
        });
    });

    describe('Update Checking', () => {
        test('should check for updates and notify if newer version available', async () => {
            axios.get.mockResolvedValueOnce({
                data: {
                    'dist-tags': {
                        latest: '2.0.0',
                    },
                },
            });

            await UpdateManager.checkForUpdate();

            expect(axios.get).toHaveBeenCalledWith('https://registry.npmjs.org/skyhelper-networth');
            expect(consoleSpy.warn).toHaveBeenCalledWith(expect.stringContaining('An update is available!'));
        });

        test('should not notify if current version is latest', async () => {
            axios.get.mockResolvedValueOnce({
                data: {
                    'dist-tags': {
                        latest: '1.0.0',
                    },
                },
            });

            await UpdateManager.checkForUpdate();

            expect(consoleSpy.warn).not.toHaveBeenCalled();
        });

        test('should handle API errors gracefully', async () => {
            const error = new Error('API Error');
            axios.get.mockRejectedValueOnce(error);

            await UpdateManager.checkForUpdate();

            expect(consoleSpy.error).toHaveBeenCalledWith(expect.stringContaining('An error occurred while checking for updates'));
        });
    });
});
