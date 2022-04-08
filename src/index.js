export class vPhone {
  constructor(){
      /**
   * 判断是否能够使用对应方法和Api
   */
  isSupported() {
    const AudioContext=window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    return (
      AudioContext && window.navigator && window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia
    );
  }
  }
}