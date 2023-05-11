import { styled } from '@stitches/react';

import { Casa } from './casa';
import { useTabulerioStore } from '../../core/tabuleiro';

const Box = styled('div', {
	border: '4px solid #3E2B21',
	boxShadow: '0px 4px 20px rgba(62, 43, 33, 0.3)',
	borderRadius: 20,
})

const Linha = styled('div', {
	display: 'flex',
	'&:not(:last-of-type)': {
		borderBottom: '4px solid #3E2B21'
	}
})

export function Board() {
	const { tabuleiro } = useTabulerioStore();

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
