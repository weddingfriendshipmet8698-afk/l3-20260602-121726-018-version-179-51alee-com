import { H as Hls } from './hls-vendor.js';

const players = document.querySelectorAll('[data-player]');

players.forEach((player) => {
  const video = player.querySelector('video');
  const cover = player.querySelector('[data-player-cover]');
  const button = player.querySelector('[data-play-button]');
  const message = player.querySelector('[data-player-message]');
  const stream = player.getAttribute('data-stream');
  let loaded = false;
  let hls = null;

  const showMessage = (text) => {
    if (!message) {
      return;
    }
    message.textContent = text;
    message.classList.add('active');
  };

  const loadStream = () => {
    if (!video || !stream || loaded) {
      return;
    }
    loaded = true;
    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          showMessage('视频暂时无法播放');
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
    } else {
      showMessage('视频暂时无法播放');
    }
  };

  const start = () => {
    loadStream();
    if (cover) {
      cover.classList.add('hidden');
    }
    const playResult = video.play();
    if (playResult && typeof playResult.catch === 'function') {
      playResult.catch(function () {
        showMessage('点击视频继续播放');
      });
    }
  };

  if (cover) {
    cover.addEventListener('click', start);
  }
  if (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      start();
    });
  }
  if (video) {
    video.addEventListener('click', function () {
      if (!loaded) {
        start();
      }
    });
  }
  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
});
