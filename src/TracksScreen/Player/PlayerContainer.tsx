import React from "react";
import { usePlayerStore } from "../PlayerStore";
import { useTracksStore } from "../TracksStore";

export function usePlayerContainer() {
  const currentTrackId = usePlayerStore((state) => state.currentTrackId);
  const playing = usePlayerStore((state) => state.playing);
  const tracks = useTracksStore((state) => state.tracks);
  const fetchTracksState = useTracksStore((state) => state.fetchTracksState);
  const findTrackById = useTracksStore((state) => state.findById);

  const currentTrack = currentTrackId ? findTrackById(currentTrackId) : null;
  const showPlayer =
    fetchTracksState !== "pending" &&
    tracks.length > 0 &&
    currentTrack &&
    playing;

  return {
    currentTrack,
    showPlayer,
  };
}
