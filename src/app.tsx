import { useEffect } from 'react';
import { styled } from '@stitches/react';

import { Pedras } from './components/pedras';
import { Board } from './components/tabuleiro';
import { CorEnum } from './core/cor';
import { useTurnoStore } from './core/turno';
import { useAIStore } from './core/ai';
import { DevTools } from './components/devtools';


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
	const { habilitado } = useAIStore();
	const { vezDoJogador } = useTurnoStore();
	const { jogar } = useAIStore();

	useEffect(() => {
		if (habilitado && !vezDoJogador) {
			jogar();
		}
	}, [vezDoJogador, habilitado]);

	return (
		<>
			<DevTools />
			<Box>
				<Pedras cor={CorEnum.PRETA} />
				<Board />
				<Pedras cor={CorEnum.BRANCA} />
			</Box>
		</>
	);
}
