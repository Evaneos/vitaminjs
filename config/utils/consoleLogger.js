/* eslint no-console: 0 */

import chalk from 'chalk';

const THEMES = {
    error: (text) => chalk.red(`\u2717 ${ text }`),
    warn: (text) => chalk.yellow(text),
    pending: (text) => chalk.blue(text),
    success: (text) => chalk.green(`\u2713 ${ text }`)
};

const applyPrefix = (text, prefix) => {
    return prefix ? `[${ chalk.bold(prefix.toUpperCase()) }] ${ text }` : text
};

const applyStyle = (text, style) => {
    return THEMES[style] ?
        THEMES[style](text) :
        text;
};

const logger = (style) => {
    return console.hasOwnProperty(style) ?
        console[style] :
        console.log;
};

export const formatter = (text, style, prefix) => {
    return applyStyle( applyPrefix(text, prefix), style)
};

export default {
    log: (text, prefix) => { logger( formatter(text, 'log', prefix) ) },
    pending: (text, prefix) => { logger( formatter(text, 'pending', prefix) ) },
    warning: (text, prefix) => { logger( formatter(text, 'warn', prefix) ) },
    error: (text, prefix) => { logger( formatter(text, 'error', prefix) ) },
    success: (text, prefix) => { logger( formatter(text, 'success', prefix) ) }
};
