import { styled } from '@stitches/react';

import { CorEnum } from '../../core/cor';
import { usePedrasStore } from '../../core/pedras';
import { usePedraSelecionadaStore } from '../../core/pedra-selecionada';
import { useTurnoStore } from '../../core/turno';


const Bolinha = styled('div', {
	width: 40,
	height: 40,
	borderRadius: 999,
	border: '2px solid transparent',
	variants: {
		selectable: {
			true: {
				cursor: 'pointer',
			},
		},
		selected: {
			true: {
				borderColor: 'orange',
			},
		},
		cor: {
			branca: {
				backgroundColor: 'white',
				borderColor: 'black' 
			},
			preta: {
				backgroundColor: '#3B2C22',
				borderColor: 'black'
			},
		},
	},
})

interface Props {
	id: string
}

export function Pedra(props: Props) {
	const { pedras } = usePedrasStore();
	const { pedraSelecionada, selecionar } = usePedraSelecionadaStore();
	const { vezDoJogador } = useTurnoStore();
	const pedra = pedras.get(props.id);

	if (!pedra) {
		throw new Error('Essa pedra não existe');
	}

	const selecionavel = vezDoJogador;

	const handleClick = () => {
		if (!selecionavel) {
			return;
		}

		selecionar(pedra.id);
	}

	return (
		<Bolinha
			selectable={selecionavel}
			selected={pedraSelecionada === pedra.id}
			cor={pedra.cor === CorEnum.BRANCA ? 'branca' : 'preta'}
			onClick={handleClick}
		/>
	)
}
