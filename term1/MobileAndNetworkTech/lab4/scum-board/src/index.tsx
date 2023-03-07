import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { GlobalStateProvider } from './utils/GlobalStateProvider';
import './styles/style.scss';

if (!process.env.REACT_APP_USE_MOCKS || process.env.REACT_APP_USE_MOCKS === 'true') {
	const { worker } = require('./mocks/browser')
	worker.start()
}

const container = document.getElementById('root');

const root = createRoot(container!);

root.render(
	<BrowserRouter>
		<GlobalStateProvider>
			<App />
		</GlobalStateProvider>
	</BrowserRouter>
);