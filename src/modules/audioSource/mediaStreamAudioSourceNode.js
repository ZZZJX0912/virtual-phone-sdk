/**
 * 调用录音功能，利用录音源作为音频源
 * @param {AudioContext} audioCtx webAudio实例
 * @param {Object} config 音频参数（采样率，声道）
 * @returns {MediaStreamAudioSourceNode} 录音音频源
 */
export const mediaStreamAudioSourceNode = async (audioCtx,config)=>{
  try {
    const mediaStream = await window.navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: { ideal: config.sampleRate }, // 采样率，支持 11025、16000、22050、24000、44100、48000
        channelCount: { exact: config.channelCount }, // 声道，支持 1 或 2
        echoCancellation: { exact: config.echoCancellation } //回音消除 默认true
      }
    });
    //创建录音源
    const recordAudioSource = audioCtx.createMediaStreamSource(mediaStream); //MediaStreamAudioSourceNode
    return recordAudioSource
  } catch (error) {
    console.error('创建音频源-音频流创建流程出现错误：', error);
  }
}
