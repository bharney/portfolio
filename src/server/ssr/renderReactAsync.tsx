import React from 'react';
import App from '../../client/App';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import fs from 'fs';
import { HTML_TEMPLATE_PATH } from '../configuration';
import { PrerenderData } from '../../shared/PrerenderedData';
import path from 'path';
import { ChunkExtractor } from '@loadable/server';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { rootReducers } from '../../client/store';
/**
 * Renders the react App as a html string.
 * @param url The render url. It will be injected in the react router so it can render the corresponding route.
 * @param prerenderedObject An object created in the server that can be accessed in the client side.
 * @returns A html string;
 */
export async function renderReactAsync(url: string, prerenderedObject?: unknown) {
	// read the html template file

	const staticHtmlContent = await fs.promises.readFile(HTML_TEMPLATE_PATH, { encoding: 'utf-8' });

	// create an element to store server side data

	const dataElement = PrerenderData.saveToDom(prerenderedObject);
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

	/*
        Render the react content as an HTML string.
     */

	const reactHtml = renderToStringWithChunks(WrappedApp);

	// finally combine all parts together

	const renderedHtml = buildHtml(staticHtmlContent, reactHtml, dataElement);

	return renderedHtml;
}

function buildHtml(templateHtml: string, reactHtml: string, dataTag: string) {
	const pattern = /<div\sid="root">/g;

	return templateHtml.replace(pattern, match => {
		if (match === '<div id="root">') {
			return `${dataTag}<div id="root">${reactHtml}`;
		}

		return match;
	});
}

function renderToStringWithChunks(component: JSX.Element): string {
	try {
		const clientStatsPath = path.join(__dirname, 'public', 'loadable-stats.json');
		const serverStatsPath = path.join(__dirname, 'loadable-stats.json');
		const statsFile = fs.existsSync(clientStatsPath) ? clientStatsPath : serverStatsPath;
		const extractor = new ChunkExtractor({ statsFile, entrypoints: ['index'] });
		const jsx = extractor.collectChunks(component);

		return renderToString(jsx);
	} catch (e) {
		console.error('SSR render error:', e);
		return '';
	}
}
