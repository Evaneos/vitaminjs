// const appResolve = require('./utils').appResolve;
import { replaceReducer } from '../store';
import DefaultRootComponent from '../components/DefaultRootComponent';
// Need commonJS for dynamic modules
// TODO Export normalized representation

// TODO : Fallback in webpack env
// const appDescriptor = require(appResolve('src', 'appDescriptor')).default;
const defaults = {
    rootComponent: DefaultRootComponent,
    reducer: (state) => state,
    routes: [],
    stateSerializer: {
        stringify: o => o,
        parse: s => s,
    },
};

let config = {};
try {
    config = require('__app__/appDescriptor/app.js').default;
} catch (e) {
    console.error('Error while loading app.js, aborting');
    throw e;
}

config = Object.assign({}, defaults, config);

if (module.hot) {
    module.hot.accept(['__app__/appDescriptor/app.js'], () => {
        replaceReducer(require('__app__/appDescriptor/app.js').default.reducer);
    });
}

export default config;
