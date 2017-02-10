import jsStringEscape from 'js-string-escape';
import { StaticRouter as Router } from 'react-router-dom';
import { PropTypes } from 'react';
import Helmet from 'react-helmet';
// eslint-disable-next-line import/no-extraneous-dependencies
import { stringify as stateStringifier } from '__app_modules__redux_stateSerializer__';

import SharedApp from '../../shared/components/AppContainer';
import config from '../../../config';
import HTTPStatus from './HTTPStatus';

const propTypes = {
    store: PropTypes.shape({
        getState: PropTypes.func.isRequired,
        dispatch: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.string.isRequired,
    insertCss: PropTypes.func.isRequired,
    context: PropTypes.objectOf(PropTypes.any).isRequired,
    mainEntry: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};
const AppContainer = ({ store, insertCss, location, mainEntry, context, children }) =>
    <SharedApp store={store} insertCss={insertCss}>
        <Helmet
            script={[
                { innerHTML: `window.__INITIAL_STATE__ = "${jsStringEscape(stateStringifier(store.getState()))}"` },
                { src: `${config.publicPath}/${mainEntry}`, async: true },
            ]}
        />
        <HTTPStatus status={200} />
        <Router location={location} context={context} basename={config.basePath} >
            {children}
        </Router>
    </SharedApp>
;
AppContainer.propTypes = propTypes;

export default AppContainer;
