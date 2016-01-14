import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

export function bootstrapClient (appDescriptor) {
	// Grab the state from a global injected into server-generated HTML
	const initialState = window.__INITIAL_STATE__;

	// Create Redux store with initial state
	const store = createStore(_=>_, initialState);

	render(
	  	<Provider store={store}>
	    	{appDescriptor.rootComponent}
	  	</Provider>,
	  	document.getElementById('app')
	);
}
