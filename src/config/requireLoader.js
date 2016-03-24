/* eslint no-var: 0 */
/* eslint prefer-template: 0 */
/*
    This loader require the resource and serialize its default export in a JSON object.

    It means that the exported value of the module is computed *during the build*
    It can be useful for loading a config file for instance.

    However, you have to take care that the module required is compatible with node environment.
    That's why we use require and not this.exec
*/

require('../utils/transpile.js');
module.exports = function requireLoader() {
    try {
        return 'module.exports = ' + JSON.stringify(require(this.resource).default);
    } catch (e) {
        this.emitError(e);
    }
    return '';
};
