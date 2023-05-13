import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { usePedrasStore } from './pedras.ts';
import { useTurnoStore } from "./turno.ts";


type PedraSelecionadaStore = {
	pedraSelecionada: null | string;
} & {
	selecionar: (id: string) => void;
	resetar: () => void;
};

export const usePedraSelecionadaStore = create(
	immer<PedraSelecionadaStore>(set => ({
		pedraSelecionada: null,
		selecionar: id => {
			set(state => {
				const pedrasStore = usePedrasStore.getState();
				const turnoStore = useTurnoStore.getState();

				state.pedraSelecionada = state.pedraSelecionada === id ? null : id;

				if (turnoStore.modoMorteLivre) {
					state.pedraSelecionada = null;
					pedrasStore.comer(id);
					turnoStore.alternarJogador();
					turnoStore.desativarModoMorteLivre();
				}
			})
		},
		resetar: () => set(state => {
			state.pedraSelecionada = null;
		}),
	}))
)
