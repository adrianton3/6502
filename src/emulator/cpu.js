(function () {
	'use strict'

	const { makeInstructions } = window.c64.cpu

	const START_PROGRAM = 0x200

	function makeState () {
		return {
			memory: new Uint8Array(0x10000),
			programCounter: START_PROGRAM,
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