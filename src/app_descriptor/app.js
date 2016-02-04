/* eslint no-console: 0 */

const defaults = {
    reducer: (state) => state,
    routes: [],
    stateSerializer: {
        stringify: o => o,
        parse: s => s,
    },
};

let config = {};
try {
    config = require('__app__/app_descriptor/app.js').default;
} catch (e) {
    console.error('Error while loading app.js, aborting');
    throw e;
}


export default ({...defaults, ...config});
