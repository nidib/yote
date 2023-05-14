import { styled } from '@stitches/react'

import { Pedra } from '../../pedra'
import { Coord, usePedrasStore } from '../../../core/pedras'
import { usePedraSelecionadaStore } from '../../../core/pedra-selecionada'
import { useMovimentacaoStore } from "../../../core/movimentacao";


const Box = styled('div', {
	flex: 1,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	textAlign: 'center',

	'&:not(:last-of-type)': {
		borderRight: '4px solid #3E2B21'
	},

	variants: {
		liberada: {
			true: {
				cursor: 'pointer',
				backgroundColor: '#E4C4A7',
			},
		},
	},
})

interface Props extends Coord {
	conteudo: string | null
	liberada: boolean
}

export function Casa({ x, y, conteudo, liberada }: Props) {
	const { mover } = useMovimentacaoStore();
	const { pedraSelecionada } = usePedraSelecionadaStore();
	const { pedras } = usePedrasStore();
	const temConteudo = typeof conteudo === 'string';

	const handleClick = () => {
		if (!pedraSelecionada || !liberada) {
			return;
		}

		const pedra = pedras.get(pedraSelecionada);

		if (!pedra) {
			return;
		}

		const target = { x, y };

		mover(pedraSelecionada, pedra.posicao.atual, target);
	}

	return (
		<Box
			id={`${x}-${y}`}
			liberada={liberada}
			onClick={handleClick}
		>
			{
				temConteudo ? <Pedra id={conteudo} /> : null
			}
		</Box>
	)
}
