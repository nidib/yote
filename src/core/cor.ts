export const CorEnum = {
	BRANCA: 'BRANCA',
	PRETA: 'PRETA',
} as const

export type Cor = keyof typeof CorEnum;
