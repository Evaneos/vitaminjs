import { PropTypes } from 'react';
import CSSProvider from './CSSProvider';
import { Provider } from 'react-redux';

App.propTypes = {
    store: PropTypes.object.isRequired,
    insertCss: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
};

export default function App({ store, insertCss, children }) {
    return <CSSProvider insertCss={insertCss}>
        <Provider store={store}>
            {children}
        </Provider>
    </CSSProvider>;
}
