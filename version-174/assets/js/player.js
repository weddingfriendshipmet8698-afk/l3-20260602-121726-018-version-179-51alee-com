import { H as Hls } from './hls.js';

function bindPlayer(player) {
  const video = player.querySelector('video');
  const button = player.querySelector('[data-play-button]');
  const status = player.querySelector('[data-player-status]');
  const stage = player.querySelector('.player-stage');
  let loaded = false;
  let hls = null;

  if (!video || !button) {
    return;
  }

  function setStatus(text) {
    if (status) {
      status.textContent = text;
    }
  }

  function loadSource() {
    const source = video.dataset.src;

    if (!source) {
      setStatus('当前影片正在准备播放源');
      return Promise.resolve();
    }

    if (loaded) {
      return Promise.resolve();
    }

    loaded = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      setStatus('播放源已载入');
      return Promise.resolve();
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        setStatus('播放源已载入');
      });
      hls.on(Hls.Events.ERROR, function (_, data) {
        if (data && data.fatal) {
          setStatus('播放连接暂时不可用');
        }
      });
      return Promise.resolve();
    }

    video.src = source;
    setStatus('播放源已载入');
    return Promise.resolve();
  }

  function startPlay() {
    loadSource().then(function () {
      const playTask = video.play();

      if (playTask && typeof playTask.then === 'function') {
        playTask.then(function () {
          if (stage) {
            stage.classList.add('is-playing');
          }
          setStatus('正在播放');
        }).catch(function () {
          setStatus('点击视频区域继续播放');
        });
      }
    });
  }

  button.addEventListener('click', startPlay);
  video.addEventListener('click', function () {
    if (video.paused) {
      startPlay();
    } else {
      video.pause();
      if (stage) {
        stage.classList.remove('is-playing');
      }
      setStatus('已暂停');
    }
  });
  video.addEventListener('play', function () {
    if (stage) {
      stage.classList.add('is-playing');
    }
  });
  video.addEventListener('pause', function () {
    if (stage) {
      stage.classList.remove('is-playing');
    }
  });
  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
    }
  });
}

Array.from(document.querySelectorAll('[data-player]')).forEach(bindPlayer);
