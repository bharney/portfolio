import React from 'react';
import App from '../../client/App';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import fs from 'fs';
import { HTML_TEMPLATE_PATH } from '../configuration';
import { PrerenderData } from '../../shared/PrerenderedData';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { rootReducers } from '../../client/store';
import { Response } from 'express';

/**
 * Renders the React App using streaming SSR via renderToPipeableStream.
 *
 * The HTML template is split at the <div id="root"> marker. The head/opening
 * markup is sent immediately, then React streams the component tree into the
 * root div, and finally the closing markup is flushed.
 *
 * @param url  The request URL — injected into StaticRouter for route matching.
 * @param res  The Express response object to stream into.
 * @param prerenderedObject  Optional server-side data passed to the client.
 */
export function renderReactStream(url: string, res: Response, prerenderedObject?: unknown): void {
	const templateHtml = fs.readFileSync(HTML_TEMPLATE_PATH, { encoding: 'utf-8' });

	const dataElement = PrerenderData.saveToDom(prerenderedObject);

	// Split template at <div id="root"> so we can stream React content inside it
	const marker = '<div id="root">';
	const markerIndex = templateHtml.indexOf(marker);
	if (markerIndex === -1) {
		throw new Error('HTML template is missing <div id="root">');
	}
	const htmlBefore = templateHtml.slice(0, markerIndex) + dataElement + marker;
	const htmlAfter = templateHtml.slice(markerIndex + marker.length);

	const store = configureStore({
		reducer: rootReducers,
		middleware: [thunk]
	});

	const WrappedApp = (
		<Provider store={store}>
			<StaticRouter location={url}>
				<App serverData={prerenderedObject ?? null} />
			</StaticRouter>
		</Provider>
	);

	let didError = false;

	const { pipe } = renderToPipeableStream(WrappedApp, {
		onShellReady() {
			res.statusCode = didError ? 500 : 200;
			res.setHeader('Content-Type', 'text/html; charset=utf-8');

			// Send everything before <div id="root"> (head, critical CSS, etc.)
			res.write(htmlBefore);

			// Stream the React component tree into the root div
			pipe(res);
		},
		onAllReady() {
			// All Suspense boundaries have resolved — send the closing markup
			res.write(htmlAfter);
			res.end();
		},
		onError(error) {
			didError = true;
			console.error('SSR streaming error:', error);
		}
	});
}
