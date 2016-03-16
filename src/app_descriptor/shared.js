
/* eslint no-console: 0 */
const defaults = {
    reducer: (state = null) => state,
    routes: [],
    stateSerializer: {
        stringify: o => o,
        parse: s => s,
    },
    middlewares: [],
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
