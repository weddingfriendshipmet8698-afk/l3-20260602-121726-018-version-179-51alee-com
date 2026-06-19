import { H as Hls } from './hls-vendor-dru42stk.js';

function setupPlayer() {
    var video = document.getElementById('movie-player');
    var button = document.querySelector('[data-play-button]');

    if (!video) {
        return;
    }

    var src = video.getAttribute('data-src');

    function loadSource() {
        if (!src || video.dataset.loaded === '1') {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.dataset.loaded = '1';
            return;
        }

        if (Hls && Hls.isSupported()) {
            var hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(src);
            hls.attachMedia(video);
            video.dataset.loaded = '1';
            return;
        }

        video.src = src;
        video.dataset.loaded = '1';
    }

    function playVideo() {
        loadSource();
        if (button) {
            button.classList.add('is-hidden');
        }
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {
                if (button) {
                    button.classList.remove('is-hidden');
                }
            });
        }
    }

    if (button) {
        button.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            playVideo();
        }
    });

    video.addEventListener('play', function () {
        if (button) {
            button.classList.add('is-hidden');
        }
    });

    video.addEventListener('pause', function () {
        if (button && video.currentTime === 0) {
            button.classList.remove('is-hidden');
        }
    });
}

setupPlayer();
