module.exports = (callback) => {
    ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) => {
        process.on(signal, () => callback(signal));
    });
};
