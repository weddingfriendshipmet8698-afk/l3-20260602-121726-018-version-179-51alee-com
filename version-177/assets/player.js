(function () {
  function loadWithNative(video, source) {
    video.src = source;
    return video.play();
  }

  function loadWithHls(video, source) {
    return import('./hls-vendor.js').then(function (module) {
      var Hls = module.H;
      if (!Hls || !Hls.isSupported()) {
        return loadWithNative(video, source);
      }
      var hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(source);
      hls.attachMedia(video);
      return new Promise(function (resolve) {
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          resolve(video.play());
        });
      });
    }).catch(function () {
      return loadWithNative(video, source);
    });
  }

  function setupPlayer(card) {
    var video = card.querySelector('[data-player]');
    var button = card.querySelector('[data-play-button]');
    if (!video || !button) {
      return;
    }

    var started = false;
    var source = video.getAttribute('data-src');

    function start() {
      if (!source) {
        return;
      }
      card.classList.add('playing');
      if (started) {
        video.play();
        return;
      }
      started = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        loadWithNative(video, source);
      } else {
        loadWithHls(video, source);
      }
    }

    button.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (!started) {
        start();
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player-card]')).forEach(setupPlayer);
})();
