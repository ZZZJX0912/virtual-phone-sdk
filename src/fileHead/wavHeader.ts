interface audioSetting {
  samples: ArrayBuffer;
  sampleRateTmp: number;
  sampleBits: number;
  channelCount: number;
}

interface writeStringSetting {
  view: DataView;
  offset: number;
  string: string;
}

interface floatTo32BitPCMSetting {
  output: DataView;
  input: any;
}

interface floatTo16BitPCMSetting {
  output: DataView;
  input: any;
}

interface floatTo8BitPCMSetting {
  output: DataView;
  input: any;
}
//arrayBuffer格式 转 wav格式
export function addWavHeader({ samples, sampleRateTmp, sampleBits, channelCount }: audioSetting) {
  const dataLength = samples.byteLength;
  /* 新的buffer类，预留44bytes的heaer空间 */
  const buffer = new ArrayBuffer(44 + dataLength);
  /* 转为 Dataview, 利用API来填充字节 */
  const view = new DataView(buffer);
  const writeString = function ({ view, offset, string }: writeStringSetting) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  let offset = 0;
  /* ChunkID, 4 bytes,  资源交换文件标识符 */
  writeString({ view, offset, string: 'RIFF' });
  offset += 4;
  /* ChunkSize, 4 bytes, 下个地址开始到文件尾总字节数,即文件大小-8 */
  view.setUint32(offset, /* 32 */ 36 + dataLength, true);
  offset += 4;
  /* Format, 4 bytes, WAV文件标志 */
  writeString({ view, offset, string: 'WAVE' });
  offset += 4;
  /* Subchunk1 ID, 4 bytes, 波形格式标志 */
  writeString({ view, offset, string: 'fmt ' });
  offset += 4;
  /* Subchunk1 Size, 4 bytes, 过滤字节,一般为 0x10 = 16 */
  view.setUint32(offset, 16, true);
  offset += 4;
  /* Audio Format, 2 bytes, 格式类别 (PCM形式采样数据) */
  view.setUint16(offset, 1, true);
  offset += 2;
  /* Num Channels, 2 bytes,  通道数 */
  view.setUint16(offset, channelCount, true);
  offset += 2;
  /* SampleRate, 4 bytes, 采样率,每秒样本数,表示每个通道的播放速度 */
  view.setUint32(offset, sampleRateTmp, true);
  offset += 4;
  /* ByteRate, 4 bytes, 波形数据传输率 (每秒平均字节数) 通道数×每秒数据位数×每样本数据位/8 */
  view.setUint32(offset, sampleRateTmp * channelCount * (sampleBits / 8), true);
  offset += 4;
  /* BlockAlign, 2 bytes, 快数据调整数 采样一次占用字节数 通道数×每样本的数据位数/8 */
  view.setUint16(offset, channelCount * (sampleBits / 8), true);
  offset += 2;
  /* BitsPerSample, 2 bytes, 每样本数据位数 */
  view.setUint16(offset, sampleBits, true);
  offset += 2;
  /* Subchunk2 ID, 4 bytes, 数据标识符 */
  writeString({ view, offset, string: 'data' });
  offset += 4;
  /* Subchunk2 Size, 4 bytes, 采样数据总数,即数据总大小-44 */
  view.setUint32(offset, dataLength, true);
  offset += 4;
  const floatTo32BitPCM = function ({ output, input }: floatTo32BitPCMSetting) {
    const oinput = new Int32Array(input);
    let newoffset = 44;
    for (let i = 0; i < oinput.length; i += 1, newoffset += 4) {
      output.setInt32(newoffset, oinput[i], true);
    }
  };
  const floatTo16BitPCM = function ({ output, input }: floatTo16BitPCMSetting) {
    const oinput = new Int16Array(input);
    let newoffset = 44;
    for (let i = 0; i < oinput.length; i += 1, newoffset += 2) {
      output.setInt16(newoffset, oinput[i], true);
    }
  };
  const floatTo8BitPCM = function ({ output, input }: floatTo8BitPCMSetting) {
    const oinput = new Int8Array(input);
    let newoffset = 44;
    for (let i = 0; i < oinput.length; i += 1, newoffset += 1) {
      output.setInt8(newoffset, oinput[i]);
    }
  };

  if (sampleBits === 16) {
    floatTo16BitPCM({ output: view, input: samples });
  } else if (sampleBits === 8) {
    floatTo8BitPCM({ output: view, input: samples });
  } else {
    floatTo32BitPCM({ output: view, input: samples });
  }
  return new Blob([view], { type: 'audio/wav' });
}
