import * as React from 'react';

interface OptimizedImageProps {
	src: string;
	alt: string;
	className?: string;
	width?: number;
	height?: number;
	/** Set to true for above-the-fold images (disables lazy loading) */
	priority?: boolean;
}

/**
 * OptimizedImage — performance-optimized image component.
 *
 * Features:
 * - Native lazy loading via `loading="lazy"` (below-the-fold images)
 * - `decoding="async"` to avoid blocking the main thread
 * - `fetchpriority="high"` for above-the-fold hero images
 * - Explicit width/height to prevent Cumulative Layout Shift (CLS)
 * - WebP source with original format fallback via <picture>
 *
 * To use WebP: place a `.webp` version of each image alongside the original.
 * The component will automatically try to serve the WebP variant first.
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
	src,
	alt,
	className,
	width,
	height,
	priority = false
}) => {
	// Derive a WebP source path from the original
	const webpSrc = src.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
	const hasWebp = webpSrc !== src; // only use <picture> if format can differ

	const imgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
		src,
		alt,
		className,
		width,
		height,
		loading: priority ? 'eager' : 'lazy',
		decoding: 'async',
		...(priority ? { fetchPriority: 'high' as any } : {})
	};

	if (hasWebp) {
		return (
			<picture>
				<source srcSet={webpSrc} type="image/webp" />
				<img {...imgProps} />
			</picture>
		);
	}

	return <img {...imgProps} />;
};

export default OptimizedImage;
