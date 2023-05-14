import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { Coord, obterPedraComida, usePedrasStore } from './pedras';
import { usePedraSelecionadaStore } from './pedra-selecionada';
import { useTurnoStore } from './turno';
import { useTabuleiroStore } from './tabuleiro';


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

			const pedraASerComida = obterPedraComida(de, para, pedrasStore.pedras, tabuleiroStore.tabuleiro);

			if (pedraASerComida) {
				pedrasStore.comer(pedraASerComida.id);

				const temPedraPraComer = pedrasStore.obterPedrasVivas().filter(pedra => pedra.cor === pedraASerComida.cor && pedra.posicao.atual)

				if (temPedraPraComer.length) {
					turnoStore.ativarModoMorteLivre();
				} else {
					turnoStore.alternarJogador();
				}
			} else {
				turnoStore.alternarJogador();
			}
		}
	}))
);
