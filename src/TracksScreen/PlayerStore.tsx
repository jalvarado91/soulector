import create from "zustand";

type PlayerStatus = "idle" | "playing";

type PlayerStore = {
  playing: boolean;
  currentTrackId?: string;
  play: (trackId: string) => void;
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
}));
