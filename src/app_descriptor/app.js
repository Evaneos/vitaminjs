import DefaultRootComponent from '../components/DefaultRootComponent';

/* eslint no-console: 0 */

const defaults = {
    rootComponent: DefaultRootComponent,
    reducer: (state) => state,
    containerDiv: 'app', // TODO Find better name
    basename: '', // TODO Make sure empty string is a good default
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
