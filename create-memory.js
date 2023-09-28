function createMemory(sizeBytes){
    const ab = new ArrayBuffer(sizeBytes);
    const dv = new DataView(ab)
    // console.log(dv)
    return dv
}


module.exports = createMemory