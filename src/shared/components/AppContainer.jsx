import { PropTypes } from 'react';
import { Provider } from 'react-redux';

import CSSProvider from './CSSProvider';

const propTypes = {
    store: PropTypes.object.isRequired,
    insertCss: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

const AppContainer = ({ store, insertCss, children }) =>
    <CSSProvider insertCss={insertCss}>
        <Provider store={store}>
            <div>
                {children}
            </div>
        </Provider>
    </CSSProvider>
;
AppContainer.propTypes = propTypes;

export default AppContainer;
