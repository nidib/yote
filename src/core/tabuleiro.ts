import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { Coord, Pedra, usePedrasStore } from './pedras';
import { usePedraSelecionadaStore } from './pedra-selecionada';
import { Casas } from './casas';
import { CorEnum} from './cor';


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
	definirValorNaCasa: (x: number, y: number, valor: Casa) => void;
	obterCasasLiberadas: () => Coord[];
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

export function obterPedrasDoTabuleiro(tabuleiro: Tabuleiro, pilha: Map<string, Pedra>): Pedra[] {
	const pedras: Pedra[] = [];

	tabuleiro.forEach(linha => linha.forEach(casa => {
		if (!casa) {
			return;
		}

		const pedra = pilha.get(casa);

		if (!pedra) {
			return;
		}

		if (pedra.cor !== CorEnum.BRANCA) {
			return;
		}

		pedras.push(pedra);
	}));

	return pedras;
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
		definirValorNaCasa: (x, y, valor) => {
			set(state => {
				state.tabuleiro[y][x] = valor;
			});
		},
	}))
);
