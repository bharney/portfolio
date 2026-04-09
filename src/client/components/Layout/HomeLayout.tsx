import * as React from 'react';
import { NavContext } from '../../contexts';
import { ApplicationState } from '../../store/index';
import * as AccountState from '../../store/Account';
import * as AlertState from '../../store/Alert';
import * as SessionState from '../../store/Session';
import SliderMenu from '../Slider/SliderMenu';
import Alert from './AlertComponent';

interface NavProps {
	on: boolean;
	handleOverlayToggle: (e: Event) => void;
}

type LayoutProps = ApplicationState & {
	accountActions: typeof AccountState.actionCreators;
	sessionActions: typeof SessionState.actionCreators;
	alertActions: typeof AlertState.default.actionCreators;
} & any;

export class HomeLayout extends React.Component<LayoutProps, {}> {
	public render() {
		return (
			<NavContext.Consumer>
				{({ on, handleOverlayToggle }: NavProps) => (
					<React.Fragment>
						<main
							onClick={(e: any) => handleOverlayToggle(e)}
							className={`container-fluid pl-0 pr-0 ${on ? ' overlay' : ''}`}
						>
							<Alert {...this.props} />
							<div
								id="slider"
								className={`row row-offcanvas row-offcanvas-right ${on ? 'active' : ''}`}
							>
								<div className="col-12">{this.props.children}</div>
								<div id="sidebar" className="col-4 col-sm-3 d-none d-lg-block sidebar-home">
									<div className="list-group">
										<SliderMenu />
									</div>
								</div>
								<div id="sidebar" className="col-8 d-lg-none sidebar-offcanvas">
									<div className="list-group">
										<SliderMenu />
									</div>
								</div>
							</div>
						</main>
					</React.Fragment>
				)}
			</NavContext.Consumer>
		);
	}
}

export default HomeLayout;
