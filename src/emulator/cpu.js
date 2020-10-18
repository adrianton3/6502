(function () {
	'use strict'

	const { makeInstructions } = window.c64.cpu

	function makeState ({ programStart }) {
		return {
			memory: new Uint8Array(0x10000),
			programCounter: programStart,
			status: {
				negative: 0,
				overflow: 0,
				decimal: 0,
				interrupt: 0,
				zero: 0,
				carry: 0,
			},
			stackPointer: 0xFF,
			X: 0,
			Y: 0,
			A: 0
		}
	}

	function makeCpu (options = {}) {
        const programStart = options.programStart ?? 0x0200

		const instructions = makeInstructions()

		const state = makeState({ programStart })

		function getState() {
			return state
		}

		function load (romData) {
			state.memory.set(romData, programStart)
		}

		function tick () {
			const opcode = state.memory[state.programCounter]
			const instruction = instructions[opcode]

			state.programCounter++

			instruction(state)
		}

		function run ({ stopOpcode }) {
			while (state.memory[state.programCounter] !== stopOpcode) {
				tick()
			}
		}

		return {
			getState,
			load,
			tick,
			run
		}
	}

	window.c64 = window.c64 || {}
	window.c64.cpu = window.c64.cpu || {}
	Object.assign(window.c64.cpu, { make: makeCpu })
})()
