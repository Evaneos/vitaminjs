import jsStringEscape from 'js-string-escape';
import { RouterContext } from 'react-router';
import { PropTypes } from 'react';
import Helmet from 'react-helmet';
// eslint-disable-next-line import/no-extraneous-dependencies
import { stringify as stateStringifier } from '__app_modules__redux_stateSerializer__';

import SharedApp from '../../shared/components/App';

const propTypes = {
    store: PropTypes.shape({
        getState: PropTypes.func.isRequired,
        dispatch: PropTypes.func.isRequired,
    }).isRequired,
    insertCss: PropTypes.func.isRequired,
    renderProps: PropTypes.objectOf(PropTypes.any).isRequired,
    entries: PropTypes.arrayOf(PropTypes.shape({
        src: PropTypes.string.isRequired,
        async: PropTypes.bool, // false by default
    }).isRequired).isRequired,
};

const App = ({ store, insertCss, renderProps, entries }) => (
    <SharedApp store={store} insertCss={insertCss}>
        <Helmet
            script={[
                { innerHTML: `window.__INITIAL_STATE__ = "${jsStringEscape(stateStringifier(store.getState()))}"` },
                ...entries,
            ]}
        />
        <RouterContext {...renderProps} />
    </SharedApp>
);
App.propTypes = propTypes;

export default App;
