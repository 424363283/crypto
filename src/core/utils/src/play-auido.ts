export function playAudio(src: string) {
    // 初始化Aduio
    var audio = new Audio();
    var playPromise;
    audio.src = src;
    playPromise = audio.play();
  
    // if (playPromise) {
    //   playPromise
    //     .then(() => {
    //      // 音频加载成功
    //       setTimeout(() => {}, audio.duration * 1000); // audio.duration 为音频的时长单位为秒
    //     })
    //     .catch((e) => {});
    // }
  }
  