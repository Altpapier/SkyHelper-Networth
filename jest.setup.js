global.console = {
    ...console,
    // ? NOTE: uncomment to ignore specific console logs, currently ignoring only warnings
    // log: jest.fn(),
    // debug: jest.fn(),
    // info: jest.fn(),
    warn: jest.fn(),
    // error: jest.fn(),
};
