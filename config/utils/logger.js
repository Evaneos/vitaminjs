/* eslint no-console: 0 */

import chalk from 'chalk';

const LOGGERS = [
    { method: 'success', level: 'log', style: str => chalk.green(`\n${chalk.inverse(' SUCESS ')} ${str}`) },
    { method: 'error', level: 'error', style: str => chalk.red(`\n${chalk.inverse(' ERROR ')} ${str}`) },
    { method: 'warning', level: 'warn', style: str => chalk.yellow(`\n${chalk.inverse(' WARNING ')} ${str}`) },
    { method: 'info', level: 'info', style: chalk.blue },
    { method: 'log', level: 'log' },
];

const buildLogger = ({ level, style = str => str }) => (...args) => {
    console[level](args
        .map(arg => style(arg.replace(/^\n+/, '')))
        .join('\n'),
    );
};

export default LOGGERS.reduce((acc, logger) => (
    { ...acc, [logger.method]: buildLogger(logger) }
), {});
