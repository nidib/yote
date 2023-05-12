import { styled } from '@stitches/react';

import { Casa } from './casa';
import { useTabuleiroStore } from '../../core/tabuleiro';
import { usePedraSelecionadaStore } from '../../core/pedra-selecionada';

const Box = styled('div', {
	width: 600,
	maxWidth: '100%',
	aspectRatio: 600 / 500,
	display: 'flex',
	flexDirection: 'column',
	overflow: 'hidden',
	border: '4px solid #3E2B21',
	boxShadow: '0px 4px 20px rgba(62, 43, 33, 0.3)',
	borderRadius: 20,
});

const Linha = styled('div', {
	flex: 1,
	display: 'flex',

	'&:not(:last-of-type)': {
		borderBottom: '4px solid #3E2B21'
	}
})

export function Board() {
	const { tabuleiro, obterCasasLiberadas } = useTabuleiroStore();
	const casasLiberadas = obterCasasLiberadas();
	usePedraSelecionadaStore()	

	return (
		<Box>
			{
				tabuleiro.map((linha, y) => (
					<Linha key={y}>
						{
							linha.map((casa, x) => {
								return (
									<Casa
										key={`${x}-${y}`}
										x={x}
										y={y}
										conteudo={casa}
										liberada={casasLiberadas.some(c => c.x === x && c.y === y)}
									/>
								)
							})
						}
					</Linha>
				))
			}
		</Box>
	);
}
