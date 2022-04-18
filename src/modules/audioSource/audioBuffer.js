/**
 * 将ArrayBuffer转成AudioBuffer充当音频源
 * @param {AudioContext} audioCtx webAudio实例
 * @param {ArrayBuffer} arrayBuffer 传入作为音频源的arrayBuffer流
 * @return {AudioBuffer}
 */
export const audioBuffer = (audioCtx,arrayBuffer)=>{
  let audioBuffer
  await audioCtx.decodeAudioData(arrayBuffer, (buffer) => {
    //将arrayBuffer(PCM)转audioBuffer
    audioBuffer = buffer;
  });
  return audioBuffer
}
