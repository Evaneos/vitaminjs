
/* eslint no-console: 0 */
const defaults = {
    reducer: (state) => state,
    routes: [],
    stateSerializer: {
        stringify: o => o,
        parse: s => s,
    },
    middlewares: [],
    basename: '', // TODO Make sure empty string is a good default
    rootElementId: 'fondation-app',
};

let config = {};
try {
    config = require('__app__/app_descriptor/shared.js').default;
} catch (e) {
    console.error('Error while loading shared.js, aborting');
    throw e;
}


export default ({ ...defaults, ...config });
