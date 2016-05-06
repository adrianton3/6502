(function () {
	'use strict'

	const instructions = {
		'ADC': {
			immediate: 0x69,
			zeroPage: 0x65,
			zeroPageX: 0x75,
			absolute: 0x6D,
			absoluteX: 0x7D,
			absoluteY: 0x79,
			indexedIndirect: 0x61,
			indirectIndexed: 0x71
		},
		'AND': {
			immediate: 0x29,
			zeroPage: 0x25,
			zeroPageX: 0x35,
			absolute: 0x2D,
			absoluteX: 0x3D,
			absoluteY: 0x39,
			indexedIndirect: 0x21,
			indirectIndexed: 0x31
		},
		'ASL': {
			accumulator: 0x0A,
			zeroPage: 0x06,
			zeroPageX: 0x16,
			absolute: 0x0E,
			absoluteX: 0x1E
		},
		'BCC': { relative: 0x90 },
		'BCS': { relative: 0xB0 },
		'BEQ': { relative: 0xF0 },
		'BIT': {
			zeroPage: 0x24,
			absolute: 0x2C
		},
		'BMI': { relative: 0x30 },
		'BNE': { relative: 0xD0 },
		'BPL': { relative: 0x10 },
		'BRK': {},
		'BVC': {},
		'BVS': {},
		'CLC': {},
		'CLD': {},
		'CLI': {},
		'CLV': {},
		'CMP': {},
		'CPX': {},
		'CPY': {},
		'DEC': {
			zeroPage: 0xC6,
			zeroPageX: 0xD6,
			absolute: 0xCE,
			absoluteX: 0xDE
		},
		'DEX': { implied: 0xCA },
		'DEY': { implied: 0x88 },
		'EOR': {
			immediate: 0x49,
			zeroPage: 0x45,
			zeroPageX: 0x55,
			absolute: 0x4D,
			absoluteY: 0x5D,
			absoluteX: 0x59,
			indexedIndirect: 0x41,
			indirectIndexed: 0x51
		},
		'INC': {
			zeroPage: 0xE6,
			zeroPageX: 0xF6,
			absolute: 0xEE,
			absoluteX: 0xFE
		},
		'INX': { implied: 0xE8 },
		'INY': { implied: 0xC8 },
		'JMP': {},
		'JSR': {},
		'LDA': {
			immediate: 0xA9,
			zeroPage: 0xA5,
			zeroPageX: 0xB5,
			absolute: 0xAD,
			absoluteX: 0xBD,
			absoluteY: 0xB9,
			indexedIndirect: 0xA1,
			indirectIndexed: 0xB1
		},
		'LDX': {
			immediate: 0xA2,
			zeroPage: 0xA6,
			zeroPageX: 0xB6,
			absolute: 0xAE,
			absoluteX: 0xBE
		},
		'LDY': {
			immediate: 0xA0,
			zeroPage: 0xA4,
			zeroPageX: 0xB4,
			absolute: 0xAC,
			absoluteX: 0xBC
		},
		'LSR': {
			accumulator: 0x4A,
			zeroPage: 0x46,
			zeroPageX: 0x56,
			absolute: 0x4E,
			absoluteX: 0x5E
		},
		'NOP': {},
		'ORA': {
			immediate: 0x09,
			zeroPage: 0x05,
			zeroPageX: 0x15,
			absolute: 0x0D,
			absoluteY: 0x1D,
			absoluteX: 0x19,
			indexedIndirect: 0x01,
			indirectIndexed: 0x11
		},
		'PHA': {},
		'PHP': {},
		'PLA': {},
		'PLP': {},
		'ROL': {
			accumulator: 0x2A,
			zeroPage: 0x26,
			zeroPageX: 0x36,
			absolute: 0x2E,
			absoluteX: 0x3E
		},
		'ROR': {
			accumulator: 0x6A,
			zeroPage: 0x66,
			zeroPageX: 0x76,
			absolute: 0x6E,
			absoluteX: 0x7E
		},
		'RTI': {},
		'RTS': {},
		'SBC': {
			immediate: 0xE9,
			zeroPage: 0xE5,
			zeroPageX: 0xF5,
			absolute: 0xED,
			absoluteY: 0xFD,
			absoluteX: 0xF9,
			indexedIndirect: 0xE1,
			indirectIndexed: 0xF1
		},
		'SEC': {},
		'SED': {},
		'SEI': {},
		'STA': {
			zeroPage: 0x85,
			zeroPageX: 0x95,
			absolute: 0x8D,
			absoluteX: 0x9D,
			absoluteY: 0x99,
			indexedIndirect: 0x81,
			indirectIndexed: 0x91
		},
		'STX': {
			zeroPage: 0x86,
			zeroPageY: 0x96,
			absolute: 0x8E
		},
		'STY': {
			zeroPage: 0x84,
			zeroPageX: 0x94,
			absolute: 0x8C
		},
		'TAX': { implied: 0xAA },
		'TAY': { implied: 0xA8 },
		'TSX': {},
		'TXA': { implied: 0x8A },
		'TXS': {},
		'TYA': { implied: 0x98 }
	}

	function parseByte (left = 0, right = 0) {
		return (string) => {
			const trimmed = string.substring(left + 1, string.length - right)
			return [parseInt(trimmed, 16)]
		}
	}

	function parseWord (left = 0, right = 0) {
		return (string) => {
			const trimmed = string.substring(left + 1, string.length - right)
			const value = parseInt(trimmed, 16)
			return [value & 0xFF, value >> 8]
		}
	}

	const matchers = {
		accumulator: {
			test: (string) => string === 'A',
			extract: () => []
		},
		implied: {
			test: (string) => string === undefined,
			extract: () => []
		},
		immediate: {
			test: (string) => /^#\$[\dA-Fa-f]{2}$/.test(string),
			extract: parseByte(1)
		},
		zeroPage: {
			test: (string) => /^\$[\dA-Fa-f]{2}$/.test(string),
			extract: parseByte()
		},
		zeroPageX: {
			test: (string) => /^\$[\dA-Fa-f]{2},X$/.test(string),
			extract: parseByte(0, 2)
		},
		zeroPageY: {
			test: (string) => /^\$[\dA-F]{2},Y$/.test(string),
			extract: parseByte(0, 2)
		},
		absolute: {
			test: (string) => /^\$[\dA-F]{4}$/.test(string),
			extract: parseWord()
		},
		absoluteX: {
			test: (string) => /^\$[\dA-F]{4},X$/.test(string),
			extract: parseWord(0, 2)
		},
		absoluteY: {
			test: (string) => /^\$[\dA-F]{4},Y$/.test(string),
			extract: parseWord(0, 2)
		},
		indirect: {
			test: (string) => /^\(\$[\dA-F]{4}\)$/.test(string),
			extract: parseWord(1, 1)
		},
		indexedIndirect: {
			test: (string) => /^\(\$[\dA-F]{2},X\)$/.test(string),
			extract: parseByte(1, 3)
		},
		indirectIndexed: {
			test: (string) => /^\(\$[\dA-F]{2}\),Y$/.test(string),
			extract: parseByte(1, 3)
		}
	}

	function assemble (string) {
		const lines = string.split('\n')

		const encoded = lines.map((line) => {
			const [_, mnemonic, operand] = line.match(/(\w+)(?:\s+([\dA-F#$(),XY]+))?/)

			const variants = instructions[mnemonic]
			const matchVariant = Object.keys(variants).find((name) =>
				matchers[name].test(operand)
			)

			if (matchVariant) {
				const opcode = variants[matchVariant]
				const argument = matchers[matchVariant].extract(operand)
				return [opcode, ...argument]
			} else {
				throw new Error(`error while trying to parse: "${line}"`)
			}
		})

		return [].concat(...encoded)
	}

	window.c64 = window.c64 || {}
	window.c64.assembler = { assemble }
})()