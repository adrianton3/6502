(function () {
	'use strict'

	const START_PROGRAM = 0x200

	const addressModes = {
		absolute: {
			getAddress ({ memory, programCounter }) {
				return memory[programCounter] << 8 |
					memory[programCounter + 1]
			},
			bytes: 2
		},

		absoluteX: {
			getAddress ({ memory, programCounter, X }) {
				return memory[programCounter + X] << 8 |
					memory[programCounter + X + 1]
			},
			bytes: 2
		},

		absoluteY: {
			getAddress ({ memory, programCounter, Y }) {
				return memory[programCounter + Y] << 8 |
					memory[programCounter + Y + 1]
			},
			bytes: 2
		},

		zeroPage: {
			getAddress ({ memory, programCounter }) {
				return memory[programCounter]
			},
			bytes: 1
		},

		zeroPageX: {
			getAddress ({ programCounter, X }) {
				return (programCounter + X) & 0xFF
			},
			bytes: 1
		},

		zeroPageY: {
			getAddress ({ programCounter, Y }) {
				return (programCounter + Y) & 0xFF
			},
			bytes: 1
		},

		immediate: {
			getAddress ({ programCounter }) {
				return programCounter
			},
			bytes: 1
		},

		relative: {
			getAddress ({ memory, programCounter }) {
				return programCounter + memory[programCounter]
			},
			bytes: 1
		},

		indirect: {
			getAddress ({ memory, programCounter }) {
				const addressAddress = memory[programCounter] << 8 |
					memory[programCounter + 1]
				return memory[addressAddress]
			},
			bytes: 2
		},

		indexedIndirect: {
			getAddress ({ memory, programCounter, X }) {
				const address = memory[programCounter + X] << 8 |
					memory[programCounter + X + 1]
				return memory[address] << 8 | memory[address + 1]
			},
			bytes: 1
		},

		indirectIndexed: {
			getAddress ({ memory, programCounter, Y }) {
				const address = memory[programCounter] << 8 |
					memory[programCounter + 1]
				return memory[address + Y] << 8 | memory[address + Y + 1]
			},
			bytes: 1
		}
	}

	const instructionTypes = {
		ADC (state, address) {
			state.A += state.memory[address]
		},

		AND (state, address) {
			state.A &= state.memory[address]
		},

		ASL (state, address) {
			state.A = state.memory[address] << 1
		},

		ASL_A (state) {
			state.A <<= 1
		},

		INC (state, address) {
			state.memory[address]++
		},

		INX (state) {
			state.X++
		},

		INY (state) {
			state.Y++
		}
	}

	function makeState () {
		return {
			memory: new Uint8Array(0x10000),
			programCounter: START_PROGRAM,
			statusRegister: 0, // NV-B DIZC
			stackPointer: 0x1FF,
			X: 0,
			Y: 0,
			A: 0
		}
	}

	function makeInstructions () {
		const instructions = []

		function registerInstruction (instructionType, opcode, addressMode) {
			instructions[opcode] = addressMode ?
				(state) => {
					const address = addressMode.getAddress(state)
					instructionType(state, address)
					state.programCounter += addressMode.bytes
				} : instructionType
		}

		function registerInstructions (instructionType, pairs) {
			pairs.forEach(([opcode, addressMode]) => {
				registerInstruction(instructionType, opcode, addressMode)
			})
		}

		registerInstructions(instructionTypes.ADC, [
			[0x61, addressModes.indexedIndirect],
			[0x65, addressModes.zeroPage],
			[0x69, addressModes.immediate],
			[0x6D, addressModes.absolute],
			[0x71, addressModes.indirectIndexed],
			[0x75, addressModes.zeroPageX],
			[0x79, addressModes.absoluteY],
			[0x7D, addressModes.absoluteX]
		])

		registerInstructions(instructionTypes.AND, [
			[0x21, addressModes.indexedIndirect],
			[0x25, addressModes.zeroPage],
			[0x29, addressModes.immediate],
			[0x2D, addressModes.absolute],
			[0x31, addressModes.indirectIndexed],
			[0x35, addressModes.zeroPageX],
			[0x39, addressModes.absoluteY],
			[0x3D, addressModes.absoluteX]
		])

		registerInstructions(instructionTypes.ASL, [
			[0x06, addressModes.zeroPage],
			[0x0E, addressModes.absolute],
			[0x16, addressModes.zeroPageX],
			[0x1E, addressModes.absoluteX]
		])

		registerInstruction(instructionTypes.ASL_A, 0x0A)

		registerInstructions(instructionTypes.INC, [
			[0xE6, addressModes.zeroPage],
			[0xF6, addressModes.zeroPageX],
			[0xEE, addressModes.absolute],
			[0xFE, addressModes.absoluteX]
		])

		registerInstruction(instructionTypes.INX, 0xE8)

		registerInstruction(instructionTypes.INY, 0xC8)

		return instructions
	}

	function makeCpu () {
		const instructions = makeInstructions()

		const state = makeState()

		function getState() {
			return state
		}

		function load (romData) {
			state.memory.set(romData, START_PROGRAM)
		}

		function tick () {
			const opcode = state.memory[state.programCounter]
			const instruction = instructions[opcode]

			state.programCounter++

			instruction(state)
		}

		return {
			getState,
			load,
			tick
		}
	}

	window.c64 = window.c64 || {}
	window.c64.emulator = { makeCpu }
})()