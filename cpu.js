const createMemory = require("./create-memory.js");
const instructions = require("./instructions.js");

class CPU {
  constructor(memory) {
    this.memory = memory;

    this.registerNames = [
      "ip",
      "acc",
      "r1",
      "r2",
      "r3",
      "r4",
      "r5",
      "r6",
      "r7",
      "r8",
    ];

    this.registers = createMemory(this.registerNames.length * 2); //each register needs to be 16-bit i.e 2 bytes therefore multiply register.length by 2 as the createMemory function requires memory in bytes not bits.

    this.registerMap = this.registerNames.reduce((map, name, index) => {
      map[name] = index * 2;
      return map;
    }, {}); //creating a key in map object as "name" and setting the value as index*2
  }

  debug() {
    this.registerNames.forEach((name) => {
      console.log(
        `${name}: 0x${this.getRegister(name).toString(16).padStart(4, "0")}`
      );
    });
    console.log();
  }

  viewMem(address) {
    const nextEightBytes = Array.from({ length: 8 }, (_, i) =>
      this.memory.getUint8(address + i)
    ).map((v) => `0x${v.toString(16).padStart(2, "0")}`);

    console.log(
      `0x${address.toString(16).padStart(4, "0")}: ${nextEightBytes.join(
        " "
      )}\n`
    );
  }

  getRegister(name) {
    if (!name in this.registerMap) {
      throw new Error(`Invalid register ${name}`);
    }
    return this.registers.getUint16(this.registerMap[name]);
  } //just gets the register from it's name

  setRegister(name, value) {
    if (!name in this.registerMap) {
      throw new Error(`Invalid register ${name}`);
    }

    return this.registers.setUint16(this.registerMap[name], value);
  } //sets regitster value to whatever value we pass.

  fetch() {
    const nextInstructionAdd = this.getRegister("ip");
    const instruction = this.memory.getUint8(nextInstructionAdd);
    this.setRegister("ip", nextInstructionAdd + 1);
    return instruction;
  } //gets the current instruction using 'ip' method & then move the instruction pointer i.e. 'ip' by 1 byte

  fetch16() {
    const nextInstructionAdd = this.getRegister("ip");
    const instruction = this.memory.getUint16(nextInstructionAdd);
    this.setRegister("ip", nextInstructionAdd + 2);
    return instruction;
  } //gets the current instruction using 'ip' method & then move the instruction pointer i.e. 'ip' by 2 byte

  execute(instruction) {
    switch (instruction) {
      case instructions.MOV_LIT_REG: {
        const literal = this.fetch16();
        const register = (this.fetch() % this.registerNames.length) * 2;
        this.registers.setUint16(register, literal);
        return;
      }

      case instructions.MOV_REG_REG: {
        const registerFrom = (this.fetch() % this.registerNames.length) * 2;
        const registerTo = (this.fetch() % this.registerNames.length) * 2;
        const value = this.registers.getUint16(registerFrom);
        this.registers.setUint16(registerTo, value);
        return;
      }

      case instructions.MOV_REG_MEM: {
        const register = (this.fetch() % this.registerNames.length) * 2;
        const address = this.fetch16();
        const value = this.registers.getUint16(register);
        this.memory.setUint16(address, value);
        return;
      }

      case instructions.MOV_MEM_REG: {
        const address = this.fetch16();
        const register = (this.fetch() % this.registerNames.length) * 2;
        const value = this.memory.getUint16(address);
        this.registers.setUint16(register, value);
        return;
      }

      case instructions.JUMP_NOT_EQ: {
        const value = this.fetch16();
        const address = this.fetch16();
        const acc_reg = this.getRegister("acc");

        if (value !== acc_reg) {
          this.setRegister("ip", address);
        }

        return;
      }

      case instructions.ADD_REGS: {
        const r1 = this.fetch();
        const r2 = this.fetch();
        const r1Val = this.registers.getUint16(r1 * 2);
        const r2Val = this.registers.getUint16(r2 * 2);
        this.setRegister("acc", r1Val + r2Val);
        return;
      }
    }
  }

  step() {
    const instruction = this.fetch();
    return this.execute(instruction);
  }
}

module.exports = CPU;
