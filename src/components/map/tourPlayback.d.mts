export type TourLanguage = "zh-CN" | "en-US";
export type TourStatus =
  "idle" | "loading" | "playing" | "paused" | "ended" | "blocked" | "error";
export interface TourSnapshot {
  active: boolean;
  step: number;
  language: TourLanguage;
  status: TourStatus;
}
export function createTourPlayback(options: {
  tracks: Record<
    TourLanguage,
    { file: string; duration: number; cues: number[] }
  >;
  createAudio: () => HTMLAudioElement;
  baseUrl?: string;
}): {
  subscribe(listener: () => void): () => void;
  getSnapshot(): TourSnapshot;
  start(): void;
  toggle(): void;
  seek(step: number): void;
  setLanguage(language: TourLanguage): void;
  stop(): void;
};
