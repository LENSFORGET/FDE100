import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { createTourPlayback } from "../src/components/map/tourPlayback.mjs";

const tracks = JSON.parse(
  readFileSync(new URL("../src/data/tour-audio.json", import.meta.url)),
);
const scripts = JSON.parse(
  readFileSync(new URL("../src/data/tour-script.json", import.meta.url)),
);

class AudioStub extends EventTarget {
  readyState = 0;
  paused = true;
  ended = false;
  error = null;
  time = 0;
  playCalls = 0;
  nextPlay = null;
  get currentTime() {
    return this.time;
  }
  set currentTime(value) {
    this.time = value;
    this.ended = false;
  }
  load() {
    this.readyState = 0;
    this.currentTime = 0;
    this.error = null;
  }
  metadata() {
    this.readyState = 4;
    this.dispatchEvent(new Event("loadedmetadata"));
  }
  play() {
    this.paused = false;
    this.playCalls++;
    const result = this.nextPlay || Promise.resolve();
    this.nextPlay = null;
    return result;
  }
  pause() {
    this.paused = true;
    this.dispatchEvent(new Event("pause"));
  }
  advance(time) {
    this.currentTime = time;
    this.dispatchEvent(new Event("timeupdate"));
  }
}
function setup() {
  const audio = new AudioStub();
  const playback = createTourPlayback({
    tracks,
    createAudio: () => audio,
    baseUrl: "/FDE100/",
  });
  return { audio, playback, state: playback.getSnapshot };
}
const flush = () => new Promise((resolve) => queueMicrotask(resolve));

test("both female editions have eight valid cues, assets, and unchanged Chinese copy", () => {
  const source = readFileSync(
    new URL("../src/components/map/mapData.ts", import.meta.url),
    "utf8",
  );
  for (const [language, track] of Object.entries(tracks)) {
    assert.equal(track.cues.length, 8);
    assert.equal(scripts[language].steps.length, 8);
    assert.equal(track.cues[0], 0);
    assert.ok(track.duration >= 55 && track.duration <= 65);
    track.cues.forEach((cue, i) => {
      assert.ok(cue >= 0 && cue < track.duration);
      if (i) assert.ok(cue > track.cues[i - 1]);
    });
    assert.ok(
      statSync(new URL(`../public/${track.file}`, import.meta.url)).size >
        100000,
    );
  }
  scripts["zh-CN"].steps.forEach(({ title, text }) => {
    assert.ok(source.includes(`title: "${title}"`));
    assert.ok(source.includes(`text: "${text}"`));
  });
});

test("a click starts Chinese media immediately and audio time drives the map", async () => {
  const { playback, audio, state } = setup();
  playback.start();
  assert.equal(
    audio.playCalls,
    1,
    "play must run synchronously before lazy navigation",
  );
  assert.equal(audio.src, `/FDE100/${tracks["zh-CN"].file}`);
  audio.metadata();
  await flush();
  assert.equal(state().status, "playing");
  audio.advance(tracks["zh-CN"].cues[2] - 0.01);
  assert.equal(state().step, 1);
  audio.advance(tracks["zh-CN"].cues[2]);
  assert.equal(state().step, 2);
  playback.toggle();
  assert.equal(state().status, "paused");
  assert.equal(audio.paused, true);
  playback.toggle();
  await flush();
  assert.equal(
    audio.currentTime,
    tracks["zh-CN"].cues[2],
    "resume keeps the exact position",
  );
  assert.equal(state().status, "playing");
});

test("language changes keep the current step, wait for metadata, and preserve pause", async () => {
  const { playback, audio, state } = setup();
  playback.start();
  audio.metadata();
  await flush();
  playback.seek(4);
  await flush();
  playback.setLanguage("en-US");
  audio.dispatchEvent(new Event("timeupdate"));
  assert.equal(
    state().step,
    4,
    "a new source at time zero must not rewind the map",
  );
  audio.metadata();
  await flush();
  assert.equal(audio.currentTime, tracks["en-US"].cues[4]);
  assert.equal(state().status, "playing");
  playback.toggle();
  playback.setLanguage("zh-CN");
  audio.metadata();
  assert.equal(state().step, 4);
  assert.equal(state().status, "paused");
  assert.equal(audio.paused, true);
  assert.equal(audio.currentTime, tracks["zh-CN"].cues[4]);
});

test("step navigation preserves pause and the final step resumes before replaying", async () => {
  const { playback, audio, state } = setup();
  playback.start();
  audio.metadata();
  await flush();
  playback.toggle();
  playback.seek(99);
  assert.equal(state().step, 7);
  assert.equal(audio.paused, true);
  playback.toggle();
  await flush();
  assert.equal(audio.currentTime, tracks["zh-CN"].cues[7]);
  audio.ended = true;
  audio.paused = true;
  audio.dispatchEvent(new Event("ended"));
  assert.equal(state().status, "ended");
  playback.toggle();
  await flush();
  assert.equal(state().step, 0);
  assert.equal(audio.currentTime, 0);
  assert.equal(state().status, "playing");
});

test("blocked autoplay offers a working retry instead of advancing silently", async () => {
  const { playback, audio, state } = setup();
  audio.nextPlay = Promise.reject(
    new DOMException("Needs a gesture", "NotAllowedError"),
  );
  playback.start();
  audio.metadata();
  await flush();
  assert.equal(state().status, "blocked");
  assert.equal(state().step, 0);
  assert.equal(audio.paused, true);
  playback.toggle();
  await flush();
  assert.equal(state().status, "playing");
});

test("late play rejections cannot interrupt a new language or restart an exited tour", async () => {
  const { playback, audio, state } = setup();
  let reject;
  audio.nextPlay = new Promise((_, fail) => {
    reject = fail;
  });
  playback.start();
  playback.setLanguage("en-US");
  audio.metadata();
  await flush();
  reject(new DOMException("Source changed", "AbortError"));
  await flush();
  assert.equal(state().status, "playing");
  let resolve;
  playback.toggle();
  audio.nextPlay = new Promise((done) => {
    resolve = done;
  });
  playback.toggle();
  playback.stop();
  resolve();
  await flush();
  assert.equal(state().active, false);
  assert.equal(state().status, "idle");
  assert.equal(audio.paused, true);
});

test("a failed audio source can be reloaded and retried at the same step", async () => {
  const { playback, audio, state } = setup();
  playback.start();
  audio.metadata();
  await flush();
  playback.seek(3);
  await flush();
  audio.error = { code: 2 };
  audio.paused = true;
  audio.dispatchEvent(new Event("error"));
  assert.equal(state().status, "error");
  playback.toggle();
  audio.metadata();
  await flush();
  assert.equal(audio.error, null);
  assert.equal(state().status, "playing");
  assert.equal(audio.currentTime, tracks["zh-CN"].cues[3]);
});
