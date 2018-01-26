const chalk = require('chalk');

module.exports = (hot) => {
    if (hot && process.env.NODE_ENV === 'production') {
        console.log(chalk.yellow(
            '[WARNING]: Hot module reload option ignored in production environment.\n' +
            '(based on your NODE_ENV variable)\n'
        ));
        /* eslint no-param-reassign: 0 */
        return false;
    }
    return hot;
};
