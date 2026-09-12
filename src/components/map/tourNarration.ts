import tracks from "../../data/tour-audio.json";
import { createTourPlayback } from "./tourPlayback.mjs";

export const tourNarration = createTourPlayback({
  tracks,
  baseUrl: import.meta.env.BASE_URL,
  createAudio() {
    const audio = document.createElement("audio");
    audio.hidden = true;
    audio.dataset.tourNarration = "true";
    document.body.append(audio);
    return audio;
  },
});
