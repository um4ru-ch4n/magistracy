import React, { useEffect } from 'react';

import { getRoutes } from './routes';
import { AuthAPI } from './api/authAPI';
import { useGlobalState } from './utils/GlobalStateProvider';
import { GetUserName } from './utils/authUtils';

const App: React.FC = () => {
	const { state, setState } = useGlobalState()

	useEffect(() => {
		setState(prev => ({
			...prev,
			isSignInLoading: true,
		}));

		AuthAPI.userLoad()
			.then(res => {
				if (!res.error) {
					var username = GetUserName()
					setState(prev => ({
						...prev,
						username: username || "",
						isAuthenticated: true,
					}));
				}
			})
		.finally(() => {
			setState(prev => ({
				...prev,
				isSignInLoading: false,
			}));
		})
	}, []);

	if (state.isSignInLoading) {
		return <div>Загрузка...</div>
	}

	return (
		<>
			{getRoutes(state.isAuthenticated || false)}
		</>
	);
}

export default App;