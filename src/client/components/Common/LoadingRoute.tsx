import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

class LoadingRoute extends React.Component<{}, {}> {
	public render() {
		return (
			<div>
				<FontAwesomeIcon
					icon={faSpinner as IconProp}
					spin
					style={{ color: '#fff', width: '2rem', height: '2rem' }}
				/>
			</div>
		);
	}
}

export default LoadingRoute;
