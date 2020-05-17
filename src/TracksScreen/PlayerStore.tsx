import create from "zustand";

type PlayerStatus = "idle" | "playing";

export type PlayerStore = {
  playing: boolean;
  currentTrackId?: string;
  play: (trackId: string) => void;
  pause: () => void;
  resume: () => void;
};

export const [usePlayerStore] = create<PlayerStore>((set, get) => ({
  playing: false,
  currentTrackId: undefined,
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
}));
