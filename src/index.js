import { render } from 'react-dom';
import { compose, createStore } from 'redux';
import { Provider } from 'react-redux';

export function bootstrapClient (appDescriptor) {
	// Grab the state from a global injected into server-generated HTML
	const initialState = window.__INITIAL_STATE__;

	// Create Redux store with initial state
	const finalCreateStore = compose(
		window.devToolsExtension ? window.devToolsExtension() : f => f
	)(createStore);
	const store = finalCreateStore(appDescriptor.reducer, initialState);

	render(
	  	<Provider store={store}>
	    	{appDescriptor.rootComponent}
	  	</Provider>,
	  	document.getElementById('app')
	);
}
