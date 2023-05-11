import { v4 as uuid } from 'uuid';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { Cor, CorEnum } from './cor';


export type Coord = {
	x: number,
	y: number,
}

export type Pedra = {
	id: string,
	cor: Cor,
	viva: boolean,
	posicao: {
		atual: null | Coord,
		anterior: null | Coord,
	},
}

type PedrasStore = {
	pedras: Map<string, Pedra>
} & {
	atualizar: (id: string, coord: Coord) => void
};

function obterPedrasIniciais(): Map<string, Pedra> {
	const pedras: Map<string, Pedra> = new Map();

	for (let i = 0; i < 12; i++) {
		const id = uuid();

		pedras.set(id, {
			id,
			cor: CorEnum.BRANCA,
			viva: true,
			posicao: {
				atual: null,
				anterior: null,
			},
		});
	}

	for (let i = 0; i < 12; i++) {
		const id = uuid();

		pedras.set(id, {
			id,
			cor: CorEnum.PRETA,
			viva: true,
			posicao: {
				atual: null,
				anterior: null,
			},
		});
	}

	return pedras;
}

export const usePedrasStore = create(
	immer<PedrasStore>(set => ({
		pedras: obterPedrasIniciais(),
		atualizar: (id, coord) => {
			set(state => {
				const pedra = state.pedras.get(id);

				if (!pedra) {
					throw new Error('Pedra não existe');
				}

				const posicaoAtual = pedra.posicao.atual;

				pedra.posicao.anterior = posicaoAtual;
				pedra.posicao.atual = coord;
			})
		}
	}))
)
