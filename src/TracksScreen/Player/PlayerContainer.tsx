import React, { useEffect } from "react";
import { usePlayerStore } from "../PlayerStore";
import { useTracksStore } from "../TracksStore";
import { sample } from "lodash-es";

export function usePlayerContainer() {
  const currentTrackId = usePlayerStore((state) => state.currentTrackId);
  const playing = usePlayerStore((state) => state.playing);
  const play = usePlayerStore((state) => state.play);
  const tracks = useTracksStore((state) => state.tracks);
  const fetchTracksState = useTracksStore((state) => state.fetchTracksState);
  const findTrackById = useTracksStore((state) => state.findById);

  const currentTrack = currentTrackId ? findTrackById(currentTrackId) : null;
  const showPlayer =
    fetchTracksState !== "pending" &&
    tracks.length > 0 &&
    currentTrack &&
    playing;

  useEffect(() => {
    if (fetchTracksState === "resolved") {
      const track = sample(tracks);
      track && play(track.id);
    }
  }, [fetchTracksState]);

  return {
    currentTrack,
    showPlayer,
    playing,
    play,
  };
}
