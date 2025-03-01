class NetworthError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}

class PricesError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}

class ItemsError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}

class ValidationError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}

module.exports = {
    NetworthError,
    PricesError,
    ItemsError,
    ValidationError,
};
