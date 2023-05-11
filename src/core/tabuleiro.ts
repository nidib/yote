import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { Coord } from './pedras';


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

export const useTabulerioStore = create(
	immer<Store>(set => ({
		tabuleiro: obterTabuleiroInicial(),
		mover: (id, de, para) => {
			set(state => {
				if (de) {
					state.tabuleiro[de.y][de.x] = null;
				}

				state.tabuleiro[para.y][para.x] = id;
			})
		},
	}))
)
