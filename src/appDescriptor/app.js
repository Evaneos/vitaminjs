// const appResolve = require('./utils').appResolve;

// Need commonJS for dynamic modules
// TODO Export normalized representation

// TODO : Fallback in webpack env
// const appDescriptor = require(appResolve('src', 'appDescriptor')).default;
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
    config = require('__app_descriptor__/app.js').default;
} catch (e) {
    console.error('Error while loading app.js, aborting');
    throw e;
}

module.exports = Object.assign({}, defaults, config);
