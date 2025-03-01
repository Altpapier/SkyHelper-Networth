function titleCase(str) {
    if (!str) return '';

    if (typeof str !== 'string') {
        return '';
    }

    return str
        .toLowerCase()
        .replaceAll('_', ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
    titleCase,
    sleep,
};
