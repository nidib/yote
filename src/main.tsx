import React from 'react';
import ReactDOM from 'react-dom/client';
import { enableMapSet } from 'immer';

import { App } from './app';


enableMapSet();

ReactDOM
	.createRoot(document.getElementById('root') as HTMLElement)
	.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
