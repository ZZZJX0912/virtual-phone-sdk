
/**
 * 使用audio标签作为音频源
 * 可使用在不兼容HTML5的audio标签播放场景
 * @param {AudioContext} audioCtx webAudio实例
 * @param {Element} audioEle audio标签元素
 * @returns {MediaElementAudioSourceNode}audio标签的音频源
 */
export const mediaElementAudioSourceNode = (audioCtx,audioEle)=>{
  const audioElemSource = audioCtx.createMediaElementSource(audioEle)
  return audioElemSource
}
