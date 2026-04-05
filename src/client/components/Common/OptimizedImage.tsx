import * as React from 'react';

interface OptimizedImageProps {
	src: string;
	/** Pre-resolved WebP source URL (imported via webpack). If not provided, falls back to src only. */
	webpSrc?: string;
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
 * Usage: Import both the original and .webp image, then pass both:
 *   import photo from './photo.jpg';
 *   import photoWebp from './photo.webp';
 *   <OptimizedImage src={photo} webpSrc={photoWebp} alt="..." />
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
	src,
	webpSrc,
	alt,
	className,
	width,
	height,
	priority = false
}) => {
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

	if (webpSrc) {
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
