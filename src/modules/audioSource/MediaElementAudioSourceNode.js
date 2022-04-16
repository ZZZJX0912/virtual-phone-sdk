
/**
 * 可使用在不兼容HTML5的audio标签播放场景
 * @param {AudioContext} audioCtx webAudio实例
 * @param {Element} audioEle audio标签元素
 * @returns {MediaElementAudioSourceNode}audio标签的音频源
 */
export const MediaElementAudioSourceNode = (audioCtx,audioEle)=>{
  const audioElemSource = audioCtx.MediaElementAudioSourceNode(audioEle)
  return audioElemSource
}
