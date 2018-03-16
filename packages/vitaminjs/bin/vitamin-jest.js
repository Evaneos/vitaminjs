/* eslint-disable global-require */
try {
    require('vitaminjs-jest/bin/vitamin-jest');
} catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
        throw e;
    }
}
