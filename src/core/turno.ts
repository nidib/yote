import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';


type TurnoStore = {
	vezDoJogador: boolean
} & {
	alternar: () => void;
};

export const useTurnoStore = create(
	immer<TurnoStore>(set => ({
		vezDoJogador: true,
		alternar: () => {
			set(state => {
				state.vezDoJogador = !state.vezDoJogador
			})
		},
	}))
)
