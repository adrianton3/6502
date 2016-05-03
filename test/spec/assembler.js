(function () {
	'use strict'

	const { assemble } = window.c64.assembler

	const specs = {
		'ADC': [
			{ code: 'ADC #$23', hex: [0x69, 0x23] },
			{ code: 'ADC $23', hex: [0x65, 0x23] },
			{ code: 'ADC $23,X', hex: [0x75, 0x23] },
			{ code: 'ADC $2345', hex: [0x6d, 0x45, 0x23] },
			{ code: 'ADC $2345,X', hex: [0x7d, 0x45, 0x23] },
			{ code: 'ADC $2345,Y', hex: [0x79, 0x45, 0x23] },
			{ code: 'ADC ($23,X)', hex: [0x61, 0x23] },
			{ code: 'ADC ($23),Y', hex: [0x71, 0x23] }
		],
		'AND': [
			{ code: 'AND #$23', hex: [0x29, 0x23] },
			{ code: 'AND $23', hex: [0x25, 0x23] },
			{ code: 'AND $23,X', hex: [0x35, 0x23] },
			{ code: 'AND $2345', hex: [0x2d, 0x45, 0x23] },
			{ code: 'AND $2345,X', hex: [0x3d, 0x45, 0x23] },
			{ code: 'AND $2345,Y', hex: [0x39, 0x45, 0x23] },
			{ code: 'AND ($23,X)', hex: [0x21, 0x23] },
			{ code: 'AND ($23),Y', hex: [0x31, 0x23] }
		],
		'ASL': [
			{ code: 'ASL A', hex: [0x0a] },
			{ code: 'ASL $23', hex: [0x06, 0x23] },
			{ code: 'ASL $23,X', hex: [0x16, 0x23] },
			{ code: 'ASL $2345', hex: [0x0e, 0x45, 0x23] },
			{ code: 'ASL $2345,X', hex: [0x1e, 0x45, 0x23] }
		],
		'DEC': [
			{ code: 'DEC $23', hex: [0xc6, 0x23] },
			{ code: 'DEC $23,X', hex: [0xd6, 0x23] },
			{ code: 'DEC $2345', hex: [0xce, 0x45, 0x23] },
			{ code: 'DEC $2345,X', hex: [0xde, 0x45, 0x23] }
		],
		'DEX': [
			{ code: 'DEX', hex: [0xca] }
		],
		'DEY': [
			{ code: 'DEY', hex: [0x88] }
		],
		'INC': [
			{ code: 'INC $23', hex: [0xe6, 0x23] },
			{ code: 'INC $23,X', hex: [0xf6, 0x23] },
			{ code: 'INC $2345', hex: [0xee, 0x45, 0x23] },
			{ code: 'INC $2345,X', hex: [0xfe, 0x45, 0x23] }
		],
		'INX': [
			{ code: 'INX', hex: [0xe8] }
		],
		'INY': [
			{ code: 'INY', hex: [0xc8] }
		],
		'LDA': [
			{ code: 'LDA #$23', hex: [0xA9, 0x23] },
			{ code: 'LDA $23', hex: [0xA5, 0x23] },
			{ code: 'LDA $23,X', hex: [0xB5, 0x23] },
			{ code: 'LDA $2345', hex: [0xAD, 0x45, 0x23] },
			{ code: 'LDA $2345,X', hex: [0xBD, 0x45, 0x23] },
			{ code: 'LDA $2345,Y', hex: [0xB9, 0x45, 0x23] },
			{ code: 'LDA ($23,X)', hex: [0xA1, 0x23] },
			{ code: 'LDA ($23),Y', hex: [0xB1, 0x23] }
		],
		'LDX': [
			{ code: 'LDX #$23', hex: [0xA2, 0x23] },
			{ code: 'LDX $23', hex: [0xA6, 0x23] },
			{ code: 'LDX $23,X', hex: [0xB6, 0x23] },
			{ code: 'LDX $2345', hex: [0xAE, 0x45, 0x23] },
			{ code: 'LDX $2345,X', hex: [0xBE, 0x45, 0x23] }
		],
		'LDY': [
			{ code: 'LDY #$23', hex: [0xA0, 0x23] },
			{ code: 'LDY $23', hex: [0xA4, 0x23] },
			{ code: 'LDY $23,X', hex: [0xB4, 0x23] },
			{ code: 'LDY $2345', hex: [0xAC, 0x45, 0x23] },
			{ code: 'LDY $2345,X', hex: [0xBC, 0x45, 0x23] }
		]
	}

	describe('assembler', () => {
		Object.keys(specs).forEach((text) => {
			describe(`${text}:`, () => {
				const entries = specs[text]

				entries.forEach(({ code, hex }) => {
					it(code, () => {
						expect(assemble(code)).toEqual(hex)
					})
				})
			})
		})
	})
})()