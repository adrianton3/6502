(function () {
	'use strict'

	const CLEAR_NEGATIVE = 0b01111111
	const CLEAR_OVERFLOW = 0b10111111
	const CLEAR_DECIMAL = 0b11110111
	const CLEAR_INTERRUPT_DISABLE = 0b11111011
	const CLEAR_ZERO = 0b11111101
	const CLEAR_CARRY = 0b11111110

	const SET_NEGATIVE = 0b10000000
	const SET_OVERFLOW = 0b01000000
	const SET_BREAK = 0b00010000
	const SET_DECIMAL = 0b00001000
	const SET_INTERRUPT_DISABLE = 0b00000100
	const SET_ZERO = 0b00000010
	const SET_CARRY = 0b00000001

	function push (state, value) {
		state.memory[state.stackPointer + 0x0100] = value
		state.stackPointer--
	}

	function pop (state) {
		state.stackPointer++
		return state.memory[state.stackPointer + 0x0100]
	}

	function compare (state, difference) {
		state.statusRegister &= CLEAR_NEGATIVE & CLEAR_ZERO & CLEAR_CARRY

		if (difference >= 0) {
			state.statusRegister |= SET_CARRY

			if (difference === 0) {
				state.statusRegister |= SET_ZERO
			}
		} else {
			state.statusRegister |= SET_NEGATIVE
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

		BCC (state, address) {
			if (state.statusRegister & SET_CARRY === 0) {
				state.programCounter = address
			}
		},

		BCS (state, address) {
			if (state.statusRegister & SET_CARRY !== 0) {
				state.programCounter = address
			}
		},

		BEQ (state, address) {
			if (state.statusRegister & SET_ZERO !== 0) {
				state.programCounter = address
			}
		},

		BIT (state, address) {
			const value = state.memory[address]
			state.statusRegister &= CLEAR_NEGATIVE & CLEAR_OVERFLOW & CLEAR_ZERO
			if (state.A & value === 0) {
				state.statusRegister |= SET_ZERO
			}
		},

		BMI (state, address) {
			if (state.statusRegister & SET_NEGATIVE !== 0) {
				state.programCounter = address
			}
		},

		BNE (state, address) {
			if (state.statusRegister & SET_ZERO === 0) {
				state.programCounter = address
			}
		},

		BPL (state, address) {
			if (state.statusRegister & SET_NEGATIVE === 0) {
				state.programCounter = address
			}
		},

		BRK (state) {
			const nextProgramCounter = state.programCounter + 1
			push(nextProgramCounter >> 8)
			push(nextProgramCounter & 0xFF)

			push(state.statusRegister)

			state.programCounter = state.memory[0xFFFE] |
				state.memory[0xFFFE + 1] << 8

			state.statusRegister |= SET_BREAK
		},

		BVC (state, address) {
			if (state.statusRegister & SET_OVERFLOW === 0) {
				state.programCounter = address
			}
		},

		BVS (state, address) {
			if (state.statusRegister & SET_OVERFLOW !== 0) {
				state.programCounter = address
			}
		},

		CLC (state) {
			state.statusRegister &= CLEAR_CARRY
		},

		CLD (state) {
			state.statusRegister &= CLEAR_DECIMAL
		},

		CLI (state) {
			state.statusRegister &= CLEAR_INTERRUPT_DISABLE
		},

		CLV (state) {
			state.statusRegister &= CLEAR_OVERFLOW
		},

		CMP (state, address) {
			compare(state, state.A - state.memory[address])
		},

		CPX (state, address) {
			compare(state, state.X - state.memory[address])
		},

		CPY (state, address) {
			compare(state, state.Y - state.memory[address])
		},

		DEC (state, address) {
			state.memory[address]--
		},

		DEX (state) {
			if (state.X === 0) {
				state.X = 255
			} else {
				state.X--
			}
		},

		DEY (state) {
			if (state.Y === 0) {
				state.Y = 255
			} else {
				state.Y--
			}
		},

		EOR (state, address) {
			state.A ^= state.memory[address]
		},

		INC (state, address) {
			state.memory[address]++
		},

		INX (state) {
			state.X++
		},

		INY (state) {
			state.Y++
		},

		JMP (state, address) {
			state.programCounter = address
		},

		JSR (state, address) {
			const nextProgramCounter = state.programCounter + 2
			push(nextProgramCounter >> 8)
			push(nextProgramCounter & 0xFF)
			state.programCounter = address
		},

		LDA (state, address) {
			state.A = state.memory[address]
		},

		LDX (state, address) {
			state.X = state.memory[address]
		},

		LDY (state, address) {
			state.Y = state.memory[address]
		},

		LSR (state, address) {
			state.memory[address] >>= 1
		},

		LSR_A (state) {
			state.A >>= 1
		},

		NOP () {},

		ORA (state, address) {
			state.A |= state.memory[address]
		},

		PHA (state) {
			push(state, state.A)
		},

		PHP (state) {
			push(state, state.statusRegister)
		},

		PLA (state) {
			state.A = pop(state)
		},

		PLP (state) {
			state.statusRegister = pop(state)
		},

		ROL (state, address) {
			const oldValue = state.memory[address]
			state.memory[address] = oldValue << 1 | (oldValue & 0b10000000) >> 7
		},

		ROL_A (state) {
			const oldValue = state.A
			state.A = oldValue << 1 | (oldValue & 0b10000000) >> 7
		},

		ROR (state, address) {
			const oldValue = state.memory[address]
			state.memory[address] = oldValue >> 1 | (oldValue & 0b1) << 7
		},

		ROR_A (state) {
			const oldValue = state.A
			state.A = oldValue >> 1 | (oldValue & 0b1) << 7
		},

		RTI (state) {
			state.statusRegister = pop()
			state.programCounter = pop() | pop() >> 8
		},

		RTS () {
			state.programCounter = pop() | pop() >> 8
		},

		SBC (state, address) {
			state.A -= state.memory[address]
		},

		SEC (state) {
			state.statusRegister |= SET_CARRY
		},

		SED (state) {
			state.statusRegister |= SET_DECIMAL
		},

		SEI (state) {
			state.statusRegister |= SET_INTERRUPT_DISABLE
		},

		STA (state, address) {
			state.memory[address] = state.A
		},

		STX (state, address) {
			state.memory[address] = state.X
		},

		STY (state, address) {
			state.memory[address] = state.Y
		},

		TAX (state) {
			state.X = state.A
		},

		TAY (state) {
			state.Y = state.A
		},

		TSX (state) {
			state.X = state.stackPointer
		},

		TXA (state) {
			state.A = state.X
		},

		TXS (state) {
			state.stackPointer = state.X
		},

		TYA (state) {
			state.A = state.Y
		}
	}

	window.c64 = window.c64 || {}
	window.c64.cpu = window.c64.cpu || {}
	Object.assign(window.c64.cpu, { instructionTypes })
})()