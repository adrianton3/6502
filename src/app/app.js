(() => {
    'use strict'

    const elements = {
        'in': document.getElementById('in'),
        'out': document.getElementById('out'),
    }

    function stringifyNumber (value, base, length) {
        return base == 2
            ? (value >> 4).toString(2).padStart(4, '0') + ' ' + (value & 0x0F).toString(2).padStart(4, '0')
            : value.toString(base).padStart(length, '0')
    }

    function stringifyRegister8 (name, value) {
        return `${name}: 0x${stringifyNumber(value, 16, 2)}   ;   ${stringifyNumber(value, 10, 3)}   ;   ${stringifyNumber(value, 2, 8)}`
    }

    function stringifyState (state) {
        return [
            stringifyRegister8('A ', state.A),
            stringifyRegister8('X ', state.X),
            stringifyRegister8('Y ', state.Y),
            '',
            `PC: 0x${stringifyNumber(state.programCounter, 16, 4)}`,
            stringifyRegister8('SP', state.stackPointer),
            '',
            `NV-B DIZC`,
            `${state.status.negative}${state.status.overflow}-- ${state.status.decimal}${state.status.interrupt}${state.status.zero}${state.status.carry}`,
        ].join('\n')
    }

    function run (source) {
        const rom = c64.assembler.assemble(source)
        const cpu = c64.cpu.make({ programStart: 0x0600 })
        cpu.load(rom)
        cpu.run({ stopOpcode: 0x00 })

        return cpu.getState()
    }

    document.getElementById('run').addEventListener('click', () => {
        elements.out.value = ''
        const source = elements.in.value
        const state = run(source)
        elements.out.value = stringifyState(state)
    })

    elements.in.value = [
        'LDA #$c0',
        'TAX',
        'INX',
        'ADC #$c4',
        'BRK',
    ].join('\n')
})()
