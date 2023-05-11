import { styled } from '@stitches/react';

import { Pedras } from './components/pedras';
import { Board } from './components/tabuleiro';
import { CorEnum } from './core/cor';


const Box = styled('div', {
	flex: 1,
	display: 'flex',
	justifyContent: 'space-around',
	alignItems: 'center',
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
