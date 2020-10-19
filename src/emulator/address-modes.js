(function () {
	'use strict'

	const addressModes = {
		absolute: {
			getAddress ({ memory, programCounter }) {
				return memory[programCounter] |
					(memory[programCounter + 1] << 8)
			},
			bytes: 2
		},

		absoluteX: {
			getAddress ({ memory, programCounter, X }) {
				return memory[programCounter + X] |
					(memory[programCounter + X + 1] << 8)
			},
			bytes: 2
		},

		absoluteY: {
			getAddress ({ memory, programCounter, Y }) {
				return memory[programCounter + Y] |
					(memory[programCounter + Y + 1] << 8)
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
			getAddress ({ memory, programCounter, X }) {
				return (memory[programCounter] + X) & 0xFF
			},
			bytes: 1
		},

		zeroPageY: {
			getAddress ({ memory, programCounter, Y }) {
				return (memory[programCounter] + Y) & 0xFF
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
				const offset = memory[programCounter]

                return (offset & 0x80) === 0
                    ? programCounter + offset
				    : programCounter + (offset & 0x7F) - 128
			},
			bytes: 1
		},

		indirect: {
			getAddress ({ memory, programCounter }) {
				const addressAddress = memory[programCounter] |
                    (memory[programCounter + 1] << 8)

				return memory[addressAddress]
			},
			bytes: 2
		},

		indexedIndirect: {
			getAddress ({ memory, programCounter, X }) {
				const address = memory[programCounter + X] |
                    (memory[programCounter + X + 1] << 8)

                return memory[address] |
                    (memory[address + 1] << 8)
			},
			bytes: 1
		},

		indirectIndexed: {
			getAddress ({ memory, programCounter, Y }) {
				const address = memory[programCounter] |
                    (memory[programCounter + 1] << 8)

                return memory[address + Y] |
                    (memory[address + Y + 1] << 8)
			},
			bytes: 1
		}
	}

	window.c64 = window.c64 || {}
	window.c64.cpu = window.c64.cpu || {}
	Object.assign(window.c64.cpu, { addressModes })
})()
