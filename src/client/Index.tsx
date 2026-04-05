import * as React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { rootReducers } from './store';
import { Provider } from 'react-redux';

// Get the application-wide store instance, prepopulating with state from the server where available.
const store = configureStore({
	reducer: rootReducers,
	middleware: [thunk]
});

function renderApp() {
	const root = document.getElementById('root');
	if (!root) {
		throw new Error('Root element not found');
	}

	const app = (
		<BrowserRouter>
			<Provider store={store}>
				<App />
			</Provider>
		</BrowserRouter>
	);

	// If SSR content exists, hydrate to reuse it (avoids flash/spinner).
	// Otherwise, do a fresh client render.
	if (root.children.length > 0) {
		hydrateRoot(root, app);
	} else {
		createRoot(root).render(app);
	}
}

renderApp();
