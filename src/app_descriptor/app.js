
/* eslint no-console: 0 */
const defaults = {
    reducer: (state) => state,
    basename: '', // TODO Make sure empty string is a good default
    routes: [],
    stateSerializer: {
        stringify: o => o,
        parse: s => s,
    },
    middlewares: [],
};

let config = {};
try {
    config = require('__app__/app_descriptor/app.js').default;
} catch (e) {
    console.error('Error while loading app.js, aborting');
    throw e;
}


export default ({ ...defaults, ...config });
