import { styled } from '@stitches/react';

import { Cor } from '../../core/cor';
import { Pedra } from '../pedra';
import { usePedrasStore } from '../../core/pedras';


type Props = {
	cor: Cor
}

const Linha = styled('div', {
	display: 'grid',
	gridTemplateColumns: '1fr 1fr',
	gap: 8,
});

export function Pedras(props: Props) {
	const { pedras } = usePedrasStore();

	return (
		<Linha>
			{
				Array.from(pedras.values())
					.filter(pedra => {
						if (pedra.cor !== props.cor) return false;

						if (pedra.posicao.atual) return false;

						return true;
					})
					.map(pedra => (
						<Pedra key={pedra.id} id={pedra.id} />
					))
			}
		</Linha>
	)
}
