import { styled } from '@stitches/react';

import { Pedras } from './components/pedras';
import { Board } from './components/tabuleiro';
import { CorEnum } from './core/cor';

const Box = styled('div', {
	height: '100%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	gap: 40,
	padding: '100px 40px',

	'@media (max-width: 875px)': {
		flexDirection: 'column',
	},

	'@media (min-width: 580px) and (max-width: 875px)': {
		paddingTop: 20,
	},
});


export function App() {
	return (
		<Box>
			<Pedras cor={CorEnum.PRETA} />
			<Board />
			<Pedras cor={CorEnum.BRANCA} />
		</Box>
	);
}
