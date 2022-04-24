/**
 * 用于合并声道，如果上游音源本来就是单声道音源，则分割出来的声道静默
 * 与channelMergerNode合并使用
 * @param {AudioContext} audioCtx webAudio实例
 * @param {Number} mergeNum 合并声道数量
 * @returns channelMergerNode
 * 注意！！！在connect的时候可以传入第二个参数（输出声道索引）和第三个参数（输入声道索引）实现挑选声道合并等操作
 */
export const channelMergerNode = (audioCtx,mergeNum)=>{
  const channelMergerNode = audioCtx.createChannelMerger(mergeNum)
  return channelMergerNode
}
