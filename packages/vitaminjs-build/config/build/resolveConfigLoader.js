/* eslint-disable prefer-template, no-var, global-require, import/no-dynamic-require */
/*
    This loader require the resource and serialize the default export in a JSON object.

    It means that the exported value of the required module is computed *during the build*
    It can be useful for loading a config file for instance (and using node fs event when building
    for client).

    However, you have to take care that the module required is compatible with node environment.
    That's why we use require and not this.exec
*/

module.exports = function resolveConfigLoader() {
    try {
        return `module.exports = ${JSON.stringify(require(this.resource).default())}`;
    } catch (e) {
        this.emitError(e);
    }
    return '';
};
