import * as React from 'react';
import chicagoInABox from '../../images/ChicagoInABox.png';
import chicagoInABoxWebp from '../../images/ChicagoInABox.webp';
import coletteMills from '../../images/ColetteMills.jpg';
import coletteMillsWebp from '../../images/ColetteMills.webp';
import goSurfer from '../../images/GoSurfer.jpg';
import goSurferWebp from '../../images/GoSurfer.webp';
import harneyHall from '../../images/HarneyHall.jpg';
import harneyHallWebp from '../../images/HarneyHall.webp';
import jMS from '../../images/JMS.jpg';
import jMSWebp from '../../images/JMS.webp';
import pCHFarms from '../../images/PCHFarms.jpg';
import pCHFarmsWebp from '../../images/PCHFarms.webp';
import bharneyPortfolio from '../../images/bharneyportfolio.png';
import bharneyPortfolioWebp from '../../images/bharneyportfolio.webp';
import yogamariemills from '../../images/yogamariemills.png';
import yogamariemillsWebp from '../../images/yogamariemills.webp';
import { Link } from 'react-router-dom';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OptimizedImage from '../Common/OptimizedImage';

interface PortfolioItem {
	src: string;
	webpSrc: string;
	alt: string;
	title: string;
	link: string;
	description: string;
}

const portfolioItems: PortfolioItem[] = [
	{
		src: chicagoInABox,
		webpSrc: chicagoInABoxWebp,
		alt: 'Chicago in a box',
		title: 'Chicago In A Box',
		link: 'https://chicagoinabox.com/',
		description: 'Send Iconic Chicago items to loved ones! Select your Chicago In A Box goodies, then we take care of the rest!'
	},
	{
		src: coletteMills,
		webpSrc: coletteMillsWebp,
		alt: 'Collete Mills',
		title: 'Collete Mills',
		link: 'https://colettemills.com/',
		description: 'Art Portfolio for Collete Mills. Collete is an Irish painter who has paintings that have been bought from all over the world.'
	},
	{
		src: goSurfer,
		webpSrc: goSurferWebp,
		alt: 'Go Surfer',
		title: 'Go Surfer',
		link: '/404',
		description: "When the roosters crowin' I start scratchin' my head, Gotta flop over get myself outta bed. Grab a cup o joe and in the car I roll, Y'know I want to get movin', I'm on dawn patrol."
	},
	{
		src: harneyHall,
		webpSrc: harneyHallWebp,
		alt: 'Harney Hall Wedding',
		title: 'Harney Hall Wedding',
		link: 'https://harneyhall.azurewebsites.net/',
		description: 'I got married! And we needed an online presence, so I built a Wedding Website for RSVP, Wall Posts, Information and Directions.'
	},
	{
		src: jMS,
		webpSrc: jMSWebp,
		alt: 'JMS Auto Repair',
		title: 'JMS Auto Repair',
		link: 'https://jmsautorepair.com/',
		description: 'At JMS Auto Repair our mission is simple: To provide our customers with the highest quality service at the best possible price.'
	},
	{
		src: pCHFarms,
		webpSrc: pCHFarmsWebp,
		alt: 'PCH Farms Collective',
		title: 'PCH Farms Collective',
		link: 'https://pchfarms.azurewebsites.net/',
		description: 'Here at PCH Farms, we are a non-profit medical marijuana marketplace dedicated to connecting medical marijuana patients 21 years or older to local marijuana collectives located right here in Santa Cruz.'
	},
	{
		src: bharneyPortfolio,
		webpSrc: bharneyPortfolioWebp,
		alt: 'bharney Portfolio',
		title: 'bharney Portfolio',
		link: 'https://parallax-afghd4g2byafgqeu.westus-01.azurewebsites.net/',
		description: "Here in the wilderness theres plenty to see. You just might find a black bear out there. This site has been created by Brian Harney to reflect the types of things he enjoys."
	},
	{
		src: yogamariemills,
		webpSrc: yogamariemillsWebp,
		alt: 'Yoga Marie Mills',
		title: 'Yoga Marie Mills',
		link: 'https://yogamariemills.azurewebsites.net/',
		description: 'Yoga Marie Mills is a yoga instructor and wellness coach specializing in holistic health and mindfulness practices.'
	}
];

export default class Portfolio extends React.Component<{}, {}> {
	public render() {
		return (
			<div className="album">
				<div className="mt-5 container">
					<h2 className="display-4 mb-4 fw-bold">Portfolio.</h2>
					<p className="lead">A showcase of my work, featuring a variety of projects that I have built over the years. This portfolio reflects my skills and expertise.</p>
					<div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 g-3">
						{portfolioItems.map((item, index) => (
							<div className="col" key={item.title}>
								<div className="card">
									<OptimizedImage
										src={item.src}
										webpSrc={item.webpSrc}
										alt={item.alt}
										className="img-fluid rounded-top"
										width={376}
										height={376}
										priority={index < 2}  /* Only first 2 images load eagerly (above fold) */
									/>
									<div className="card-body">
										<Link
											className="icon-link icon-link-hover"
											target="_blank"
											rel="noopener noreferrer"
											to={item.link}
										>
											<h5 className="card-title">{item.title}</h5>
											<FontAwesomeIcon
												icon={faArrowRight as IconProp}
												className="bi pb-1"
												transform="shrink-6"
												pull="left"
											/>
										</Link>
										<p className="card-text">{item.description}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}
}
