import PropTypes from 'prop-types';
import { Router } from 'react-router';
import SharedApp from '../../shared/components/App';

const propTypes = {
    store: PropTypes.shape({
        getState: PropTypes.func.isRequired,
        dispatch: PropTypes.func.isRequired,
    }).isRequired,
    insertCss: PropTypes.func.isRequired,
    routes: PropTypes.node.isRequired,
    history: PropTypes.any.isRequired,
};

const App = ({ store, insertCss, routes, history }) => (
    <SharedApp store={store} insertCss={insertCss}>
        <Router history={history}>{routes}</Router>
    </SharedApp>
);

App.propTypes = propTypes;
export default App;
