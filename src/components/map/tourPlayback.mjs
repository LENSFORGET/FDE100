// A single media element keeps speech and the map on the same clock, including
// when the lazy-loaded map mounts after a click on the home page.
export function createTourPlayback({ tracks, createAudio, baseUrl = "./" }) {
  let state = { active: false, step: 0, language: "zh-CN", status: "idle" };
  let audio;
  let loadedLanguage;
  let pendingSeek = null;
  let wantsPlay = false;
  let request = 0;
  const listeners = new Set();
  const update = (patch) => {
    if (Object.entries(patch).every(([key, value]) => state[key] === value))
      return;
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  };
  const applySeek = () => {
    if (pendingSeek !== null && audio.readyState >= 1) {
      audio.currentTime = pendingSeek;
      pendingSeek = null;
    }
  };
  const syncStep = () => {
    if (!state.active || pendingSeek !== null) return;
    const cues = tracks[state.language].cues;
    let step = 0;
    while (step + 1 < cues.length && audio.currentTime >= cues[step + 1])
      step++;
    update({ step });
  };
  const fail = (error, attempt) => {
    if (attempt !== request || !state.active || !wantsPlay) return;
    wantsPlay = false;
    audio.pause();
    update({ status: error?.name === "NotAllowedError" ? "blocked" : "error" });
  };
  const play = () => {
    const attempt = ++request;
    wantsPlay = true;
    update({ status: "loading" });
    // Invoke play synchronously in the click handler to retain user activation
    // on Safari and mobile. Do not wait for metadata or the map's module.
    try {
      Promise.resolve(audio.play()).then(
        () => {
          if (attempt === request && wantsPlay) update({ status: "playing" });
        },
        (error) => fail(error, attempt),
      );
    } catch (error) {
      fail(error, attempt);
    }
  };
  const getAudio = () => {
    if (audio) return audio;
    audio = createAudio();
    audio.preload = "metadata";
    audio.addEventListener("loadedmetadata", applySeek);
    audio.addEventListener("timeupdate", syncStep);
    audio.addEventListener("seeking", syncStep);
    audio.addEventListener("playing", () => {
      if (state.active && wantsPlay && !audio.paused)
        update({ status: "playing" });
    });
    audio.addEventListener("waiting", () => {
      if (state.active && wantsPlay) update({ status: "loading" });
    });
    audio.addEventListener("pause", () => {
      if (state.active && wantsPlay && audio.paused && !audio.ended) {
        wantsPlay = false;
        request++;
        update({ status: "paused" });
      }
    });
    audio.addEventListener("ended", () => {
      if (!state.active || !audio.ended || pendingSeek !== null) return;
      wantsPlay = false;
      request++;
      update({ status: "ended", step: tracks[state.language].cues.length - 1 });
    });
    audio.addEventListener("error", () => {
      if (!state.active || !audio.error) return;
      wantsPlay = false;
      request++;
      update({ status: "error" });
    });
    return audio;
  };
  const load = (language, step, shouldPlay) => {
    const player = getAudio();
    wantsPlay = false;
    request++;
    player.pause();
    update({ active: true, language, step, status: "paused" });
    pendingSeek = tracks[language].cues[step];
    if (loadedLanguage !== language || player.error) {
      loadedLanguage = language;
      player.src = baseUrl + tracks[language].file;
      player.load();
    }
    applySeek();
    if (shouldPlay) play();
  };
  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => state,
    start() {
      load(state.language, 0, true);
    },
    toggle() {
      if (!state.active || state.status === "ended")
        load(state.language, 0, true);
      else if (wantsPlay) {
        wantsPlay = false;
        request++;
        audio.pause();
        update({ status: "paused" });
      } else if (audio.error) load(state.language, state.step, true);
      else play();
    },
    seek(step) {
      if (!state.active) return;
      const next = Math.max(
        0,
        Math.min(tracks[state.language].cues.length - 1, step),
      );
      load(state.language, next, wantsPlay);
    },
    setLanguage(language) {
      if (!(language in tracks) || language === state.language) return;
      if (state.active) load(language, state.step, wantsPlay);
      else update({ language });
    },
    stop() {
      wantsPlay = false;
      request++;
      pendingSeek = null;
      update({ active: false, step: 0, status: "idle" });
      audio?.pause();
    },
  };
}
