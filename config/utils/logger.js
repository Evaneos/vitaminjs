/* eslint-disable no-console */

import chalk from 'chalk';

const stripNewline = str => (
    str.constructor === String
        ? str.replace(/^\n+/, '')
        : str
);

const blankLines = (times = 1) => (new Array(times))
    .fill('\n')
    .join('');

const LOGGERS = [
    { method: 'success', level: 'log', style: str => chalk.green(`\n${chalk.inverse(' SUCESS ')} ${stripNewline(str)}`) },
    { method: 'error', level: 'error', style: str => chalk.red(`\n${chalk.inverse(' ERROR ')} ${stripNewline(str)}`) },
    { method: 'warning', level: 'warn', style: str => chalk.yellow(`\n${chalk.inverse(' WARNING ')} ${stripNewline(str)}`) },
    { method: 'info', level: 'info', style: chalk.blue },
    { method: 'log', level: 'log' },
    { method: 'blankLines', level: 'log', style: blankLines },
];

const buildLogger = ({ level, style = str => str }) => (...args) => {
    console[level](args
        .map(arg => style(arg))
        .join('\n'),
    );
};

export default LOGGERS.reduce((acc, logger) => (
    { ...acc, [logger.method]: buildLogger(logger) }
), {});
