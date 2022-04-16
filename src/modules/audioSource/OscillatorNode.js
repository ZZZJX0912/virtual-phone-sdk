/**
 *
 * @param {AudioContext} audioCtx webAudio实例
 * @param {Object} oscillatorNodeConfig 对应振荡器配置对象
 * @returns
 */
//振荡器节点
export const OscillatorNode=(audioCtx,oscillatorNodeConfig)=>{
  const defaultConfig = {
    frequency:440, //振动的频率 默认是440Hz
    detune:0, //振动的音高微调
    type:sine, //决定节点播放声音的周期波形，不同的波形可以产生不同的声调。 基础值有 "sine", "square", "sawtooth","triangle" and "custom". 默认值是"sine"。
  }
  const config = {...defaultConfig,...oscillatorNodeConfig}
  //创建oscillator（振荡器）
  const oscillator = audioCtx.createOscillator();
  oscillator.type = config.type;
  oscillator.frequency.value = config.frequency
  oscillator.detune.value = config.detune

  return oscillator
}
