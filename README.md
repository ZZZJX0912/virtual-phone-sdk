# virtual-phone-sdk
开发中…
一个提供录音、播放方法的小库


## 结构初设：
  - audioSource：**音频输入**
    - 振荡器
    - 流（录音流，文件流）
    - audio标签
    - 内存音频（audioBuffer）
  - audioEffects：**音频处理**
    - 滤波器
    - 平移
    - 混响
    - 压缩
    - 切片发送？（提供用户传入回调，WebSocket？其他协议？）
    - 可视化声音？（音频波纹）


## 待实现：
- 接入构建工具（webpack,vite,rollup）
- 支持转换多音频格式输出
- 支持音频导出
- 升级TS版本
- 单测
- 多音频源兼容（<audio>标签，振荡器，流（已完成））
- 多种效果节点（混响，滤波器，平移，压缩）
- 浏览器兼容性（渐进式 webkit前缀）
- 看得见的声音（波纹输出 提供ref挂载，图表样式选择）