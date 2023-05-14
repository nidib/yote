import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { Coord, Pedra, usePedrasStore } from './pedras';
import { CorEnum } from './cor';
import { obterPedrasDoTabuleiro, Tabuleiro, useTabuleiroStore } from './tabuleiro';
import { usePedraSelecionadaStore } from './pedra-selecionada';
import { useMovimentacaoStore } from './movimentacao';
import { useTurnoStore } from './turno';


type Store = {
	jogar: () => void;
};

type Dificuldade = 'FACIL';

interface Decisoes {

	escolherEntrePilhaETabuleiro(pilha: Map<string, Pedra>, tabuleiro: Tabuleiro): 'PILHA' | 'TABULEIRO'

	escolherPedra(pilhaOuTabuleiro: 'PILHA' | 'TABULEIRO', pilha: Map<string, Pedra>, tabuleiro: Tabuleiro): Pedra;

	escolherDestino(casasSelecionaveis: Coord[]): Coord;

	escolherPedraDaMorteLivre(pedrasDisponiveis: Pedra[]): null | Pedra;

}

function escolherItemAleatorio<T>(lista: T[]): T {
	const index = Math.floor(Math.random() * lista.length);

	return lista[index];
}


const decisoesPorNivel: Record<Dificuldade, Decisoes> = {
	FACIL: {
		escolherEntrePilhaETabuleiro(pilha: Map<string, Pedra>, tabuleiro: Tabuleiro): 'PILHA' | 'TABULEIRO' {
			const pedrasNaPilha = Array.from(pilha.values());
			const pedrasBrancasNaPilha = pedrasNaPilha.filter(pedra => pedra.cor === CorEnum.BRANCA && pedra.viva && !pedra.posicao.atual);

			if (pedrasBrancasNaPilha.length === 0) {
				return 'TABULEIRO';
			}

			const pedrasBrancasNoTabuleiro = obterPedrasDoTabuleiro(tabuleiro, pilha).filter(pedra => pedra.cor === CorEnum.BRANCA);

			if (pedrasBrancasNoTabuleiro.length === 0) {
				return 'PILHA';
			}

			return escolherItemAleatorio(['PILHA', 'TABULEIRO']);
		},
		escolherPedra(pilhaOuTabuleiro: 'PILHA' | 'TABULEIRO', pilha: Map<string, Pedra>, tabuleiro: Tabuleiro): Pedra {
			if (pilhaOuTabuleiro === 'PILHA') {
				const pedrasBrancasNaPilha = Array.from(pilha.values()).filter(pedra => pedra.cor === CorEnum.BRANCA && pedra.viva && !pedra.posicao.atual);

				return escolherItemAleatorio(pedrasBrancasNaPilha);
			}

			const pedrasBrancasDoTabuleiro = obterPedrasDoTabuleiro(tabuleiro, pilha).filter(pedra => pedra.cor === CorEnum.BRANCA);

			return escolherItemAleatorio(pedrasBrancasDoTabuleiro);
		},
		escolherDestino(casasSelecionaveis: Coord[]): Coord {
			return escolherItemAleatorio(casasSelecionaveis);
		},
		escolherPedraDaMorteLivre(pedrasDisponiveis: Pedra[]): null | Pedra {
			if (!escolherItemAleatorio([true, false])) {
				return null;
			}

			return escolherItemAleatorio(pedrasDisponiveis);
		}
	}
}

const nivel = 'FACIL';

export const useAIStore = create(
	immer<Store>(() => ({
		jogar() {
			const tabuleiroStore = useTabuleiroStore.getState();
			const pedrasStore = usePedrasStore.getState();
			const pedraSelecionadaStore = usePedraSelecionadaStore.getState();
			const movimentacaoStore = useMovimentacaoStore.getState();
			const turnoStore = useTurnoStore.getState();
			const decisoes = decisoesPorNivel[nivel] as Decisoes;
			const pilhaOuTabuleiro = decisoes.escolherEntrePilhaETabuleiro(pedrasStore.pedras, tabuleiroStore.tabuleiro);
			const pedra = decisoes.escolherPedra(pilhaOuTabuleiro, pedrasStore.pedras, tabuleiroStore.tabuleiro);

			pedraSelecionadaStore.selecionar(pedra.id);

			const casa = decisoes.escolherDestino(tabuleiroStore.obterCasasLiberadas());

			movimentacaoStore.mover(pedra.id, pedra.posicao.atual, casa);

			if (turnoStore.obterModoMorteLivre()) {
				const pedraDaMorteLivre = decisoes.escolherPedraDaMorteLivre(
					pedrasStore.obterPedrasVivas().filter(pedra => pedra.cor === CorEnum.PRETA && pedra.posicao.atual)
				);

				if (pedraDaMorteLivre) {
					pedrasStore.comer(pedraDaMorteLivre.id);
				}

				turnoStore.desativarModoMorteLivre();
				turnoStore.alternarJogador();
			}

			console.log('A.I. jogando do', {
				origem: pilhaOuTabuleiro,
				pedra,
				casa
			});
		}
	}))
)
