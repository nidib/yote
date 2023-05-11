import { styled } from '@stitches/react'

import { Pedra } from '../../pedra'
import { Coord, usePedrasStore } from '../../../core/pedras'
import { useTabulerioStore } from '../../../core/tabuleiro'
import { usePedraSelecionadaStore } from '../../../core/pedra-selecionada'


const Box = styled('div', {
	width: 80,
	height: 80,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	textAlign: 'center',
	'&:not(:last-of-type)': {
		borderRight: '4px solid #3E2B21'
	}
})

interface Props extends Coord {
	conteudo: string | null
}

export function Casa({ x, y, conteudo }: Props) {
	const { mover } = useTabulerioStore();
	const { pedraSelecionada, reset } = usePedraSelecionadaStore();
	const { pedras } = usePedrasStore();
	const { atualizar } = usePedrasStore();

	const handleClick = () => {
		if (!pedraSelecionada) {
			return;
		}

		const pedra = pedras.get(pedraSelecionada);

		if (!pedra) {
			return;
		}

		const target = { x, y };

		mover(pedraSelecionada, pedra.posicao.atual, target);
		atualizar(pedraSelecionada, target);
		reset();
	}

	return (
		<Box
			onClick={handleClick}
		>
			{
				typeof conteudo === 'string' ? <Pedra id={conteudo} /> : null
			}
		</Box>
	)
}
