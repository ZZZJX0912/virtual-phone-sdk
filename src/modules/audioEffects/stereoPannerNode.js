/**
 * 移动双声道声音位置
 * 考虑配合滑轨可视化调整
 */
export class stereoPannerNode{
  constructor(audioCtx){
    //TODO: 判断上游声源声道如果不是双声道的抛出警告
    this.panNode = audioCtx.createStereoPanner()
  }

  // val范围 （左声道） -1 ~ 1 （右声道）
  movePan(val){
    this.panNode.pan.setValueAtTime(val)
  }
}
