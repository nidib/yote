import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';


type PedraSelecionadaStore = {
	pedraSelecionada: null | string;
} & {
	selecionar: (id: string) => void;
	reset: () => void;
};

export const usePedraSelecionadaStore = create(
	immer<PedraSelecionadaStore>(set => ({
		pedraSelecionada: null,
		selecionar: id => {
			set(state => {
				state.pedraSelecionada = state.pedraSelecionada === id ? null : id
			})
		},
		reset: () => set(state => {
			state.pedraSelecionada = null;
		}),
	}))
)
