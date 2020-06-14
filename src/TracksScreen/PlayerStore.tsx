import create from "zustand";
import { clamp } from "../helpers";

type PlayerStatus = "idle" | "playing";

export type PlayerStore = {
  playing: boolean;
  volume: number;
  currentTrackId?: string;
  play: (trackId: string) => void;
  pause: () => void;
  resume: () => void;
  setVolume: (vol: number) => void;
  volumeUp: () => void;
  volumeDown: () => void;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => void;
  lastVol: number;
};

export const [usePlayerStore] = create<PlayerStore>((set, get) => ({
  playing: false,
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
      volume: clamp(vol, 0, 100),
    });
  },
  volumeUp() {
    set({
      volume: get().volume + 10,
    });
  },
  volumeDown() {
    set({
      volume: get().volume - 10,
    });
  },
  mute() {
    set({
      lastVol: get().volume,
      volume: 0,
    });
  },
  unmute() {
    set({
      lastVol: 80,
      volume: get().lastVol,
    });
  },
  toggleMute() {
    const muted = playerStoreSelectors.muted(get());
    if (muted) {
      get().unmute();
    } else {
      get().mute();
    }
  },
}));

export type PlayerStoreSelectors = typeof playerStoreSelectors;

export const playerStoreSelectors = {
  muted: (state: PlayerStore) => state.volume <= 0,
  playerState: (state: PlayerStore) => {
    if (!state.playing && state.currentTrackId) {
      return "paused";
    }

    if (!state.playing && !state.currentTrackId) {
      return "idle";
    }

    return "playing";
  },
};
