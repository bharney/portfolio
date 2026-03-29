import * as React from 'react';

export default class Home extends React.Component<{}, {}> {
	public render() {
		return (
			<React.Fragment>
				<div className="container pt-5 pb-2">
					<div className="col-xxl-10">
						<h1 className="hero">Brian Harney's Software portfolio</h1>
						<div className="border hero-border border-light w-25 my-4"></div>
					</div>
					<div className="col-lg-10 col-xxl-8">
						<p className="mb-4 hero-text">
							My name is Brian Harney and I love building incredible software.
						</p>
					</div>
				</div>
				<div className="text-white landing">
					<div className="container">
						<div className="row gy-4">
							<div className="col-md">
								<p>
									I've spent a long time learning and experimenting, so I could make the right choices about my software.
									So you could have a great experience at my humble abode. I want to show what I've built.
								</p>
								<p>
									AI has changed software forever. Anyone can build it now. There are no excuses.
									You, reading this right now, can build can build a portfolio website just like this one. 
									There are many like it, but this one is mine. 
								</p>
								<p>
									Spend some time on my portfolio page to see what I've built. 
									Our increasingly connected world demands resilient, fast, and
									always available services. Our 24/7 world is more demanding than ever.
									But I hope I can meet those demands by leveraging cloud computing, and AI.
								</p>
								<p>
									I hope you enjoy my portfolio, and I hope it inspires you to build your own.
								</p>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}
