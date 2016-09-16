import { PropTypes } from 'react';
import { Provider } from 'react-redux';
import CSSProvider from './CSSProvider';

const propTypes = {
    store: PropTypes.object.isRequired,
    insertCss: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
};

function App({ store, insertCss, children }) {
    return (<CSSProvider insertCss={insertCss}>
        <Provider store={store}>
            {children}
        </Provider>
    </CSSProvider>);
}

App.propTypes = propTypes;
export default App;
