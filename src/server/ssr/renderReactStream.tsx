import React from 'react';
import App from '../../client/App';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import fs from 'fs';
import { HTML_TEMPLATE_PATH } from '../configuration';
import { PrerenderData } from '../../shared/PrerenderedData';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducers } from '../../client/store';
import { Response } from 'express';
import { buildCanonicalUrl, KNOWN_ROUTES } from '../middleware/seoMiddleware';

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
	let templateHtml = fs.readFileSync(HTML_TEMPLATE_PATH, { encoding: 'utf-8' });

	// Inject canonical link tag
	const canonicalUrl = buildCanonicalUrl(url);
	templateHtml = templateHtml.replace(
		'<!-- CANONICAL -->',
		`<link rel="canonical" href="${canonicalUrl}" />`
	);

	// Determine if this is a known route (for 404 status)
	const normalizedPath = url.split('?')[0].toLowerCase().replace(/\/$/, '') || '/';
	const isKnownRoute = KNOWN_ROUTES.has(normalizedPath);

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
		reducer: rootReducers
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
			res.statusCode = didError ? 500 : isKnownRoute ? 200 : 404;
			res.setHeader('Content-Type', 'text/html; charset=utf-8');

			// Send the complete HTML with empty root div to show spinner
			res.write(htmlBefore);
			res.write(htmlAfter);
			res.end();
		},
		onAllReady() {
			// Content is ready but we already sent the response
			// Client-side React will handle hydration
		},
		onError(error) {
			didError = true;
			console.error('SSR streaming error:', error);
		}
	});
}
