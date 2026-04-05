import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import NavMenu from './components/Nav/NavMenu';
import * as React from 'react';
import { useAppSelector } from './store/index';
import { actionCreators as sessionActions } from './store/Session';
import { actionCreators as accountActions } from './store/Account';
import AlertState from './store/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.scss';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Loading from './components/Common/Loading';
const AsyncHome = React.lazy(() => import(/* webpackChunkName: "Home" */ './components/Home/Home'));
const AsyncAbout = React.lazy(() => import(/* webpackChunkName: "About" */ './components/About/About'));
const AsyncContact = React.lazy(
	() => import(/* webpackChunkName: "Contact" */ './components/Contact/Contact')
);
const AsyncLayout = React.lazy(
	() => import(/* webpackChunkName: "Layout" */ './components/Layout/Layout')
);
const AsyncNotFound = React.lazy(
	() => import(/* webpackChunkName: "NotFound" */ './components/NotFound/NotFound')
);
const AsyncPortfolio = React.lazy(
	() => import(/* webpackChunkName: "Portfolio" */ './components/Portfolio/Portfolio')
);

interface Props {
	/** Data used in the react prerender process. Use only in the server side. */
	serverData?: unknown;
}

type AppProps = Props & any;

interface On {
	on: boolean;
}
export const NavContext = React.createContext({
	on: false,
	toggle: () => {},
	onUpdate: () => {},
	handleOverlayToggle: (e: Event) => {}
});

export const AuthContext = React.createContext(null);
export const App = (props: AppProps) => {
	const [state, setState] = useState({ on: false });

	useEffect(() => {
		let resizeTicking = false;
		const handleResize = () => {
			if (resizeTicking) return;
			resizeTicking = true;
			requestAnimationFrame(() => {
				if (window.innerWidth > 767) {
					setState({ on: false });
					handleSidebarToggle();
				}
				resizeTicking = false;
			});
		};
		window.addEventListener('resize', handleResize, { passive: true });
		return () => window.removeEventListener('resize', handleResize);
	}, []);
	const session = useAppSelector(state => state);
	const alertActions = AlertState.actionCreators;
	const toggle = () => {
		setState({ on: !state.on });
		if (state.on) {
			handleSidebarToggle();
		} else {
			handleSidebarPosition();
		}
	};
	const onUpdate = () => {
		setState({ on: false });
		handleSidebarToggle();
		window.scrollTo(0, 0);
	};
	const handleSidebarPosition = () => {
		const sidebar = document.getElementById('sidebar');
		if (!sidebar) return;
		const bounding = sidebar.getBoundingClientRect();
		const offset = bounding.top + document.body.scrollTop;
		let totalOffset = (offset - 100) * -1;
		totalOffset = totalOffset < 0 ? 0 : totalOffset;
		sidebar.style.top = totalOffset + 'px';
		document.documentElement.style.overflowY = 'hidden';
	};
	const handleSidebarToggle = () => {
		const sidebar = document.getElementById('sidebar');
		if (sidebar) {
			sidebar.removeAttribute('style');
		}
		document.documentElement.style.overflowY = 'auto';
	};
	const handleOverlayToggle = (e: Event) => {
		const target = e.target as HTMLElement;
		if (target.classList.contains('overlay') || target.classList.contains('subMenu')) {
			setState({ on: false });
			handleSidebarToggle();
		}
	};

	const { pca, ...rest } = props;
	return (
		// <ServerDataProvider value={props ? serverData : null}>
		<Routes>
			<Route
				path="/"
				element={
					<Suspense fallback={<Loading />}>
						<React.Fragment>
							<NavContext.Provider
								value={{
									on: state.on,
									toggle: toggle,
									onUpdate: onUpdate,
									handleOverlayToggle: handleOverlayToggle
								}}
							>
								<NavMenu
									accountActions={accountActions}
									alertActions={alertActions}
									sessionActions={sessionActions}
									{...session}
									{...(props as any)}
								/>
								<AsyncLayout {...rest} {...props}>
									<AsyncHome {...props} />
								</AsyncLayout>
								<Footer />
							</NavContext.Provider>
						</React.Fragment>
					</Suspense>
				}
			/>
			<Route
				path="/portfolio"
				element={
					<Suspense fallback={<Loading />}>
						<React.Fragment>
							<NavContext.Provider
								value={{
									on: state.on,
									toggle: toggle,
									onUpdate: onUpdate,
									handleOverlayToggle: handleOverlayToggle
								}}
							>
								<NavMenu
									accountActions={accountActions}
									alertActions={alertActions}
									sessionActions={sessionActions}
									{...session}
									{...(props as any)}
								/>
								<AsyncLayout {...rest} {...props}>
									<AsyncPortfolio {...props} />
								</AsyncLayout>
								<Footer />
							</NavContext.Provider>
						</React.Fragment>
					</Suspense>
				}
			/>
			<Route
				path="/about"
				element={
					<Suspense fallback={<Loading />}>
						<React.Fragment>
							<NavContext.Provider
								value={{
									on: state.on,
									toggle: toggle,
									onUpdate: onUpdate,
									handleOverlayToggle: handleOverlayToggle
								}}
							>
								<NavMenu
									accountActions={accountActions}
									alertActions={alertActions}
									sessionActions={sessionActions}
									{...session}
									{...(props as any)}
								/>
								<AsyncLayout {...rest} {...props}>
									<AsyncAbout {...props} />
								</AsyncLayout>
								<Footer />
							</NavContext.Provider>
						</React.Fragment>
					</Suspense>
				}
			/>
			<Route
				path="/contact"
				element={
					<Suspense fallback={<Loading />}>
						<React.Fragment>
							<NavContext.Provider
								value={{
									on: state.on,
									toggle: toggle,
									onUpdate: onUpdate,
									handleOverlayToggle: handleOverlayToggle
								}}
							>
								<NavMenu
									accountActions={accountActions}
									alertActions={alertActions}
									sessionActions={sessionActions}
									{...session}
									{...(props as any)}
								/>
								<AsyncLayout {...rest} {...props}>
									<AsyncContact {...props} />
								</AsyncLayout>
								<Footer />
							</NavContext.Provider>
						</React.Fragment>
					</Suspense>
				}
			/>
			<Route
				path="/*"
				element={
					<Suspense fallback={<Loading />}>
						<React.Fragment>
							<NavContext.Provider
								value={{
									on: state.on,
									toggle: toggle,
									onUpdate: onUpdate,
									handleOverlayToggle: handleOverlayToggle
								}}
							>
								<NavMenu
									accountActions={accountActions}
									alertActions={alertActions}
									sessionActions={sessionActions}
									{...session}
									{...(props as any)}
								/>
								<AsyncLayout {...rest} {...props}>
									<AsyncNotFound {...props} />
								</AsyncLayout>
								<Footer />
							</NavContext.Provider>
						</React.Fragment>
					</Suspense>
				}
			/>
		</Routes>
	);
};

export default App;
