/**
   * 数据合并压缩
   * 根据输入和输出的采样率压缩数据，
   * 比如输入的采样率是48k的，我们需要的是（输出）的是16k的，由于48k与16k是3倍关系，
   * 所以输入数据中每隔3取1位
   *
   * @param {float32array} data       [-1, 1]的pcm数据
   * @param {number} inputSampleRate  输入采样率
   * @param {number} outputSampleRate 输出采样率
   * @returns  {float32array}         压缩处理后的二进制数据
   */
export const compress = (data, inputSampleRate, outputSampleRate = 8000)=>{
  // 压缩，根据采样率进行压缩
  //M:outputSampleRate
  //L:inputSampleRate
  //N:data.length
  //K = data.length / rate
  //Nk = rate * K = data.length
  //W1 = data.length - 1
  //W2 = 2 - data.length
  const rate = inputSampleRate / outputSampleRate;
  const compression = Math.max(rate, 1);
  const length = Math.floor(data.length / rate);
  const result = new Float32Array(length);
  let index = 0;
  let j = 0;

  // 循环间隔 compression 位取一位数据
  while (index < length) {
    // 取整是因为存在比例compression不是整数的情况
    const temp = Math.floor(j);
    result[index] = data[temp];
    index++;
    j += compression;
  }
  // 返回压缩后的一维数据
  return result;
}


/**
   * 转换到我们需要的对应格式的编码
   *
   * @param {float32array} bytes      pcm二进制数据
   * @param {number}  sampleBits      采样位数
   * @param {boolean} littleEdian     是否是小端字节序
   * @returns {ArrayBuffer}              pcm二进制数据
   */
export const encodeToPCM =(bytes, sampleBits, littleEdian = true)=>{
  let offset = 0;
  const dataLength = bytes.length * (sampleBits / 8);
  const buffer = new ArrayBuffer(dataLength);
  const data = new DataView(buffer);

  // 写入采样数据
  if (sampleBits === 8) {
    for (let i = 0; i < bytes.length; i++, offset++) {
      // 范围[-1, 1]
      const s = Math.max(-1, Math.min(1, bytes[i]));
      // 8位采样位划分成2^8=256份，它的范围是0-255;
      // 对于8位的话，负数*128，正数*127，然后整体向上平移128(+128)，即可得到[0,255]范围的数据。
      let val = s < 0 ? s * 128 : s * 127;
      val = +val + 128;
      data.setInt8(offset, val);
    }
  } else {
    for (let i = 0; i < bytes.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, bytes[i]));
      // 16位的划分的是2^16=65536份，范围是-32768到32767
      // 因为我们收集的数据范围在[-1,1]，那么你想转换成16位的话，只需要对负数*32768,对正数*32767,即可得到范围在[-32768,32767]的数据。
      data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, littleEdian);
    }
  }
  return data.buffer;
}
