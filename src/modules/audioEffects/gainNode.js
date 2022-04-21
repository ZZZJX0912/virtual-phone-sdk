
/**
 * 音量调节节点
 */
export class gainNode {
  constructor(audioCtx){
    this.audioCtx = audioCtx
    this.gainNode = audioCtx.createGain()
    this.curGain = this.gainNode.gain.val
  }

  gain(val,lower = false,startTime = 0){
    const newCurGain = this.curGain + (lower ? ~val+1 : val)
    this.gainNode.gain.setValueAtTime(newCurGain, this.audioCtx.currentTime + startTime)
  }
}
