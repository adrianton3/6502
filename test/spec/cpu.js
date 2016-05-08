(function () {
	'use strict'

	const {
		assembler: { assemble },
		emulator: { makeCpu }
	} = window.c64

	const START_PROGRAM = 0x200

	function execute (code) {
		const rom = assemble(code)
		const cpu = makeCpu()
		cpu.load(rom)
		cpu.run({ stopOpcode: 0x00 })
		return cpu.getState()
	}

	const specs = {
		'ADC': [{
			code: 'ADC #$23',
			result: { programCounter: START_PROGRAM + 2, A: 0x23 }
		}, {
			code: 'ADC $23',
			result: { programCounter: START_PROGRAM + 2, A: 0 }
		}, {
			code: 'ADC $23,X',
			result: { programCounter: START_PROGRAM + 2, A: 0 }
		}, {
			code: 'ADC $2345',
			result: { programCounter: START_PROGRAM + 3, A: 0 }
		}, {
			code: 'ADC $2345,X',
			result: { programCounter: START_PROGRAM + 3, A: 0 }
		}, {
			code: 'ADC $2345,Y',
			result: { programCounter: START_PROGRAM + 3, A: 0 }
		}, {
			code: 'ADC ($23,X)',
			result: { programCounter: START_PROGRAM + 2, A: 0 }
		}, {
			code: 'ADC ($23),Y',
			result: { programCounter: START_PROGRAM + 2, A: 0 }
		}],
		'AND': [{
			code: 'AND #$23',
			result: { programCounter: START_PROGRAM + 2, A: 0 }
		}, {
			code: 'AND $23',
			result: { programCounter: START_PROGRAM + 2, A: 0 }
		}, {
			code: 'AND $23,X',
			result: { programCounter: START_PROGRAM + 2, A: 0 }
		}, {
			code: 'AND $2345',
			result: { programCounter: START_PROGRAM + 3, A: 0 }
		}, {
			code: 'AND $2345,X',
			result: { programCounter: START_PROGRAM + 3, A: 0 }
		}, {
			code: 'AND $2345,Y',
			result: { programCounter: START_PROGRAM + 3, A: 0 }
		}, {
			code: 'AND ($23,X)',
			result: { programCounter: START_PROGRAM + 2, A: 0 }
		}, {
			code: 'AND ($23),Y',
			result: { programCounter: START_PROGRAM + 2, A: 0 }
		}],
		'ASL': [{
			code: 'ASL A',
			result: { programCounter: START_PROGRAM + 1, A: 0 }
		}, {
			code: 'ASL $23',
			result: { programCounter: START_PROGRAM + 2, A: 0 }
		}, {
			code: 'ASL $23,X',
			result: { programCounter: START_PROGRAM + 2, A: 0 }
		}, {
			code: 'ASL $2345',
			result: { programCounter: START_PROGRAM + 3, A: 0 }
		}, {
			code: 'ASL $2345,X',
			result: { programCounter: START_PROGRAM + 3, A: 0 }
		}],
		'DEC': [{
			code: 'DEC $23',
			result: { programCounter: START_PROGRAM + 2, memory: { 0x23: 255 } }
		}, {
			code: 'DEC $23,X',
			result: { programCounter: START_PROGRAM + 2, memory: { 0x23: 255 } }
		}, {
			code: 'DEC $2345',
			result: { programCounter: START_PROGRAM + 3, memory: { 0x2345: 255 } }
		}, {
			code: 'DEC $2345,X',
			result: { programCounter: START_PROGRAM + 3, memory: { 0x2345: 255 } }
		}],
		'DEX': [{
			code: 'DEX',
			result: { programCounter: START_PROGRAM + 1, X: 255 }
		}],
		'DEY': [{
			code: 'DEY',
			result: { programCounter: START_PROGRAM + 1, Y: 255 }
		}],
		'INC': [{
			code: 'INC $23',
			result: { programCounter: START_PROGRAM + 2, memory: { 0x23: 1 } }
		}, {
			code: 'INC $23,X',
			result: { programCounter: START_PROGRAM + 2, memory: { 0x23: 1 } }
		}, {
			code: 'INC $2345',
			result: { programCounter: START_PROGRAM + 3, memory: { 0x2345: 1 } }
		}, {
			code: 'INC $2345,X',
			result: { programCounter: START_PROGRAM + 3, memory: { 0x2345: 1 } }
		}],
		'INX': [{
			code: 'INX',
			result: { programCounter: START_PROGRAM + 1, X: 1 }
		}],
		'INY': [{
			code: 'INY',
			result: { programCounter: START_PROGRAM + 1, Y: 1 }
		}]
	}

	beforeEach(() => {
		jasmine.addMatchers(c64Test.CustomMatchers)
	})

	describe('emulator', () => {
		Object.keys(specs).forEach((text) => {
			describe(`${text}:`, () => {
				const entries = specs[text]

				entries.forEach(({ code, result }) => {
					it(code, () => {
						const actualResult = execute(code)
						expect(actualResult).toEqualSubset(result)
					})
				})
			})
		})
	})
})()