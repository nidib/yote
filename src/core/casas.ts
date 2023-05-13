import { Coord, Pedra } from './pedras';
import { Tabuleiro } from './tabuleiro';


export class Casas {

	static obterLiberadas(pedraSelecionada: null | string, pedras: Map<string, Pedra>, tabuleiro: Tabuleiro): Coord[] {
		if (!pedraSelecionada) {
			return [];
		}

		const pedra = pedras.get(pedraSelecionada) as Pedra;

		if (!pedra.posicao.atual) {
			return Casas.obterTodasAsVazias(tabuleiro);
		}

		const vizinhos = Casas.obterTodosOsVizinhos(pedra.posicao.atual);
		const vizinhosReais = Casas.obterExistentes(vizinhos, tabuleiro);
		const casasLiberadasComAtaque = Casas.obterComAtaque(pedra, vizinhosReais, tabuleiro, pedras);

		return Casas.obterExcluindoAPosicaoAnterior(casasLiberadasComAtaque, pedra.posicao.anterior);
	}

	static obterTodasAsVazias(tabuleiro: Tabuleiro): Coord[] {
		const casasLiberadas: Coord[] = [];

		tabuleiro.forEach((linha, y) => linha.forEach((c, x) => {
			if (!c) {
				casasLiberadas.push({ x, y });
			}
		}));

		return casasLiberadas;
	}

	static obterTodosOsVizinhos(coord: Coord): Coord[] {
		const vizinhoSuperior = { x: coord.x, y: coord.y -1 }
		const vizinhoDaDireita = { x: coord.x + 1, y: coord.y }
		const vizinhoInferior = { x: coord.x, y: coord.y + 1 }
		const vizinhoDaEsquerda = { x: coord.x - 1, y: coord.y }

		return [
			vizinhoSuperior,
			vizinhoDaDireita,
			vizinhoInferior,
			vizinhoDaEsquerda,
		];
	}

	static obterExistentes(coords: Coord[], tabuleiro: Tabuleiro): Coord[] {
		const PRIMEIRA_LINHA = 0;
		const ULTIMA_LINHA = tabuleiro.length - 1;
		const PRIMEIRA_COLUNA = 0;
		const ULTIMA_COLUNA = tabuleiro[0].length - 1;

		return coords.filter(({ x, y }) => {
			if (y < PRIMEIRA_LINHA || y > ULTIMA_LINHA) {
				return false;
			}

			if (x < PRIMEIRA_COLUNA || x > ULTIMA_COLUNA) {
				return false;
			}

			return true;
		});
	}

	static obterExcluindoAPosicaoAnterior(vizinhos: Coord[], posicaoAnterior: null | Coord) {
		if (!posicaoAnterior) {
			return vizinhos;
		}

		return vizinhos.filter(vizinho => {
			if (vizinho.x === posicaoAnterior.x && vizinho.y === posicaoAnterior.y) {
				return false;
			}

			return true;
		});
	}

	static obterComAtaque(pedraSelecionada: Pedra, vizinhos: Coord[], tabuleiro: Tabuleiro, pedras: Map<string, Pedra>): Coord[] {
		const casas: Coord[] = [];

		vizinhos.forEach(vizinho => {
				const vizinhoId = tabuleiro[vizinho.y][vizinho.x];

				if (vizinhoId === null) {
					casas.push(vizinho);
					return;
				}

				const pedraVizinha = pedras.get(vizinhoId) as Pedra;
				const ehInimigo = pedraVizinha.cor !== pedraSelecionada.cor;

				if (!ehInimigo) {
					return;
				}

				const posicaoVizinho = pedraVizinha.posicao.atual as Coord;
				const posicaoAtual = pedraSelecionada.posicao.atual as Coord;

				if (posicaoVizinho.x === posicaoAtual.x) {
					if (posicaoVizinho.y < posicaoAtual.y) {
						casas.push({
							x: posicaoAtual.x,
							y: posicaoVizinho.y - 1
						})
					} else {
						casas.push({
							x: posicaoAtual.x,
							y: posicaoVizinho.y + 1
						})
					}

					return;
				}

				if (posicaoVizinho.x > posicaoAtual.x) {
					casas.push({
						x: posicaoVizinho.x + 1,
						y: posicaoAtual.y
					})
				} else {
					casas.push({
						x: posicaoVizinho.x - 1,
						y: posicaoAtual.y
					})
				}
		});

		const casasExistentes = Casas.obterExistentes(casas, tabuleiro);
		const casasExistentesSemPedra = casasExistentes.filter(casa => {
			const pedraId = tabuleiro[casa.y][casa.x];

			if (pedraId) {
				return false;
			}

			return true;
		});

		return casasExistentesSemPedra;
	}

}
