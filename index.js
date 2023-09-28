const createMemory = require("./create-memory");
const instructions = require("./instructions");
const CPU = require("./cpu.js");
const readline = require('readline')

const IP = 0;
const ACC = 1;
const R1 = 2;
const R2 = 3;

const memory = createMemory(256 * 256);
const writableBytes = new Uint8Array(memory.buffer);

const cpu = new CPU(memory);

let i = 0;

writableBytes[i++] = instructions.MOV_MEM_REG;
writableBytes[i++] = 0x01;
writableBytes[i++] = 0x00;
writableBytes[i++] = R1;

writableBytes[i++] = instructions.MOV_LIT_REG;
writableBytes[i++] = 0x00;
writableBytes[i++] = 0x01;
writableBytes[i++] = R2;

writableBytes[i++] = instructions.ADD_REGS;
writableBytes[i++] = R1;
writableBytes[i++] = R2;

writableBytes[i++] = instructions.MOV_REG_MEM;
writableBytes[i++] = ACC;
writableBytes[i++] = 0x01;
writableBytes[i++] = 0x00;

writableBytes[i++] = instructions.JUMP_NOT_EQ;
writableBytes[i++] = 0x00;
writableBytes[i++] = 0x03;
writableBytes[i++] = 0x00;
writableBytes[i++] = 0x00;

cpu.debug()
cpu.viewMem(cpu.getRegister('ip'))
cpu.viewMem(0x0100)

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

rl.on('line', ()=>{
    cpu.step()
    cpu.debug()
    cpu.viewMem(cpu.getRegister('ip'))
    cpu.viewMem(0x0100)
})

// writableBytes[i++] = instructions.MOV_LIT_REG;
// writableBytes[i++] = 0x34;
// writableBytes[i++] = 0x56;
// writableBytes[i++] = R1;

// writableBytes[i++] = instructions.MOV_LIT_REG;
// writableBytes[i++] = 0xab;
// writableBytes[i++] = 0xcd;
// writableBytes[i++] = R2;

// writableBytes[i++] = instructions.ADD_REGS;
// writableBytes[i++] = R1;
// writableBytes[i++] = R2;

// writableBytes[i++] = instructions.MOV_REG_MEM;
// writableBytes[i++] = ACC;
// writableBytes[i++] = 0x01;
// writableBytes[i++] = 0x00;

// cpu.debug();
// cpu.viewMem(cpu.getRegister("ip"));
// cpu.viewMem(0x0100);

// cpu.step();
// cpu.debug();
// cpu.viewMem(cpu.getRegister("ip"));
// cpu.viewMem(0x0100);

// cpu.step();
// cpu.debug();
// cpu.viewMem(cpu.getRegister("ip"));
// cpu.viewMem(0x0100);

// cpu.step();
// cpu.debug();
// cpu.viewMem(cpu.getRegister("ip"));
// cpu.viewMem(0x0100);

// cpu.step();
// cpu.debug();
// cpu.viewMem(cpu.getRegister("ip"));
// cpu.viewMem(0x0100);
