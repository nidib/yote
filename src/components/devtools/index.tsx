import React, { useMemo } from 'react';
import {styled} from "@stitches/react";
import {useAIStore} from "../../core/ai.ts";

const Box = styled('div', {
	position: 'absolute',
	padding: 20,
	top: 0,
	right: 0,

	'fieldset': {
		padding: '20px 30px 20px 15px',
	},
});

export function DevTools() {
	const { habilitado, habilitar, desabilitar } = useAIStore();
	const devParam = useMemo(() => new URLSearchParams(window.location.search), []);

	if (devParam.get('modo') !== 'dev') {
		return null;
	}

	const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.target.checked ? habilitar() : desabilitar();
	}

	return (
		<Box>
			<fieldset>
				<legend>Devtools</legend>
				<div>
					<label>
						A.I.?:
						<input type="checkbox" checked={habilitado} onChange={handleCheckbox} />
					</label>
				</div>
				<div>
					<label>
						Dificuldade:
						<select disabled={!habilitado}>
							<option value={'FACIL'} defaultChecked>Fácil</option>
						</select>
					</label>
				</div>
			</fieldset>
		</Box>
	);
}
