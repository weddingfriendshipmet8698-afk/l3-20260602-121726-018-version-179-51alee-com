const player = document.querySelector("[data-player]");

if (player) {
  const video = player.querySelector("video");
  const button = player.querySelector(".play-overlay");
  const videoUrl = video ? video.dataset.video : "";
  let ready = false;

  const loadHls = () => new Promise((resolve) => {
    if (window.Hls) {
      resolve();
      return;
    }

    const existing = document.querySelector("script[data-hls-loader]");
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => resolve(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js";
    script.async = true;
    script.dataset.hlsLoader = "true";
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => resolve(), { once: true });
    document.head.appendChild(script);
  });

  const attach = () => {
    if (!video || !videoUrl || ready) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      ready = true;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      ready = true;
    }
  };

  const play = async () => {
    if (!video) return;
    if (!ready && !video.canPlayType("application/vnd.apple.mpegurl")) {
      await loadHls();
    }
    attach();
    try {
      await video.play();
      if (button) button.classList.add("hide");
    } catch (error) {
      if (button) button.classList.remove("hide");
    }
  };

  if (button) button.addEventListener("click", play);
  if (video) {
    video.addEventListener("click", play);
    video.addEventListener("play", () => button && button.classList.add("hide"));
    video.addEventListener("pause", () => button && button.classList.remove("hide"));
  }
}
