import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { Coord, obterPedraComida, usePedrasStore } from './pedras.ts';
import { usePedraSelecionadaStore } from './pedra-selecionada.ts';
import { useTurnoStore } from './turno.ts';
import { useTabuleiroStore } from './tabuleiro.ts';


type Store = {
	mover: (id: string, de: null | Coord, para: Coord) => void;
};

export const useMovimentacaoStore = create(
	immer<Store>(() => ({
		mover(id, de, para) {
			const pedrasStore = usePedrasStore.getState();
			const pedraSelecionadaStore = usePedraSelecionadaStore.getState();
			const turnoStore = useTurnoStore.getState();
			const tabuleiroStore = useTabuleiroStore.getState();

			pedrasStore.atualizar(id, para);
			pedraSelecionadaStore.resetar();

			if (!de) {
				turnoStore.alternarJogador();
				return;
			}

			tabuleiroStore.definirValorNaCasa(de.x, de.y, null);

			const pedraComida = obterPedraComida(de, para, pedrasStore.pedras, tabuleiroStore.tabuleiro);

			if (pedraComida) {
				pedrasStore.comer(pedraComida.id);
				turnoStore.ativarModoMorteLivre();
			} else {
				turnoStore.alternarJogador();
			}
		}
	}))
);
