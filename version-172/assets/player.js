import { H as Hls } from './hls.js';

(function () {
  var box = document.querySelector('.video-box[data-source]');
  if (!box) {
    return;
  }

  var video = box.querySelector('video');
  var button = box.querySelector('#playerStart');
  var source = box.getAttribute('data-source');
  var loaded = false;
  var hls = null;

  function bindSource() {
    if (loaded || !video || !source) {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
    loaded = true;
  }

  function startPlay() {
    bindSource();
    if (button) {
      button.classList.add('is-hidden');
    }
    video.setAttribute('controls', 'controls');
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  if (button) {
    button.addEventListener('click', startPlay);
  }
  if (video) {
    video.addEventListener('click', function () {
      if (!loaded || video.paused) {
        startPlay();
      }
    });
  }
  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
    }
  });
})();
