import React, { useEffect } from "react";
import { sample } from "lodash-es";
import { useTracksStore } from "../TracksStore";
import shallow from "zustand/shallow";
import { usePlayerStore } from "../PlayerStore";
import ReactGA from "react-ga";

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
  }, [fetchTracks]);

  function onTrackClick(trackId: string) {
    const track = tracks.find((t) => t.id === trackId);
    ReactGA.event({
      category: "User",
      action: "Track Click",
      label: track && track.name ? track.name : trackId,
    });
    play(trackId);
  }

  function onRandomClick() {
    ReactGA.event({
      category: "Action",
      action: "Play Random",
    });

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
