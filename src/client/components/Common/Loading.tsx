import * as React from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

class Loading extends React.Component<{}, {}> {
	public render() {
		return (
			<div className="container pt-4" style={{ height: '70vh' }}>
				<FontAwesomeIcon
					style={{
						position: 'absolute',
						top: '7vh',
						left: '50%',
						color: '#fff',
						width: '2rem',
						height: '2rem'
					}}
					icon={faSpinner as IconProp}
					spin
				/>
			</div>
		);
	}
}

export default Loading;
