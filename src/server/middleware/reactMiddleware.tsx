import { NextFunction, Request, Response } from 'express';
import { renderReactStream } from '../ssr/renderReactStream';

/**
 * Creates a React Server Side Rendering middleware using streaming.
 *
 * Install it right after the static files middleware.
 *
 * @returns The react SSR middleware function.
 */
export function reactMiddleware() {
	return function (req: Request, res: Response, next: NextFunction) {
		try {
			renderReactStream(req.url, res);
		} catch (error) {
			next(error);
		}
	};
}
