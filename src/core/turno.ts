import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';


type TurnoStore = {
	vezDoJogador: boolean;
	modoMorteLivre: boolean;
} & {
	ativarModoMorteLivre: () => void;
	desativarModoMorteLivre: () => void;
	alternarJogador: () => void;
};

export const useTurnoStore = create(
	immer<TurnoStore>(set => ({
		vezDoJogador: true,
		modoMorteLivre: false,
		ativarModoMorteLivre: () => {
			set(state => {
				state.modoMorteLivre = true;
			})
		},
		desativarModoMorteLivre: () => {
			set(state => {
				state.modoMorteLivre = false;
			})
		},
		alternarJogador: () => {
			set(state => {
				state.vezDoJogador = !state.vezDoJogador
			})
		},
	}))
)
