#!/usr/bin/env node

const { version } = require('../package.json');

process.stdout.write(`v${version}\n`);
