import React, { useEffect, useMemo } from "react";
import { sample } from "lodash-es";
import { useTracksStore } from "../TracksStore";
import shallow from "zustand/shallow";
import { usePlayerStore } from "../PlayerStore";

export function useTrackListContainer(filterText: string) {
  const currentTrackId = usePlayerStore((state) => state.currentTrackId);
  const play = usePlayerStore((state) => state.play);

  const tracks = useTracksStore((state) => state.tracks);
  const fetchTracks = useTracksStore((state) => state.fetchTracks);
  const [fetchTracksState, fetchTracksErr] = useTracksStore(
    (state) => [state.fetchTracksState, state.rejectionReason],
    shallow
  );

  useEffect(() => {
    fetchTracks();
  }, []);

  function onTrackClick(trackId: string) {
    play(trackId);
  }

  function onRandomClick() {
    let track = sample(tracks);
    if (track) {
      play(track.id);
    }
  }

  const filteredTracks = React.useMemo(() => {
    if (!filterText) {
      return tracks;
    }

    return tracks.filter((track) =>
      track.name.toLocaleLowerCase().includes(filterText.toLocaleLowerCase())
    );
  }, [filterText, tracks]);

  return {
    currentTrackId,
    onTrackClick,
    onRandomClick,
    filteredTracks,
    activate: fetchTracksState,
    fetchTracksErr,
  };
}
