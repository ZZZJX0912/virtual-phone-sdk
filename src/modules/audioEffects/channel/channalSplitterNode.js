/**
 * 用于分割声道，如果上游音源本来就是单声道音源，则分割出来的声道静默
 * 与channelMergerNode合并使用
 * @param {AudioContext} audioCtx webAudio实例
 * @param {Number} sliceNum 声道切割数量，不填默认为6
 * @returns ChannelSplitterNode
 * 注意！！！在connect的时候可以传入第二个参数（输出声道索引）和第三个参数（输入声道索引）实现个别声道的处理和声道交换扭转等操作
 */
export const channalSplitterNode = (audioCtx,sliceNum)=>{
  const splitter = audioCtx.createChannelSplitter(sliceNum)
  return splitter
}
