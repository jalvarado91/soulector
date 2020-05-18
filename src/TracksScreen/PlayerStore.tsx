import create from "zustand";

type PlayerStatus = "idle" | "playing";

export type PlayerStore = {
  playing: boolean;
  volume: number;
  currentTrackId?: string;
  play: (trackId: string) => void;
  pause: () => void;
  resume: () => void;
  setVolume: (vol: number) => void;
  muted: boolean;
  mute: () => void;
  unmute: () => void;
  lastVol: number;
};

export const [usePlayerStore] = create<PlayerStore>((set, get) => ({
  playing: false,
  muted: false,
  currentTrackId: undefined,
  volume: 80,
  lastVol: 80,
  play(trackId: string) {
    set({
      playing: true,
      currentTrackId: trackId,
    });
  },
  pause() {
    set({
      playing: false,
    });
  },
  resume() {
    set({
      playing: true,
    });
  },
  setVolume(vol: number) {
    set({
      volume: vol,
    });
  },
  mute() {
    set({
      lastVol: get().volume,
      volume: 0,
      muted: true,
    });
  },
  unmute() {
    set({
      lastVol: 80,
      volume: get().lastVol,
      muted: false,
    });
  },
}));
