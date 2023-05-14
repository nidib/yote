import { v4 as uuid } from 'uuid';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { Cor, CorEnum } from './cor';
import { Tabuleiro, useTabuleiroStore } from './tabuleiro';


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
	obterPedrasVivas: () => Pedra[]
	obterPedra: (id: string) => null | Pedra
	comer: (id: string) => void
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

export function obterPedraComida(de: Coord, para: Coord, pedras: Map<string, Pedra>, tabuleiro: Tabuleiro): null | Pedra {
	const diferencaHorizontal = de.x - para.x;
	const diferencaVertical = de.y - para.y;
	let pedraComidaId: null | string = null;

	if (Math.abs(diferencaHorizontal) === 2) {
		if (diferencaHorizontal > 0) {
			pedraComidaId = tabuleiro[de.y][de.x - 1];
		} else {
			pedraComidaId = tabuleiro[de.y][de.x + 1];
		}
	} else if (Math.abs(diferencaVertical) === 2) {
		if (diferencaVertical > 0) {
			pedraComidaId = tabuleiro[de.y - 1][de.x];
		} else {
			pedraComidaId = tabuleiro[de.y + 1][de.x];
		}
	}

	return pedraComidaId ? pedras.get(pedraComidaId) as Pedra : null;
}

export const usePedrasStore = create(
	immer<PedrasStore>((set, get) => ({
		pedras: obterPedrasIniciais(),
		obterPedras: () => get().pedras,
		obterPedrasVivas: () => {
			return Array
				.from(get().pedras.values())
				.filter(pedra => pedra.viva);
		},
		obterPedra: id => get().pedras.get(id) ?? null,
		comer: id => {
			set(state => {
				const tabuleiroStore = useTabuleiroStore.getState();
				const pedra = state.pedras.get(id);

				if (pedra && pedra.posicao.atual) {
					const { x, y } = pedra.posicao.atual;

					tabuleiroStore.definirValorNaCasa(x, y, null);
					pedra.viva = false;
					pedra.posicao.atual = null;
				}

			})
		},
		atualizar: (id, coord) => {
			set(state => {
				const tabuleiroStore = useTabuleiroStore.getState();
				const pedra = state.pedras.get(id);

				if (!pedra) {
					throw new Error('Pedra não existe');
				}

				const posicaoAtual = pedra.posicao.atual;

				tabuleiroStore.definirValorNaCasa(coord.x, coord.y, id);
				pedra.posicao.anterior = posicaoAtual;
				pedra.posicao.atual = coord;
			})
		}
	}))
)
