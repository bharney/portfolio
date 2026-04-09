import * as React from 'react';
import { useEffect } from 'react';
import ParallaxHeader from './ParallaxHeader';

export default function Home() {
	useEffect(() => {
		import('../../utils/ParallaxManager').then(({ ParallaxManager }) => {
			try {
				new ParallaxManager('.parallax-layer');
			} catch {
				// parallax layers not found
			}
		});
	}, []);

	return (
		<React.Fragment>
			<ParallaxHeader />
			<section className="landing-wrapper" aria-label="Introduction">
				<div className="container">
					<div className="landing card">
						<div className="card-body">
							<p className="mb-4 hero-text">
								My name is Brian Harney, and I love building incredible software.
							</p>
							<p className="card-text">
								I've spent a lot of time learning and experimenting so I can make the right
								choices in the software I build. I want this site to give you a great
								experience. I want to show you what I've created.
							</p>
							<p className="card-text">
								AI has changed software forever. Now more people than ever can build it. If
								you're reading this right now, you can build a portfolio website just like this
								one. There are many like it, but this one is mine.
							</p>
							<p className="card-text">
								Spend some time on my portfolio page to see what I've built. Our increasingly
								connected world demands resilient, fast, and always available services. Our 24/7
								world is more demanding than ever. I can meet those demands by leveraging cloud
								computing and AI.
							</p>
							<p className="card-text">
								I hope you enjoy my portfolio, and I hope it inspires you to build your own.
							</p>
						</div>
					</div>
				</div>
			</section>
		</React.Fragment>
	);
}
