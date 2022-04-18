/**
 *
 * @param {AudioContext} audioCtx webAudio实例
 * @param {ArrayBuffer} mixinArrayBuffer 用于混响的数据（单声道，双声道）
 */
export const convolverNode = (audioCtx,mixinArrayBuffer)=>{
  const convolver = audioCtx.createConvolver();
  convolver.buffer = mixinArrayBuffer
  return convolver
}
