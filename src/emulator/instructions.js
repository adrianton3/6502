(function () {
	'use strict'

	const { addressModes, instructionTypes } = window.c64.cpu

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

		registerInstruction(instructionTypes.BCC, 0x90, addressModes.relative)

		registerInstruction(instructionTypes.BCS, 0xB0, addressModes.relative)

		registerInstruction(instructionTypes.BEQ, 0xF0, addressModes.relative)

		registerInstructions(instructionTypes.BIT, [
			[0x24, addressModes.zeroPage],
			[0x2C, addressModes.absolute]
		])

		registerInstruction(instructionTypes.BMI, 0x30, addressModes.relative)

		registerInstruction(instructionTypes.BNE, 0xD0, addressModes.relative)

		registerInstruction(instructionTypes.BPL, 0x10, addressModes.relative)

		registerInstruction(instructionTypes.BRK, 0x00)

		registerInstruction(instructionTypes.BVC, 0x50, addressModes.relative)

		registerInstruction(instructionTypes.BVS, 0x70, addressModes.relative)

		registerInstruction(instructionTypes.CLC, 0x18)

		registerInstruction(instructionTypes.CLD, 0xD8)

		registerInstruction(instructionTypes.CLI, 0x58)

		registerInstruction(instructionTypes.CLV, 0xB8)

		registerInstructions(instructionTypes.DEC, [
			[0xC6, addressModes.zeroPage],
			[0xD6, addressModes.zeroPageX],
			[0xCE, addressModes.absolute],
			[0xDE, addressModes.absoluteX]
		])

		registerInstruction(instructionTypes.DEX, 0xCA)

		registerInstruction(instructionTypes.DEY, 0x88)

		registerInstructions(instructionTypes.EOR, [
			[0x49, addressModes.immediate],
			[0x45, addressModes.zeroPage],
			[0x55, addressModes.zeroPageX],
			[0x4D, addressModes.absolute],
			[0x5D, addressModes.absoluteY],
			[0x59, addressModes.absoluteX],
			[0x41, addressModes.indexedIndirect],
			[0x51, addressModes.indirectIndexed]
		])

		registerInstructions(instructionTypes.INC, [
			[0xE6, addressModes.zeroPage],
			[0xF6, addressModes.zeroPageX],
			[0xEE, addressModes.absolute],
			[0xFE, addressModes.absoluteX]
		])

		registerInstruction(instructionTypes.INX, 0xE8)

		registerInstruction(instructionTypes.INY, 0xC8)

		registerInstructions(instructionTypes.JMP, [
			[0x4C, addressModes.absolute],
			[0x6C, addressModes.indirect]
		])

		registerInstruction(instructionTypes.JSR, 0x20)

		registerInstructions(instructionTypes.LDA, [
			[0xA9, addressModes.immediate],
			[0xA5, addressModes.zeroPage],
			[0xB5, addressModes.zeroPageX],
			[0xAD, addressModes.absolute],
			[0xBD, addressModes.absoluteY],
			[0xB9, addressModes.absoluteX],
			[0xA1, addressModes.indexedIndirect],
			[0xB1, addressModes.indirectIndexed]
		])

		registerInstructions(instructionTypes.LDX, [
			[0xA2, addressModes.immediate],
			[0xA6, addressModes.zeroPage],
			[0xB6, addressModes.zeroPageY],
			[0xAE, addressModes.absolute],
			[0xBE, addressModes.absoluteY]
		])

		registerInstructions(instructionTypes.LDY, [
			[0xA0, addressModes.immediate],
			[0xA4, addressModes.zeroPage],
			[0xB4, addressModes.zeroPageX],
			[0xAC, addressModes.absolute],
			[0xBC, addressModes.absoluteX]
		])

		registerInstructions(instructionTypes.LSR, [
			[0x46, addressModes.zeroPage],
			[0x56, addressModes.zeroPageX],
			[0x4E, addressModes.absolute],
			[0x5E, addressModes.absoluteX]
		])

		registerInstruction(instructionTypes.LSR_A, 0x4A)

		registerInstruction(instructionTypes.NOP, 0xEA)

		registerInstructions(instructionTypes.ORA, [
			[0x09, addressModes.immediate],
			[0x05, addressModes.zeroPage],
			[0x15, addressModes.zeroPageX],
			[0x0D, addressModes.absolute],
			[0x1D, addressModes.absoluteY],
			[0x19, addressModes.absoluteX],
			[0x01, addressModes.indexedIndirect],
			[0x11, addressModes.indirectIndexed]
		])

		registerInstruction(instructionTypes.PHA, 0x48)

		registerInstruction(instructionTypes.PHP, 0x08)

		registerInstruction(instructionTypes.PLA, 0x68)

		registerInstruction(instructionTypes.PLP, 0x28)

		registerInstructions(instructionTypes.ROL, [
			[0x26, addressModes.zeroPage],
			[0x36, addressModes.zeroPageX],
			[0x2E, addressModes.absolute],
			[0x3E, addressModes.absoluteX]
		])

		registerInstruction(instructionTypes.ROL_A, 0x2A)

		registerInstructions(instructionTypes.ROR, [
			[0x66, addressModes.zeroPage],
			[0x76, addressModes.zeroPageX],
			[0x6E, addressModes.absolute],
			[0x7E, addressModes.absoluteX]
		])

		registerInstruction(instructionTypes.ROR_A, 0x6A)

		registerInstruction(instructionTypes.RTI, 0x40)

		registerInstruction(instructionTypes.RTS, 0x60)

		registerInstructions(instructionTypes.SBC, [
			[0xE9, addressModes.immediate],
			[0xE5, addressModes.zeroPage],
			[0xF5, addressModes.zeroPageX],
			[0xED, addressModes.absolute],
			[0xFD, addressModes.absoluteY],
			[0xF9, addressModes.absoluteX],
			[0xE1, addressModes.indexedIndirect],
			[0xF1, addressModes.indirectIndexed]
		])

		registerInstruction(instructionTypes.SEC, 0x38)

		registerInstruction(instructionTypes.SED, 0xF8)

		registerInstruction(instructionTypes.SEI, 0x78)

		registerInstructions(instructionTypes.STA, [
			[0x85, addressModes.zeroPage],
			[0x95, addressModes.zeroPageX],
			[0x8D, addressModes.absolute],
			[0x9D, addressModes.absoluteY],
			[0x99, addressModes.absoluteX],
			[0x81, addressModes.indexedIndirect],
			[0x91, addressModes.indirectIndexed]
		])

		registerInstructions(instructionTypes.STX, [
			[0x86, addressModes.zeroPage],
			[0x96, addressModes.zeroPageY],
			[0x8E, addressModes.absolute]
		])

		registerInstructions(instructionTypes.STY, [
			[0x84, addressModes.zeroPage],
			[0x94, addressModes.zeroPageX],
			[0x8C, addressModes.absolute]
		])

		registerInstruction(instructionTypes.TAX, 0xAA)

		registerInstruction(instructionTypes.TAY, 0xA8)

		registerInstruction(instructionTypes.TSX, 0xBA)

		registerInstruction(instructionTypes.TXA, 0x8A)

		registerInstruction(instructionTypes.TXS, 0x9A)

		registerInstruction(instructionTypes.TYA, 0x98)

		return instructions
	}

	window.c64 = window.c64 || {}
	window.c64.cpu = window.c64.cpu || {}
	Object.assign(window.c64.cpu, { makeInstructions })
})()
