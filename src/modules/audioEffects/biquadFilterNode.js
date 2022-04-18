/**
 * 滤波器（可用于除杂）
 * type：
 * 只考虑能否通过：
 * lowpass 设定低通截止频率 低于该频率的通过，高于该频率的衰减
 * highpass 设定高通截止频率 高于该频率的通过 低于改频率的衰减
 * bandpass 设定波段（范围） 在范围内的通过，范围外的衰减
 *
 * 考虑是否做处理
 * lowshelf 低架 低于设定值的，就架高，增加或衰弱低于设定值的频率（设定值+-）
 * highshelf 高架 高于设定值的，就架低一点，增加或衰弱高于设定值的频率（设定值+-）
 * peaking 范围
 *
 * notch  与bandpass相反，设定范围 在范围内的不通过，范围外的通过
 * allpass 没理解作用是啥
 */

export const biquadFilterNode = (audioCtx)=>{

}
