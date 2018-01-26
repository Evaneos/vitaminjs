#!/usr/bin/env node
const path = require('path');

// FIXME Not __dirname anymore
process.env.VITAMIN_PATH = path.resolve(__dirname, '..');
