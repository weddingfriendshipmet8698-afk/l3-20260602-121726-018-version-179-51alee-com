import { H as Hls } from './hls.js';

function initializePlayer(video) {
  var streamUrl = video.getAttribute('data-stream');

  if (!streamUrl) {
    return;
  }

  if (Hls && Hls.isSupported()) {
    var hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false
    });

    hls.loadSource(streamUrl);
    hls.attachMedia(video);

    hls.on(Hls.Events.ERROR, function (_, data) {
      if (!data || !data.fatal) {
        return;
      }

      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        hls.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        hls.recoverMediaError();
      } else {
        hls.destroy();
      }
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = streamUrl;
  }
}

document.querySelectorAll('video[data-stream]').forEach(function (video) {
  initializePlayer(video);
});

document.querySelectorAll('[data-play-target]').forEach(function (button) {
  button.addEventListener('click', function () {
    var id = button.getAttribute('data-play-target');
    var video = document.getElementById(id);

    if (!video) {
      return;
    }

    if (video.paused) {
      video.play();
      button.textContent = '暂停播放';
    } else {
      video.pause();
      button.textContent = '继续播放';
    }
  });
});
