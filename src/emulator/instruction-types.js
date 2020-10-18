(function () {
	'use strict'

	const stackStart = 0x0100

	function push8 (state, value) {
		state.memory[stackStart + state.stackPointer] = value
		state.stackPointer--
	}

	function push16 (state, value) {
		state.memory[stackStart + state.stackPointer] = value >> 8
		state.memory[stackStart + state.stackPointer - 1] = value
		state.stackPointer -= 2
	}

	function pushStatus (state) {
		const { status } = state

        // NV-B DIZC
        const value = status.negative << 7 |
            status.overflow << 6 |
            1 << 5 |
            1 << 4 |
            status.decimal << 3 |
            status.interrupt << 2 |
            status.zero << 1 |
            status.carry << 0

		push8(state, value)
	}

	function pop8 (state) {
		state.stackPointer++
		return state.memory[stackStart + state.stackPointer]
    }

    function pop16 (state) {
		state.stackPointer += 2
        return (state.memory[stackStart + state.stackPointer] << 8) |
            state.memory[stackStart + state.stackPointer - 1]
	}

	function popStatus (state) {
		const { status } = state

		const value = pop8(state)

		status.negative = (value & 0x80) >> 7
		status.overflow = (value & 0x40) >> 6
		// -
		// -
		status.decimal = (value & 0x08) >> 3
		status.interrupt = (value & 0x04) >> 2
		status.zero = (value & 0x02) >> 1
		status.carry = value & 0x01
	}

	function updateNz (state, value) {
		state.status.negative = (value & 0x80) >> 7
		state.status.zero = value === 0 ? 1 : 0
	}

	function compare (state, a, b) {
		const diff = a - b
		state.status.carry = diff >= 0 ? 1 : 0
		updateNz(diff)
	}

	const instructionTypes = {
		ADC (state, address) {
			const operand = state.memory[address]
			const value = state.A + operand + state.status.carry
			state.status.carry = (value & 0x100) === 0 ? 0 : 1
			state.status.overflow = (~(state.A ^ operand) & (state.A ^ value) & 0x80) >> 7
			state.A = value & 0xFF
			updateNz(state, state.A)
		},

		AND (state, address) {
			state.A &= state.memory[address]
			updateNz(state, state.A)
		},

		ASL (state, address) {
			state.status.carry = (state.memory[address] & 0x80) >> 7
			state.memory[address] <<= 1
			updateNz(state, state.memory[address])
		},

		ASL_A (state) {
			state.status.carry = (state.A & 0x80) >> 7
			state.A <<= 1
			state.A &= 0xFF
			updateNz(state, state.A)
		},

		BCC (state, address) {
			if (state.status.carry === 0) {
				state.programCounter = address
			}
		},

		BCS (state, address) {
			if (state.status.carry !== 0) {
				state.programCounter = address
			}
		},

		BEQ (state, address) {
			if (state.status.zero !== 0) {
				state.programCounter = address
			}
		},

		BIT (state, address) {
			const operand = state.memory[address]

			state.status.negative = (operand & 0x80) >> 7
			state.status.overflow = (operand & 0x40) >> 6
			state.status.zero = (state.A & operand) === 0 ? 1 : 0
		},

		BMI (state, address) {
			if (state.status.negative !== 0) {
				state.programCounter = address
			}
		},

		BNE (state, address) {
			if (state.status.zero === 0) {
				state.programCounter = address
			}
		},

		BPL (state, address) {
			if (state.status.negative === 0) {
				state.programCounter = address
			}
		},

		BRK (state) {
			push16(state, state.programCounter + 2)
			pushStatus(state)

			state.programCounter =
				state.memory[0xFFFE] |
				state.memory[0xFFFE + 1] << 8
		},

		BVC (state, address) {
			if (state.status.overflow === 0) {
				state.programCounter = address
			}
		},

		BVS (state, address) {
			if (state.status.overflow !== 0) {
				state.programCounter = address
			}
		},

		CLC (state) {
			state.status.carry = 0
		},

		CLD (state) {
			state.status.decimal = 0
		},

		CLI (state) {
			state.status.interrupt = 0
		},

		CLV (state) {
			state.status.overflow = 0
		},

		CMP (state, address) {
			compare(state, state.A, state.memory[address])
		},

		CPX (state, address) {
			compare(state, state.X, state.memory[address])
		},

		CPY (state, address) {
			compare(state, state.Y, state.memory[address])
		},

		DEC (state, address) {
			state.memory[address]--
			updateNz(state, state.memory[address])
		},

		DEX (state) {
			state.X--
			state.X &= 0xFF
			updateNz(state, state.X)
		},

		DEY (state) {
			state.Y--
			state.Y &= 0xFF
			updateNz(state, state.Y)
		},

		EOR (state, address) {
			state.A ^= state.memory[address]
			updateNz(state, state.A)
		},

		INC (state, address) {
			state.memory[address]++
			updateNz(state, state.memory[address])
		},

		INX (state) {
			state.X++
			state.X &= 0xFF
			updateNz(state, state.X)
		},

		INY (state) {
			state.Y++
			state.Y &= 0xFF
			updateNz(state, state.Y)
		},

		JMP (state, address) {
			state.programCounter = address
		},

		JSR (state, address) {
			push16(state.programCounter + 2)
			state.programCounter = address
		},

		LDA (state, address) {
			state.A = state.memory[address]
			updateNz(state, state.A)
		},

		LDX (state, address) {
			state.X = state.memory[address]
			updateNz(state, state.X)
		},

		LDY (state, address) {
			state.Y = state.memory[address]
			updateNz(state, state.Y)
		},

		LSR (state, address) {
			state.status.carry = state.memory[address] & 0x01
			state.memory[address] >>= 1
			state.status.negative = 0
			state.status.zero = state.memory[address] === 0 ? 1 : 0
		},

		LSR_A (state) {
			state.status.carry = state.memory[address] & 0x01
			state.A >>= 1
			state.status.negative = 0
			state.status.zero = state.A === 0 ? 1 : 0
		},

		NOP () {},

		ORA (state, address) {
			state.A |= state.memory[address]
			updateNz(state, state.A)
		},

		PHA (state) {
			push8(state, state.A)
		},

		PHP (state) {
			pushStatus(state)
		},

		PLA (state) {
			state.A = pop8(state)
			updateNz(state, state.A)
		},

		PLP (state) {
			popStatus(state)
		},

		ROL (state, address) {
			const value = state.memory[address]
			state.memory[address] = (value << 1) | state.status.carry
			state.status.carry = (value & 0x80) >> 7
			updateNz(state, state.memory[address])
		},

		ROL_A (state) {
			const value = state.A
			state.A = ((value << 1) & 0xFF) | state.status.carry
			state.status.carry = (value & 0x80) >> 7
			updateNz(state, state.A)
		},

		ROR (state, address) {
			const value = state.memory[address]
			state.memory[address] = (value >> 1) | (state.status.carry << 7)
			state.status.carry = value & 0x01
			updateNz(state, state.memory[address])
		},

		ROR_A (state) {
			const value = state.A
			state.A = (value >> 1) | (state.status.carry << 7)
			state.status.carry = value & 0x01
			updateNz(state, state.A)
		},

		RTI (state) {
			popStatus(state)
			state.programCounter = pop16(state)
		},

		RTS () {
			state.programCounter = pop16(state)
		},

		SBC (state, address) {
			state.A -= state.memory[address]
		},

		SEC (state) {
			state.status.carry = 1
		},

		SED (state) {
			state.status.decimal = 1
		},

		SEI (state) {
			state.status.interrupt = 1
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
			updateNz(state, state.X)
		},

		TAY (state) {
			state.Y = state.A
			updateNz(state, state.Y)
		},

		TSX (state) {
			state.X = state.stackPointer
			updateNz(state, state.X)
		},

		TXA (state) {
			state.A = state.X
			updateNz(state, state.A)
		},

		TXS (state) {
			state.stackPointer = state.X
		},

		TYA (state) {
			state.A = state.Y
			updateNz(state, state.A)
		}
	}

	window.c64 = window.c64 || {}
	window.c64.cpu = window.c64.cpu || {}
	Object.assign(window.c64.cpu, { instructionTypes })
})()
