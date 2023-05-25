import { styled } from '@stitches/react';

import { Cor, CorEnum } from '../../core/cor';
import { usePedrasStore } from '../../core/pedras';
import { usePedraSelecionadaStore } from '../../core/pedra-selecionada';
import { useTurnoStore } from '../../core/turno';
import iconeInimigo from '../../assets/inimigo.png'
import iconeAmigo from '../../assets/amigo.png'


const Bolinha = styled('div', {
	width: 50,
	height: 50,
	borderRadius: 999,
	border: '2px solid transparent',
	backgroundSize: 'contain',
	backgroundRepeat: 'no-repeat',
	backgroundPosition: 'center',
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
				backgroundImage: `url(${iconeInimigo})`,
			},
			preta: {
				backgroundImage: `url(${iconeAmigo})`,
			},
		},
	},
})

interface Props {
	id: string
}

function obterCorClicavel(vezDoJogador: boolean, modoMorteLivre: boolean): Cor {
	if (modoMorteLivre) {
		return vezDoJogador ? CorEnum.BRANCA : CorEnum.PRETA;
	}

	return vezDoJogador ? CorEnum.PRETA : CorEnum.BRANCA;
}

function ehSelecionavel(corClicavel: Cor, corDaPedra: Cor, pedraTaEmJogo: boolean, modoMorteLivre: boolean): boolean {
	if (corClicavel !== corDaPedra) {
		return false;
	}

	if (!modoMorteLivre) {
		return true;
	}

	return pedraTaEmJogo;
}

export function Pedra(props: Props) {
	const { pedras } = usePedrasStore();
	const { pedraSelecionada, selecionar } = usePedraSelecionadaStore();
	const { vezDoJogador, modoMorteLivre } = useTurnoStore();
	const pedra = pedras.get(props.id);

	if (!pedra) {
		throw new Error('Essa pedra não existe');
	}

	const corClicavel = obterCorClicavel(vezDoJogador, modoMorteLivre);
	const selecionavel = ehSelecionavel(corClicavel, pedra.cor, Boolean(pedra.posicao.atual), modoMorteLivre);

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
