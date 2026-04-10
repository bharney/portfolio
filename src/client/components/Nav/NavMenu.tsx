import * as React from 'react';
import { Dispatch } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { bindActionCreators } from '@reduxjs/toolkit';
import { NavContext } from '../../contexts';
import * as AccountState from '../../store/Account';
import AlertState from '../../store/Alert';
import * as SessionState from '../../store/Session';
import { faFacebook } from '@fortawesome/free-brands-svg-icons/faFacebook';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faDocker } from '@fortawesome/free-brands-svg-icons/faDocker';
import { faStackOverflow } from '@fortawesome/free-brands-svg-icons/faStackOverflow';
import { faPaypal } from '@fortawesome/free-brands-svg-icons/faPaypal';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type NavMenuProps = SessionState.SessionState & {
	accountActions: typeof AccountState.actionCreators;
	sessionActions: typeof SessionState.actionCreators;
	alertActions: typeof AlertState.actionCreators;
};

interface NavProps {
	onUpdate: () => void;
	toggle: () => void;
}
export class NavMenu extends React.Component<NavMenuProps, {}> {
	private scrollTicking = false;

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll, { passive: true });
	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	handleScroll = () => {
		if (this.scrollTicking) return;
		this.scrollTicking = true;
		requestAnimationFrame(() => {
			const navbar = document.getElementById('custom-nav');
			if (!navbar) {
				this.scrollTicking = false;
				return;
			}
			const windowsScrollTop = window.pageYOffset;
			if (windowsScrollTop > 50) {
				navbar.classList.add('affix');
			} else {
				navbar.classList.remove('affix');
			}
			navbar.classList.remove('top-nav-collapse');
			this.scrollTicking = false;
		});
	};

	public render() {
		const { sessionActions, alertActions, accountActions, isLoading } = this.props;
		return (
			<NavContext.Consumer>
				{({ onUpdate, toggle }: NavProps) => {
					return (
						!isLoading && (
							<nav id="custom-nav" className="navbar navbar-expand-md fixed-top navbar-light">
								<div className="container nav-links">
									<Link className="navbar-brand" onClick={onUpdate} to={'/'}>
										bharney
									</Link>
									<div className="collapse navbar-collapse" id="navbarsExampleDefault">
										<ul className="navbar-nav me-auto">
											<li className="nav-item">
												<NavLink
													className={({ isActive }) =>
														isActive ? 'nav-link active  mt-3 pt-0' : 'nav-link root mt-3 pt-0'
													}
													to={'/portfolio'}
													onClick={onUpdate}
												>
													Portfolio
												</NavLink>
											</li>
											<li className="nav-item">
												<NavLink
													className={({ isActive }) =>
														isActive ? 'nav-link active  mt-3 pt-0' : 'nav-link root mt-3 pt-0'
													}
													to={'/about'}
													onClick={onUpdate}
												>
													About
												</NavLink>
											</li>
											<li className="nav-item">
												<NavLink
													className={({ isActive }) =>
														isActive ? 'nav-link active  mt-3 pt-0' : 'nav-link root mt-3 pt-0'
													}
													to={'/contact'}
													onClick={onUpdate}
												>
													Contact
												</NavLink>
											</li>
											{/*<li className="nav-item">
												<NavLink
													className={({ isActive }) =>
														isActive ? 'nav-link active  mt-3 pt-0' : 'nav-link root mt-3 pt-0'
													}
													to={'/about'}
													onClick={onUpdate}
												>
													Blog
												</NavLink>
											</li>
											<MemberNavMenu {...sessionActions} {...this.props} />*/}
										</ul>
										<div className="d-none d-md-block d-lg-block d-xl-block">
											<nav aria-label="Social media links">
												<ul className="navbar-nav">
													<li className="nav-item">
														<a
															className="nav-link root mt-3 pt-0 mt-3 pt-0"
															href="https://www.facebook.com/brian.harney.12"
															target="_blank"
															rel="noopener noreferrer"
															aria-label="Facebook"
														>
															<FontAwesomeIcon icon={faFacebook as IconProp} transform="grow-6" />
														</a>
													</li>
													<li className="nav-item">
														<a
															className="nav-link root mt-3 pt-0"
															href="https://twitter.com/bharney0"
															target="_blank"
															rel="noopener noreferrer"
															aria-label="Twitter"
														>
															<FontAwesomeIcon icon={faTwitter as IconProp} transform="grow-6" />
														</a>
													</li>
													<li className="nav-item">
														<a
															className="nav-link root mt-3 pt-0"
															href="https://www.instagram.com/porkchop.12/"
															target="_blank"
															rel="noopener noreferrer"
															aria-label="Instagram"
														>
															<FontAwesomeIcon icon={faInstagram as IconProp} transform="grow-6" />
														</a>
													</li>
													<li className="nav-item">
														<a
															className="nav-link root mt-3 pt-0"
															href="https://www.linkedin.com/in/bharney0/"
															target="_blank"
															rel="noopener noreferrer"
															aria-label="LinkedIn"
														>
															<FontAwesomeIcon icon={faLinkedin as IconProp} transform="grow-6" />
														</a>
													</li>
													<li className="nav-item">
														<a
															className="nav-link root mt-3 pt-0"
															href="https://github.com/bharney"
															target="_blank"
															rel="noopener noreferrer"
															aria-label="GitHub"
														>
															<FontAwesomeIcon icon={faGithub as IconProp} transform="grow-6" />
														</a>
													</li>
													<li className="nav-item">
														<a
															className="nav-link root mt-3 pt-0"
															href="https://hub.docker.com/u/bharney0"
															target="_blank"
															rel="noopener noreferrer"
															aria-label="Docker Hub"
														>
															<FontAwesomeIcon icon={faDocker as IconProp} transform="grow-6" />
														</a>
													</li>
													<li className="nav-item">
														<a
															className="nav-link root mt-3 pt-0"
															href="https://stackoverflow.com/users/4740497/bharney"
															target="_blank"
															rel="noopener noreferrer"
															aria-label="Stack Overflow"
														>
															<FontAwesomeIcon
																icon={faStackOverflow as IconProp}
																transform="grow-6"
															/>
														</a>
													</li>
													<li className="nav-item">
														<a
															className="nav-link root mt-3 pt-0"
															href="https://paypal.me/BrianHarney?locale.x=en_US"
															target="_blank"
															rel="noopener noreferrer"
															aria-label="PayPal"
														>
															<FontAwesomeIcon icon={faPaypal as IconProp} transform="grow-6" />
														</a>
													</li>
													{/* <UserMenu
													{...accountActions}
													{...alertActions}
													{...sessionActions}
													{...this.props}
												/> */}
												</ul>
											</nav>
										</div>
									</div>
									<div className="d-inline-flex">
										<div className="d-md-none d-lg-none d-xl-none">
											<nav aria-label="Social media links">
												<ul className="navbar-nav mobile-nav">
													{/* <UserMenu
													{...accountActions}
													{...alertActions}
													{...sessionActions}
													{...this.props}
												/> */}
													<li className="nav-item">
														<a
															className="nav-link root mt-3 pt-0"
															href="https://www.facebook.com/brian.harney.12"
															target="_blank"
															rel="noopener noreferrer"
															aria-label="Facebook"
														>
															<FontAwesomeIcon icon={faFacebook as IconProp} transform="grow-6" />
														</a>
													</li>
													<li className="nav-item">
														<a
															className="nav-link root mt-3 pt-0"
															href="https://twitter.com/bharney0"
															target="_blank"
															rel="noopener noreferrer"
															aria-label="Twitter"
														>
															<FontAwesomeIcon icon={faTwitter as IconProp} transform="grow-6" />
														</a>
													</li>
													<li className="nav-item">
														<a
															className="nav-link root mt-3 pt-0"
															href="https://www.instagram.com/porkchop.12/"
															target="_blank"
															rel="noopener noreferrer"
															aria-label="Instagram"
														>
															<FontAwesomeIcon icon={faInstagram as IconProp} transform="grow-6" />
														</a>
													</li>
													<li className="nav-item">
														<a
															className="nav-link root mt-3 pt-0"
															href="https://www.linkedin.com/in/bharney0/"
															target="_blank"
															rel="noopener noreferrer"
															aria-label="LinkedIn"
														>
															<FontAwesomeIcon icon={faLinkedin as IconProp} transform="grow-6" />
														</a>
													</li>
													<li className="nav-item">
														<a
															className="nav-link root mt-3 pt-0"
															href="https://github.com/bharney"
															target="_blank"
															rel="noopener noreferrer"
															aria-label="GitHub"
														>
															<FontAwesomeIcon icon={faGithub as IconProp} transform="grow-6" />
														</a>
													</li>
												</ul>
											</nav>
										</div>
										<button
											className="navbar-toggler navbar-toggler-right"
											onClick={toggle}
											type="button"
											data-target="#navbarsExampleDefault"
											aria-controls="navbarsExampleDefault"
											aria-expanded="false"
											aria-label="Toggle navigation"
										>
											<span className="navbar-toggler-icon" />
										</button>
									</div>
								</div>
							</nav>
						)
					);
				}}
			</NavContext.Consumer>
		);
	}
}

export default connect(
	(state: SessionState.SessionState) => {
		return state;
	}, // Selects which state properties are merged into the component's props
	(dispatch: Dispatch) => {
		// Selects which action creators are merged into the component's props
		return {
			sessionActions: bindActionCreators(SessionState.actionCreators, dispatch),
			alertActions: bindActionCreators(AlertState.actionCreators, dispatch),
			accountActions: bindActionCreators(AccountState.actionCreators, dispatch)
		};
	}
)(NavMenu);
