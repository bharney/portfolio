import express from 'express';
import compression from 'compression';
import { errorMiddleware } from './middleware/errorMiddleware';
import { reactMiddleware } from './middleware/reactMiddleware';
import { useRouting } from './middleware/routing';
import { PUBLIC_DIR_PATH } from './configuration';
import * as reactAsync from './ssr/renderReactAsync';

// we split the express app definition in a module separated from the entry point because it's easier to test.

export function createServer() {
	const server = express();

	// Enable gzip/deflate compression for all responses
	server.use(compression());

	server.use(
		express.static(PUBLIC_DIR_PATH, {
			index: false, // we don't want the static middleware to serve index.html. The SSR content won't be served otherwise.
			// Hashed files (js/css with chunkhash) get immutable long-term caching.
			// Non-hashed files (favicon, robots.txt, sitemap) get a short cache with revalidation.
			setHeaders(res, filePath) {
				if (/\.[a-f0-9]{16,}\.(js|css|woff2|woff|webp|jpg|jpeg|png|gif|avif)$/.test(filePath)) {
					res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
				} else {
					res.setHeader('Cache-Control', 'public, max-age=3600');
				}
			}
		})
	);

	server.get('/', async (req, res) => {
		const model = {
			id: 123,
			message: 'This data came from the server'
		};

		try {
			const html = await reactAsync.renderReactAsync(req.url, model);
			return res.status(200).contentType('text/html').send(html);
		} catch {
			return res.status(500).send('Internal server error');
		}
	});

	// renders the react app as fallback. The corresponding route will be handled by react router
	server.use(/.*/, reactMiddleware());

	server.use(errorMiddleware());

	return server;
}
