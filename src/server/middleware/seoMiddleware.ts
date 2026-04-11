import { Request, Response, NextFunction } from 'express';

/** The canonical origin used for canonical URLs, redirects and sitemap references. */
export const CANONICAL_ORIGIN = 'https://bharney.com';

/** Routes that the React app actually renders as real pages (used for 404 detection). */
export const KNOWN_ROUTES = new Set(['/', '/portfolio', '/about', '/contact']);

/**
 * Redirects HTTP → HTTPS and www → non-www with a single 301.
 *
 * Uses the `x-forwarded-proto` header because Azure App Service (and most
 * reverse-proxies) terminates TLS at the load balancer and forwards plain HTTP
 * to Express.  Without checking this header the app would redirect-loop.
 *
 * Only active in production — in local dev there is no TLS.
 */
export function enforceCanonicalOrigin() {
	return function (req: Request, res: Response, next: NextFunction) {
		if (!__PRODUCTION__) return next();

		const proto = req.headers['x-forwarded-proto'] || req.protocol;
		const host = req.headers.host || '';

		// Never redirect localhost — avoids caching a permanent HTTPS redirect in dev
		if (host.startsWith('localhost') || host.startsWith('127.0.0.1')) return next();

		if (proto !== 'https' || host.startsWith('www.')) {
			const cleanHost = host.replace(/^www\./i, '');
			return res.redirect(301, `https://${cleanHost}${req.originalUrl}`);
		}

		next();
	};
}

/**
 * 301-redirects any path with a trailing slash (except the root `/`) to its
 * non-trailing-slash equivalent.
 *
 * `/portfolio/` → `/portfolio`
 * `/about/`     → `/about`
 *
 * This ensures Google only ever indexes the non-trailing-slash variant and
 * consolidates link equity.  Query strings are preserved.
 */
export function removeTrailingSlash() {
	return function (req: Request, res: Response, next: NextFunction) {
		if (req.path !== '/' && req.path.endsWith('/')) {
			const query = req.url.slice(req.path.length); // preserves ?key=val
			return res.redirect(301, req.path.slice(0, -1) + query);
		}
		next();
	};
}

/**
 * Builds the full canonical URL for a given request path.
 *
 * Normalises the path to lowercase without a trailing slash, so every
 * duplicate variant (mixed-case, trailing slash, etc.) resolves to the same
 * canonical.
 */
export function buildCanonicalUrl(requestPath: string): string {
	let normalized = requestPath.split('?')[0].toLowerCase();
	if (normalized !== '/' && normalized.endsWith('/')) {
		normalized = normalized.slice(0, -1);
	}
	return `${CANONICAL_ORIGIN}${normalized}`;
}
