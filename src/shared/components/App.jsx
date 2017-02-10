import { PropTypes } from 'react';
import { Provider } from 'react-redux';
import CSSProvider from './CSSProvider';

const propTypes = {
    store: PropTypes.object.isRequired,
    insertCss: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
};

const App = ({ store, insertCss, children }) =>
    <CSSProvider insertCss={insertCss}>
        <Provider store={store}>
            <div> {children} </div>
        </Provider>
    </CSSProvider>
;
App.propTypes = propTypes;

export default App;
