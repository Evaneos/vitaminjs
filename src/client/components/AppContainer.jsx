import { PropTypes } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppContainer as HotReloadAppContainer } from 'react-hot-loader';
import SharedApp from '../../shared/components/AppContainer';
import config from '../../../config';

const propTypes = {
    store: PropTypes.shape({
        getState: PropTypes.func.isRequired,
        dispatch: PropTypes.func.isRequired,
    }).isRequired,
    insertCss: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

const supportsHistory = 'pushState' in window.history;
const AppContainer = ({ store, insertCss, children }) =>
    <HotReloadAppContainer>
        <SharedApp store={store} insertCss={insertCss} >
            <Router forceReload={!supportsHistory} basename={config.basePath}>
                {children}
            </Router>
        </SharedApp>
    </HotReloadAppContainer>
;

AppContainer.propTypes = propTypes;
export default AppContainer;
