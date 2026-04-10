import { Routes, Route } from 'react-router-dom';
import NavMenu from './components/Nav/NavMenu';
import * as React from 'react';
import { useAppSelector } from './store/index';
import { actionCreators as sessionActions } from './store/Session';
import { actionCreators as accountActions } from './store/Account';
import AlertState from './store/Alert';
import './styles/bootstrap-custom.scss';
import './styles/styles.scss';
import { Suspense, useEffect, useState } from 'react';
import Loading from './components/Common/Loading';
import Home from './components/Home/Home';
import { Layout } from './components/Layout/Layout';
import { NavContext } from './contexts';
const AsyncFooter = React.lazy(
	() => import(/* webpackChunkName: "Footer" */ './components/Footer/Footer')
);
const AsyncAbout = React.lazy(
	() => import(/* webpackChunkName: "About" */ './components/About/About')
);
const AsyncContact = React.lazy(
	() => import(/* webpackChunkName: "Contact" */ './components/Contact/Contact')
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
export const App = (props: AppProps) => {
	const [state, setState] = useState({ on: false });

	const handleSidebarPosition = () => {
		const sidebar = document.getElementById('sidebar');
		if (!sidebar) return;
		// Avoid layout-thrashing geometry reads during toggle; use scroll position only.
		const totalOffset = Math.max(window.scrollY - 100, 0);
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
	const handleOverlayToggle = (e: Event) => {
		const target = e.target as HTMLElement;
		if (target.classList.contains('overlay') || target.classList.contains('subMenu')) {
			setState({ on: false });
			handleSidebarToggle();
		}
	};

	const { pca, ...rest } = props;

	const navContextValue = {
		on: state.on,
		toggle,
		onUpdate,
		handleOverlayToggle
	};

	const navProps = {
		accountActions,
		alertActions,
		sessionActions,
		...session,
		...(props as any)
	};

	const renderPage = (content: React.ReactNode, lazy = false) => (
		<NavContext.Provider value={navContextValue}>
			<NavMenu {...navProps} />
			<Layout {...rest} {...props}>
				{lazy ? <Suspense fallback={<Loading />}>{content}</Suspense> : content}
			</Layout>
			<Suspense fallback={null}>
				<AsyncFooter />
			</Suspense>
		</NavContext.Provider>
	);

	return (
		// <ServerDataProvider value={props ? serverData : null}>
		<Routes>
			<Route path="/" element={renderPage(<Home {...props} />)} />
			<Route path="/portfolio" element={renderPage(<AsyncPortfolio {...props} />, true)} />
			<Route path="/about" element={renderPage(<AsyncAbout {...props} />, true)} />
			<Route path="/contact" element={renderPage(<AsyncContact {...props} />, true)} />
			<Route path="/*" element={renderPage(<AsyncNotFound {...props} />, true)} />
		</Routes>
	);
};

export default App;
