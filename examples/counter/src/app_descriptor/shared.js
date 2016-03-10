import { Route } from 'react-router';
import { connect } from 'react-redux';

const reducer = (state = 0, action) => {
    if (action.type === 'INCREMENT') {
        return state + 1;
    }
    return state;
};

const App = (props) => (
    <div> Counter: {props.counter}
        <button onClick={props.onIncrement}> +1 </button>
    </div>
);

const mapStateToProps = (state) => ({
    counter: state.app,
});

const mapDispatchToProps = (dispatch) => ({
    onIncrement: () => dispatch({ type: 'INCREMENT' }),
});

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default {
    reducer,
    routes: <Route component={ConnectedApp} path="/" />,
};
