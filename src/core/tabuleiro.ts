import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { Coord, Pedra, usePedrasStore } from './pedras';
import { usePedraSelecionadaStore } from './pedra-selecionada';


type Casa = null | string;

type Tabuleiro = [
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

function obterCasasVaziasNoTabuleiroTodo(tabuleiro: Tabuleiro): Coord[] {
	const casasLiberadas: Coord[] = [];

	tabuleiro.forEach((linha, y) => linha.forEach((c, x) => {
		if (!c) {
			casasLiberadas.push({ x, y });
		}
	}));

	return casasLiberadas;
}

export const useTabulerioStore = create(
	immer<Store>((set, get) => ({
		tabuleiro: obterTabuleiroInicial(),
		obterCasasLiberadas: () => {
			const { pedraSelecionada } = usePedraSelecionadaStore.getState();
			const { pedras } = usePedrasStore.getState();
			const { tabuleiro } = get();

			if (!pedraSelecionada) {
				return [];
			}

			const pedra = pedras.get(pedraSelecionada) as Pedra;

			if (!pedra.posicao.atual) {
				return obterCasasVaziasNoTabuleiroTodo(tabuleiro);
			}

			return [];
		},
		mover: (id, de, para) => {
			set(state => {
				const pedras = usePedrasStore.getState();
				const pedraSelecionada = usePedraSelecionadaStore.getState();

				if (de) {
					state.tabuleiro[de.y][de.x] = null;
				}

				state.tabuleiro[para.y][para.x] = id;

				pedras.atualizar(id, para);
				pedraSelecionada.resetar();
			})
		},
	}))
)
