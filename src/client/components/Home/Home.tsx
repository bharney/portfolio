import * as React from 'react';
import { useEffect } from 'react';
import ParallaxHeader from './ParallaxHeader';

export default function Home() {
	useEffect(() => {
		let manager: { destroy(): void } | null = null;

		import('../../utils/ParallaxManager').then(({ ParallaxManager }) => {
			try {
				manager = new ParallaxManager('.parallax-layer');
			} catch {
				// parallax layers not in DOM (SSR or route change)
			}
		});

		// Tear down scroll listener + rAF loop on unmount / route change
		return () => {
			manager?.destroy();
		};
	}, []);

	return (
		<React.Fragment>
			<ParallaxHeader />
			<section className="landing-section" aria-label="Introduction">
				<div className="container px-4">
					<div className="landing-content">
						<h2 className="hero-text display-4 fw-bold lh-1 text-body-emphasis pt-4 mb-3">
							My name is Brian Harney, and I love building incredible software.
						</h2>
						<p className="fs-4">
							I've spent a lot of time learning and experimenting so I can make the right choices in
							the software I build. I want this site to give you a great experience. I want to show
							you what I've created.
						</p>
						<p className="fs-4">
							AI has changed software forever. Now more people than ever can build it. If you're
							reading this right now, you can build a portfolio website just like this one. There
							are many like it, but this one is mine.
						</p>
						<p className="fs-4">
							Spend some time on my portfolio page to see what I've built. Our increasingly
							connected world demands resilient, fast, and always available services. Our 24/7 world
							is more demanding than ever. I can meet those demands by leveraging cloud computing
							and AI.
						</p>
						<p className="fs-4">
							I hope you enjoy my portfolio, and I hope it inspires you to build your own.
						</p>
					</div>
				</div>
			</section>
		</React.Fragment>
	);
}
