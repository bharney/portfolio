import * as React from 'react';

const ParallaxHeader: React.FC = () => (
	<section className="parallax-container" aria-label="Hero">
		<div className="parallax-layer cover" data-parallax-speed="0"></div>
		<div className="parallax-layer layer-0" data-parallax-speed="0.02"></div>
		<div className="parallax-layer layer-1" data-parallax-speed="0.04"></div>
		<div className="parallax-layer layer-2" data-parallax-speed="0.06"></div>
		<div className="parallax-layer layer-3" data-parallax-speed="0.08"></div>
		<div className="parallax-layer layer-4" data-parallax-speed="0.10"></div>
		<div className="parallax-layer layer-5" data-parallax-speed="0.13"></div>
		<div className="parallax-layer layer-6" data-parallax-speed="0.16"></div>
		<div className="parallax-layer layer-7" data-parallax-speed="0.19"></div>
		<div className="parallax-layer layer-8" data-parallax-speed="0.22"></div>
		<div className="parallax-layer layer-9" data-parallax-speed="0.26"></div>
		<div className="parallax-layer layer-10" data-parallax-speed="0.30"></div>
		<div className="parallax-layer layer-11" data-parallax-speed="0.34"></div>
		<div className="parallax-layer layer-12" data-parallax-speed="0.39"></div>
		<div className="parallax-layer layer-13" data-parallax-speed="0.44"></div>
		<div className="parallax-layer layer-14" data-parallax-speed="0.49"></div>
		<div className="parallax-layer layer-15" data-parallax-speed="0.55"></div>
		<div className="parallax-layer layer-16" data-parallax-speed="0.61"></div>
		<div className="parallax-layer layer-18" data-parallax-speed="0.74"></div>
		<div className="parallax-layer layer-19" data-parallax-speed="0.80"></div>
		<div className="parallax-layer parallax-hero-content" data-parallax-speed="1.0">
			<div className="container">
				<div className="hero-content">
					<h1 className="mt-4 hero">
						<span className="hero-bold">Brian Harney</span>
						<span className="hero-apostrophe">'</span>
						<span className="hero-bold">s</span>{' '}
						<span className="hero-light">Software</span>{' '}
						<span className="hero-bold">Portfolio</span>
					</h1>
					<div className="border hero-border w-25 my-4"></div>
				</div>
			</div>
		</div>
	</section>
);

export default ParallaxHeader;
