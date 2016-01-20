const appResolve = require('./utils').appResolve;

// Need commonJS for dynamic modules
// TODO Export normalized representation
const appDescriptor = require(appResolve('src', 'appDescriptor')).default;
const defaults = {
    plugins: appDescriptor.plugins || [],
    reducer: (state, action) => state,
    routes: [],
};

module.exports = Object.assign(defaults, appDescriptor)
