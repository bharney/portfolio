import * as React from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

class Loading extends React.Component<{}, {}> {
	public render() {
		return (
			<div className="container pt-4" style={{ height: '100vh' }}>
				<FontAwesomeIcon
					style={{
						position: 'fixed',
						top: '18%',
						left: '0',
						right: '0',
						margin: '0 auto',
						color: '#000000',
						width: '4rem',
						height: '4rem'
					}}
					icon={faSpinner as IconProp}
					spin
				/>
			</div>
		);
	}
}

export default Loading;
