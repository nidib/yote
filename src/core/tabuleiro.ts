import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { Coord, obterPedraComida, usePedrasStore } from './pedras';
import { usePedraSelecionadaStore } from './pedra-selecionada';
import { Casas } from './casas';


export type Casa = null | string;

export type Tabuleiro = [
	[Casa, Casa, Casa, Casa, Casa, Casa],
	[Casa, Casa, Casa, Casa, Casa, Casa],
	[Casa, Casa, Casa, Casa, Casa, Casa],
	[Casa, Casa, Casa, Casa, Casa, Casa],
	[Casa, Casa, Casa, Casa, Casa, Casa],
];

type Store = {
	tabuleiro: Tabuleiro
} & {
	mover: (id: string, de: null | Coord, para: Coord) => void
	obterCasasLiberadas: () => Coord[]
}

function obterTabuleiroInicial(): Tabuleiro {
	return [
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
	];
}

export const useTabuleiroStore = create(
	immer<Store>((set, get) => ({
		tabuleiro: obterTabuleiroInicial(),
		obterCasasLiberadas: () => {
			const { pedraSelecionada } = usePedraSelecionadaStore.getState();
			const { pedras } = usePedrasStore.getState();
			const { tabuleiro } = get();

			return Casas.obterLiberadas(pedraSelecionada, pedras, tabuleiro);
		},
		mover: (id, de, para) => {
			set(state => {
				const pedras = usePedrasStore.getState();
				const pedraSelecionada = usePedraSelecionadaStore.getState();

				state.tabuleiro[para.y][para.x] = id;

				pedras.atualizar(id, para);
				pedraSelecionada.resetar();

				if (de) {
					state.tabuleiro[de.y][de.x] = null;

					const pedraComida = obterPedraComida(de, para, pedras.pedras, state.tabuleiro);

					if (pedraComida && pedraComida.posicao.atual) {
						state.tabuleiro[pedraComida.posicao.atual.y][pedraComida.posicao.atual.x] = null;
						pedras.comer(pedraComida.id);
					}
				}
			})
		},
	}))
)
