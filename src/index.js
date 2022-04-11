import { v4 as uuidv4 } from 'uuid';
export class vPhone {
  /**
   * 判断是否能够使用对应方法和Api
   */
  isSupported() {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    return (
      AudioContext && window.navigator && window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia
    );
  }
  constructor(vPhoneConfig) {
    if (!vPhone.isSupported()) {
      //兼容问题报错
      throw new Error('vPhone is not supported in this brower');
    }
    //唯一id(考虑使用在跨平台访问用于定位)
    this.id = `vphone-${uuidv4()}`;
    //全局参数
    this.settings = {};
    //audio实例
    this.audioCtx = null;
    //录音源实例
    this.recordSource = null;
    //音频源实例
    this.audioSource = null;
    //脚本节点（音频JS处理节点）
    this.scriptNode = null;
    //默认音频配置
    this.defaultAudioOption = {
      sampleRate: 8000, // 采样率，支持 11025、16000、22050、24000、44100、48000
      channelCount: 1, // 声道，支持 1 或 2
      echoCancellation: true, //回音消除 默认true
      splppingBufferSize: 8192, //分片大小, 256, 512, 1024, 2048, 4096, 8192, 16384
      numberOfInputChannels: 1, //输入声道,默认为1
      numberOfOutputChannels: 1, //输出声道,默认为1
      bitDepth: 16 //位深（采样率）
    };

    this.mergeConfig(vPhoneConfig);

    this.createAudioContext();
  }
  //获取audio实例
  get getAudioCtx() {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      this.createAudioContext();
    }
    return this.audioCtx;
  }
  //获取录音源实例
  get getRecordSource() {
    if (!this.recordSource) {
      this.initRecorder();
    }
    return this.recordSource;
  }

  //合并设定
  mergeConfig(insertOption) {
    this.settings = { ...this.defaultAudioOption, ...insertOption };
  }

  /**
   * 创建AudioContext实例
   * @returns audioContext实例
   */
  createAudioContext() {
    try {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
      this.audioCtx = new AudioContext();
    } catch (error) {
      console.error(error);
      // throw new Error('vPhone create audioContext error');
    }
  }
  
  //初始化录音器
  async initRecorder() {
    //参数合并
    try {
      const mediaStream = await window.navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: { ideal: this.settings.sampleRate }, // 采样率，支持 11025、16000、22050、24000、44100、48000
          channelCount: { exact: this.settings.channelCount }, // 声道，支持 1 或 2
          echoCancellation: { exact: this.settings.echoCancellation } //回音消除 默认true
        }
      });
      //创建录音源
      this.recordSource = this.getAudioCtx.createMediaStreamSource(mediaStream); //MediaStreamAudioSourceNode
      //创建脚本节点
      this.scriptNode = this.getAudioCtx.createScriptProcessor(
        //ScriptProcessorNode
        this.settings.splppingBufferSize,
        this.settings.numberOfInputChannels,
        this.settings.numberOfOutputChannels
      );
    } catch (error) {
      console.error('报错了！！', error);
    }
  }

  /**
   * 创建白噪音（为了解决苹果的自动播放问题，用于诱导客户点击授予权限）
   * @param option 空白音（白噪音）参数
   */
  emptyArray(option) {
    if (!this.getAudioCtx || this.getAudioCtx.state === 'closed') this.createAudioContext();
    const defaultOption = {
      numOfChannels: 1,
      length: 50,
      sampleRate: 8000
    };
    if (option) Object.assign(defaultOption, option);
    this.getAudioCtx.createBuffer(defaultOption.numOfChannels, defaultOption.length, defaultOption.sampleRate);
  }

  /**
   * 将ArrayBuffer转成audioBuffer
   * @param arrayBuffer 传入的加了WAV文件头信息后的ArrayBuffer二进制数组
   */
  async getData(arrayBuffer) {
    await this.getAudioCtx.decodeAudioData(arrayBuffer, (buffer) => {
      //将arrayBuffer(PCM)转audioBuffer
      this.audioBuffer = buffer;
    });
  }

  /**
   * 播放动作
   * @param time 播放的延迟时间
   */
  playSound(time = 0) {
    this.source = this.getAudioCtx.createBufferSource();
    this.source.buffer = this.audioBuffer;
    this.source.connect(this.getAudioCtx.destination);
    this.source.start(time);
  }

  /**
   * 引流获取数据 分片 解码 返回PCM流
   * @param outputSampleRate 输出采样率
   * @param bitDepth 采样数（位深）
   * @param littleEdian 是否为小尾端
   * @param callback 将pcm向页面抛出，做传输处理
   * @returns
   */
  getPerPCMData(outputSampleRate, bitDepth, littleEdian = true, callback) {
    //连接上，导流
    this.getRecordSource.connect(this.scriptNode);
    this.scriptNode.connect(this.getAudioCtx.destination);
    this.scriptNode.onaudioprocess = (e) => {
      const inputBuffer = e.inputBuffer;
      const inputFloat32Array = inputBuffer.getChannelData(0); //单声道处理
      //解析成我们要的PCM
      const compressFloat32Array = this.compress(inputFloat32Array, this.getAudioCtx.sampleRate, outputSampleRate);
      const pcm = this.encodeToPCM(compressFloat32Array, bitDepth, littleEdian);
      callback(pcm);
    };
  }

  /**
   * 松开录音按钮，将音频流断开节点处理
   */
  stopToGetData() {
    this.getRecordSource.disconnect(this.scriptNode);
    this.scriptNode.disconnect(this.getAudioCtx.destination);
  }

  /**
   * 退出连接后，销毁实例
   */
  async destroyAudioContext() {
    this.source?.stop();
    this.scriptNode = undefined;
    this.recordSource = undefined;
    await this.getAudioCtx.close();
    this.settings = this.defaultAudioOption;
  }
}
