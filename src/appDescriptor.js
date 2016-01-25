// const appResolve = require('./utils').appResolve;

// Need commonJS for dynamic modules
// TODO Export normalized representation

// TODO : Fallback in webpack env
const appDescriptor = require('__app_descriptor__').default;

const defaults = {
    plugins: appDescriptor.plugins || [],
    reducer: (state, action) => state,
    routes: [],
};

module.exports = Object.assign(defaults, appDescriptor);
