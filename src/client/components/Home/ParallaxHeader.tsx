import * as React from 'react';
import { parallaxLcpDesktopImage, parallaxLcpMobileImage, parallaxLayers } from './parallaxLayers';

const isHighPriorityLayer = (id: number): boolean => id === 0 || id === 2 || id === 5;
const isLikelyDesktopLcpLayer = (id: number): boolean => id === 15;

const ParallaxHeader: React.FC = () => (
	<section className="parallax-container" aria-label="Hero">
		<picture className="parallax-lcp-preload" aria-hidden="true">
			<source media="(min-width: 768px)" srcSet={parallaxLcpDesktopImage} />
			<img
				src={parallaxLcpMobileImage}
				alt=""
				loading="eager"
				decoding="async"
				fetchPriority="high"
			/>
		</picture>
		<div className="parallax-layer cover" data-parallax-speed="0"></div>
		{parallaxLayers.map(layer => (
			<div
				key={layer.id}
				className={`parallax-layer layer-${layer.id}`}
				data-parallax-speed={layer.speed}
				style={{ zIndex: layer.zIndex }}
			>
				<picture>
					<source media="(min-width: 768px)" srcSet={layer.desktopImage} />
					<img
						className="parallax-layer-image"
						src={layer.mobileImage}
						alt=""
						aria-hidden="true"
						loading={
							isHighPriorityLayer(layer.id) || isLikelyDesktopLcpLayer(layer.id) ? 'eager' : 'lazy'
						}
						decoding="async"
						fetchPriority={
							isHighPriorityLayer(layer.id) || isLikelyDesktopLcpLayer(layer.id) ? 'high' : 'auto'
						}
						sizes="100vw"
					/>
				</picture>
			</div>
		))}
		<div className="parallax-layer parallax-hero-content" data-parallax-speed="1.0">
			<div className="container">
				<div className="hero-content">
					<h1 className="mt-4 hero">
						<span className="hero-bold">Brian Harney</span>
						<span className="hero-apostrophe">'</span>
						<span className="hero-bold">s</span> <span className="hero-light">Software</span>{' '}
						<span className="hero-bold">Portfolio</span>
					</h1>
					<div className="border hero-border w-25 my-4"></div>
				</div>
			</div>
		</div>
	</section>
);

export default ParallaxHeader;
