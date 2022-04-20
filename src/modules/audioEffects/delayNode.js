/**
 * 延迟节点（是否可以考虑做可视化拖拽延迟）
 * 延迟最大时间maxDelayTime可设置范围为 1~180 默认为1
 *
 * setDelayTime方法设置当前延迟的时间 默认为0
 */

export class delayNode{
  constructor(audioCtx,maxDelayTime){
    this.maxDelayTime = maxDelayTime
    this.delayNode = audioCtx.createDelay(maxDelayTime)
    return this.delayNode
  }

  setDelayTime(delayTime){
    if(delayTime > this.maxDelayTime){
      throw new Error('delayTime must be less than maxDelayTime')
    }else{
      this.delayNode.delayTime.value = delayTime
    }
  }
}
